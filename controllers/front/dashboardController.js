// controllers/front/dashboardController.js

import axios from 'axios';

/**
 * Affiche la page d'accueil publique (non authentifiée).
 * @param {express.Request} req - Requête HTTP.
 * @param {express.Response} res - Réponse HTTP.
 */
export function index(req, res) {
  res.render('index', {
    message: req.flash('error'),
    user: null
  });
}

/**
 * Affiche le tableau de bord utilisateur avec la liste des catways.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function dashboard(req, res) {
  const { token, user } = res.locals;
  const response = await axios.get('http://localhost:5000/api/catways', {
    headers: { Authorization: `Bearer ${token}` }
  });
  res.render('dashboard', { catways: response.data, user });
}

/**
 * Affiche la liste des catways avec leur état de réservation.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function catwayList(req, res) {
  const [catwaysRes, reservationsRes] = await Promise.all([
    axios.get('http://localhost:5000/api/catways', { headers: { Authorization: `Bearer ${res.locals.token}` } }),
    axios.get('http://localhost:5000/api/reservations', { headers: { Authorization: `Bearer ${res.locals.token}` } })
  ]);

  const catwaysWithState = catwaysRes.data.map(c => {
    const reserved = reservationsRes.data.some(r =>
      r.catway?.toString() === c._id?.toString() || r.catwayNumber === c.catwayNumber
    );
    return { ...c, catwayState: reserved ? 'réservé' : (c.catwayState || 'bon état') };
  });

  res.render('catways', {
    catways: catwaysWithState.sort((a, b) => a.catwayNumber - b.catwayNumber),
    reservations: reservationsRes.data,
    user: res.locals.user
  });
}

/**
 * Affiche les détails d’un catway et sa réservation si elle existe.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function catwayDetail(req, res) {
  const [catwayRes, reservationsRes] = await Promise.all([
    axios.get(`http://localhost:5000/api/catways/${req.params.id}`, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    }),
    axios.get('http://localhost:5000/api/reservations', {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    })
  ]);

  const catway = catwayRes.data;
  const reservation = reservationsRes.data.find(r =>
    r.catway?.toString() === catway._id?.toString() || r.catwayNumber === catway.catwayNumber
  );

  res.render('catway', {
    catway,
    reservation: reservation || null,
    user: res.locals.user,
    success: req.flash('success'),
    error: req.flash('error')
  });
}

/**
 * Effectue une réservation de catway.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function reserveCatway(req, res) {
  try {
    const catwayRes = await axios.get(`http://localhost:5000/api/catways/${req.params.id}`, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });

    const payload = {
      ...req.body,
      catway: catwayRes.data._id,
      catwayNumber: catwayRes.data.catwayNumber
    };

    await axios.post(`http://localhost:5000/api/catways/${req.params.id}/reservations`, payload, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });

    req.flash('success', 'Réservation créée');
    res.redirect(`/catways/${req.params.id}`);
  } catch (err) {
    req.flash('error', 'Erreur création réservation');
    res.redirect(`/catways/${req.params.id}`);
  }
}

/**
 * Affiche la liste de toutes les réservations.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function reservationList(req, res) {
  const [catwaysRes, reservationsRes] = await Promise.all([
    axios.get('http://localhost:5000/api/catways', { headers: { Authorization: `Bearer ${res.locals.token}` } }),
    axios.get('http://localhost:5000/api/reservations', { headers: { Authorization: `Bearer ${res.locals.token}` } })
  ]);

  res.render('reservations', {
    reservations: reservationsRes.data,
    catways: catwaysRes.data,
    user: res.locals.user
  });
}

/**
 * Affiche les détails d’une réservation avec les infos du catway lié.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function reservationDetail(req, res) {
  const reservationRes = await axios.get(`http://localhost:5000/api/reservations/${req.params.reservationId}`, {
    headers: { Authorization: `Bearer ${res.locals.token}` }
  });

  const catwayList = await axios.get(`http://localhost:5000/api/catways`, {
    headers: { Authorization: `Bearer ${res.locals.token}` }
  });

  const catway = catwayList.data.find(c =>
    reservationRes.data.catway?.toString() === c._id?.toString() ||
    c.catwayNumber === reservationRes.data.catwayNumber
  );

  res.render('reservation', {
    reservation: reservationRes.data,
    catway,
    user: res.locals.user
  });
}

/**
 * Crée une nouvelle réservation via POST.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function createReservation(req, res) {
  try {
    const result = await axios.post('http://localhost:5000/api/reservations', req.body, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });

    const resa = result.data;
    res.redirect(`/reservations/${resa._id}`);
  } catch (err) {
    req.flash('error', 'Erreur création réservation');
    res.redirect('/dashboard');
  }
}

/**
 * Supprime une réservation existante via POST.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function deleteReservation(req, res) {
  try {
    const { reservationId } = req.body;

    await axios.delete(`http://localhost:5000/api/reservations/${reservationId}`, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });

    req.flash('success', 'Réservation supprimée');
  } catch (err) {
    req.flash('error', 'Erreur suppression réservation');
  }

  res.redirect('/reservations');
}

/**
 * Déconnecte l'utilisateur et détruit la session.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export function logout(req, res) {
  req.session.destroy(() => res.redirect('/'));
}

/**
 * Affiche les données de session et de debug.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export function debug(req, res) {
  res.json({
    session: req.session,
    token: req.session?.token,
    user: res.locals.user
  });
}
