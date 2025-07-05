//models/reservation.js
import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  catway: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catway',
    required: true
  },
  catwayNumber: {
    type: Number,
    required: true
  },
  clientName: {
    type: String,
    required: true,
  },
  boatName: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

// création du modèle ou récupération du modèle existant
const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);

// export en ESM
export default Reservation;