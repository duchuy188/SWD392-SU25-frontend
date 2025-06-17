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

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('edubot_user');
      const storedRefreshToken = localStorage.getItem('edubot_refreshToken');

      if (storedUser && storedRefreshToken) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          // Attempt to refresh token on app load
          const response = await userServices.refreshToken(storedRefreshToken);
          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;

          localStorage.setItem('edubot_accessToken', newAccessToken);
          localStorage.setItem('edubot_refreshToken', newRefreshToken);
          setIsAuthenticated(true);
          
          // Fetch complete profile data on app startup
          try {
            const profileResponse = await profileServices.getProfile();
            if (profileResponse.data && profileResponse.data.user) {
              const fullProfileData = profileResponse.data.user;
              setCurrentUser(fullProfileData);
              localStorage.setItem('edubot_user', JSON.stringify(fullProfileData));
            }
          } catch (profileError) {
            console.error('Error fetching complete profile on startup:', profileError);
            // Continue with stored user data even if profile fetch fails
          }
          
        } catch (error) {
          console.error('Failed to refresh token on startup, logging out:', error);
          // If refresh fails, clear everything and log out
          logout(); 
        } finally {
          setIsLoading(false);
        }
      } else {
        logout();
        setIsLoading(false);
      }
    };

    initializeAuth();
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

        // Set initial user data
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('edubot_user', JSON.stringify(user));
        localStorage.setItem('edubot_accessToken', accessToken);
        localStorage.setItem('edubot_refreshToken', refreshToken);
        
        // Fetch complete profile data after successful login
        try {
          const profileResponse = await profileServices.getProfile();
          if (profileResponse.data && profileResponse.data.user) {
            const fullProfileData = profileResponse.data.user;
            setCurrentUser(fullProfileData);
            localStorage.setItem('edubot_user', JSON.stringify(fullProfileData));
          }
        } catch (profileError) {
          console.error('Error fetching complete profile after login:', profileError);
          // Continue with login even if profile fetch fails
        }
        
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
        
        // Fetch complete profile data after successful Google login
        try {
          const profileResponse = await profileServices.getProfile();
          if (profileResponse.data && profileResponse.data.user) {
            const fullProfileData = profileResponse.data.user;
            setCurrentUser(fullProfileData);
            localStorage.setItem('edubot_user', JSON.stringify(fullProfileData));
          }
        } catch (profileError) {
          console.error('Error fetching complete profile after Google login:', profileError);
          // Continue with login even if profile fetch fails
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const register = async (userData: Partial<Profile>, password: string): Promise<boolean> => {
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

  const logout = async () => {
    // Try to call the logout API
    try {
      await userServices.logout();
    } catch (error) {
      console.error('Error calling logout API:', error);
      // Continue with local logout even if API call fails
    }
    
    // Clear local state and storage
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