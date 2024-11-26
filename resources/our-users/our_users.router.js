import { Router } from "express";
import adminProtect from "../../middlewares/admin-protect.js";
import * as ourUsersController from "./our_users.controller.js";
import {check_signup_name_availability} from "../auth/auth.controller.js";


const router = Router();


router.put("/editemail", adminProtect, ourUsersController.editEmail);
router.put("/editvip", adminProtect, ourUsersController.editVip);
router.put("/edit_wallet_available", adminProtect, ourUsersController.editWalletAv);
router.delete("/remove_wallet", adminProtect, ourUsersController.removeWallet);
router.get("/plain_pass", adminProtect, ourUsersController.getPlainPass);
router.get("/plain_key", adminProtect, ourUsersController.getPlainKey);
router.post("/add_wallet", adminProtect, ourUsersController.addWallet);

// send { name } in req.body while typing
// router.post(
//     "/check_our_user_name_availability",
//     check_signup_name_availability
//   ); // check_signup_name_availability
  
router.post("/add_new_our_user", adminProtect, ourUsersController.addNewOurUser);



export default router;
