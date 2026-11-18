import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../Context/AuthContext';

export default function ProtectedRoute({
    children,
    adminOnly = false,
    customerOnly = false,
}) {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    // Jika belum login, arahkan ke halaman login
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // Jika bukan admin, larang akses halaman admin
    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    if (customerOnly && isAdmin) {
        return <Navigate to="/admin/books" replace />;
    }

    return children;
}
