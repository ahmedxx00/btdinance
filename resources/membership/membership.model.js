import mongoose from "mongoose";
import {
  DB_URI,
  MEMBERSHIPS,
  WALLETS_CURRENCIES,
} from "../../Constants/API_DB_Constants.js";
import {
  MEMBERSHIP_EXISTS,
  NO_MEMBERSHIP_WITH_THAT_NUMBER,
  NO_MEMBERSHIP_WITH_THAT_TYPE,
  NO_USDT_WALLET,
  NOT_ENOUGH_USDT_BALANCE,
} from "../../Constants/Error_Constants.js";

import { Wallet } from "../wallet/wallet.model.js";
import { User } from "../user/user.model.js";
//------------------------------------------
const Schema = mongoose.Schema;
const membershipSchema = new Schema({
  type: {
    type: String,
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
  img: { type: String },
  max_withdraw: { type: String, required: true },
  max_deposit: { type: String, required: true },
  max_transfer: { type: String, required: true },
  max_receive: { type: String, required: true },
});

//----- isCrypto && isFiat hook ------
membershipSchema.pre("save", function (next) {
  let xx = Object.values(MEMBERSHIPS).find((v) => v.number == this.number);
  if (xx && xx.length) {
    this.type = xx.name;
    this.img = xx.img;
  } else {
    this.type = `vip${this.number}`;
    this.img = `/vip${this.number}.png`;
  }
  next();
});

//------------------------------------------
export const Membership = mongoose.model("membership", membershipSchema);
//------------------------------------------

// ============================ CreateMembership ====================================

export const CreateMembership = (
  number,
  fee,
  max_withdraw,
  max_deposit,
  max_receive,
  max_transfer
) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Membership.findOne({ number: parseInt(number) })
          .then((membership) => {
            if (membership) {
              mongoose.disconnect();
              reject(MEMBERSHIP_EXISTS);
            } else {
              
              let newMembership = new Membership({
                number: parseInt(number),
                fee: parseInt(fee),
                max_withdraw: max_withdraw,
                max_deposit: max_deposit,
                max_receive: max_receive,
                max_transfer: max_transfer,
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
          .sort({ fee: 1 })
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

//================================
export const updateMemFee = (mem_id, fee) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Membership.findByIdAndUpdate(mem_id, { fee: parseInt(fee) })
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
  });
};

export const updateMaxWithdraw = (mem_id, max_withdraw) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Membership.findByIdAndUpdate(mem_id, { max_withdraw: max_withdraw })
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
  });
};
export const updateMaxDeposit = (mem_id, max_deposit) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Membership.findByIdAndUpdate(mem_id, { max_deposit: max_deposit })
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
  });
};
export const updateMaxReceive = (mem_id, max_receive) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Membership.findByIdAndUpdate(mem_id, { max_receive: max_receive })
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
  });
};
export const updateMaxTransfer = (mem_id, max_transfer) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Membership.findByIdAndUpdate(mem_id, { max_transfer: max_transfer })
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
  });
};


export const membershipRemove = (mem_id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Membership.findByIdAndDelete(mem_id)
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
  });
};
