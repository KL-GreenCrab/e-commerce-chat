import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Order } from '../../types';
import { getOrderById } from '../../services/orderService';
import { formatCurrency } from '../../utils/format';

export const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }

            try {
                console.log('Fetching order details for ID:', id);
                const orderData = await getOrderById(id);
                console.log('Order data received:', orderData._id);
                setOrder(orderData);
            } catch (error) {
                console.error('Error fetching order:', error);
                // Có thể hiển thị thông báo lỗi cho người dùng ở đây
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Không tìm thấy đơn hàng</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Chi tiết đơn hàng #{order._id}</h2>
                    <p className="text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                    }`}>
                    {order.status === 'pending' ? 'Chờ xử lý' :
                        order.status === 'processing' ? 'Đang xử lý' :
                            order.status === 'cancelled' ? 'Đã hủy' :
                                'Đã hoàn thành'}
                </span>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {order.shippingAddress ? (
                            <>
                                <div>
                                    <p className="text-sm text-gray-500">Người nhận</p>
                                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    <p className="font-medium">{order.shippingAddress.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Địa chỉ</p>
                                    <p className="font-medium">{order.shippingAddress.address}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Thành phố</p>
                                    <p className="font-medium">{order.shippingAddress.city}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <p className="text-sm text-gray-500">Địa chỉ</p>
                                    <p className="font-medium">{order.address || 'Chưa cập nhật'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    <p className="font-medium">{order.phone || 'Chưa cập nhật'}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.productId} className="flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-gray-500">
                                        Số lượng: {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        {formatCurrency(item.price)} x {item.quantity}
                                    </p>
                                    <p className="font-medium">
                                        {formatCurrency(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">
                                Phương thức thanh toán: {
                                    order.paymentMethod === 'credit_card' ? 'Thẻ tín dụng' :
                                        order.paymentMethod === 'bank_transfer' ? 'Chuyển khoản ngân hàng' :
                                            'Thanh toán khi nhận hàng'
                                }
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Tổng tiền</p>
                            <p className="text-xl font-bold">
                                {formatCurrency(order.total)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;