export type Role = 'student' | 'tutor' | 'admin';

export interface SkillRating {
  subject: string;
  rating: number; // 0-100 mastery
  category?: string;
}

export interface AvailabilitySlot {
  day: string; // 'Mon','Tue',...
  start: string; // '09:00'
  end: string; // '11:00'
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  avatar: string;
  department: string;
  university?: string;
  year: number;
  strengths: string[];
  weaknesses: string[];
  skills: SkillRating[];
  weakSubjects: string[];
  learningPreferences: string[];
  availability: AvailabilitySlot[];
  bio: string;
  rating?: number;
  role?: Role;
  streak?: number;
}

export interface UserAccount extends Student {
  password?: string;
  createdAt?: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  department: string;
  year: number;
  rollNumber?: string;
  avatar?: string;
  bio?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department?: string;
  credits?: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description?: string;
}

export interface Review {
  id: string;
  tutorId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Tutor {
  id: string;
  name: string;
  title?: string;
  email: string;
  avatar: string;
  department: string;
  subjects: string[];
  expertise: SkillRating[];
  rating: number;
  reviewCount: number;
  successRate: number;
  sessionsCompleted: number;
  availability: AvailabilitySlot[];
  hourlyRate: number;
  bio: string;
  badges: string[];
  reviews: Review[];
}

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Session {
  id: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  date: string; // ISO date
  startTime: string;
  endTime: string;
  status: SessionStatus;
  mode: 'online' | 'in-person';
  topic?: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'booking' | 'achievement' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export interface MatchResult {
  tutor: Tutor;
  score: number;
  confidence: number;
  reasons: string[];
  breakdown: { label: string; weight: number; value: number }[];
}

export interface PeerMatchBreakdownItem {
  label: string;
  weight: number;
  value: number;
  description: string;
}

export type MatchTier = 'Perfect Match' | 'Excellent Match' | 'Good Match' | 'Basic Match';

export interface TutorMatchBreakdownItem {
  label: string;
  weight: number;
  value: number;
  description: string;
}

export interface SubjectWiseMatchDetail {
  subject: string;
  isTutorStrength: boolean;
  isLearnerWeakness: boolean;
  isReciprocal: boolean;
  status: 'Direct Tutor Match' | 'Reciprocal Exchange' | 'General Curriculum';
  description: string;
}

export interface TutorMatch {
  tutor: Student;
  learner: Student;
  matchedSubjects: string[]; // subjects tutor has in strengths that learner has in weaknesses (filtered by active subjects)
  reciprocalSubjects: string[]; // subjects learner has in strengths that tutor has in weaknesses (filtered by active subjects)
  score: number; // Match Score (%) e.g. 70-98%
  confidence: number;
  tier: MatchTier;
  whySelected: string; // "Why this tutor was selected"
  subjectWiseDetails: SubjectWiseMatchDetail[];
  breakdown: TutorMatchBreakdownItem[];
}

export interface PeerMatch {
  student: Student;
  matchedSubjects: string[]; // subjects peer is strong in that user needs help with
  reciprocalSubjects: string[]; // subjects user is strong in that peer needs help with
  strongSubjects: string[];
  weakSubjects: string[];
  score: number;
  tier: MatchTier;
  reason: string;
  departmentMatch: boolean;
  yearSynergy: string;
  breakdown: PeerMatchBreakdownItem[];
}

export type ActivityType = 'signup' | 'profile_update' | 'match_found' | 'session_booked' | 'subject_added' | 'session_cancelled';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string; // ISO format or date string
  userName?: string;
  userAvatar?: string;
  target?: string;
}

// ==========================================
// Advanced AI Types
// ==========================================

export interface AITutorRecommendation {
  tutor: Tutor;
  score: number;
  confidence: number;
  tier: MatchTier;
  whyRecommended: string;
  matchedWeakSubjects: string[];
  departmentSynergy: string;
  yearSynergy: string;
  learningStyleFit: string;
  keyStrengths: string[];
  breakdown: {
    label: string;
    weight: number;
    value: number;
    description: string;
  }[];
}

export interface WeakSubjectInsight {
  subject: string;
  rating: number;
  target: number;
  gap: number;
  priority: 'High' | 'Medium' | 'Low';
  recommendedWeeklyHours: number;
  suggestedAction: string;
}

export interface ImprovementPhase {
  phase: number;
  title: string;
  duration: string;
  focus: string;
  actionItems: string[];
  expectedGain: string;
}

export interface AILearningInsights {
  weakestSubjects: WeakSubjectInsight[];
  strongestSubjects: { subject: string; rating: number }[];
  improvementPlan: ImprovementPhase[];
  weeklyStudyHours: {
    total: number;
    dailyRecommendation: number;
    breakdown: { subject: string; hours: number; color: string }[];
  };
  learningTrend: {
    status: 'accelerating' | 'steady' | 'needs_boost';
    weeklyVelocity: number; // e.g. +4.5%
    projectedMasteryWeeks: number;
    description: string;
    badgeText: string;
  };
}

export interface AIStudyPlanBlock {
  id: string;
  day: string; // 'Mon', 'Tue', ...
  dayFull: string;
  dateStr: string;
  subject: string;
  topic: string;
  timeSlot: string;
  durationMinutes: number;
  technique: string;
  focusType: 'Weak Area Recovery' | 'Core Review' | 'Practice Drill' | 'Peer Session' | 'Active Recall';
  color: string;
  isBooked?: boolean;
}

export interface AIPerformancePrediction {
  subjectPredictions: {
    subject: string;
    currentMastery: number;
    projected4Weeks: number;
    projected8Weeks: number;
    improvementPct: number;
    confidence: number;
    trend: 'up' | 'stable' | 'down';
  }[];
  growthTrajectory: {
    week: string;
    projected: number;
    baseline: number;
    target: number;
  }[];
  riskAreas: {
    id: string;
    subject: string;
    riskLevel: 'High' | 'Medium' | 'Low';
    factor: string;
    rootCause: string;
    mitigation: string;
  }[];
  overallGrowthIndex: number; // e.g. +18.4%
  expectedGpaImpact: string;
}

export interface AIDashboardScores {
  healthScore: number;
  healthScoreDelta: number;
  healthRating: 'Exceptional' | 'Optimal' | 'Good' | 'Needs Attention';
  productivityScore: number;
  productivityScoreDelta: number;
  consistencyScore: number;
  consistencyScoreDelta: number;
}
