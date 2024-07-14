import mongoose from "mongoose";
const Schema = mongoose.Schema;

const workshopSummarySchema = new Schema({
    //Not yet fixed
    year: {
        type: Number,
        required: true
    },
    month: {
        type: String, //this may change to Number
        required: true

    },
    actual_attendance: {
        type: Number,
        default: 0,
        required: true
    },
    expected_attendance: {
        type: Number,
        default: 0,
        required: true
    },
    workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workshop" }],
});

const WorkshopSummaryModel = mongoose.model("WorkshopSummary", workshopSummarySchema);

export { WorkshopSummaryModel as WorkshopSummary };