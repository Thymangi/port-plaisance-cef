// scripts/fixUserPasswords.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config(); // Charge .env

const MONGO_URI = process.env.MONGO_URI;
const DEFAULT_PASSWORD = 'changeme123';

async function main() {
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI manquant dans le fichier .env");

    await mongoose.connect(MONGO_URI, { dbName: 'port_plaisance' });
    console.log('✅ Connecté à MongoDB');

    const users = await User.find({});
    console.log(`👥 Utilisateurs trouvés : ${users.length}`);

    let updatedCount = 0;

    for (const user of users) {
      const password = user.password;

      // Si le mot de passe n'est pas un hash bcrypt (commence normalement par $2b$ ou $2a$)
      if (!password.startsWith('$2')) {
        const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);
        user.password = hashed;
        await user.save();
        console.log(`🔧 Mot de passe mis à jour pour : ${user.name}`);
        updatedCount++;
      }
    }

    console.log(`✅ Correction terminée. Utilisateurs mis à jour : ${updatedCount}`);
    process.exit(0);

  } catch (err) {
    console.error('❌ Erreur :', err.message);
    process.exit(1);
  }
}

main();