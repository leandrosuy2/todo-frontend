import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { useLocalStorage } from './useLocalStorage';
import type { User, LoginCredentials, RegisterData } from '../types';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [token, setToken] = useLocalStorage<string | null>('token', null);
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!token && !!user);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(!!token && !!user);
  }, [token, user]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => apiClient.login(credentials),
    onSuccess: (data) => {
      // Limpar erros
      setLoginError(null);
      // Atualizar estado - useLocalStorage vai fazer JSON.stringify automaticamente
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Login realizado com sucesso!');
      // Navegar após garantir que localStorage foi atualizado
      setTimeout(() => {
        navigate('/tasks', { replace: true });
      }, 100);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setLoginError(message);
      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => apiClient.register(userData),
    onSuccess: (data) => {
      // Limpar erros
      setRegisterError(null);
      // Atualizar estado - useLocalStorage vai fazer JSON.stringify automaticamente
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Cadastro realizado com sucesso!');
      // Navegar após garantir que localStorage foi atualizado
      setTimeout(() => {
        navigate('/tasks', { replace: true });
      }, 100);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Erro ao fazer cadastro';
      setRegisterError(message);
      toast.error(message);
    },
  });

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    queryClient.clear();
    toast.success('Logout realizado com sucesso!');
    navigate('/login');
  }, [setToken, setUser, navigate, queryClient]);

  const login = useCallback((credentials: LoginCredentials) => {
    // Limpar erro anterior antes de tentar novamente
    setLoginError(null);
    loginMutation.mutate(credentials);
  }, [loginMutation]);

  const register = useCallback((userData: RegisterData) => {
    // Limpar erro anterior antes de tentar novamente
    setRegisterError(null);
    registerMutation.mutate(userData);
  }, [registerMutation]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    loginError,
    registerError,
  };
}

