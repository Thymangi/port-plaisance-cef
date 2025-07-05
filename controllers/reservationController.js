// controllers/reservationController.js
import * as reservationService from '../services/reservationService.js';

export async function list(req, res) {
  try {
    const { reservations, catways } = await reservationService.getAll(req.token);
    res.render('reservations', {
      reservations,
      catways,
      user: req.user || { name: 'Utilisateur' }
    });
  } catch {
    req.flash('error', 'Erreur chargement réservations');
    res.redirect('/dashboard');
  }
}

export function detail(req, res) {
  res.send(`Détail résa ${req.params.reservationId}`);
}

export async function create(req, res) {
  try {
    const resa = await reservationService.create(req.body, req.token);
    res.redirect(`/reservations/${resa._id}`);
  } catch {
    req.flash('error', 'Erreur création réservation');
    res.redirect('/dashboard');
  }
}

export async function deleteReservation(req, res) {
  try {
    await reservationService.delete(req.body.reservationId, req.token);
    req.flash('success', 'Réservation supprimée');
  } catch {
    req.flash('error', 'Erreur suppression');
  }
  res.redirect('/reservations');
}