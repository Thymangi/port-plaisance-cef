// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

// 📦 Connexion MongoDB
connectDB();

const app = express();

// ✅ Middleware de base
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());

// ✅ Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'capitainerie',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: 'port_plaisance',
    ttl: 86400
  }),
  cookie: {
    maxAge: 86400000,
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  }
}));

// ✅ Flash messages
app.use(flash());

// ✅ JWT injection middleware
app.use((req, res, next) => {
  const token = req.session?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.user = decoded;
      res.locals.token = token;
    } catch (err) {
      console.warn("⚠️ Token invalide :", err.message);
      req.session.token = null;
      req.user = null;
      res.locals.user = null;
      res.locals.token = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
    res.locals.token = null;
  }

  next();
});

// ✅ Vue et fichiers statiques
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routing
app.use('/', require('./routes/frontRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/catways', require('./routes/api/catways'));
app.use('/api/reservations', require('./routes/api/reservationsRoutes'));

// ✅ Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));