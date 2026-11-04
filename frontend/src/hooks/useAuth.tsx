import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, phone: string, address: string) => Promise<void>;
  updateUserData: (userData: Partial<User>) => void;
  isLoading: boolean;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { user } = JSON.parse(auth);
      setUser({ ...user, role: user.role || 'user' });
    }
    setIsAuthReady(true);
  }, []);

  const updateUserData = (userData: Partial<User>) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const nextUser = { ...currentUser, ...userData };
      const auth = localStorage.getItem('auth');
      if (auth) {
        const payload = JSON.parse(auth);
        payload.user = nextUser;
        localStorage.setItem('auth', JSON.stringify(payload));
      }
      return nextUser;
    });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const userWithRole = { ...data.user, role: data.user.role || 'user' };
      localStorage.setItem('auth', JSON.stringify({ token: data.token, user: userWithRole }));
      setUser(userWithRole);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
    toast.success('Đăng xuất thành công');
  };

  const register = async (name: string, email: string, password: string, phone: string, address: string) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', { name, email, password, phone, address });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUserData, isLoading, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}