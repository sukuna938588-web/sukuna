import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight,
  ShieldCheck, AlertCircle, UserCheck, Sun, Moon
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { ParticleBackground } from '../components/ui/ParticleBackground';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { StudySyncLogo } from '../components/brand/StudySyncLogo';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useData();
  const { notify } = useToast();
  const { theme, toggle } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const destination = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);

      if (res.success && res.user) {
        notify(`Welcome back, ${res.user.name.split(' ')[0]}!`, 'success');
        navigate(destination, { replace: true });
      } else {
        setError(res.error || 'Invalid credentials. Please try again.');
      }
    }, 400);
  };

  const handleDemoLogin = () => {
    setEmail('aarav.sharma@university.edu');
    setPassword('password123');
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = login('aarav.sharma@university.edu', 'password123');
      setLoading(false);
      if (res.success && res.user) {
        notify(`Logged in as demo user ${res.user.name}`, 'success');
        navigate(destination, { replace: true });
      }
    }, 400);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <ParticleBackground />

      {/* Top bar with logo and theme toggle */}
      <header className="relative z-20 flex items-center justify-between max-w-6xl mx-auto w-full mb-4">
        <Link to="/" className="flex items-center transition-transform hover:scale-[1.02]">
          <StudySyncLogo variant="navbar" animated />
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
          <Link
            to="/signup"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-sm font-medium hover:border-primary-500/40 hover:text-primary-500 transition-all"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-20 flex-1 flex items-center justify-center my-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-7 sm:p-9 shadow-2xl relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80">
            {/* Background ambient light */}
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-accent-500/15 blur-3xl pointer-events-none" />

            <div className="relative">
              {/* Header */}
              <div className="text-center mb-7">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500/20 to-accent-500/20 text-primary-500 mb-3 ring-1 ring-primary-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100">
                  Welcome back
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                  Sign in to access your personal study dashboard
                </p>
              </div>

              {/* Demo Account Quick-fill Banner */}
              <div className="mb-6 p-3.5 rounded-xl bg-primary-500/10 dark:bg-primary-950/40 border border-primary-500/25 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 shrink-0" />
                    Demo Student Account
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    aarav.sharma@university.edu
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Quick Sign In
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="student@university.edu"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl glass bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-primary-500 focus:ring-primary-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <span className="text-slate-400 hover:text-primary-500 cursor-pointer transition-colors">
                    Forgot password?
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 active:scale-[0.99] text-white font-semibold text-sm shadow-glow hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign up prompt */}
              <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Don't have an account yet?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-0.5"
                >
                  Sign up free
                  <ArrowRight className="w-3 h-3 inline" />
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 text-center text-xs text-slate-500 dark:text-slate-400 py-2">
        <p>© 2026 StudySync AI. All academic data is saved securely in your browser.</p>
      </footer>
    </div>
  );
}
