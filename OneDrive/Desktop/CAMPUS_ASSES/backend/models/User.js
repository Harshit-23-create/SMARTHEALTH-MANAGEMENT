import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['STUDENT', 'SECURITY_STAFF', 'DEPARTMENT_COORDINATOR', 'COLLEGE_ADMIN', 'SUPER_ADMIN'], 
    default: 'STUDENT' 
  },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: false }, // Super admin might not have one
  isVerified: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
  trustScore: { type: Number, default: 100 },
  avatar: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
