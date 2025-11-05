import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input } from '../shared';

export function Login() {
  const { login, isLoading, loginError } = useAuth();

  // Verificar se já está autenticado ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      window.location.href = '/tasks';
    }
  }, []);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Mostrar erro do servidor quando houver
  useEffect(() => {
    if (loginError) {
      // Se o erro mencionar senha ou credenciais, mostrar no campo de senha
      const errorMessage = loginError.toLowerCase();
      if (errorMessage.includes('senha') || errorMessage.includes('password') || errorMessage.includes('credenciais') || errorMessage.includes('inválid') || errorMessage.includes('incorret')) {
        setErrors(prev => ({ ...prev, password: loginError }));
      } else if (errorMessage.includes('email') || errorMessage.includes('usuário') || errorMessage.includes('user') || errorMessage.includes('não encontrado')) {
        setErrors(prev => ({ ...prev, email: loginError }));
      } else {
        // Se não for específico, mostrar no campo de senha (mais comum)
        setErrors(prev => ({ ...prev, password: loginError }));
      }
    }
  }, [loginError]);

  // Limpar erros quando o usuário começar a digitar após um erro
  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo específico quando o usuário começar a digitar
    setErrors(prev => {
      if (prev[field]) {
        return { ...prev, [field]: undefined };
      }
      return prev;
    });
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Limpar erros anteriores
    setErrors({});
    
    if (validate()) {
      login(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl shadow-md mb-2 sm:mb-3 transform hover:scale-105 transition-transform">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Bem-vindo de volta!</h1>
          <p className="text-xs sm:text-sm text-gray-600">Entre na sua conta para continuar</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              placeholder="seu@email.com"
              disabled={isLoading}
            />
            <Input
              label="Senha"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="w-full mt-4 sm:mt-5"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Entrar
            </Button>
          </form>
          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-200">
            <p className="text-center text-xs sm:text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2025 To-Do List
          </p>
        </div>
      </div>
    </div>
  );
}

