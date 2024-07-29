import mongoose from "mongoose";
import { Counter } from "./Counter.js";
const Schema = mongoose.Schema;

const workshopRequestSchema = new Schema(
  {
    request_id: {
      type: String,
    },
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
    utilisation: {
      type: [],
      default: [
        {
          hours: 0,
          utilisation_details: "",
        },
        {
          hours: 0,
          utilisation_details: "",
        },
        {
          hours: 0,
          utilisation_details: "",
        },
        {
          hours: 0,
          utilisation_details: "",
        },
      ],
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

workshopRequestSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { _id: 'workshop_request_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.request_id = `WR${counter.seq.toString().padStart(4, '0')}`;
  }
  next(); 
});

const WorkshopRequestModel = mongoose.model(
  "WorkshopRequest",
  workshopRequestSchema
);

export { WorkshopRequestModel as WorkshopRequest };
