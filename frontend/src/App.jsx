import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import Footer from './components/Footer';

// Lazy loading
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const KlientDashboard = lazy(() => import('./pages/KlientDashboard'));
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
const NotFound = lazy(() => import('./pages/NotFound'));
const Perberesit = lazy(() => import('./pages/Perberesit'));
const ProduktPerberesit = lazy(() => import('./pages/ProduktPerberesit'));
const Adresat = lazy(() => import('./pages/Adresat'));
const Raportet = lazy(() => import('./pages/Raportet'));

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

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  if (!user.roles?.includes('admin') && !user.roles?.includes('menaxher')) {
    return <Navigate to="/klient" />;
  }
  return children;
};

const AdminOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  if (!user.roles?.includes('admin')) {
    if (user.roles?.includes('menaxher')) {
      return (
        <div className="container mt-5 text-center">
          <h3 className="text-danger">Qasja e Refuzuar!</h3>
          <p className="text-muted">Vetem administratori ka qasje ketu.</p>
        </div>
      );
    }
    return <Navigate to="/klient" />;
  }
  return children;
};

const getRedirectPath = (user) => {
  if (!user) return '/login';
  if (user.roles?.includes('admin') || user.roles?.includes('menaxher')) return '/dashboard';
  return '/klient';
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navbar />}
      <div className="main-content">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to={getRedirectPath(user)} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={getRedirectPath(user)} />} />

            {/* Paneli i klientit */}
            <Route path="/klient" element={<PrivateRoute><KlientDashboard /></PrivateRoute>} />

            {/* Admin/Menaxher rutat */}
            <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/kategorite" element={<AdminRoute><Kategorite /></AdminRoute>} />
            <Route path="/produktet" element={<AdminRoute><Produktet /></AdminRoute>} />
            <Route path="/porosite" element={<AdminRoute><Porosite /></AdminRoute>} />
            <Route path="/klientet" element={<AdminRoute><Klientet /></AdminRoute>} />
            <Route path="/punonjesit" element={<AdminRoute><Punonjesit /></AdminRoute>} />
            <Route path="/dergesat" element={<AdminRoute><Dergesat /></AdminRoute>} />
            <Route path="/menyte" element={<AdminRoute><Menyte /></AdminRoute>} />
            <Route path="/kuponat" element={<AdminRoute><Kuponat /></AdminRoute>} />
            <Route path="/vleresimet" element={<AdminRoute><Vleresimet /></AdminRoute>} />
            <Route path="/perberesit" element={<AdminRoute><Perberesit /></AdminRoute>} />
            <Route path="/produkt-perberesit" element={<AdminRoute><ProduktPerberesit /></AdminRoute>} />
            <Route path="/adresat" element={<AdminRoute><Adresat /></AdminRoute>} />
            <Route path="/raportet" element={<AdminRoute><Raportet /></AdminRoute>} />
            <Route path="/users" element={<AdminOnlyRoute><Users /></AdminOnlyRoute>} />
            <Route path="/roles" element={<AdminOnlyRoute><Roles /></AdminOnlyRoute>} />

            <Route path="/" element={<Navigate to={getRedirectPath(user)} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      {user && <Footer />}
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