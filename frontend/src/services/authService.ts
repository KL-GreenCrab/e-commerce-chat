import api from './api';

export async function register(data: { email: string; password: string; name: string; phone: string; address: string }) {
    const { data: response } = await api.post('/auth/register', data);
    return response;
}

export async function login(data: { email: string; password: string }) {
    const { data: response } = await api.post('/auth/login', data);
    return response;
}

export const logout = (): void => {
    localStorage.removeItem('auth');
};

export const forgotPassword = async (email: string): Promise<void> => {
    console.log(`Password reset email sent to ${email}`);
};

export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    if (!auth.user || auth.user.email !== email) {
        throw new Error('Email not found');
    }
    auth.user.password = newPassword;
    localStorage.setItem('auth', JSON.stringify(auth));
};
