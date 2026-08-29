import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Flame,
  Target,
  Award,
  Calendar,
  Brain,
  Sparkles,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Counter } from '@/components/ui/Counter';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import { weeklyPerformance } from '@/data/mockData';
import {
  calculateAILearningInsights,
  calculateAIPerformancePrediction,
  calculateAIDashboardScores,
} from '@/lib/aiEngine';
import { AIStudyPlannerModal } from '@/components/ai/AIStudyPlannerModal';

export function AnalyticsPage() {
  const { theme } = useTheme();
  const { currentUser, sessions } = useData();
  const [isStudyPlannerOpen, setIsStudyPlannerOpen] = useState(false);

  const axisColor = theme === 'dark' ? '#64748b' : '#94a3b8';
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
    border: '1px solid rgba(148,163,184,0.3)',
    borderRadius: '16px',
    fontSize: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
  };

  // Derive dynamic AI analytics models strictly from current user state
  const aiScores = useMemo(
    () => calculateAIDashboardScores(currentUser, sessions),
    [currentUser, sessions]
  );

  const aiInsights = useMemo(
    () => calculateAILearningInsights(currentUser, sessions),
    [currentUser, sessions]
  );

  const aiPredictions = useMemo(
    () => calculateAIPerformancePrediction(currentUser, sessions),
    [currentUser, sessions]
  );

  // Radar data
  const radarData = useMemo(() => {
    return currentUser.skills.map((s) => ({
      subject: s.subject.split(' ')[0],
      value: s.rating,
    }));
  }, [currentUser.skills]);

  const avgMastery = Math.round(
    currentUser.skills.reduce((a, s) => a + s.rating, 0) / Math.max(1, currentUser.skills.length)
  );

  const bestSubject =
    [...currentUser.skills].sort((a, b) => b.rating - a.rating)[0] || {
      subject: 'None',
      rating: 0,
    };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-2">
            <Brain className="w-3.5 h-3.5" />
            AI Predictive Learning Analytics
          </div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-slate-900 dark:text-slate-100">
            Cognitive Insights & Forecasting
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time performance predictions, weak area diagnostics, and personalized improvement planning.
          </p>
        </div>

        <button
          onClick={() => setIsStudyPlannerOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold shadow-glow hover:shadow-glow-cyan transition-all active:scale-95 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          Open AI Study Planner
        </button>
      </div>

      {/* 1. TOP AI METRIC TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: HeartPulse,
            label: 'Learning Health',
            value: `${aiScores.healthScore}%`,
            sub: aiScores.healthRating,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
          {
            icon: Zap,
            label: 'Productivity Score',
            value: `${aiScores.productivityScore}%`,
            sub: `+${aiInsights.learningTrend.weeklyVelocity}%/wk velocity`,
            color: 'text-cyan-500',
            bg: 'bg-cyan-500/10',
          },
          {
            icon: Activity,
            label: 'Consistency Score',
            value: `${aiScores.consistencyScore}%`,
            sub: `${currentUser.streak}-day active streak`,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
          },
          {
            icon: TrendingUp,
            label: 'Predicted Growth',
            value: `+${aiPredictions.overallImprovementEstimate}%`,
            sub: 'Over next 8 weeks',
            color: 'text-primary-500',
            bg: 'bg-primary-500/10',
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard hover className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Live AI
                </span>
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 truncate">
                {s.value}
              </p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                {s.label}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 truncate">{s.sub}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* 2. AI PERFORMANCE PREDICTION & LEARNING GROWTH CHART */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100">
                  AI Performance Prediction: 8-Week Expected Learning Growth
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                  Forecast Model
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Forecasting trajectory using current study velocity, peer tutoring, and spaced review.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary-500" />
                <span>With AI StudySync (+{aiPredictions.overallImprovementEstimate}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-400" />
                <span>Baseline Linear</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={aiPredictions.growthTimeline}>
              <defs>
                <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3366ff" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#3366ff" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="week" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} domain={[40, 100]} unit="%" />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: any) => [`${value}% Mastery`, '']}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                name="AI Optimized Trajectory"
                stroke="#3366ff"
                strokeWidth={3}
                fill="url(#predictedGrad)"
              />
              <Area
                type="monotone"
                dataKey="baseline"
                name="Standard Unassisted"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#baselineGrad)"
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target Benchmark"
                stroke="#10b981"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Projections indicate you will reach the 85% mastery threshold within{' '}
              <strong className="text-slate-900 dark:text-slate-100">Week 5</strong>.
            </span>
            <span className="text-slate-400">Confidence Interval: 94.2%</span>
          </div>
        </GlassCard>
      </motion.div>

      {/* 3. SUBJECT-BY-SUBJECT IMPROVEMENT PREDICTION & RISK MATRIX */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject-by-Subject Forecast Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary-500" />
                  Subject Improvement Forecasts
                </h3>
                <span className="text-xs text-slate-400">4-Week & 8-Week Targets</span>
              </div>

              <div className="space-y-3">
                {aiPredictions.subjectForecasts.map((sub, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {sub.subject}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        +{sub.expectedImprovementPct}% projected
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span>
                        Current: <strong className="text-slate-700 dark:text-slate-300">{sub.currentMastery}%</strong>
                      </span>
                      <span>→</span>
                      <span>
                        In 4w: <strong className="text-primary-500">{sub.projectedMasteryIn4Weeks}%</strong>
                      </span>
                      <span>→</span>
                      <span>
                        In 8w: <strong className="text-emerald-500">{sub.projectedMasteryIn8Weeks}%</strong>
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                      <div
                        className="h-full bg-slate-400 dark:bg-slate-500"
                        style={{ width: `${sub.currentMastery}%` }}
                        title={`Current: ${sub.currentMastery}%`}
                      />
                      <div
                        className="h-full bg-primary-500"
                        style={{ width: `${sub.projectedMasteryIn8Weeks - sub.currentMastery}%` }}
                        title={`Growth: +${sub.expectedImprovementPct}%`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              *Calculated with Bayesian inference based on your test completions and tutor reviews.
            </p>
          </GlassCard>
        </motion.div>

        {/* Dynamic Risk Areas Matrix */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  AI Detected Risk Areas & Mitigations
                </h3>
                <span className="text-xs text-rose-500 font-semibold">
                  {aiPredictions.riskAreas.length} Active Risks
                </span>
              </div>

              <div className="space-y-3">
                {aiPredictions.riskAreas.map((risk, idx) => {
                  const isHigh = risk.severity === 'high';
                  const isMed = risk.severity === 'medium';

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border ${
                        isHigh
                          ? 'bg-rose-500/5 border-rose-500/30'
                          : isMed
                          ? 'bg-amber-500/5 border-amber-500/30'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {risk.subject}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isHigh
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : isMed
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {risk.severity} Risk
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                        <strong className="text-slate-700 dark:text-slate-200">Root Cause:</strong>{' '}
                        {risk.cause}
                      </p>

                      <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-700/40 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-emerald-600 dark:text-emerald-400">
                            AI Action:
                          </strong>{' '}
                          {risk.mitigation}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Mitigations scheduled automatically</span>
              <button
                onClick={() => setIsStudyPlannerOpen(true)}
                className="text-primary-500 hover:underline font-semibold flex items-center gap-1"
              >
                Apply In Study Plan <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* 4. AI LEARNING INSIGHTS & PERSONALIZED IMPROVEMENT PLAN */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* 4-Phase Step-by-Step Improvement Plan */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <GlassCard className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                    AI 4-Phase Subject Mastery Roadmap
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sequenced pedagogical steps for overcoming priority weak subjects
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                Phase-Gated
              </span>
            </div>

            <div className="space-y-4">
              {aiInsights.improvementPlan.map((step) => (
                <div
                  key={step.phase}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-4 hover:border-primary-500/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {step.phase}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {step.title}
                      </h4>
                      <span className="text-[11px] font-semibold text-primary-600 dark:text-primary-400">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                      {step.action}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Expected Outcome: {step.expectedOutcome}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recommended Weekly Hours Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-500" />
                  Recommended Study Hours
                </h3>
                <span className="text-xs font-bold text-primary-500">
                  {aiInsights.weeklyStudyHours.total} hrs / wk
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-transparent border border-primary-500/20 mb-4">
                <p className="text-xs text-slate-500">Target Daily Pace</p>
                <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-slate-100 mt-0.5">
                  ~{aiInsights.weeklyStudyHours.dailyRecommendation} hrs / day
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Optimal interval for retaining complex concepts without cognitive fatigue.
                </p>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Per-Subject Allocation
              </h4>
              <div className="space-y-2.5">
                {aiInsights.weeklyStudyHours.breakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {item.subject}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {item.hours} hrs
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.hours / aiInsights.weeklyStudyHours.total) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsStudyPlannerOpen(true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-xs shadow-glow transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                Generate Weekly Planner <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* 5. SUBJECT MASTERY RADAR & WEEKLY LOGS */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold text-lg mb-4">Subject Mastery Radar</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="subject" stroke={axisColor} fontSize={11} />
                <PolarRadiusAxis stroke={axisColor} fontSize={10} angle={90} domain={[0, 100]} />
                <Radar
                  dataKey="value"
                  stroke="#3366ff"
                  fill="#3366ff"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" /> Weekly Activity & Scores
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} fill="#3366ff" name="Test Score" />
                <Bar dataKey="sessions" radius={[8, 8, 0, 0]} fill="#06b6d4" name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>

      {/* AI Study Planner Modal */}
      <AIStudyPlannerModal
        isOpen={isStudyPlannerOpen}
        onClose={() => setIsStudyPlannerOpen(false)}
      />
    </div>
  );
}
