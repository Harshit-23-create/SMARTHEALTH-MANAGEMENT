import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true }, // e.g. "mit.edu"
  logo: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  branding: {
    primaryColor: { type: String, default: "#000000" },
  },
  address: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model('College', collegeSchema);
