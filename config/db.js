const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("❌ MONGO_URI est manquant dans le fichier .env");
    }

    // Connexion MongoDB avec base de données explicitement définie
    await mongoose.connect(uri, {
      dbName: 'port_plaisance',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on('connected', () => {
      console.log('✅ Connexion MongoDB réussie à :', db.name);
    });

    db.on('error', (err) => {
      console.error('❌ Erreur de connexion MongoDB :', err.message);
    });

  } catch (error) {
    console.error('💥 Échec de la connexion à MongoDB :', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
