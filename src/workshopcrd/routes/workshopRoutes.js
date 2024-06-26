import express from 'express';
import WorkshopController from '../controllers/WorkshopController.js';
import verifyAdmin from '../../middlewares/verifyAdmin.js';

const router = express.Router();

router.post('/', WorkshopController.createWorkshop);
router.get('/', WorkshopController.getWorkshops);
router.post('/get', WorkshopController.getWorkshopById);
router.post('/del', verifyAdmin, WorkshopController.deleteWorkshop); // verifyAdmin

export { router as WorkshopRouter };