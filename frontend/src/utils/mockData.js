export const MOCK_DASHBOARD = {
  kpis: { totalQuestions: 1284, totalUsers: 342, totalAttempts: 5671, passRate: 74 },
  userGrowth: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    data: [30,55,75,60,90,110,130,145,160,175,200,230],
  },
  attemptsTrend: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    data: [120,210,180,240,195,310,270],
  },
  passRateDist: { labels: ['Pass','Fail'], data: [74,26] },
  topSubjects: [
    { name:'Mathematics', attempts:1240, passRate:68 },
    { name:'English', attempts:980, passRate:82 },
    { name:'Science', attempts:870, passRate:71 },
    { name:'History', attempts:650, passRate:79 },
    { name:'Geography', attempts:520, passRate:65 },
  ],
  recentAttempts: [
    { user:'Rahim Uddin', subject:'Mathematics', score:72, status:'Pass', date:'2025-01-15' },
    { user:'Karim Hossain', subject:'English', score:45, status:'Fail', date:'2025-01-15' },
    { user:'Sumaiya Begum', subject:'Science', score:88, status:'Pass', date:'2025-01-14' },
    { user:'Farhan Ahmed', subject:'History', score:60, status:'Pass', date:'2025-01-14' },
    { user:'Nadia Islam', subject:'Geography', score:38, status:'Fail', date:'2025-01-13' },
  ],
};

export const MOCK_QUESTIONS = [
  { _id:'q1', text:'What is the square root of 144?', subjectId:{name:'Mathematics'}, examType:'MCQ', difficulty:'Easy', isActive:true },
  { _id:'q2', text:'Which gas is most abundant in the atmosphere?', subjectId:{name:'Science'}, examType:'MCQ', difficulty:'Easy', isActive:true },
  { _id:'q3', text:'Who wrote Hamlet?', subjectId:{name:'English'}, examType:'MCQ', difficulty:'Medium', isActive:true },
  { _id:'q4', text:'What is the capital of France?', subjectId:{name:'Geography'}, examType:'MCQ', difficulty:'Easy', isActive:true },
  { _id:'q5', text:'When did World War II end?', subjectId:{name:'History'}, examType:'MCQ', difficulty:'Medium', isActive:false },
];

export const MOCK_USERS = [
  { _id:'u1', name:'Rahim Uddin', email:'rahim@example.com', role:'Admin', status:'Active', createdAt:'2025-01-01' },
  { _id:'u2', name:'Karim Hossain', email:'karim@example.com', role:'User', status:'Active', createdAt:'2025-01-03' },
  { _id:'u3', name:'Sumaiya Begum', email:'sumaiya@example.com', role:'User', status:'Inactive', createdAt:'2025-01-05' },
  { _id:'u4', name:'Farhan Ahmed', email:'farhan@example.com', role:'User', status:'Active', createdAt:'2025-01-07' },
  { _id:'u5', name:'Nadia Islam', email:'nadia@example.com', role:'User', status:'Active', createdAt:'2025-01-09' },
];

export const MOCK_SUBJECTS = [
  { _id:'s1', name:'Mathematics', slug:'mathematics', description:'Numbers, algebra, geometry', isActive:true },
  { _id:'s2', name:'English', slug:'english', description:'Language and literature', isActive:true },
  { _id:'s3', name:'Science', slug:'science', description:'Physics, chemistry, biology', isActive:true },
  { _id:'s4', name:'History', slug:'history', description:'World and regional history', isActive:true },
  { _id:'s5', name:'Geography', slug:'geography', description:'Physical and human geography', isActive:false },
];

export const MOCK_EXAM_CONFIGS = [
  { _id:'ec1', code:'MCQ-GEN', title:'General MCQ Exam', duration:60, totalQuestions:50, passMark:70, negativeMarking:false },
  { _id:'ec2', code:'MCQ-ADV', title:'Advanced MCQ Exam', duration:90, totalQuestions:75, passMark:75, negativeMarking:true },
  { _id:'ec3', code:'PRAC-01', title:'Practice Set 01', duration:30, totalQuestions:25, passMark:60, negativeMarking:false },
];

export const MOCK_EXAM_TYPES = [
  { _id:'et1', name:'Multiple Choice', slug:'mcq', order:1 },
  { _id:'et2', name:'True / False', slug:'true-false', order:2 },
  { _id:'et3', name:'Fill in the Blank', slug:'fill-blank', order:3 },
  { _id:'et4', name:'Short Answer', slug:'short-answer', order:4 },
];
