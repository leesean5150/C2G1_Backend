import mongoose from "mongoose";
import { type } from "os";
const Schema = mongoose.Schema;

const notifSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
  workshop: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop" },
  is_read_by_admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  is_read_by_client: {
    type: Boolean,
    required: true,
    default: false,
  },
  time_read_by_admin: {
    type: Date,
    default: null,
  },
  time_read_by_client: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const notificationModel = mongoose.model("notification", notifSchema);

export { notificationModel as notification };
