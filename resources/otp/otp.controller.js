import mongoose from "mongoose";
import { OTP } from "./otp.model.js";
import { User } from "../user/user.model.js";
import {
  DB_URI,
  SUBJECT_pwd,
  HTML_MSG,
  encrypt,
  GMAIL_COMPANY_FROM_ADDRESS_pwd,
} from "../../Constants/API_DB_Constants.js";
import {
  Email_ERROR,
  EXPIRED_OTP,
  NO_OTP_FOR_THIS_EMAIL,
  WRONG_OTP,
} from "../../Constants/Error_Constants.js";
import { generateOTP } from "../../helpers/generateOTP.js";
import { sendEmail } from "../../helpers/sendEmail.helper.js";

export const SendOTP = (email, duration = 1) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        User.findOne({ email })
          .then(async (user) => {
            if (user) {
              let otp = await generateOTP();
              let html = await HTML_MSG(user.name, otp, duration);
              const mailOptions = {
                from: GMAIL_COMPANY_FROM_ADDRESS_pwd,
                to: email,
                subject: SUBJECT_pwd,
                html: html,
              };

              sendEmail(mailOptions)
                .then(async () => {
                  let enc = await encrypt(otp);
                  let newOtp = new OTP({
                    // a new _id is automatically generated now
                    email: email,
                    otp: enc,
                    created_at: Date.now(),
                    expires_at: Date.now() + 3600000 * duration,
                  });

                  OTP.deleteOne({ email })
                    .then(() => {
                      newOtp
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
            } else {
              // not found
              mongoose.disconnect();
              reject(Email_ERROR);
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

export const ResetPassword = (email, otp, newPassword) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        OTP.findOne({ email })
          .then(async (otpDoc) => {
            if (otpDoc) {
              let enc = await encrypt(otp);

              if (enc == otpDoc.otp) {
                let expires_at = otpDoc.expires_at;
                let encPass = await encrypt(newPassword);
                if (expires_at > Date.now()) {
                  User.updateOne({ email }, { password: encPass })
                    .then(() => {
                      // delete otpDoc after resetting password success
                      OTP.deleteOne({ email })
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
                  // expired otp request new one
                  OTP.deleteOne({ email })
                    .then(() => {
                      mongoose.disconnect();
                      reject(EXPIRED_OTP);
                    })
                    .catch((err3) => {
                      console.log("err3 : " + err3);
                      mongoose.disconnect();
                      reject();
                    });
                }
              } else {
                // wrong otp
                mongoose.disconnect();
                reject(WRONG_OTP);
              }
            } else {
              // no otp related to this otp_email request a new one
              mongoose.disconnect();
              reject(NO_OTP_FOR_THIS_EMAIL);
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
