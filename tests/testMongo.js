// testMongo.js
const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/test_port_plaisance'; // change le nom de la DB si nécessaire

async function testConnection() {
  try {
    console.log(' Tentative de connexion à MongoDB...');
    await mongoose.connect(uri, {});

    console.log('Connexion réussie à MongoDB !');

    // Exemple : création d'une collection temporaire
    const Test = mongoose.model('Test', new mongoose.Schema({ nom: String }));
    await Test.create({ nom: 'Connexion OK' });

    console.log('Document inséré avec succès');

    await mongoose.disconnect();
    console.log(' Déconnexion MongoDB terminée.');
  } catch (err) {
    console.error(' Erreur de connexion à MongoDB :', err.message);
  }
}

testConnection();