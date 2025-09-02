import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/config';

export type UserRole = 'admin' | 'creator' | 'member';

export interface User {
  id: string;
  full_name: string;
  Username: string;
  Email: string;
  Role: UserRole;
  Avatar?: string;
  Bio?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Login failed');
    }

    const data = await response.json();
    const responseData = data.response;

    // Store token in localStorage
    localStorage.setItem('authToken', responseData.token);

    // Create user object from response
    const user: User = {
      id: responseData.id,
      full_name: responseData.full_name,
      Username: responseData.username,
      Email: responseData.email || "",
      Role: responseData.role || 'member',
      Avatar: responseData.avatar,
      updated_at: responseData.updated_at,
      created_at: responseData.created_at,
      Bio: responseData.bio || '',
    };

    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    // navigate('/'); used for react only.
    window.location.href = "/";
  };

  const register = async (name: string, username: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: username,
        full_name: name,
        password: password,
        email: email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Registration failed');
    }

    // Redirect to login page after successful registration
    // navigate('/login'); used in react only application
    window.location.href = "/login";
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.location.href = "/"
    //navigate('/');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
