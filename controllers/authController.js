//authController.js
import * as authService from '../services/authService.js';

// Page d'accueil (formulaire de connexion intégré)
export const index = (req, res) => {
  res.render('index', {
    message: req.flash('error'),
    user: req.user || null,
    name: ''
  });
};

// POST /login
export const postLogin = async (req, res) => {
  let { name, password } = req.body;
  name = name.trim().toLowerCase();

  try {
    const { user, token } = await authService.authenticateUser(name, password);

    req.session.regenerate((err) => {
      if (err) {
        console.error('❌ Erreur lors de la régénération de session :', err);
        req.flash('error', 'Erreur de session');
        return res.redirect('/');
      }

      req.session.token = token;

      req.session.save((err) => {
        if (err) {
          console.error('❌ Erreur sauvegarde session :', err);
          req.flash('error', 'Erreur de session');
          return res.redirect('/');
        }

        req.flash('success', `Bienvenue ${user.name}`);
        return res.redirect('/dashboard');
      });
    });

  } catch (err) {
    console.error("❌ Erreur login :", err.message);
    req.flash('error', 'Identifiants invalides');
    res.render('index', {
      message: req.flash('error'),
      name,
      user: null
    });
  }
};

// Formulaire d'inscription
export const getRegister = (req, res) => {
  res.render('register', {
    message: req.flash('error'),
    success: req.flash('success'),
    name: '',
    email: '',
    user: null
  });
};

// Traitement de l’inscription
export const postRegister = async (req, res) => {
  let { name, email, password } = req.body;
  name = name.trim().toLowerCase();

  try {
    await authService.register({ name, email, password });
    req.flash('success', 'Compte créé. Connectez-vous.');
    res.redirect('/');
  } catch (err) {
    req.flash('error', err.message);
    res.render('register', {
      message: req.flash('error'),
      success: [],
      name,
      email,
      user: null
    });
  }
};

// Déconnexion
export const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};