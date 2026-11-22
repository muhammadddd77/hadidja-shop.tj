import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader } from "../components/common/Loader";

export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen text="Загрузка профиля..." />;
  }

  // Not logged in -> go to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If Admin accidentally navigates to /profile -> redirect to /admin (Requirement 6.1)
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
