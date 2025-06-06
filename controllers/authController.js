const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    const user = new User({ name, email, password });
    await user.save();

    console.log('✅ Nouvel utilisateur créé :', user);

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    console.error('❌ Erreur dans register:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateUser = async (req, res) => {
  const { id, name, password, email } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    console.log('✅ Utilisateur mis à jour :', user.name);

    res.redirect('/dashboard');
  } catch (err) {
    console.error('❌ Erreur lors de la mise à jour de l’utilisateur :', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.login = async (req, res) => {
  let { name, password } = req.body;

  try {
    name = name?.trim();
    if (!name || !password) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    const user = await User.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (!user) {
      console.warn('❌ Utilisateur introuvable :', name);
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn('❌ Mot de passe incorrect pour :', name);
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    console.log('✅ Authentification réussie pour :', user.name);

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    console.error('💥 Erreur serveur login :', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
