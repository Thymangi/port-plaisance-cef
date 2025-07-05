const reservationService = require('../services/reservationService');

exports.listReservations = reservationService.listReservations;
exports.reservationDetail = reservationService.getReservationDetail;
exports.createReservation = reservationService.createReservation;
exports.deleteReservation = reservationService.deleteReservation;