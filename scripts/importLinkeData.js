const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const catwaysData = require('../seed/catways.json');
const reservationsData = require('../seed/reservations.json');

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connexion MongoDB réussie');

    await Catway.deleteMany();
    await Reservation.deleteMany();

    const insertedCatways = await Catway.insertMany(catwaysData);
    console.log(`📥 ${insertedCatways.length} catways insérés`);

    const reservationsWithIds = reservationsData.map((r) => {
      const catway = insertedCatways.find(c => c.catwayNumber === r.catwayNumber);
      return {
        catway: catway._id,
        clientName: r.clientName,
        boatName: r.boatName,
        checkIn: r.checkIn,
        checkOut: r.checkOut
      };
    });

    await Reservation.insertMany(reservationsWithIds);
    console.log(`📥 ${reservationsWithIds.length} réservations liées insérées`);

    process.exit();
  } catch (err) {
    console.error('❌ Importation échouée :', err);
    process.exit(1);
  }
};

importData();
