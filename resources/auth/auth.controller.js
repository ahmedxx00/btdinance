import {
  CreateUser,
  LoginUser,
  CheckUserNameAvailable,
} from "../user/user.model.js";
import { LoginAdmin } from "../admin/admin.model.js";

import {
  COOKIE_NAME,
  CookieOptions,
} from "../../Constants/API_DB_Constants.js";

//-----------------------------------------------------------------
export const getAuthPage = (req, res, next) => {
  res.render("auth.ejs", {
    na: req.t("nav_bar.nav_btns.nav_about"),
    nex: req.t("nav_bar.nav_btns.nav_ex"),
    ntr: req.t("nav_bar.nav_btns.nav_tr"),
    nwith: req.t("nav_bar.nav_btns.nav_with"),
    ndep: req.t("nav_bar.nav_btns.nav_dep"),
    nhm: req.t("nav_bar.nav_btns.nav_hm"),
    lgt: req.t("nav_bar.logout_tit"),
    lgn: req.t("auth.login.tit"),
    nmEm: req.t("auth.login.name_email"),
    ps: req.t("auth.login.pass"),
    psN: req.t("auth.login.pass_note"),
    rm: req.t("auth.login.rem"),
    lgBtn: req.t("auth.login.btn"),
    frg: req.t("auth.login.pass_frgt"),
    dnt: req.t("auth.login.no_acc_nt"),
    snp: req.t("auth.login.snp"),
    snpT: req.t("auth.signup.tit"),
    nm: req.t("auth.signup.nm"),
    psw: req.t("auth.signup.pass"),
    pswN: req.t("auth.signup.pass_note"),
    sc: req.t("auth.signup.sc"),
    sc_nt1: req.t("auth.signup.sc_nt1"),
    sc_nt2: req.t("auth.signup.sc_nt2"),
    trm1: req.t("auth.signup.trm1"),
    trm2: req.t("auth.signup.trm2"),
    snpB: req.t("auth.signup.btn"),
    hv: req.t("auth.signup.hv"),
    lgnN: req.t("auth.signup.lng"),
  });
};

export const getForgotPasswordPage = (req, res, next) => {
  res.render("forgot-password.ejs", {
    na: req.t("nav_bar.nav_btns.nav_about"),
    nex: req.t("nav_bar.nav_btns.nav_ex"),
    ntr: req.t("nav_bar.nav_btns.nav_tr"),
    nwith: req.t("nav_bar.nav_btns.nav_with"),
    ndep: req.t("nav_bar.nav_btns.nav_dep"),
    nhm: req.t("nav_bar.nav_btns.nav_hm"),
    lgt: req.t("nav_bar.logout_tit"),

    tit: req.t("forgot_password.tit"),
    sep: req.t("forgot_password.send_email_plc"),
    se: req.t("forgot_password.send_email"),
  });
};

export const getTermsConditionsPage = (req, res, next) => {
  res.render("terms-conditions.ejs", {
    na: req.t("nav_bar.nav_btns.nav_about"),
    nex: req.t("nav_bar.nav_btns.nav_ex"),
    ntr: req.t("nav_bar.nav_btns.nav_tr"),
    nwith: req.t("nav_bar.nav_btns.nav_with"),
    ndep: req.t("nav_bar.nav_btns.nav_dep"),
    nhm: req.t("nav_bar.nav_btns.nav_hm"),
    lgt: req.t("nav_bar.logout_tit"),
  });
};

export const getAdminLoginPage = (req, res, next) => {
  res.render("admin-login.ejs", {
    na: req.t("nav_bar.nav_btns.nav_about"),
    nex: req.t("nav_bar.nav_btns.nav_ex"),
    ntr: req.t("nav_bar.nav_btns.nav_tr"),
    nwith: req.t("nav_bar.nav_btns.nav_with"),
    ndep: req.t("nav_bar.nav_btns.nav_dep"),
    nhm: req.t("nav_bar.nav_btns.nav_hm"),
    lgt: req.t("nav_bar.logout_tit"),
  });
};

//---------------------------------------------------------------
export const SignUp = (req, res, next) => {
  const { name, password, key } = req.body;
  if (name && password && key) {
    CreateUser(name, password, key)
      .then(() => {
        res.json({
          success: true,
          msg: "done",
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
};

export const Login = (req, res, next) => {
  const { name_email, password, remember } = req.body;

  if (remember) {
  } else {
  }

  if (name_email && password) {
    LoginUser(name_email, password, remember)
      .then((enc_tk) => {
        res.cookie(COOKIE_NAME, enc_tk, CookieOptions);
        res.json({
          success: true,
          msg: "done",
          redirectUrl: "/",
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
};

export const AdminLogin = (req, res, next) => {
  const { name, password } = req.body;

  if (name && password) {
    LoginAdmin(name, password)
      .then((enc_tk) => {
        res.cookie(COOKIE_NAME, enc_tk, CookieOptions);
        res.json({
          success: true,
          msg: "done",
          redirectUrl: "/",
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
};

export const check_signup_name_availability = (req, res, next) => {
  const { name } = req.body;
  if (name) {
    CheckUserNameAvailable(name)
      .then((msg) => {
        res.json({
          success: true,
          msg: msg, // Available
        });
      })
      .catch((errMsg) => {
        if (errMsg) {
          res.json({
            success: false,
            msg: req.t(errMsg), // Not Available
          });
        } else {
          res.end();
        }
      });
  }
};
