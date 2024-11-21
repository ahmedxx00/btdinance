import {
  decrypt,
  validAmount,
  WALLETS_CURRENCIES,
} from "../../Constants/API_DB_Constants.js";
import {
  Empty_Credentials_ERROR,
  WRONG_AMOUNT,
  WRONG_KEY,
  YOU_MUST_BE_VIP1_TO_WITHDRAW,
} from "../../Constants/Error_Constants.js";
import { getWithdrawNetworksOfSpecificCurrency } from "../crypto-networks/crypto-networks.model.js";
import { getUserById } from "../user/user.model.js";
import {
  getWalletForUserIdAndCurType,
  withdrawFromWallet,
} from "../wallet/wallet.model.js";

export const getSpecificWithdrawPage = (req, res, next) => {
  let cur_type = req.params.cur_type;
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (
    Object.values(WALLETS_CURRENCIES)
      .map((v) => v.name)
      .includes(cur_type)
  ) {
    // get that specific wallet of this use

    getWalletForUserIdAndCurType(id, cur_type)
      .then((wallet) => {
        getWithdrawNetworksOfSpecificCurrency(cur_type)
          .then((networks) => {
            let curImg = Object.values(WALLETS_CURRENCIES).find(
              (v) => v.name === cur_type
            ).img;
            res.render("specific_withdraw.ejs", {
              isLoggedIn: true,
              isAdmin: isAdmin,
              curImg: curImg ? curImg : "/usdt.svg",
              cur_type: cur_type,
              wallet: wallet,
              networks: networks,
            });
          })
          .catch(() => {
            res.redirect("/withdraw"); // back to withdraw page
          });
      })
      .catch((err) => {
        res.redirect("/withdraw"); // back to withdraw page
      });
  } else {
    res.redirect("/withdraw"); // back to withdraw page
  }
};

export const withdrawCurrency = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const {
    cur_type,
    recipient_address,
    key,
    network_name,
    network_fee,
    total,
    received,
  } = req.body;

  if (
    cur_type &&
    recipient_address &&
    key &&
    network_name &&
    network_fee &&
    total &&
    received
  ) {
    if (
      Object.values(WALLETS_CURRENCIES)
        .map((v) => v.name)
        .includes(cur_type)
    ) {
      if (validAmount(total)) {
        getUserById(id)
          .then(async (user) => {
            if (user.isOur) {
              res.json({
                success: false,
                msg: WRONG_KEY,
              });
            } else {
              let plain_key = await decrypt(user.key);
              if (plain_key === key) {
                if (user.vip > 0) {
                  withdrawFromWallet(id, cur_type, total)
                    .then((msg) => {
                      res.json({
                        success: true,
                        msg: msg,
                        redirectUrl: "/withdraw",
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
                    msg: YOU_MUST_BE_VIP1_TO_WITHDRAW,
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
          msg: WRONG_AMOUNT,
        });
      }
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
