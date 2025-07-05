// routes/authRoutes.js
import express from 'express';
import {
  index,
  postLogin,
  getRegister,
  postRegister,
  logout
} from '../controllers/authController.js';


const router = express.Router();

router.get('/', index);
router.post('/', postLogin);
router.get('/register', getRegister);
router.post('/register', postRegister);
router.get('/logout', logout);

export default router;