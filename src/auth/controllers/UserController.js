import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodeMailer from "nodemailer";

import { Client } from "../models/Client.js";
import { Trainer } from "../models/Trainer.js";
import { Admin } from "../models/Admin.js";

/**
 * signup()
 * Input: json object for client by body (JSON body)
 * Output: None
 * Description: with provided JSON, query db to create a new client. (NOTE: Only applies to client)
 */
async function signup(req, res) {
  try {
    const { username, email, password, fullname, country, client_type } = req.body;
    const uniqueUsername = await Client.findOne({ username }).exec();
    const uniqueEmail = await Client.findOne({ email }).exec();

    if (uniqueUsername) {
      return res.json({ message: "Username is already in use" });
    }
    if (uniqueEmail) {
      return res.json({ message: "Email is already in use" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newClient = new Client({
      username,
      email,
      password: hashpassword,
      fullname,
      country,
      client_type
    });

    await newClient.save();
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
/**
 * login()
 * Input: username and password by body (JSON body)
 * Output: None
 * Description: with provided JSON, query db to find a certain user and verify password.
 *              if successful, return a token. else, return error message.
 */
async function login(req, res) {
  try {
    const { loginType } = req.params;
    const { username, password } = req.body;
    let userModel;
    switch (loginType) {
      case "client":
        userModel = Client;
        break;
      case "trainer":
        userModel = Trainer;
        break;
      case "admin":
        userModel = Admin;
        break;
      default:
        return res.status(400).json({ message: "Invalid login type" });
    }
    const user = await userModel.findOne({ username }).exec();
    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }
    if (loginType !== user.role) {
      return res.status(401).json({
        message: "Credentials provided is not for a " + loginType + " account",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ username: user.username }, process.env.KEY);

    res.cookie("token", token, { maxAge: 86400000, httpOnly: true });
    return res.json({ status: true, message: "login successful" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}
/**
 * forgotpassword()
 * Input: email by body (JSON body)
 * Output: None
 * Description: with provided email, query db to find a certain user and send an email with a token.
 */
async function forgotpassword(req, res) {
  try {
    const { email } = req.body;
    const client = await Client.findOne({ email }).exec();
    if (!client) {
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
/**
 * resetpassword()
 * Input: password by body (JSON body)
 * Output: None
 * Description: with provided token, query db to find a certain user and update password.
 */
async function resetpassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password, 10);
    await Client.findByIdAndUpdate({ _id: id }, { password: hashPassword });
    return res.json({ status: true, message: "Password has been updated" });
  } catch (err) {
    return res.json({ status: false, message: "Invalid token" });
  }
}
/**
 * logout()
 * Input: None
 * Output: None
 * Description: clear cookie token.
 */
async function logout(req, res) {
  try {
    res.clearCookie("token");
    return res.json({ status: true, message: "Logged out" });
  } catch (err) {
    return res.json({ status: false, message: "Unauthorized" });
  }
}

/**
 * getUserIdByUsername()
 * Input: username by params (URL parameter)
 * Output: user ID
 * Description: with provided username, query db to find a certain user and return their ID.
 */
async function getUserIdByUsername(req, res) {
  try {
    const { username } = req.params;
    const user = await Client.findOne({ username }).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ userId: user._id });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}

export default {
  signup,
  login,
  forgotpassword,
  resetpassword,
  logout,
  getUserIdByUsername,
};
