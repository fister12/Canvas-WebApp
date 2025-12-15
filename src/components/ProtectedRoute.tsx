import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Minimal implementation - allow rendering of children
  return <>{children}</>;
};

export default ProtectedRoute;
