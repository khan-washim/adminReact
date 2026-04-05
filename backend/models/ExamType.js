import mongoose from 'mongoose';

const examTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('ExamType', examTypeSchema);
