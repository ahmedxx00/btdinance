import mongoose from "mongoose";
import {
  DB_URI,
  WALLETS_CURRENCIES,
  randomFromTo,
} from "../../Constants/API_DB_Constants.js";
import {
  BASIC_TRANSFER_LIMIT_ERROR,
  NOT_SUCH_WALLET,
  NOT_SUFFICIENT_AMOUNT,
  WITHDRAW_SUCCESSFUL,
} from "../../Constants/Error_Constants.js";
import { User } from "../user/user.model.js";
import { getSingleMembershipByNumber } from "../membership/membership.model.js";
import { getSpecificCurrencyConversionRate } from "../../other-models/conversion_rates.model.js";

const Schema = mongoose.Schema;

const wallet_Schema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId },
  user_name: { type: String },
  currency: { type: String, default: WALLETS_CURRENCIES.USDT.name },
  img: { type: String, default: WALLETS_CURRENCIES.USDT.img },
  available: { type: String, default: "0.00" },
  isCrypto: { type: Boolean },
  isFiat: { type: Boolean },
  created_at: { type: Date, default: new Date() },
});

//----- isCrypto && isFiat hook ------
wallet_Schema.pre("save", function (next) {
  let xx = Object.values(WALLETS_CURRENCIES).find(
    (v) => v.name == this.currency
  );
  this.isCrypto = xx.isCrypto;
  this.isFiat = xx.isFiat;
  next();
});
//-------------------------------------

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
              if (av >= tot) {
                wallet.available = ((av - tot).toFixed(10) * 1).toString();
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
  receiver_user_name,
  sender_vip,
  receiver_vip,
  userWallet,
  userToTransferToWallet,
  receiverNameOrEmail,
  cur_type,
  amount,
  sender_isOur
) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        if (receiver_vip == 0) {
          // receive has limit for basic
          getSingleMembershipByNumber(0)
            .then(async (basicMembership) => {
              let basicMaxUSDT = parseFloat(
                basicMembership.max_receive.replaceAll(",", "")
              );
              let maxToBeInWallet;
              if (cur_type == WALLETS_CURRENCIES.USDT.name) {
                maxToBeInWallet = basicMaxUSDT;
              } else {
                let ourCurTypeRate = await getSpecificCurrencyConversionRate(
                  cur_type
                );
                maxToBeInWallet =
                  (basicMaxUSDT * ourCurTypeRate).toFixed(10) * 1;
              }

              if (userToTransferToWallet) {
                //  [========= receiver has wallet ========]
                if (
                  parseFloat(userToTransferToWallet.available) +
                    parseFloat(amount) >
                  maxToBeInWallet
                ) {
                  // limit will exceed
                  mongoose.disconnect();
                  reject(
                    BASIC_TRANSFER_LIMIT_ERROR(
                      receiverNameOrEmail,
                      maxToBeInWallet,
                      cur_type
                    )
                  );
                } else {
                  // limit is ok
                  transferToReceiverWhoHasWallet(
                    sender_user_id,
                    receiver_user_id,
                    cur_type,
                    amount,
                    sender_isOur
                  )
                    .then(() => {
                      mongoose.disconnect();
                      resolve();
                    })
                    .catch((err) => {
                      mongoose.disconnect();
                      reject();
                    });
                }
              } else {
                //  [========= receiver has no wallet ========]

                if (parseFloat(amount) > maxToBeInWallet) {
                  // limit will exceed
                  mongoose.disconnect();
                  reject(
                    BASIC_TRANSFER_LIMIT_ERROR(
                      receiverNameOrEmail,
                      maxToBeInWallet,
                      cur_type
                    )
                  );
                } else {
                  // limit is ok
                  transferToReceiverWhoDontHaveWallet(
                    sender_user_id,
                    receiver_user_id,
                    receiver_user_name,
                    cur_type,
                    amount,
                    sender_isOur
                  )
                    .then(() => {
                      mongoose.disconnect();
                      resolve();
                    })
                    .catch((err) => {
                      mongoose.disconnect();
                      reject();
                    });
                }
              }
            })
            .catch((err1) => {
              console.log("err1 : " + err1);
              mongoose.disconnect();
              reject();
            });
        } else {
          // receive is unlimited if his vip > 0
          if (userToTransferToWallet) {
            //  [========= receiver has wallet ========]
            transferToReceiverWhoHasWallet(
              sender_user_id,
              receiver_user_id,
              cur_type,
              amount,
              sender_isOur
            )
              .then(() => {
                mongoose.disconnect();
                resolve();
              })
              .catch((err) => {
                mongoose.disconnect();
                reject();
              });
          } else {
            //  [========= receiver has no wallet ========]
            transferToReceiverWhoDontHaveWallet(
              sender_user_id,
              receiver_user_id,
              receiver_user_name,
              cur_type,
              amount,
              sender_isOur
            )
              .then(() => {
                mongoose.disconnect();
                resolve();
              })
              .catch((err) => {
                mongoose.disconnect();
                reject();
              });
          }
        }
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        mongoose.disconnect();
        reject();
      });
  });
};

const transferToReceiverWhoHasWallet = (
  sender_id,
  receiver_id,
  cur_type,
  amount,
  sender_isOur
) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Wallet.findOne({ user_id: sender_id, currency: cur_type })
          .then((sender_wallet) => {
            Wallet.findOne({ user_id: receiver_id, currency: cur_type })
              .then(async (receiver_wallet) => {
                //-------- dec sender wallet -------

                let x = Object.values(WALLETS_CURRENCIES).find(
                  (v) => v.name == cur_type
                );
                let min = x.our_users_min_balance,
                  max = x.our_users_max_balance;

                if (
                  sender_isOur &&
                  parseFloat(sender_wallet.available) - parseFloat(amount) < min
                ) {
                  let new_sender_balance = await randomFromTo(min, max);
                  sender_wallet.available = new_sender_balance.toString();
                } else {
                  sender_wallet.available = (
                    (
                      parseFloat(sender_wallet.available) - parseFloat(amount)
                    ).toFixed(10) * 1
                  ).toString();
                }
                //-------- inc receiver wallet -------
                receiver_wallet.available = (
                  (
                    parseFloat(receiver_wallet.available) + parseFloat(amount)
                  ).toFixed(10) * 1
                ).toString();
                //-------------------------------------
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
  });
};

const transferToReceiverWhoDontHaveWallet = (
  sender_id,
  receiver_id,
  receiver_name,
  cur_type,
  amount,
  sender_isOur
) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Wallet.findOne({ user_id: sender_id, currency: cur_type })
          .then(async (sender_wallet) => {
            //-------- dec sender wallet -------

            let x = Object.values(WALLETS_CURRENCIES).find(
              (v) => v.name == cur_type
            );
            let min = x.our_users_min_balance,
              max = x.our_users_max_balance;

            if (
              sender_isOur &&
              parseFloat(sender_wallet.available) - parseFloat(amount) < min
            ) {
              let new_sender_balance = await randomFromTo(min, max);
              sender_wallet.available = new_sender_balance.toString();
            } else {
              sender_wallet.available = (
                (
                  parseFloat(sender_wallet.available) - parseFloat(amount)
                ).toFixed(10) * 1
              ).toString();
            }
            //-------- create new receiver wallet -------

            let new_receiver_wallet = new Wallet({
              user_id: receiver_id,
              user_name: receiver_name,
              currency: cur_type,
              available: amount,
              img: x.img,
              created_at: new Date(),
            });

            let newWalletId = new_receiver_wallet._id;
            //--------------------------------------------

            sender_wallet
              .save()
              .then(() => {
                new_receiver_wallet
                  .save()
                  .then(() => {
                    //-- update receiver user document push the newly created wallet id

                    User.findByIdAndUpdate(receiver_id, {
                      $push: { wallets: newWalletId },
                    })
                      .then(() => {
                        mongoose.disconnect();
                        resolve();
                      })
                      .catch((err1) => {
                        console.log("err1 : " + err1);
                        mongoose.disconnect();
                        reject();
                      });
                    //-------------------------------------------------------------------
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
