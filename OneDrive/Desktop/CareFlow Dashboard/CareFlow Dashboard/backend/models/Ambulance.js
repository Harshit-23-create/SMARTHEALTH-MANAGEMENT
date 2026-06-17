import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema(
  {
    ambulanceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    driver: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Available", "On Duty", "Maintenance"],
      default: "Available",
    },

    lat: {
      type: Number,
      required: true,
    },

    lng: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ambulance", ambulanceSchema);