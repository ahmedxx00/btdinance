import { Router } from "express";
import * as otp_controller from "./otp.controller.js";
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
          msg: errMsg ? req.t(errMsg) : "error",
        });
      });
  } else {
    res.json({
      success: false,
      msg: req.t("Empty_Credentials_ERROR"),
    });
  }
});

/* get -> [ /otp/reset-password ] */
router.get("/reset-password", (req, res, next) => {
  // get reset-password page
  res.render("reset-password.ejs", {
    pin_length: RESET_PASS_OTP_LENGTH,

    na: req.t("nav_bar.nav_btns.nav_about"),
    nex: req.t("nav_bar.nav_btns.nav_ex"),
    ntr: req.t("nav_bar.nav_btns.nav_tr"),
    nwith: req.t("nav_bar.nav_btns.nav_with"),
    ndep: req.t("nav_bar.nav_btns.nav_dep"),
    nhm: req.t("nav_bar.nav_btns.nav_hm"),
    lgt: req.t("nav_bar.logout_tit"),

    cd: req.t("reset_password.cd"),
    np: req.t("reset_password.np"),
    np_note: req.t("reset_password.np_note"),
    rp: req.t("reset_password.rp"),
  });
});

/* post -> [ /otp/reset-password ] */
router.post("/reset-password", (req, res, next) => {
  const { otp_email, otp, newPassword } = req.body;
  if (otp_email && otp && newPassword) {
    otp_controller
      .ResetPassword(otp_email, otp, newPassword)
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
          msg: errMsg ? req.t(errMsg) : "error",
        });
      });
  } else {
    res.json({
      success: false,
      msg: req.t("Empty_Credentials_ERROR"),
    });
  }
});

export default router; // equivalent to [ module.exports = router; ]
