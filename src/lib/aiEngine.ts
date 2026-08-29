import type {
  Student,
  Tutor,
  Session,
  AITutorRecommendation,
  AILearningInsights,
  AIStudyPlanBlock,
  AIPerformancePrediction,
  AIDashboardScores,
  WeakSubjectInsight,
  ImprovementPhase,
} from '@/types';
import { getMatchTier, getStudentStrongSubjects, getStudentWeakSubjects } from '@/lib/matching';

/**
 * Normalizes strings for robust fuzzy comparison
 */
function normalize(str: string): string {
  return (str || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ============================================================================
// 1. SMART AI TUTOR RECOMMENDATION ENGINE
// ============================================================================

/**
 * Evaluates all tutors against the logged-in student across 5 key dimensions:
 * - Weak Subjects matching tutor's designated expertise (35%)
 * - Skill rating gap to proficiency (20%)
 * - Department / syllabus alignment (15%)
 * - Academic Year appropriateness (15%)
 * - Learning preferences & teaching style compatibility (15%)
 */
export function calculateSmartAITutorRecommendations(
  currentUser: Student,
  tutors: Tutor[]
): AITutorRecommendation[] {
  if (!currentUser || !tutors || tutors.length === 0) return [];

  const userWeak = getStudentWeakSubjects(currentUser);
  const userDept = (currentUser.department || '').toLowerCase();
  const userYear = currentUser.year || 1;
  const userPrefs = currentUser.learningPreferences || ['Visual Learning', 'Interactive Practice'];

  return tutors
    .map((tutor) => {
      // 1. Weak Subjects Coverage
      const matchedWeakSubjects: string[] = [];
      let totalExpertiseRating = 0;

      (tutor.expertise || []).forEach((exp) => {
        const normExp = normalize(exp.subject);
        const isMatched = userWeak.some((w) => {
          const normW = normalize(w);
          return normW === normExp || normExp.includes(normW) || normW.includes(normExp);
        });

        if (isMatched) {
          if (!matchedWeakSubjects.includes(exp.subject)) {
            matchedWeakSubjects.push(exp.subject);
          }
          totalExpertiseRating += exp.rating;
        }
      });

      // Subject match score (0 to 1)
      const subjectCoverageRatio =
        userWeak.length > 0 ? matchedWeakSubjects.length / Math.min(userWeak.length, 2) : 0.6;
      const avgTutorRatingInSubject =
        matchedWeakSubjects.length > 0
          ? totalExpertiseRating / matchedWeakSubjects.length / 100
          : 0.7;
      const weakSubjectScore = Math.min(1, subjectCoverageRatio * 0.7 + avgTutorRatingInSubject * 0.3);

      // 2. Skill Gap & Student Proficiency Synergy
      let skillGapScore = 0.65;
      const relevantSkills = currentUser.skills.filter((sk) =>
        matchedWeakSubjects.some((m) => normalize(m) === normalize(sk.subject))
      );
      if (relevantSkills.length > 0) {
        const avgUserRating =
          relevantSkills.reduce((a, b) => a + b.rating, 0) / relevantSkills.length;
        // Tutors help lower rating students most
        skillGapScore = Math.min(1, (100 - avgUserRating + 30) / 100);
      }

      // 3. Department & Syllabus Alignment
      const tutorDept = (tutor.department || '').toLowerCase();
      let deptScore = 0.5;
      let departmentSynergy = 'Cross-disciplinary Tutoring';

      if (userDept && tutorDept) {
        if (userDept === tutorDept || userDept.includes(tutorDept) || tutorDept.includes(userDept)) {
          deptScore = 1.0;
          departmentSynergy = `Direct ${tutor.department} Department Syllabus Alignment`;
        } else if (
          (userDept.includes('computer') || userDept.includes('data') || userDept.includes('ai')) &&
          (tutorDept.includes('computer') || tutorDept.includes('data') || tutorDept.includes('ai'))
        ) {
          deptScore = 0.88;
          departmentSynergy = `Shared Computing & Engineering Core Curriculum`;
        } else if (userDept.includes('engineering') && tutorDept.includes('engineering')) {
          deptScore = 0.75;
          departmentSynergy = `Engineering Interdisciplinary Synergy`;
        }
      }

      // 4. Academic Year Level Synergy
      let yearScore = 0.8;
      let yearSynergy = 'Peer & Faculty Mentorship';
      if (userYear <= 2) {
        yearScore = 0.95; // Early year students gain tremendous leverage from experienced tutors
        yearSynergy = `Foundational Support for Year ${userYear} Coursework`;
      } else {
        yearScore = 0.9;
        yearSynergy = `Advanced Exam & Technical Mastery for Year ${userYear}`;
      }

      // 5. Learning Preferences & Pedagogical Style Fit
      let prefScore = 0.7;
      const matchedStyles: string[] = [];
      const tutorBio = (tutor.bio || '').toLowerCase();

      userPrefs.forEach((pref) => {
        const normP = pref.toLowerCase();
        if (
          tutorBio.includes(normP) ||
          tutorBio.includes('hands-on') ||
          tutorBio.includes('project') ||
          tutorBio.includes('interactive') ||
          tutorBio.includes('diagram') ||
          tutorBio.includes('concept')
        ) {
          matchedStyles.push(pref);
        }
      });
      if (matchedStyles.length > 0) {
        prefScore = 0.92;
      }
      const learningStyleFit =
        matchedStyles.length > 0
          ? `Tailored to your preference for ${matchedStyles.join(' & ')}`
          : `Adaptive 1-on-1 pedagogical approach`;

      // 6. Overall Match Score Calculation
      const rawScore = Math.round(
        (weakSubjectScore * 0.35 +
          skillGapScore * 0.20 +
          deptScore * 0.15 +
          yearScore * 0.15 +
          prefScore * 0.15) *
          100
      );

      // Score adjustments for high tutor rating & success rate
      const ratingBonus = tutor.rating >= 4.8 ? 3 : tutor.rating >= 4.6 ? 1 : 0;
      const successBonus = (tutor.successRate || 85) >= 95 ? 3 : 0;
      const finalScore = Math.min(99, Math.max(50, rawScore + ratingBonus + successBonus));

      // Calculate confidence score (factoring in tutor reviews & subject match certainty)
      const reviewWeight = Math.min(1, (tutor.reviewCount || 10) / 40);
      const confidence = Math.min(
        99,
        Math.round(finalScore * 0.75 + reviewWeight * 20 + (matchedWeakSubjects.length > 0 ? 5 : 0))
      );

      const tierInfo = getMatchTier(finalScore);

      // Key Strength Bullets for detailed explainability
      const keyStrengths: string[] = [];
      if (matchedWeakSubjects.length > 0) {
        keyStrengths.push(
          `Targeted expertise in ${matchedWeakSubjects.join(', ')} (your high-priority weak subject${
            matchedWeakSubjects.length > 1 ? 's' : ''
          })`
        );
      } else {
        keyStrengths.push(
          `Strong mastery across ${tutor.subjects.slice(0, 2).join(' & ')}`
        );
      }
      keyStrengths.push(departmentSynergy);
      keyStrengths.push(`${tutor.rating.toFixed(1)}★ rating with ${tutor.successRate}% verified pass rate`);
      keyStrengths.push(learningStyleFit);

      // Natural language explanation of why recommended
      let whyRecommended = '';
      if (matchedWeakSubjects.length > 0) {
        whyRecommended = `AI recommends ${tutor.name} because their high-rated expertise directly bridges your performance gap in ${matchedWeakSubjects.join(
          ' and '
        )}. With a ${tutor.rating.toFixed(1)}★ rating and proven alignment in ${
          tutor.department
        }, they provide the exact structured mentorship needed for Year ${userYear}.`;
      } else {
        whyRecommended = `${tutor.name} is recommended for their top-tier academic coaching (${tutor.rating.toFixed(
          1
        )}★) and comprehensive engineering fundamentals that reinforce your core curriculum.`;
      }

      const breakdown = [
        {
          label: 'Weak Subject Match',
          weight: 0.35,
          value: Math.round(weakSubjectScore * 100),
          description:
            matchedWeakSubjects.length > 0
              ? `Directly covers: ${matchedWeakSubjects.join(', ')}`
              : 'Broad foundation across curriculum subjects',
        },
        {
          label: 'Skill Gap Bridge',
          weight: 0.20,
          value: Math.round(skillGapScore * 100),
          description: 'Optimized to accelerate lower-proficiency topics toward 80%+ mastery',
        },
        {
          label: 'Department & Syllabus',
          weight: 0.15,
          value: Math.round(deptScore * 100),
          description: departmentSynergy,
        },
        {
          label: 'Academic Track Fit',
          weight: 0.15,
          value: Math.round(yearScore * 100),
          description: yearSynergy,
        },
        {
          label: 'Learning Style Synergy',
          weight: 0.15,
          value: Math.round(prefScore * 100),
          description: learningStyleFit,
        },
      ];

      return {
        tutor,
        score: finalScore,
        confidence,
        tier: tierInfo.tier,
        whyRecommended,
        matchedWeakSubjects,
        departmentSynergy,
        yearSynergy,
        learningStyleFit,
        keyStrengths,
        breakdown,
      };
    })
    .sort((a, b) => b.score - a.score);
}

// ============================================================================
// 2. AI LEARNING INSIGHTS ENGINE
// ============================================================================

export function calculateAILearningInsights(
  currentUser: Student,
  sessions: Session[]
): AILearningInsights {
  const userSkills = currentUser.skills || [];
  const weakSubjectsList = getStudentWeakSubjects(currentUser);

  // 1. Detect and rank weakest subjects
  const weakestSubjects: WeakSubjectInsight[] = userSkills
    .map((s) => {
      const isDesignatedWeak = weakSubjectsList.some(
        (w) => normalize(w) === normalize(s.subject) || normalize(s.subject).includes(normalize(w))
      );
      const gap = Math.max(0, 85 - s.rating);
      let priority: 'High' | 'Medium' | 'Low' = 'Low';
      if (s.rating < 60 || isDesignatedWeak) priority = 'High';
      else if (s.rating < 75) priority = 'Medium';

      // Hours proportional to gap
      const recommendedWeeklyHours = Math.max(1.5, Math.round((gap / 12) * 2) / 2);

      let suggestedAction = '';
      if (s.rating < 60) {
        suggestedAction = 'Book 1-on-1 diagnostic session & solve 15 foundational practice problems.';
      } else if (s.rating < 75) {
        suggestedAction = 'Engage in peer code review and weekly timed mock quizzes.';
      } else {
        suggestedAction = 'Active recall reviews once a week to maintain retention.';
      }

      return {
        subject: s.subject,
        rating: s.rating,
        target: 85,
        gap,
        priority,
        recommendedWeeklyHours,
        suggestedAction,
      };
    })
    .sort((a, b) => {
      // High priority first, then lowest rating
      const pOrder = { High: 0, Medium: 1, Low: 2 };
      return pOrder[a.priority] - pOrder[b.priority] || a.rating - b.rating;
    });

  const strongestSubjects = [...userSkills]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
    .map((s) => ({ subject: s.subject, rating: s.rating }));

  // 2. Dynamic 4-Phase Improvement Plan tailored to student's weakest subjects
  const topWeak1 = weakestSubjects[0]?.subject || 'Target Subject';
  const topWeak2 = weakestSubjects[1]?.subject || 'Secondary Weak Topic';

  const improvementPlan: ImprovementPhase[] = [
    {
      phase: 1,
      title: 'Diagnostic & Core Concepts',
      duration: 'Week 1–2',
      focus: `Fundamental theory and prerequisite remediation in ${topWeak1}`,
      actionItems: [
        `Complete a 45-min diagnostic session focusing on ${topWeak1} core mechanics`,
        'Map out core formulas and definitions with structured Feynman summaries',
        'Solve 10 foundational level 1 problems without referencing solutions',
      ],
      expectedGain: '+8% to +12% Mastery',
    },
    {
      phase: 2,
      title: 'Targeted Problem Sets & Active Recall',
      duration: 'Week 3–4',
      focus: `Bridging application gaps in ${topWeak1} and ${topWeak2}`,
      actionItems: [
        `Schedule 2 weekly peer study sprints for ${topWeak2}`,
        'Implement spaced repetition flashcards for tricky algorithms & syntax',
        'Complete 15 medium-difficulty past exam scenarios with step-by-step review',
      ],
      expectedGain: '+10% to +15% Mastery',
    },
    {
      phase: 3,
      title: 'Peer Review & Synthesis Sprints',
      duration: 'Week 5–6',
      focus: 'Multi-topic synthesis and cross-disciplinary applications',
      actionItems: [
        'Conduct a reciprocal tutoring session explaining difficult topics to a peer',
        'Tackle timed problem sets simulating actual mid-term constraints',
        'Identify remaining micro-misconceptions with an AI tutor review',
      ],
      expectedGain: '+8% to +10% Mastery',
    },
    {
      phase: 4,
      title: 'Mastery Validation & Speed Drilling',
      duration: 'Week 7–8',
      focus: 'High-speed problem solving and exam readiness',
      actionItems: [
        'Complete 2 full-length timed comprehensive mock assessments',
        'Achieve >85% benchmark accuracy on all practice modules',
        'Earn the Subject Master Badge & mentor incoming junior learners',
      ],
      expectedGain: '85%+ Target Mastery',
    },
  ];

  // 3. Recommended Study Hours
  const palette = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const breakdown = weakestSubjects.slice(0, 5).map((w, idx) => ({
    subject: w.subject,
    hours: w.recommendedWeeklyHours,
    color: palette[idx % palette.length],
  }));

  const totalWeeklyHours = Math.round(breakdown.reduce((a, b) => a + b.hours, 0) * 10) / 10;
  const dailyRecommendation = Math.round((totalWeeklyHours / 6) * 10) / 10; // 6 days / week

  // 4. Learning Trend & Velocity
  const completedSessionsCount = sessions.filter(
    (s) => s.status === 'completed' && (s.studentId === currentUser.id || s.tutorId === currentUser.id)
  ).length;
  const streak = currentUser.streak || 1;

  let velocity = 3.5;
  if (streak >= 7 && completedSessionsCount >= 3) velocity = 5.8;
  else if (streak >= 3 || completedSessionsCount >= 1) velocity = 4.2;
  else velocity = 2.4;

  const avgCurrentRating =
    userSkills.length > 0
      ? userSkills.reduce((a, b) => a + b.rating, 0) / userSkills.length
      : 65;
  const gapTo85 = Math.max(5, 85 - avgCurrentRating);
  const projectedMasteryWeeks = Math.max(2, Math.ceil(gapTo85 / velocity));

  let trendStatus: 'accelerating' | 'steady' | 'needs_boost' = 'steady';
  let badgeText = 'Steady Progress';
  let trendDesc = '';

  if (velocity >= 5.0) {
    trendStatus = 'accelerating';
    badgeText = 'Accelerating Growth';
    trendDesc = `Your learning momentum is compounding quickly (+${velocity}%/wk). On track to reach full mastery benchmark in ~${projectedMasteryWeeks} weeks.`;
  } else if (velocity >= 3.5) {
    trendStatus = 'steady';
    badgeText = 'Steady Trajectory';
    trendDesc = `Consistent progress pace (+${velocity}%/wk). Keeping up your current schedule will achieve target benchmarks in ${projectedMasteryWeeks} weeks.`;
  } else {
    trendStatus = 'needs_boost';
    badgeText = 'Requires Boost';
    trendDesc = `Study velocity is currently at +${velocity}%/wk. Increasing weekly study time by ~2 hours will significantly accelerate your progress.`;
  }

  return {
    weakestSubjects,
    strongestSubjects,
    improvementPlan,
    weeklyStudyHours: {
      total: totalWeeklyHours,
      dailyRecommendation,
      breakdown,
    },
    learningTrend: {
      status: trendStatus,
      weeklyVelocity: velocity,
      projectedMasteryWeeks,
      description: trendDesc,
      badgeText,
    },
  };
}

// ============================================================================
// 3. AI STUDY PLANNER ENGINE
// ============================================================================

export function generateAIStudyPlan(
  currentUser: Student,
  sessions: Session[],
  intensity: 'balanced' | 'accelerated' | 'light' = 'balanced'
): AIStudyPlanBlock[] {
  const insights = calculateAILearningInsights(currentUser, sessions);
  const weak = insights.weakestSubjects;
  const strong = insights.strongestSubjects;

  const days = [
    { day: 'Mon', full: 'Monday', timeSlot: '16:00 - 17:30' },
    { day: 'Tue', full: 'Tuesday', timeSlot: '17:00 - 18:30' },
    { day: 'Wed', full: 'Wednesday', timeSlot: '15:30 - 17:00' },
    { day: 'Thu', full: 'Thursday', timeSlot: '18:00 - 19:30' },
    { day: 'Fri', full: 'Friday', timeSlot: '16:00 - 17:30' },
    { day: 'Sat', full: 'Saturday', timeSlot: '10:30 - 12:30' },
    { day: 'Sun', full: 'Sunday', timeSlot: '15:00 - 16:30' },
  ];

  const techniques = [
    'Feynman Technique & Core Proofs',
    'Spaced Repetition & Problem Drilling',
    'Active Recall with Peer Code Review',
    'Pomodoro Sprint (25m drill + 5m review)',
    'Error Analysis & Misconception Log',
    'Timed Mock Assessment Simulation',
  ];

  const colors = [
    'border-blue-500/40 bg-blue-500/10 text-blue-500',
    'border-indigo-500/40 bg-indigo-500/10 text-indigo-500',
    'border-cyan-500/40 bg-cyan-500/10 text-cyan-500',
    'border-emerald-500/40 bg-emerald-500/10 text-emerald-500',
    'border-amber-500/40 bg-amber-500/10 text-amber-500',
    'border-purple-500/40 bg-purple-500/10 text-purple-500',
    'border-rose-500/40 bg-rose-500/10 text-rose-500',
  ];

  const plan: AIStudyPlanBlock[] = days.map((d, index) => {
    // Alternate priority between weakest subjects and reinforcement
    const isWeakFocus = index % 2 === 0 || index === 5;
    const subjectTarget = isWeakFocus
      ? weak[index % Math.max(1, weak.length)]?.subject || 'Operating Systems'
      : strong[index % Math.max(1, strong.length)]?.subject || 'Data Structures';

    let focusType: AIStudyPlanBlock['focusType'] = 'Weak Area Recovery';
    let topic = '';

    if (index === 0) {
      focusType = 'Weak Area Recovery';
      topic = `Fundamental Theory & Diagnostic Problem Set in ${subjectTarget}`;
    } else if (index === 1) {
      focusType = 'Practice Drill';
      topic = `Algorithmic Edge Cases & Timed Exercises in ${subjectTarget}`;
    } else if (index === 2) {
      focusType = 'Active Recall';
      topic = `Memory Encoding & Flashcard Sprint for ${subjectTarget}`;
    } else if (index === 3) {
      focusType = 'Peer Session';
      topic = `Collaborative Code Walkthrough & Q&A on ${subjectTarget}`;
    } else if (index === 4) {
      focusType = 'Core Review';
      topic = `Synthesizing Multi-Chapter Lecture Concepts in ${subjectTarget}`;
    } else if (index === 5) {
      focusType = 'Practice Drill';
      topic = `Comprehensive Weekend Exam Simulation for ${subjectTarget}`;
    } else {
      focusType = 'Core Review';
      topic = `Weekly Retrospective, Formula Sheet & Goal Setting`;
    }

    const duration = intensity === 'accelerated' ? 90 : intensity === 'light' ? 45 : 60;
    const xpReward = Math.round(duration * 1.5);

    // Compute mock date matching this week
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 is Sun
    const dayOffset = ((index + 1) - currentDayOfWeek + 7) % 7;
    const targetDate = new Date(now.getTime() + dayOffset * 86400000);
    const dateStr = targetDate.toISOString().split('T')[0];

    // Check if user already has a session booked on this day
    const hasSession = sessions.some(
      (s) => s.date === dateStr && s.status === 'scheduled'
    );

    return {
      id: `ai-plan-${index}-${intensity}`,
      day: d.day,
      dayFull: d.full,
      dateStr,
      subject: subjectTarget,
      topic,
      timeSlot: d.timeSlot,
      durationMinutes: duration,
      technique: techniques[index % techniques.length],
      focusType,
      xpReward,
      color: colors[index % colors.length],
      isBooked: hasSession,
    };
  });

  return plan;
}

// ============================================================================
// 4. AI PERFORMANCE PREDICTION ENGINE
// ============================================================================

export function calculateAIPerformancePrediction(
  currentUser: Student,
  sessions: Session[]
): AIPerformancePrediction {
  const insights = calculateAILearningInsights(currentUser, sessions);
  const velocity = insights.learningTrend.weeklyVelocity;

  // Subject predictions
  const subjectPredictions = currentUser.skills.map((sk) => {
    const isWeak = insights.weakestSubjects.some(
      (w) => normalize(w.subject) === normalize(sk.subject) && w.priority === 'High'
    );
    const growthFactor = isWeak ? 1.3 : 0.8;
    const proj4 = Math.min(98, Math.round(sk.rating + velocity * 4 * growthFactor));
    const proj8 = Math.min(99, Math.round(sk.rating + velocity * 8 * growthFactor * 0.85));
    const improvementPct = Math.round(((proj4 - sk.rating) / Math.max(sk.rating, 1)) * 100);

    return {
      subject: sk.subject,
      currentMastery: sk.rating,
      projected4Weeks: proj4,
      projected8Weeks: proj8,
      improvementPct: Math.max(4, improvementPct),
      confidence: isWeak ? 92 : 96,
      trend: 'up' as const,
    };
  });

  // 8-Week Growth Trajectory Data for Gradient Chart
  const baseAvg =
    currentUser.skills.reduce((a, b) => a + b.rating, 0) / Math.max(currentUser.skills.length, 1);

  const growthTrajectory = [
    { week: 'W0 (Now)', projected: Math.round(baseAvg), baseline: Math.round(baseAvg), target: 85 },
    {
      week: 'W1',
      projected: Math.round(baseAvg + velocity * 0.9),
      baseline: Math.round(baseAvg + 0.8),
      target: 85,
    },
    {
      week: 'W2',
      projected: Math.round(baseAvg + velocity * 1.9),
      baseline: Math.round(baseAvg + 1.5),
      target: 85,
    },
    {
      week: 'W3',
      projected: Math.round(baseAvg + velocity * 2.9),
      baseline: Math.round(baseAvg + 2.1),
      target: 85,
    },
    {
      week: 'W4',
      projected: Math.round(baseAvg + velocity * 3.8),
      baseline: Math.round(baseAvg + 2.7),
      target: 85,
    },
    {
      week: 'W5',
      projected: Math.round(baseAvg + velocity * 4.6),
      baseline: Math.round(baseAvg + 3.2),
      target: 85,
    },
    {
      week: 'W6',
      projected: Math.round(baseAvg + velocity * 5.3),
      baseline: Math.round(baseAvg + 3.7),
      target: 85,
    },
    {
      week: 'W7',
      projected: Math.round(baseAvg + velocity * 6.0),
      baseline: Math.round(baseAvg + 4.1),
      target: 85,
    },
    {
      week: 'W8',
      projected: Math.min(97, Math.round(baseAvg + velocity * 6.6)),
      baseline: Math.round(baseAvg + 4.5),
      target: 85,
    },
  ];

  // Detect Risk Areas
  const riskAreas: AIPerformancePrediction['riskAreas'] = [];

  insights.weakestSubjects.forEach((w) => {
    if (w.rating < 60) {
      riskAreas.push({
        id: `risk-${normalize(w.subject)}`,
        subject: w.subject,
        riskLevel: 'High',
        factor: 'Low Mastery Rating (<60%)',
        rootCause:
          'Prerequisite gap in foundational theory leading to high error rates on complex problem sets.',
        mitigation:
          'Schedule two 1-on-1 tutoring sessions this week and focus on step-by-step worked examples.',
      });
    } else if (w.rating < 72) {
      riskAreas.push({
        id: `risk-${normalize(w.subject)}`,
        subject: w.subject,
        riskLevel: 'Medium',
        factor: 'Sub-optimal Practice Velocity',
        rootCause:
          'Inconsistent review cadence causing concept decay between weekly assignment deadlines.',
        mitigation:
          'Incorporate 20-minute daily spaced repetition flashcards to reinforce core equations.',
      });
    }
  });

  if (riskAreas.length === 0) {
    riskAreas.push({
      id: 'risk-retention',
      subject: 'Long-term Retention',
      riskLevel: 'Low',
      factor: 'Knowledge Decay Over Time',
      rootCause: 'High performance across subjects with minimal review needed.',
      mitigation: 'Continue periodic mock quizzes every two weeks to preserve peak retention.',
    });
  }

  const avgImprovement =
    subjectPredictions.reduce((a, b) => a + b.improvementPct, 0) /
    Math.max(subjectPredictions.length, 1);

  return {
    subjectPredictions,
    growthTrajectory,
    riskAreas,
    overallGrowthIndex: Math.round(avgImprovement * 10) / 10,
    expectedGpaImpact: '+0.4 to +0.6 Projected Term GPA Increase',
  };
}

// ============================================================================
// 5. AI DASHBOARD SCORES ENGINE
// ============================================================================

export function calculateAIDashboardScores(
  currentUser: Student,
  sessions: Session[]
): AIDashboardScores {
  const userSkills = currentUser.skills || [];
  const streak = currentUser.streak || 1;
  const completedSessions = sessions.filter(
    (s) => s.status === 'completed' && (s.studentId === currentUser.id || s.tutorId === currentUser.id)
  ).length;
  const scheduledSessions = sessions.filter(
    (s) => s.status === 'scheduled' && (s.studentId === currentUser.id || s.tutorId === currentUser.id)
  ).length;

  // 1. Learning Health Score (0-100)
  // Combines skill balance, streak strength, and low-rating remediation
  const avgSkill =
    userSkills.length > 0
      ? userSkills.reduce((a, b) => a + b.rating, 0) / userSkills.length
      : 70;
  const minSkill =
    userSkills.length > 0 ? Math.min(...userSkills.map((s) => s.rating)) : 60;
  const streakFactor = Math.min(100, streak * 8);

  const healthScore = Math.min(
    99,
    Math.max(45, Math.round(avgSkill * 0.45 + minSkill * 0.25 + streakFactor * 0.20 + (completedSessions * 2.5)))
  );

  let healthRating: AIDashboardScores['healthRating'] = 'Good';
  if (healthScore >= 90) healthRating = 'Exceptional';
  else if (healthScore >= 78) healthRating = 'Optimal';
  else if (healthScore >= 65) healthRating = 'Good';
  else healthRating = 'Needs Attention';

  // 2. Productivity Score (0-100)
  // Evaluates study momentum, session completion, and XP acquisition
  const xpVelocity = Math.min(100, Math.round((currentUser.xp || 500) / 30));
  const sessionProductivity = Math.min(100, completedSessions * 18 + scheduledSessions * 8 + 45);
  const productivityScore = Math.min(
    99,
    Math.max(50, Math.round(sessionProductivity * 0.6 + xpVelocity * 0.4))
  );

  // 3. Study Consistency Score (0-100)
  // Evaluates daily streak adherence and regular schedule cadence
  const consistencyScore = Math.min(
    99,
    Math.max(40, Math.round(Math.min(100, streak * 10 + 35) * 0.7 + (scheduledSessions > 0 ? 25 : 10)))
  );

  return {
    healthScore,
    healthScoreDelta: 4.8,
    healthRating,
    productivityScore,
    productivityScoreDelta: 6.2,
    consistencyScore,
    consistencyScoreDelta: 3.5,
  };
}
