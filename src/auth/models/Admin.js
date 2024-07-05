import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  superAdmin: { type: Boolean, required: true, default: false },
  role: { type: String, default: "admin" },
});

const AdminModel = mongoose.model("Admin", adminSchema);

export { AdminModel as Admin };
