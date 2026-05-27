import express from 'express';
import carteiraController from '../controllers/carteiraController.js';
import authMiddleware from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', upload.single('foto'), carteiraController.criar.bind(carteiraController));

router.get('/', carteiraController.listar.bind(carteiraController));

router.get('/:id', carteiraController.buscarPorId.bind(carteiraController));

router.put('/:id', upload.single('foto'), carteiraController.atualizar.bind(carteiraController));

router.patch('/:id/status', carteiraController.atualizarStatus.bind(carteiraController));

router.delete('/:id', carteiraController.deletar.bind(carteiraController));

router.post('/:id/gerar-qrcode', carteiraController.gerarQRCode.bind(carteiraController));

export default router;
