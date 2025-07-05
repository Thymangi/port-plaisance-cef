// controllers/api/apiControllerCatway.js

/**
 * @file Contrôleur API pour la gestion des catways.
 * @module controllers/api/apiControllerCatway
 */

import Catway from '../../models/Catway.js';
import Reservation from '../../models/Reservation.js';

/**
 * Liste tous les catways.
 * @route GET /api/catways
 * @param {Request} req
 * @param {Response} res
 */
export async function list(req, res) {
  const catways = await Catway.find();
  res.json(catways);
}

/**
 * Retourne le détail d’un catway spécifique.
 * @route GET /api/catways/:id
 * @param {Request} req
 * @param {Response} res
 */
export async function detail(req, res) {
  const catway = await Catway.findById(req.params.id);
  if (!catway) return res.status(404).json({ message: 'Introuvable' });
  res.json(catway);
}

/**
 * Crée un nouveau catway.
 * @route POST /api/catways
 * @param {Request} req
 * @param {Response} res
 */
export async function create(req, res) {
  const catway = new Catway(req.body);
  await catway.save();
  res.status(201).json(catway);
}

/**
 * Met à jour un catway existant.
 * @route PUT /api/catways/:id
 * @param {Request} req
 * @param {Response} res
 */
export async function update(req, res) {
  const updated = await Catway.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
}

/**
 * Supprime un catway.
 * @route DELETE /api/catways/:id
 * @param {Request} req
 * @param {Response} res
 */
export async function remove(req, res) {
  await Catway.findByIdAndDelete(req.params.id);
  res.json({ message: 'Supprimé' });
}

/**
 * Crée une réservation liée à un catway.
 * @route POST /api/catways/:id/reservations
 * @param {Request} req
 * @param {Response} res
 */
export async function createReservationForCatway(req, res) {
  const catway = await Catway.findById(req.params.id);
  if (!catway) return res.status(404).json({ message: 'Catway introuvable' });

  const newReservation = new Reservation({
    catway: catway._id,
    catwayNumber: catway.catwayNumber,
    clientName: req.body.clientName,
    boatName: req.body.boatName,
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut
  });

  await newReservation.save();
  res.status(201).json(newReservation);
}