// routes/reservationRoutes.js
import express from 'express';
import * as reservationController from '../controllers/reservationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, reservationController.list);
router.get('/:reservationId', auth, reservationController.detail);
router.post('/', auth, reservationController.create);
router.post('/delete', auth, reservationController.deleteReservation);

export default router;