import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import OrderDetail from '../components/Orders/OrderDetail';
import { toast } from 'react-hot-toast';

const OrderDetailPage: React.FC = () => {
    const { id } = useParams();
    const { user, isAuthReady } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (isAuthReady && !user) {
            toast.error('Vui lòng đăng nhập để xem đơn hàng');
            navigate('/login');
        }

        // Nếu không có ID đơn hàng, chuyển hướng về trang danh sách đơn hàng
        if (!id) {
            navigate('/profile/orders');
        }

        setLoading(false);
    }, [id, user, isAuthReady, navigate]);

    if (!isAuthReady || loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
                <div className="text-center">
                    <p className="text-lg text-gray-600 mb-4">Vui lòng đăng nhập để xem đơn hàng</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Xem thông tin chi tiết về đơn hàng của bạn
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/profile/orders')}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Quay lại danh sách
                    </button>
                </div>
                <OrderDetail />
            </div>
        </div>
    );
};

export default OrderDetailPage;