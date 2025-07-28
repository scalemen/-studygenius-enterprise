import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  subscription: 'free' | 'premium' | 'enterprise';
  joinedAt: Date;
  lastActive: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check localStorage for session token
      const token = localStorage.getItem('studygenius_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // In a real app, verify token with server
      // For demo purposes, we'll use mock user data
      const mockUser: User = {
        id: '1',
        email: 'student@studygenius.com',
        name: 'John Student',
        avatar: '👨‍🎓',
        role: 'student',
        subscription: 'premium',
        joinedAt: new Date('2024-01-01'),
        lastActive: new Date()
      };

      setUser(mockUser);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          avatar: '👨‍🎓',
          role: 'student',
          subscription: 'premium',
          joinedAt: new Date('2024-01-01'),
          lastActive: new Date()
        };

        setUser(mockUser);
        localStorage.setItem('studygenius_token', 'mock_jwt_token');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: '1',
        email: 'user@gmail.com',
        name: 'Google User',
        avatar: '👨‍💻',
        role: 'student',
        subscription: 'free',
        joinedAt: new Date(),
        lastActive: new Date()
      };

      setUser(mockUser);
      localStorage.setItem('studygenius_token', 'mock_google_jwt_token');
      return true;
    } catch (error) {
      console.error('Google login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (email && password.length >= 6 && name) {
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name,
          avatar: '🆕',
          role: 'student',
          subscription: 'free',
          joinedAt: new Date(),
          lastActive: new Date()
        };

        setUser(mockUser);
        localStorage.setItem('studygenius_token', 'mock_new_user_token');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studygenius_token');
    localStorage.removeItem('studygenius_refresh_token');
    
    // Clear any other cached data
    localStorage.removeItem('studygenius_preferences');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...updates, lastActive: new Date() };
      setUser(updatedUser);
      
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    register,
    updateProfile
  };
};

// Export the context for provider setup if needed
export { AuthContext };
export type { User, AuthContextType };