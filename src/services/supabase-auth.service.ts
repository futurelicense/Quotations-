import { supabase } from '../lib/supabase';
import type { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  company?: string;
}

export interface AuthResponse {
  user: User;
  session: any;
}

class SupabaseAuthService {
  /**
   * Sign in with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Login failed: No user data returned');
    }

    // Fetch user profile
    const profile = await this.getUserProfile(data.user.id);

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.full_name || data.user.email!,
      role: profile?.role || 'staff',
      avatar: profile?.avatar_url,
      createdAt: data.user.created_at,
    };

    return {
      user,
      session: data.session,
    };
  }

  /**
   * Register a new user
   */
  async register(registerData: RegisterData): Promise<AuthResponse> {
    const { email, password, fullName, company } = registerData;

    // Sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company: company,
        },
      },
    });

    if (signUpError) {
      throw new Error(signUpError.message);
    }

    if (!authData.user || !authData.session) {
      throw new Error('Registration failed: No user data returned');
    }

    // Create user profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email: authData.user.email!,
      full_name: fullName,
      role: 'staff', // Default role
    });

    if (profileError) {
      console.error('Failed to create profile:', profileError);
      // Don't throw error, profile will be created on first login
    }

    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      name: fullName,
      role: 'staff',
      createdAt: authData.user.created_at,
    };

    return {
      user,
      session: authData.session,
    };
  }

  /**
   * Sign out the current user
   */
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Get current user session
   */
  async getCurrentUser(): Promise<User | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    const profile = await this.getUserProfile(session.user.id);

    return {
      id: session.user.id,
      email: session.user.email!,
      name: profile?.full_name || session.user.email!,
      role: profile?.role || 'staff',
      avatar: profile?.avatar_url,
      createdAt: session.user.created_at,
    };
  }

  /**
   * Get user profile from database
   */
  private async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }

    return data;
  }

  /**
   * Send password reset email
   */
  async forgotPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session;
  }

  /**
   * Get auth session
   */
  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

export const supabaseAuthService = new SupabaseAuthService();
