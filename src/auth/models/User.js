import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["client", "trainer", "admin"] },
});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel as User };
