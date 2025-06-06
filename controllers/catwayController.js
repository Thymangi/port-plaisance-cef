const Catway = require('../models/catway');
const Reservation = require('../models/reservation');

// 📋 GET all catways
exports.getAllCatways = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.status(200).json(catways);
  } catch (err) {
    console.error('❌ Erreur getAllCatways:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🔍 GET catway by ID
exports.getCatwayById = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).json({ message: 'Catway introuvable' });
    res.status(200).json(catway);
  } catch (err) {
    console.error('❌ Erreur getCatwayById:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ➕ POST create catway
exports.createCatway = async (req, res) => {
  try {
    const { catwayNumber, type, catwayState } = req.body;
    const catway = new Catway({ catwayNumber, type, catwayState });
    await catway.save();
    console.log('✅ Catway créé :', catway);

    if (req.headers.accept?.includes('text/html')) {
      req.flash('success', 'Catway créé avec succès');
      return res.redirect('/dashboard');
    }

    res.status(201).json(catway);
  } catch (err) {
    console.error('❌ Erreur création catway :', err.message);

    if (req.headers.accept?.includes('text/html')) {
      req.flash('error', 'Erreur lors de la création du catway');
      return res.redirect('/dashboard');
    }

    res.status(400).json({ message: 'Erreur création catway' });
  }
};

// 🔁 POST update catway state
exports.updateCatwayState = async (req, res) => {
  try {
    const { id, catwayState } = req.body;
    const catway = await Catway.findByIdAndUpdate(id, { catwayState }, { new: true });
    if (!catway) return res.status(404).json({ message: 'Catway introuvable' });
    res.status(200).json(catway);
  } catch (err) {
    console.error('❌ Erreur updateCatwayState:', err.message);
    res.status(500).json({ message: 'Erreur mise à jour catway' });
  }
};

// ❌ POST delete catway
exports.deleteCatway = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Catway.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: 'Catway introuvable' });
    res.status(200).json({ message: 'Catway supprimé' });
  } catch (err) {
    console.error('❌ Erreur deleteCatway:', err.message);
    res.status(500).json({ message: 'Erreur suppression catway' });
  }
};

// 📆 GET all reservations for a catway
exports.getReservationsForCatway = async (req, res) => {
  try {
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.status(200).json(reservations);
  } catch (err) {
    console.error('❌ Erreur getReservationsForCatway:', err.message);
    res.status(500).json({ message: 'Erreur récupération réservations' });
  }
};

// 🔍 GET reservation detail from a catway
exports.getReservationDetailForCatway = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.rid);
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
    res.status(200).json(reservation);
  } catch (err) {
    console.error('❌ Erreur getReservationDetailForCatway:', err.message);
    res.status(500).json({ message: 'Erreur détail réservation' });
  }
};

// ➕ POST create reservation for a catway
exports.createReservationForCatway = async (req, res) => {
  try {
    const { clientName, boatName, checkIn, checkOut } = req.body;
    const catwayId = req.params.id;
    const catway = await Catway.findById(catwayId);

    if (!catway) return res.status(404).json({ message: 'Catway introuvable' });

    if (!catway.catwayNumber) {
      req.flash('error', "Ce catway n’a pas de numéro, réservation impossible.");
      return res.redirect('/catways');
    }

    const conflit = await Reservation.findOne({
      catway: catwayId,
      $or: [
        { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
      ]
    });

    if (conflit) {
      req.flash('error', 'Ce catway est déjà réservé sur cette période.');
      return res.redirect(`/catways/${catwayId}`);
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

    req.flash('success', 'Réservation enregistrée avec succès.');
    res.redirect(`/catways/${catwayId}`);
  } catch (err) {
    console.error("❌ Erreur createReservationForCatway:", err.message);
    req.flash('error', 'Échec de la réservation.');
    res.redirect(`/catways/${req.params.id}`);
  }
};

// ❌ POST delete reservation for a catway
exports.deleteReservationForCatway = async (req, res) => {
  try {
    const result = await Reservation.findByIdAndDelete(req.params.rid);
    if (!result) return res.status(404).json({ message: 'Réservation introuvable' });
    res.status(200).json({ message: 'Réservation supprimée' });
  } catch (err) {
    console.error('❌ Erreur deleteReservationForCatway:', err.message);
    res.status(500).json({ message: 'Erreur suppression réservation' });
  }
};