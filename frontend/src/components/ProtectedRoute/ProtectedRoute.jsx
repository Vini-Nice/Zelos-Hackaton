"use client";

import { useAuth } from '@/components/AuthProvider/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children, requireAdmin = false, requireTecnico = false }) => {
  const { user, loading, isAuthenticated, isAdmin, isTecnico } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (requireAdmin && !isAdmin) {
        router.push('/');
        return;
      }

      if (requireTecnico && !isTecnico) {
        router.push('/');
        return;
      }
    }
  }, [loading, isAuthenticated, isAdmin, isTecnico, requireAdmin, requireTecnico, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (requireTecnico && !isTecnico) {
    return null;
  }

  return children;
};
