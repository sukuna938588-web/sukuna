import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { MatchingPage } from './pages/MatchingPage';
import { SchedulerPage } from './pages/SchedulerPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AssistantPage } from './pages/AssistantPage';
import { AdminPage } from './pages/AdminPage';
import { StudentsPage } from './pages/StudentsPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { ProfilePage } from './pages/ProfilePage';

import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DataProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <OfflineIndicator />
              <PWAInstallBanner />
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
          </ErrorBoundary>
        </DataProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
