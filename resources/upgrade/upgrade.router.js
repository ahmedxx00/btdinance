import {Router} from 'express';
import protect from '../../middlewares/protect.js';
import * as upgradeController from './upgrade.controller.js';

const router = Router();

router.get('/membership/:vip',protect,upgradeController.getSpecificUpgradePage)
router.post('/membership/buywithusdt',protect,upgradeController.buyWithUSDT)





export default router;