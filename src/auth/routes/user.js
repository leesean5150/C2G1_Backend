import express from "express";
import nodeMailer from "nodemailer";

import UserController from "../controllers/UserController.js";
import AdminController from "../controllers/AdminController.js";

const router = express.Router();

router.post("/signup", UserController.signup);

router.post("/login/:loginType", UserController.login);

router.post("/forgot-password", UserController.forgotpassword);

router.post("/reset-password/:token", UserController.resetpassword);

router.get("/verify", UserController.verifyuser, async (req, res) => {
  return res.json({ status: true, message: "Authorized", role: req.user.role });
});

router.get("/logout", UserController.logout);


router.patch("/trainers/activate/:id", AdminController.verifyAdmin, AdminController.adminActivateTrainer); 
router.get("/trainers", AdminController.verifyAdmin, AdminController.getAllTrainers);
router.patch("/trainers/:id", AdminController.verifyAdmin, AdminController.adminUpdateTrainer); 
router.patch("/trainers/:id", AdminController.verifyAdmin, AdminController.adminDeleteTrainer); 
router.post("/trainers/create/:id", AdminController.verifyAdmin, AdminController.adminCreateTrainer);

export { router as UserRouter };
