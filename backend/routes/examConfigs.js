import express from 'express';
import ExamConfig from '../models/ExamConfig.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const configs = await ExamConfig.find().sort({ createdAt: -1 });
    res.json({ data: configs, total: configs.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const config = await ExamConfig.create(req.body);
    res.status(201).json(config);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const config = await ExamConfig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!config) return res.status(404).json({ message: 'Not found' });
    res.json(config);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await ExamConfig.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
