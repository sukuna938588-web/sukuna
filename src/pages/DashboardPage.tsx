import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Target,
  Plus,
  Layers,
  Users,
  User,
  GraduationCap,
  CheckCircle2,
  Brain,
  Sparkles,
  Zap,
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Counter } from '../components/ui/Counter';
import { ProgressRing } from '../components/ui/ProgressRing';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { AIDashboardWidgets } from '../components/dashboard/AIDashboardWidgets';
import { useData } from '../context/DataContext';
import { tutors, weeklyPerformance } from '../data/mockData';
import { findPeerMatches } from '../lib/matching';

export function DashboardPage() {
  const { students, subjects, sessions, notifications, currentUser, completeSession } = useData();

  // Dynamic calculations derived automatically from stored data
  const totalStudents = students.length;
  const availableTutors = tutors.length;
  const totalSubjects = subjects.length;
  const sessionsScheduled = sessions.filter((s) => s.status === 'scheduled').length;
  const sessionsCompleted = sessions.filter((s) => s.status === 'completed').length;

  // Calculate Match Accuracy dynamically from peer matches algorithm
  const peerMatches = useMemo(() => findPeerMatches(currentUser, students), [currentUser, students]);
  const matchAccuracy = useMemo(() => {
    if (peerMatches.length === 0) return 92;
    const topMatches = peerMatches.slice(0, 5);
    const avg = topMatches.reduce((acc, m) => acc + m.score, 0) / topMatches.length;
    return Math.round(avg);
  }, [peerMatches]);

  const upcomingSessions = sessions.filter(
    (s) => s.status === 'scheduled' && (s.studentId === currentUser.id || s.tutorId === currentUser.id)
  );
  const avgWeeklyScore = Math.round(
    weeklyPerformance.reduce((a, w) => a + w.score, 0) / weeklyPerformance.length
  );
  const userSkills = useMemo(() => currentUser?.skills || [], [currentUser?.skills]);
  const avgSkillProficiency = useMemo(() => {
    if (userSkills.length === 0) return 75;
    return Math.round(userSkills.reduce((acc, s) => acc + s.rating, 0) / userSkills.length);
  }, [userSkills]);

  // 6 Premium Metric Cards Configuration
  const metricCards = [
    {
      id: 'stat-students',
      label: 'Total Students',
      value: totalStudents,
      prefix: '',
      suffix: '',
      subtext: 'Registered learners',
      icon: Users,
      color: 'text-blue-500 dark:text-blue-400',
      bgGlow: 'bg-blue-500/10',
      gradient: 'from-blue-500 to-indigo-500',
      borderHover: 'hover:border-blue-500/40',
      link: '/students',
    },
    {
      id: 'stat-tutors',
      label: 'Available Tutors',
      value: availableTutors,
      prefix: '',
      suffix: '',
      subtext: 'Active peer mentors',
      icon: GraduationCap,
      color: 'text-cyan-500 dark:text-cyan-400',
      bgGlow: 'bg-cyan-500/10',
      gradient: 'from-cyan-500 to-teal-500',
      borderHover: 'hover:border-cyan-500/40',
      link: '/tutors',
    },
    {
      id: 'stat-subjects',
      label: 'Total Subjects',
      value: totalSubjects,
      prefix: '',
      suffix: '',
      subtext: 'Active courses in catalog',
      icon: BookOpen,
      color: 'text-emerald-500 dark:text-emerald-400',
      bgGlow: 'bg-emerald-500/10',
      gradient: 'from-emerald-500 to-teal-500',
      borderHover: 'hover:border-emerald-500/40',
      link: '/subjects',
    },
    {
      id: 'stat-scheduled',
      label: 'Sessions Scheduled',
      value: sessionsScheduled,
      prefix: '',
      suffix: '',
      subtext: 'In upcoming queue',
      icon: Calendar,
      color: 'text-amber-500 dark:text-amber-400',
      bgGlow: 'bg-amber-500/10',
      gradient: 'from-amber-500 to-orange-500',
      borderHover: 'hover:border-amber-500/40',
      link: '/scheduler',
    },
    {
      id: 'stat-completed',
      label: 'Sessions Completed',
      value: sessionsCompleted,
      prefix: '',
      suffix: '',
      subtext: 'Delivered successfully',
      icon: CheckCircle2,
      color: 'text-purple-500 dark:text-purple-400',
      bgGlow: 'bg-purple-500/10',
      gradient: 'from-purple-500 to-pink-500',
      borderHover: 'hover:border-purple-500/40',
      link: '/analytics',
    },
    {
      id: 'stat-accuracy',
      label: 'Match Accuracy',
      value: matchAccuracy,
      prefix: '',
      suffix: '%',
      subtext: 'AI synergy confidence',
      icon: Brain,
      color: 'text-rose-500 dark:text-rose-400',
      bgGlow: 'bg-rose-500/10',
      gradient: 'from-rose-500 to-orange-400',
      borderHover: 'hover:border-rose-500/40',
      link: '/matching',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Student Hero Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-primary-500/15 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <Link to="/profile" className="flex items-center gap-4 group">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 object-cover ring-2 ring-primary-500/30 group-hover:ring-primary-500 transition-all shadow-md"
              />
              <div>
                <p className="text-sm text-slate-500">Welcome back,</p>
                <h1 className="font-display font-bold text-2xl lg:text-3xl text-slate-900 dark:text-slate-100 group-hover:text-primary-500 transition-colors flex items-center gap-2">
                  {currentUser.name}
                  <User className="w-4 h-4 opacity-0 group-hover:opacity-100 text-primary-500 transition-opacity" />
                </h1>
                <p className="text-sm text-slate-500">
                  {currentUser.department} · Year {currentUser.year}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <ProgressRing
                  value={avgSkillProficiency}
                  size={90}
                  stroke={8}
                  label={`${avgSkillProficiency}%`}
                  sublabel="Skill Mastery"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-display font-bold text-xl">{userSkills.length} Tracked Subjects</span>
                </div>
                <p className="text-2xl font-bold font-display text-gradient">
                  {sessionsCompleted} {sessionsCompleted === 1 ? 'Session' : 'Sessions'} Completed
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-primary-500" /> {sessionsScheduled} scheduled upcoming
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Navigation Actions */}
      <div className="flex flex-wrap gap-2.5">
        <Link
          to="/profile"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs sm:text-sm font-semibold shadow-glow hover:shadow-glow-cyan transition-all flex items-center gap-2 active:scale-95"
        >
          <User className="w-4 h-4" /> Edit Profile
        </Link>
        <Link
          to="/matching"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm font-semibold shadow-glow hover:opacity-95 transition-all flex items-center gap-2 active:scale-95"
        >
          <Sparkles className="w-4 h-4" /> Smart Matching
        </Link>
        <Link
          to="/students"
          className="px-4 py-2 rounded-xl glass text-xs sm:text-sm font-medium hover:shadow-glass hover:text-primary-500 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Student
        </Link>
        <Link
          to="/subjects"
          className="px-4 py-2 rounded-xl glass text-xs sm:text-sm font-medium hover:shadow-glass hover:text-primary-500 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </Link>
        <Link
          to="/students"
          className="px-4 py-2 rounded-xl glass text-xs sm:text-sm font-medium hover:shadow-glass hover:text-primary-500 transition-all flex items-center gap-2"
        >
          <Users className="w-4 h-4" /> All Students
        </Link>
        <Link
          to="/subjects"
          className="px-4 py-2 rounded-xl glass text-xs sm:text-sm font-medium hover:shadow-glass hover:text-primary-500 transition-all flex items-center gap-2"
        >
          <Layers className="w-4 h-4" /> All Subjects
        </Link>
      </div>

      {/* Dynamic Metric Cards with Glassmorphism, Hover Effects, Gradient Borders, and Animated Counters */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Live Platform Statistics
          </h2>
          <span className="text-xs text-slate-400 font-medium">Computed dynamically from local data</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {metricCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Link to={c.link} className="block group">
                  <div
                    className={`relative p-5 rounded-2xl glass backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-glow ${c.borderHover} overflow-hidden`}
                  >
                    {/* Top gradient border highlight */}
                    <div
                      className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${c.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                    />

                    {/* Background subtle gradient bloom */}
                    <div
                      className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full ${c.bgGlow} blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`}
                    />

                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${c.bgGlow} flex items-center justify-center ${c.color} group-hover:scale-110 transition-transform duration-300 shadow-xs`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>

                    {/* Dynamic Animated Value */}
                    <div className="font-display font-extrabold text-2xl lg:text-3xl text-slate-900 dark:text-slate-50 tracking-tight">
                      <Counter
                        value={c.value}
                        duration={1.4}
                        prefix={c.prefix}
                        suffix={c.suffix}
                      />
                    </div>

                    {/* Title & Subtext */}
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                      {c.label}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {c.subtext}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Advanced AI Cognitive Intelligence Suite */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AIDashboardWidgets />
      </motion.div>

      {/* Main Content Grid: Recent Activity Feed & Upcoming Sessions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed (Latest 20 items stored in localStorage) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <RecentActivityFeed maxItems={20} />
        </motion.div>

        {/* Right Column: Upcoming Sessions & Quick Notifications */}
        <div className="space-y-6">
          {/* Upcoming sessions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-500" /> Upcoming Sessions
                </h2>
                <Link
                  to="/scheduler"
                  className="text-xs text-primary-500 hover:underline flex items-center gap-1 font-medium"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingSessions.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-sm text-slate-500">No scheduled sessions.</p>
                    <Link
                      to="/matching"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary-500 font-semibold hover:underline"
                    >
                      Find a peer or tutor to book <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
                {upcomingSessions.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/70 transition-colors border border-slate-200/40 dark:border-slate-700/40"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex flex-col items-center justify-center text-white shrink-0 shadow-xs">
                      <span className="text-[9px] uppercase font-semibold">
                        {new Date(s.date).toLocaleDateString('en', { month: 'short' })}
                      </span>
                      <span className="font-bold text-base leading-none">
                        {new Date(s.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {s.subject} {s.topic ? `— ${s.topic}` : ''}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        with {s.tutorName} · {s.startTime}–{s.endTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${
                          s.mode === 'online'
                            ? 'bg-accent-500/15 text-accent-600 dark:text-accent-400'
                            : 'bg-primary-500/15 text-primary-600 dark:text-primary-400'
                        }`}
                      >
                        {s.mode}
                      </span>
                      <button
                        onClick={() => completeSession(s.id)}
                        className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                        title="Mark session as completed (+100 XP)"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GlassCard className="p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning-500" /> Notifications
              </h2>
              <div className="space-y-3">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border transition-colors ${
                      !n.read
                        ? 'bg-primary-500/5 border-primary-500/20'
                        : 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent'
                    }`}
                  >
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Secondary Row: Weekly Analytics and Skill Mastery */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly performance mini chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success-500" /> Weekly Activity
              </h2>
              <Link to="/analytics" className="text-xs text-primary-500 hover:underline">
                Details
              </Link>
            </div>
            <div className="flex items-end gap-2 h-36">
              {weeklyPerformance.map((w, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex-1 flex items-end">
                    <motion.div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary-500 to-accent-500 shadow-xs"
                      initial={{ height: 0 }}
                      animate={{ height: `${w.score}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{w.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Avg. score this week</span>
              <span className="font-bold text-success-500">{avgWeeklyScore}%</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Skills overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-500" /> Skill Mastery Overview
              </h2>
              <Link to="/profile" className="text-xs text-primary-500 hover:underline">
                Update Skills
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSkills.map((s) => (
                <div
                  key={s.subject}
                  className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {s.subject}
                    </span>
                    <span
                      className={`font-bold ${
                        s.rating >= 75
                          ? 'text-success-500'
                          : s.rating >= 50
                          ? 'text-warning-500'
                          : 'text-error-500'
                      }`}
                    >
                      {s.rating}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        s.rating >= 75
                          ? 'bg-success-500'
                          : s.rating >= 50
                          ? 'bg-warning-500'
                          : 'bg-error-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.rating}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
