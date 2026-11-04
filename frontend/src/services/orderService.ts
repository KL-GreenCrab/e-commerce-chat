import { Order, OrderItem } from '../types';

// Sử dụng URL tương đối để tận dụng proxy trong vite.config.ts
const API_URL = '/api';

// Tạo đơn hàng mới
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
    const { token } = JSON.parse(auth);
    if (!token) {
        throw new Error('Unauthorized: Please login first');
    }

    console.log('Sending order data:', orderData);

    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) {
        let errorMessage = 'Failed to create order';
        try {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            errorMessage = errorData.message || errorMessage;
        } catch {
            // If we can't parse the error as JSON, try to get the text
            try {
                const errorText = await response.text();
                console.error('Error response text:', errorText);
                errorMessage = errorText || errorMessage;
            } catch (textError) {
                console.error('Could not parse error response as text:', textError);
            }
        }
        throw new Error(`Error creating order: ${errorMessage} (Status: ${response.status})`);
    }
    return response.json();
};

// Lấy danh sách đơn hàng theo userId
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }
    const { token } = JSON.parse(auth);
    if (!token) {
        throw new Error('Unauthorized: Please login first');
    }

    const response = await fetch(`${API_URL}/orders/user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    return response.json();
};

// Lấy chi tiết một đơn hàng
export const getOrderById = async (orderId: string): Promise<Order> => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }
    const { token } = JSON.parse(auth);
    if (!token) {
        throw new Error('Unauthorized: Please login first');
    }

    const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch order');
    }
    return response.json();
};