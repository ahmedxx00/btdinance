import {
  CreateUser,
  LoginUser,
  CheckUserNameAvailable,
} from "../user/user.model.js";
import { LoginAdmin } from "../admin/admin.model.js";

import { Empty_Credentials_ERROR } from "../../Constants/Error_Constants.js";
import {
  COOKIE_NAME,
  CookieOptions,
} from "../../Constants/API_DB_Constants.js";

//-----------------------------------------------------------------
export const getAuthPage = (req, res, next) => {
  res.render("auth.ejs");
};

export const getForgotPasswordPage = (req, res, next) => {
  res.render("forgot-password.ejs");
};

export const getTermsConditionsPage = (req, res, next) => {
  res.render("terms-conditions.ejs");
};
export const getAdminLoginPage = (req, res, next) => {
  res.render("admin-login.ejs");
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
          msg: errMsg ? errMsg : "error",
        });
      });
  } else {
    res.json({
      success: false,
      msg: Empty_Credentials_ERROR,
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
          msg: errMsg ? errMsg : "error",
        });
      });
  } else {
    res.json({
      success: false,
      msg: Empty_Credentials_ERROR,
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
          msg: errMsg ? errMsg : "error",
        });
      });
  } else {
    res.json({
      success: false,
      msg: Empty_Credentials_ERROR,
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
            msg: errMsg, // Not Available
          });
        } else {
          res.end();
        }
      });
  }
};
