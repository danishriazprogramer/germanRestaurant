import { Router } from 'express';
import { createCategory } from '../../controllers/admin/category.controller.js';
import {getCategoires} from '../../controllers/admin/product.controller.js'

const router = new Router();

router.post('/create', createCategory);
router.get('/getCategoires', getCategoires)

export default router;
