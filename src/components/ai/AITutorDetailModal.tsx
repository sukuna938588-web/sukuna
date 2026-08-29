import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
  Video,
  MapPin,
  Building,
  Award,
  Brain,
  ArrowRight,
} from 'lucide-react';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import type { AITutorRecommendation } from '@/types';

interface AITutorDetailModalProps {
  recommendation: AITutorRecommendation | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AITutorDetailModal({
  recommendation,
  isOpen,
  onClose,
}: AITutorDetailModalProps) {
  const { currentUser, addSession, logActivity } = useData();
  const { notify } = useToast();

  const [bookingSubject, setBookingSubject] = useState('');
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('16:00');
  const [bookingMode, setBookingMode] = useState<'online' | 'in-person'>('online');
  const [bookingTopic, setBookingTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !recommendation) return null;

  const { tutor, score, confidence, tier, whyRecommended, keyStrengths, breakdown, matchedWeakSubjects } =
    recommendation;

  const defaultSubject =
    bookingSubject ||
    matchedWeakSubjects[0] ||
    tutor.subjects[0] ||
    'General Study';

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const endH = parseInt(bookingTime.slice(0, 2)) + 1;
    const endTime = `${String(endH).padStart(2, '0')}:30`;

    const newSession = {
      id: `ses-tutor-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      tutorId: tutor.id,
      tutorName: tutor.name,
      subject: defaultSubject,
      topic: bookingTopic || `AI Recommendation Review: ${defaultSubject}`,
      date: bookingDate,
      startTime: bookingTime,
      endTime,
      mode: bookingMode,
      status: 'scheduled' as const,
    };

    setTimeout(() => {
      addSession(newSession);
      logActivity({
        type: 'session_booked',
        title: 'Tutor Session Booked',
        description: `${currentUser.name} scheduled 1-on-1 AI recommended session with ${tutor.name} for ${defaultSubject}`,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        target: tutor.name,
      });

      notify({
        title: 'Session Successfully Booked!',
        message: `Your session with ${tutor.name} on ${bookingDate} at ${bookingTime} is confirmed.`,
        type: 'success',
      });

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl glass backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 shadow-2xl overflow-hidden z-10"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-start justify-between gap-4 bg-gradient-to-r from-primary-500/15 via-accent-500/15 to-transparent">
          <div className="flex items-center gap-4">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-500/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-slate-100">
                  {tutor.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {tier}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                <Building className="w-3.5 h-3.5 text-primary-500" /> {tutor.department} · {tutor.title}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {/* AI Match Overview & Confidence Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-slate-50 dark:to-slate-800/50 border border-primary-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/15 text-primary-600 dark:text-primary-400 text-xs font-bold border border-primary-500/20">
                <Brain className="w-3.5 h-3.5" /> AI Recommendation Reasoning
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {whyRecommended}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <ProgressRing
                  value={score}
                  size={85}
                  stroke={7}
                  label={`${score}%`}
                  sublabel="Match Score"
                />
              </div>
              <div className="text-center">
                <ProgressRing
                  value={confidence}
                  size={85}
                  stroke={7}
                  label={`${confidence}%`}
                  sublabel="AI Confidence"
                />
              </div>
            </div>
          </div>

          {/* Key Match Strengths */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-500" />
              Key AI Synergies & Alignment
            </h3>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {keyStrengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Factor Score Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary-500" />
              Evaluation Factor Breakdown
            </h3>
            <div className="space-y-3">
              {breakdown.map((item, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-white/50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/50"
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
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Booking Form */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              Book Recommended Session with {tutor.name}
            </h3>

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Focus Subject
                  </label>
                  <select
                    value={defaultSubject}
                    onChange={(e) => setBookingSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass border border-slate-200/80 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {matchedWeakSubjects.map((s) => (
                      <option key={s} value={s}>
                        {s} (Your Weak Subject)
                      </option>
                    ))}
                    {tutor.subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass border border-slate-200/80 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
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
                    className="w-full px-3 py-2 rounded-xl glass border border-slate-200/80 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Session Mode
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingMode('online')}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        bookingMode === 'online'
                          ? 'bg-primary-500 text-white shadow-glow'
                          : 'glass text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" /> Online Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingMode('in-person')}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        bookingMode === 'in-person'
                          ? 'bg-primary-500 text-white shadow-glow'
                          : 'glass text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" /> Campus Meet
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Specific Learning Topic / Goals (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master CPU Scheduling algorithms & Memory Paging"
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass border border-slate-200/80 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl glass text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold shadow-glow hover:opacity-95 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Confirming...'
                  ) : (
                    <>
                      Confirm Booking <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
