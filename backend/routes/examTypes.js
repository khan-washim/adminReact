import express from 'express';
import ExamType from '../models/ExamType.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const types = await ExamType.find().sort({ order: 1 });
    res.json({ data: types, total: types.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const type = await ExamType.create(req.body);
    res.status(201).json(type);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const type = await ExamType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!type) return res.status(404).json({ message: 'Not found' });
    res.json(type);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await ExamType.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
