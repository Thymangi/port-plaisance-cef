// scripts/fixUsers.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'port_plaisance',
    });

    console.log('🔧 Connexion à MongoDB réussie.');

    const users = await User.find();
    const updates = [];

    for (const user of users) {
      const originalName = user.name;
      const lowercaseName = originalName.toLowerCase();

      if (originalName !== lowercaseName) {
        user.name = lowercaseName;
        await user.save();
        updates.push({ id: user._id, before: originalName, after: lowercaseName });
      }
    }

    if (updates.length === 0) {
      console.log('✅ Tous les noms sont déjà en lowercase.');
    } else {
      console.log(`🛠️ ${updates.length} utilisateur(s) corrigé(s) :`);
      console.table(updates);
    }

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error('❌ Erreur correction utilisateurs :', err.message);
    process.exit(1);
  }
};

run();