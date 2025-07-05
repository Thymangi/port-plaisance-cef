// scripts/setUserPassword.js
// scripts/forcedPassword.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const [,, identifier, plainPassword] = process.argv;

if (!identifier || !plainPassword) {
  console.error("❌ Utilisation : npm run set-password -- <nom-ou-email> <nouveau-mdp>");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'port_plaisance'
    });
    console.log("✅ Connecté à MongoDB");
  } catch (err) {
    console.error("❌ Échec de connexion :", err.message);
    process.exit(1);
  }
};

const updatePassword = async () => {
  await connectDB();

  const user = await User.findOne({
    $or: [
      { name: identifier.toLowerCase() },
      { email: identifier.toLowerCase() }
    ]
  });

  if (!user) {
    console.error("❌ Utilisateur introuvable :", identifier);
    return process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Mise à jour directe sans déclencher pre('save')
  await User.updateOne(
    { _id: user._id },
    { $set: { password: hashedPassword } }
  );

  console.log(`✅ Mot de passe mis à jour pour ${user.name} (${user.email || 'email inconnu'})`);
  process.exit(0);
};

updatePassword();
