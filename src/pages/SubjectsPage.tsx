import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Plus,
  Pencil,
  Trash2,
  Building2,
  Sparkles,
  Award,
  Clock,
  ArrowUpDown,
  LayoutGrid,
  List,
  X,
  AlertTriangle,
  Check,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Modal } from '../components/ui/Modal';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import type { Subject } from '../types';

const COMMON_DEPARTMENTS = [
  'Computer Science',
  'Data Science',
  'Software Engineering',
  'Mathematics',
  'Electrical Engineering',
  'Artificial Intelligence',
  'Information Systems',
];

const DIFFICULTY_CONFIG = {
  Beginner: {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    dot: 'bg-emerald-500',
    desc: 'Foundational concepts & syntax',
  },
  Intermediate: {
    badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25',
    dot: 'bg-sky-500',
    desc: 'Applied theory & practical models',
  },
  Advanced: {
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25',
    dot: 'bg-violet-500',
    desc: 'Complex systems & research depth',
  },
};

type ViewMode = 'grid' | 'table';
type SortOption = 'name-asc' | 'name-desc' | 'code-asc' | 'credits-desc' | 'credits-asc' | 'difficulty';

interface SubjectFormData {
  code: string;
  name: string;
  department: string;
  credits: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}

const initialFormState: SubjectFormData = {
  code: '',
  name: '',
  department: 'Computer Science',
  credits: 4,
  difficulty: 'Intermediate',
  description: '',
};

export function SubjectsPage() {
  const { subjects, addSubject, updateSubject, deleteSubject, currentUser } = useData();
  const { notify } = useToast();

  // Search & Filters state
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCredits, setSelectedCredits] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('code-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState<SubjectFormData>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete confirmation modal state
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  // Derive dynamic list of all departments from current subjects + common departments
  const allDepartments = useMemo(() => {
    const deptSet = new Set<string>(COMMON_DEPARTMENTS);
    subjects.forEach((s) => {
      if (s.department) deptSet.add(s.department);
    });
    return Array.from(deptSet).sort();
  }, [subjects]);

  // Derive KPIs
  const stats = useMemo(() => {
    const totalCount = subjects.length;
    const deptsCount = new Set(subjects.map((s) => s.department || 'Computer Science')).size;
    const totalCredits = subjects.reduce((acc, s) => acc + (s.credits || 3), 0);
    const advancedCount = subjects.filter((s) => s.difficulty === 'Advanced').length;
    return { totalCount, deptsCount, totalCredits, advancedCount };
  }, [subjects]);

  // Filter and sort subjects
  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = subjects.filter((s) => {
      const code = (s.code || '').toLowerCase();
      const name = (s.name || '').toLowerCase();
      const dept = (s.department || '').toLowerCase();
      const desc = (s.description || '').toLowerCase();

      const matchesSearch =
        !query ||
        code.includes(query) ||
        name.includes(query) ||
        dept.includes(query) ||
        desc.includes(query);

      const matchesDept =
        selectedDept === 'All' || (s.department || 'Computer Science') === selectedDept;

      const matchesDiff =
        selectedDifficulty === 'All' || s.difficulty === selectedDifficulty;

      const creditsVal = s.credits ?? 3;
      const matchesCredits =
        selectedCredits === 'All' || String(creditsVal) === selectedCredits;

      return matchesSearch && matchesDept && matchesDiff && matchesCredits;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'code-asc') return a.code.localeCompare(b.code);
      if (sortBy === 'credits-desc') return (b.credits || 3) - (a.credits || 3);
      if (sortBy === 'credits-asc') return (a.credits || 3) - (b.credits || 3);
      if (sortBy === 'difficulty') {
        const order = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });
  }, [subjects, search, selectedDept, selectedDifficulty, selectedCredits, sortBy]);

  const hasActiveFilters =
    search !== '' ||
    selectedDept !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedCredits !== 'All';

  const clearAllFilters = () => {
    setSearch('');
    setSelectedDept('All');
    setSelectedDifficulty('All');
    setSelectedCredits('All');
    setSortBy('code-asc');
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData(initialFormState);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setFormData({
      code: sub.code,
      name: sub.name,
      department: sub.department || 'Computer Science',
      credits: sub.credits ?? 3,
      difficulty: sub.difficulty,
      description: sub.description || '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const codeClean = formData.code.trim().toUpperCase();
    if (!codeClean) {
      errors.code = 'Subject code is required (e.g. CS201)';
    } else if (codeClean.length < 2 || codeClean.length > 12) {
      errors.code = 'Code must be between 2 and 12 characters';
    } else {
      // Check duplicate code if not editing the same item
      const duplicate = subjects.find(
        (s) => s.code.toUpperCase() === codeClean && s.id !== editingSubject?.id
      );
      if (duplicate) {
        errors.code = `Code "${codeClean}" already exists for ${duplicate.name}`;
      }
    }

    const nameClean = formData.name.trim();
    if (!nameClean) {
      errors.name = 'Subject name is required';
    } else if (nameClean.length < 3) {
      errors.name = 'Subject name must be at least 3 characters';
    }

    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }

    if (!formData.credits || formData.credits < 1 || formData.credits > 12) {
      errors.credits = 'Credits must be between 1 and 12';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save Add / Edit
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedCode = formData.code.trim().toUpperCase();
    const formattedName = formData.name.trim();
    const formattedDept = formData.department.trim();
    const formattedDesc = formData.description.trim();

    if (editingSubject) {
      // Edit existing
      const updated: Subject = {
        ...editingSubject,
        code: formattedCode,
        name: formattedName,
        department: formattedDept,
        credits: Number(formData.credits),
        difficulty: formData.difficulty,
        description: formattedDesc,
      };
      updateSubject(updated);
      notify(`Updated "${updated.name}" (${updated.code}) successfully`, 'success');
    } else {
      // Create new
      const newSubject: Subject = {
        id: `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        code: formattedCode,
        name: formattedName,
        department: formattedDept,
        credits: Number(formData.credits),
        difficulty: formData.difficulty,
        description: formattedDesc,
      };
      addSubject(newSubject);
      notify(`Created "${newSubject.name}" (${newSubject.code}) successfully`, 'success');
    }

    setIsFormModalOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!subjectToDelete) return;
    const deletedName = subjectToDelete.name;
    const deletedCode = subjectToDelete.code;
    deleteSubject(subjectToDelete.id);
    notify(`Deleted "${deletedName}" (${deletedCode})`, 'info');
    setSubjectToDelete(null);
  };

  return (
    <div className="space-y-7 pb-20">
      {/* Top Banner & Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 dark:bg-primary-400/10 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Directory & Academic Credits
          </div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-slate-900 dark:text-slate-100 tracking-tight">
            Subject Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Configure courses, academic departments, credit ratings, and difficulty levels.
            All records persist dynamically to local storage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm hover:shadow active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Metric / Stat Ribbon (Stripe / Apple Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <GlassCard className="p-4 flex items-center gap-3.5 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Subjects</p>
            <p className="font-display font-bold text-xl text-slate-900 dark:text-slate-100">{stats.totalCount}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3.5 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Departments</p>
            <p className="font-display font-bold text-xl text-slate-900 dark:text-slate-100">{stats.deptsCount}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3.5 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Credits</p>
            <p className="font-display font-bold text-xl text-slate-900 dark:text-slate-100">{stats.totalCredits}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3.5 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Advanced Courses</p>
            <p className="font-display font-bold text-xl text-slate-900 dark:text-slate-100">{stats.advancedCount}</p>
          </div>
        </GlassCard>
      </div>

      {/* Search & Filter Toolbar (Apple + Stripe style) */}
      <GlassCard className="p-4 space-y-3.5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        {/* Main Row: Search + View Mode + Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code (e.g. CS201), name, department, or keyword..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls Right */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-slate-700 dark:text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option value="code-asc" className="bg-white dark:bg-slate-900">Code (A–Z)</option>
                <option value="name-asc" className="bg-white dark:bg-slate-900">Name (A–Z)</option>
                <option value="name-desc" className="bg-white dark:bg-slate-900">Name (Z–A)</option>
                <option value="credits-desc" className="bg-white dark:bg-slate-900">Credits (High to Low)</option>
                <option value="credits-asc" className="bg-white dark:bg-slate-900">Credits (Low to High)</option>
                <option value="difficulty" className="bg-white dark:bg-slate-900">Difficulty Level</option>
              </select>
            </div>

            {/* View Mode Toggle: Grid vs Table */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Data Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Filter Row: Department, Difficulty, Credits */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Department Filter */}
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-white dark:bg-slate-900">All Departments</option>
                {allDepartments.map((dept) => (
                  <option key={dept} value={dept} className="bg-white dark:bg-slate-900">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Segmented Filter (Apple Style) */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Credits Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Credits:</span>
              <select
                value={selectedCredits}
                onChange={(e) => setSelectedCredits(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-white dark:bg-slate-900">All Credits</option>
                <option value="1" className="bg-white dark:bg-slate-900">1 Credit</option>
                <option value="2" className="bg-white dark:bg-slate-900">2 Credits</option>
                <option value="3" className="bg-white dark:bg-slate-900">3 Credits</option>
                <option value="4" className="bg-white dark:bg-slate-900">4 Credits</option>
                <option value="5" className="bg-white dark:bg-slate-900">5 Credits</option>
              </select>
            </div>
          </div>

          {/* Results Summary & Reset Filter */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>
              Showing <strong className="text-slate-900 dark:text-slate-100">{filteredSubjects.length}</strong> of {subjects.length}
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium text-xs flex items-center gap-1 ml-1"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Main Content: Card Grid View or Data Table View */}
      {subjects.length > 0 && filteredSubjects.length > 0 && (
        viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredSubjects.map((sub, i) => {
              const diffConfig = DIFFICULTY_CONFIG[sub.difficulty] || DIFFICULTY_CONFIG.Intermediate;
              const userSkill = currentUser?.skills?.find(
                (sk) => sk.subject.toLowerCase() === sub.name.toLowerCase()
              );

              return (
                <motion.div
                  key={sub.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <GlassCard
                    hover
                    className="p-5 h-full flex flex-col justify-between border border-slate-200/80 dark:border-slate-800/80 relative group"
                  >
                    <div>
                      {/* Top Row: Code Badge + Difficulty Pill + Quick Actions */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60">
                            {sub.code}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${diffConfig.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${diffConfig.dot}`} />
                            {sub.difficulty}
                          </span>
                        </div>

                        {/* Edit & Delete Action Buttons */}
                        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(sub)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors"
                            title="Edit Subject"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSubjectToDelete(sub)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title="Delete Subject"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subject Name */}
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {sub.name}
                      </h3>

                      {/* Department Tag */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium truncate">{sub.department || 'Computer Science'}</span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
                        {sub.description || 'Core academic syllabus covering foundational concepts and applied systems.'}
                      </p>

                      {/* Student Profile Connection (if enrolled or has rating) */}
                      {userSkill && (
                        <div className="mt-3.5 px-3 py-2 rounded-xl bg-primary-500/10 dark:bg-primary-500/15 border border-primary-500/20 flex items-center justify-between text-xs text-primary-700 dark:text-primary-300">
                          <span className="font-medium flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                            Your Skill Mastery
                          </span>
                          <span className="font-bold">{userSkill.rating}%</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Info Bar: Credits & Status */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 font-semibold text-slate-700 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {sub.credits || 3} Credits
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-primary-500" />
                        Peer Tutoring
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Stripe / Apple Data Table View */
        <GlassCard className="overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 font-mono">Code</th>
                  <th className="py-3.5 px-4">Subject Name</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Credits</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Overview</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {filteredSubjects.map((sub) => {
                  const diffConfig = DIFFICULTY_CONFIG[sub.difficulty] || DIFFICULTY_CONFIG.Intermediate;
                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                        <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                          {sub.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {sub.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {sub.department || 'Computer Science'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {sub.credits || 3} cr
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${diffConfig.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${diffConfig.dot}`} />
                          {sub.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate hidden md:table-cell">
                        {sub.description || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(sub)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSubjectToDelete(sub)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      ))}

      {/* Empty States */}
      {subjects.length === 0 ? (
        <GlassCard className="p-12 text-center border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-12 h-12 mx-auto mb-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
            No subjects added yet. Click Add Subject to create one.
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No subjects added yet. Click Add Subject to create one.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          </div>
        </GlassCard>
      ) : filteredSubjects.length === 0 ? (
        <GlassCard className="p-12 text-center border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-12 h-12 mx-auto mb-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
            No subjects match your query
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting or clearing your active filters to see all available academic subjects.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 rounded-xl bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Subject
            </button>
          </div>
        </GlassCard>
      ) : null}

      {/* ========================================================================= */}
      {/* 1 & 2 & 3. ADD / EDIT SUBJECT MODAL FORM (Apple + Stripe style) */}
      {/* ========================================================================= */}
      <Modal
        open={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        maxWidth="max-w-xl"
        title={editingSubject ? 'Edit Subject Details' : 'Add New Subject'}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <p className="text-xs text-slate-500 -mt-2">
            {editingSubject
              ? 'Update the course code, department, academic credits, or difficulty.'
              : 'Add a new subject to the university catalog and tutor matching system.'}
          </p>

          {/* Row 1: Code & Credits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Subject Code */}
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. CS201, AI402"
                className={`w-full px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border font-mono text-sm uppercase focus:outline-none transition-colors text-slate-900 dark:text-slate-100 ${
                  formErrors.code
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                }`}
              />
              {formErrors.code && (
                <p className="text-[11px] text-rose-500 font-medium">{formErrors.code}</p>
              )}
            </div>

            {/* Credits */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Credits <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((cr) => (
                  <option key={cr} value={cr} className="bg-white dark:bg-slate-900">
                    {cr} {cr === 1 ? 'Credit' : 'Credits'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Subject Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subject Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Distributed Operating Systems"
              className={`w-full px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border text-sm focus:outline-none transition-colors text-slate-900 dark:text-slate-100 ${
                formErrors.name
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
              }`}
            />
            {formErrors.name && (
              <p className="text-[11px] text-rose-500 font-medium">{formErrors.name}</p>
            )}
          </div>

          {/* Row 3: Department */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Academic Department <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                list="department-suggestions"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Select or enter academic department..."
                className={`w-full px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border text-sm focus:outline-none transition-colors text-slate-900 dark:text-slate-100 ${
                  formErrors.department
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                }`}
              />
              <datalist id="department-suggestions">
                {allDepartments.map((dept) => (
                  <option key={dept} value={dept} />
                ))}
              </datalist>
            </div>
            {formErrors.department && (
              <p className="text-[11px] text-rose-500 font-medium">{formErrors.department}</p>
            )}
          </div>

          {/* Row 4: Difficulty Level Segmented Selector (Apple Style) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => {
                const isSelected = formData.difficulty === diff;
                const config = DIFFICULTY_CONFIG[diff];
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: diff })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500/10 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                        {diff}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary-500" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 leading-tight">
                      {config.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Course Description / Syllabus */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description & Learning Objectives
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline the core topics, practical labs, and conceptual scope..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-900 dark:text-slate-100 resize-none placeholder-slate-400"
            />
          </div>

          {/* Live Preview Card */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Live Preview
            </p>
            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {formData.code.trim().toUpperCase() || 'CODE101'}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    DIFFICULTY_CONFIG[formData.difficulty]?.badge
                  }`}
                >
                  {formData.difficulty}
                </span>
              </div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">
                {formData.name.trim() || 'Subject Title'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                <span>{formData.department || 'Department'}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {formData.credits} Credits
                </span>
              </p>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold transition-all shadow-xs active:scale-[0.98] flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {editingSubject ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 4. DELETE CONFIRMATION POPUP (Modal) */}
      {/* ========================================================================= */}
      <Modal
        open={Boolean(subjectToDelete)}
        onClose={() => setSubjectToDelete(null)}
        maxWidth="max-w-md"
        title="Delete Subject Confirmation"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-800 dark:text-slate-200">
                Are you sure you want to delete{' '}
                <strong className="text-slate-900 dark:text-slate-50 font-bold">
                  "{subjectToDelete?.name}" ({subjectToDelete?.code})
                </strong>
                ?
              </p>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                This course will be removed from your catalog and tutor matching index.
                Any student preferences linked to this subject code will be unlinked.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setSubjectToDelete(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Course
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
