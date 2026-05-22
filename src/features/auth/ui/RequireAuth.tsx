import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { getSession } from '@/features/auth/lib/sessionStorage';

type RequireAuthProps = {
  children: ReactNode;
};

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const location = useLocation();
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};
