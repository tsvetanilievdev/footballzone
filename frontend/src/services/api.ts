import { AuthResponse, RegisterRequest, TokenResponse, User } from '@/types/auth';
import { Article, ArticleZone } from '@/types/articles';
import type { Article as FullArticle } from '@/types';
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
    console.log('🔍 ApiService.getArticles called with params:', params);

    try {
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
      const url = `/articles${query}`;

      console.log('📡 Making API request to:', url);
      console.log('🌐 Base URL:', this.baseUrl);
      console.log('🔧 API Client instance:', apiClient);

      console.log('⏳ About to call apiClient.get...');
      const response = await apiClient.get(url);
      console.log('✅ API response received:', response);

      // Transform article list response
      if (response.data && Array.isArray(response.data)) {
        console.log('🔄 Transforming response data...');
        const transformed = {
          ...response,
          data: response.data.map((article: any) => this.transformBackendArticleToFrontend(article))
        };
        console.log('✅ Data transformation complete:', transformed);
        return transformed;
      }

      console.log('✅ Returning response as-is:', response);
      return response;
    } catch (error) {
      console.error('❌ Error in getArticles:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  async getArticle(slug: string) {
    const response = await apiClient.get(`/articles/${slug}`);
    
    // Backend returns {success: true, data: articleData}
    const articleData = response.data?.data || response.data || response;
    const transformed = this.transformBackendArticleToFrontend(articleData);
    return transformed;
  }

  async getArticleById(id: string) {
    const response = await apiClient.get(`/articles/by-id/${id}`);
    
    // Backend returns {success: true, data: articleData}
    const articleData = response.data?.data || response.data || response;
    const transformed = this.transformBackendArticleToFrontend(articleData);
    return transformed;
  }

  // Transform backend article structure to frontend Article interface
  private transformBackendArticleToFrontend(backendArticle: any): FullArticle {
    return {
      id: backendArticle.id,
      title: backendArticle.title || 'Без заглавие',
      slug: backendArticle.slug,
      excerpt: backendArticle.excerpt || '',
      content: backendArticle.content || '',
      featuredImage: backendArticle.featuredImageUrl || '/images/placeholder-article.jpg',
      featuredImageUrl: backendArticle.featuredImageUrl || '/images/placeholder-article.jpg',
      author: {
        name: backendArticle.author?.name || 'Анонимен автор',
        avatar: backendArticle.author?.avatarUrl || undefined
      },
      category: this.mapBackendCategoryToFrontend(backendArticle.category),
      subcategory: backendArticle.subcategory || undefined,
      tags: backendArticle.tags || [],
      publishedAt: new Date(backendArticle.publishedAt || backendArticle.createdAt),
      readTime: backendArticle.readTime || 5,
      isPremium: backendArticle.isPremium || false,
      premiumSchedule: backendArticle.premiumReleaseDate ? {
        releaseFree: new Date(backendArticle.premiumReleaseDate),
        isPermanentPremium: backendArticle.isPermanentPremium || false
      } : undefined,
      zones: this.mapBackendZonesToFrontend(backendArticle.zones || []),
      zoneSettings: this.mapBackendZoneSettings(backendArticle.zones || []),
      series: backendArticle.series ? {
        name: backendArticle.series.name,
        slug: backendArticle.series.slug,
        description: backendArticle.series.description,
        part: backendArticle.seriesPart,
        totalParts: undefined // Can be calculated if needed
      } : undefined,
      template: backendArticle.template || null,
      order: backendArticle.customOrder || undefined,
      isFeatured: backendArticle.isFeatured || false,
      viewCount: backendArticle.viewCount || 0,
      analytics: {
        views: backendArticle.viewCount || 0,
        uniqueViews: backendArticle.viewCount || 0, // Placeholder
        avgReadTime: backendArticle.readTime || 5,
        completionRate: 75, // Placeholder
        lastViewed: backendArticle.updatedAt ? new Date(backendArticle.updatedAt) : undefined
      }
    };
  }

  private mapBackendCategoryToFrontend(backendCategory: string): any {
    const categoryMap: { [key: string]: string } = {
      'NEWS': 'news',
      'TRAINING': 'training', 
      'TACTICS': 'tactics',
      'PSYCHOLOGY': 'psychology',
      'NUTRITION': 'nutrition',
      'TECHNIQUE': 'technique',
      'FITNESS': 'fitness',
      'INTERVIEWS': 'interviews',
      'ANALYSIS': 'analysis',
      'YOUTH': 'youth',
      'CONDITIONING': 'conditioning',
      'PERIODIZATION': 'periodization',
      'MANAGEMENT': 'management'
    };
    
    return categoryMap[backendCategory] || 'news';
  }

  private mapBackendZonesToFrontend(backendZones: any[]): string[] {
    return backendZones.map(zone => zone.zone.toLowerCase());
  }

  private mapBackendZoneSettings(backendZones: any[]) {
    const defaultZoneSettings = {
      read: { visible: false, requiresSubscription: false },
      coach: { visible: false, requiresSubscription: true },
      player: { visible: false, requiresSubscription: true },
      parent: { visible: false, requiresSubscription: true }
    };

    backendZones.forEach(zone => {
      const zoneName = zone.zone.toLowerCase();
      if (zoneName in defaultZoneSettings) {
        (defaultZoneSettings as any)[zoneName] = {
          visible: zone.visible,
          requiresSubscription: zone.requiresSubscription,
          freeAfterDate: zone.freeAfterDate ? new Date(zone.freeAfterDate) : undefined
        };
      }
    });

    return defaultZoneSettings;
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

  async createArticle(articleData: any) {
    // Transform frontend Article format to backend API format
    const transformedData = {
      title: articleData.title || 'Untitled Article',
      slug: articleData.slug || this.generateSlug(articleData.title),
      excerpt: articleData.excerpt || '',
      content: articleData.content || '',
      featuredImageUrl: articleData.featuredImage || articleData.featuredImageUrl || undefined,
      category: articleData.category?.toUpperCase() || 'NEWS',
      subcategory: articleData.subcategory || undefined,
      tags: articleData.tags || [],
      readTime: articleData.readTime || Math.ceil((articleData.content || '').split(' ').length / 200) || 5,
      isPremium: articleData.isPremium || false,
      premiumReleaseDate: articleData.premiumSchedule?.releaseFree?.toISOString?.() || undefined,
      isPermanentPremium: articleData.premiumSchedule?.isPermanentPremium || false,
      isFeatured: articleData.isFeatured || false,
      customOrder: articleData.order || undefined,
      status: articleData.status?.toUpperCase() || 'DRAFT',
      seoTitle: articleData.seo?.title || undefined,
      seoDescription: articleData.seo?.description || undefined,
      zones: this.mapZonesToBackend(articleData.zones || ['read']),
    };

    console.log('📤 Transformed article data for backend:', transformedData);

    const response = await apiClient.post('/articles', transformedData);

    // Backend returns {success: true, data: articleData, message: '...'}
    const createdArticle = response.data || response;
    return this.transformBackendArticleToFrontend(createdArticle);
  }

  private generateSlug(title: string): string {
    if (!title) return `article-${Date.now()}`;

    // Cyrillic to Latin transliteration map
    const cyrillicToLatin: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh', 'з': 'z',
      'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
      'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
      'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': 'y', 'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'Zh', 'З': 'Z',
      'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P',
      'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch',
      'Ш': 'Sh', 'Щ': 'Sht', 'Ъ': 'A', 'Ь': 'Y', 'Ю': 'Yu', 'Я': 'Ya'
    };

    return title
      .split('')
      .map(char => cyrillicToLatin[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100);
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

  private mapZonesToBackend(frontendZones: any[]) {
    // ZoneType enum values from backend: READ, coach, player, parent, series
    const zoneMap: { [key: string]: string } = {
      'read': 'READ',
      'coach': 'coach',
      'player': 'player',
      'parent': 'parent',
      'series': 'series'
    };

    return frontendZones.map(zone => {
      // Handle both string zones and zone objects
      const zoneStr = typeof zone === 'string' ? zone : zone.zone || zone;
      const zoneLower = String(zoneStr).toLowerCase();

      return {
        zone: zoneMap[zoneLower] || 'READ',
        visible: true,
        requiresSubscription: zoneLower !== 'read' // Only read zone is free by default
      };
    });
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
  // ANALYTICS API
  // ========================================

  async getAnalyticsDashboard(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'day' | 'week' | 'month' | 'year';
  }) {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.period) searchParams.append('period', params.period);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`/analytics/dashboard${query}`);
  }

  async getRealTimeAnalytics() {
    return apiClient.get('/analytics/realtime');
  }

  async getArticleAnalytics(articleId: string, params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`/analytics/articles/${articleId}/detailed${query}`);
  }

  async getUserActivity(userId: string, params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`/analytics/users/${userId}/activity${query}`);
  }

  async getPerformanceMetrics() {
    return apiClient.get('/analytics/performance');
  }

  async exportAnalytics(type: 'dashboard' | 'articles' | 'users', format: 'json' | 'csv' = 'json') {
    return apiClient.get(`/analytics/export?type=${type}&format=${format}`);
  }

  async trackEvent(action: string, resourceType?: string, resourceId?: string, metadata?: any) {
    return apiClient.post('/analytics/track', { action, resourceType, resourceId, metadata });
  }

  async getAdvancedAnalytics(params: {
    metric: 'user_retention' | 'content_performance' | 'engagement_funnel' | 'revenue_analytics';
    groupBy?: string;
    startDate?: string;
    endDate?: string;
    filters?: Record<string, any>;
  }) {
    return apiClient.post('/analytics/advanced', params);
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