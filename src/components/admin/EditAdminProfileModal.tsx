import React, { useState } from "react";
import { X, User, Mail, Phone, Lock, Save, Camera, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export const EditAdminProfileModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { profile, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");

  // Password fields
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Имя не может быть пустым");
      return;
    }

    if (changePassword) {
      if (!newPassword || newPassword.length < 6) {
        setError("Новый пароль должен содержать минимум 6 символов");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Пароли не совпадают");
        return;
      }
    }

    setLoading(true);
    try {
      // 1. Update Profile details in Supabase profiles
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl.trim()
      });

      // 2. If password change requested, call authService
      if (changePassword && newPassword) {
        await authService.updatePassword(newPassword);
      }

      setSuccess(true);
      onSuccess?.("Данные профиля администратора успешно обновлены!");
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Ошибка обновления профиля");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-noir/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center text-gold-primary font-bold text-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-foreground">Профиль Администратора</h3>
            <p className="text-xs text-muted-foreground">Настройки персонального доступа и данных</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Изменения сохранены!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar URL / Photo */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Фото / Аватар профиля (URL)
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-border bg-muted flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... или ссылка на фото"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Имя администратора *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Мухаммад"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary"
              />
            </div>
          </div>

          {/* Email (Readonly for safety or managed) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Email администратора (Supabase Auth)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
              <input
                type="email"
                disabled
                value={email}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Email привязан к Supabase Auth и используется для входа в панель.
            </span>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Контактный телефон
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+992 88 600 65 28"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary"
              />
            </div>
          </div>

          {/* Change Password Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
                className="rounded border-border text-gold-primary focus:ring-gold-primary w-4 h-4"
              />
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gold-primary" />
                Сменить пароль доступа
              </span>
            </label>
          </div>

          {changePassword && (
            <div className="space-y-3 pt-2 p-4 rounded-xl bg-muted/40 border border-border animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Новый пароль (от 6 символов)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Подтвердите новый пароль
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gold-gradient text-noir font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Сохранение..." : "Сохранить изменения"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-border text-foreground hover:bg-muted/50 text-xs font-semibold"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
