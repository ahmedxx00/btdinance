import { Router } from "express";
import protect from "../../middlewares/protect.js";
import * as transactionIdController from "./transaction_id.controller.js";

const router = Router();

// router.put("/editemail", protect, transactionIdController.editEmail);

export default router;
