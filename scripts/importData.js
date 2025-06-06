const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const catways = require('../seed/catways.json');
const reservations = require('../seed/reservations.json');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connexion MongoDB OK');

    await Catway.deleteMany();
    await Reservation.deleteMany();

    await Catway.insertMany(catways);
    await Reservation.insertMany(reservations);

    console.log('Données importées avec succès');
    process.exit();
  })
  .catch((err) => {
    console.error('Échec de l\'importation', err);
    process.exit(1);
  });
