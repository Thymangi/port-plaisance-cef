// services/authService.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function authenticateUser(name, password) {
  const user = await User.findOne({ name });
  if (!user) throw new Error('Utilisateur non trouvé');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Mot de passe invalide');

  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { user, token };
}

export async function register({ name, email, password }) {
  const existing = await User.findOne({ name });
  if (existing) throw new Error('Ce nom est déjà utilisé');

  const user = new User({ name, email, password });
  await user.save();
  return user;
}