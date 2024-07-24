import express from "express";
import graphController from "../Controllers/graphController.js";

const router = express.Router();

router.get("/getWorkshopSummaryGraph", graphController.getWorkshopSummaryGraph);
router.get("/getTrainerGraph", graphController.getTrainerGraph);
router.get("/getTodayGraph", graphController.getTodayGraph);
router.get("/getYearsPieChartGraph", graphController.getYearsPieChartGraph);
router.get("/getTotalPieChartGraph", graphController.getTotalPieChartGraph);

export { router as graphRouter };
