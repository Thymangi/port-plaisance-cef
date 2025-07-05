// routes/catwayRoutes.js
import express from 'express';
import * as dashboardController from '../controllers/front/dashboardController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Vue catways (dashboard front)
router.get('/catways', auth, dashboardController.catwayList);
router.get('/catways/:id', auth, dashboardController.catwayDetail);
router.post('/catways/:id/reservations', auth, dashboardController.reserveCatway);

export default router;