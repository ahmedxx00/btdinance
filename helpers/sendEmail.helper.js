import nodemailer from "nodemailer";

import {
  GMAIL_USER,
  GMAIL_PASS,
  GMAIL_SMTP_SERVER_ADDRESS,
} from "../Constants/API_DB_Constants.js";

const transporter = nodemailer.createTransport({
  host: GMAIL_SMTP_SERVER_ADDRESS,
  // port: 587,
  // secure: false,
  // tls: {
  //     rejectUnauthorized:false
  // },
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log("transporter verification error : " + err)
    : console.log("transporter is ready to take messages : " + success);
});

export const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        reject();
      } else {
        console.log(info.response);
        resolve();
      }
    });
  });
};
