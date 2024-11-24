import {Router} from 'express';
import protect from '../../middlewares/protect.js';
import * as adminController from './admin.controller.js';
const router = Router()

router.get('/edit_withdraw_networks',protect,adminController.getEditWithdrawNetworksPage)
router.get('/edit_deposit_networks',protect,adminController.getEditDepositNetworksPage)
router.get('/edit_conversion_rates',protect,adminController.getEditConversionRatesPage)
router.get('/edit_memberships',protect,adminController.getEditMembershipsPage)
router.get('/edit_our_users',protect,adminController.getEditOurUsersPage)
router.get('/vip_requests',protect,adminController.getVipRequestsPage)




export default router;