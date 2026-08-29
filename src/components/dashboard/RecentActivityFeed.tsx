import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Calendar,
  Brain,
  UserPlus,
  UserCheck,
  BookOpen,
  Filter,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useData } from '@/context/DataContext';
import type { ActivityItem, ActivityType } from '@/types';
import { Link } from 'react-router-dom';

function formatRelativeTime(isoString: string): string {
  try {
    const timestamp = new Date(isoString).getTime();
    if (isNaN(timestamp)) return isoString;
    const now = Date.now();
    const diffSec = Math.floor((now - timestamp) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

const TYPE_CONFIG: Record<
  ActivityType,
  {
    label: string;
    icon: typeof Activity;
    bgColor: string;
    textColor: string;
    badgeBg: string;
    borderColor: string;
  }
> = {
  session_booked: {
    label: 'Session Booked',
    icon: Calendar,
    bgColor: 'bg-primary-500/10 text-primary-600 dark:text-primary-400',
    textColor: 'text-primary-600 dark:text-primary-400',
    badgeBg: 'bg-primary-500/15 text-primary-600 dark:text-primary-300',
    borderColor: 'border-primary-500/20 hover:border-primary-500/40',
  },
  match_found: {
    label: 'AI Match Found',
    icon: Brain,
    bgColor: 'bg-accent-500/10 text-accent-600 dark:text-accent-400',
    textColor: 'text-accent-600 dark:text-accent-400',
    badgeBg: 'bg-accent-500/15 text-accent-600 dark:text-accent-300',
    borderColor: 'border-accent-500/20 hover:border-accent-500/40',
  },
  signup: {
    label: 'New Signup',
    icon: UserPlus,
    bgColor: 'bg-success-500/10 text-success-600 dark:text-success-400',
    textColor: 'text-success-600 dark:text-success-400',
    badgeBg: 'bg-success-500/15 text-success-600 dark:text-success-300',
    borderColor: 'border-success-500/20 hover:border-success-500/40',
  },
  profile_update: {
    label: 'Profile Update',
    icon: UserCheck,
    bgColor: 'bg-warning-500/10 text-warning-600 dark:text-warning-400',
    textColor: 'text-warning-600 dark:text-warning-400',
    badgeBg: 'bg-warning-500/15 text-warning-600 dark:text-warning-300',
    borderColor: 'border-warning-500/20 hover:border-warning-500/40',
  },
  subject_added: {
    label: 'Subject Added',
    icon: BookOpen,
    bgColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    textColor: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-300',
    borderColor: 'border-purple-500/20 hover:border-purple-500/40',
  },
};

export function RecentActivityFeed({ maxItems = 20 }: { maxItems?: number }) {
  const { activities, logActivity, currentUser } = useData();
  const [filter, setFilter] = useState<'all' | ActivityType>('all');
  const [isSimulating, setIsSimulating] = useState(false);

  // Take latest 20 activities stored in localStorage
  const latest20 = useMemo(() => {
    return activities.slice(0, maxItems);
  }, [activities, maxItems]);

  const filteredActivities = useMemo(() => {
    if (filter === 'all') return latest20;
    return latest20.filter((a) => a.type === filter);
  }, [latest20, filter]);

  const filterOptions: { id: 'all' | ActivityType; label: string; count: number }[] = [
    { id: 'all', label: 'All Activities', count: latest20.length },
    { id: 'session_booked', label: 'Sessions', count: latest20.filter((a) => a.type === 'session_booked').length },
    { id: 'match_found', label: 'AI Matches', count: latest20.filter((a) => a.type === 'match_found').length },
    { id: 'signup', label: 'Signups', count: latest20.filter((a) => a.type === 'signup').length },
    { id: 'profile_update', label: 'Updates', count: latest20.filter((a) => a.type === 'profile_update').length },
    { id: 'subject_added', label: 'Subjects', count: latest20.filter((a) => a.type === 'subject_added').length },
  ];

  // Quick activity generator demo helper
  const handleSimulateActivity = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const mockScenarios: Omit<ActivityItem, 'id' | 'timestamp'>[] = [
        {
          type: 'match_found',
          title: '95% Synergistic Match Discovered',
          description: `AI computed high reciprocal mastery in Algorithms with Aarav Sharma`,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          target: 'Algorithms',
        },
        {
          type: 'session_booked',
          title: 'Peer Review Session Scheduled',
          description: `${currentUser.name} booked a 1-hour interactive coding review`,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          target: 'Web Development',
        },
        {
          type: 'profile_update',
          title: 'Skill Mastery Reassessed',
          description: `${currentUser.name} updated database normalization mastery score to 85%`,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          target: 'Databases',
        },
      ];

      const chosen = mockScenarios[Math.floor(Math.random() * mockScenarios.length)];
      logActivity(chosen);
      setIsSimulating(false);
    }, 300);
  };

  return (
    <GlassCard className="p-6 lg:p-7 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary-500/10 via-accent-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-500 p-0.5 shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-primary-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-slate-100">
                Live Activity Feed
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
                Real-time
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracking the latest 20 platform activities across students, tutors & sessions
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSimulateActivity}
            disabled={isSimulating}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/20 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            title="Log a new real-time simulated activity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isSimulating ? 'Logging...' : 'Simulate Event'}
          </button>
          <Link
            to="/matching"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold glass text-slate-700 dark:text-slate-300 hover:text-primary-500 transition-colors flex items-center gap-1"
          >
            Find Peers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-5 scrollbar-none">
        <span className="text-xs text-slate-400 mr-1 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {filterOptions.map((opt) => {
          const isActive = filter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-primary-500 text-white shadow-glow font-semibold'
                  : 'glass text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Activities List */}
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        <AnimatePresence initial={false}>
          {filteredActivities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No activities in this category yet
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Activities update automatically when students sign up, book sessions, or update their profiles.
              </p>
            </motion.div>
          ) : (
            filteredActivities.map((act, index) => {
              const config = TYPE_CONFIG[act.type] || TYPE_CONFIG.session_booked;
              const Icon = config.icon;

              return (
                <motion.div
                  key={act.id}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md ${config.borderColor} hover:shadow-md flex items-start gap-3 sm:gap-4`}
                >
                  {/* Activity Icon or User Avatar */}
                  <div className="relative shrink-0 mt-0.5">
                    {act.userAvatar ? (
                      <div className="relative">
                        <img
                          src={act.userAvatar}
                          alt={act.userName || 'User'}
                          className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg ${config.bgColor} flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs`}
                        >
                          <Icon className="w-3 h-3" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center shadow-xs`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md ${config.badgeBg}`}
                        >
                          {config.label}
                        </span>
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {act.title}
                        </h4>
                      </div>

                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(act.timestamp)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                      {act.description}
                    </p>

                    {/* Metadata tags if target or user available */}
                    {(act.target || act.userName) && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                        {act.userName && (
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            By: {act.userName}
                          </span>
                        )}
                        {act.target && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px]">
                            {act.target}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer count indicator */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing {filteredActivities.length} of {latest20.length} stored activities
        </span>
        <span className="text-[11px]">Synced to localStorage (ss_activities)</span>
      </div>
    </GlassCard>
  );
}
