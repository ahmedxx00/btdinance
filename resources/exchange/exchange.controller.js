import {
  decrypt,
  WALLETS_CURRENCIES,
} from "../../Constants/API_DB_Constants.js";
import {
  Empty_Credentials_ERROR,
  EXCHANGE_SUCCESSFUL,
  WRONG_KEY,
} from "../../Constants/Error_Constants.js";
import { getUserById } from "../user/user.model.js";
import { exchangeToFiat } from "../wallet/wallet.model.js";

export const exchangeCurrency = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { cur_type, fiat_cur_type, amount, fiat_amount, key } = req.body;

  if (id) {
    if (cur_type && fiat_cur_type && amount && fiat_amount && key) {
      if (
        Object.values(WALLETS_CURRENCIES)
          .filter((v) => v.isCrypto)
          .map((v) => v.name)
          .includes(cur_type)
      ) {
        if (
          Object.values(WALLETS_CURRENCIES)
            .filter((v) => v.isFiat)
            .map((v) => v.name)
            .includes(fiat_cur_type)
        ) {
          getUserById(id)
            .then(async (user) => {
              let plainKey = await decrypt(user.key);
              if (user && user.isOur) {
                res.json({
                  success: false,
                  msg: WRONG_KEY,
                });
              } else {
                if (plainKey == key) {
                  exchangeToFiat(
                    id,
                    user.name,
                    cur_type,
                    fiat_cur_type,
                    amount,
                    fiat_amount
                  )
                    .then(() => {
                      res.json({
                        success: true,
                        msg: EXCHANGE_SUCCESSFUL,
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
          msg: "error",
        });
      }
    } else {
      res.json({
        success: false,
        msg: Empty_Credentials_ERROR,
      });
    }
  } else {
    res.json({
      success: false,
      msg: "error",
    });
  }
};
