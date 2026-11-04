import EditProduct from '../components/Admin/EditProduct';
import { useAuth } from '../hooks/useAuth';

const AdminEditProductPage = () => {
    const { user, isAuthReady } = useAuth();

    if (!isAuthReady) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <div>Không có quyền truy cập</div>;

    return (
        <div className="min-h-screen bg-gray-100 pt-10">
            <EditProduct />
        </div>
    );
};

export default AdminEditProductPage;
