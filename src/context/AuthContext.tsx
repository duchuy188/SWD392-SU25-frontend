import React, { createContext, useContext, useState, useEffect } from 'react';
import { userServices } from '../services/userServices';
import { profileServices } from '../services/profleServices';
import { Profile } from '../types';


interface AuthContextType {
  currentUser: Profile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<Profile>, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
  googleLogin: (idToken: string) => Promise<boolean>;
  isLoading: boolean;
  updateUserProfile: (updatedUserData: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setupTokenRefresh = (expiresIn: number = 3600000) => {
    const existingTimer = window.localStorage.getItem('edubot_refreshTimer');
    if (existingTimer) {
      clearTimeout(parseInt(existingTimer));
    }

    const now = Date.now();
    localStorage.setItem('edubot_tokenCreatedAt', now.toString());
    localStorage.setItem('edubot_tokenExpiresIn', expiresIn.toString());

    const timer = setTimeout(async () => {
      const refreshToken = localStorage.getItem('edubot_refreshToken');
      if (refreshToken) {
        try {
          const response = await userServices.refreshToken(refreshToken);
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
          
          localStorage.setItem('edubot_accessToken', newAccessToken);
          localStorage.setItem('edubot_refreshToken', newRefreshToken);
          
          setupTokenRefresh();
        } catch (error) {
          await logout();
        }
      }
    }, expiresIn - 60000);

    window.localStorage.setItem('edubot_refreshTimer', timer.toString());
  };

  const checkTokenExpiration = (): boolean => {
    const tokenCreatedAt = localStorage.getItem('edubot_tokenCreatedAt');
    const tokenExpiresIn = localStorage.getItem('edubot_tokenExpiresIn');

    if (!tokenCreatedAt || !tokenExpiresIn) {
      return true;
    }

    const createdAt = parseInt(tokenCreatedAt);
    const expiresIn = parseInt(tokenExpiresIn);
    const now = Date.now();

    return (now - createdAt) >= expiresIn;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('edubot_user');
      const storedRefreshToken = localStorage.getItem('edubot_refreshToken');
      const storedAccessToken = localStorage.getItem('edubot_accessToken');

      if (storedUser && storedRefreshToken && storedAccessToken) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          
          if (checkTokenExpiration()) {
            const response = await userServices.refreshToken(storedRefreshToken);
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

            localStorage.setItem('edubot_accessToken', newAccessToken);
            localStorage.setItem('edubot_refreshToken', newRefreshToken);
            
            setupTokenRefresh();
          } else {
            const tokenCreatedAt = parseInt(localStorage.getItem('edubot_tokenCreatedAt') || '0');
            const tokenExpiresIn = parseInt(localStorage.getItem('edubot_tokenExpiresIn') || '3600000');
            const now = Date.now();
            const remainingTime = tokenExpiresIn - (now - tokenCreatedAt);
            
            if (remainingTime > 0) {
              setupTokenRefresh(remainingTime);
            } else {
              setupTokenRefresh();
            }
          }
          
          setIsAuthenticated(true);
          
          try {
            const profileResponse = await profileServices.getProfile();
            if (profileResponse.data && profileResponse.data.user) {
              const fullProfileData = profileResponse.data.user;
              setCurrentUser(fullProfileData);
              localStorage.setItem('edubot_user', JSON.stringify(fullProfileData));
            }
          } catch (profileError) {
            // Handle silently
          }
        } catch (error) {
          await logout();
        }
      } else {
        await logout();
      }
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      const timerID = window.localStorage.getItem('edubot_refreshTimer');
      if (timerID) {
        clearTimeout(parseInt(timerID));
      }
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await userServices.login(email, password);
      if (response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        if (!user || !user.id || !user.email) {
          return false;
        }

        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('edubot_user', JSON.stringify(user));
        localStorage.setItem('edubot_accessToken', accessToken);
        localStorage.setItem('edubot_refreshToken', refreshToken);
        
        setupTokenRefresh();
        
        try {
          const profileResponse = await profileServices.getProfile();
          if (profileResponse.data && profileResponse.data.user) {
            const fullProfileData = profileResponse.data.user;
            setCurrentUser(fullProfileData);
            localStorage.setItem('edubot_user', JSON.stringify(fullProfileData));
          }
        } catch (profileError) {
          // Handle silently
        }
        
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const googleLogin = async (idToken: string): Promise<boolean> => {
    try {
      const response = await userServices.googleLogin(idToken);
      if (response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        if (!user || !user.id || !user.email) {
          return false;
        }

        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('edubot_user', JSON.stringify(user));
        localStorage.setItem('edubot_accessToken', accessToken);
        localStorage.setItem('edubot_refreshToken', refreshToken);
        
        setupTokenRefresh();
        
        try {
          const profileResponse = await profileServices.getProfile();
          if (profileResponse.data && profileResponse.data.user) {
            const fullProfileData = profileResponse.data.user;
            setCurrentUser(fullProfileData);
            localStorage.setItem('edubot_user', JSON.stringify(fullProfileData));
          }
        } catch (profileError) {
          // Handle silently
        }
        
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const register = async (userData: Partial<Profile>, password: string): Promise<boolean> => {
    try {
      const response = await userServices.register(userData.email || '', password, userData.fullName || '');
      
      if (response.data && response.data.user) {
  
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      await userServices.logout();
    } catch (error) {
      // Handle silently
    }
    
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('edubot_user');
    localStorage.removeItem('edubot_accessToken');
    localStorage.removeItem('edubot_refreshToken');
    localStorage.removeItem('edubot_refreshTimer');
    localStorage.removeItem('edubot_tokenCreatedAt');
    localStorage.removeItem('edubot_tokenExpiresIn');
  };
  const hasRole = (roles: string[]) => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  // Add a function to update user profile data in context and localStorage
  const updateUserProfile = (updatedUserData: Partial<Profile>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updatedUserData };
    setCurrentUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem('edubot_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      hasRole,
      googleLogin,
      isLoading,
      updateUserProfile
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