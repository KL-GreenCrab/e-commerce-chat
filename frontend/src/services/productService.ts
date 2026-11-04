import { Product } from '../types';

// Sử dụng URL tương đối để tận dụng proxy trong vite.config.ts
const API_URL = '/api/products';

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
    const res = await fetch(`${API_URL}?${query}`);
    if (!res.ok) throw new Error('Failed to fetch products');

    const data = await res.json();

    // If search parameter is provided but no results from API, do client-side filtering
    if (params.search && Array.isArray(data) && data.length === 0) {
        // Fetch all products
        const allRes = await fetch(`${API_URL}`);
        if (!allRes.ok) return [];

        const allProducts = await allRes.json();
        const searchTerm = String(params.search).toLowerCase();

        // Filter products based on search term
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
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}