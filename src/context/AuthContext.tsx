import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { userServices } from '../services/userServices';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  googleLogin: (idToken: string) => Promise<boolean>;
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
    try {
      const response = await userServices.login(email, password);
      if (response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Validate user data
        if (!user || !user.id || !user.email) {
          console.error('Invalid user data received');
          return false;
        }

        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('edubot_user', JSON.stringify(user));
        localStorage.setItem('edubot_accessToken', accessToken);
        localStorage.setItem('edubot_refreshToken', refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const googleLogin = async (idToken: string): Promise<boolean> => {
    try {
      const response = await userServices.googleLogin(idToken);
      if (response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Validate user data
        if (!user || !user.id || !user.email) {
          console.error('Invalid user data received');
          return false;
        }

        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('edubot_user', JSON.stringify(user));
        localStorage.setItem('edubot_accessToken', accessToken);
        localStorage.setItem('edubot_refreshToken', refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    try {
      const response = await userServices.register(userData.email || '', password, userData.fullName || '');
      
      if (response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Validate user data
        if (!user || !user.id || !user.email) {
          console.error('Invalid user data received');
          return false;
        }

        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('edubot_user', JSON.stringify(user));
        localStorage.setItem('edubot_accessToken', accessToken);
        localStorage.setItem('edubot_refreshToken', refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('edubot_user');
    localStorage.removeItem('edubot_accessToken');
    localStorage.removeItem('edubot_refreshToken');
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
      hasRole,
      googleLogin
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