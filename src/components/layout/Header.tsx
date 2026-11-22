import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  User,
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  X,
  Phone,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useCart } from "../../contexts/CartContext";

export const Header: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 text-foreground backdrop-blur-lg border-b border-border shadow-sm transition-colors duration-200">
      {/* Announcement Bar */}
      <div className="bg-muted/60 border-b border-border py-1.5 px-3 sm:px-4 text-center text-[10px] sm:text-xs leading-relaxed tracking-wide text-muted-foreground">
        <span>
          ✦ БЕСПЛАТНАЯ ДОСТАВКА ПО ДУШАНБЕ ОТ 250 СОМОНИ · ПРИМЕРКА ПЕРЕД ОПЛАТОЙ · ТЕЛ: +992 88 600 65 28
        </span>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold-primary/40 bg-card flex items-center justify-center text-gold-primary font-serif font-bold text-xl shadow-gold group-hover:scale-105 transition-transform">
            H
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg sm:text-2xl tracking-widest text-foreground leading-none">
              HADIDJA
            </span>
            <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.2em] text-gold-dark dark:text-gold-light/70 uppercase mt-1">
              Atelier · Dushanbe
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-sm font-medium" aria-label="Основная навигация">
          <Link to="/" className="text-foreground/80 hover:text-gold-primary transition-colors">
            Главная
          </Link>
          <a href="/#catalog" className="text-foreground/80 hover:text-gold-primary transition-colors">
            Каталог
          </a>
          <a href="/#categories" className="text-foreground/80 hover:text-gold-primary transition-colors">
            Коллекции
          </a>
          <a href="/#dresses" className="text-foreground/80 hover:text-gold-primary transition-colors">
            Платья &amp; Абайи
          </a>
          <a href="/#contacts" className="text-foreground/80 hover:text-gold-primary transition-colors">
            Контакты
          </a>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="min-w-10 min-h-10 p-2.5 rounded-full text-foreground/80 hover:text-gold-primary hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary"
            title={theme === "dark" ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
            aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-gold-primary" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="min-w-10 min-h-10 p-2.5 relative rounded-full text-foreground/80 hover:text-gold-primary hover:bg-muted/70 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary"
            aria-label={`Корзина${totalCount > 0 ? `, товаров: ${totalCount}` : ""}`}
            title="Корзина"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-gold-primary text-noir font-bold text-[10px] flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>

          {/* User / Auth */}
          {user ? (
            isAdmin ? (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-gold-primary/15 border border-gold-primary/40 text-gold-dark dark:text-gold-light hover:bg-gold-primary/25 transition-all text-xs font-semibold"
                title="Панель администратора"
              >
                <ShieldCheck className="w-4 h-4 text-gold-primary" />
                <span>Админка</span>
              </Link>
            ) : (
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-muted/60 border border-border text-foreground hover:border-gold-primary/50 transition-all text-xs font-medium max-w-40"
                title="Мой профиль"
              >
                <User className="w-4 h-4 text-gold-primary shrink-0" />
                <span className="truncate">{profile?.full_name || "Профиль"}</span>
              </Link>
            )
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-gradient text-noir text-xs font-bold tracking-wider uppercase hover:opacity-95 transition-opacity"
            >
              <User className="w-3.5 h-3.5" />
              <span>Войти</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden min-w-10 min-h-10 p-2 rounded-lg text-foreground hover:text-gold-primary hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary"
            aria-label="Открыть меню"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden" aria-label="Мобильное меню">
          <button
            type="button"
            className="fixed inset-0 bg-noir/75 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
            aria-label="Закрыть меню"
          />

          <div className="relative w-[85%] max-w-xs bg-background text-foreground h-full shadow-2xl border-r border-border flex flex-col p-5 sm:p-6 z-10 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-gold-primary/40 bg-card flex items-center justify-center text-gold-primary font-serif font-bold text-lg">
                  H
                </div>
                <span className="font-serif font-bold text-lg tracking-wider text-foreground">
                  HADIDJA
                </span>
              </div>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="min-w-10 min-h-10 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary"
                aria-label="Закрыть меню"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 py-5 text-base font-medium" aria-label="Мобильная навигация">
              <Link to="/" onClick={closeMobileMenu} className="px-3 py-3 rounded-xl text-foreground hover:text-gold-primary hover:bg-muted/70 transition-colors">
                Главная
              </Link>
              <a href="/#catalog" onClick={closeMobileMenu} className="px-3 py-3 rounded-xl text-foreground hover:text-gold-primary hover:bg-muted/70 transition-colors">
                Каталог платков
              </a>
              <a href="/#categories" onClick={closeMobileMenu} className="px-3 py-3 rounded-xl text-foreground hover:text-gold-primary hover:bg-muted/70 transition-colors">
                Категории
              </a>
              <a href="/#dresses" onClick={closeMobileMenu} className="px-3 py-3 rounded-xl text-foreground hover:text-gold-primary hover:bg-muted/70 transition-colors">
                Платья &amp; Абайи
              </a>
              <a href="/#contacts" onClick={closeMobileMenu} className="px-3 py-3 rounded-xl text-foreground hover:text-gold-primary hover:bg-muted/70 transition-colors">
                Контакты и адрес
              </a>

              <div className="my-2 border-t border-border" />

              {user ? (
                isAdmin ? (
                  <Link to="/admin" onClick={closeMobileMenu} className="flex items-center gap-2 px-3 py-3 rounded-xl text-gold-dark dark:text-gold-light font-bold hover:bg-muted/70 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-gold-primary" />
                    Панель администратора
                  </Link>
                ) : (
                  <Link to="/profile" onClick={closeMobileMenu} className="flex items-center gap-2 px-3 py-3 rounded-xl text-foreground hover:text-gold-primary hover:bg-muted/70 transition-colors">
                    <User className="w-5 h-5 text-gold-primary" />
                    <span className="truncate">Мой аккаунт ({profile?.full_name || "Профиль"})</span>
                  </Link>
                )
              ) : (
                <Link to="/login" onClick={closeMobileMenu} className="flex items-center gap-2 px-3 py-3 rounded-xl text-gold-dark dark:text-gold-light font-bold hover:bg-muted/70 transition-colors">
                  <User className="w-5 h-5" />
                  Войти / Регистрация
                </Link>
              )}
            </nav>

            <div className="mt-auto pt-5 border-t border-border flex flex-col gap-3">
              <a
                href="https://wa.me/992886006528"
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-11 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Написать в WhatsApp</span>
              </a>

              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground pt-2">
                <span>Тема оформления:</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="min-h-10 px-3 py-2 rounded-full border border-border flex items-center gap-1.5 text-foreground hover:border-gold-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary"
                  aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
                >
                  {theme === "dark" ? (
                    <Sun className="w-3.5 h-3.5 text-gold-primary" />
                  ) : (
                    <Moon className="w-3.5 h-3.5" />
                  )}
                  <span>{theme === "dark" ? "Тёмная" : "Светлая"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}