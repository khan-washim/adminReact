import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// GET /api/questions
router.get('/', async (req, res) => {
  try {
    const { subject, examType, difficulty, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (subject) filter.subjectId = subject;
    if (examType) filter.examType = examType;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.text = { $regex: search, $options: 'i' };

    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .populate('subjectId', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ data: questions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/questions
router.post('/', async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/questions/:id
router.put('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) return res.status(404).json({ message: 'Not found' });
    res.json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/questions/:id
router.delete('/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/questions/import
router.post('/import', async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions)) return res.status(400).json({ message: 'Invalid format' });
    const inserted = await Question.insertMany(questions);
    res.status(201).json({ imported: inserted.length });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
