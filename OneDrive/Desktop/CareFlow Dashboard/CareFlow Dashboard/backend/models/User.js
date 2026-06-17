import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ["Admin", "Doctor", "Nurse", "Receptionist"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);