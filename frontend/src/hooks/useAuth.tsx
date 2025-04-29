'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, SigninResponse, SignoutResponse } from '@/lib/services/auth.service';
import { User } from '@/lib/services/user.service'

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<SigninResponse>;
  signout: () => Promise<SignoutResponse>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    const me = await authService.getMe();
    setUser(me);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signin = async (email: string, password: string) => {
    const res = await authService.signin({ email, password });
    await fetchUser();
    return res;
  };

  const signout = async () => {
    const res = await authService.signout();
    setUser(null);
    return res;
  };

  const refreshUser = fetchUser;

  const value: AuthContextType = { user, loading, signin, signout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
