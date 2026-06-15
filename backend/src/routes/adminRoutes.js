import express from 'express';
import { authenticateToken, isAdmin } from '../middlewares/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

router.get('/usuarios', authenticateToken, isAdmin, adminController.listarUsuarios);
router.post('/usuarios', authenticateToken, isAdmin, adminController.criarUsuario);
router.delete('/usuarios/:id', authenticateToken, isAdmin, adminController.deletarUsuario);

export default router;
