import mongoose from "mongoose";
const Schema = mongoose.Schema;

const workshopDataSchema = new Schema(
  {
    workshop_ID: {
      type: String,
      required: true,
      unique: true,
    },
    workshop_name: {
      type: String,
      required: true,
    },
    availability: {
      type: String,
      default: "Available",
    },
    workshop_type: {
      type: String,
      required: true,
    },
    workshop_details: {
      type: String,
      required: true,
    },
    workshop_request: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkshopRequest",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const WorkshopDataModel = mongoose.model("WorkshopData", workshopDataSchema);

export { WorkshopDataModel as WorkshopData };
