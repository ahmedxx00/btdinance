import {Router} from 'express';
import protect from '../../middlewares/protect.js';
import * as adminController from './admin.controller.js';
const router = Router()

router.get('/edit_withdraw_networks',protect,adminController.getEditWithdrawNetworksPage)
router.get('/edit_deposit_networks',protect,adminController.getEditDepositNetworksPage)




export default router;