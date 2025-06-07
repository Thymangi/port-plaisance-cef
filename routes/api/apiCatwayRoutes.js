// 📁 routes/api/apiCatwayRoutes.js

const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../middleware/auth');
const catwayApiController = require('../../controllers/api/apiControllerCatway');

router.get('/', isAuthenticated, catwayApiController.getAllCatways);
router.get('/:id', isAuthenticated, catwayApiController.getCatwayById);
router.post('/', isAuthenticated, catwayApiController.createCatway);
router.put('/:id', isAuthenticated, catwayApiController.updateCatway);
router.delete('/:id', isAuthenticated, catwayApiController.deleteCatway);

router.post('/:id/reservations', isAuthenticated, catwayApiController.createReservationForCatway);

module.exports = router;
