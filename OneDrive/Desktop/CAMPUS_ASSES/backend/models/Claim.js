import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, // The FOUND item being claimed
  claimerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  
  status: { 
    type: String, 
    enum: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RECOVERED'], 
    default: 'SUBMITTED' 
  },
  
  ownershipAnswers: [{ question: String, answer: String }],
  evidenceImages: [{ type: String }], // Cloudinary URLs
  
  qrCodeToken: { type: String }, // Generated on approval
  recoveredAt: { type: Date },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String },
}, { timestamps: true });

export default mongoose.model('Claim', claimSchema);
