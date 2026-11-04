export type UserRole = 'user' | 'admin';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    address?: string;
    city?: string;
} 