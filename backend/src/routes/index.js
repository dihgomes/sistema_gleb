import express from 'express';
import authRoutes from './authRoutes.js';
import carteiraRoutes from './carteiraRoutes.js';
import publicRoutes from './publicRoutes.js';
import adminRoutes from './adminRoutes.js';
import pinRoutes from './pinRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/admin/carteiras', carteiraRoutes);

router.use('/admin', adminRoutes);

router.use('/admin', pinRoutes);

router.use('/public', publicRoutes);

export default router;
