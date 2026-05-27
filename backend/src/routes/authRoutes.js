import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/auth.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/login', loginLimiter, authController.login.bind(authController));

router.post('/trocar-senha', authMiddleware, authController.trocarSenha.bind(authController));

export default router;
