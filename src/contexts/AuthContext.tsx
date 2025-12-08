import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseAuthService } from '../services/supabase-auth.service';
import type { User } from '../types';

interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  company: string | null;
  role: 'admin' | 'manager' | 'staff';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, company?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      try {
        const currentUser = await supabaseAuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Fetch user profile
          const userProfile = await supabaseAuthService.getUserProfile(currentUser.id);
          if (userProfile) {
            setProfile({
              id: userProfile.id,
              email: userProfile.email,
              fullName: userProfile.full_name,
              avatarUrl: userProfile.avatar_url,
              company: userProfile.company,
              role: userProfile.role,
            });
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabaseAuthService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          try {
            const currentUser = await supabaseAuthService.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              const userProfile = await supabaseAuthService.getUserProfile(currentUser.id);
              if (userProfile) {
                setProfile({
                  id: userProfile.id,
                  email: userProfile.email,
                  fullName: userProfile.full_name,
                  avatarUrl: userProfile.avatar_url,
                  company: userProfile.company,
                  role: userProfile.role,
                });
              }
            }
          } catch (error) {
            console.error('Failed to fetch profile:', error);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await supabaseAuthService.signIn({ email, password });
      setUser(response.user);
      
      // Fetch user profile
      const userProfile = await supabaseAuthService.getUserProfile(response.user.id);
      if (userProfile) {
        setProfile({
          id: userProfile.id,
          email: userProfile.email,
          fullName: userProfile.full_name,
          avatarUrl: userProfile.avatar_url,
          company: userProfile.company,
          role: userProfile.role,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string, company?: string) => {
    setIsLoading(true);
    try {
      const response = await supabaseAuthService.signUp({
        email,
        password,
        fullName,
        company,
      });
      setUser(response.user);
      
      // Fetch user profile
      const userProfile = await supabaseAuthService.getUserProfile(response.user.id);
      if (userProfile) {
        setProfile({
          id: userProfile.id,
          email: userProfile.email,
          fullName: userProfile.full_name,
          avatarUrl: userProfile.avatar_url,
          company: userProfile.company,
          role: userProfile.role,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabaseAuthService.signOut();
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await supabaseAuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const userProfile = await supabaseAuthService.getUserProfile(currentUser.id);
        if (userProfile) {
          setProfile({
            id: userProfile.id,
            email: userProfile.email,
            fullName: userProfile.full_name,
            avatarUrl: userProfile.avatar_url,
            company: userProfile.company,
            role: userProfile.role,
          });
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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

