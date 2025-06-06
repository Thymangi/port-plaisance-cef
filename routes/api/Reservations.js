//globalReservationRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Reservation = require('../../models/Reservation');
const { createReservation } = require('../../controllers/reservationController');

// 🔐 Middleware d’authentification appliqué à toutes les routes
router.use(auth);

// 🔍 Obtenir toutes les réservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find(); // Ajoute .populate('catway') si besoin
    res.status(200).json(reservations);
  } catch (err) {
    console.error('❌ Erreur get /reservations :', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔍 Obtenir une réservation par ID
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable' });
    }
    res.status(200).json(reservation);
  } catch (err) {
    console.error('❌ Erreur get /reservations/:id :', err.message);
    res.status(400).json({ message: 'ID invalide', error: err.message });
  }
});

// ➕ Créer une réservation
router.post('/', createReservation);

// 🛠 Route de test/debug
router.get('/debug', (req, res) => {
  res.send('✅ Route /reservations opérationnelle');
});

module.exports = router;