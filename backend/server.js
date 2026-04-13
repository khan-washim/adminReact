import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { protect } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import questionRoutes from './routes/questions.js';
import userRoutes from './routes/users.js';
import subjectRoutes from './routes/subjects.js';
import examConfigRoutes from './routes/examConfigs.js';
import examTypeRoutes from './routes/examTypes.js';
import { seed } from './seed.js';

dotenv.config();

const app = express();

// CORS — allow all origins
app.use(cors({
  origin: '*',
  credentials: false
}));

app.use(express.json());

connectDB();

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/dashboard',    protect, dashboardRoutes);
app.use('/api/questions',    protect, questionRoutes);
app.use('/api/users',        protect, userRoutes);
app.use('/api/subjects',     protect, subjectRoutes);
app.use('/api/exam-configs', protect, examConfigRoutes);
app.use('/api/exam-types',   protect, examTypeRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// One-time seed route
app.get('/api/run-seed', async (req, res) => {
  try {
    await seed();
    res.json({ success: true, message: '🎉 Seeded! Login: admin@gmail.com / admin123' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));