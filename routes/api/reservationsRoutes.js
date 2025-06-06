//ReservationRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');
const {
  getAllReservations,
  getReservationById,
  createReservation,
  deleteReservation
} = require('../../controllers/reservationController');
const Reservation = require('../../models/Reservation');



// Applique auth à toutes les routes
router.use(auth);

// Routes REST
router.get('/', getAllReservations); // route utilisée par le front
router.get('/:reservationId', getReservationById);
router.post('/', createReservation);
router.delete('/:reservationId', deleteReservation);

module.exports = router;

