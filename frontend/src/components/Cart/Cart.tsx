import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, X } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../hooks/useCart';
import { Checkout } from '../Checkout/Checkout';
import { useState } from 'react';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
    const { cartItems, loading, updateQuantity, remove, getTotal, isEmpty: isCartEmpty } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);

    if (!isOpen) return null;

    const isEmpty = isCartEmpty();

    const handleUpdateQuantity = (productId: string, currentQuantity: number, action: 'increment' | 'decrement') => {
        if (action === 'decrement' && currentQuantity <= 1) {
            remove(productId);
            return;
        }

        const newQuantity = action === 'increment' ? currentQuantity + 1 : currentQuantity - 1;
        updateQuantity(productId, newQuantity);
    };

    const handleRemoveItem = (productId: string) => {
        remove(productId);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">Giỏ hàng</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : isEmpty ? (
                            <div className="text-center py-8">
                                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500">Giỏ hàng trống</p>
                                <Link
                                    to="/"
                                    className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    onClick={onClose}
                                >
                                    Tiếp tục mua sắm
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.productId} className="p-4 flex items-center gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {formatPrice(item.price)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.productId, item.quantity, 'decrement')}
                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.productId, item.quantity, 'increment')}
                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="font-semibold">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                            <button
                                                onClick={() => handleRemoveItem(item.productId)}
                                                className="text-red-500 hover:text-red-600 mt-2 flex items-center gap-1"
                                                title="Xóa sản phẩm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="text-sm">Xóa</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {!isEmpty && (
                        <div className="border-t p-4">
                            <div className="flex justify-between mb-4">
                                <span className="font-medium">Tổng cộng:</span>
                                <span className="font-semibold">{formatPrice(getTotal())}</span>
                            </div>
                            <button
                                onClick={() => setShowCheckout(true)}
                                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
                            >
                                Thanh toán
                            </button>
                        </div>
                    )}
                </div>

                {showCheckout && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
                            <button
                                onClick={() => setShowCheckout(false)}
                                className="absolute top-2 right-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <Checkout
                                cartItems={cartItems}
                                total={getTotal()}
                                onPlaceOrder={async () => { setShowCheckout(false); }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};