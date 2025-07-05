// routes/api/apiCatwayRoutes.js

import express from 'express';
import * as apiCatwayController from '../../controllers/api/apiControllerCatway.js';

const router = express.Router();

router.get('/', apiCatwayController.list);
router.get('/:id', apiCatwayController.detail);
router.post('/', apiCatwayController.create);
router.put('/:id', apiCatwayController.update);
router.delete('/:id', apiCatwayController.remove);

export default router;