import { useEffect, useState } from 'react';
import { getOrders } from '../services/adminService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Order } from '../types';

const AdminOrderListPage = () => {
    const { user, isAuthReady } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthReady && user?.role === 'admin') {
            getOrders().then(setOrders).finally(() => setLoading(false));
        }
    }, [user, isAuthReady]);

    if (!isAuthReady) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <div>Không có quyền truy cập</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Danh sách đơn hàng</h2>
            {loading ? <div>Loading...</div> : (
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Khách hàng</th>
                            <th className="border px-4 py-2">Tổng tiền</th>
                            <th className="border px-4 py-2">Trạng thái</th>
                            <th className="border px-4 py-2">Phương thức thanh toán</th>
                            <th className="border px-4 py-2">Số sản phẩm</th>
                            <th className="border px-4 py-2">Ngày tạo</th>
                            <th className="border px-4 py-2">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td className="border px-4 py-2">{order._id}</td>
                                <td className="border px-4 py-2">{order.shippingAddress?.fullName || order.userId?.name || 'N/A'}</td>
                                <td className="border px-4 py-2">{order.total?.toLocaleString('vi-VN')}đ</td>
                                <td className="border px-4 py-2">{order.status}</td>
                                <td className="border px-4 py-2">{order.paymentMethod}</td>
                                <td className="border px-4 py-2">{order.items?.length || 0}</td>
                                <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className="text-indigo-600 hover:underline"
                                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                                    >
                                        Xem
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminOrderListPage; 