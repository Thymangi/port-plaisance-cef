//models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
   email: {
  type: String,
  unique: true,
  sparse: true,     // permet d'éviter l'erreur si l'email est vide
  default: null,    // s'assure que l'absence = null
  trim: true        // supprime les espaces autour
},
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true // éviter les espaces
  }
}, { timestamps: true });

// Hash du mot de passe
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Vérification mot de passe
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
