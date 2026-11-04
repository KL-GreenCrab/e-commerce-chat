import api from './api';

export async function getUser(id: string) {
    try {
        const { data } = await api.get(`/users/${id}`);
        return data;
    } catch (error: unknown) {
        const response = error as { response?: { status?: number } };
        if (response.response?.status === 401) {
            throw new Error('Unauthorized: Please login again');
        }
        if (response.response?.status === 404) {
            throw new Error('User not found');
        }
        throw new Error('Failed to fetch user data');
    }
}

export async function updateUser(id: string, data: { name: string; phone: string; address: string; city?: string }) {
    try {
        const { data: updatedUser } = await api.put(`/users/${id}`, data);
        return updatedUser;
    } catch (error: unknown) {
        const response = error as { response?: { status?: number } };
        if (response.response?.status === 401) {
            throw new Error('Unauthorized: Please login again');
        }
        throw new Error('Failed to update user data');
    }
}