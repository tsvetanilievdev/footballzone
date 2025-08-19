import { AuthResponse, RegisterRequest, TokenResponse, User } from '@/types/auth';
import { apiClient } from '@/utils/api-client';

// API Service for Admin Panel and Authentication
class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
  private token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    });

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Articles API
  async getArticles(params?: { page?: number; limit?: number; zone?: string; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.zone) searchParams.append('zone', params.zone);
    if (params?.search) searchParams.append('q', params.search);
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`/articles${query}`);
  }

  async getArticle(slug: string) {
    return apiClient.get(`/articles/${slug}`);
  }

  async searchArticles(query: string, params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams({ q: query });
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return apiClient.get(`/articles/search?${searchParams.toString()}`);
  }

  async createArticle(articleData: unknown) {
    return apiClient.post('/articles', articleData);
  }

  async updateArticle(id: string, articleData: unknown) {
    return apiClient.put(`/articles/${id}`, articleData);
  }

  async deleteArticle(id: string) {
    return apiClient.delete(`/articles/${id}`);
  }

  // Templates API
  async getTemplates(category?: string) {
    const endpoint = category ? `/templates?category=${category}` : '/templates';
    return apiClient.get(endpoint);
  }

  async getTemplate(id: string) {
    return apiClient.get(`/templates/${id}`);
  }

  // Media API
  async uploadMedia(file: File) {
    return apiClient.upload('/media/upload', file);
  }

  async deleteMedia(id: string) {
    return apiClient.delete(`/media/${id}`);
  }

  // Categories API
  async getCategories() {
    return apiClient.get('/categories');
  }

  async createCategory(categoryData: unknown) {
    return apiClient.post('/categories', categoryData);
  }

  // Authentication API Methods
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiClient.post('/auth/login', { email, password }, { skipAuth: true });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/register', userData, { skipAuth: true });
  }

  async refreshToken(): Promise<TokenResponse> {
    return apiClient.post('/auth/refresh', {}, { skipAuth: true });
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get('/auth/profile');
  }

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
      this.token = null;
    }
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token;
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 