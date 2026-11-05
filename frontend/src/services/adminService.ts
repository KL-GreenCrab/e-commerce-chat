import api from './api';
import { Product } from '../types/product';

type ProductPayload = Partial<Product>;

export const getProducts = async (): Promise<Product[]> => {
    const { data } = await api.get('/products');
    return data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

export const addProduct = async (productData: ProductPayload): Promise<Product> => {
    const { data } = await api.post('/products', productData);
    return data;
};

export const updateProduct = async (id: string, productData: ProductPayload): Promise<Product> => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
};

export const getOrders = async () => {
    const { data } = await api.get('/admin/orders');
    return data;
};

export const getOrderById = async (id: string) => {
    const { data } = await api.get(`/admin/orders/${id}`);
    return data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
    const { data } = await api.put(`/orders/${orderId}/status`, { status });
    return data;
};

export const updateOrder = async (orderId: string, orderData: Record<string, string | number | boolean | undefined | null>) => {
    const { data } = await api.put(`/admin/orders/${orderId}`, orderData);
    return data;
};

export const getDashboardStats = async () => {
    const { data } = await api.get('/admin/stats');
    return data;
};
