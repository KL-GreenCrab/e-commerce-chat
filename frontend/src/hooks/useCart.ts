import { useState, useEffect } from 'react';
import { CartItem } from '../types';
import * as cartService from '../services/cartService';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

// Validate MongoDB ObjectId format
const isValidObjectId = (id: string): boolean => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
};

export const useCart = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Hàm fetch dữ liệu giỏ hàng từ backend
    const fetchCart = async () => {
        if (!user?._id) {
            console.log('No user ID available, cannot fetch cart');
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Check if user._id is a valid MongoDB ObjectId
            if (!isValidObjectId(user._id)) {
                console.error('Invalid user ID format in useCart:', user._id);
                setCartItems([]);
                return;
            }

            console.log('Fetching cart for user:', user._id);
            const cart = await cartService.fetchCart(user._id);

            if (cart && Array.isArray(cart.items)) {
                console.log('Fetched cart items:', cart.items);
                setCartItems(cart.items);
            } else {
                console.log('No cart items found');
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user?._id]);

    useEffect(() => {
        console.log('Cart items updated:', cartItems);
    }, [cartItems]);

    const add = async (item: CartItem) => {
        if (!user?._id) return;
        if (!isValidObjectId(user._id)) {
            console.error('Invalid user ID format in add:', user._id);
            toast.error('Could not add item to cart. Please try logging in again.');
            return;
        }

        try {
            await cartService.addToCart(user._id, item);
            await fetchCart();
            toast.success('Item added to cart');
        } catch (error) {
            console.error('Error adding item to cart:', error);
            toast.error('Could not add item to cart. Please try again.');
        }
    };

    const clear = async () => {
        if (!user?._id) return;
        if (!isValidObjectId(user._id)) {
            setCartItems([]);
            return;
        }

        try {
            await cartService.clearCart(user._id);
            setCartItems([]);
            console.log('Cart cleared');
        } catch (error) {
            console.error('Error clearing cart:', error);
            // Even if there's an error with the API, still clear the local cart
            setCartItems([]);
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (!user?._id) return;
        try {
            // Tìm sản phẩm hiện tại trong giỏ hàng
            const currentItem = cartItems.find(item => item.productId === productId);
            if (!currentItem) {
                throw new Error('Item not found in cart');
            }

            // Cập nhật số lượng mới
            await cartService.updateCartItemQuantity(user._id, productId, quantity);
            await fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Could not update quantity');
        }
    };

    const remove = async (productId: string) => {
        if (!user?._id) return;
        try {
            await cartService.removeFromCart(user._id, productId);
            await fetchCart();
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Could not remove item');
        }
    };

    return {
        cartItems,
        loading,
        add,
        clear,
        updateQuantity,
        remove,
        fetchCart,
        isEmpty: () => cartItems.length === 0,
        getTotal: () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    };
};