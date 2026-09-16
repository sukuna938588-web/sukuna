import type {
  Student,
  Tutor,
  Subject,
  MatchResult,
  PeerMatch,
  MatchTier,
  PeerMatchBreakdownItem,
  TutorMatch,
  SubjectWiseMatchDetail,
  TutorMatchBreakdownItem,
} from '../types';

const TUTOR_WEIGHTS = {
  expertise: 0.4,
  availability: 0.2,
  rating: 0.15,
  successRate: 0.15,
  compatibility: 0.1,
};

/**
 * Returns the matching tier based on numerical score:
 * - 90-100 = Perfect Match
 * - 75-89 = Excellent Match
 * - 60-74 = Good Match
 * - Below 60 = Basic Match
 */
export function getMatchTier(score: number): {
  tier: MatchTier;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentGradient: string;
} {
  if (score >= 90) {
    return {
      tier: 'Perfect Match',
      color: 'emerald',
      badgeBg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
      badgeBorder: 'border-emerald-500/40 dark:border-emerald-400/50',
      badgeText: 'text-emerald-700 dark:text-emerald-300 font-semibold',
      accentGradient: 'from-emerald-500 to-teal-400',
    };
  }
  if (score >= 75) {
    return {
      tier: 'Excellent Match',
      color: 'sky',
      badgeBg: 'bg-sky-500/15 dark:bg-sky-500/20',
      badgeBorder: 'border-sky-500/40 dark:border-sky-400/50',
      badgeText: 'text-sky-700 dark:text-sky-300 font-semibold',
      accentGradient: 'from-sky-500 to-primary-500',
    };
  }
  if (score >= 60) {
    return {
      tier: 'Good Match',
      color: 'amber',
      badgeBg: 'bg-amber-500/15 dark:bg-amber-500/20',
      badgeBorder: 'border-amber-500/40 dark:border-amber-400/50',
      badgeText: 'text-amber-700 dark:text-amber-300 font-semibold',
      accentGradient: 'from-amber-500 to-orange-400',
    };
  }
  return {
    tier: 'Basic Match',
    color: 'slate',
    badgeBg: 'bg-slate-500/15 dark:bg-slate-500/20',
    badgeBorder: 'border-slate-500/30 dark:border-slate-400/40',
    badgeText: 'text-slate-700 dark:text-slate-300 font-medium',
    accentGradient: 'from-slate-500 to-slate-400',
  };
}

/**
 * Normalizes subject names for case-insensitive matching
 */
export function normalize(str: string): string {
  return (str || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Checks if a subject string matches any active subject created via Add Subject form
 * Returns the canonical Subject from the active catalog if found, or undefined
 */
export function findActiveSubject(subjectStr: string, activeSubjects: Subject[]): Subject | undefined {
  if (!subjectStr || !Array.isArray(activeSubjects) || activeSubjects.length === 0) {
    return undefined;
  }
  const target = normalize(subjectStr);
  if (!target) return undefined;

  return activeSubjects.find((sub) => {
    const normName = normalize(sub.name);
    const normCode = normalize(sub.code);
    return (
      normName === target ||
      normCode === target ||
      (normName.length > 2 && target.length > 2 && (normName.includes(target) || target.includes(normName))) ||
      (normCode.length > 1 && target.length > 1 && (normCode.includes(target) || target.includes(normCode)))
    );
  });
}

/**
 * Returns canonical active subjects that are listed in the student's Strengths
 */
export function getActiveStudentStrengths(student: Student, activeSubjects: Subject[]): string[] {
  if (!student || !Array.isArray(student.strengths)) return [];
  const set = new Set<string>();
  student.strengths.forEach((str) => {
    const active = findActiveSubject(str, activeSubjects);
    if (active) set.add(active.name);
  });
  return Array.from(set);
}

/**
 * Returns canonical active subjects that are listed in the student's Weaknesses
 */
export function getActiveStudentWeaknesses(student: Student, activeSubjects: Subject[]): string[] {
  if (!student) return [];
  const set = new Set<string>();
  const rawList = [
    ...(Array.isArray(student.weaknesses) ? student.weaknesses : []),
    ...(Array.isArray(student.weakSubjects) ? student.weakSubjects : []),
  ];
  rawList.forEach((str) => {
    const active = findActiveSubject(str, activeSubjects);
    if (active) set.add(active.name);
  });
  return Array.from(set);
}

/**
 * Calculates real-time Tutor Matching between a learner and a student acting as tutor.
 * 
 * Tutor Matching Logic:
 * - Every student can become a tutor.
 * - A student is considered a tutor for subjects listed in their Strengths.
 * - A student needs help for subjects listed in their Weaknesses.
 * - Only subjects existing in the active Subjects list (Local Storage) are valid.
 * - If a subject is deleted, related matches are immediately removed.
 */
export function calculateTutorMatch(
  learner: Student,
  tutor: Student,
  activeSubjects: Subject[]
): TutorMatch | null {
  if (!learner || !tutor || learner.id === tutor.id) return null;

  // Weaknesses of the learner that exist in the active subject catalog
  const learnerWeaknesses = getActiveStudentWeaknesses(learner, activeSubjects);
  // Strengths of the tutor that exist in the active subject catalog
  const tutorStrengths = getActiveStudentStrengths(tutor, activeSubjects);

  // Subject matching: Tutor is a tutor for subjects listed in their Strengths
  // Learner needs help for subjects listed in their Weaknesses
  const matchedSubjects: string[] = [];
  tutorStrengths.forEach((ts) => {
    if (learnerWeaknesses.some((lw) => normalize(lw) === normalize(ts))) {
      if (!matchedSubjects.includes(ts)) {
        matchedSubjects.push(ts);
      }
    }
  });

  // If no subject matches, this student cannot be recommended as a tutor for this learner
  if (matchedSubjects.length === 0) {
    return null;
  }

  // Reciprocal matching: learner's strengths that tutor needs help with
  const learnerStrengths = getActiveStudentStrengths(learner, activeSubjects);
  const tutorWeaknesses = getActiveStudentWeaknesses(tutor, activeSubjects);
  const reciprocalSubjects: string[] = [];
  learnerStrengths.forEach((ls) => {
    if (tutorWeaknesses.some((tw) => normalize(tw) === normalize(ls))) {
      if (!reciprocalSubjects.includes(ls)) {
        reciprocalSubjects.push(ls);
      }
    }
  });

  // Calculate Match Score (%)
  const coverageRatio = matchedSubjects.length / Math.max(1, learnerWeaknesses.length);
  let baseScore = 84 + Math.round(coverageRatio * 6);
  if (reciprocalSubjects.length > 0) {
    baseScore += 6;
  }
  const learnerDept = normalize(learner.department || '');
  const tutorDept = normalize(tutor.department || '');
  if (learnerDept && tutorDept && (learnerDept === tutorDept || learnerDept.includes(tutorDept) || tutorDept.includes(learnerDept))) {
    baseScore += 2;
  }
  if ((tutor.year || 1) >= (learner.year || 1)) {
    baseScore += 2;
  }

  const finalScore = Math.max(65, Math.min(99, baseScore));
  const confidence = Math.min(98, Math.round(finalScore * 0.96 + (reciprocalSubjects.length > 0 ? 3 : 0)));
  const tierInfo = getMatchTier(finalScore);

  // Why this tutor was selected
  const whyParts: string[] = [];
  whyParts.push(
    `Selected as tutor for ${matchedSubjects.join(', ')}: Demonstrates verified strength in ${matchedSubjects.join(', ')} which directly matches ${learner.name}'s target weakness.`
  );
  if (reciprocalSubjects.length > 0) {
    whyParts.push(
      `Two-way mutual learning: ${learner.name} can tutor ${tutor.name} in ${reciprocalSubjects.join(', ')}.`
    );
  }
  if (learner.department && tutor.department && normalize(learner.department) === normalize(tutor.department)) {
    whyParts.push(`Shared department curriculum in ${tutor.department}.`);
  }
  if ((tutor.year || 1) > (learner.year || 1)) {
    whyParts.push(`Senior student mentorship (Year ${tutor.year}).`);
  }

  const whySelected = whyParts.join(' ');

  // Subject-wise matching details
  const subjectWiseDetails: SubjectWiseMatchDetail[] = [];
  matchedSubjects.forEach((sub) => {
    subjectWiseDetails.push({
      subject: sub,
      isTutorStrength: true,
      isLearnerWeakness: true,
      isReciprocal: false,
      status: 'Direct Tutor Match',
      description: `${tutor.name} (Strength) tutors ${learner.name} (Weakness)`,
    });
  });
  reciprocalSubjects.forEach((sub) => {
    subjectWiseDetails.push({
      subject: sub,
      isTutorStrength: false,
      isLearnerWeakness: false,
      isReciprocal: true,
      status: 'Reciprocal Exchange',
      description: `${learner.name} (Strength) can mentor ${tutor.name} (Weakness)`,
    });
  });

  const breakdown: TutorMatchBreakdownItem[] = [
    {
      label: 'Subject Coverage',
      weight: 0.40,
      value: Math.min(100, Math.round(coverageRatio * 100)),
      description: `Covers ${matchedSubjects.length} of ${learnerWeaknesses.length} weak subjects (${matchedSubjects.join(', ')})`,
    },
    {
      label: 'Strength Alignment',
      weight: 0.25,
      value: 95,
      description: `Tutor has verified strengths in ${matchedSubjects.join(', ')}`,
    },
    {
      label: 'Reciprocal Exchange',
      weight: 0.15,
      value: reciprocalSubjects.length > 0 ? 95 : 60,
      description: reciprocalSubjects.length > 0
        ? `Mutual exchange: ${learner.name} helps in ${reciprocalSubjects.join(', ')}`
        : 'One-directional tutoring guidance',
    },
    {
      label: 'Department Synergy',
      weight: 0.10,
      value: learnerDept === tutorDept ? 100 : 75,
      description: learnerDept === tutorDept ? `Shared ${tutor.department} coursework` : `${tutor.department} curriculum`,
    },
    {
      label: 'Academic Year Synergy',
      weight: 0.10,
      value: (tutor.year || 1) >= (learner.year || 1) ? 95 : 80,
      description: `Year ${tutor.year || 1} tutor with Year ${learner.year || 1} learner`,
    },
  ];

  return {
    tutor,
    learner,
    matchedSubjects,
    reciprocalSubjects,
    score: finalScore,
    confidence,
    tier: tierInfo.tier,
    whySelected,
    subjectWiseDetails,
    breakdown,
  };
}

/**
 * Finds and ranks all student tutors for the specified learner.
 * Evaluates only students in allStudents and activeSubjects from Local Storage.
 */
export function findTutorMatches(
  learner: Student,
  allStudents: Student[],
  activeSubjects: Subject[]
): TutorMatch[] {
  if (!learner || !allStudents || allStudents.length === 0 || !activeSubjects || activeSubjects.length === 0) {
    return [];
  }

  const matches: TutorMatch[] = [];
  allStudents.forEach((student) => {
    if (student.id === learner.id || student.email === learner.email) return;
    const match = calculateTutorMatch(learner, student, activeSubjects);
    if (match) {
      matches.push(match);
    }
  });

  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Converts a Student into a Tutor representation for scheduling & session compatibility.
 */
export function studentToTutor(student: Student, activeSubjects?: Subject[]): Tutor {
  const subjectsList = activeSubjects
    ? getActiveStudentStrengths(student, activeSubjects)
    : (student.strengths || []);

  return {
    id: student.id,
    name: student.name,
    title: `Student Tutor (Year ${student.year || 1})`,
    email: student.email,
    avatar: student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.name)}`,
    department: student.department || 'General Engineering',
    subjects: subjectsList.length > 0 ? subjectsList : (student.strengths || ['General']),
    expertise: (student.strengths || []).map((s) => ({ subject: s, rating: 90 })),
    rating: student.rating || 4.9,
    reviewCount: 12,
    successRate: 94,
    sessionsCompleted: 15,
    availability: student.availability || [],
    hourlyRate: 0,
    bio: student.bio || `Student tutor specializing in ${subjectsList.join(', ') || 'coursework'}.`,
    badges: ['Peer Tutor', 'Subject Strong'],
    reviews: [],
  };
}

/**
 * Extracts student's strong subjects from strengths and high-rated skills
 */
export function getStudentStrongSubjects(student: Student): string[] {
  const list = new Set<string>();
  if (Array.isArray(student.strengths)) {
    student.strengths.forEach((s) => list.add(s));
  }
  if (Array.isArray(student.skills)) {
    student.skills
      .filter((sk) => sk.rating >= 70)
      .forEach((sk) => list.add(sk.subject));
  }
  return Array.from(list);
}

/**
 * Extracts student's weak subjects from weaknesses and weakSubjects
 */
export function getStudentWeakSubjects(student: Student): string[] {
  const list = new Set<string>();
  if (Array.isArray(student.weaknesses)) {
    student.weaknesses.forEach((w) => list.add(w));
  }
  if (Array.isArray(student.weakSubjects)) {
    student.weakSubjects.forEach((w) => list.add(w));
  }
  if (Array.isArray(student.skills)) {
    student.skills
      .filter((sk) => sk.rating < 60)
      .forEach((sk) => list.add(sk.subject));
  }
  return Array.from(list);
}

/**
 * Calculates the AI Peer Match Score and rationale between two students
 * Evaluates:
 * 1. Strong-to-Weak Subject coverage (40% weight)
 * 2. Skill Mastery / Proficiency of peer (20% weight)
 * 3. Reciprocal learning synergy (15% weight)
 * 4. Department alignment (15% weight)
 * 5. Academic Year synergy (10% weight)
 */
export function calculateAIPeerMatch(currentUser: Student, peer: Student): PeerMatch {
  const userWeak = getStudentWeakSubjects(currentUser);
  const userStrong = getStudentStrongSubjects(currentUser);
  const peerStrong = getStudentStrongSubjects(peer);
  const peerWeak = getStudentWeakSubjects(peer);

  // 1. Strong-to-Weak Subjects Match (Peer strong in what user needs help with)
  const matchedSubjects: string[] = [];
  peerStrong.forEach((ps) => {
    const normPs = normalize(ps);
    if (userWeak.some((uw) => normalize(uw) === normPs || normPs.includes(normalize(uw)) || normalize(uw).includes(normPs))) {
      if (!matchedSubjects.includes(ps)) {
        matchedSubjects.push(ps);
      }
    }
  });

  // Calculate subject coverage score (0 to 1)
  const subjectScore = userWeak.length > 0
    ? Math.min(1, matchedSubjects.length / Math.min(userWeak.length, 3))
    : matchedSubjects.length > 0 ? 0.7 : 0.4;

  // 2. Peer Skill Proficiency in matched subjects (0 to 1)
  let skillProficiencyScore = 0.5;
  if (matchedSubjects.length > 0 && Array.isArray(peer.skills) && peer.skills.length > 0) {
    let totalRating = 0;
    let count = 0;
    matchedSubjects.forEach((sub) => {
      const normSub = normalize(sub);
      const sk = peer.skills.find((s) => normalize(s.subject) === normSub || normalize(s.subject).includes(normSub));
      if (sk) {
        totalRating += sk.rating;
        count++;
      } else {
        totalRating += 75; // default estimation for designated strength
        count++;
      }
    });
    skillProficiencyScore = count > 0 ? totalRating / (count * 100) : 0.75;
  } else if (peerStrong.length > 0) {
    skillProficiencyScore = 0.75;
  }

  // 3. Reciprocal Synergy (User strong in what peer needs help with)
  const reciprocalSubjects: string[] = [];
  userStrong.forEach((us) => {
    const normUs = normalize(us);
    if (peerWeak.some((pw) => normalize(pw) === normUs || normUs.includes(normalize(pw)) || normalize(pw).includes(normUs))) {
      if (!reciprocalSubjects.includes(us)) {
        reciprocalSubjects.push(us);
      }
    }
  });
  const reciprocalScore = peerWeak.length > 0
    ? Math.min(1, reciprocalSubjects.length / Math.max(peerWeak.length, 1))
    : reciprocalSubjects.length > 0 ? 0.6 : 0.3;

  // 4. Department Alignment (0 to 1)
  const userDept = (currentUser.department || '').toLowerCase();
  const peerDept = (peer.department || '').toLowerCase();
  let deptScore = 0.4;
  let departmentMatch = false;

  if (userDept && peerDept) {
    if (userDept === peerDept || userDept.includes(peerDept) || peerDept.includes(userDept)) {
      deptScore = 1.0;
      departmentMatch = true;
    } else if (
      (userDept.includes('computer') || userDept.includes('data') || userDept.includes('information') || userDept.includes('ai')) &&
      (peerDept.includes('computer') || peerDept.includes('data') || peerDept.includes('information') || peerDept.includes('ai'))
    ) {
      deptScore = 0.85;
      departmentMatch = true;
    } else if (userDept.includes('engineering') && peerDept.includes('engineering')) {
      deptScore = 0.7;
    }
  }

  // 5. Academic Year Synergy (0 to 1)
  const userYear = currentUser.year || 1;
  const peerYear = peer.year || 1;
  let yearScore = 0.5;
  let yearSynergy = 'Different Academic Year';

  if (peerYear === userYear) {
    yearScore = 0.95;
    yearSynergy = `Same Year (${peerYear}rd Year) · Shared Coursework & Deadlines`;
  } else if (peerYear === userYear + 1) {
    yearScore = 1.0;
    yearSynergy = `Senior Mentor (+1 Year) · Completed Courses Guidance`;
  } else if (peerYear > userYear + 1) {
    yearScore = 0.9;
    yearSynergy = `Advanced Mentor (Year ${peerYear}) · High Academic Experience`;
  } else {
    yearScore = 0.7;
    yearSynergy = `Junior Peer (Year ${peerYear}) · Collaborative Study`;
  }

  // Calculate composite weighted raw score (0-100)
  const rawScore = Math.round(
    (subjectScore * 0.40 +
      skillProficiencyScore * 0.20 +
      reciprocalScore * 0.15 +
      deptScore * 0.15 +
      yearScore * 0.10) * 100
  );

  // Bonus for strong multi-subject overlap and active stats
  let finalScore = rawScore;
  if (matchedSubjects.length >= 2 && reciprocalSubjects.length >= 1 && departmentMatch) {
    finalScore = Math.min(99, Math.max(92, rawScore + 6));
  } else if (matchedSubjects.length >= 1 && departmentMatch) {
    finalScore = Math.max(finalScore, 76);
  } else if (matchedSubjects.length === 0 && !departmentMatch) {
    finalScore = Math.min(58, rawScore);
  }

  // Clamp within 35 to 99 range
  finalScore = Math.max(35, Math.min(99, finalScore));

  const tierInfo = getMatchTier(finalScore);

  // Formulate natural language AI Match Reason
  const reasonParts: string[] = [];

  if (matchedSubjects.length > 0) {
    reasonParts.push(
      `Strong in ${matchedSubjects.join(' & ')} (your target weak area${matchedSubjects.length > 1 ? 's' : ''})`
    );
  }

  if (reciprocalSubjects.length > 0) {
    reasonParts.push(
      `Mutual benefit: you can help them with ${reciprocalSubjects.join(' & ')}`
    );
  }

  if (departmentMatch) {
    reasonParts.push(`Shared curriculum in ${peer.department}`);
  }

  if (peerYear === userYear) {
    reasonParts.push(`Same Year ${userYear} study pace`);
  } else if (peerYear > userYear) {
    reasonParts.push(`Senior mentorship (Year ${peerYear})`);
  }

  if (reasonParts.length === 0) {
    reasonParts.push(
      `Complementary skill set with good foundation in ${peerStrong.slice(0, 2).join(', ') || 'engineering fundamentals'}`
    );
  }

  const reason = reasonParts.join('. ') + '.';

  const breakdown: PeerMatchBreakdownItem[] = [
    {
      label: 'Subject Coverage',
      weight: 0.40,
      value: Math.round(subjectScore * 100),
      description: matchedSubjects.length > 0
        ? `Covers ${matchedSubjects.length} of your target subjects (${matchedSubjects.join(', ')})`
        : 'General subject compatibility',
    },
    {
      label: 'Peer Skill Proficiency',
      weight: 0.20,
      value: Math.round(skillProficiencyScore * 100),
      description: `Peer mastery in matched topics: ${Math.round(skillProficiencyScore * 100)}%`,
    },
    {
      label: 'Reciprocal Exchange',
      weight: 0.15,
      value: Math.round(reciprocalScore * 100),
      description: reciprocalSubjects.length > 0
        ? `Two-way tutoring: you help in ${reciprocalSubjects.join(', ')}`
        : 'One-directional tutoring guidance',
    },
    {
      label: 'Department Synergy',
      weight: 0.15,
      value: Math.round(deptScore * 100),
      description: departmentMatch
        ? `Matching syllabus in ${peer.department}`
        : `Cross-departmental study (${peer.department})`,
    },
    {
      label: 'Academic Year Level',
      weight: 0.10,
      value: Math.round(yearScore * 100),
      description: yearSynergy,
    },
  ];

  return {
    student: peer,
    matchedSubjects,
    reciprocalSubjects,
    strongSubjects: peerStrong,
    weakSubjects: peerWeak,
    score: finalScore,
    tier: tierInfo.tier,
    reason,
    departmentMatch,
    yearSynergy,
    breakdown,
  };
}

/**
 * Finds and ranks peer matches for the given student across all registered students.
 * Automatically filters out the current student, computes AI match scores, and sorts highest score first.
 */
export function findPeerMatches(currentUser: Student, allStudents: Student[]): PeerMatch[] {
  if (!allStudents || allStudents.length === 0 || !currentUser) return [];

  const matches = allStudents
    .filter((s) => s && s.id !== currentUser.id && s.email !== currentUser.email)
    .map((peer) => calculateAIPeerMatch(currentUser, peer))
    .sort((a, b) => b.score - a.score); // Highest score first

  return matches;
}

/**
 * Tutor matching calculations for professional tutor catalog
 */
function availabilityOverlap(student: Student, tutor: Tutor): number {
  let overlap = 0;
  let total = 0;
  for (const s of (student.availability || [])) {
    total++;
    const match = (tutor.availability || []).find((t) => t.day === s.day);
    if (match) {
      const sStart = parseInt(s.start.replace(':', ''));
      const sEnd = parseInt(s.end.replace(':', ''));
      const tStart = parseInt(match.start.replace(':', ''));
      const tEnd = parseInt(match.end.replace(':', ''));
      const start = Math.max(sStart, tStart);
      const end = Math.min(sEnd, tEnd);
      if (end > start) overlap++;
    }
  }
  return total === 0 ? 0.6 : overlap / total;
}

function expertiseMatch(student: Student, tutor: Tutor): number {
  const weak = getStudentWeakSubjects(student);
  if (weak.length === 0) return 0.5;
  let total = 0;
  for (const w of weak) {
    const exp = (tutor.expertise || []).find((e) => normalize(e.subject) === normalize(w));
    total += exp ? exp.rating / 100 : 0.4;
  }
  return total / weak.length;
}

function compatibilityScore(student: Student, tutor: Tutor): number {
  const sharedDept = (student.department || '').toLowerCase().includes('computer') ===
    (tutor.department || '').toLowerCase().includes('computer') ? 0.5 : 0;
  const prefMatch = (student.learningPreferences || []).length > 0 ? 0.5 : 0.3;
  return sharedDept + prefMatch;
}

export function calculateMatch(student: Student, tutor: Tutor): MatchResult {
  const expertise = expertiseMatch(student, tutor);
  const availability = availabilityOverlap(student, tutor);
  const rating = Math.max(0, (tutor.rating - 3.0) / 2.0);
  const success = (tutor.successRate || 80) / 100;
  const compatibility = compatibilityScore(student, tutor);

  const score = Math.round(
    (expertise * TUTOR_WEIGHTS.expertise +
      availability * TUTOR_WEIGHTS.availability +
      rating * TUTOR_WEIGHTS.rating +
      success * TUTOR_WEIGHTS.successRate +
      compatibility * TUTOR_WEIGHTS.compatibility) * 100
  );

  const confidence = Math.min(99, Math.round(score + ((tutor.reviewCount || 0) > 20 ? 6 : 0)));

  const reasons: string[] = [];
  const weak = getStudentWeakSubjects(student);
  const matchedSubjects = weak.filter((w) =>
    (tutor.expertise || []).some((e) => normalize(e.subject) === normalize(w) && e.rating >= 80)
  );
  if (matchedSubjects.length > 0) reasons.push(`Strong expertise in your target subjects: ${matchedSubjects.join(', ')}`);
  if (availability > 0.4) reasons.push('Schedule availability overlap');
  if (tutor.rating >= 4.7) reasons.push(`Top-rated tutor (${tutor.rating.toFixed(1)}★)`);
  if (tutor.successRate >= 90) reasons.push(`High ${tutor.successRate}% student success rate`);
  if (reasons.length === 0) reasons.push('Overall high compatibility with your curriculum');

  return {
    tutor,
    score: Math.max(45, Math.min(99, score)),
    confidence: Math.max(50, Math.min(99, confidence)),
    reasons,
    breakdown: [
      { label: 'Subject Expertise', weight: TUTOR_WEIGHTS.expertise, value: Math.round(expertise * 100) },
      { label: 'Availability', weight: TUTOR_WEIGHTS.availability, value: Math.round(availability * 100) },
      { label: 'Tutor Rating', weight: TUTOR_WEIGHTS.rating, value: Math.round(rating * 100) },
      { label: 'Success Rate', weight: TUTOR_WEIGHTS.successRate, value: Math.round(success * 100) },
      { label: 'Compatibility', weight: TUTOR_WEIGHTS.compatibility, value: Math.round(compatibility * 100) },
    ],
  };
}

export function rankMatches(student: Student, tutors: Tutor[]): MatchResult[] {
  return tutors.map((t) => calculateMatch(student, t)).sort((a, b) => b.score - a.score);
}

export function findGroupMatches(student: Student, allStudents: Student[]): {
  subject: string;
  peers: Student[];
}[] {
  const weak = getStudentWeakSubjects(student);
  if (weak.length === 0) return [];

  return weak.map((subject) => ({
    subject,
    peers: allStudents.filter((s) => s.id !== student.id && (
      (s.weaknesses || []).some((w) => normalize(w) === normalize(subject)) ||
      (s.weakSubjects || []).some((w) => normalize(w) === normalize(subject))
    )).slice(0, 4),
  }));
}
