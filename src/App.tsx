import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { DataProvider } from '@/context/DataContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MatchingPage } from '@/pages/MatchingPage';
import { SchedulerPage } from '@/pages/SchedulerPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { GamificationPage } from '@/pages/GamificationPage';
import { AssistantPage } from '@/pages/AssistantPage';
import { AdminPage } from '@/pages/AdminPage';
import { StudentsPage } from '@/pages/StudentsPage';
import { SubjectsPage } from '@/pages/SubjectsPage';
import { ProfilePage } from '@/pages/ProfilePage';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Dashboard Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/matching" element={<MatchingPage />} />
                  <Route path="/scheduler" element={<SchedulerPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/gamification" element={<GamificationPage />} />
                  <Route path="/assistant" element={<AssistantPage />} />
                  <Route path="/students" element={<StudentsPage />} />
                  <Route path="/subjects" element={<SubjectsPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Route>
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
