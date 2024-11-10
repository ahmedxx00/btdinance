import { Router } from "express";
import * as otp_controller from "./otp.controller.js";
import { Empty_Credentials_ERROR } from "../../Constants/Error_Constants.js";
import { RESET_PASS_OTP_LENGTH } from "../../Constants/API_DB_Constants.js";
//------------------------------------------------------
const router = Router();

/* post -> [ /otp/ ]  inside { forgot-password PAGE }*/
router.post("/", (req, res, next) => {
  const { email } = req.body;
  if (email) {
    otp_controller
      .SendOTP(email)
      .then(() => {
        res.json({
          success: true,
          msg: "done",
          email: email,
          redirectUrl: "/otp/reset-password",
        });
      })
      .catch((errMsg) => {
        res.json({
          success: false,
          msg: errMsg ? errMsg : "error",
        });
      });
  } else {
    res.json({
      success: false,
      msg: Empty_Credentials_ERROR,
    });
  }
});

/* get -> [ /otp/reset-password ] */
router.get("/reset-password", (req, res, next) => {
  // get reset-password page
  res.render("reset-password.ejs",{pin_length : RESET_PASS_OTP_LENGTH});
});

/* post -> [ /otp/reset-password ] */
router.post("/reset-password", (req, res, next) => {
  const { otp_email, otp, newPassword } = req.body;
  if (otp_email && otp && newPassword) {
    otp_controller
      .ResetPassword(otp_email,otp,newPassword)
      .then(() => {
        res.json({
          success: true,
          msg: "done",
          redirectUrl: "/auth",
        });
      })
      .catch((errMsg) => {
        res.json({
          success: false,
          msg: errMsg ? errMsg : "error",
        });
      });
  } else {
    res.json({
      success: false,
      msg: Empty_Credentials_ERROR,
    });
  }
});

export default router; // equivalent to [ module.exports = router; ]
