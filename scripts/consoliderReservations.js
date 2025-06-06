// scripts/consoliderReservations.js
const mongoose = require('mongoose');
const Reservation = require('../models/reservation');
const Catway = require('../models/Catway');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const reservations = await Reservation.find({ catway: { $exists: false }, catwayNumber: { $exists: true } });

    for (let resa of reservations) {
      const catway = await Catway.findOne({ catwayNumber: resa.catwayNumber });
      if (catway) {
        resa.catway = catway._id;
        await resa.save();
        console.log(`✔️ Résa ${resa._id} liée au catway ${catway._id}`);
      } else {
        console.warn(`⚠️ Aucun catway trouvé pour le numéro ${resa.catwayNumber}`);
      }
    }

    console.log('✅ Migration terminée');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur migration :', err.message);
    process.exit(1);
  }
})();