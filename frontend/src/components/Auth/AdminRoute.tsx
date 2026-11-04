import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export default AdminRoute; 