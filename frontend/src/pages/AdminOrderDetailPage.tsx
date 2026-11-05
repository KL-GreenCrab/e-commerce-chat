import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getOrderById, updateOrder } from '../services/adminService';
import { Order, OrderItem } from '../types';

const AdminOrderDetailPage = () => {
    const { id } = useParams();
    const { user, isAuthReady } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState<Partial<Order> & Record<string, string | number | undefined>>({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            if (isAuthReady && user?.role === 'admin' && id) {
                try {
                    setLoading(true);
                    const orderData = await getOrderById(id);
                    setOrder(orderData);
                    setEditData(orderData);
                } catch (error) {
                    console.error('Error fetching order:', error);
                    toast.error('Không thể tải thông tin đơn hàng');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrder();
    }, [id, user, isAuthReady]);

    if (!isAuthReady) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <div>Không có quyền truy cập</div>;
    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Không tìm thấy đơn hàng</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditData((prev: Partial<Order> & Record<string, string | number | undefined>) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            if (!window.confirm('Bạn có chắc chắn muốn cập nhật đơn hàng này?')) {
                return;
            }

            if (editData.total && Number(editData.total) < 0) {
                toast.error('Tổng tiền không thể âm');
                return;
            }

            const orderData = {
                ...editData,
                total: editData.total ? Number(editData.total) : 0
            };

            await updateOrder(id!, orderData);
            toast.success('Cập nhật đơn hàng thành công!');
            navigate('/admin/orders');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Lỗi không xác định';
            toast.error(`Có lỗi khi cập nhật đơn hàng: ${message}`);
            console.error('Error updating order:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Chi tiết đơn hàng #{order._id}</h2>

            {/* Thông tin khách hàng */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Họ và tên</p>
                        <p className="font-medium">{order.shippingAddress.fullName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Số điện thoại</p>
                        <p className="font-medium">{order.shippingAddress.phone}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                </div>
            </div>

            {/* Địa chỉ giao hàng */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h3>
                <div className="space-y-2">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p className="text-gray-600">{order.shippingAddress.address}</p>
                    <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p className="text-gray-600">Mã bưu điện: {order.shippingAddress.zipCode}</p>
                    <p className="text-gray-600">Số điện thoại: {order.shippingAddress.phone}</p>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Sản phẩm đã đặt</h3>
                <div className="space-y-4">
                    {order.items.map((item: OrderItem, index: number) => (
                        <div key={index} className="flex items-center space-x-4 border-b pb-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-gray-600">Số lượng: {item.quantity}</p>
                                <p className="text-gray-600">Giá: {item.price.toLocaleString('vi-VN')}đ</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">
                                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Tổng tiền:</span>
                        <span className="text-xl font-bold text-indigo-600">
                            {order.total.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                </div>
            </div>

            {/* Thông tin thanh toán và trạng thái */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Thông tin thanh toán</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trạng thái đơn hàng</label>
                        <select
                            name="status"
                            value={editData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="pending">Chờ xử lý</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="shipping">Đang giao hàng</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                        <p className="mt-1 font-medium">
                            {order.paymentMethod === 'credit_card' ? 'Thẻ tín dụng' :
                                order.paymentMethod === 'bank_transfer' ? 'Chuyển khoản ngân hàng' :
                                    order.paymentMethod === 'cash_on_delivery' ? 'Thanh toán khi nhận hàng' :
                                        order.paymentMethod}
                        </p>
                    </div>
                </div>
            </div>

            {/* Ghi chú đơn hàng */}
            {order.note && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-2">Ghi chú đơn hàng</h3>
                    <p className="text-gray-600">{order.note}</p>
                </div>
            )}

            {/* Nút điều khiển */}
            <div className="flex gap-4 mt-6">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Lưu thay đổi
                </button>
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default AdminOrderDetailPage;