import {Router} from 'express';
import protect from '../../middlewares/protect.js';

import * as exchangeController from './exchange.controller.js';
const router = Router()



router.post('/currency',protect,exchangeController.exchangeCurrency)

export default router;