import express from "express";
import productsController from "../controllers/Products.Controller.js";
const router = express.Router();

router.get("/workshopGraph", productsController.workshop);
router.get("/trainerGraph", productsController.trainer);
router.get("/todayGraph", productsController.today);
router.post("/", productsController.save);

export default router;
