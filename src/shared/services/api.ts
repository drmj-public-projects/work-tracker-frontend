import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string, config = {}) {
    return this.instance.get<T>(url, config);
  }

  public post<T>(url: string, data = {}, config = {}) {
    return this.instance.post<T>(url, data, config);
  }

  public put<T>(url: string, data = {}, config = {}) {
    return this.instance.put<T>(url, data, config);
  }

  public patch<T>(url: string, data = {}, config = {}) {
    return this.instance.patch<T>(url, data, config);
  }

  public delete<T>(url: string, config = {}) {
    return this.instance.delete<T>(url, config);
  }
}

export const api = new ApiService();