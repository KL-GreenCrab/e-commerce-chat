import axios from 'axios';
import { Product } from '../types/product';

// Sử dụng URL tương đối để tận dụng proxy trong vite.config.ts
const API_URL = '/api';

function getToken() {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth).token : null;
}

// Lấy danh sách sản phẩm
export const getProducts = async (): Promise<Product[]> => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/products`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// Lấy thông tin sản phẩm theo ID
export const getProductById = async (id: string): Promise<Product> => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/products/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// Thêm sản phẩm mới
export const addProduct = async (productData: Partial<Product>): Promise<Product> => {
    const token = getToken();
    const response = await axios.post(`${API_URL}/products`, productData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// Cập nhật sản phẩm
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
    const token = getToken();
    const response = await axios.put(`${API_URL}/products/${id}`, productData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// Xóa sản phẩm
export const deleteProduct = async (id: string): Promise<void> => {
    const token = getToken();
    await axios.delete(`${API_URL}/products/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

// Lấy danh sách đơn hàng
export const getOrders = async () => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/admin/orders`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// Lấy thông tin đơn hàng theo ID
export const getOrderById = async (id: string) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/admin/orders/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId: string, status: string) => {
    const token = getToken();
    const response = await axios.put(`${API_URL}/orders/${orderId}/status`,
        { status },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response.data;
};

// Cập nhật thông tin đơn hàng
export const updateOrder = async (orderId: string, orderData: Record<string, string | number | boolean | undefined | null>) => {
    const token = getToken();
    const response = await axios.put(`${API_URL}/admin/orders/${orderId}`,
        orderData,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response.data;
};

// Lấy thống kê
export const getDashboardStats = async () => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};