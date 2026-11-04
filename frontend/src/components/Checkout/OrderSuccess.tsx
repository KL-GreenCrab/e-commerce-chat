import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                </div>

                <h1 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h1>

                <p className="text-gray-600 mb-8">
                    Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
                </p>

                <div className="space-y-4">
                    {orderId && (
                        <Link
                            to={`/orders/${orderId}`}
                            className="inline-block bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Xem chi tiết đơn hàng
                        </Link>
                    )}

                    <Link
                        to="/profile/orders"
                        className="inline-block bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Xem tất cả đơn hàng
                    </Link>

                    <div>
                        <Link
                            to="/"
                            className="text-red-600 hover:text-red-700"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}; 