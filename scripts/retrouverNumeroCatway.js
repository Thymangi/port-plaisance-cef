// scripts/fixMissingCatwayNumbers.js
const mongoose = require('mongoose');
const Reservation = require('./models/reservation');
const Catway = require('./models/catway');

const MONGODB_URI = 'mongodb://localhost:27017/ton_nom_de_base'; // remplace ici

async function updateReservations() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const reservations = await Reservation.find({ catwayNumber: { $exists: false } });

    for (const reservation of reservations) {
      if (!reservation.catway) continue;

      const catway = await Catway.findById(reservation.catway);
      if (!catway || !catway.catwayNumber) continue;

      reservation.catwayNumber = catway.catwayNumber;
      await reservation.save();
      console.log(`🔧 Mis à jour réservation ${reservation._id} avec catwayNumber ${catway.catwayNumber}`);
    }

    console.log('✅ Mise à jour terminée');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Erreur mise à jour:', err.message);
    process.exit(1);
  }
}

updateReservations();
