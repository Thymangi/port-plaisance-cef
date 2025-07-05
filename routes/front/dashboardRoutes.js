// routes/front/dashboardRoutes.js
import express from 'express';
import * as dashboardController from '../../controllers/front/dashboardController.js';
import isAuthenticated from '../../middleware/auth.js';

const router = express.Router();

// Accueil public
router.get('/', dashboardController.index);

// Accueil authentifié
router.get('/dashboard', isAuthenticated, dashboardController.dashboard);

// Catways
router.get('/catways', isAuthenticated, dashboardController.catwayList);
router.get('/catways/:id', isAuthenticated, dashboardController.catwayDetail);
router.post('/catways/:id/reservations', isAuthenticated, dashboardController.reserveCatway);

// Réservations
router.get('/reservations', isAuthenticated, dashboardController.reservationList);
router.get('/reservations/:reservationId', isAuthenticated, dashboardController.reservationDetail);
router.post('/reservations', isAuthenticated, dashboardController.createReservation);
router.post('/reservations/delete', isAuthenticated, dashboardController.deleteReservation);

// Divers
router.get('/logout', dashboardController.logout);
router.get('/debug/session', dashboardController.debug);

// Documentation
router.get('/documentation', (req, res) => {
  res.render('documentation');
});

export default router;