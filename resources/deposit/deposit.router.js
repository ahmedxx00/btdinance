import {Router} from 'express';
import protect from '../../middlewares/protect.js';

const router = Router()

import * as depositController from './deposit.controller.js';


router.get('/cur_type/:cur_type',protect,depositController.getSpecificDepositPage);
router.post('/currency',protect,depositController.depositCurrency);







export default router;