import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, enum: ['Admin', 'User'], default: 'User' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    passwordHash: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
