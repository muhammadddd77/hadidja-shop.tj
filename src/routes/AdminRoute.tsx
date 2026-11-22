import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader } from "../components/common/Loader";

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen text="Проверка прав администратора..." />;
  }

  // Not logged in -> go to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in but NOT an admin -> Access Denied / redirect to Home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
