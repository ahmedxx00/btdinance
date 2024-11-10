import { Router } from "express";
const router = Router();

import homeProtect from "../../middlewares/home-protect.js";
import protect from "../../middlewares/protect.js";

import * as homeController from './home.controller.js';

router.get("/", homeProtect, (req, res, next) => {
  if (req.payload && req.payload != null) {
    // logged in
    let isAdmin = req.payload.isAdmin;
    res.render("home.ejs", { isLoggedIn: true, isAdmin: isAdmin });
  } else {
    // not logged in
    res.render("home.ejs");
  }
});


router.get("/about", homeProtect, (req, res, next) => {
  if (req.payload && req.payload != null) {
    // logged in
    let isAdmin = req.payload.isAdmin;
    res.render("about.ejs", { isLoggedIn: true, isAdmin: isAdmin });
  } else {
    // not logged in
    res.render("about.ejs");
  }
});


router.get("/invest",protect, (req, res, next) => {
  res.render("invest.ejs");
});

router.get("/withdraw",protect, homeController.getWithdrawPage);
router.get("/deposit",protect, homeController.getDepositPage);
router.get("/transfer",protect, homeController.getTransferPage);
router.get("/upgrade",protect, homeController.getUpgradePage);

router.get("/myaccount",protect, homeController.getMyAccountPage);

router.get("/logout",protect, homeController.logOut);














export default router;
