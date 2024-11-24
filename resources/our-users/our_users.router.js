import { Router } from "express";
import protect from "../../middlewares/protect.js";
import * as ourUsersController from "./our_users.controller.js";

const router = Router();



// router.put("/editemail", protect, myAccountController.editEmail);



export default router;
