import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Subject from './models/Subject.js';
import ExamType from './models/ExamType.js';
import ExamConfig from './models/ExamConfig.js';
import Question from './models/Question.js';

dotenv.config();

export const seed = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    console.log('✅ Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Subject.deleteMany({}),
      ExamType.deleteMany({}),
      ExamConfig.deleteMany({}),
      Question.deleteMany({}),
    ]);
    console.log('🧹 Cleared existing data');

    const adminHash = await bcrypt.hash('admin123', 12);
    const userHash  = await bcrypt.hash('user123', 12);

    await User.insertMany([
      { name: 'Admin User',    email: 'admin@gmail.com',     role: 'Admin', status: 'Active',   passwordHash: adminHash },
      { name: 'Rahim Uddin',   email: 'rahim@quaarks.com',   role: 'User',  status: 'Active',   passwordHash: userHash  },
      { name: 'Sumaiya Begum', email: 'sumaiya@quaarks.com', role: 'User',  status: 'Active',   passwordHash: userHash  },
      { name: 'Farhan Ahmed',  email: 'farhan@quaarks.com',  role: 'User',  status: 'Inactive', passwordHash: userHash  },
    ]);
    console.log('👥 Users seeded');

    const subjects = await Subject.insertMany([
      { name: 'Mathematics', slug: 'mathematics', description: 'Numbers, algebra, geometry & calculus', isActive: true },
      { name: 'English',     slug: 'english',     description: 'Language, grammar and literature',      isActive: true },
      { name: 'Science',     slug: 'science',     description: 'Physics, chemistry and biology',        isActive: true },
      { name: 'History',     slug: 'history',     description: 'World and regional history',            isActive: true },
      { name: 'Geography',   slug: 'geography',   description: 'Physical and human geography',          isActive: true },
    ]);
    const [math, english, science, history, geography] = subjects;
    console.log('📚 Subjects seeded');

    await ExamType.insertMany([
      { name: 'Multiple Choice', slug: 'mcq',          order: 1 },
      { name: 'True / False',    slug: 'true-false',   order: 2 },
      { name: 'Fill in Blank',   slug: 'fill-blank',   order: 3 },
      { name: 'Short Answer',    slug: 'short-answer', order: 4 },
      { name: 'Admission',       slug: 'admission',    order: 5 },
      { name: 'Final Exam',      slug: 'final',        order: 6 },
    ]);
    console.log('🏷️  Exam Types seeded');

    await ExamConfig.insertMany([
      { code: 'MCQ-GEN',  title: 'General MCQ Exam',   duration: 60,  totalQuestions: 50,  passMark: 70, negativeMarking: false },
      { code: 'MCQ-ADV',  title: 'Advanced MCQ Exam',  duration: 90,  totalQuestions: 75,  passMark: 75, negativeMarking: true  },
      { code: 'ADMIT-01', title: 'Admission Test 01',  duration: 120, totalQuestions: 100, passMark: 80, negativeMarking: true  },
      { code: 'PRAC-01',  title: 'Practice Set 01',    duration: 30,  totalQuestions: 25,  passMark: 60, negativeMarking: false },
    ]);
    console.log('⚙️  Exam Configs seeded');

    const opts = (a, b, c, d) => [
      { label: 'A', value: a },
      { label: 'B', value: b },
      { label: 'C', value: c },
      { label: 'D', value: d },
    ];

    await Question.insertMany([
      { subjectId: math._id, examType: 'MCQ', text: 'What is the square root of 144?', options: opts('10','11','12','13'), correctOption: 2, difficulty: 'Easy', isActive: true },
      { subjectId: math._id, examType: 'MCQ', text: 'If x = 2 and y = 3, what is x² + y²?', options: opts('10','11','12','13'), correctOption: 3, difficulty: 'Medium', isActive: true },
      { subjectId: math._id, examType: 'MCQ', text: 'What is the sum of the interior angles of a quadrilateral?', options: opts('180°','270°','360°','450°'), correctOption: 2, difficulty: 'Medium', isActive: true },
      { subjectId: math._id, examType: 'MCQ', text: 'Which of these is a prime number?', options: opts('15','21','29','35'), correctOption: 2, difficulty: 'Easy', isActive: true },
      { subjectId: math._id, examType: 'MCQ', text: 'What is the value of Pi (π) rounded to two decimal places?', options: opts('3.12','3.14','3.16','3.18'), correctOption: 1, difficulty: 'Easy', isActive: true },
      { subjectId: math._id, examType: 'MCQ', text: 'Solve: 3x + 7 = 22. What is x?', options: opts('3','4','5','6'), correctOption: 2, difficulty: 'Medium', isActive: true },
      { subjectId: math._id, examType: 'MCQ', text: 'What is 15% of 200?', options: opts('25','30','35','40'), correctOption: 1, difficulty: 'Easy', isActive: true },
      { subjectId: math._id, examType: 'MCQ', text: 'A triangle has sides 3, 4 and 5. What type of triangle is it?', options: opts('Equilateral','Isosceles','Right-angled','Obtuse'), correctOption: 2, difficulty: 'Hard', isActive: true },

      { subjectId: english._id, examType: 'MCQ', text: 'Who wrote the play "Hamlet"?', options: opts('Charles Dickens','William Shakespeare','Jane Austen','Mark Twain'), correctOption: 1, difficulty: 'Easy', isActive: true },
      { subjectId: english._id, examType: 'MCQ', text: 'Which sentence is grammatically correct?', options: opts("She don't like apples.","She doesn't likes apples.","She doesn't like apples.","She not like apples."), correctOption: 2, difficulty: 'Medium', isActive: true },
      { subjectId: english._id, examType: 'MCQ', text: 'What is the plural of "criterion"?', options: opts('Criterions','Criterias','Criteria','Criterium'), correctOption: 2, difficulty: 'Hard', isActive: true },
      { subjectId: english._id, examType: 'MCQ', text: 'Which word is a synonym for "eloquent"?', options: opts('Clumsy','Articulate','Silent','Confused'), correctOption: 1, difficulty: 'Medium', isActive: true },

      { subjectId: science._id, examType: 'MCQ', text: "Which gas makes up the majority of Earth's atmosphere?", options: opts('Oxygen','Carbon Dioxide','Nitrogen','Argon'), correctOption: 2, difficulty: 'Easy', isActive: true },
      { subjectId: science._id, examType: 'MCQ', text: 'What is the chemical symbol for Gold?', options: opts('Go','Gd','Au','Ag'), correctOption: 2, difficulty: 'Easy', isActive: true },
      { subjectId: science._id, examType: 'MCQ', text: 'What is the speed of light in a vacuum (approx.)?', options: opts('3×10⁶ m/s','3×10⁸ m/s','3×10¹⁰ m/s','3×10⁴ m/s'), correctOption: 1, difficulty: 'Medium', isActive: true },
      { subjectId: science._id, examType: 'MCQ', text: 'Which organ produces insulin?', options: opts('Liver','Kidney','Pancreas','Stomach'), correctOption: 2, difficulty: 'Medium', isActive: true },

      { subjectId: history._id, examType: 'MCQ', text: 'In which year did World War II end?', options: opts('1943','1944','1945','1946'), correctOption: 2, difficulty: 'Easy', isActive: true },
      { subjectId: history._id, examType: 'MCQ', text: 'Who was the first President of the United States?', options: opts('Thomas Jefferson','John Adams','George Washington','Benjamin Franklin'), correctOption: 2, difficulty: 'Easy', isActive: true },
      { subjectId: history._id, examType: 'MCQ', text: 'The French Revolution began in which year?', options: opts('1776','1789','1799','1815'), correctOption: 1, difficulty: 'Medium', isActive: true },

      { subjectId: geography._id, examType: 'MCQ', text: 'What is the capital of Australia?', options: opts('Sydney','Melbourne','Brisbane','Canberra'), correctOption: 3, difficulty: 'Medium', isActive: true },
      { subjectId: geography._id, examType: 'MCQ', text: 'Which is the longest river in the world?', options: opts('Amazon','Yangtze','Mississippi','Nile'), correctOption: 3, difficulty: 'Easy', isActive: true },
      { subjectId: geography._id, examType: 'MCQ', text: 'Mount Everest is located in which mountain range?', options: opts('Andes','Alps','Himalayas','Rockies'), correctOption: 2, difficulty: 'Easy', isActive: true },
    ]);
    console.log('❓ Questions seeded');

    console.log('\n🎉 Seed complete!');
    console.log('  Admin login:  admin@gmail.com / admin123');

  } catch (err) {
    console.error('❌ Seed error:', err);
    throw err;
  }
};

// Direct run হলে execute করবে
if (process.argv[1].includes('seed')) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}