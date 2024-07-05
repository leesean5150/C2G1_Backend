import express from 'express';
import WorkshopController from '../controllers/WorkshopController.js';
import verifyAdmin from '../../middlewares/verifyAdmin.js';

const router = express.Router();

router.post('/', WorkshopController.createWorkshop);
router.get('/', WorkshopController.getAllWorkshops);
router.get('/get/:id', WorkshopController.getOneWorkshop);
router.get('/search', WorkshopController.searchWorkshops);
router.delete('/del/:id', verifyAdmin, WorkshopController.deleteWorkshop); // verifyAdmin

export { router as WorkshopRouter };