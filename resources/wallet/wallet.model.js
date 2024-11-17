import mongoose from "mongoose";
import {
  DB_URI,
  WALLETS_CURRENCIES,
} from "../../Constants/API_DB_Constants.js";
import {
  NOT_SUCH_WALLET,
  NOT_SUFFICIENT_AMOUNT,
  WITHDRAW_SUCCESSFUL,
} from "../../Constants/Error_Constants.js";
import { User } from "../user/user.model.js";

const Schema = mongoose.Schema;

const wallet_Schema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId },
  currency: { type: String, default: WALLETS_CURRENCIES.USDT.name },
  img: { type: String, default: WALLETS_CURRENCIES.USDT.img },
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

// ---- tricky ------
export const depositToWallet = (user_id, cur_type, total) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Wallet.findOne({ user_id: user_id, currency: cur_type })
          .then((wallet) => {
            if (wallet) {
              wallet.available = (
                parseFloat(wallet.available) + parseFloat(total)
              ).toString();
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
//-------------------

export const transferBetweenTwoWallets = (
  sender_user_id,
  receiver_user_id,
  sender_vip,
  receiver_vip,
  cur_type,
  amount
) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Wallet.findOne({ user_id: sender_user_id, currency: cur_type })
          .then((sender_wallet) => {
            Wallet.findOne({ user_id: receiver_user_id, currency: cur_type })
              .then((receiver_wallet) => {
                if (receiver_wallet) {



                  


                  sender_wallet.available = (
                    parseFloat(sender_wallet.available) - parseFloat(amount)
                  ).toString();
                  receiver_wallet.available = (
                    parseFloat(receiver_wallet.available) + parseFloat(amount)
                  ).toString();

                  sender_wallet
                    .save()
                    .then(() => {
                      receiver_wallet
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
                    })
                    .catch((err2) => {
                      console.log("err2 : " + err2);
                      mongoose.disconnect();
                      reject();
                    });





                } else {






                  sender_wallet.available = (
                    parseFloat(sender_wallet.available) - parseFloat(amount)
                  ).toString();

                  let new_receiver_wallet = new Wallet({
                    currency: cur_type,
                    available: amount,
                    created_at: new Date(),
                    user_id: receiver_user_id,
                  });

                  let newWalletId = new_receiver_wallet._id;

                  sender_wallet
                    .save()
                    .then(() => {
                      new_receiver_wallet
                        .save()
                        .then(() => {
                          //-- update receiver user document push the newly created wallet id

                          User.findByIdAndUpdate(receiver_user_id, {
                            $push: { wallets: newWalletId },
                          })
                            .then(() => {
                              mongoose.disconnect();
                              resolve();
                            })
                            .catch((err3) => {
                              console.log("err3 : " + err3);
                              mongoose.disconnect();
                              reject();
                            });
                        })
                        .catch((err4) => {
                          console.log("err4 : " + err4);
                          mongoose.disconnect();
                          reject();
                        });
                    })
                    .catch((err5) => {
                      console.log("err5 : " + err5);
                      mongoose.disconnect();
                      reject();
                    });







                }
              })
              .catch((err6) => {
                console.log("err6 : " + err6);
                mongoose.disconnect();
                reject();
              });
          })
          .catch((err7) => {
            console.log("err7 : " + err7);
            mongoose.disconnect();
            reject();
          });
      })
      .catch((err8) => {
        console.log("err8 : " + err8);
        mongoose.disconnect();
        reject();
      });
  });
};


/* ---- restrict transfer to vip1 or more only -----------
export const transferBetweenTwoWallets = (
  sender_user_id,
  receiver_user_id,
  cur_type,
  amount
) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Wallet.findOne({ user_id: sender_user_id, currency: cur_type })
          .then((sender_wallet) => {
            Wallet.findOne({ user_id: receiver_user_id, currency: cur_type })
              .then((receiver_wallet) => {
                if (receiver_wallet) {
                  sender_wallet.available = (
                    parseFloat(sender_wallet.available) - parseFloat(amount)
                  ).toString();
                  receiver_wallet.available = (
                    parseFloat(receiver_wallet.available) + parseFloat(amount)
                  ).toString();

                  sender_wallet
                    .save()
                    .then(() => {
                      receiver_wallet
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
                    })
                    .catch((err2) => {
                      console.log("err2 : " + err2);
                      mongoose.disconnect();
                      reject();
                    });
                } else {
                  sender_wallet.available = (
                    parseFloat(sender_wallet.available) - parseFloat(amount)
                  ).toString();

                  let new_receiver_wallet = new Wallet({
                    currency: cur_type,
                    available: amount,
                    created_at: new Date(),
                    user_id: receiver_user_id,
                  });

                  let newWalletId = new_receiver_wallet._id;

                  sender_wallet
                    .save()
                    .then(() => {
                      new_receiver_wallet
                        .save()
                        .then(() => {
                          //-- update receiver user document push the newly created wallet id

                          User.findByIdAndUpdate(receiver_user_id, {
                            $push: { wallets: newWalletId },
                          })
                            .then(() => {
                              mongoose.disconnect();
                              resolve();
                            })
                            .catch((err3) => {
                              console.log("err3 : " + err3);
                              mongoose.disconnect();
                              reject();
                            });
                        })
                        .catch((err4) => {
                          console.log("err4 : " + err4);
                          mongoose.disconnect();
                          reject();
                        });
                    })
                    .catch((err5) => {
                      console.log("err5 : " + err5);
                      mongoose.disconnect();
                      reject();
                    });
                }
              })
              .catch((err6) => {
                console.log("err6 : " + err6);
                mongoose.disconnect();
                reject();
              });
          })
          .catch((err7) => {
            console.log("err7 : " + err7);
            mongoose.disconnect();
            reject();
          });
      })
      .catch((err8) => {
        console.log("err8 : " + err8);
        mongoose.disconnect();
        reject();
      });
  });
};
*/
