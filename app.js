// app.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connectDB } from './config/db.js';

// Résolution du __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connexion MongoDB
connectDB();

const app = express();

// Middlewares globaux
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());

// Sessions + Flash avec persistance MongoDB
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
app.use(flash());

// JWT Middleware
app.use((req, res, next) => {
  const token = req.session?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.user = decoded;
      res.locals.token = token;
    } catch (err) {
      console.warn(" Token invalide :", err.message);
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

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/front/dashboardRoutes.js';
import catwayRoutes from './routes/catwayRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import apiCatwayRoutes from './routes/api/apiCatwayRoutes.js';
import apiReservationRoutes from './routes/api/apiReservationRoutes.js';

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/catways', catwayRoutes);
app.use('/reservations', reservationRoutes);
app.use('/api/catways', apiCatwayRoutes);
app.use('/api/reservations', apiReservationRoutes);

// Export de l'app pour les tests
export default app;

// Lancement du serveur
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(` Serveur lancé sur http://localhost:${PORT}`);
  });
}