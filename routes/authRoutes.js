//authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authController = require('../controllers/authController');

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/update', authController.updateUser);

module.exports = router;
