import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, AuthState, UserPlan } from '@/types/user';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, phone: string) => Promise<boolean>;
  verifyToken: (token: string) => Promise<boolean>;
  completeRegistration: (username: string, plan: UserPlan) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'usuario@exemplo.com',
  phone: '+55 11 99999-9999',
  username: 'CardMaster',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CardMaster',
  plan: 'free',
  createdAt: '2024-01-15',
  followersCount: 42,
  followingCount: 28,
  collectionsCount: 3,
  cardsCount: 156,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email && password.length >= 6) {
      setAuthState({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
      });
      return true;
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const register = useCallback(async (email: string, phone: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return !!(email && phone);
  }, []);

  const verifyToken = useCallback(async (token: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAuthState(prev => ({ ...prev, isLoading: false }));
    // Mock: accept any 6-digit token
    return token.length === 6;
  }, []);

  const completeRegistration = useCallback(async (username: string, plan: UserPlan): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      ...mockUser,
      username,
      plan,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };
    
    setAuthState({
      isAuthenticated: true,
      user: newUser,
      isLoading: false,
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        verifyToken,
        completeRegistration,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
