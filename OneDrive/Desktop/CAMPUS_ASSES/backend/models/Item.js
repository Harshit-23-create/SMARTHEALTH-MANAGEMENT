import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  type: { type: String, enum: ['LOST', 'FOUND'], required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }], // Cloudinary URLs
  location: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['ACTIVE', 'CLAIM_PENDING', 'RECOVERED'], default: 'ACTIVE' },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  
  // Only for lost items
  reward: { type: String, default: "" },
  tags: [{ type: String }],
  
  // Only for found items
  storageLocation: { type: String },
  securityNotes: { type: String },
  
  // AI related
  aiEmbeddings: { type: [Number] }, // To store CLIP embeddings if needed directly in mongo
}, { timestamps: true });

// Create text indexes for search
itemSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.model('Item', itemSchema);
