// 📁 services/catwaysService.js
const axios = require('axios');

exports.fetchCatwaysWithReservationStatus = async (token) => {
  const [catwaysRes, reservationsRes] = await Promise.all([
    axios.get('http://localhost:5000/api/catways', { headers: { Authorization: `Bearer ${token}` } }),
    axios.get('http://localhost:5000/api/reservations', { headers: { Authorization: `Bearer ${token}` } })
  ]);

  const catways = catwaysRes.data;
  const reservations = reservationsRes.data;

  return catways.map(c => {
    const reserved = reservations.some(r =>
      (r.catway === c._id || r.catwayNumber === c.catwayNumber)
    );
    return { ...c, catwayState: reserved ? 'réservé' : 'bon état' };
  });
};

exports.fetchCatwayDetailWithReservation = async (id, token) => {
  const [catwayRes, reservationsRes] = await Promise.all([
    axios.get(`http://localhost:5000/api/catways/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
    axios.get('http://localhost:5000/api/reservations', { headers: { Authorization: `Bearer ${token}` } })
  ]);

  const catway = catwayRes.data;
  const reservation = reservationsRes.data.find(r =>
    r.catway === catway._id || r.catwayNumber === catway.catwayNumber
  );

  return { catway, reservation: reservation || null };
};

exports.reserveCatway = async (catwayId, payload, token) => {
  const catwayRes = await axios.get(`http://localhost:5000/api/catways/${catwayId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const catway = catwayRes.data;

  const reservationPayload = {
    ...payload,
    catway: catwayId,
    catwayNumber: catway.catwayNumber
  };

  const reservationRes = await axios.post(`http://localhost:5000/api/catways/${catwayId}/reservations`, reservationPayload, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return reservationRes.data;
};
