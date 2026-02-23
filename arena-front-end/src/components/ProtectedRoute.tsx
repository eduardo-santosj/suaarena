'use client';

import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, allowedRoles, fallback }: ProtectedRouteProps) {
  const { hasPermission, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!hasPermission(allowedRoles)) {
    return fallback || <div>Acesso negado. Você não tem permissão para acessar esta página.</div>;
  }

  return <>{children}</>;
}