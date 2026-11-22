import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export const Register: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать не менее 6 символов");
      return;
    }

    if (password !== confirmPassword) {
      setError("Введённые пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      const res = await signUp(email, password, fullName);
      if (res.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors relative overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 rounded-full bg-gold-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-gold-primary/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand */}
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
            Создать аккаунт
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Для сохранения истории заказов и персональных скидок
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Ваше имя *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Мадина"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Электронная почта (Email) *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="madina@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Придумайте пароль *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 6 символов"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Подтвердите пароль *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gold-gradient text-noir font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold hover:opacity-95 transition-all mt-6 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-noir border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Зарегистрироваться</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-gold-primary font-bold hover:underline">
            Войти в систему
          </Link>
        </p>
      </div>
    </div>
  );
};
