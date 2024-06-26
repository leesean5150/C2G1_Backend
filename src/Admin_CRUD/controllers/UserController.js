import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodeMailer from "nodemailer";

import { User } from "../models/User.js";

async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    const uniqueUsername = await User.findOne({ username }).exec();
    const uniqueEmail = await User.findOne({ email }).exec();

    if (uniqueUsername) {
      return res.json({ message: "Username is already in use" });
    }
    if (uniqueEmail) {
      return res.json({ message: "Email is already in use" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashpassword,
      role: "client",
    });

    await newUser.save();
    return res.json({
      status: true,
      message: "record registered successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}

async function login(req, res) {
  try {
    const { loginType } = req.params;
    const { username, password } = req.body;
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.json({ message: "Invalid username" });
    }
    if (loginType !== user.role) {
      return res.json({ message: "Credentials provided is not for a " + loginType + " account"});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ message: "Invalid password" });
    }

    const token = jwt.sign({ username: user.username }, process.env.KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { maxAge: 360000, httpOnly: true });
    return res.json({ status: true, message: "login successful" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}

async function forgotpassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.json({ message: "Invalid email" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });

    var transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      text: process.env.FRONT_END_URL + `/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        return res.json({ status: false, message: "Error sending email" });
      } else {
        return res.json({ status: true, message: "Email sent" });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}

async function resetpassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });
    return res.json({ status: true, message: "Password has been updated" });
  } catch (err) {
    return res.json({ status: false, message: "Invalid token" });
  }
}

async function verifyuser(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "Unauthorized" });
    }
    const decoded = await jwt.verify(token, process.env.KEY);
    const verifiedUser = await User.findOne({
      username: decoded.username,
    }).exec();
    req.user = {
      id: verifiedUser.id,
      role: verifiedUser.role,
    };
    next();
  } catch (err) {
    return res.json({ status: false, message: "Unauthorized" });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("token");
    return res.json({ status: true, message: "Logged out" });
  } catch (err) {
    return res.json({ status: false, message: "Unauthorized" });
  }
}

export default {
  signup,
  login,
  forgotpassword,
  resetpassword,
  verifyuser,
  logout,

};
