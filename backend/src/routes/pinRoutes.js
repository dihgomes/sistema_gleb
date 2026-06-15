import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import * as pinController from '../controllers/pinController.js';

const router = express.Router();

router.post('/pins', authenticateToken, pinController.criarPin);
router.get('/pins', authenticateToken, pinController.listarPins);
router.delete('/pins/:id', authenticateToken, pinController.revogarPin);

export default router;
