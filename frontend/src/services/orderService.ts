import api from './api';
import { Order, OrderItem } from '../types';

export const createOrder = async (orderData: {
    items: OrderItem[];
    total: number;
    paymentMethod: string;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        phone: string;
    };
}) => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }

    try {
        const { data } = await api.post('/orders', orderData);
        return data;
    } catch (error: unknown) {
        const response = error as { response?: { data?: { message?: string } } };
        throw new Error(response.response?.data?.message || 'Error creating order');
    }
};

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }

    const { data } = await api.get(`/orders/user/${userId}`);
    return data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }

    const { data } = await api.get(`/orders/${orderId}`);
    return data;
};
