import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Sun, Moon, LogOut, User, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { AnimatePresence, motion } from 'framer-motion';
import { StudySyncLogo } from '../brand/StudySyncLogo';
import { BrandKitModal } from '../brand/BrandKitModal';

export function Navbar({ onMenu }: { onMenu: () => void }) {
  const { notifications, markNotificationRead, markAllRead, currentUser, logout } = useData();
  const { theme, toggle } = useTheme();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBrandKit, setShowBrandKit] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    notify('You have been logged out successfully.', 'info');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 px-4 lg:px-8 py-4">
      <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
        <button onClick={onMenu} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="lg:hidden flex items-center shrink-0">
          <StudySyncLogo variant="navbar" size="sm" />
        </Link>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search tutors, subjects, sessions..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-sm border border-transparent focus:border-primary-500/40 focus:outline-none transition-colors"
          />
        </div>

        <button onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Toggle theme">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setShowBrandKit(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-xs font-semibold transition-all"
          title="View Brand Kit & Vector Logos"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Brand Kit</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotif((s) => !s);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-error-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotif && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNotif(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 glass-strong rounded-2xl shadow-glass z-40 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-semibold text-sm">Notifications</span>
                    <button onClick={markAllRead} className="text-xs text-primary-500 hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`w-full text-left px-4 py-3 flex gap-3 border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 ${!n.read ? 'bg-primary-500/5' : ''}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-transparent' : 'bg-primary-500'}`} />
                        <div>
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile & Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu((s) => !s);
              setShowNotif(false);
            }}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
            title="User menu"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full bg-slate-200 object-cover ring-2 ring-primary-500/20 group-hover:ring-primary-500/50 transition-all"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 glass-strong rounded-2xl shadow-glass z-40 overflow-hidden border border-slate-200/80 dark:border-slate-800/80 p-2"
                >
                  <div className="p-3 border-b border-slate-200/60 dark:border-slate-800/60 mb-1">
                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{currentUser?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-semibold">
                      <span>Student</span>
                      {currentUser?.department && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{currentUser.department}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <User className="w-4 h-4 text-primary-500" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-accent-500" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowBrandKit(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Brand Kit & Logos
                    </button>
                  </div>

                  <div className="mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BrandKitModal isOpen={showBrandKit} onClose={() => setShowBrandKit(false)} />
    </header>
  );
}
