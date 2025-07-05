// controllers/api/apiControllerReservation.js

/**
 * @file Contrôleur API pour la gestion des catways.
 * @module controllers/api/apiControllerCatway
 */

import Reservation from '../../models/Reservation.js';

/**
 * Retourne la liste de toutes les réservations.
 * @route GET /api/reservations
 * @param {Request} req
 * @param {Response} res
 */
export async function getAllReservations(req, res) {
  const reservations = await Reservation.find();
  res.json(reservations);
}

/**
 * Récupère une réservation par son ID.
 * @route GET /api/reservations/:id
 * @param {Request} req
 * @param {Response} res
 */
export async function getReservationById(req, res) {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return res.status(404).json({ message: 'Introuvable' });
  res.json(reservation);
}

/**
 * Crée une nouvelle réservation.
 * @route POST /api/reservations
 * @param {Request} req
 * @param {Response} res
 */
export async function createReservation(req, res) {
  const newResa = new Reservation(req.body);
  await newResa.save();
  res.status(201).json(newResa);
}

/**
 * Supprime une réservation existante.
 * @route DELETE /api/reservations/:id
 * @param {Request} req
 * @param {Response} res
 */
export async function deleteReservation(req, res) {
  await Reservation.findByIdAndDelete(req.params.id);
  res.json({ message: 'Supprimée' });
}
