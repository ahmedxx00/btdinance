import { Router } from "express";
import protect from "../../middlewares/protect.js";
import * as myAccountController from "./myaccount.controller.js";

const router = Router();

router.put("/editemail", protect, myAccountController.editEmail);

export default router;
