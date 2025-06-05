import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('edubot_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    try {
      // In a real app, this would be an API call
      const foundUser = mockUsers.find(user => user.email === email);
      
      if (foundUser && password.length >= 6) { // Simple mock password validation
        setCurrentUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem('edubot_user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    // Simulate API call
    try {
      // Check if email already exists
      const existingUser = mockUsers.find(user => user.email === userData.email);
      if (existingUser) {
        return false;
      }

      // In a real app, this would create a new user via API
      const newUser: User = {
        id: `user_${Date.now()}`,
        fullName: userData.fullName || '',
        email: userData.email || '',
        role: 'student', // Default role
        avatar: userData.avatar,
        grade: userData.grade,
        school: userData.school,
        province: userData.province,
        interests: userData.interests || [],
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('edubot_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('edubot_user');
  };

  const hasRole = (roles: string[]) => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};