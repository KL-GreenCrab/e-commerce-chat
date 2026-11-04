import api from './api';

export async function fetchCategories() {
    const { data } = await api.get('/products/metadata/categories');
    return data;
}