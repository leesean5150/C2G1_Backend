import express from "express";
import nodeMailer from "nodemailer";

import UserController from "../controllers/UserController.js";

const router = express.Router();

router.post("/signup", UserController.signup);

router.post("/login", UserController.login);

router.post("/forgot-password", UserController.forgotpassword);

router.post("/reset-password/:token", UserController.resetpassword);

router.get("/verify", UserController.verifyuser, async (req, res) => {
  return res.json({ status: true, message: "Authorized", role: req.user.role});
});

router.get("/logout", UserController.logout);

export { router as UserRouter };
