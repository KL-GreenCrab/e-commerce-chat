export interface OrderData {
    items: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }[];
    total: number;
    paymentMethod: 'cod' | 'bank' | 'credit_card';
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        phone: string;
    };
} 