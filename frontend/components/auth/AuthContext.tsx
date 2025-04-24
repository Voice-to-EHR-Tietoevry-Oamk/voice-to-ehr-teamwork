'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Doctor {
  name: string;
}

interface AuthContextType {
  doctor: Doctor | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  // Initialize doctor state from localStorage on client-side only
  useEffect(() => {
    const storedDoctor = localStorage.getItem('doctor');
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }
  }, []);

  const login = async (username: string, password: string) => {
    // This is a dummy authentication
    // In a real app, this would make an API call to your backend
    if (username === 'admin' && password === 'vtehr') {
      const doctorData = { name: 'Dr. Ilponen' };
      setDoctor(doctorData);
      localStorage.setItem('doctor', JSON.stringify(doctorData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setDoctor(null);
    // Clear all transcription data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('doctor');
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('transcription_')) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  return (
    <AuthContext.Provider value={{ doctor, login, logout }}>
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