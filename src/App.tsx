import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ReservationsProvider } from './contexts/ReservationsContext';
import { Toaster } from 'sonner';

// Pages
import LandingPage from './pages/LandingPage';
import FleetPage from './pages/FleetPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout & Routing
import { Navbar } from './components/layout/Navbar';
import { GlobalModals } from './components/layout/GlobalModals';
import { ProtectedRoute, AdminRoute } from './components/routing/ProtectedRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReservationsProvider>
        <div className="min-h-screen bg-black">
          <Navbar />
          <GlobalModals />
          <Toaster position="top-right" richColors theme="dark" />

          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/fleet" element={<FleetPage />} />

            {/* Rutas de Usuario Protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboardPage />} />
            </Route>

            {/* Rutas de Administrador Protegidas */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </div>
        </ReservationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
