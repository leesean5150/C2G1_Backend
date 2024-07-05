import mongoose from "mongoose";
const Schema = mongoose.Schema;

const workshopSchema = new Schema(
  {
    workshopId: {
      type: String,
      required: true,
    },
    trainer: {
      type: String,
      required: false,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
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
    rejectReason: {
      type: String,
      default: "",
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
