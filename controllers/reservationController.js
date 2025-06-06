// controllers/reservationController.js
const Reservation = require('../models/reservation');
const Catway = require('../models/Catway');

// 📋 GET - Toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (err) {
    console.error("❌ Erreur getAllReservations:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔍 GET - Une réservation par ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
    res.status(200).json(reservation);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID invalide' });
    }
    console.error('❌ Erreur getReservationById:', err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📆 GET - Réservations pour un catway spécifique
exports.getReservationsForCatway = async (req, res) => {
  try {
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.status(200).json(reservations);
  } catch (err) {
    console.error("❌ Erreur getReservationsForCatway:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ➕ POST - Créer une réservation générique
exports.createReservation = async (req, res) => {
  try {
    const { catwayNumber, clientName, boatName, checkIn, checkOut } = req.body;

    const catway = await Catway.findOne({ catwayNumber });
    const catwayId = catway ? catway._id : undefined;

    const conflict = catwayId ? await Reservation.findOne({
      catway: catwayId,
      $or: [
        { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
      ]
    }) : null;

    if (conflict) {
      return res.status(400).json({ message: 'Ce catway est déjà réservé sur cette période.' });
    }

    const reservation = new Reservation({
      catway: catwayId,
      catwayNumber,
      clientName,
      boatName,
      checkIn,
      checkOut
    });

    await reservation.save();

    if (catway) {
      catway.catwayState = 'réservé';
      await catway.save();
    }

    if (req.headers.accept?.includes('text/html')) {
      req.flash('success', 'Réservation enregistrée');
      return req.session.save(() => res.redirect(`/reservations/${reservation._id}`));
    }

    res.status(201).json({ reservation });
  } catch (err) {
    console.error('❌ Erreur createReservation:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ➕ POST - Créer une réservation par ID catway
exports.createReservationForCatway = async (req, res) => {
  try {
    const catwayId = req.params.id;
    const { clientName, boatName, checkIn, checkOut } = req.body;

    const catway = await Catway.findById(catwayId);
    if (!catway) return res.status(404).json({ message: 'Catway introuvable' });

    const conflict = await Reservation.findOne({
      catway: catwayId,
      $or: [
        { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
      ]
    });

    if (conflict) {
      return res.status(400).json({ message: 'Ce catway est déjà réservé sur cette période.' });
    }

    const reservation = new Reservation({
      catway: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName,
      boatName,
      checkIn,
      checkOut
    });

    await reservation.save();

    catway.catwayState = 'réservé';
    await catway.save();

    res.status(201).json(reservation);
  } catch (err) {
    console.error('❌ Erreur createReservationForCatway:', err.message);
    res.status(500).json({ message: 'Erreur création réservation' });
  }
};

// ❌ DELETE - Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.reservationId);
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });

    if (reservation.catway) {
      await Catway.findByIdAndUpdate(reservation.catway, { catwayState: 'bon état' });
    }

    res.status(200).json({ message: 'Réservation supprimée' });
  } catch (err) {
    console.error('❌ Erreur deleteReservation:', err.message);
    res.status(500).json({ message: 'Erreur suppression' });
  }
};