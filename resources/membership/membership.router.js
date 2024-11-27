import { Router } from "express";
import adminProtect from "../../middlewares/admin-protect.js";
import * as membershipController from "./membership.controller.js";

const router = Router();


router.put("/editfee", adminProtect, membershipController.editFee);
router.put("/editmaxwithdraw", adminProtect, membershipController.editMaxWithdraw);
router.put("/editmaxdeposit", adminProtect, membershipController.editMaxDeposit);
router.put("/editmaxreceive", adminProtect, membershipController.editMaxReceive);
router.put("/editmaxtransfer", adminProtect, membershipController.editMaxTransfer);

router.delete("/remove_membership", adminProtect, membershipController.removeMembership);

router.post("/add_membership", adminProtect, membershipController.addMembership);




export default router;
