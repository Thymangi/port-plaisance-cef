// tests/app.test.mjs

import request from 'supertest';
import app from '../app.js';
import { connectDB, closeDB } from '../config/db.js';

describe('Tests API PortPlaisance', () => {
  let userId, catwayId, reservationId;
  let agent;

  before(async () => {
    await connectDB();
    agent = request.agent(app); // utilise supertest pour simuler les requêtes HTTP
  });

  after(async () => {
    await closeDB();
  });

  it('devrait créer un utilisateur', async () => {
    const res = await agent.post('/api/users').send({
      name: 'testuser',
      email: 'test@example.com',
      password: '123456'
    });
    if (res.status !== 201) console.error(res.body);
    userId = res.body._id;
  });

  it('devrait modifier un utilisateur par ID', async () => {
    const res = await agent.put(`/api/users/${userId}`).send({ name: 'updateduser' });
    if (res.status !== 200) console.error(res.body);
  });

  it('devrait supprimer un utilisateur par ID', async () => {
    const res = await agent.delete(`/api/users/${userId}`);
  });

  it('devrait créer un catway', async () => {
    const res = await agent.post('/api/catways').send({
      catwayNumber: 1,
      catwayState: 'bon état'
    });
    catwayId = res.body._id;
  });

  it('devrait modifier l’état d’un catway', async () => {
    const res = await agent.put(`/api/catways/${catwayId}`).send({
      catwayState: 'endommagé'
    });
  });

  it('devrait supprimer un catway', async () => {
    const res = await agent.delete(`/api/catways/${catwayId}`);
  });

  it('devrait enregistrer une réservation', async () => {
    const catRes = await agent.post('/api/catways').send({
      catwayNumber: 2,
      catwayState: 'bon état'
    });
    catwayId = catRes.body._id;

    const userRes = await agent.post('/api/users').send({
      name: 'resauser',
      email: 'resa@example.com',
      password: '123456'
    });
    userId = userRes.body._id;

    const res = await agent.post(`/api/catways/${catwayId}/reservations`).send({
      userId,
      startDate: '2025-07-01',
      endDate: '2025-07-05'
    });
    reservationId = res.body._id;
  });

  it('devrait supprimer une réservation', async () => {
    const res = await agent.delete(`/api/reservations/${reservationId}`);
  });

  it('devrait afficher les détails d’une réservation', async () => {
    const newRes = await agent.post(`/api/catways/${catwayId}/reservations`).send({
      userId,
      startDate: '2025-07-10',
      endDate: '2025-07-15'
    });
    reservationId = newRes.body._id;

    const res = await agent.get(`/api/reservations/${reservationId}`);
  });

  it('devrait lister tous les catways', async () => {
    const res = await agent.get('/api/catways');
  });

  it('devrait lister toutes les réservations', async () => {
    const res = await agent.get('/api/reservations');
  });
});
