import express from 'express';
import WorkshopController from '../controllers/WorkshopController.js';

const router = express.Router();

router.post('/', WorkshopController.createWorkshop);
router.get('/', WorkshopController.getWorkshops);
router.post('/get', WorkshopController.getWorkshopById);
router.post('/del', WorkshopController.deleteWorkshop);

export { router as WorkshopRouter };