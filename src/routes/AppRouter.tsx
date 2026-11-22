import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { ClientLayout } from "../components/layout/ClientLayout";
import { AdminLayout } from "../components/layout/AdminLayout";

// Guards
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";

// Auth Pages
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { ForgotPassword } from "../pages/auth/ForgotPassword";

// Client Pages
import { Home } from "../pages/client/Home";
import { ProductDetails } from "../pages/client/ProductDetails";
import { Cart } from "../pages/client/Cart";
import { Checkout } from "../pages/client/Checkout";
import { Profile } from "../pages/profile/Profile";

// Admin Pages
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { AdminProducts } from "../pages/admin/AdminProducts";
import { AdminCategories } from "../pages/admin/AdminCategories";
import { AdminOrders } from "../pages/admin/AdminOrders";
import { AdminCustomers } from "../pages/admin/AdminCustomers";
import { AdminSettings } from "../pages/admin/AdminSettings";

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Client Facing Storefront */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        
        {/* Protected User Account */}
        <Route 
          path="profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
