import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  disease: {
    type: String,
    required: true,
  },
  bed: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Admitted", "Discharged"],
    default: "Admitted",
  },
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);