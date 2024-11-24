import {
  decrypt,
  encrypt,
  WALLETS_CURRENCIES,
} from "../../Constants/API_DB_Constants.js";
import {
  Empty_Credentials_ERROR,
  WRONG_KEY,
  YOU_MUST_BE_VIP1_TO_DEPOSIT,
} from "../../Constants/Error_Constants.js";
import {
  getDepositNetworksOfSpecificCurrency,
  getSingleDepositNetworkAddress,
} from "../crypto-networks/crypto-networks.model.js";
import { getUserById } from "../user/user.model.js";

export const getSpecificDepositPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;
  let cur_type = req.params.cur_type;
if (id) {
  
  if (
    Object.values(WALLETS_CURRENCIES)
    .filter(v=> v.isCrypto)
      .map((v) => v.name)
      .includes(cur_type)
  ) {
    getDepositNetworksOfSpecificCurrency(cur_type)
      .then((networks) => {
        let curImg = Object.values(WALLETS_CURRENCIES).filter(v=> v.isCrypto).find(
          (v) => v.name === cur_type
        ).img;
        res.render("specific_deposit.ejs", {
          isLoggedIn: true,
          isAdmin: isAdmin,
          cur_type: cur_type,
          curImg: curImg ? curImg : "/usdt.svg",
          networks: networks,
        });
      })
      .catch(() => {
        res.redirect("/deposit"); // back to deposit page
      });
  } else {
    res.redirect("/deposit"); // back to deposit page
  }
}else{
  res.redirect("/"); // back to home page
}
};

export const depositCurrency = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { cur_type, network_name, key } = req.body;

  if (cur_type && network_name && key) {
    if (
      Object.values(WALLETS_CURRENCIES)
      .filter(v=> v.isCrypto)
        .map((v) => v.name)
        .includes(cur_type)
    ) {
      getUserById(id)
        .then(async (user) => {
          if (user.isOur) {
            res.json({
              success: false,
              msg: WRONG_KEY,
            });
          } else {
            let plain_key = await decrypt(user.key);

            if (plain_key == key) {
              if (user.vip > 0) {
                getSingleDepositNetworkAddress(cur_type, network_name)
                  .then((deposit_address) => {
                    res.json({
                      success: true,
                      msg: deposit_address,
                    });
                  })
                  .catch((errMsg1) => {
                    res.json({
                      success: false,
                      msg: errMsg1 ? errMsg1 : "error",
                    });
                  });
              } else {
                res.json({
                  success: false,
                  msg: YOU_MUST_BE_VIP1_TO_DEPOSIT,
                  hint: "vip",
                });
              }
            } else {
              res.json({
                success: false,
                msg: WRONG_KEY,
              });
            }
          }
        })
        .catch((errMsg2) => {
          res.json({
            success: false,
            msg: errMsg2 ? errMsg2 : "error",
          });
        });
    } else {
      res.json({
        success: false,
        msg: "error",
      });
    }
  } else {
    res.json({
      success: false,
      msg: Empty_Credentials_ERROR,
    });
  }
};
