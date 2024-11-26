import { Router } from "express";
import * as authController from "./auth.controller.js";
import authProtect from "../../middlewares/auth-protect.js";
const router = Router();


router.get("/",authProtect, authController.getAuthPage); // getting the page
router.get("/forgot-password",authProtect, authController.getForgotPasswordPage); // forgot-password page
router.get("/terms-conditions", authProtect,authController.getTermsConditionsPage); // terms-conditions page


router.get("/admin/dashboard/vegas",authProtect, authController.getAdminLoginPage); // admin login page


router.post("/login", authController.Login); // Login
router.post("/admin-login", authController.AdminLogin); // Admin Login
router.post("/signup", authController.SignUp); // Signup
router.post(
  "/check_signup_name_availability",
  authController.check_signup_name_availability
); // check_signup_name_availability





export default router; // equivalent to [ module.exports = router; ]
