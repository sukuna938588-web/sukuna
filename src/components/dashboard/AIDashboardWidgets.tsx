import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  HeartPulse,
  Zap,
  Activity,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Calendar,
  ChevronRight,
  Target,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Counter } from '../ui/Counter';
import { ProgressRing } from '../ui/ProgressRing';
import { useData } from '../../context/DataContext';
import { tutors } from '../../data/mockData';
import {
  calculateAIDashboardScores,
  calculateAILearningInsights,
  calculateSmartAITutorRecommendations,
  generateAIStudyPlan,
} from '../../lib/aiEngine';
import { AIStudyPlannerModal } from '../ai/AIStudyPlannerModal';
import { AITutorDetailModal } from '../ai/AITutorDetailModal';
import type { AITutorRecommendation } from '../../types';

export function AIDashboardWidgets() {
  const { currentUser, sessions } = useData();

  const [isStudyPlannerOpen, setIsStudyPlannerOpen] = useState(false);
  const [selectedTutorRec, setSelectedTutorRec] = useState<AITutorRecommendation | null>(null);

  // Compute live AI metrics strictly for logged-in user
  const aiScores = useMemo(
    () => calculateAIDashboardScores(currentUser, sessions),
    [currentUser, sessions]
  );

  const aiInsights = useMemo(
    () => calculateAILearningInsights(currentUser, sessions),
    [currentUser, sessions]
  );

  const tutorRecs = useMemo(
    () => calculateSmartAITutorRecommendations(currentUser, tutors),
    [currentUser]
  );

  const weeklyPlan = useMemo(
    () => generateAIStudyPlan(currentUser, sessions, 'balanced'),
    [currentUser, sessions]
  );


  const top3Tutors = tutorRecs.slice(0, 3);
  const topWeakSubject = aiInsights.weakestSubjects[0];

  return (
    <div className="space-y-6">
      {/* 1. TRI-SCORE AI INTELLIGENCE HEADER BAR */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 p-0.5 shadow-glow flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-primary-400">
                <Brain className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                AI Cognitive Intelligence Scores
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-600 dark:text-primary-400 font-bold border border-primary-500/30">
                  Live Engine
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsStudyPlannerOpen(true)}
            className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 group"
          >
            Open AI Study Planner
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Widget 1: Learning Health Score */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <GlassCard className="p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-90" />
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Learning Health
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="font-display font-extrabold text-3xl text-slate-900 dark:text-slate-50">
                      <Counter value={aiScores.healthScore} duration={1.2} />
                    </span>
                    <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +{aiScores.healthScoreDelta}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">
                    Rating: <span className="font-bold text-emerald-500">{aiScores.healthRating}</span>
                  </p>
                </div>

                <ProgressRing
                  value={aiScores.healthScore}
                  size={76}
                  stroke={7}
                  label={`${aiScores.healthScore}%`}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                Composite of subject mastery balance, review cadence & session coverage.
              </p>
            </GlassCard>
          </motion.div>

          {/* Widget 2: Productivity Score */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-5 relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-90" />
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Productivity Score
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="font-display font-extrabold text-3xl text-slate-900 dark:text-slate-50">
                      <Counter value={aiScores.productivityScore} duration={1.2} />
                    </span>
                    <span className="text-xs font-semibold text-cyan-500 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +{aiScores.productivityScoreDelta}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">
                    Velocity: <span className="font-bold text-cyan-500">+{aiInsights.learningTrend.weeklyVelocity}%/wk</span>
                  </p>
                </div>

                <ProgressRing
                  value={aiScores.productivityScore}
                  size={76}
                  stroke={7}
                  label={`${aiScores.productivityScore}%`}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                Calculated from weekly study goals, practice sessions & problem throughput.
              </p>
            </GlassCard>
          </motion.div>

          {/* Widget 3: Study Consistency Score */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <GlassCard className="p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-90" />
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Study Consistency
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="font-display font-extrabold text-3xl text-slate-900 dark:text-slate-50">
                      <Counter value={aiScores.consistencyScore} duration={1.2} />
                    </span>
                    <span className="text-xs font-semibold text-purple-500 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> Consistent
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">
                    Cadence: <span className="font-bold text-purple-500">Daily Pacing</span>
                  </p>
                </div>

                <ProgressRing
                  value={aiScores.consistencyScore}
                  size={76}
                  stroke={7}
                  label={`${aiScores.consistencyScore}%`}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                Measures adherence to daily study rhythms & spaced recall retention.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* 2. DYNAMIC AI LEARNING INSIGHTS & WEEKLY STUDY PLANNER SECTION */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Learning Insights & Weekly Plan Strip */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Learning Insights Snapshot Card */}
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center shadow-xs">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
                    AI Diagnostic & Improvement Insights
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time weakness detection and study pace recommendations
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/20 self-start sm:self-auto">
                {aiInsights.learningTrend.badgeText}
              </span>
            </div>

            {/* Content: Weak Subject + Hours Allocation */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Weakest Subject Highlight */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> High Priority Weak Subject
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {topWeakSubject?.rating || 50}% Mastery
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {topWeakSubject?.subject || 'Operating Systems'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {topWeakSubject?.suggestedAction ||
                    'Book 1-on-1 diagnostic session & solve foundational practice sets.'}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200/40 dark:border-slate-700/40">
                  <span className="text-slate-500">Target Benchmark</span>
                  <span className="font-semibold text-emerald-500">85% Mastery Goal</span>
                </div>
              </div>

              {/* Recommended Weekly Hours */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Recommended Study Load
                  </span>
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                    {aiInsights.weeklyStudyHours.total} hrs / week
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  ~{aiInsights.weeklyStudyHours.dailyRecommendation} hrs / day target
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {aiInsights.learningTrend.description}
                </p>

                {/* Mini color bar of hours distribution */}
                <div className="pt-2 space-y-1">
                  <div className="h-2 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
                    {aiInsights.weeklyStudyHours.breakdown.map((b, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: `${(b.hours / aiInsights.weeklyStudyHours.total) * 100}%`,
                          backgroundColor: b.color,
                        }}
                        title={`${b.subject}: ${b.hours} hrs`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>
                      Focus:{' '}
                      {aiInsights.weeklyStudyHours.breakdown
                        .slice(0, 2)
                        .map((b) => b.subject)
                        .join(', ')}
                    </span>
                    <span>Distributed Pacing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-4 pt-3 flex items-center justify-between text-xs">
              <Link
                to="/analytics"
                className="text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-1 group"
              >
                View Full Performance Predictions & Risk Analysis
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </GlassCard>

          {/* AI Weekly Study Schedule Preview Strip */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  Your AI Weekly Study Plan (Monday – Sunday)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dynamic daily milestones tuned to your weak subjects and available slots
                </p>
              </div>

              <button
                onClick={() => setIsStudyPlannerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold shadow-glow transition-all flex items-center gap-1 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" /> Full Planner
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {weeklyPlan.map((block) => (
                <div
                  key={block.id}
                  onClick={() => setIsStudyPlannerOpen(true)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${
                    block.isBooked
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="font-mono">{block.day}</span>
                    <span className="text-[9px] text-primary-500 font-medium">{block.durationMinutes}m</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {block.subject}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{block.timeSlot}</p>
                  <div className="mt-2 flex items-center justify-between text-[9px]">
                    <span className="text-slate-500">{block.durationMinutes}m</span>
                    {block.isBooked && (
                      <span className="text-emerald-500 font-bold">Booked</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right 1 Col: Top Smart AI Tutor Recommendations */}
        <div className="space-y-6">
          <GlassCard className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Smart Tutor Recommendations
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ranked by AI synergy with your profile
                  </p>
                </div>
                <Link
                  to="/matching"
                  className="text-xs text-primary-500 hover:underline font-semibold"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {top3Tutors.map((rec) => (
                  <div
                    key={rec.tutor.id}
                    onClick={() => setSelectedTutorRec(rec)}
                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer group hover:border-primary-500/40"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={rec.tutor.avatar}
                        alt={rec.tutor.name}
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary-500/30 group-hover:ring-primary-500 transition-all"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-primary-500 transition-colors">
                            {rec.tutor.name}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {rec.confidence}% Match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {rec.tutor.department} · {rec.tutor.rating.toFixed(1)}★ ({rec.tutor.reviewCount} reviews)
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed bg-white/50 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
                      💡 {rec.whyRecommended}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold truncate max-w-[170px]">
                        Focus: {rec.matchedWeakSubjects.join(', ') || rec.tutor.subjects[0]}
                      </span>
                      <span className="text-slate-500 group-hover:text-primary-500 flex items-center gap-0.5 font-medium transition-colors">
                        Inspect <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/matching"
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors hover:opacity-90 active:scale-95"
              >
                Browse All AI Recommended Tutors <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Modals */}
      <AIStudyPlannerModal
        isOpen={isStudyPlannerOpen}
        onClose={() => setIsStudyPlannerOpen(false)}
      />

      <AITutorDetailModal
        recommendation={selectedTutorRec}
        isOpen={!!selectedTutorRec}
        onClose={() => setSelectedTutorRec(null)}
      />
    </div>
  );
}
