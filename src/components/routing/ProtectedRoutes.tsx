import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Cargando...</div>;

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export function AdminRoute() {
    const { user, isAdmin, isLoading } = useAuth();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Cargando...</div>;

    if (!user || !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
