// config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return; // évite les doubles connexions pendant les tests

  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI est manquant dans .env');

    await mongoose.connect(uri, { dbName: 'port_plaisance' });

    const db = mongoose.connection;
    db.on('connected', () => {
      console.log('✅ Connexion MongoDB réussie à :', db.name);
      isConnected = true;
    });

    db.on('error', (err) => {
      console.error('❌ Erreur de connexion MongoDB :', err.message);
    });

  } catch (error) {
    console.error('❌ Échec de la connexion MongoDB :', error.message);
    process.exit(1);
  }
};

const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('📴 Connexion MongoDB fermée');
    isConnected = false;
  }
};

export { connectDB, closeDB };