import api from './api';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (userId: string, item: { productId: string, name: string, price: number, image: string, quantity: number }) => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }

    try {
        const { data } = await api.post(`/cart/${userId}`, item);
        return data;
    } catch (error: unknown) {
        const response = error as { response?: { data?: { message?: string } } };
        throw new Error(response.response?.data?.message || 'Failed to add item to cart');
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = async (userId: string, productId: string, quantity: number) => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }

    if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
    }

    try {
        const { data } = await api.put(`/cart/${userId}/${productId}`, { quantity });
        return data;
    } catch (error: unknown) {
        const response = error as { response?: { data?: { message?: string } } };
        throw new Error(response.response?.data?.message || 'Failed to update cart quantity');
    }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (userId: string, productId: string) => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }

    try {
        const { data } = await api.delete(`/cart/${userId}/${productId}`);
        return data;
    } catch (error: unknown) {
        const response = error as { response?: { data?: { message?: string } } };
        throw new Error(response.response?.data?.message || 'Failed to remove item from cart');
    }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (userId: string) => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }

    try {
        const { data } = await api.delete(`/cart/${userId}`);
        return data;
    } catch (error: unknown) {
        const response = error as { response?: { data?: { message?: string } } };
        throw new Error(response.response?.data?.message || 'Failed to clear cart');
    }
};

// Lấy giỏ hàng từ backend
export async function fetchCart(userId: string) {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }

    try {
        const { data } = await api.get(`/cart/${userId}`);
        return data;
    } catch (error: unknown) {
        const response = error as { response?: { data?: { message?: string } } };
        throw new Error(response.response?.data?.message || 'Failed to fetch cart');
    }
}