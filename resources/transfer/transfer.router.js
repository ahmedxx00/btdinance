import {Router} from 'express';
import protect from '../../middlewares/protect.js';

const router = Router()

import * as transferController from './transfer.controller.js';


router.get('/cur_type/:cur_type',protect,transferController.getSpecificTransferPage);
router.post('/toname',protect,transferController.transferToName);
router.post('/toemail',protect,transferController.transferToEmail);







export default router;