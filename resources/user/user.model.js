import mongoose from "mongoose";

import { Wallet } from "../wallet/wallet.model.js";

import {
  USER_EXISTS,
  AVAILABLE,
  NOT_AVAILABLE,
  PASSWORD_ERROR,
  USER_NOT_FOUND_ERROR,
  NO_USER_WITH_THAT_NAME,
  NO_USER_WITH_THAT_Email,
} from "../../Constants/Error_Constants.js";

import { DB_URI, encrypt } from "../../Constants/API_DB_Constants.js";
import { getTk } from "../../helpers/jwt-helper.js";

//------------------------------------------
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: [true, "name must be unique"],
  },

  // since email is not required at signup so all/more than one user will not provide it
  // at sign up => so the mongodb driver gives it a [ null ] value
  // since all users will not provide an email at the first sign up so there will be
  // more than one [ null ] , and thats cant happen since we have a unique index on the email
  // so the [sparse : true] is important here , it tells the driver to keep the unique index
  // on the email but at the same time ignores the duplicated [ null ] value .

  email: {
    type: String,
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Invalid email format"],
    unique: [true, "this email is attached to another account"],
    sparse: true,
    required: false,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  key: {
    type: String,
    required: [true, "key is required"],
  },
  wallets: [{ type: mongoose.Schema.Types.ObjectId, ref: "wallet" }],
  vip: { type: Number, default: 0 },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

//------------------------------------------
export const User = mongoose.model("user", userSchema);
//------------------------------------------

// ============================ CreateUser ====================================

//-- on user register -> by default create a [ USDT & 0.00 ]wallet for him
export const CreateUser = (name, password, key) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        User.findOne({ name: name })
          .then(async (user) => {
            if (user) {
              mongoose.disconnect();
              reject(USER_EXISTS);
            } else {
              let enc = await encrypt(password);
              let encKey = await encrypt(key);
              let newUser = new User({
                name: name,
                password: enc,
                key: encKey,
              });
              let initial_wallet = new Wallet({ user_id: newUser._id }); // default USDT & 0.00 // set user_id in wallet document
              newUser.wallets.push(initial_wallet._id); // then push the wallet to wallets in user document

              newUser
                .save()
                .then(() => {
                  initial_wallet
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
            }
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
  });
};

export const LoginUser = (name_email, password, remember) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        User.findOne({ $or: [{ name: name_email }, { email: name_email }] })
          .then(async (user) => {
            mongoose.disconnect();
            if (user) {
              let enc = await encrypt(password);
              if (enc == user.password) {
                try {
                  let enc_tk = await getTk(user._id, false);
                  resolve(enc_tk);
                } catch (err1) {
                  console.log("err1 : " + err1);
                  reject();
                }
              } else {
                reject(PASSWORD_ERROR);
              }
            } else {
              reject(USER_NOT_FOUND_ERROR);
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

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        User.findById(id)
          .populate("wallets")
          .exec()
          .then(async (user) => {
            mongoose.disconnect();
            if (user) {
              resolve(user);
            } else {
              reject(USER_NOT_FOUND_ERROR);
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

export const getUserByIdAndTheOneToTransferToByName = (id, hisName) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        User.findById(id)
          .populate("wallets")
          .exec()
          .then((user) => {
            if (user) {
              User.findOne({ name: hisName })
                .populate("wallets")
                .exec()
                .then((userToTransferTo) => {
                  mongoose.disconnect();
                  if (userToTransferTo) {
                    resolve({ user, userToTransferTo });
                  } else {
                    reject(NO_USER_WITH_THAT_NAME);
                  }
                })
                .catch((err1) => {
                  console.log("err1 : " + err1);
                  mongoose.disconnect();
                  reject();
                });
            } else {
              reject(USER_NOT_FOUND_ERROR);
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

export const getUserByIdAndTheOneToTransferToByEmail = (id, hisEmail) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        User.findById(id)
          .populate("wallets")
          .exec()
          .then((user) => {
            if (user) {
              User.findOne({ email: hisEmail })
                .populate("wallets")
                .exec()
                .then((userToTransferTo) => {
                  mongoose.disconnect();
                  if (userToTransferTo) {
                    resolve({ user, userToTransferTo });
                  } else {
                    reject(NO_USER_WITH_THAT_Email);
                  }
                })
                .catch((err1) => {
                  console.log("err1 : " + err1);
                  mongoose.disconnect();
                  reject();
                });
            } else {
              reject(USER_NOT_FOUND_ERROR);
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

export const updateUserEmail = (id, email) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        User.findByIdAndUpdate(id, { email: email })
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
// ============================ CheckUserNameAvailable ====================================

export const CheckUserNameAvailable = (name) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        User.findOne({ name: name })
          .then((user) => {
            mongoose.disconnect();
            if (user) {
              reject(NOT_AVAILABLE);
            } else {
              resolve(AVAILABLE);
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
