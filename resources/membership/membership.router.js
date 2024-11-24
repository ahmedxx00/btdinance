import { Router } from "express";
import protect from "../../middlewares/protect.js";
import * as membershipController from "./membership.controller.js";

const router = Router();

// router.put("/editemail", protect, membershipController.editEmail);

export default router;
