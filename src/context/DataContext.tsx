import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  Session,
  Notification,
  Student,
  Subject,
  UserAccount,
  SignupInput,
  ActivityItem,
} from '../types';
import {
  sessions as initialSessions,
  notifications as initialNotifications,
  currentUser as defaultCurrentUser,
  initialActivities,
} from '../data/mockData';
import { loadState, saveState } from '../lib/storage';
import { useToast } from './ToastContext';

interface AuthResponse {
  success: boolean;
  error?: string;
  user?: Student;
}

interface DataContext {
  currentUser: Student;
  isAuthenticated: boolean;
  login: (email: string, password: string) => AuthResponse;
  signup: (data: SignupInput) => AuthResponse;
  logout: () => void;
  updateCurrentUser: (updated: Partial<Student> | Student, isProfileEdit?: boolean) => void;
  sessions: Session[];
  notifications: Notification[];
  addSession: (s: Session) => void;
  createSession: (s: Omit<Session, 'id' | 'status'> & { id?: string; status?: Session['status'] }) => Session;
  completeSession: (sessionId: string) => void;
  cancelSession: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  students: Student[];
  addStudent: (s: Student) => void;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;
  subjects: Subject[];
  addSubject: (s: Subject) => void;
  updateSubject: (s: Subject) => void;
  deleteSubject: (id: string) => void;
  activities: ActivityItem[];
  logActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  recordMatchAccepted: (tutorName: string, subject: string) => void;
  resetSampleData: () => void;
}

const Ctx = createContext<DataContext | null>(null);

const CURRENT_USER_KEY = 'currentUser';
const USERS_KEY = 'ss_users';
const STUDENTS_KEY = 'ss_students';
const SUBJECTS_KEY = 'ss_subjects';
const SESSIONS_KEY = 'ss_sessions';
const NOTIFICATIONS_KEY = 'ss_notifications';
const ACTIVITIES_KEY = 'ss_activities';

const initialDemoUser: UserAccount = {
  ...defaultCurrentUser,
  password: 'password123',
  createdAt: '2026-01-15T00:00:00.000Z',
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { notify } = useToast();

  // Stored registered users in localStorage
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const stored = loadState<UserAccount[]>(USERS_KEY, []);
    if (stored && stored.length > 0) return stored;
    return [initialDemoUser];
  });

  // Current authenticated user
  const [currentUser, setCurrentUser] = useState<Student>(() => {
    const stored = loadState<Student | null>(CURRENT_USER_KEY, null);
    if (stored && stored.id && stored.email) {
      return {
        ...defaultCurrentUser,
        ...stored,
        skills: Array.isArray(stored.skills) && stored.skills.length > 0 ? stored.skills : defaultCurrentUser.skills,
        availability: Array.isArray(stored.availability) ? stored.availability : defaultCurrentUser.availability,
        strengths: Array.isArray(stored.strengths) ? stored.strengths : defaultCurrentUser.strengths,
        weaknesses: Array.isArray(stored.weaknesses) ? stored.weaknesses : defaultCurrentUser.weaknesses,
        weakSubjects: Array.isArray(stored.weakSubjects) ? stored.weakSubjects : defaultCurrentUser.weakSubjects,
        learningPreferences: Array.isArray(stored.learningPreferences) ? stored.learningPreferences : defaultCurrentUser.learningPreferences,
      };
    }
    return defaultCurrentUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const stored = loadState<Student | null>(CURRENT_USER_KEY, null);
    return Boolean(stored && stored.email);
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    return loadState<Session[]>(SESSIONS_KEY, initialSessions);
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    return loadState<Notification[]>(NOTIFICATIONS_KEY, initialNotifications);
  });

  const PURGE_MOCK_DATA_KEY = 'ss_mock_data_purged_v3';

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const purged = localStorage.getItem(PURGE_MOCK_DATA_KEY);
        if (!purged) {
          localStorage.setItem(PURGE_MOCK_DATA_KEY, 'true');
          const stored = loadState<Student[]>(STUDENTS_KEY, []);
          // Purge legacy demo students
          const cleaned = Array.isArray(stored)
            ? stored.filter((s) => !s.id.match(/^stu-00[2-9]$/) && s.name !== 'Diya Patel' && s.name !== 'Yash Kumar')
            : [];
          saveState(STUDENTS_KEY, cleaned);
          return cleaned;
        }
      }
      const stored = loadState<Student[]>(STUDENTS_KEY, []);
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const purged = localStorage.getItem(PURGE_MOCK_DATA_KEY);
        if (!purged) {
          const stored = loadState<Subject[]>(SUBJECTS_KEY, []);
          // Purge legacy demo subjects
          const cleaned = Array.isArray(stored)
            ? stored.filter((s) => !s.id.match(/^sub-0[0-9]{2}$/))
            : [];
          saveState(SUBJECTS_KEY, cleaned);
          return cleaned;
        }
      }
      const stored = loadState<Subject[]>(SUBJECTS_KEY, []);
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const stored = loadState<ActivityItem[]>(ACTIVITIES_KEY, []);
    if (stored && stored.length > 0) return stored;
    return initialActivities;
  });

  // Persist state changes
  useEffect(() => {
    saveState(USERS_KEY, users);
  }, [users]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      saveState(CURRENT_USER_KEY, currentUser);
    } else {
      try {
        localStorage.removeItem(CURRENT_USER_KEY);
      } catch (e) {
        console.error(e);
      }
    }
  }, [currentUser, isAuthenticated]);

  useEffect(() => { saveState(STUDENTS_KEY, students); }, [students]);
  useEffect(() => { saveState(SUBJECTS_KEY, subjects); }, [subjects]);
  useEffect(() => { saveState(SESSIONS_KEY, sessions); }, [sessions]);
  useEffect(() => { saveState(NOTIFICATIONS_KEY, notifications); }, [notifications]);
  useEffect(() => { saveState(ACTIVITIES_KEY, activities); }, [activities]);

  // Activity logger helper
  const logActivity = (act: Omit<ActivityItem, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => {
    const newActivity: ActivityItem = {
      id: act.id || `act-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      type: act.type,
      title: act.title,
      description: act.description,
      timestamp: act.timestamp || new Date().toISOString(),
      userName: act.userName,
      userAvatar: act.userAvatar,
      target: act.target,
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Login handler
  const login = (email: string, pass: string): AuthResponse => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    const matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matchedUser) {
      return {
        success: false,
        error: 'No account found with this email. Please check your spelling or sign up.',
      };
    }

    if (matchedUser.password && matchedUser.password !== cleanPass) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials and try again.',
      };
    }

    const activeStudent: Student = {
      ...defaultCurrentUser,
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      department: matchedUser.department,
      year: matchedUser.year,
      avatar: matchedUser.avatar,
      rollNumber: matchedUser.rollNumber,
      bio: matchedUser.bio,
      skills: matchedUser.skills ?? defaultCurrentUser.skills,
      weakSubjects: matchedUser.weakSubjects ?? defaultCurrentUser.weakSubjects,
      availability: matchedUser.availability ?? defaultCurrentUser.availability,
      rating: matchedUser.rating ?? defaultCurrentUser.rating,
      role: matchedUser.role ?? defaultCurrentUser.role,
    };

    setCurrentUser(activeStudent);
    setIsAuthenticated(true);
    saveState(CURRENT_USER_KEY, activeStudent);

    return { success: true, user: activeStudent };
  };

  // Signup handler with duplicate email prevention
  const signup = (data: SignupInput): AuthResponse => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim();
    const cleanPass = data.password.trim();

    if (!cleanName) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please log in instead.',
      };
    }

    const newId = `stu-${Date.now().toString(36)}`;
    const avatarUrl =
      data.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}&backgroundType=gradientLinear&backgroundColor=3366ff,06b6d4`;

    const newUser: UserAccount = {
      id: newId,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      rollNumber: data.rollNumber?.trim() || `CS23B${Math.floor(100 + Math.random() * 900)}`,
      avatar: avatarUrl,
      department: data.department || 'Computer Science & Engineering',
      year: Number(data.year) || 1,
      bio: data.bio?.trim() || `Student passionate about ${data.department || 'technology'} and collaborative learning.`,
      strengths: ['Problem Solving', 'Data Structures', 'Team Collaboration'],
      weaknesses: ['Machine Learning', 'Databases'],
      skills: [
        { subject: 'Data Structures', rating: 70 },
        { subject: 'Algorithms', rating: 65 },
        { subject: 'Web Development', rating: 75 },
        { subject: 'Databases', rating: 50 },
        { subject: 'Machine Learning', rating: 40 },
        { subject: 'Operating Systems', rating: 50 },
      ],
      weakSubjects: ['Machine Learning', 'Databases'],
      learningPreferences: ['Visual learning', 'Interactive coding', 'Small groups'],
      availability: [
        { day: 'Mon', start: '16:00', end: '19:00' },
        { day: 'Wed', start: '16:00', end: '19:00' },
        { day: 'Fri', start: '14:00', end: '17:00' },
      ],
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveState(USERS_KEY, updatedUsers);

    const studentData: Student = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      department: newUser.department,
      year: newUser.year,
      avatar: newUser.avatar,
      rollNumber: newUser.rollNumber,
      bio: newUser.bio,
      skills: newUser.skills,
      weakSubjects: newUser.weakSubjects,
      strengths: newUser.strengths,
      weaknesses: newUser.weaknesses,
      learningPreferences: newUser.learningPreferences,
      availability: newUser.availability,
      rating: newUser.rating,
      role: newUser.role,
    };
    setStudents((prev) => [studentData, ...prev]);

    setCurrentUser(studentData);
    setIsAuthenticated(true);
    saveState(CURRENT_USER_KEY, studentData);

    logActivity({
      type: 'signup',
      title: 'New Student Signup',
      description: `${cleanName} registered from ${data.department} (Year ${data.year || 1})`,
      userName: cleanName,
      userAvatar: avatarUrl,
      target: data.department,
    });

    return { success: true, user: studentData };
  };

  // Logout handler
  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Update current user & sync to storage
  const updateCurrentUser = (updated: Partial<Student> | Student, isProfileEdit = false) => {
    setCurrentUser((prev) => {
      const next = { ...prev, ...updated };
      saveState(CURRENT_USER_KEY, next);

      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u.id === prev.id || u.email.toLowerCase() === prev.email.toLowerCase()) {
            return { ...u, ...updated };
          }
          return u;
        })
      );

      setStudents((prevStudents) =>
        prevStudents.map((s) => (s.id === prev.id ? { ...s, ...updated } : s))
      );

      return next;
    });

    if (isProfileEdit) {
      notify('Profile updated successfully', 'success');
    }

    logActivity({
      type: 'profile_update',
      title: 'Profile Updated',
      description: `${(updated as Student).name || currentUser.name} updated skills and learning preferences`,
      userName: (updated as Student).name || currentUser.name,
      userAvatar: currentUser.avatar,
      target: 'Profile & Skills',
    });
  };

  const completeSession = (sessionId: string) => {
    const targetSession = sessions.find((s) => s.id === sessionId);
    if (!targetSession) return;
    if (targetSession.status === 'completed') {
      notify('This session is already marked as completed.', 'info');
      return;
    }

    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'completed' as const } : s))
    );

    notify('Session marked as completed!', 'success');

    logActivity({
      type: 'session_booked',
      title: 'Session Completed',
      description: `${currentUser.name} completed "${targetSession.subject}" session with ${targetSession.tutorName}`,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      target: targetSession.subject,
    });
  };

  const addSession = (s: Session) => {
    setSessions((prev) => [s, ...prev]);
    logActivity({
      type: 'session_booked',
      title: 'Session Scheduled',
      description: `${s.studentName} booked "${s.subject}" session with ${s.tutorName}`,
      userName: s.studentName,
      target: s.subject,
    });
  };

  const createSession = (s: Omit<Session, 'id' | 'status'> & { id?: string; status?: Session['status'] }): Session => {
    const newSession: Session = {
      id: s.id || `ses-${Date.now().toString(36)}`,
      status: s.status || 'scheduled',
      studentId: s.studentId,
      studentName: s.studentName,
      tutorId: s.tutorId,
      tutorName: s.tutorName,
      subject: s.subject,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      mode: s.mode,
      topic: s.topic,
    };
    addSession(newSession);
    return newSession;
  };

  const cancelSession = (id: string) =>
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'cancelled' } : s)));
  const markNotificationRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const addStudent = (s: Student) => {
    setStudents((prev) => [...prev, s]);
    logActivity({
      type: 'signup',
      title: 'Student Registered',
      description: `${s.name} (${s.department}) joined the platform`,
      userName: s.name,
      userAvatar: s.avatar,
      target: s.department,
    });
  };

  const updateStudent = (s: Student) => setStudents((prev) => prev.map((x) => (x.id === s.id ? s : x)));
  const deleteStudent = (id: string) => setStudents((prev) => prev.filter((x) => x.id !== id));

  const addSubject = (s: Subject) => {
    setSubjects((prev) => [...prev, s]);
    logActivity({
      type: 'subject_added',
      title: 'New Subject Added',
      description: `Course "${s.name}" (${s.code}) was added to catalog`,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      target: s.code,
    });
  };

  const updateSubject = (s: Subject) => {
    setSubjects((prev) => prev.map((x) => (x.id === s.id ? s : x)));
    logActivity({
      type: 'subject_added',
      title: 'Subject Updated',
      description: `Course "${s.name}" (${s.code}) details updated`,
      target: s.code,
    });
  };

  const deleteSubject = (id: string) => {
    const target = subjects.find((s) => s.id === id);
    setSubjects((prev) => prev.filter((x) => x.id !== id));
    if (target) {
      logActivity({
        type: 'session_cancelled',
        title: 'Subject Deleted',
        description: `Course "${target.name}" (${target.code}) was removed`,
        target: target.code,
      });
    }
  };

  const recordMatchAccepted = (tutorName: string, subject: string) => {
    logActivity({
      type: 'match_found',
      title: 'Match Accepted',
      description: `${currentUser.name} accepted AI tutor match with ${tutorName} for ${subject}`,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      target: tutorName,
    });
  };

  const resetSampleData = () => {
    const cleanUser = {
      ...defaultCurrentUser,
    };
    setCurrentUser(cleanUser);
    saveState(CURRENT_USER_KEY, cleanUser);
    setStudents([]);
    setSubjects([]);
    saveState(STUDENTS_KEY, []);
    saveState(SUBJECTS_KEY, []);
    setSessions(initialSessions);
    setNotifications(initialNotifications);
    setUsers([initialDemoUser]);
    saveState(USERS_KEY, [initialDemoUser]);
    setActivities(initialActivities);
    saveState(ACTIVITIES_KEY, initialActivities);
    notify('Database initialized with empty students and subjects.', 'info');
  };

  return (
    <Ctx.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        signup,
        logout,
        updateCurrentUser,
        sessions,
        notifications,
        addSession,
        createSession,
        completeSession,
        cancelSession,
        markNotificationRead,
        markAllRead,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        activities,
        logActivity,
        recordMatchAccepted,
        resetSampleData,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
