import mongoose from "mongoose";
import {
  DB_URI,
  WALLETS_CURRENCIES,
} from "../../Constants/API_DB_Constants.js";
import {
  MEMBERSHIP_EXISTS,
  NO_MEMBERSHIP_WITH_THAT_NUMBER,
  NO_MEMBERSHIP_WITH_THAT_TYPE,
  NO_USDT_WALLET,
  NOT_ENOUGH_USDT_BALANCE,
} from "../../Constants/Error_Constants.js";

import { Wallet } from "../../resources/wallet/wallet.model.js";
import { User } from "../user/user.model.js";
//------------------------------------------
const Schema = mongoose.Schema;
const membershipSchema = new Schema({
  type: {
    type: String,
    required: [true, "type is required"],
    unique: [true, "type must be unique"],
  },
  number: {
    type: Number,
    required: [true, "number is required"],
    unique: [true, "number must be unique"],
  },
  fee: {
    type: Number,
    required: [true, "fee is required"],
  },
  img: { type: String , required : true},
  max_withdraw: {type: String , required : true },
  max_deposit: { type: String , required : true},
  max_transfer: { type: String , required : true},
  max_receive: { type: String , required : true},
});

//------------------------------------------
export const Membership = mongoose.model("membership", membershipSchema);
//------------------------------------------

// ============================ CreateMembership ====================================

export const CreateMembership = (type, fee) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Membership.findOne({ type: type })
          .then((membership) => {
            if (membership) {
              mongoose.disconnect();
              reject(MEMBERSHIP_EXISTS);
            } else {
              let newMembership = new Membership({
                type: type,
                fee: parseInt(fee),
              });

              newMembership
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

export const getAllMemberships = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Membership.find({})
          .sort({ fee : 1 })
          .exec()
          .then((membershipsArray) => {
            mongoose.disconnect();
            resolve(membershipsArray);
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

export const getSingleMembership = (type) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Membership.findOne({ type: type })
          .then((membership) => {
            mongoose.disconnect();
            if (membership) {
              resolve(membership);
            } else {
              reject(NO_MEMBERSHIP_WITH_THAT_TYPE);
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
export const getSingleMembershipByNumber = (number) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Membership.findOne({ number: number })
          .then((membership) => {
            mongoose.disconnect();
            if (membership) {
              resolve(membership);
            } else {
              reject(NO_MEMBERSHIP_WITH_THAT_NUMBER);
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

export const buyMembershipWithUSDT = (id, type) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Membership.findOne({ type: type })
          .then((membership) => {
            if (membership) {
              //--- 300 Number -----
              let memFee = membership.fee; 
              //--------------
              Wallet.findOne({
                user_id: id,
                currency: WALLETS_CURRENCIES.USDT.name,
              })
                .then((wallet) => {
                  if (wallet) {
                    if (parseFloat(wallet.available) < memFee) {
                      mongoose.disconnect();
                      reject(NOT_ENOUGH_USDT_BALANCE);
                    } else {
                      wallet.available = (
                        (
                          parseFloat(wallet.available) - memFee
                        ).toFixed(10) * 1
                      ).toString();
                      wallet
                        .save()
                        .then(() => {
                          let newVip;
                          switch (type) {
                            case "vip1":
                              newVip = 1;
                              break;
                            case "vip2":
                              newVip = 2;
                              break;
                            case "vip3":
                              newVip = 3;
                              break;
                            case "vip4":
                              newVip = 4;
                              break;
                            default:
                              newVip = 0;
                              break;
                          }

                          User.findByIdAndUpdate(id, { vip: newVip })
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
                    }
                  } else {
                    mongoose.disconnect();
                    reject(NO_USDT_WALLET);
                  }
                })
                .catch((err3) => {
                  console.log("err3 : " + err3);
                  mongoose.disconnect();
                  reject();
                });
            } else {
              mongoose.disconnect();
              reject(NO_MEMBERSHIP_WITH_THAT_TYPE);
            }
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
