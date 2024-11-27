import { Router } from "express";
import adminProtect from "../../middlewares/admin-protect.js";
import * as conversionRatesController from "./conversion_rates.controller.js";

const router = Router();

router.post("/add_or_update", adminProtect, conversionRatesController.addOrUpdateConvRate);
router.delete("/remove_conv_rate", adminProtect, conversionRatesController.removeConvRate);

export default router;
