'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks';

interface AuthGuardProps {
  children: React.ReactNode;
  isPublicRoute?: boolean;
}

const AuthGuard = ({ children, isPublicRoute = false }: AuthGuardProps) => {
  const { isAuthenticated, loading: authLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (isPublicRoute) {
      if (isAuthenticated) {
        router.push('/private');
      }
    } else {
      if (!isAuthenticated) {
        router.push('/public/login');
      }
    }
  }, [isAuthenticated, authLoading, isPublicRoute, router, pathname]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">Checking authentication...</div>
      </div>
    );
  }

  if ((!isPublicRoute && isAuthenticated) || (isPublicRoute && !isAuthenticated)) {
    return <>{children}</>;
  }

  return null;
};

export default AuthGuard;
