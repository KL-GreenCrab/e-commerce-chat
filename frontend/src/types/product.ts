export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    brand: string;
    stock: number;
    rating?: number;
    numReviews?: number;
    createdAt?: string;
    updatedAt?: string;
} 