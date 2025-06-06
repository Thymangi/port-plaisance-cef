//models/catwaynpm .js
const mongoose = require('mongoose');

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

module.exports = mongoose.models.Catway || mongoose.model('Catway', catwaySchema);
