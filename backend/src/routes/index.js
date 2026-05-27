import express from 'express';
import authRoutes from './authRoutes.js';
import carteiraRoutes from './carteiraRoutes.js';
import publicRoutes from './publicRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/admin/carteiras', carteiraRoutes);

router.use('/public', publicRoutes);

export default router;
