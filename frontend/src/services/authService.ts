import { User } from '../types';

// Trong một ứng dụng thực tế, đây sẽ là các API call đến backend
// Đối với demo, chúng ta sẽ mô phỏng các API call bằng localStorage

// Lưu trữ người dùng đã đăng ký
const USERS_KEY = 'registered_users';

// Lấy danh sách người dùng đã đăng ký từ localStorage
const getRegisteredUsers = (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

// Lưu danh sách người dùng đã đăng ký vào localStorage
const saveRegisteredUsers = (users: User[]): void => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Kiểm tra xem email đã tồn tại chưa
const isEmailExists = (email: string): boolean => {
    const users = getRegisteredUsers();
    return users.some(user => user.email === email);
};

// Sử dụng URL tương đối để tận dụng proxy trong vite.config.ts
const API_URL = '/api/auth';

export async function register(data: { email: string; password: string; name: string; phone: string; address: string }) {
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function login(data: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// Đăng xuất
export const logout = (): void => {
    // In a real application, you might want to call an API to invalidate the token
    // For this demo, we'll just clear the token from localStorage
    localStorage.removeItem('token');
};

// Quên mật khẩu
export const forgotPassword = async (email: string): Promise<void> => {
    // Kiểm tra email có tồn tại không
    if (!isEmailExists(email)) {
        throw new Error('Email not found');
    }

    // Trong ứng dụng thực tế, đây sẽ là nơi gửi email đặt lại mật khẩu
    // Đối với demo, chúng ta sẽ mô phỏng việc gửi email
    console.log(`Password reset email sent to ${email}`);
};

// Đặt lại mật khẩu
export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
    // Kiểm tra email có tồn tại không
    if (!isEmailExists(email)) {
        throw new Error('Email not found');
    }

    // Cập nhật mật khẩu mới
    const users = getRegisteredUsers();
    const updatedUsers = users.map(user => {
        if (user.email === email) {
            return { ...user, password: newPassword };
        }
        return user;
    });
    saveRegisteredUsers(updatedUsers);
};