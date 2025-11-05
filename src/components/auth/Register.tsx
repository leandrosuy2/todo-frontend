import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input } from '../shared';

export function Register() {
  const { register, isLoading, registerError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Mostrar erro do servidor quando houver
  useEffect(() => {
    if (registerError) {
      const errorMessage = registerError.toLowerCase();
      // Tentar identificar qual campo o erro se refere
      if (errorMessage.includes('email') || errorMessage.includes('já existe') || errorMessage.includes('already exists')) {
        setErrors(prev => ({ ...prev, email: registerError }));
      } else if (errorMessage.includes('senha') || errorMessage.includes('password')) {
        setErrors(prev => ({ ...prev, password: registerError }));
      } else if (errorMessage.includes('nome') || errorMessage.includes('name')) {
        setErrors(prev => ({ ...prev, name: registerError }));
      } else {
        // Se não for específico, mostrar no campo de email (mais comum)
        setErrors(prev => ({ ...prev, email: registerError }));
      }
    }
  }, [registerError]);

  // Limpar erros quando o usuário começar a digitar
  const handleInputChange = (field: 'name' | 'email' | 'password' | 'confirmPassword', value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Limpar erro de confirmação de senha se ambas as senhas coincidirem
      if (field === 'password' && updated.confirmPassword && value === updated.confirmPassword) {
        setErrors(prevErrors => {
          if (prevErrors.confirmPassword === 'As senhas não coincidem') {
            return { ...prevErrors, confirmPassword: undefined };
          }
          return prevErrors;
        });
      }
      if (field === 'confirmPassword' && updated.password && value === updated.password) {
        setErrors(prevErrors => {
          if (prevErrors.confirmPassword === 'As senhas não coincidem') {
            return { ...prevErrors, confirmPassword: undefined };
          }
          return prevErrors;
        });
      }
      return updated;
    });
    // Limpar erro do campo específico quando o usuário começar a digitar
    setErrors(prev => {
      if (prev[field]) {
        return { ...prev, [field]: undefined };
      }
      return prev;
    });
  };

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Limpar erros anteriores
    setErrors({});
    
    if (validate()) {
      const { confirmPassword, ...registerData } = formData;
      register(registerData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl shadow-md mb-2 sm:mb-3 transform hover:scale-105 transition-transform">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Crie sua conta</h1>
          <p className="text-xs sm:text-sm text-gray-600">Comece a organizar suas tarefas hoje</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 text-center">Cadastro</h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <Input
              label="Nome"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              placeholder="Seu nome completo"
              disabled={isLoading}
            />
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
            <Input
              label="Confirmar Senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="w-full mt-4 sm:mt-5"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Cadastrar
            </Button>
          </form>
          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-200">
            <p className="text-center text-xs sm:text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
              >
                Faça login
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

