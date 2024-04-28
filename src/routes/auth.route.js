import { Router } from 'express';
import { createUser, loginUser, forgotPassword } from '../controllers/auth.controller.js';

const router = Router();

router.post('/userRegister', createUser);
router.post('/userLogin', loginUser);
router.post('/forgot', forgotPassword);

export default router;
