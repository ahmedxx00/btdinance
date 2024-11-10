import {Router} from 'express';
import protect from '../../middlewares/protect.js';
import * as upgradeController from './upgrade.controller.js';

const router = Router();

// router.put('/membership/:vip',protect,upgradeController.u)



export default router;