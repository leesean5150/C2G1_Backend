import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "client" },
});

const ClientModel = mongoose.model("Client", clientSchema);

export { ClientModel as Client };
