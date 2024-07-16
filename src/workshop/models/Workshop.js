import mongoose from "mongoose";
const Schema = mongoose.Schema;

const workshopSchema = new Schema(
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
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    availability: {
      type: Boolean,
      required: true,
    },
    description: {
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
    deal_potential: {
      type: Number,
      required: true,
    },
    pax: {
      type: Number,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    workshop_type: {
      type: String,
      required: true,
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

workshopSchema.pre("save", function (next) {
  if (this.isNew) {
    this.status = "submitted";
    this.rejectReason = "";
  }
  next();
});

const WorkshopModel = mongoose.model("Workshop", workshopSchema);

export { WorkshopModel as Workshop };
