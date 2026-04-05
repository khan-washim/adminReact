import mongoose from 'mongoose';

const examConfigSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    title: { type: String, required: true },
    duration: { type: Number, required: true }, // minutes
    totalQuestions: { type: Number, required: true },
    passMark: { type: Number, required: true },
    negativeMarking: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('ExamConfig', examConfigSchema);
