import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Lazy loading - ngarkon faqet vetem kur nevoiten
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Kategorite = lazy(() => import('./pages/Kategorite'));
const Produktet = lazy(() => import('./pages/Produktet'));
const Porosite = lazy(() => import('./pages/Porosite'));
const Klientet = lazy(() => import('./pages/Klientet'));
const Punonjesit = lazy(() => import('./pages/Punonjesit'));
const Dergesat = lazy(() => import('./pages/Dergesat'));
const Menyte = lazy(() => import('./pages/Menyte'));
const Kuponat = lazy(() => import('./pages/Kuponat'));
const Vleresimet = lazy(() => import('./pages/Vleresimet'));
const Users = lazy(() => import('./pages/Users'));
const Roles = lazy(() => import('./pages/Roles'));

// Loading spinner
const Loading = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="text-center">
      <div className="spinner-border text-danger mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Duke u ngarkuar...</span>
      </div>
      <p className="text-muted">Duke u ngarkuar...</p>
    </div>
  </div>
);

// Komponenti qe mbron rutat private
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? children : <Navigate to="/login" />;
};

// Komponenti kryesor
const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navbar />}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/kategorite" element={<PrivateRoute><Kategorite /></PrivateRoute>} />
          <Route path="/produktet" element={<PrivateRoute><Produktet /></PrivateRoute>} />
          <Route path="/porosite" element={<PrivateRoute><Porosite /></PrivateRoute>} />
          <Route path="/klientet" element={<PrivateRoute><Klientet /></PrivateRoute>} />
          <Route path="/punonjesit" element={<PrivateRoute><Punonjesit /></PrivateRoute>} />
          <Route path="/dergesat" element={<PrivateRoute><Dergesat /></PrivateRoute>} />
          <Route path="/menyte" element={<PrivateRoute><Menyte /></PrivateRoute>} />
          <Route path="/kuponat" element={<PrivateRoute><Kuponat /></PrivateRoute>} />
          <Route path="/vleresimet" element={<PrivateRoute><Vleresimet /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
          <Route path="/roles" element={<PrivateRoute><Roles /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;