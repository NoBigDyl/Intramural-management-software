import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LeaguesPage from './pages/LeaguesPage';
import CreateLeaguePage from './pages/CreateLeaguePage';
import TeamsPage from './pages/TeamsPage';
import ImportPage from './pages/ImportPage';
import DuplicateLeaguePage from './pages/DuplicateLeaguePage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import StudentHomePage from './pages/StudentHomePage';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider, useAuth } from './context/AuthContext';

// Route guard for role-based access
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return null; // Or loading spinner
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

import ErrorBoundary from './components/ErrorBoundary';

// Home route switcher based on role
const HomeRoute = () => {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === 'director' ? <DashboardPage /> : (
    <ErrorBoundary>
      <StudentHomePage />
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/leagues" element={<LeaguesPage />} />
          <Route path="/leagues/create" element={<CreateLeaguePage />} />
          <Route path="/leagues/duplicate/:id" element={<DuplicateLeaguePage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;
