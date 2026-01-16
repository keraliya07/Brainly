const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers,
      });

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          return { error: 'Invalid response from server' };
        }
      } else {
        const text = await response.text();
        if (!response.ok) {
          return { error: text || `Server error: ${response.status}` };
        }
        return { error: 'Unexpected response format' };
      }

      if (!response.ok) {
        return { error: data.error || data.message || `Error: ${response.status} ${response.statusText}` };
      }

      return { data };
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return { 
          error: 'Cannot connect to server. Please make sure the backend server is running on http://localhost:3000' 
        };
      }
      return { error: error instanceof Error ? error.message : 'Network error occurred' };
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();

export const authApi = {
  signup: async (username: string, email: string, password: string) => {
    return api.post<{ user: any; token: string }>('/auth/signup', {
      username,
      email,
      password,
    });
  },

  login: async (email: string, password: string) => {
    return api.post<{ user: any; token: string }>('/auth/login', {
      email,
      password,
    });
  },
};

export const contentApi = {
  getAll: async (params?: { type?: string; tagId?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.tagId) queryParams.append('tagId', params.tagId.toString());
    if (params?.search) queryParams.append('search', params.search);
    const query = queryParams.toString();
    return api.get<{ count: number; contents: any[] }>(`/content${query ? `?${query}` : ''}`);
  },

  getHome: async () => {
    return api.get<{ count: number; contents: any[] }>('/content/home');
  },

  getById: async (id: number) => {
    return api.get<{ content: any }>(`/content/${id}`);
  },

  create: async (data: {
    title: string;
    description: string;
    link?: string;
    type: string;
    tagIds?: number[];
  }) => {
    return api.post<{ content: any }>('/content', data);
  },

  update: async (id: number, data: {
    title?: string;
    description?: string;
    link?: string;
    type?: string;
    tagIds?: number[];
  }) => {
    return api.put<{ content: any }>(`/content/${id}`, data);
  },

  delete: async (id: number) => {
    return api.delete<{ message: string }>(`/content/${id}`);
  },
};

export const tagApi = {
  getAll: async () => {
    return api.get<{ count: number; tags: any[] }>('/tags');
  },

  create: async (title: string) => {
    return api.post<{ tag: any }>('/tags', { title });
  },
};
