import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utilizadores de exemplo para demonstração
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@cs2hub.pt',
    password: 'admin123',
    role: 'admin' as const,
  },
  {
    id: '2',
    username: 'user',
    email: 'user@cs2hub.pt',
    password: 'user123',
    role: 'user' as const,
  },
  {
    id: '3',
    username: 'nuno',
    email: 'nuno@cs2hub.pt',
    password: 'nuno123',
    role: 'admin' as const,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se há um utilizador guardado no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('cs2hub_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('cs2hub_user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('cs2hub_user');
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar se o email já existe
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    // Criar novo utilizador
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role: 'user',
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('cs2hub_user', JSON.stringify(newUser));
    return true;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
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