import mongoose from "mongoose";
const Schema = mongoose.Schema;

const workshopSchema = new Schema({
    workshopId: {
        type: String,
        required: true
    },
    trainer: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    abailability: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const WorkshopModel = mongoose.model('Workshop', workshopSchema);

export { WorkshopModel as Workshop };