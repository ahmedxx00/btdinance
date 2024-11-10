import { COOKIE_NAME, WALLETS_CURRENCY_NAMES } from "../../Constants/API_DB_Constants.js";
import * as userModel from "../user/user.model.js";

export const getWithdrawPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (id) {
    userModel
      .getUserById(id)
      .then((user) => {
        res.render("withdraw.ejs", {isLoggedIn: true, isAdmin: isAdmin, wallets : user.wallets});
      })
      .catch((errMsg) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/");
  }

};

export const getDepositPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  let keysArray = Object.keys(WALLETS_CURRENCY_NAMES);
  let valuesArray = Object.values(WALLETS_CURRENCY_NAMES);

  if (id) {
    res.render('deposit.ejs' , {isLoggedIn: true, isAdmin: isAdmin, keysArray : keysArray , valuesArray : valuesArray } );

  }else{
    res.redirect("/");
  }
};

export const getTransferPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (id) {

    userModel
      .getUserById(id)
      .then((user) => {
        res.render("transfer.ejs", {isLoggedIn: true, isAdmin: isAdmin, wallets : user.wallets});
      })
      .catch((errMsg) => {
        res.redirect("/");
      });
  }else{
    res.redirect("/");
  }
};

export const getUpgradePage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (id) {

    userModel
      .getUserById(id)
      .then((user) => {
        res.render("upgrade.ejs", {isLoggedIn: true, isAdmin: isAdmin, vip : user.vip});
      })
      .catch((errMsg) => {
        res.redirect("/");
      });

  }else{
    res.redirect("/");
  }
};

// ---------------------
export const getMyAccountPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (id) {

    userModel
      .getUserById(id)
      .then((user) => {
        res.render("myaccount.ejs", {isLoggedIn: true, isAdmin: isAdmin, user : user});
      })
      .catch((errMsg) => {
        res.redirect("/");
      });

  }else{
    res.redirect("/");
  }
};

export const logOut = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  res.clearCookie(COOKIE_NAME).redirect("/");  

};
