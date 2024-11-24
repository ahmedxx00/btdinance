import { Router } from "express";
import protect from "../../middlewares/protect.js";
import * as conversionRatesController from "./conversion_rates.controller.js";

const router = Router();

// router.put("/editemail", protect, conversionRatesController.editEmail);

export default router;
