import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCart, removeFromCart, updateCartItemQuantity } from '../../services/cartService';
import { formatPrice } from '../../utils/format';
import { CartItem } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const CartPage: React.FC = () => {
    const { userId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            fetchCart(userId)
                .then(data => setCart(data.items || []))
                .finally(() => setLoading(false));
        }
    }, [userId]);

    const handleUpdateQuantity = async (productId: string, quantity: number) => {
        if (!userId) return;
        const data = await updateCartItemQuantity(userId, productId, quantity);
        setCart(data.items);
    };

    const handleRemoveItem = async (productId: string) => {
        if (!userId) return;
        const data = await removeFromCart(userId, productId);
        setCart(data.items);
    };

    const getTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (!user || !user._id) {
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Đang tải giỏ hàng...</div>;
    }

    if (cart.length === 0) {
        return <div className="container mx-auto px-4 py-8 text-center">Giỏ hàng trống</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                {cart.map(item => (
                    <div key={item.productId} className="p-4 flex items-center gap-4 border-b last:border-b-0">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                        <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-600">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} className="p-1 rounded-full hover:bg-gray-100">-</button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} className="p-1 rounded-full hover:bg-gray-100">+</button>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                            <button onClick={() => handleRemoveItem(item.productId)} className="text-red-500 hover:text-red-600 mt-2 text-sm">Xóa</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end">
                <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
                    <div className="flex justify-between mb-2">
                        <span>Tạm tính:</span>
                        <span>{formatPrice(getTotal())}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Phí vận chuyển:</span>
                        <span>Miễn phí</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Tổng cộng:</span>
                        <span>{formatPrice(getTotal())}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="mt-4 w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage; 