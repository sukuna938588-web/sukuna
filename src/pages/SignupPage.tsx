import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Mail, Lock, Eye, EyeOff, User, Building, GraduationCap,
  ArrowRight, AlertCircle, CheckCircle2, Upload, Camera,
  RefreshCw, Sun, Moon, Hash, FileText
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology & Bioinformatics',
  'Mathematics & Computing',
];

const PRESET_SEEDS = [
  'Aarav Sharma', 'Diya Patel', 'Alex Rivers', 'Sofia Chen', 'Elena Vance',
  'Maya Lin', 'Lucas Silva', 'Oliver Queen', 'Zoe Walker', 'Rohan Gupta'
];

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useData();
  const { notify } = useToast();
  const { theme, toggle } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [year, setYear] = useState(1);
  const [rollNumber, setRollNumber] = useState('');
  const [bio, setBio] = useState('');

  // Avatar state
  const [avatarSeed, setAvatarSeed] = useState('New Student');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const currentAvatar =
    avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      avatarSeed || name || 'Student'
    )}&backgroundType=gradientLinear&backgroundColor=3366ff,06b6d4`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setError('Image file must be under 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
          notify('Profile image uploaded successfully!', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const randomizeAvatar = () => {
    const random = PRESET_SEEDS[Math.floor(Math.random() * PRESET_SEEDS.length)] + '-' + Math.floor(Math.random() * 100);
    setAvatarSeed(random);
    setAvatarUrl('');
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid academic or personal email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        department,
        year: Number(year),
        rollNumber: rollNumber.trim() || undefined,
        avatar: currentAvatar,
        bio: bio.trim() || undefined,
      });

      setLoading(false);

      if (res.success && res.user) {
        notify(`Welcome to StudySync AI, ${res.user.name.split(' ')[0]}!`, 'success');
        navigate('/dashboard', { replace: true });
      } else {
        setError(res.error || 'Failed to create account. Please try again.');
      }
    }, 450);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <ParticleBackground />

      {/* Top Bar */}
      <header className="relative z-20 flex items-center justify-between max-w-6xl mx-auto w-full mb-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            StudySync<span className="text-gradient">AI</span>
          </span>
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
            to="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-sm font-medium hover:border-primary-500/40 hover:text-primary-500 transition-all"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Signup Form Container */}
      <main className="relative z-20 flex-1 flex items-center justify-center my-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <GlassCard className="p-6 sm:p-9 shadow-2xl relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80">
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-accent-500/15 blur-3xl pointer-events-none" />

            <div className="relative">
              {/* Header */}
              <div className="text-center mb-7">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500/20 to-accent-500/20 text-primary-500 mb-3 ring-1 ring-primary-500/30">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100">
                  Create your Student Account
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                  Join StudySync AI for smart peer tutor matching, study analytics, and gamified progress
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{error}</p>
                    {error.includes('already exists') && (
                      <Link to="/login" className="underline mt-1 inline-block font-medium">
                        Click here to sign in with your password
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Avatar Picker Section */}
                <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group shrink-0">
                    <img
                      src={currentAvatar}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-500/40 bg-slate-200 shadow-md"
                    />
                    <label
                      htmlFor="avatar-file"
                      className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary-500 text-white shadow-md cursor-pointer hover:bg-primary-600 transition-transform active:scale-90"
                      title="Upload custom photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <input
                        id="avatar-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      Profile Picture
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Upload an image or generate a unique personalized avatar.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={randomizeAvatar}
                        className="px-2.5 py-1 rounded-lg glass text-xs font-medium hover:border-primary-500/40 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3 text-primary-500" />
                        Randomize Avatar
                      </button>
                      <label
                        htmlFor="avatar-file-btn"
                        className="px-2.5 py-1 rounded-lg glass text-xs font-medium hover:border-primary-500/40 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Upload className="w-3 h-3 text-accent-500" />
                        Upload File
                        <input
                          id="avatar-file-btn"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Diya Patel"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (error) setError(null);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="diya.patel@university.edu"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError(null);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Department & Year Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Department *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl glass bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                      >
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept} className="bg-slate-100 dark:bg-slate-900">
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Academic Year *
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl glass bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value={1} className="bg-slate-100 dark:bg-slate-900">1st Year (Freshman)</option>
                        <option value={2} className="bg-slate-100 dark:bg-slate-900">2nd Year (Sophomore)</option>
                        <option value={3} className="bg-slate-100 dark:bg-slate-900">3rd Year (Junior)</option>
                        <option value={4} className="bg-slate-100 dark:bg-slate-900">4th Year (Senior)</option>
                        <option value={5} className="bg-slate-100 dark:bg-slate-900">5th Year (Graduate)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Roll Number & Bio (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Student ID / Roll No. (Optional)
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. CS22B042"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Short Bio (Optional)
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Passionate about algorithms & AI"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm Password Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 6 characters"
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
                    {password && (
                      <div className="mt-1.5">
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              strength <= 25
                                ? 'bg-rose-500 w-1/4'
                                : strength <= 50
                                ? 'bg-amber-500 w-2/4'
                                : strength <= 75
                                ? 'bg-blue-500 w-3/4'
                                : 'bg-emerald-500 w-full'
                            }`}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {strength <= 25 && 'Weak password'}
                          {strength === 50 && 'Moderate password'}
                          {strength === 75 && 'Good password'}
                          {strength === 100 && 'Strong password'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (error) setError(null);
                        }}
                        className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl glass bg-slate-50/50 dark:bg-slate-900/50 border ${
                          confirmPassword && confirmPassword !== password
                            ? 'border-rose-500 focus:ring-rose-500'
                            : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500'
                        } focus:outline-none focus:ring-2 transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 active:scale-[0.99] text-white font-semibold text-sm shadow-glow hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Create Account & Launch Dashboard</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Login link */}
              <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-0.5"
                >
                  Sign in here
                  <ArrowRight className="w-3 h-3 inline" />
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 text-center text-xs text-slate-500 dark:text-slate-400 py-2">
        <p>© 2026 StudySync AI. All academic records and profiles stored safely in local storage.</p>
      </footer>
    </div>
  );
}
