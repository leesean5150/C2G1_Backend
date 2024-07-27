import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  //id_ will be automatically generated by MongoDB
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  client_type: { type: String, required: true, default: "Executive" },
  password: { type: String, required: true },
  country: { type: String, required: true },
  role: { type: String, default: "client" },
  workshop_request: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkshopRequest",
    },
  ],
});

const ClientModel = mongoose.model("Client", clientSchema);

export { ClientModel as Client };
