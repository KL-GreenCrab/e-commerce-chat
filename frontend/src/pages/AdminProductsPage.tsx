import ProductList from '../components/Admin/ProductList';
import { useAuth } from '../hooks/useAuth';

const AdminProductsPage = () => {
    const { user, isAuthReady } = useAuth();

    if (!isAuthReady) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <div>Không có quyền truy cập</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProductList />
        </div>
    );
};

export default AdminProductsPage;
