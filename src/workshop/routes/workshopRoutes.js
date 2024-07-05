import express from 'express';
import WorkshopController from '../controllers/WorkshopController.js';
import verifyAdmin from '../../middlewares/verifyAdmin.js';

const router = express.Router();

router.post('/', WorkshopController.createWorkshop);
router.get('/', WorkshopController.getAllWorkshops);
router.get('/get/:id', WorkshopController.getOneWorkshop);
router.get('/search', WorkshopController.searchWorkshops);
router.patch('/approve/:id', verifyAdmin, WorkshopController.approveRequest); //this makes request[approval] = 'submitted' -> 'approved'
router.patch('/reject/:id', verifyAdmin, WorkshopController.rejectRequest); //this makes request[approval] = 'submitted' -> 'rejected' + provide (or store) reason for rejection by req.body(JSON)
router.delete('/del/:id', verifyAdmin, WorkshopController.deleteWorkshop); // verifyAdmin

export { router as WorkshopRouter };