import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    examType: { type: String, required: true },
    text: { type: String, required: true },
    options: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    correctOption: { type: Number, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Question', questionSchema);
