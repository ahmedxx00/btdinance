import mongoose from "mongoose";
import {
  DB_URI,
  WALLETS_CURRENCY_NAMES,
} from "../../Constants/API_DB_Constants.js";
import {
  NOT_SUCH_WALLET,
  NOT_SUFFICIENT_AMOUNT,
  WITHDRAW_SUCCESSFUL,
} from "../../Constants/Error_Constants.js";

const Schema = mongoose.Schema;

const wallet_Schema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId },
  currency: { type: String, default: WALLETS_CURRENCY_NAMES.USDT },
  available: { type: String, default: "0.00" },
  created_at: { type: Date, default: new Date() },
});

export const Wallet = mongoose.model("wallet", wallet_Schema);

export const getWalletForUserIdAndCurType = (user_id, cur_type) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Wallet.findOne({ user_id: user_id, currency: cur_type })
          .then((wallet) => {
            mongoose.disconnect();
            if (wallet) {
              resolve(wallet);
            } else {
              reject();
            }
          })
          .catch((err1) => {
            console.log("err1 : " + err1);
            mongoose.disconnect();
            reject();
          });
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        mongoose.disconnect();
        reject();
      });
  });
};

export const withdrawFromWallet = (user_id, cur_type, total) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Wallet.findOne({ user_id: user_id, currency: cur_type })
          .then((wallet) => {
            if (wallet) {
              let av = parseFloat(wallet.available),
                tot = parseFloat(total);
              if (av > tot) {
                wallet.available = (av - tot).toString();
                wallet
                  .save()
                  .then(() => {
                    mongoose.disconnect();
                    resolve(WITHDRAW_SUCCESSFUL);
                  })
                  .catch((err1) => {
                    console.log("err1 : " + err1);
                    mongoose.disconnect();
                    reject();
                  });
              } else {
                // not sufficient wallet available
                mongoose.disconnect();
                reject(NOT_SUFFICIENT_AMOUNT);
              }
            } else {
              mongoose.disconnect();
              reject(NOT_SUCH_WALLET);
            }
          })
          .catch((err2) => {
            console.log("err2 : " + err2);
            mongoose.disconnect();
            reject();
          });
      })
      .catch((err3) => {
        console.log("err3 : " + err3);
        mongoose.disconnect();
        reject();
      });
  });
};

export const depositToWallet = (user_id, cur_type, total) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Wallet.findOne({ user_id: user_id, currency: cur_type })
          .then((wallet) => {
            if (wallet) {
              let av = parseFloat(wallet.available),
                tot = parseFloat(total);
              wallet.available = (av + tot).toString();
              wallet
                .save()
                .then(() => {
                  mongoose.disconnect();
                  resolve();
                })
                .catch((err1) => {
                  console.log("err1 : " + err1);
                  mongoose.disconnect();
                  reject();
                });
            } else {
              mongoose.disconnect();
              reject(NOT_SUCH_WALLET);
            }
          })
          .catch((err2) => {
            console.log("err2 : " + err2);
            mongoose.disconnect();
            reject();
          });
      })
      .catch((err3) => {
        console.log("err3 : " + err3);
        mongoose.disconnect();
        reject();
      });
  });
};
