import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, Heart, ShoppingBag, User, ShieldCheck } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

export const MobileNavigation: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { totalCount } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border px-2 py-2 flex items-center justify-around shadow-2xl pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
      {/* Home */}
      <Link
        to="/"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
          isActive("/") ? "text-gold-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Главная</span>
      </Link>

      {/* Catalog */}
      <a
        href="/#catalog"
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Sparkles className="w-5 h-5" />
        <span>Каталог</span>
      </a>

      {/* Cart */}
      <Link
        to="/cart"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium relative transition-colors ${
          isActive("/cart") ? "text-gold-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {totalCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-gold-primary text-noir font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {totalCount}
            </span>
          )}
        </div>
        <span>Корзина</span>
      </Link>

      {/* Profile / Admin / Login */}
      {user ? (
        isAdmin ? (
          <Link
            to="/admin"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
              location.pathname.startsWith("/admin") ? "text-gold-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-gold-primary" />
            <span>Админка</span>
          </Link>
        ) : (
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
              location.pathname.startsWith("/profile") ? "text-gold-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Кабинет</span>
          </Link>
        )
      ) : (
        <Link
          to="/login"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
            isActive("/login") ? "text-gold-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Войти</span>
        </Link>
      )}
    </nav>
  );
};
