import { config } from '../config';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// API Service Class
class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/auth/profile');
  }

  // Teams endpoints
  async getTeams(params?: {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/teams?${searchParams.toString()}`);
  }

  async getTeam(id: string): Promise<ApiResponse<any>> {
    return this.request(`/teams/${id}`);
  }

  async createTeam(teamData: any): Promise<ApiResponse<any>> {
    return this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  async updateTeam(id: string, teamData: any): Promise<ApiResponse<any>> {
    return this.request(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData),
    });
  }

  async deleteTeam(id: string): Promise<ApiResponse> {
    return this.request(`/teams/${id}`, {
      method: 'DELETE',
    });
  }

  // Tournaments endpoints
  async getTournaments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    country?: string;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/tournaments?${searchParams.toString()}`);
  }

  async getTournament(id: string): Promise<ApiResponse<any>> {
    return this.request(`/tournaments/${id}`);
  }

  async createTournament(tournamentData: any): Promise<ApiResponse<any>> {
    return this.request('/tournaments', {
      method: 'POST',
      body: JSON.stringify(tournamentData),
    });
  }

  async updateTournament(id: string, tournamentData: any): Promise<ApiResponse<any>> {
    return this.request(`/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tournamentData),
    });
  }

  async deleteTournament(id: string): Promise<ApiResponse> {
    return this.request(`/tournaments/${id}`, {
      method: 'DELETE',
    });
  }

  // News endpoints
  async getNews(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/news?${searchParams.toString()}`);
  }

  async getNewsArticle(id: string): Promise<ApiResponse<any>> {
    return this.request(`/news/${id}`);
  }

  async createNews(newsData: any): Promise<ApiResponse<any>> {
    return this.request('/news', {
      method: 'POST',
      body: JSON.stringify(newsData),
    });
  }

  async updateNews(id: string, newsData: any): Promise<ApiResponse<any>> {
    return this.request(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newsData),
    });
  }

  async deleteNews(id: string): Promise<ApiResponse> {
    return this.request(`/news/${id}`, {
      method: 'DELETE',
    });
  }

  // Casters endpoints
  async getCasters(params?: {
    page?: number;
    limit?: number;
    type?: string;
    country?: string;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/casters?${searchParams.toString()}`);
  }

  async getCaster(id: string): Promise<ApiResponse<any>> {
    return this.request(`/casters/${id}`);
  }

  async createCaster(casterData: any): Promise<ApiResponse<any>> {
    return this.request('/casters', {
      method: 'POST',
      body: JSON.stringify(casterData),
    });
  }

  async updateCaster(id: string, casterData: any): Promise<ApiResponse<any>> {
    return this.request(`/casters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(casterData),
    });
  }

  async deleteCaster(id: string): Promise<ApiResponse> {
    return this.request(`/casters/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin endpoints
  async approveCaster(id: string): Promise<ApiResponse<any>> {
    return this.request(`/casters/${id}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectCaster(id: string): Promise<ApiResponse<any>> {
    return this.request(`/casters/${id}/reject`, {
      method: 'PATCH',
    });
  }

  async approveNews(id: string): Promise<ApiResponse<any>> {
    return this.request(`/news/${id}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectNews(id: string): Promise<ApiResponse<any>> {
    return this.request(`/news/${id}/reject`, {
      method: 'PATCH',
    });
  }

  // Draft endpoints
  async getDrafts(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/draft?${searchParams.toString()}`);
  }

  async getDraft(id: string): Promise<ApiResponse<any>> {
    return this.request(`/draft/${id}`);
  }

  async createDraft(draftData: any): Promise<ApiResponse<any>> {
    return this.request('/draft', {
      method: 'POST',
      body: JSON.stringify(draftData),
    });
  }

  async applyToDraft(draftId: string, applicationData: any): Promise<ApiResponse<any>> {
    return this.request(`/draft/${draftId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types
export type { ApiResponse, ApiError }; 