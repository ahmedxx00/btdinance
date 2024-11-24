import { Router } from "express";
import adminProtect from "../../middlewares/admin-protect.js";
import * as ourUsersController from "./our_users.controller.js";

const router = Router();



// router.put("/editemail", adminProtect, ourUsersController.editEmail);



export default router;
