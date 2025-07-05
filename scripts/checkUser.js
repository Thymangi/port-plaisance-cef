// scripts/checkUsers.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'; // adapte le chemin si besoin

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'port_plaisance',
    });

    console.log('🔍 Connexion réussie à MongoDB.');

    const users = await User.find({});
    const incorrect = [];

    users.forEach(user => {
      const isNameLowercase = user.name === user.name.toLowerCase();
      const isPasswordHashed = typeof user.password === 'string' && user.password.startsWith('$2');

      if (!isNameLowercase || !isPasswordHashed) {
        incorrect.push({
          id: user._id,
          name: user.name,
          email: user.email || '—',
          nameNotLowercase: !isNameLowercase,
          passwordNotHashed: !isPasswordHashed,
        });
      }
    });

    if (incorrect.length === 0) {
      console.log('✅ Tous les utilisateurs sont valides.');
    } else {
      console.log('⚠️ Utilisateurs incorrects :');
      console.table(incorrect);
    }

    process.exit();
  } catch (err) {
    console.error('❌ Erreur :', err.message);
    process.exit(1);
  }
};

checkUsers();