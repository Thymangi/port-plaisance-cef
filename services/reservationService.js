import axios from 'axios';

export async function listReservations(req, res) {
  try {
    const [catwaysRes, reservationsRes] = await Promise.all([
      axios.get('http://localhost:5000/api/catways', {
        headers: { Authorization: `Bearer ${res.locals.token}` }
      }),
      axios.get('http://localhost:5000/api/reservations', {
        headers: { Authorization: `Bearer ${res.locals.token}` }
      })
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
}

export async function getReservationDetail(req, res) {
  try {
    const resaRes = await axios.get(`http://localhost:5000/api/reservations/${req.params.reservationId}`, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });
    const reservation = resaRes.data;

    const catwayRes = await axios.get('http://localhost:5000/api/catways', {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });
    const catway = catwayRes.data.find(
      c => c._id === reservation.catway || c.catwayNumber === reservation.catwayNumber
    );

    res.render('reservation', { reservation, catway, user: req.user || { name: 'Utilisateur' } });
  } catch (err) {
    req.flash('error', 'Réservation introuvable');
    res.redirect('/reservations');
  }
}

export async function createReservation(req, res) {
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
}

export async function deleteReservation(req, res) {
  try {
    const resaRes = await axios.get(`http://localhost:5000/api/reservations/${req.body.reservationId}`, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });
    const reservation = resaRes.data;
    const catwayId = reservation.catway;

    await axios.delete(`http://localhost:5000/api/reservations/${req.body.reservationId}`, {
      headers: { Authorization: `Bearer ${res.locals.token}` }
    });

    req.flash('success', 'Réservation supprimée');
    res.redirect(`/catways/${catwayId}`);
  } catch (err) {
    req.flash('error', 'Erreur suppression');
    res.redirect('/reservations');
  }
}
