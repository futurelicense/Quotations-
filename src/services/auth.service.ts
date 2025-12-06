import { api } from './api';
import { env } from '../config/env';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  company?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    this.setTokens(response.token, response.refreshToken);
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    this.setTokens(response.token, response.refreshToken);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<{ token: string }>('/auth/refresh', {
      refreshToken,
    });

    this.setToken(response.token);
    return response.token;
  }

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me');
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
  }

  private setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(env.authTokenKey, token);
    localStorage.setItem(env.authRefreshTokenKey, refreshToken);
  }

  private setToken(token: string): void {
    localStorage.setItem(env.authTokenKey, token);
  }

  private clearTokens(): void {
    localStorage.removeItem(env.authTokenKey);
    localStorage.removeItem(env.authRefreshTokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(env.authTokenKey);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(env.authRefreshTokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();



