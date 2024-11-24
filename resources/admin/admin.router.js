import {Router} from 'express';
import adminProtect from '../../middlewares/admin-protect.js';
import * as adminController from './admin.controller.js';
const router = Router()

router.get('/edit_withdraw_networks',adminProtect,adminController.getEditWithdrawNetworksPage)
router.get('/edit_deposit_networks',adminProtect,adminController.getEditDepositNetworksPage)
router.get('/edit_conversion_rates',adminProtect,adminController.getEditConversionRatesPage)
router.get('/edit_memberships',adminProtect,adminController.getEditMembershipsPage)
router.get('/edit_our_users',adminProtect,adminController.getEditOurUsersPage)
router.get('/vip_requests',adminProtect,adminController.getVipRequestsPage)




export default router;