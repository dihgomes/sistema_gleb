const express = require('express');
const authRoutes = require('./authRoutes');
const carteiraRoutes = require('./carteiraRoutes');
const publicRoutes = require('./publicRoutes');

const router = express.Router();

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas administrativas de carteiras
router.use('/admin/carteiras', carteiraRoutes);

// Rotas públicas
router.use('/public', publicRoutes);

module.exports = router;
