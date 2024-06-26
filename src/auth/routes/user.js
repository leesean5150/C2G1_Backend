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

// Admin CRUD routes
router.post("/trainers/activate", verifyAdmin, AdminController.AdminActivateTrainer); 
router.post("/trainers", verifyAdmin, AdminController.AdminActivateTrainer);
router.get("/trainers", verifyAdmin, AdminController.getAllTrainers);
router.put("/trainers/:id", verifyAdmin, AdminController.AdminUpdateTrainer); 
router.delete("/trainers/:id", verifyAdmin, AdminController.AdminDeleteTrainer); 

export { router as UserRouter };
