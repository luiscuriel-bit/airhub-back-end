import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController';
import verifyToken from '../middleware/verify-token';
import { asyncWrapper } from '../utils/asyncWrapper';

router.post('/signup', asyncWrapper(authController.signup));
router.post('/signin', asyncWrapper(authController.signin));
router.post('/refresh-token', asyncWrapper(authController.refreshToken));
router.post('/signout', asyncWrapper(authController.signout));
router.put('/update', verifyToken as any, asyncWrapper(authController.updateUser));

export default router;