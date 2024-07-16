import express from "express";
import graphController from "../Controllers/graphController.js";

const router = express.Router();

router.get("/getGraphWorkshopSummary", graphController.getGraphWorkshopSummary);
router.get("/getTrainerGraph", graphController.getTrainerGraph);

export { router as graphRouter };
