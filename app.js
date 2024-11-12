import http from "http";
import express from "express";
import { WebSocketServer ,WebSocket} from "ws";
// import {client} from "websocket";
// const client = require('websocket').client
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import {
  COOKIE_SIGNING_SECRET,
  PORT,
  CRYPTO_ID,
  format_prc,
} from "./Constants/API_DB_Constants.js";
import { connectBinance, connectLocalWSS } from "./crypto-prices-client.js";
import nocache from 'nocache';
//-------------------------------------

const app = express();
app.use(cors());
app.use(nocache());// prevent cache is very important
// Use cookie-parser middleware
app.use(cookieParser(COOKIE_SIGNING_SECRET));

//----------- data type options ------------
app.use(express.json({ type: "application/json"}));
app.use(express.urlencoded({ extended: true }));
//----------- serve statics --------
//-------------------
//[important for serve static __dirname in ES Module]
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//-------------------
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));
//---------------- set view engine ------------------
app.set("view engine", "ejs");
app.set("views", "views"); // default folder name is 'views'
//---------------------------------------------------

/*############################[ ws server ]#################################*/

app.server = http.createServer(app); // to be listen on
app.wss = new WebSocketServer({ server: app.server }); // [ server: http|https OR port: Number OR noServer:Bool ]

app.wss.on("connection", (ws, req) => {
    let conn_id = req.url.replace("/?id=", "");
    
  if (conn_id && conn_id == CRYPTO_ID) {
    ws.on("message", async (msg) => {
      let cur = JSON.parse(msg);

      let symbol = cur.data.k.s,
        c_price = cur.data.k.c;

      let f_p = await format_prc(c_price,symbol);

      let data_to_send = {
        s: symbol,
        c: f_p,
      };

      //----- broadcast -------
      app.wss.clients.forEach(function each(client) {
        if (client !== ws) {
          client.send(JSON.stringify(data_to_send));
        }
      })
      //-----------------------

    });

    ws.on("close", () => {
      console.log(`crypto-prices client is disconnected`);
    });
  }
});

/*########################[ Routes ]############################*/

import homeRouter from "./resources/home/home.router.js";
import authRouter from "./resources/auth/auth.router.js";
import otpRouter from "./resources/otp/otp.router.js";
import withdrawRouter from "./resources/withdraw/withdraw.router.js";
import depositRouter from "./resources/deposit/deposit.router.js";
import transferRouter from "./resources/transfer/transfer.router.js";
import upgradeRouter from "./resources/upgrade/upgrade.router.js";
import myaccountRouter from "./resources/myaccount/myaccount.router.js";
import adminRouter from "./resources/admin/admin.router.js";
import networksRouter from "./resources/crypto-networks/crypto-networks.router.js";

app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/otp", otpRouter);
app.use("/withdraw", withdrawRouter);
app.use("/deposit", depositRouter);
app.use("/transfer", transferRouter);
app.use("/upgrade", upgradeRouter);
app.use("/myaccount", myaccountRouter);
app.use("/admin", adminRouter);

app.use("/networks", networksRouter);



/*#############################################################*/

//====================== 404 not found =======================
app.use((req, res) => {
  res.send("404 not found"); // if req for not found router
});
//============================ start server ===================

app.server.listen(PORT, (err) => {
  if (err) {
    console.log("error is " + err);
    return;
  }
  console.log(`Restful is listen on port : ${PORT}`);
  //--- run binance & local websocket Clients ---------
  // connectBinance();
  // connectLocalWSS();
  
  //--------------------------------------------
});


// let net = {
//   name : 'good',
//   fee : 0.005,
//   minimum_withdrawal : 0.0068,
//   arrival_time : null
// }

// let xx = ejs.renderFile('./views/snippets/withdraw_network_snippet.ejs',{network : net , cur_type : 'USDT'}).then((result) => {
//   return result;
// }).catch((err) => {
//   return err;
// });

// xx.then((eee)=>{
//   console.log(eee)
//   console.log(typeof(eee))
// })

