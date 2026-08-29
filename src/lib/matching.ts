import type { Student, Tutor, MatchResult, PeerMatch, MatchTier, PeerMatchBreakdownItem } from '@/types';

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
function normalize(str: string): string {
  return str.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
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
  if (!allStudents || allStudents.length === 0) return [];

  const matches = allStudents
    .filter((s) => s.id !== currentUser.id && s.email !== currentUser.email)
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
