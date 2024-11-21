import {Router} from 'express';
import protect from '../../middlewares/protect.js';
import * as upgradeController from './upgrade.controller.js';

const router = Router();

router.get('/membership/:vip',protect,upgradeController.getSpecificUpgradePage)
router.get('/confirm-upgrade',protect,upgradeController.getSpecificConfirmUpgradePage)
router.post('/payvip',protect,upgradeController.payVip)
router.post('/confirm_transaction',protect,upgradeController.confirmTransaction)


// router.post('/membership/buywithusdt',protect,upgradeController.buyWithUSDT)
// router.post('/membership/buywithbtc',protect,upgradeController.buyWithBTC)
// router.post('/membership/buywitheth',protect,upgradeController.buyWithETH)





export default router;