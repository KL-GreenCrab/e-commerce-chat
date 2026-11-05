import api from './api';
import { Product } from '../types';

type ProductQueryParams = Record<string, string | number | boolean | undefined>;

export async function fetchProducts(params: ProductQueryParams = {}) {
    const query = new URLSearchParams(
        Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = String(value);
            }
            return acc;
        }, {})
    ).toString();

    const { data } = await api.get('/products', {
        params: query ? Object.fromEntries(new URLSearchParams(query).entries()) : undefined
    });

    if (params.search && Array.isArray(data) && data.length === 0) {
        const { data: allProducts } = await api.get('/products');
        const searchTerm = String(params.search).toLowerCase();

        return allProducts.filter((product: Product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm)) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    return data;
}

export async function fetchProductById(id: string) {
    const { data } = await api.get(`/products/${id}`);
    return data;
}
