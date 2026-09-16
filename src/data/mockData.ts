import type {
  Student, Tutor, Session, Notification, Subject, ActivityItem,
} from '../types';

const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear&backgroundColor=3366ff,06b6d4`;

export const currentUser: Student = {
  id: 'stu-001',
  name: 'Aarav Sharma',
  rollNumber: 'CS21B001',
  email: 'aarav.sharma@university.edu',
  avatar: avatar('Aarav Sharma'),
  department: 'Computer Science & Engineering',
  year: 3,
  strengths: ['Data Structures', 'Algorithms', 'Web Development'],
  weaknesses: ['Machine Learning', 'Operating Systems', 'Databases'],
  skills: [
    { subject: 'Data Structures', rating: 78 },
    { subject: 'Algorithms', rating: 72 },
    { subject: 'Web Development', rating: 85 },
    { subject: 'Databases', rating: 64 },
    { subject: 'Machine Learning', rating: 48 },
    { subject: 'Operating Systems', rating: 55 },
  ],
  weakSubjects: ['Machine Learning', 'Operating Systems', 'Databases'],
  learningPreferences: ['Visual learning', 'Hands-on projects', 'Small groups'],
  availability: [
    { day: 'Mon', start: '16:00', end: '19:00' },
    { day: 'Tue', start: '15:00', end: '18:00' },
    { day: 'Wed', start: '16:00', end: '19:00' },
    { day: 'Thu', start: '15:00', end: '18:00' },
    { day: 'Fri', start: '14:00', end: '17:00' },
  ],
  bio: 'CS junior passionate about full-stack development. Looking to strengthen my fundamentals in ML and systems.',
};

// Application starts with empty subjects and students databases
export const sampleSubjects: Subject[] = [];
export const sampleStudents: Student[] = [];

export const tutors: Tutor[] = [];

export const sessions: Session[] = [];

export const notifications: Notification[] = [
  { id: 'n1', type: 'reminder', title: 'Session in 2 hours', message: 'Machine Learning with Dr. Priya Nair starts at 16:00.', time: '1h ago', read: false },
  { id: 'n2', type: 'booking', title: 'Booking confirmed', message: 'Your OS session on Sep 4 is confirmed.', time: '3h ago', read: false },
  { id: 'n3', type: 'system', title: 'Study plan updated', message: 'Your weekly study roadmap has been refreshed.', time: '1d ago', read: false },
  { id: 'n4', type: 'system', title: 'New tutor available', message: 'Dr. Sara Khan joined for Machine Learning.', time: '2d ago', read: true },
  { id: 'n5', type: 'reminder', title: 'Upcoming Review', message: 'Time to review your Data Structures practice problems.', time: '3d ago', read: true },
];

// Analytics series
export const weeklyPerformance = [
  { day: 'Mon', score: 62, sessions: 1 },
  { day: 'Tue', score: 70, sessions: 2 },
  { day: 'Wed', score: 65, sessions: 1 },
  { day: 'Thu', score: 78, sessions: 2 },
  { day: 'Fri', score: 82, sessions: 1 },
  { day: 'Sat', score: 88, sessions: 3 },
  { day: 'Sun', score: 74, sessions: 1 },
];

export const subjectProgress = [
  { subject: 'Data Structures', before: 55, after: 78 },
  { subject: 'Algorithms', before: 48, after: 72 },
  { subject: 'Web Dev', before: 60, after: 85 },
  { subject: 'Databases', before: 40, after: 64 },
  { subject: 'ML', before: 20, after: 48 },
  { subject: 'OS', before: 30, after: 55 },
];

export const masteryTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  mastery: 40 + Math.round(i * 4 + Math.random() * 8),
  sessions: 2 + Math.round(Math.random() * 6),
}));

export const adminStats = {
  totalStudents: 1248,
  activeTutors: 86,
  sessionsScheduled: 3420,
  successRate: 94,
  monthlyGrowth: [
    { month: 'Mar', students: 820, tutors: 54 },
    { month: 'Apr', students: 910, tutors: 61 },
    { month: 'May', students: 1020, tutors: 70 },
    { month: 'Jun', students: 1080, tutors: 74 },
    { month: 'Jul', students: 1150, tutors: 80 },
    { month: 'Aug', students: 1248, tutors: 86 },
  ],
  departmentDistribution: [
    { name: 'CS', value: 520 },
    { name: 'EE', value: 310 },
    { name: 'Math', value: 180 },
    { name: 'Data Science', value: 238 },
  ],
};

export const liveActivity = [
  { id: 'a1', text: 'Study session booked for Machine Learning', time: '2m ago' },
  { id: 'a2', text: 'Student earned the Quick Learner badge', time: '5m ago' },
  { id: 'a3', text: 'Dr. Priya Nair completed 3 sessions today', time: '12m ago' },
  { id: 'a4', text: 'Group OS study session completed', time: '20m ago' },
  { id: 'a5', text: 'New tutor Ananya Iyer received 5-star review', time: '34m ago' },
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-001',
    type: 'session_booked',
    title: 'Study Session Booked',
    description: 'Aarav Sharma scheduled "Supervised Learning" with Dr. Priya Nair',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    userName: 'Aarav Sharma',
    userAvatar: avatar('Aarav Sharma'),
    target: 'Machine Learning',
  },
  {
    id: 'act-002',
    type: 'match_found',
    title: 'Perfect Peer Match Found',
    description: '98% compatibility match detected between Aarav Sharma & Diya Patel',
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    userName: 'Diya Patel',
    userAvatar: avatar('Diya Patel'),
    target: 'Data Structures & ML',
  },
  {
    id: 'act-003',
    type: 'signup',
    title: 'New Student Signup',
    description: 'Rohan Deshmukh registered from Data Science & AI (Year 2)',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    userName: 'Rohan Deshmukh',
    userAvatar: avatar('Rohan Deshmukh'),
    target: 'Data Science',
  },
  {
    id: 'act-004',
    type: 'profile_update',
    title: 'Learning Profile Updated',
    description: 'Diya Patel updated target weak subjects and added 3 skill ratings',
    timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    userName: 'Diya Patel',
    userAvatar: avatar('Diya Patel'),
    target: 'Skills & Mastery',
  },
  {
    id: 'act-005',
    type: 'subject_added',
    title: 'New Subject Added',
    description: 'Course "Cloud Computing & DevOps" (CS402) added to curriculum catalog',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    userName: 'Admin Curriculum',
    target: 'CS402',
  },
  {
    id: 'act-006',
    type: 'session_booked',
    title: 'Peer Tutoring Scheduled',
    description: 'Karthik R. booked a 1-on-1 session in Operating Systems with Ananya Iyer',
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    userName: 'Karthik R.',
    userAvatar: avatar('Karthik R.'),
    target: 'Operating Systems',
  },
  {
    id: 'act-007',
    type: 'match_found',
    title: 'Excellent Peer Match Found',
    description: '88% reciprocal learning match calculated with Yash Kumar',
    timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    userName: 'Yash Kumar',
    userAvatar: avatar('Yash Kumar'),
    target: 'Web Dev & Databases',
  },
  {
    id: 'act-008',
    type: 'signup',
    title: 'New Student Signup',
    description: 'Sneha Roy registered from Electrical & Electronics Engineering',
    timestamp: new Date(Date.now() - 320 * 60 * 1000).toISOString(),
    userName: 'Sneha Roy',
    userAvatar: avatar('Sneha Roy'),
    target: 'Electrical Eng',
  },
];
