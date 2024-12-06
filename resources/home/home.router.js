import { Router } from "express";
const router = Router();

import homeProtect from "../../middlewares/home-protect.js";
import protect from "../../middlewares/protect.js";

import * as homeController from "./home.controller.js";
import { changeLanguage } from "./language.controller.js"; // Import the new controller

router.get("/", homeProtect, (req, res, next) => {
  if (req.payload && req.payload != null) {
    // logged in
    let isAdmin = req.payload.isAdmin;
    res.render("home.ejs", {
      isLoggedIn: true,
      isAdmin: isAdmin,
      na: req.t("nav_bar.nav_btns.nav_about"),
      nex: req.t("nav_bar.nav_btns.nav_ex"),
      ntr: req.t("nav_bar.nav_btns.nav_tr"),
      nwith: req.t("nav_bar.nav_btns.nav_with"),
      ndep: req.t("nav_bar.nav_btns.nav_dep"),
      nhm: req.t("nav_bar.nav_btns.nav_hm"),
      lgt: req.t("nav_bar.logout_tit"),

      acc: req.t("home.main_buttons.acc"),
      ex: req.t("home.main_buttons.ex"),
      trns: req.t("home.main_buttons.trns"),
      hwith: req.t("home.main_buttons.hwith"),
      dep: req.t("home.main_buttons.dep"),
      up: req.t("home.main_buttons.up"),
    });
  } else {
    // not logged in
    res.render("home.ejs", {
      na: req.t("nav_bar.nav_btns.nav_about"),
      nex: req.t("nav_bar.nav_btns.nav_ex"),
      ntr: req.t("nav_bar.nav_btns.nav_tr"),
      nwith: req.t("nav_bar.nav_btns.nav_with"),
      ndep: req.t("nav_bar.nav_btns.nav_dep"),
      nhm: req.t("nav_bar.nav_btns.nav_hm"),
      lgt: req.t("nav_bar.logout_tit"),

      acc: req.t("home.main_buttons.acc"),
      ex: req.t("home.main_buttons.ex"),
      trns: req.t("home.main_buttons.trns"),
      hwith: req.t("home.main_buttons.hwith"),
      dep: req.t("home.main_buttons.dep"),
      up: req.t("home.main_buttons.up"),
    });
  }
});

router.get("/change-language", changeLanguage); // Use the extracted controller function

router.get("/about", homeProtect, homeController.getAboutPage);

router.get("/exchange", protect, homeController.getExchangePage);
router.get("/withdraw", protect, homeController.getWithdrawPage);
router.get("/deposit", protect, homeController.getDepositPage);
router.get("/transfer", protect, homeController.getTransferPage);
router.get("/upgrade", protect, homeController.getUpgradePage);

router.get("/myaccount", protect, homeController.getMyAccountPage);

router.get("/logout", protect, homeController.logOut);

export default router;
