import express from 'express';
import authRoutes from './authRoutes.js';
import carteiraRoutes from './carteiraRoutes.js';
import publicRoutes from './publicRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/admin/carteiras', carteiraRoutes);

router.use('/admin', adminRoutes);

router.use('/public', publicRoutes);

export default router;
