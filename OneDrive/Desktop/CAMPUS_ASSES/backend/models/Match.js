import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  lostItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  foundItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  confidenceScore: { type: Number, required: true }, // 0 to 100 percentage
  status: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);
