import mongoose from "mongoose";
const Schema = mongoose.Schema;

const workshopRequestSchema = new Schema(
  {
    company_role: {
      type: String,
    },
    company: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone_number: {
      type: Number,
    },
    pax: {
      type: Number,
      required: true,
    },
    deal_potential: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    request_message: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "submitted",
    },
    reject_reason: {
      type: String,
      default: "",
    },
    workshop_data: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkshopData",
    },
    trainers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trainer" }],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
  },
  {
    timestamps: true,
  }
);

const WorkshopRequestModel = mongoose.model(
  "WorkshopRequest",
  workshopRequestSchema
);

export { WorkshopRequestModel as WorkshopRequest };
