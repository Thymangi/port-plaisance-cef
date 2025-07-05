//models/catwaynpm .js
import mongoose from 'mongoose';

const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['long', 'short'],
    required: true,
  },
  catwayState: {
    type: String,
    default: 'Disponible',
  }
}, { timestamps: true });

// création du modèle
const Catway = mongoose.models.Catway || mongoose.model('Catway', catwaySchema);

// pour ESM
export default Catway;