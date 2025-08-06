// API Service for Admin Panel
class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
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
  async getArticles() {
    return this.request('/articles');
  }

  async getArticle(id: string) {
    return this.request(`/articles/${id}`);
  }

  async createArticle(articleData: unknown) {
    return this.request('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async updateArticle(id: string, articleData: unknown) {
    return this.request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  }

  async deleteArticle(id: string) {
    return this.request(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  // Templates API
  async getTemplates(category?: string) {
    const endpoint = category ? `/templates?category=${category}` : '/templates';
    return this.request(endpoint);
  }

  async getTemplate(id: string) {
    return this.request(`/templates/${id}`);
  }

  // Media API
  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseUrl}/media/upload`;
    const headers: HeadersInit = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async deleteMedia(id: string) {
    return this.request(`/media/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories API
  async getCategories() {
    return this.request('/categories');
  }

  async createCategory(categoryData: unknown) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // Auth API
  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token && typeof window !== 'undefined') {
      localStorage.setItem('admin_token', response.token);
      this.token = response.token;
    }

    return response;
  }

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
    this.token = null;
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