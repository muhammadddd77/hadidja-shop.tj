import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export const Login: React.FC = () => {
  const { signIn, role } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Пожалуйста, введите email и пароль");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn(email, password);
      
      // Role-based redirect as required by Section 6.1:
      // Admin -> /admin
      // User -> /profile or previous location
      if (res.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        const from = (location.state as any)?.from?.pathname || "/profile";
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors relative overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-gold-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-gold-primary/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Monogram */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center group">
            <div className="w-14 h-14 rounded-full border border-gold-primary/40 bg-background flex items-center justify-center text-gold-primary font-serif font-bold text-2xl shadow-gold group-hover:scale-105 transition-transform mb-3">
              H
            </div>
            <span className="font-serif font-bold text-2xl tracking-widest text-foreground">
              HADIDJA
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-gold-primary uppercase">
              Boutique · Dushanbe
            </span>
          </Link>
          <h2 className="text-xl font-serif font-bold text-foreground mt-4">
            Вход в систему
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Для покупателей и администраторов бутика
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Электронная почта (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Пароль
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-gold-primary hover:underline"
              >
                Забыли пароль?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border text-gold-primary focus:ring-gold-primary w-4 h-4"
              />
              <span className="text-muted-foreground">Запомнить меня</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gold-gradient text-noir font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold hover:opacity-95 transition-all mt-4 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-noir border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Войти</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Tip */}
        <div className="mt-6 p-3 rounded-xl bg-muted/40 border border-border text-center text-xs text-muted-foreground">
          <span>👑 Администратор: <strong>muhammadganiev235@gmail.com</strong></span>
        </div>

        {/* Register Link */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Ещё нет аккаунта?{" "}
          <Link to="/register" className="text-gold-primary font-bold hover:underline">
            Зарегистрироваться
          </Link>
        </p>

        {/* Return to store */}
        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Вернуться на витрину
          </Link>
        </div>
      </div>
    </div>
  );
};
