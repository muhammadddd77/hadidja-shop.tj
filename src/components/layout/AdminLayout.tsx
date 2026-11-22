import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingBag, 
  Users, 
  Settings, 
  Eye, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { EditAdminProfileModal } from "../admin/EditAdminProfileModal";
import { isSupabaseConfigured } from "../../services/supabase";

export const AdminLayout: React.FC = () => {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const supabaseConfigured = isSupabaseConfigured();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const navItems = [
    { to: "/admin", label: "Обзор (Dashboard)", icon: LayoutDashboard, end: true },
    { to: "/admin/products", label: "Товары (Products)", icon: Package },
    { to: "/admin/categories", label: "Категории (Categories)", icon: Tags },
    { to: "/admin/orders", label: "Заказы (Orders CRM)", icon: ShoppingBag },
    { to: "/admin/customers", label: "Клиенты (Customers)", icon: Users },
    { to: "/admin/settings", label: "Настройки (Settings)", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-noir/75 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-64 shrink-0 bg-card border-r border-border flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Sidebar Header */}
        <div className="h-18 flex items-center justify-between px-6 border-b border-border">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-gold-primary/50 bg-background flex items-center justify-center text-gold-primary font-serif font-bold text-lg shadow-gold">
              H
            </div>
            <div>
              <span className="font-serif font-bold text-lg tracking-wider text-foreground leading-none block">
                HADIDJA
              </span>
              <span className="text-[9px] font-bold tracking-widest text-gold-primary uppercase">
                ADMIN CONSOLE
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all
                  ${isActive 
                    ? "bg-gold-primary/15 text-gold-dark dark:text-gold-light border border-gold-primary/30 shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}
                `}
              >
                <Icon className="w-4 h-4 text-gold-primary shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2 bg-muted/20">
          {/* Quick link to client shop */}
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gold-primary" />
              <span>Витрина магазина</span>
            </span>
            <span className="text-[10px] text-muted-foreground">↗</span>
          </Link>

          {/* Admin Profile Card (Click to Edit) */}
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="w-full flex items-center gap-3 p-2 rounded-xl bg-card border border-border hover:border-gold-primary/40 transition-colors text-left"
            title="Редактировать профиль администратора"
          >
            <div className="w-8 h-8 rounded-full border border-gold-primary/40 bg-muted flex items-center justify-center text-gold-primary shrink-0 overflow-hidden text-xs font-bold">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-foreground block truncate">
                {profile?.full_name || "Администратор"}
              </span>
              <span className="text-[10px] text-gold-primary font-medium block truncate">
                {profile?.email || "muhammadganiev235@gmail.com"}
              </span>
            </div>
          </button>

          {/* Theme & Logout */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="Переключить тему"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-gold-primary" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
              title="Выйти из системы"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="min-h-16 sm:min-h-[72px] h-auto px-3 sm:px-6 lg:px-8 py-3 border-b border-border bg-card/40 flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-foreground hover:text-gold-primary"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex min-w-0 items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-primary" />
              <span className="font-serif font-bold text-sm sm:text-base leading-tight text-foreground">
                Панель управления бутика HADIDJA
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase ${
              supabaseConfigured
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : "bg-amber-500/10 border-amber-500/20 text-amber-500"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                supabaseConfigured ? "bg-emerald-500" : "bg-amber-500"
              }`}></span>
              {supabaseConfigured ? "Supabase подключён" : "Локальный режим"}
            </span>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Edit Admin Profile Modal */}
      <EditAdminProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};
