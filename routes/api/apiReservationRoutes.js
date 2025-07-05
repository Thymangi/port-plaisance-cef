// routes/api/apiReservationRoutes.js

import express from 'express';
import isAuthenticated from '../../middleware/auth.js';
import * as reservationApiController from '../../controllers/api/apiControllerReservation.js';

const router = express.Router();

router.get('/', isAuthenticated, reservationApiController.getAllReservations);
router.get('/:id', isAuthenticated, reservationApiController.getReservationById);
router.post('/', isAuthenticated, reservationApiController.createReservation);
router.delete('/:id', isAuthenticated, reservationApiController.deleteReservation);

export default router;