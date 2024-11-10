import {Router} from 'express';
import protect from '../../middlewares/protect.js';

const router = Router()

import * as withdrawController from './withdraw.controller.js';


router.get('/cur_type/:cur_type',protect,withdrawController.getSpecificWithdrawPage);
router.post('/currency',protect,withdrawController.withdrawCurrency);







export default router;