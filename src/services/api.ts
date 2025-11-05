import axios, { AxiosError } from 'axios';
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  Task, 
  CreateTaskData, 
  UpdateTaskData,
  TasksResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ApiClient {
  private client: ReturnType<typeof axios.create>;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.client.interceptors.request.use(
      (config) => {
        let token = localStorage.getItem('token');
        if (token) {
          // Se o token foi salvo com JSON.stringify pelo useLocalStorage, precisa fazer parse
          try {
            const parsed = JSON.parse(token);
            token = parsed;
          } catch {
            // Se não conseguir fazer parse, usar o token como está (já é string)
          }
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para tratar erros de autenticação
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Só redirecionar se for 401 E não for uma requisição de login/register
        // Isso evita redirecionar quando o erro de login é esperado
        if (error.response?.status === 401) {
          const url = error.config?.url || '';
          // Não redirecionar se for erro de login ou register
          if (!url.includes('/login') && !url.includes('/register')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Usar navigate apenas se estivermos em uma rota protegida
            // Não fazer reload completo da página
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Autenticação
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>('/login', credentials);
    return data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>('/register', userData);
    return data;
  }

  // Tarefas
  async getTasks(params?: { 
    status?: 'all' | 'pending' | 'completed'; 
    page?: number; 
    limit?: number 
  }): Promise<TasksResponse> {
    // Preparar parâmetros validados e convertidos para números inteiros
    const queryParams: Record<string, number | string> = {};
    
    if (params) {
      // Status: só envia se for 'pending' ou 'completed'
      if (params.status && params.status !== 'all') {
        queryParams.status = params.status;
      }
      
      // Page: garantir que seja número inteiro >= 1
      if (params.page !== undefined && params.page !== null) {
        const pageNum = Math.max(1, Math.floor(Number(params.page)));
        if (!isNaN(pageNum) && isFinite(pageNum)) {
          queryParams.page = pageNum;
        }
      }
      
      // Limit: garantir que seja número inteiro entre 1 e 100
      if (params.limit !== undefined && params.limit !== null) {
        const limitNum = Math.min(100, Math.max(1, Math.floor(Number(params.limit))));
        if (!isNaN(limitNum) && isFinite(limitNum)) {
          queryParams.limit = limitNum;
        }
      }
    }
    
    // Usar paramsSerializer do axios para garantir formato correto
    const { data } = await this.client.get<TasksResponse>('/tasks', {
      params: queryParams,
      paramsSerializer: (params) => {
        const parts: string[] = [];
        for (const key in params) {
          const value = params[key];
          if (value !== undefined && value !== null) {
            parts.push(`${key}=${encodeURIComponent(value)}`);
          }
        }
        return parts.join('&');
      }
    });
    return data;
  }

  async getTaskById(id: number): Promise<Task> {
    const { data } = await this.client.get<Task>(`/tasks/${id}`);
    return data;
  }

  async createTask(taskData: CreateTaskData): Promise<Task> {
    const { data } = await this.client.post<Task>('/tasks', taskData);
    return data;
  }

  async updateTask(id: number, taskData: UpdateTaskData): Promise<Task> {
    const { data } = await this.client.put<Task>(`/tasks/${id}`, taskData);
    return data;
  }

  async deleteTask(id: number): Promise<void> {
    await this.client.delete(`/tasks/${id}`);
  }

  async toggleTaskStatus(id: number): Promise<Task> {
    const { data } = await this.client.patch<Task>(`/tasks/${id}/complete`);
    return data;
  }
}

export const apiClient = new ApiClient();
