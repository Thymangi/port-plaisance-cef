// frontRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const flash = require('connect-flash');
const isAuthenticated = require('../middleware/auth');
const Catway = require('../models/Catway');

// Page d'accueil
router.get('/', (req, res) => {
  res.render('index', { message: req.flash('error'), user: null });
});

// Login
router.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error'), name: '', user: null });
});

router.post('/login', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5000/auth/login', req.body);
    req.session.token = response.data.token;

    if (!req.session.token) throw new Error('Token manquant');

    req.session.save(err => {
      if (err) {
        req.flash('error', 'Problème session');
        return res.redirect('/login');
      }
      res.redirect('/dashboard');
    });
  } catch (err) {
    req.flash('error', 'Identifiants incorrects');
    res.redirect('/login');
  }
});

// Register
router.get('/register', (req, res) => {
  res.render('register', { message: req.flash('error'), name: '', email: '', user: null });
});

router.post('/register', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5000/auth/register', req.body);
    req.session.token = response.data.token;
    res.redirect('/dashboard');
  } catch (err) {
    req.flash('error', 'Erreur lors de l’inscription');
    res.render('register', { message: req.flash('error'), name: '', email: '', user: null });
  }
});

// Dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/catways', {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });
    res.render('dashboard', { user: res.locals.user, catways: response.data });
  } catch (err) {
    req.flash('error', 'Erreur chargement dashboard');
    res.redirect('/login');
  }
});

// Liste Catways
router.get('/catways', isAuthenticated, async (req, res) => {
  try {
    const [catwaysRes, reservationsRes] = await Promise.all([
      axios.get('http://localhost:5000/api/catways', { headers: { Authorization: `Bearer ${res.locals.token}` } }),
      axios.get('http://localhost:5000/api/reservations', { headers: { Authorization: `Bearer ${res.locals.token}` } })
    ]);

    const catways = catwaysRes.data;
    const reservations = reservationsRes.data;

    const catwaysWithStatus = catways.map(c => {
      const reserved = reservations.some(r =>
        (r.catway && r.catway.toString() === c._id.toString()) ||
        (r.catwayNumber === c.catwayNumber)
      );
      return { ...c, catwayState: reserved ? 'réservé' : (c.catwayState || 'bon état') };
    });

    res.render('catways', {
      catways: catwaysWithStatus.sort((a, b) => a.catwayNumber - b.catwayNumber),
      reservations,
      user: req.user || { name: 'Utilisateur' }
    });
  } catch (err) {
    req.flash('error', 'Erreur chargement catways');
    res.redirect('/dashboard');
  }
});

// Détail Catway
router.get('/catways/:id', isAuthenticated, async (req, res) => {
  try {
    const [catwayRes, reservationsRes] = await Promise.all([
      axios.get(`http://localhost:5000/api/catways/${req.params.id}`, { headers: { Authorization: `Bearer ${res.locals.token}` } }),
      axios.get('http://localhost:5000/api/reservations', { headers: { Authorization: `Bearer ${res.locals.token}` } })
    ]);

    const catway = catwayRes.data;
    const reservation = reservationsRes.data.find(r =>
      (r.catway && r.catway.toString() === catway._id.toString()) ||
      r.catwayNumber === catway.catwayNumber
    );

    res.render('catway', {
      catway,
      reservation: reservation || null,
      user: req.user || { name: 'Utilisateur' },
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (err) {
    req.flash('error', 'Catway introuvable');
    res.redirect('/catways');
  }
});

// Réservations
router.get('/reservations', isAuthenticated, async (req, res) => {
  try {
    const [catwaysRes, reservationsRes] = await Promise.all([
      axios.get('http://localhost:5000/api/catways', { headers: { Authorization: `Bearer ${res.locals.token}` } }),
      axios.get('http://localhost:5000/api/reservations', { headers: { Authorization: `Bearer ${res.locals.token}` } })
    ]);

    res.render('reservations', {
      reservations: reservationsRes.data,
      catways: catwaysRes.data,
      user: req.user || { name: 'Utilisateur' }
    });
  } catch (err) {
    req.flash('error', 'Erreur chargement réservations');
    res.redirect('/dashboard');
  }
});

// Créer réservation
router.post('/reservations', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5000/api/reservations', req.body, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });

    const resa = response.data.reservation || response.data;
    res.redirect(`/reservations/${resa._id}`);
  } catch (err) {
    req.flash('error', 'Erreur création réservation');
    res.redirect('/dashboard');
  }
});

// Réservation depuis Catway
router.post('/catways/:id/reservations', isAuthenticated, async (req, res) => {
  try {
    const catwayId = req.params.id;

    const catwayRes = await axios.get(`http://localhost:5000/api/catways/${catwayId}`, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });

    const catway = catwayRes.data;

    const reservationPayload = {
      ...req.body,
      catway: catwayId,
      catwayNumber: catway.catwayNumber
    };

    await axios.post(`http://localhost:5000/api/catways/${catwayId}/reservations`, reservationPayload, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });

    req.flash('success', 'Réservation créée avec succès');
    res.redirect(`/catways/${catwayId}`);
  } catch (err) {
    console.error('❌ Erreur post réservation catway :', err.message);
    req.flash('error', 'Erreur lors de la réservation');
    res.redirect(`/catways/${req.params.id}`);
  }
});

// Supprimer réservation
router.post('/reservations/delete', isAuthenticated, async (req, res) => {
  try {
    await axios.delete(`http://localhost:5000/api/reservations/${req.body.reservationId}`, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });
    req.flash('success', 'Réservation supprimée');
  } catch (err) {
    req.flash('error', 'Erreur suppression');
  }
  res.redirect('/reservations');
});

// Détail Réservation
router.get('/reservations/:reservationId', isAuthenticated, async (req, res) => {
  try {
    const resaRes = await axios.get(`http://localhost:5000/api/reservations/${req.params.reservationId}`, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });

    const reservation = resaRes.data;
    const catwayRes = await axios.get('http://localhost:5000/api/catways', {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });

    const catway = catwayRes.data.find(c =>
      (reservation.catway && c._id === reservation.catway) ||
      c.catwayNumber === reservation.catwayNumber
    );

    res.render('reservation', {
      reservation,
      catway,
      user: req.user || { name: 'Utilisateur' }
    });
  } catch (err) {
    req.flash('error', 'Réservation introuvable');
    res.redirect('/reservations');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// Debug
router.get('/debug/session', (req, res) => {
  res.json({ session: req.session, token: req.session?.token, user: res.locals.user });
});

module.exports = router;
