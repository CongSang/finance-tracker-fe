'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthResponse, User } from '@/types/index';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const login = (authData: AuthResponse) => {
    setUser(authData.user);
    Cookies.set('access_token', authData.token, { path: '/' });
    Cookies.set('refresh_token', authData.refreshToken, { path: '/' });
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
