import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Brain, Calendar, TrendingUp, Trophy, Bot, ArrowRight,
  Star, Zap, Users, Target, CheckCircle2, Quote, LogIn, UserPlus, Download
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Counter } from '../components/ui/Counter';
import { ParticleBackground } from '../components/ui/ParticleBackground';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { Sun, Moon } from 'lucide-react';
import { StudySyncLogo } from '../components/brand/StudySyncLogo';
import { BrandKitModal } from '../components/brand/BrandKitModal';

const features = [
  { icon: Brain, title: 'AI Tutor Matching', desc: 'Our engine scores tutors on expertise, availability, ratings, and compatibility to find your perfect match.' },
  { icon: Calendar, title: 'Smart Scheduling', desc: 'Book sessions with an interactive calendar that finds overlapping time slots instantly.' },
  { icon: TrendingUp, title: 'Learning Analytics', desc: 'Track mastery, streaks, and weekly performance with beautiful interactive charts.' },
  { icon: Trophy, title: 'Gamified Learning', desc: 'Earn XP, unlock badges, climb leaderboards, and keep your learning streak alive.' },
  { icon: Bot, title: 'AI Assistant', desc: 'Get instant tutor recommendations, subject suggestions, and study guidance 24/7.' },
  { icon: Users, title: 'Group Sessions', desc: 'Find peers with the same weak subjects and join optimized group study sessions.' },
];

const steps = [
  { icon: Target, title: 'Set Your Profile', desc: 'Add your skills, weak subjects, and availability so the AI understands your needs.' },
  { icon: Brain, title: 'Get Matched', desc: 'Our engine ranks tutors with a confidence score and explains why they fit.' },
  { icon: Calendar, title: 'Book a Session', desc: 'Pick an open slot, confirm your booking, and get instant reminders.' },
  { icon: TrendingUp, title: 'Track Progress', desc: 'Watch your mastery grow, earn XP, and climb the leaderboard.' },
];

const testimonials = [
  { name: 'Meera Joshi', role: 'CS Junior', text: 'StudySync matched me with a tutor who actually understood my weak spots. My ML grade went from C to A in one semester.', rating: 5 },
  { name: 'Karthik Rao', role: 'EE Sophomore', text: 'The gamification is addictive — I have a 28-day streak because I just keep wanting to earn XP. Best study tool on campus.', rating: 5 },
  { name: 'Sneha Patel', role: 'Data Science Senior', text: 'Booking sessions takes seconds and the analytics actually show me where I am improving. Feels like a real product.', rating: 5 },
];

const stats = [
  { value: 1248, suffix: '+', label: 'Active Students' },
  { value: 86, suffix: '', label: 'Expert Tutors' },
  { value: 3420, suffix: '+', label: 'Sessions Booked' },
  { value: 94, suffix: '%', label: 'Success Rate' },
];

export function LandingPage() {
  const { theme, toggle } = useTheme();
  const { isAuthenticated } = useData();
  const [showBrandKit, setShowBrandKit] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ParticleBackground />

      {/* Nav */}
      <nav className="sticky top-0 z-40 px-4 lg:px-8 py-4">
        <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center transition-transform hover:scale-[1.02]">
            <StudySyncLogo variant="navbar" animated />
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
            <a href="#how" className="hover:text-primary-500 transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-primary-500 transition-colors">Testimonials</a>
            <button
              onClick={() => setShowBrandKit(true)}
              className="inline-flex items-center gap-1 text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Brand Kit
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowBrandKit(true)}
              className="hidden sm:inline-flex md:hidden items-center gap-1 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-400"
            >
              Brand Kit
            </button>

            <button onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Toggle theme">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-glow hover:shadow-glow-cyan transition-shadow">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-3.5 py-2 rounded-xl glass text-sm font-medium hover:text-primary-500 transition-colors flex items-center gap-1.5">
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
                <Link to="/signup" className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-glow hover:shadow-glow-cyan transition-shadow flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-4 lg:px-8 pt-16 pb-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs font-medium">
                <Zap className="w-3.5 h-3.5 text-primary-500" />
                AI-Powered Peer Tutor Matching
              </div>
              <button
                onClick={() => setShowBrandKit(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-500 dark:text-indigo-300 text-xs font-semibold shadow-sm transition-all group"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                View Brand Kit & Vector Logos
              </button>
            </div>
            <h1 className="font-display font-extrabold text-5xl lg:text-7xl leading-[1.05] tracking-tight">
              Find your <span className="text-gradient">perfect tutor</span> in seconds.
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              StudySync AI matches students with peer tutors using a smart scoring engine —
              then books sessions, tracks progress, and gamifies the whole journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="group px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-glow flex items-center gap-2 hover:shadow-glow-cyan transition-shadow">
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to={isAuthenticated ? "/profile" : "/login"} className="px-6 py-3.5 rounded-xl glass font-semibold hover:shadow-glass transition-shadow">
                {isAuthenticated ? "View Profile" : "Sign In to Account"}
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success-500" /> No credit card</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success-500" /> Free for students</div>
            </div>
          </motion.div>

          {/* Floating glass cards */}
          <div className="relative h-[440px] hidden lg:block">
            <motion.div
              className="absolute top-0 right-10 w-72"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-5 animate-float">
                <div className="flex items-center gap-3 mb-3">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=DrPriya" className="w-11 h-11 rounded-full bg-slate-200" alt="" />
                  <div>
                    <p className="font-semibold text-sm">Dr. Priya Nair</p>
                    <p className="text-xs text-slate-500">Machine Learning</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Match Score</span>
                  <span className="font-bold text-primary-500">96%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-primary-500 to-accent-500" initial={{ width: 0 }} animate={{ width: '96%' }} transition={{ delay: 0.6, duration: 1 }} />
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              className="absolute top-44 left-0 w-64"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="p-5 animate-float-slow">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-warning-500" />
                  <span className="text-sm font-semibold">Level 12</span>
                </div>
                <p className="text-2xl font-bold font-display">4,820 XP</p>
                <p className="text-xs text-slate-500 mt-1">14-day streak active</p>
              </GlassCard>
            </motion.div>

            <motion.div
              className="absolute bottom-0 right-0 w-72"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GlassCard className="p-5 animate-float">
                <p className="text-xs text-slate-500 mb-2">This week's progress</p>
                <div className="flex items-end gap-1.5 h-20">
                  {[40, 55, 48, 70, 82, 90, 65].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-primary-500 to-accent-500"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.8 + i * 0.08 }}
                    />
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Official Master Logo Showcase */}
      <section className="px-4 lg:px-8 py-8 max-w-7xl mx-auto">
        <GlassCard className="p-6 lg:p-8 border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Official StudySync AI Master Logo
              </div>
              <h2 className="text-xl lg:text-2xl font-bold font-display text-slate-900 dark:text-white">
                Exact Horizontal Technology Logo & Brand Identity
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Futuristic 3D ribbon S, top graduation cap, center student nodes with curved connection paths, bottom AI circuits, bold white "StudySync", and blue-purple-cyan gradient "AI".
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href="/studysync-logo-dark-navy.svg"
                download="StudySync_AI_Dark_Navy_Logo.svg"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-glow"
              >
                <Download className="w-3.5 h-3.5" /> Dark Navy SVG
              </a>
              <a
                href="/studysync-logo-transparent.svg"
                download="StudySync_AI_Transparent_Logo.svg"
                className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Transparent SVG
              </a>
              <button
                onClick={() => setShowBrandKit(true)}
                className="px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Open Brand Kit
              </button>
            </div>
          </div>

          {/* Master Logo Displays: Dark Navy Gradient & Transparent Versions */}
          <div className="grid md:grid-cols-2 gap-5 pt-6">
            {/* Dark Navy Canvas (Official Master Presentation) */}
            <div className="p-6 rounded-2xl bg-[#050B1A] border border-indigo-500/30 shadow-2xl flex flex-col items-center justify-center text-center relative group overflow-hidden">
              <span className="absolute top-3 left-4 text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Dark Navy Gradient Canvas (Official Branding)
              </span>
              <div className="py-6 w-full flex justify-center">
                <img
                  src="/studysync-logo-dark-navy.svg"
                  alt="StudySync AI Dark Navy Master Logo"
                  className="max-h-20 sm:max-h-24 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-300">
                <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700">Dark Navy #050B1A</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700">Bold White Font</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-cyan-400">Cyan #06B6D4</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-indigo-400">Indigo #4F46E5</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-purple-400">Purple #7C3AED</span>
              </div>
            </div>

            {/* Transparent Canvas with Subtle Ambient Grid & Glow */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-2xl flex flex-col items-center justify-center text-center relative group overflow-hidden">
              <span className="absolute top-3 left-4 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Transparent Vector Version (Hero & Navbar Ready)
              </span>
              <div className="py-6 w-full flex justify-center">
                <img
                  src="/studysync-logo-transparent.svg"
                  alt="StudySync AI Transparent Master Logo"
                  className="max-h-20 sm:max-h-24 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">3D Ribbon "S"</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">Graduation Cap</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">Curved Node Path</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">AI Circuit Board</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-sky-400">Gradient "AI"</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Stats */}
      <section className="px-4 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <GlassCard key={i} className="p-6 text-center" hover>
              <p className="text-3xl lg:text-4xl font-bold font-display text-gradient">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 lg:px-8 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display font-bold text-4xl lg:text-5xl">Everything you need to <span className="text-gradient">learn smarter</span></h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">A complete platform that matches, schedules, tracks, and motivates.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard hover className="p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-4 lg:px-8 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display font-bold text-4xl lg:text-5xl">How it <span className="text-gradient">works</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="p-6 h-full relative">
                <span className="absolute top-4 right-4 text-5xl font-bold font-display text-slate-100 dark:text-slate-800 select-none">{i + 1}</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4 shadow-glow">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{s.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-4 lg:px-8 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display font-bold text-4xl lg:text-5xl">Loved by <span className="text-gradient">students</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-6 h-full">
                <Quote className="w-8 h-8 text-primary-500/30 mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-warning-400 text-warning-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} className="w-9 h-9 rounded-full bg-slate-200" alt="" />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 lg:px-8 py-20 max-w-5xl mx-auto">
        <GlassCard className="p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-500/20 blur-3xl animate-pulse-glow" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent-500/20 blur-3xl animate-pulse-glow" />
          <div className="relative">
            <h2 className="font-display font-bold text-3xl lg:text-5xl">Start learning <span className="text-gradient">smarter</span> today</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-xl mx-auto">Join thousands of students using StudySync AI to find tutors, book sessions, and track growth.</p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-glow hover:shadow-glow-cyan transition-shadow">
              Launch the App <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="px-4 lg:px-8 py-10 max-w-7xl mx-auto border-t border-slate-200/60 dark:border-slate-700/60">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-4">
            <StudySyncLogo variant="horizontal" size="sm" showTagline />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowBrandKit(true)}
              className="text-xs text-indigo-500 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" /> View Brand Kit & Vector Assets
            </button>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <p className="text-xs">Built for the modern student. A final-year project demonstration.</p>
          </div>
        </div>
      </footer>

      <BrandKitModal isOpen={showBrandKit} onClose={() => setShowBrandKit(false)} />
    </div>
  );
}
