import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Building, GraduationCap, FileText, Camera, Upload,
  CheckCircle2, RotateCcw, Flame, Trophy, Award, Sparkles, RefreshCw,
  Hash, ShieldCheck
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Data Science & AI',
  'Electrical & Electronics Engineering',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Mathematics & Computing',
  'Physics & Applied Sciences',
];

const PRESET_SEEDS = ['Aarav Sharma', 'Diya Patel', 'Alex Morgan', 'Jordan Lee', 'Sam Wilson', 'Taylor Swift'];

export function ProfilePage() {
  const { currentUser, updateCurrentUser } = useData();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    department: currentUser.department,
    year: currentUser.year,
    bio: currentUser.bio || '',
    rollNumber: currentUser.rollNumber || 'CS21B001',
    avatar: currentUser.avatar,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? Number(value) : value,
    }));
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }
    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, avatar: result }));
        showToast('Profile photo loaded! Click Save to apply.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const generatePresetAvatar = (seed: string) => {
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      seed
    )}&backgroundType=gradientLinear&backgroundColor=3366ff,06b6d4`;
    setFormData((prev) => ({ ...prev, avatar: newAvatar }));
    showToast(`Generated avatar from preset: ${seed}`, 'info');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedUser = {
        ...currentUser,
        name: formData.name.trim(),
        email: formData.email.trim(),
        department: formData.department,
        year: Number(formData.year),
        bio: formData.bio.trim(),
        rollNumber: formData.rollNumber.trim(),
        avatar: formData.avatar,
      };

      updateCurrentUser(updatedUser);
      showToast('Profile updated successfully! Saved to localStorage.', 'success');
    } catch {
      showToast('Failed to save profile changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      department: currentUser.department,
      year: currentUser.year,
      bio: currentUser.bio || '',
      rollNumber: currentUser.rollNumber || 'CS21B001',
      avatar: currentUser.avatar,
    });
    showToast('Reset form to current saved profile', 'info');
  };

  const hasChanges =
    formData.name !== currentUser.name ||
    formData.email !== currentUser.email ||
    formData.department !== currentUser.department ||
    formData.year !== currentUser.year ||
    formData.bio !== (currentUser.bio || '') ||
    formData.rollNumber !== (currentUser.rollNumber || '') ||
    formData.avatar !== currentUser.avatar;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Top Header Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
              <div className="relative group">
                <img
                  src={formData.avatar || currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-primary-500/20 shadow-glow bg-slate-100 dark:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-md transition-transform hover:scale-110"
                  title="Upload profile picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="font-display font-bold text-2xl lg:text-3xl text-slate-900 dark:text-slate-50">
                    {currentUser.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                    Student
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {currentUser.department} · Year {currentUser.year}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                  <Mail className="w-3.5 h-3.5" /> {currentUser.email}
                </p>
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
              <div className="glass px-4 py-2.5 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-warning-500/10 text-warning-500 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Streak</p>
                  <p className="text-sm font-bold">{currentUser.streak} Days</p>
                </div>
              </div>

              <div className="glass px-4 py-2.5 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Level {currentUser.level}</p>
                  <p className="text-sm font-bold">{currentUser.xp.toLocaleString()} XP</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Profile Form */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar Management & Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Avatar upload card */}
          <GlassCard className="p-6">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary-500" /> Profile Picture
            </h2>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-slate-300 dark:border-slate-700 hover:border-primary-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileInputChange}
              />
              <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 mx-auto flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold mb-1">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-500">PNG, JPG, WEBP or SVG up to 5MB</p>
            </div>

            {/* Presets */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-500" /> Or pick an avatar style
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESET_SEEDS.map((seed) => (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => generatePresetAvatar(seed)}
                    className="px-2.5 py-1.5 text-xs rounded-xl glass hover:border-primary-500/50 transition-colors flex items-center gap-1.5"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`}
                      alt=""
                      className="w-4 h-4 rounded-full"
                    />
                    {seed.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Account Details info */}
          <GlassCard className="p-6">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-success-500" /> Account Status
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Account ID</span>
                <span className="font-mono text-xs font-semibold">{currentUser.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Storage</span>
                <span className="font-semibold text-success-600 dark:text-success-400">localStorage.currentUser</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Completed Sessions</span>
                <span className="font-semibold">4 Sessions</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Badges Unlocked</span>
                <span className="font-semibold text-primary-500">{currentUser.badges.length} Badges</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Right Column: Edit Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 space-y-6"
        >
          <GlassCard className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
              <div>
                <h2 className="font-display font-bold text-xl flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" /> Edit Profile Information
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your personal and academic information below.
                </p>
              </div>
              {hasChanges && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-warning-500/10 text-warning-600 dark:text-warning-400 border border-warning-500/20 animate-pulse">
                  Unsaved Changes
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:border-primary-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. user@university.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:border-primary-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Department & Year */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Department *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:border-primary-500 focus:outline-none transition-colors appearance-none"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept} className="dark:bg-slate-900">
                          {dept}
                        </option>
                      ))}
                      {!DEPARTMENTS.includes(formData.department) && (
                        <option value={formData.department} className="dark:bg-slate-900">
                          {formData.department}
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Academic Year *
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:border-primary-500 focus:outline-none transition-colors appearance-none"
                    >
                      <option value={1} className="dark:bg-slate-900">Year 1 (Freshman)</option>
                      <option value={2} className="dark:bg-slate-900">Year 2 (Sophomore)</option>
                      <option value={3} className="dark:bg-slate-900">Year 3 (Junior)</option>
                      <option value={4} className="dark:bg-slate-900">Year 4 (Senior)</option>
                      <option value={5} className="dark:bg-slate-900">Year 5 (Graduate/Ph.D.)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Roll / Student ID
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. CS21B001"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:border-primary-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Bio & Learning Objectives
                  </label>
                  <span className="text-xs text-slate-400">{formData.bio.length} / 500</span>
                </div>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    name="bio"
                    rows={4}
                    maxLength={500}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell mentors and peers about your academic interests, focus areas, and goals..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:border-primary-500 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!hasChanges || isSaving}
                  className="px-4 py-2.5 rounded-xl glass text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-glow hover:shadow-glow-cyan disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Save Profile Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Academic Snapshot & Badges */}
          <GlassCard className="p-6">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-warning-500" /> Unlocked Badges & Achievements
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentUser.badges.map((badgeName, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center text-center gap-1.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning-500/20 to-primary-500/20 text-warning-500 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold line-clamp-1">{badgeName}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Earned</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
