import { Router } from "express";
import adminProtect from "../../middlewares/admin-protect.js";
import * as transactionIdController from "./transaction_id.controller.js";

const router = Router();

router.put("/set_done_and_upgrade_user", adminProtect , transactionIdController.setDoneAndUpgradeUser);
router.delete("/deleteIt", adminProtect , transactionIdController.deleteTransactionDoc);


export default router;
