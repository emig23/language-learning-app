import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import LanguageSelect from './pages/LanguageSelect';
import Dashboard from './pages/Dashboard';
import Lesson from './pages/Lesson';
import Progress from './pages/Progress';
import Languages from './pages/Languages';
import Layout from './components/Layout';
import Vocab from './pages/Vocab';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Landing page — public */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />

      {/* Auth */}
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />

      {/* Post-register language select */}
      <Route path="/select-language" element={
        <ProtectedRoute><LanguageSelect /></ProtectedRoute>
      } />

      {/* App — protected, uses bottom nav layout */}
      <Route path="/" element={
        <ProtectedRoute><Layout /></ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="lesson/:id" element={<Lesson />} />
        <Route path="progress" element={<Progress />} />
        <Route path="languages" element={<Languages />} />
        <Route path="vocab" element={<Vocab />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}