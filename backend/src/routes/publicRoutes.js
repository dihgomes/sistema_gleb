import express from 'express';
import publicController from '../controllers/publicController.js';
import { publicLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/carteira/:codigo_unico', publicLimiter, publicController.buscarCarteira.bind(publicController));

export default router;
