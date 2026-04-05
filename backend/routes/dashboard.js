import express from 'express';
import Question from '../models/Question.js'; // আপনার মডেলের পাথ অনুযায়ী দিন
import User from '../models/User.js';         // ইউজার মডেল থাকলে
// অন্যান্য প্রয়োজনীয় মডেল ইমপোর্ট করুন

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    // ডাটাবেজ থেকে রিয়েল কাউন্ট আনা
    const totalQuestions = await Question.countDocuments();
    const totalUsers = await User.countDocuments() || 0; 
    
    // আপাতত অন্যান্য চার্টের ডেটা স্ট্যাটিক রাখলেও টোটাল কোয়েশ্চেন এখন ডাইনামিক হবে
    res.json({
      kpis: {
        totalQuestions: totalQuestions, // এখন এটি ডাটাবেজের ১ দেখাবে
        totalUsers: totalUsers,
        totalAttempts: 5671, // এগুলোও একইভাবে মডেল থেকে আনতে পারেন
        passRate: 74,
      },
      userGrowth: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [30, 55, 75, 60, 90, 110, 130, 145, 160, 175, 200, 230],
      },
      attemptsTrend: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [120, 210, 180, 240, 195, 310, 270],
      },
      passRateDist: {
        labels: ['Pass', 'Fail'],
        data: [74, 26],
      },
      topSubjects: [
        { name: 'Mathematics', attempts: 1240, passRate: 68 },
        { name: 'English', attempts: 980, passRate: 82 },
        { name: 'Science', attempts: 870, passRate: 71 },
        { name: 'History', attempts: 650, passRate: 79 },
        { name: 'Geography', attempts: 520, passRate: 65 },
      ],
      recentAttempts: [
        { user: 'Rahim Uddin', subject: 'Mathematics', score: 72, status: 'Pass', date: '2025-01-15' },
        { user: 'Karim Hossain', subject: 'English', score: 45, status: 'Fail', date: '2025-01-15' },
        { user: 'Sumaiya Begum', subject: 'Science', score: 88, status: 'Pass', date: '2025-01-14' },
        { user: 'Farhan Ahmed', subject: 'History', score: 60, status: 'Pass', date: '2025-01-14' },
        { user: 'Nadia Islam', subject: 'Geography', score: 38, status: 'Fail', date: '2025-01-13' },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;