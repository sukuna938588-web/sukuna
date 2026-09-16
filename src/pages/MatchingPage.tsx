import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  X,
  Check,
  Users,
  Brain,
  GraduationCap,
  ArrowLeftRight,
  Calendar,
  CheckCircle2,
  Zap,
  SlidersHorizontal,
  Star,
  Video,
  MapPin,
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import { tutors } from '../data/mockData';
import {
  findPeerMatches,
  getMatchTier,
  getStudentWeakSubjects,
} from '../lib/matching';
import { calculateSmartAITutorRecommendations } from '../lib/aiEngine';
import { AITutorDetailModal } from '../components/ai/AITutorDetailModal';
import type { PeerMatch, AITutorRecommendation } from '../types';

export function MatchingPage() {
  const { notify } = useToast();
  const { students, currentUser, createSession } = useData();

  // Mode: AI Tutor Recommendations vs AI Peer Matches
  const [matchingMode, setMatchingMode] = useState<'tutors' | 'peers'>('tutors');

  // Search and filter state
  const [query, setQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [onlyReciprocal, setOnlyReciprocal] = useState(false);

  // Modals state
  const [selectedPeerMatch, setSelectedPeerMatch] = useState<PeerMatch | null>(null);
  const [bookingPeerMatch, setBookingPeerMatch] = useState<PeerMatch | null>(null);
  const [selectedTutorRec, setSelectedTutorRec] = useState<AITutorRecommendation | null>(null);

  // Booking form state
  const [bookingSubject, setBookingSubject] = useState('');
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('16:00');
  const [bookingMode, setBookingMode] = useState<'online' | 'in-person'>('online');
  const [bookingTopic, setBookingTopic] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Dynamic user strong & weak subjects
  const userWeakSubjects = useMemo(() => getStudentWeakSubjects(currentUser), [currentUser]);

  // Compute Smart AI Tutor Recommendations
  const allTutorRecommendations = useMemo(() => {
    return calculateSmartAITutorRecommendations(currentUser, tutors);
  }, [currentUser]);

  // Compute all AI Peer Matches sorted highest score first
  const allPeerMatches = useMemo(() => {
    return findPeerMatches(currentUser, students);
  }, [currentUser, students]);

  // Filtered Tutor Recommendations
  const filteredTutors = useMemo(() => {
    return allTutorRecommendations.filter((rec) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        rec.tutor.name.toLowerCase().includes(q) ||
        rec.tutor.department.toLowerCase().includes(q) ||
        rec.tutor.subjects.some((s) => s.toLowerCase().includes(q)) ||
        rec.matchedWeakSubjects.some((s) => s.toLowerCase().includes(q));

      const matchesTier = selectedTier === 'all' || rec.tier === selectedTier;
      const matchesSubject =
        selectedSubject === 'all' ||
        rec.tutor.subjects.some((s) => s.toLowerCase() === selectedSubject.toLowerCase()) ||
        rec.matchedWeakSubjects.some((s) => s.toLowerCase() === selectedSubject.toLowerCase());

      return matchesQuery && matchesTier && matchesSubject;
    });
  }, [allTutorRecommendations, query, selectedTier, selectedSubject]);

  // Extract all available subjects across tutor & peer strengths for filtering
  const allSubjects = useMemo(() => {
    const set = new Set<string>();
    allTutorRecommendations.forEach((r) => {
      r.tutor.subjects.forEach((s) => set.add(s));
    });
    allPeerMatches.forEach((m) => {
      m.strongSubjects.forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }, [allTutorRecommendations, allPeerMatches]);

  // Filter matches based on search query, tier filter, subject filter, and reciprocal toggle
  const filteredMatches = useMemo(() => {
    return allPeerMatches.filter((m) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        m.student.name.toLowerCase().includes(q) ||
        m.student.department.toLowerCase().includes(q) ||
        m.strongSubjects.some((s) => s.toLowerCase().includes(q)) ||
        m.matchedSubjects.some((s) => s.toLowerCase().includes(q));

      const matchesTier = selectedTier === 'all' || m.tier === selectedTier;
      const matchesSubject =
        selectedSubject === 'all' ||
        m.strongSubjects.some((s) => s.toLowerCase() === selectedSubject.toLowerCase());
      const matchesReciprocal = !onlyReciprocal || m.reciprocalSubjects.length > 0;

      return matchesQuery && matchesTier && matchesSubject && matchesReciprocal;
    });
  }, [allPeerMatches, query, selectedTier, selectedSubject, onlyReciprocal]);

  // Summary counts for badges
  const tierCounts = useMemo(() => {
    return {
      perfect: allPeerMatches.filter((m) => m.score >= 90).length,
      excellent: allPeerMatches.filter((m) => m.score >= 75 && m.score < 90).length,
      good: allPeerMatches.filter((m) => m.score >= 60 && m.score < 75).length,
      basic: allPeerMatches.filter((m) => m.score < 60).length,
      reciprocal: allPeerMatches.filter((m) => m.reciprocalSubjects.length > 0).length,
      topTutors: allTutorRecommendations.filter((t) => t.score >= 85).length,
    };
  }, [allPeerMatches, allTutorRecommendations]);

  // Handle booking confirmation
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPeerMatch) return;

    const chosenSubject =
      bookingSubject ||
      bookingPeerMatch.matchedSubjects[0] ||
      bookingPeerMatch.strongSubjects[0] ||
      'Study Session';

    setIsBooking(true);
    setTimeout(() => {
      createSession({
        studentId: currentUser.id,
        studentName: currentUser.name,
        tutorId: bookingPeerMatch.student.id,
        tutorName: bookingPeerMatch.student.name,
        subject: chosenSubject,
        date: bookingDate,
        startTime: bookingTime,
        endTime: `${parseInt(bookingTime.split(':')[0]) + 1}:00`,
        mode: bookingMode,
        topic: bookingTopic || `Peer tutoring in ${chosenSubject}`,
      });

      setIsBooking(false);
      notify({
        title: 'Tutor Match Accepted & Booked!',
        message: `Match with ${bookingPeerMatch.student.name} accepted! Session successfully scheduled.`,
        type: 'success',
      });
      setBookingPeerMatch(null);
      setBookingTopic('');
    }, 400);
  };

  const openBookingModal = (pm: PeerMatch) => {
    setBookingPeerMatch(pm);
    setBookingSubject(pm.matchedSubjects[0] || pm.strongSubjects[0] || '');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-2">
            <Brain className="w-3.5 h-3.5" />
            AI Cognitive Recommendation Engine
          </div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-slate-900 dark:text-slate-100">
            AI Tutor & Peer Matching
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Multi-dimensional matching analyzing your weak subjects, skills, department, year, and learning preferences.
          </p>
        </div>

        {/* Action Link to Profile */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-xs font-semibold hover:border-primary-500/40 text-slate-700 dark:text-slate-200 transition-all self-start md:self-auto shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary-500" />
          Edit My Weak Subjects & Profile
        </Link>
      </div>

      {/* Dynamic Active User Profile Context Banner */}
      <GlassCard className="p-5 border border-primary-500/20 bg-gradient-to-r from-primary-500/5 via-accent-500/5 to-transparent">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-2xl bg-slate-200 object-cover ring-2 ring-primary-500/30 shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
                  {currentUser.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  {currentUser.department}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold">
                  Year {currentUser.year}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                AI calculations adapt live to your skills, weak areas, and learning preferences.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200/60 dark:border-slate-800/60 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[11px] mb-1">
                Your Priority Weak Subjects (Target):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {userWeakSubjects.length > 0 ? (
                  userWeakSubjects.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-medium text-[11px]"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic">No weak subjects set</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-medium block text-[11px] mb-1">
                Learning Preferences:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(currentUser.learningPreferences || ['Visual Learning', 'Interactive Practice']).map(
                  (p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-medium text-[11px]"
                    >
                      {p}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Mode Selector Tabs: Smart AI Tutors vs Peer Matching */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass border border-slate-200/70 dark:border-slate-800/70 w-fit">
        <button
          onClick={() => {
            setMatchingMode('tutors');
            setSelectedTier('all');
          }}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            matchingMode === 'tutors'
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Smart AI Tutor Recommendations
          <span
            className={`px-2 py-0.2 rounded-full text-[10px] ${
              matchingMode === 'tutors'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {allTutorRecommendations.length}
          </span>
        </button>

        <button
          onClick={() => {
            setMatchingMode('peers');
            setSelectedTier('all');
          }}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            matchingMode === 'peers'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-glow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          AI Peer Student Matching
          <span
            className={`px-2 py-0.2 rounded-full text-[10px] ${
              matchingMode === 'peers'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {allPeerMatches.length}
          </span>
        </button>
      </div>

      {/* AI Metric Filters Bar */}
      {matchingMode === 'tutors' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setSelectedTier('all')}
            className={`p-3.5 rounded-2xl glass transition-all text-left border ${
              selectedTier === 'all'
                ? 'border-primary-500/60 ring-2 ring-primary-500/20 bg-primary-500/5'
                : 'hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">All Recommended</span>
              <GraduationCap className="w-4 h-4 text-primary-500" />
            </div>
            <p className="text-xl font-bold font-display mt-1 text-slate-900 dark:text-slate-100">
              {allTutorRecommendations.length}
            </p>
          </button>

          <button
            onClick={() => setSelectedTier('Perfect Match')}
            className={`p-3.5 rounded-2xl glass transition-all text-left border ${
              selectedTier === 'Perfect Match'
                ? 'border-emerald-500/60 ring-2 ring-emerald-500/20 bg-emerald-500/5'
                : 'hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                90%+ Perfect Fit
              </span>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xl font-bold font-display mt-1 text-emerald-600 dark:text-emerald-400">
              {allTutorRecommendations.filter((t) => t.score >= 90).length}
            </p>
          </button>

          <button
            onClick={() => setSelectedTier('Excellent Match')}
            className={`p-3.5 rounded-2xl glass transition-all text-left border ${
              selectedTier === 'Excellent Match'
                ? 'border-sky-500/60 ring-2 ring-sky-500/20 bg-sky-500/5'
                : 'hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                75–89% Strong Fit
              </span>
              <Zap className="w-4 h-4 text-sky-500" />
            </div>
            <p className="text-xl font-bold font-display mt-1 text-sky-600 dark:text-sky-400">
              {allTutorRecommendations.filter((t) => t.score >= 75 && t.score < 90).length}
            </p>
          </button>

          <div className="p-3.5 rounded-2xl glass border border-slate-200/60 dark:border-slate-800/60 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                Avg. Confidence
              </span>
              <Brain className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-xl font-bold font-display mt-1 text-purple-600 dark:text-purple-400">
              {Math.round(
                allTutorRecommendations.reduce((acc, t) => acc + t.confidence, 0) /
                  Math.max(1, allTutorRecommendations.length)
              )}
              %
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => setSelectedTier('all')}
            className={`p-3.5 rounded-2xl glass transition-all text-left border ${
              selectedTier === 'all'
                ? 'border-primary-500/60 ring-2 ring-primary-500/20 bg-primary-500/5'
                : 'hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">All Peer Matches</span>
              <Users className="w-4 h-4 text-primary-500" />
            </div>
            <p className="text-xl font-bold font-display mt-1 text-slate-900 dark:text-slate-100">
              {allPeerMatches.length}
            </p>
          </button>

          <button
            onClick={() => setSelectedTier('Perfect Match')}
            className={`p-3.5 rounded-2xl glass transition-all text-left border ${
              selectedTier === 'Perfect Match'
                ? 'border-emerald-500/60 ring-2 ring-emerald-500/20 bg-emerald-500/5'
                : 'hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                90–100% Perfect
              </span>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xl font-bold font-display mt-1 text-emerald-600 dark:text-emerald-400">
              {tierCounts.perfect}
            </p>
          </button>

          <button
            onClick={() => setSelectedTier('Excellent Match')}
            className={`p-3.5 rounded-2xl glass transition-all text-left border ${
              selectedTier === 'Excellent Match'
                ? 'border-sky-500/60 ring-2 ring-sky-500/20 bg-sky-500/5'
                : 'hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                75–89% Excellent
              </span>
              <Zap className="w-4 h-4 text-sky-500" />
            </div>
            <p className="text-xl font-bold font-display mt-1 text-sky-600 dark:text-sky-400">
              {tierCounts.excellent}
            </p>
          </button>

          <button
            onClick={() => setSelectedTier('Good Match')}
            className={`p-3.5 rounded-2xl glass transition-all text-left border ${
              selectedTier === 'Good Match'
                ? 'border-amber-500/60 ring-2 ring-amber-500/20 bg-amber-500/5'
                : 'hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                60–74% Good
              </span>
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl font-bold font-display mt-1 text-amber-600 dark:text-amber-400">
              {tierCounts.good}
            </p>
          </button>

          <button
            onClick={() => setOnlyReciprocal(!onlyReciprocal)}
            className={`col-span-2 sm:col-span-1 p-3.5 rounded-2xl glass transition-all text-left border ${
              onlyReciprocal
                ? 'border-accent-500/60 ring-2 ring-accent-500/20 bg-accent-500/5'
                : 'hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-accent-600 dark:text-accent-400 font-semibold">
                2-Way Exchanges
              </span>
              <ArrowLeftRight className="w-4 h-4 text-accent-500" />
            </div>
            <p className="text-xl font-bold font-display mt-1 text-accent-600 dark:text-accent-400">
              {tierCounts.reciprocal}
            </p>
          </button>
        </div>
      )}

      {/* Search and Subject Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                matchingMode === 'tutors'
                  ? 'Search tutors by name, weak subjects, or department...'
                  : 'Search peer students by name, subject, or department...'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl glass border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3.5 py-2 rounded-xl glass border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="all">All Available Subjects</option>
            {allSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* MATCHES VIEW */}
      {matchingMode === 'tutors' ? (
        /* SMART AI TUTOR RECOMMENDATIONS VIEW */
        <div>
          {filteredTutors.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-display font-semibold text-lg">No recommended tutors found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try resetting your filters or updating your weak subjects.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedTier('all');
                  setSelectedSubject('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-primary-500 text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </GlassCard>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTutors.map((rec, i) => {
                const tier = getMatchTier(rec.score);

                return (
                  <motion.div
                    key={rec.tutor.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <GlassCard className="p-6 h-full flex flex-col justify-between hover:border-primary-500/40 transition-all duration-300 group hover:-translate-y-1">
                      <div>
                        {/* Header: Avatar, Name & AI Progress */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={rec.tutor.avatar}
                              alt={rec.tutor.name}
                              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-500/30 group-hover:ring-primary-500 transition-all shadow-md"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-primary-500 transition-colors">
                                  {rec.tutor.name}
                                </h3>
                              </div>
                              <p className="text-xs text-slate-500 font-medium">
                                {rec.tutor.department} · {rec.tutor.title || 'Peer Tutor'}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                                <span className="flex items-center gap-1 text-warning-500 font-bold">
                                  <Star className="w-3 h-3 fill-current" /> {rec.tutor.rating.toFixed(1)}
                                </span>
                                <span>·</span>
                                <span>{rec.tutor.successRate}% Success</span>
                              </div>
                            </div>
                          </div>

                          {/* Radial Progress Ring */}
                          <div className="text-center shrink-0">
                            <ProgressRing
                              value={rec.score}
                              size={62}
                              stroke={5.5}
                              label={`${rec.score}%`}
                            />
                            <span className="text-[10px] text-slate-400 block -mt-1 font-medium">
                              Match
                            </span>
                          </div>
                        </div>

                        {/* AI Match Confidence & Tier Badge */}
                        <div className="flex items-center gap-2 mb-3.5">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full border ${tier.badgeBg} ${tier.badgeBorder} ${tier.badgeText}`}
                          >
                            {tier.tier}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-semibold border border-purple-500/20 flex items-center gap-1">
                            <Brain className="w-3 h-3" /> {rec.confidence}% Confidence
                          </span>
                        </div>

                        {/* Matched Weak Subjects */}
                        <div className="mb-3.5">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Target Subject Coverage:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {rec.matchedWeakSubjects.length > 0 ? (
                              rec.matchedWeakSubjects.map((s) => (
                                <span
                                  key={s}
                                  className="text-[11px] px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" /> {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Core Engineering & Foundations
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Explainable AI Reason Box */}
                        <div className="mb-4 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                          <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                            <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-purple-600 dark:text-purple-400 block font-semibold text-[11px] mb-0.5">
                                Why Recommended:
                              </strong>
                              <span>{rec.whyRecommended}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center gap-2 mt-auto">
                        <button
                          onClick={() => setSelectedTutorRec(rec)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 active:scale-[0.99] text-white text-xs font-semibold shadow-glow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Session</span>
                        </button>

                        <button
                          onClick={() => setSelectedTutorRec(rec)}
                          className="p-2.5 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                          title="View Full AI Analysis"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* AI PEER STUDENT MATCHING VIEW */
        <div>
          {filteredMatches.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-display font-semibold text-lg">No peer matches found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try loosening your search filters or adding more target subjects to your profile.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedTier('all');
                  setSelectedSubject('all');
                  setOnlyReciprocal(false);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-primary-500 text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </GlassCard>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMatches.map((pm, i) => {
                const tier = getMatchTier(pm.score);

                return (
                  <motion.div
                    key={pm.student.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <GlassCard className="p-6 h-full flex flex-col justify-between hover:border-primary-500/40 transition-all duration-300 group hover:-translate-y-1">
                      <div>
                        {/* Header: Peer Avatar, Info & Match Score */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={pm.student.avatar}
                              alt={pm.student.name}
                              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-500/30 group-hover:ring-primary-500 transition-all shadow-md"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-primary-500 transition-colors">
                                  {pm.student.name}
                                </h3>
                              </div>
                              <p className="text-xs text-slate-500 font-medium">
                                {pm.student.department} · Year {pm.student.year}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {pm.student.university || `${pm.student.department} Honors`}
                              </p>
                            </div>
                          </div>

                          {/* Radial Progress Ring */}
                          <div className="text-center shrink-0">
                            <ProgressRing
                              value={pm.score}
                              size={62}
                              stroke={5.5}
                              label={`${pm.score}%`}
                            />
                            <span className="text-[10px] text-slate-400 block -mt-1 font-medium">
                              Match
                            </span>
                          </div>
                        </div>

                        {/* Tier Badge & Reciprocal Tag */}
                        <div className="flex items-center gap-2 mb-3.5">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full border ${tier.badgeBg} ${tier.badgeBorder} ${tier.badgeText}`}
                          >
                            {tier.tier}
                          </span>

                          {pm.reciprocalSubjects.length > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-600 dark:text-accent-400 font-medium border border-accent-500/20 flex items-center gap-1">
                              <ArrowLeftRight className="w-3 h-3" /> Reciprocal Exchange
                            </span>
                          )}
                        </div>

                        {/* Strong Subjects Tags */}
                        <div className="mb-3.5">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Strong Subjects:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {pm.strongSubjects.map((subj) => {
                              const isMatchedHelp = pm.matchedSubjects.includes(subj);
                              return (
                                <span
                                  key={subj}
                                  className={`text-[11px] px-2.5 py-0.5 rounded-lg font-medium transition-all ${
                                    isMatchedHelp
                                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold shadow-2xs'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                  }`}
                                >
                                  {isMatchedHelp && '✓ '}
                                  {subj}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* AI Match Reason Box */}
                        <div className="mb-4 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                          <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                            <Brain className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-primary-600 dark:text-primary-400 block font-semibold text-[11px] mb-0.5">
                                AI Match Reason:
                              </strong>
                              <span>{pm.reason}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center gap-2 mt-auto">
                        <button
                          onClick={() => openBookingModal(pm)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 active:scale-[0.99] text-white text-xs font-semibold shadow-glow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule Session</span>
                        </button>

                        <button
                          onClick={() => setSelectedPeerMatch(pm)}
                          className="p-2.5 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                          title="View Detailed AI Factor Breakdown"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Peer Booking Modal */}
      <AnimatePresence>
        {bookingPeerMatch && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBookingPeerMatch(null)}
          >
            <motion.div
              initial={{ y: 30, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.95, opacity: 0 }}
              className="glass-strong rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-slate-200/80 dark:border-slate-800/80 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                      Schedule Study Session
                    </h3>
                    <p className="text-xs text-slate-500">with {bookingPeerMatch.student.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setBookingPeerMatch(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Focus Subject
                  </label>
                  <select
                    value={bookingSubject}
                    onChange={(e) => setBookingSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  >
                    {bookingPeerMatch.matchedSubjects.map((s) => (
                      <option key={s} value={s}>
                        {s} (Your Weak Subject)
                      </option>
                    ))}
                    {bookingPeerMatch.strongSubjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Session Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingMode('online')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        bookingMode === 'online'
                          ? 'bg-primary-500 text-white shadow-glow'
                          : 'glass text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" /> Online Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingMode('in-person')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        bookingMode === 'in-person'
                          ? 'bg-primary-500 text-white shadow-glow'
                          : 'glass text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" /> Campus Meet
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Session Goal / Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Review Dijkstra's algorithm practice questions"
                    value={bookingTopic}
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingPeerMatch(null)}
                    className="px-4 py-2 rounded-xl glass text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBooking}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold shadow-glow hover:opacity-95 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isBooking ? 'Scheduling...' : 'Confirm & Book Session'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Peer AI Analysis Modal */}
      <AnimatePresence>
        {selectedPeerMatch && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPeerMatch(null)}
          >
            <motion.div
              initial={{ y: 30, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.95, opacity: 0 }}
              className="glass-strong rounded-3xl p-6 sm:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-slate-200/80 dark:border-slate-800/80 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                      AI Peer Match Analysis
                    </h3>
                    <p className="text-xs text-slate-500">
                      Multi-factor scoring against your profile
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPeerMatch(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Peer profile header in modal */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
                <img
                  src={selectedPeerMatch.student.avatar}
                  alt={selectedPeerMatch.student.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-500/30"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {selectedPeerMatch.student.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {selectedPeerMatch.student.department} · Year {selectedPeerMatch.student.year}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedPeerMatch.tier} ({selectedPeerMatch.score}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Factor Breakdown */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  5-Factor AI Evaluation Breakdown
                </h4>
                {selectedPeerMatch.breakdown.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.label} (Weight: {Math.round(item.weight * 100)}%)
                      </span>
                      <span className="font-bold text-primary-600 dark:text-primary-400">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-1.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">{item.description}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const pm = selectedPeerMatch;
                  setSelectedPeerMatch(null);
                  openBookingModal(pm);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-xs shadow-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Schedule Session with {selectedPeerMatch.student.name}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutor Detail & Booking Modal */}
      <AITutorDetailModal
        recommendation={selectedTutorRec}
        isOpen={!!selectedTutorRec}
        onClose={() => setSelectedTutorRec(null)}
      />
    </div>
  );
}
