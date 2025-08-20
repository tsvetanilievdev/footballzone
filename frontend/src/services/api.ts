import { AuthResponse, RegisterRequest, TokenResponse, User } from '@/types/auth';
import { Article, ArticleZone } from '@/types/articles';
import { apiClient } from '@/utils/api-client';

// Type definitions for API parameters
export interface ArticleListParams {
  zone?: ArticleZone
  page?: number
  limit?: number
  featured?: boolean
  latest?: boolean
  category?: string
  author?: string
  search?: string
}

export interface ArticleSearchParams {
  q: string
  zone?: ArticleZone
  page?: number
  limit?: number
  category?: string
  author?: string
  dateFrom?: string
  dateTo?: string
  premium?: boolean
}

export interface SearchSuggestionParams {
  q: string
  limit?: number
}

// API Service for FootballZone.bg
class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

  // ========================================
  // ARTICLES API
  // ========================================

  async getArticles(params?: ArticleListParams) {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.zone) searchParams.append('zone', params.zone);
    if (params?.featured) searchParams.append('featured', 'true');
    if (params?.latest) searchParams.append('latest', 'true');
    if (params?.category) searchParams.append('category', params.category);
    if (params?.author) searchParams.append('author', params.author);
    if (params?.search) searchParams.append('q', params.search);
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`/articles${query}`);
  }

  async getArticle(slug: string) {
    return apiClient.get(`/articles/${slug}`);
  }

  async searchArticles(params: ArticleSearchParams) {
    const searchParams = new URLSearchParams();
    
    searchParams.append('q', params.q);
    if (params.zone) searchParams.append('zone', params.zone);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.category) searchParams.append('category', params.category);
    if (params.author) searchParams.append('author', params.author);
    if (params.dateFrom) searchParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) searchParams.append('dateTo', params.dateTo);
    if (params.premium !== undefined) searchParams.append('premium', params.premium.toString());
    
    return apiClient.get(`/articles/search?${searchParams.toString()}`);
  }

  async createArticle(articleData: Partial<Article>) {
    // Transform frontend Article format to backend API format
    const transformedData = {
      title: articleData.title || 'Untitled Article',
      slug: articleData.slug || articleData.title?.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50) || `article-${Date.now()}`,
      excerpt: articleData.excerpt || '',
      content: articleData.content || '',
      featuredImageUrl: articleData.featuredImage || undefined,
      category: this.mapCategoryToBackend(articleData.category),
      subcategory: articleData.subcategory || undefined,
      tags: articleData.tags || [],
      readTime: articleData.readTime || 5,
      isPremium: articleData.isPremium || false,
      isPermanentPremium: false,
      isFeatured: articleData.isFeatured || false,
      customOrder: articleData.order || undefined,
      status: 'PUBLISHED',
      zones: this.mapZonesToBackend(articleData.zones || ['read']),
    };
    
    return apiClient.post('/articles', transformedData);
  }

  private mapCategoryToBackend(frontendCategory?: string): string {
    const categoryMap: { [key: string]: string } = {
      'read': 'NEWS',
      'coach': 'TRAINING',
      'tactics': 'TACTICS',
      'training': 'TRAINING',
      'psychology': 'PSYCHOLOGY',
      'nutrition': 'NUTRITION',
      'technique': 'TECHNIQUE',
      'fitness': 'FITNESS',
      'news': 'NEWS',
      'interviews': 'INTERVIEWS',
      'analysis': 'ANALYSIS',
      'youth': 'YOUTH',
      'conditioning': 'CONDITIONING',
      'periodization': 'PERIODIZATION',
      'management': 'MANAGEMENT'
    };
    
    return categoryMap[frontendCategory || 'read'] || 'NEWS';
  }

  private mapZonesToBackend(frontendZones: string[]) {
    const zoneMap: { [key: string]: string } = {
      'read': 'READ',
      'coach': 'coach',
      'player': 'player',
      'parent': 'parent'
    };
    
    return frontendZones.map(zone => ({
      zone: zoneMap[zone] || 'READ',
      visible: true,
      requiresSubscription: zone !== 'read' // Only read zone is free by default
    }));
  }

  async updateArticle(id: string, articleData: Partial<Article>) {
    // Transform frontend Article format to backend API format
    const transformedData: any = {};
    
    if (articleData.title !== undefined) transformedData.title = articleData.title;
    if (articleData.slug !== undefined) {
      transformedData.slug = articleData.slug || articleData.title?.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
    }
    if (articleData.excerpt !== undefined) transformedData.excerpt = articleData.excerpt;
    if (articleData.content !== undefined) transformedData.content = articleData.content;
    if (articleData.featuredImage !== undefined) transformedData.featuredImageUrl = articleData.featuredImage;
    if (articleData.category !== undefined) transformedData.category = this.mapCategoryToBackend(articleData.category);
    if (articleData.subcategory !== undefined) transformedData.subcategory = articleData.subcategory;
    if (articleData.tags !== undefined) transformedData.tags = articleData.tags;
    if (articleData.readTime !== undefined) transformedData.readTime = articleData.readTime;
    if (articleData.isPremium !== undefined) transformedData.isPremium = articleData.isPremium;
    if (articleData.isFeatured !== undefined) transformedData.isFeatured = articleData.isFeatured;
    if (articleData.order !== undefined) transformedData.customOrder = articleData.order;
    if (articleData.zones !== undefined) transformedData.zones = this.mapZonesToBackend(articleData.zones);
    
    return apiClient.put(`/articles/${id}`, transformedData);
  }

  async deleteArticle(id: string) {
    return apiClient.delete(`/articles/${id}`);
  }

  async trackArticleView(articleId: string, metadata?: any) {
    return apiClient.post(`/articles/${articleId}/track-view`, { metadata });
  }

  // ========================================
  // SEARCH API
  // ========================================

  async getSearchSuggestions(params: SearchSuggestionParams) {
    const searchParams = new URLSearchParams();
    searchParams.append('q', params.q);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    return apiClient.get(`/search/suggestions?${searchParams.toString()}`);
  }

  async getPopularSearches(limit: number = 10) {
    return apiClient.get(`/search/popular?limit=${limit}`);
  }

  async getSearchCategories() {
    return apiClient.get('/search/categories');
  }

  async advancedSearch(params: ArticleSearchParams) {
    return this.searchArticles(params);
  }

  async trackSearch(query: string, metadata?: any) {
    return apiClient.post('/search/track', { query, metadata });
  }

  async saveSearchHistory(query: string) {
    return apiClient.post('/search/history', { query });
  }

  async getSearchHistory(limit: number = 10) {
    return apiClient.get(`/search/history?limit=${limit}`);
  }

  async clearSearchHistory() {
    return apiClient.delete('/search/history');
  }

  // ========================================
  // ADMIN API
  // ========================================

  async getAdminArticles(params?: any) {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`/admin/articles${query}`);
  }

  async getAdminArticleStats() {
    return apiClient.get('/admin/articles/stats');
  }

  async getAdminUsers(params?: any) {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`/admin/users${query}`);
  }

  async getAdminUserStats() {
    return apiClient.get('/admin/users/stats');
  }

  async getAdminAnalytics(params?: any) {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`/admin/analytics${query}`);
  }

  async bulkArticleOperation(operation: string, articleIds: string[], data?: any) {
    return apiClient.post('/admin/articles/bulk', { operation, articleIds, data });
  }

  async updateUser(userId: string, data: Partial<User>) {
    return apiClient.put(`/admin/users/${userId}`, data);
  }

  async banUser(userId: string, reason?: string) {
    return apiClient.post(`/admin/users/${userId}/ban`, { reason });
  }

  async unbanUser(userId: string) {
    return apiClient.post(`/admin/users/${userId}/unban`);
  }

  async resetUserPassword(userId: string) {
    return apiClient.post(`/admin/users/${userId}/reset-password`);
  }

  async flagContent(contentType: string, contentId: string, reason: string) {
    return apiClient.post('/admin/moderation/flag', { contentType, contentId, reason });
  }

  async reviewContent(contentType: string, contentId: string, action: string, notes?: string) {
    return apiClient.post('/admin/moderation/review', { contentType, contentId, action, notes });
  }

  // ========================================
  // TEMPLATES API
  // ========================================

  async getArticleTemplates() {
    return apiClient.get('/templates');
  }

  async createTemplate(templateData: any) {
    return apiClient.post('/templates', templateData);
  }

  async updateTemplate(id: string, templateData: any) {
    return apiClient.put(`/templates/${id}`, templateData);
  }

  async deleteTemplate(id: string) {
    return apiClient.delete(`/templates/${id}`);
  }

  async getTemplate(id: string) {
    return apiClient.get(`/templates/${id}`);
  }

  // ========================================
  // MEDIA API
  // ========================================

  async uploadMedia(file: File, folder?: string) {
    return apiClient.upload('/media/upload', file);
  }

  async deleteMedia(mediaId: string) {
    return apiClient.delete(`/media/${mediaId}`);
  }

  async updateMedia(mediaId: string, data: any) {
    return apiClient.put(`/media/${mediaId}`, data);
  }

  // ========================================
  // SETTINGS API
  // ========================================

  async getAdminSettings() {
    return apiClient.get('/admin/settings');
  }

  async updateAdminSettings(settings: Record<string, any>) {
    return apiClient.put('/admin/settings', settings);
  }

  // ========================================
  // AUTHENTICATION API
  // ========================================

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
    return apiClient.post('/auth/logout');
  }

  async updateProfile(data: Partial<User>) {
    return apiClient.put('/auth/profile', data);
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return apiClient.post('/auth/change-password', { currentPassword, newPassword });
  }

  // ========================================
  // CATEGORIES API
  // ========================================

  async getCategories() {
    return apiClient.get('/categories');
  }

  async createCategory(categoryData: any) {
    return apiClient.post('/categories', categoryData);
  }

  async updateCategory(id: string, categoryData: any) {
    return apiClient.put(`/categories/${id}`, categoryData);
  }

  async deleteCategory(id: string) {
    return apiClient.delete(`/categories/${id}`);
  }
}

// Create singleton instance
export const apiService = new ApiService();

export default apiService;