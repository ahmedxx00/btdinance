import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import {
  DB_URI,
  encrypt,
} from "../../Constants/API_DB_Constants.js";
import { getTk } from "../../helpers/jwt-helper.js";

//------------------------------------------
const Schema = mongoose.Schema;
const adminSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: [true, "name must be unique"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});
//------------------------------------------
export const Admin = mongoose.model("admin", adminSchema);
//------------------------------------------

// ============================ CreateUser ====================================

export const LoginAdmin = (name, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Admin.findOne({ name: name })
          .then(async (admin) => {
            mongoose.disconnect();
            if (admin) {
              let enc = await encrypt(password);
              if (enc == admin.password) {
                try {
                  let enc_tk = await getTk(admin._id,true);
                  resolve(enc_tk);
                } catch (err1) {
                  console.log("err1 : " + err1);
                  reject();
                }
              } else {
                reject('PASSWORD_ERROR');
              }
            } else {
              reject('ADMIN_NOT_FOUND_ERROR');
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
