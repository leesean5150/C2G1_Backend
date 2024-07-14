import mongoose from "mongoose";
const Schema = mongoose.Schema;

const workshopSchema = new Schema({
    //Not yet fixed
    workshop_ID: {
        type: String,
        required: true,
        unique: true,
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
    trainers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trainer" }],
}, {
    timestamps: true,
});

workshopSchema.pre("save", function(next) {
    if (this.isNew) {
        this.status = "submitted";
        this.rejectReason = "";
    }
    next();
});

const WorkshopModel = mongoose.model("Workshop", workshopSchema);

export { WorkshopModel as Workshop };