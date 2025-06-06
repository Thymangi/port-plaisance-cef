//catwayRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Contrôleurs
const {
  getAllCatways,
  getCatwayById,
  createCatway,
  updateCatwayState,
  deleteCatway,
  getReservationsForCatway,
  getReservationDetailForCatway,
  createReservationForCatway,
  deleteReservationForCatway
} = require('../../controllers/catwayController');

// 🛡️ Middleware d'authentification appliqué globalement
router.use(auth);

// 📦 Routes principales Catways
router.get('/', getAllCatways);                 // GET tous les catways
router.get('/:id', getCatwayById);              // GET un catway par ID
router.post('/', createCatway);                 // POST création d’un catway
router.post('/update', updateCatwayState);      // POST mise à jour état catway
router.post('/delete', deleteCatway);           // POST suppression catway

// 📅 Routes imbriquées : réservations liées à un catway
router.get('/:id/reservations', getReservationsForCatway);            // GET toutes les réservations d’un catway
router.get('/:id/reservations/:rid', getReservationDetailForCatway);  // GET détail d’une réservation spécifique
router.post('/:id/reservations', createReservationForCatway);         // POST création réservation pour un catway
router.post('/:id/reservations/:rid/delete', deleteReservationForCatway); // POST suppression d’une réservation

module.exports = router;