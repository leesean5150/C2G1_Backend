import express from "express";
import graphController from "../Controllers/graphController.js";
import temp from "../Controllers/temp.js";

const router = express.Router();

router.get("/getWorkshopSummaryGraph", graphController.getWorkshopSummaryGraph);
router.get("/getTrainerGraph", graphController.getTrainerGraph);
router.get("/getTodayGraph", graphController.getTodayGraph);
router.get("/getYearsPieChartGraph", graphController.getYearsPieChartGraph);
router.get("/getTotalPieChartGraph", graphController.getTotalPieChartGraph);

router.get("/getWorkshopTrendDataGraph", temp.getWorkshopTrendDataGraph);
router.get("/getHCtotalPieData", temp.getHCtotalPieData);
router.get("/getHCyearsPieData", temp.getHCyearsPieData);
router.get("/getHCWorkshopTypesData", temp.getHCWorkshopTypesData);
router.get("/getHCClientTypesData", temp.getHCClientTypesData);
router.get("/getHCWorkshopTrendData", temp.getHCWorkshopTrendData);

export { router as graphRouter };
