const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

// GET /api/public/carteira/:codigo_unico
router.get('/carteira/:codigo_unico', publicController.buscarCarteira.bind(publicController));

module.exports = router;
