import mongoose from "mongoose";
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    _id: { type: String, required: true }, // Identifier (e.g., 'workshop_request_id')
    seq: { type: Number, default: 0 },
  });
  
  const Counter = mongoose.model('Counter', counterSchema);

  export { Counter as Counter };