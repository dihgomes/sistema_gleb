const express = require('express');
const carteiraController = require('../controllers/carteiraController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

// Todas as rotas de carteira são protegidas por autenticação
router.use(authMiddleware);

// POST /api/admin/carteiras - Criar carteira
router.post('/', upload.single('foto'), carteiraController.criar.bind(carteiraController));

// GET /api/admin/carteiras - Listar todas
router.get('/', carteiraController.listar.bind(carteiraController));

// GET /api/admin/carteiras/:id - Buscar por ID
router.get('/:id', carteiraController.buscarPorId.bind(carteiraController));

// PUT /api/admin/carteiras/:id - Atualizar carteira
router.put('/:id', upload.single('foto'), carteiraController.atualizar.bind(carteiraController));

// PATCH /api/admin/carteiras/:id/status - Atualizar status
router.patch('/:id/status', carteiraController.atualizarStatus.bind(carteiraController));

// DELETE /api/admin/carteiras/:id - Deletar (lógico)
router.delete('/:id', carteiraController.deletar.bind(carteiraController));

// POST /api/admin/carteiras/:id/gerar-qrcode - Gerar QR Code
router.post('/:id/gerar-qrcode', carteiraController.gerarQRCode.bind(carteiraController));

module.exports = router;
