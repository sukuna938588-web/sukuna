import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Sparkles,
  Clock,
  Zap,
  Target,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { generateAIStudyPlan, calculateAILearningInsights } from '@/lib/aiEngine';
import type { AIStudyPlanBlock } from '@/types';

interface AIStudyPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIStudyPlannerModal({ isOpen, onClose }: AIStudyPlannerModalProps) {
  const { currentUser, sessions, addSession, logActivity } = useData();
  const { notify } = useToast();
  const [intensity, setIntensity] = useState<'balanced' | 'accelerated' | 'light'>('balanced');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());

  const insights = useMemo(
    () => calculateAILearningInsights(currentUser, sessions),
    [currentUser, sessions]
  );

  const plan = useMemo(
    () => generateAIStudyPlan(currentUser, sessions, intensity),
    [currentUser, sessions, intensity]
  );

  const totalXP = useMemo(() => plan.reduce((acc, b) => acc + b.xpReward, 0), [plan]);
  const totalMinutes = useMemo(
    () => plan.reduce((acc, b) => acc + b.durationMinutes, 0),
    [plan]
  );
  const totalHoursFormatted = (totalMinutes / 60).toFixed(1);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      notify({
        title: 'Study Plan Regenerated',
        message: `Tailored for ${currentUser.name}'s weak subjects with ${intensity} pacing.`,
        type: 'info',
      });
    }, 400);
  };

  const handleBookPlanBlock = (block: AIStudyPlanBlock) => {
    if (bookedIds.has(block.id) || block.isBooked) return;

    const newSession = {
      id: `ai-ses-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      tutorId: 't1', // default peer mentor
      tutorName: 'AI Peer Study Group',
      subject: block.subject,
      topic: block.topic,
      date: block.dateStr,
      startTime: block.timeSlot.split(' - ')[0],
      endTime: block.timeSlot.split(' - ')[1] || '17:30',
      mode: 'online' as const,
      status: 'scheduled' as const,
    };

    addSession(newSession);
    setBookedIds((prev) => new Set([...prev, block.id]));

    logActivity({
      type: 'session_booked',
      title: 'AI Study Block Scheduled',
      description: `${currentUser.name} scheduled AI study block for ${block.subject} (${block.dayFull})`,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      target: block.subject,
    });

    notify({
      title: 'Study Session Added to Calendar!',
      message: `${block.subject} on ${block.dayFull} (${block.timeSlot}) is now booked.`,
      type: 'success',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl glass backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 shadow-2xl overflow-hidden z-10"
      >
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-start justify-between gap-4 bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-transparent">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-500 p-0.5 shadow-glow flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-primary-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-slate-100">
                  AI Personalized Study Planner
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                  Adaptive
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Dynamic 7-day schedule generated from your weak subjects, syllabus, and study pacing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl glass hover:bg-slate-200/60 dark:hover:bg-slate-800/60 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intensity Controls & Quick Overview Bar */}
        <div className="px-6 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-4">
          {/* Intensity Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl glass border border-slate-200/60 dark:border-slate-700/60">
            {(
              [
                { id: 'balanced', label: 'Balanced (60m/day)' },
                { id: 'accelerated', label: 'Accelerated (90m/day)' },
                { id: 'light', label: 'Light Review (45m/day)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setIntensity(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  intensity === opt.id
                    ? 'bg-primary-500 text-white shadow-glow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Plan Metrics */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4 text-primary-500" />
              <span>{totalHoursFormatted} hrs this week</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-amber-500">
              <Zap className="w-4 h-4" />
              <span>+{totalXP} Potential XP</span>
            </div>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="px-3 py-1 rounded-xl glass hover:bg-slate-200/50 text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          </div>
        </div>

        {/* Schedule List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {/* AI Focus Strategy Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500/10 via-cyan-500/10 to-transparent border border-primary-500/20 flex items-start gap-3">
            <Target className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-slate-100">
                AI Optimization Focus:{' '}
              </span>
              Concentrating on your priority weak areas (
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                {insights.weakestSubjects.slice(0, 2).map((w) => w.subject).join(', ')}
              </span>
              ) while applying active recall intervals to maximize retention.
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {plan.map((block, i) => {
              const isScheduled = block.isBooked || bookedIds.has(block.id);

              return (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isScheduled
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : 'bg-white/60 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-700/60 hover:border-primary-500/40 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Card Top: Day & Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center font-bold text-xs font-mono text-slate-900 dark:text-slate-100">
                          {block.day}
                        </span>
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {block.dayFull}
                          </p>
                          <p className="text-[10px] text-slate-400">{block.timeSlot}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                        {block.focusType}
                      </span>
                    </div>

                    {/* Subject & Topic */}
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1 mb-1">
                      {block.subject}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {block.topic}
                    </p>

                    {/* Technique */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mb-3">
                      <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                      <span>{block.technique}</span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-warning-500 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> +{block.xpReward} XP
                    </span>

                    {isScheduled ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Booked in Calendar
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBookPlanBlock(block)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-all shadow-xs flex items-center gap-1 active:scale-95"
                      >
                        Add to Calendar <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Schedule automatically syncs with your weekly availability and study streak.</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs transition-colors hover:opacity-90"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
