import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import Landing from './pages/landing';
import Auth from './pages/auth';
import LanguageSelect from './pages/languageSelect';
import Dashboard from './pages/dashboard';
import Lesson from './pages/lesson';
import Progress from './pages/progress';
import Languages from './pages/languages';
import Layout from './components/layout';
import Vocab from './pages/vocab';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />

      {/* Auth */}
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />

      {/* Post-register language select */}
      <Route path="/select-language" element={
        <ProtectedRoute><LanguageSelect /></ProtectedRoute>
      } />

      {/* App */}
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