export interface User {
  id: string;
  email: string;
  name: string;
  role: 'FREE' | 'PLAYER' | 'COACH' | 'PARENT' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    preferences?: Record<string, any>;
  };
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  message?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'FREE' | 'PLAYER' | 'COACH' | 'PARENT';
  acceptTerms: boolean;
  subscribeNewsletter?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export interface AuthError {
  message: string;
  field?: string;
  code?: string;
}