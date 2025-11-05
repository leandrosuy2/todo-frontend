import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Verificar diretamente do localStorage - fonte única de verdade
  // Isso garante que sempre verifica o estado atual, não o estado React que pode estar desatualizado
  let hasAuth = false;
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    hasAuth = !!(token && user);
  } catch {
    hasAuth = false;
  }

  // Se não tem token/user no localStorage, redireciona
  if (!hasAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

