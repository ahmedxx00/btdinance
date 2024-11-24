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
import exchangeRouter from "./resources/exchange/exchange.router.js";
import myaccountRouter from "./resources/myaccount/myaccount.router.js";
import adminRouter from "./resources/admin/admin.router.js";
import networksRouter from "./resources/crypto-networks/crypto-networks.router.js";
import membershipsRouter from "./resources/membership/membership.router.js";
import transactionIdsRouter from "./resources/transaction-ids/transaction_id.router.js";
import conversionRatesRouter from "./resources/conversion-rates/conversion_rates.router.js";
import ourUsersRouter from "./resources/our-users/our_users.router.js";

app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/otp", otpRouter);
app.use("/withdraw", withdrawRouter);
app.use("/deposit", depositRouter);
app.use("/transfer", transferRouter);
app.use("/upgrade", upgradeRouter);
app.use("/exchange", exchangeRouter);
app.use("/myaccount", myaccountRouter);
app.use("/admin", adminRouter);

app.use("/networks", networksRouter);
app.use("/memberships", membershipsRouter);
app.use("/transaction_ids", transactionIdsRouter);
app.use("/conversion_rates", conversionRatesRouter);
app.use("/our_users", ourUsersRouter);



/*#############################################################*/

//====================== 404 not found =======================
app.use((req, res) => {
  // res.send("404 not found"); // if req for not found router
  res.render('404_not_found.ejs'); // if req for not found router

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


// let xx = {
//   ahmed : {
//     name : 'aa',
//     number : 0
//   },
//   baher : {
//     name : 'bb',
//     number : 1
//   },
//   camal : {
//     name : 'cc',
//     number : 2
//   },
// }
// console.log(Object.keys(xx).find(key => xx[key].number == 1))

// let xx = 0.00001104
// let yy = '250000'
// console.log(typeof(xx))
// let zz = '1.25'

// console.log((parseFloat(yy) * xx).toFixed(10)*1)
// console.log(((parseFloat(yy) * xx)-parseFloat(zz)).toFixed(10) *1 )

// let xx = 0.0025;
// let yy = '250,000'

// console.log(parseFloat(yy.replaceAll(',','')) * parseFloat(xx))

// let xx = {
//   AA : {
//     i : 'aaaaa',
//     u : true
//   },
//   BB : {
//     i : 'bbbbb',
//     u : false
//   },
//   CC : {
//     i : 'ccccc',
//     u : true
//   },

// }


// let pp = Object.values(xx).filter(v=> v.u).map(v=> v.i)

// console.log(pp)
// Object.keys(xx).forEach((key)=>{if (xx[key].u) {
//   delete xx[key]
// }})

// console.log(Object.values(xx).filter(v => v.u).map(v=> v.i));
// console.log(xx);