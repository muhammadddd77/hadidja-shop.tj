import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { authService } from "../../services/authService";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");
    try {
      await authService.resetPassword(email.trim());
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Ошибка отправки ссылки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors relative">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться ко входу</span>
        </Link>

        <h2 className="text-xl font-serif font-bold text-foreground mb-2">
          Восстановление пароля
        </h2>
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Введите email, указанный при регистрации. Мы отправим вам защищенную ссылку для смены пароля через Supabase Auth.
        </p>

        {error && (
          <div className="p-3 mb-6 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-medium">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs flex flex-col items-center text-center gap-2">
            <CheckCircle2 className="w-8 h-8 mb-1" />
            <h4 className="font-bold text-sm">Письмо отправлено!</h4>
            <p>Проверьте вашу почту ({email}) и перейдите по ссылке для установки нового пароля.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Ваш Email
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gold-gradient text-noir font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold hover:opacity-95 transition-all mt-4 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Отправка..." : "Отправить ссылку"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
