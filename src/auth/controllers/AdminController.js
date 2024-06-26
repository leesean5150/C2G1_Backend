import express from "express";
import jwt from "jsonwebtoken";


import { User } from "../models/User.js";


async function verifyAdmin(req,res,next){
  try{
    const token = req.cookies.token;
    if (!token){
      return res.status(401).json({message: "Unauthorized"});
    }
    const decoded = jwt.verify(token, process.env.KEY);
    const user = await User.findOne({username: decoded.username}).exec();
    if (user.role !== "admin"){
      return res.status(403).json({message: "Forbidden"});
    }
    req.user = user;
    next();
  }catch(err){
    return res.status(401).json({status: false,message: "Unauthorized"}); 
  }
}


async function getAllTrainers(req,res){
  try{
    const trainers = await User.find({role: "trainer"}).exec();
    return res.json({status: true, trainers});
  }catch(e){
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}

async function adminActivateTrainer(req,res){
  try{
    const {id} = req.params;
    const trainer = await User.find({role:"trainer"}).findById(id).exec;
    if (!trainer){
      return res.status(404).json({message: "Trainer not found"});
    }
    if (trainer.status === "active"){
      return res.status(400).json({message: "Trainer is already active"});
    }
    trainer.status = "active";
    await trainer.save()
    return res.json({status: true, message: "Trainer activated successfully"});
  } catch(e){
    console.log(e);
    return res.status(500).json({message: e}); }
}


async function adminUpdateTrainer(req,res){
  try{
    const {id} = req.params;
    const {username, email, password, active} = req.body;
    await User.find({role:"trainer"}).findByIdAndUpdate(id,{username, email, password, active});
    return res.json({status: true, message: "Trainer updated successfully"});
  }catch(e){
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}

async function adminCreateTrainer(req,res){
  try{
    const {username, email, password} = req.body;
    const trainer = new User({username, email, password, role: "trainer"});
    await trainer.save();
    return res.json({status: true, message: "Trainer added successfully"});
  }catch(e){
    console.log(e);
    return res.status(500).json({message: e});
  }

}

async function adminDeleteTrainer(req,res){
  try{
    const {id} = req.params;
    await Trainer.findByIdAndUpdate(id, { active: false });
  }catch(e){
    console.log(e);
    return res.status(500).json({message:e});
  }
}

export default {
  verifyAdmin,
  getAllTrainers,
  adminActivateTrainer,
  adminUpdateTrainer,
  adminDeleteTrainer,
  adminCreateTrainer
};
