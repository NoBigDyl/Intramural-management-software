import React, { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LeaguesPage from './pages/LeaguesPage';
import CreateLeaguePage from './pages/CreateLeaguePage';
import EditLeaguePage from './pages/EditLeaguePage';
import LeagueDetailsPage from './pages/LeagueDetailsPage';
import LeagueSchedulePage from './pages/LeagueSchedulePage';
import LeagueTeamsPage from './pages/LeagueTeamsPage';
import TeamsPage from './pages/TeamsPage';
import ImportPage from './pages/ImportPage';
import DuplicateLeaguePage from './pages/DuplicateLeaguePage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import StudentHomePage from './pages/StudentHomePage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ResourcesPage from './pages/ResourcesPage';
import SearchPage from './pages/SearchPage';
import ErrorBoundary from './components/ErrorBoundary';
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

// Home route switcher based on role
const HomeRoute = () => {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === 'director' ? <DashboardPage /> : <StudentHomePage />;
};

const App = () => {
  useEffect(() => {
    async function testInsert() {
      const { data, error } = await supabase
        .from('players')
        .insert([{ name: 'Dylan' }])

      console.log('INSERT DATA:', data)
      console.log('INSERT ERROR:', error)
    }

    testInsert()
  }, [])

  return (
    <AuthProvider>
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['director']}>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute allowedRoles={['director']}>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/leagues" element={<LeaguesPage />} />
            <Route path="/leagues/create" element={<CreateLeaguePage />} />
            <Route path="/leagues/edit/:id" element={
              <ProtectedRoute allowedRoles={['director']}>
                <EditLeaguePage />
              </ProtectedRoute>
            } />
            <Route path="/leagues/:id" element={<LeagueDetailsPage />} />
            <Route path="/leagues/:id/schedule" element={<LeagueSchedulePage />} />
            <Route path="/leagues/:id/teams" element={<LeagueTeamsPage />} />
            <Route path="/leagues/duplicate/:id" element={<DuplicateLeaguePage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;
