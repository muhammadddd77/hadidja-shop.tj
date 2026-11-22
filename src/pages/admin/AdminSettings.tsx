import React, { useState } from "react";
import {
  Settings,
  Phone,
  Truck,
  MapPin,
  Bell,
  Save,
  Check,
  UserCheck,
  Key,
  ShieldCheck
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { EditAdminProfileModal } from "../../components/admin/EditAdminProfileModal";

export const AdminSettings: React.FC = () => {
  const { profile } = useAuth();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Store Configuration
  const [whatsapp, setWhatsapp] = useState("+992 88 600 65 28");
  const [instagram, setInstagram] = useState("@hadidja_shop_tj");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(250);
  const [deliveryFee, setDeliveryFee] = useState(20);
  const [address, setAddress] = useState("г. Душанбе, Таджикистан");
  const [announcement, setAnnouncement] = useState(
    "✦ БЕСПЛАТНАЯ ДОСТАВКА ПО ДУШАНБЕ ОТ 250 СОМОНИ · ПРИМЕРКА ПЕРЕД ОПЛАТОЙ · ТЕЛ: +992 88 600 65 28"
  );

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      "hadidja_store_settings",
      JSON.stringify({
        whatsapp,
        instagram,
        freeShippingThreshold,
        deliveryFee,
        address,
        announcement
      })
    );
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Toast */}
      {savedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-noir text-gold-light px-5 py-3 rounded-full text-xs font-semibold shadow-gold-lg flex items-center gap-2 border border-gold-primary/30">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Настройки магазина успешно сохранены</span>
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">
          Конфигурация
        </span>
        <h1 className="font-serif text-3xl font-bold text-foreground mt-1">
          Настройки Бутика & Профиль
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Контакты WhatsApp для приёма заказов, порог бесплатной доставки и параметры администратора
        </p>
      </div>

      {/* Admin Profile Section */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-primary/10 border border-gold-primary/30 text-gold-dark dark:text-gold-light flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground">
              {profile?.full_name || "Администратор"}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {profile?.email || "muhammadganiev235@gmail.com"}
            </p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
              Главный администратор (SuperAdmin)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditProfileOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-noir dark:bg-gold-primary text-white dark:text-noir text-xs font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xs"
        >
          <Key className="w-3.5 h-3.5" />
          <span>Сменить пароль / email</span>
        </button>
      </div>

      {/* Store Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        <h3 className="font-serif text-xl font-bold text-foreground border-b border-border pb-3">
          Параметры магазина HADIDJA SHOP
        </h3>

        {/* WhatsApp & Instagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-whatsapp" />
              <span>Номер WhatsApp для заказов</span>
            </label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:border-gold-primary"
            />
            <span className="text-[11px] text-muted-foreground">Куда клиенты отправляют заказ в 1 клик</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
              <FaInstagram className="w-3.5 h-3.5 text-pink-500" />
              <span>Instagram аккаунт</span>
            </label>
            <input
              type="text"
              required
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
            />
            <span className="text-[11px] text-muted-foreground">Отображается в шапке и подвале сайта</span>
          </div>
        </div>

        {/* Shipping settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-gold-dark dark:text-gold-light" />
              <span>Порог бесплатной доставки (TJS)</span>
            </label>
            <input
              type="number"
              required
              min={0}
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
            />
            <span className="text-[11px] text-muted-foreground">Заказы от этой суммы доставляются бесплатно</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Стоимость обычной доставки (TJS)</span>
            </label>
            <input
              type="number"
              required
              min={0}
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
            />
            <span className="text-[11px] text-muted-foreground">Если заказ меньше бесплатного порога</span>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <label className="text-xs font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gold-dark dark:text-gold-light" />
            <span>Адрес бутика / шоурума</span>
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
          />
        </div>

        {/* Top Announcement Bar */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <label className="text-xs font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-gold-dark dark:text-gold-light" />
            <span>Текст верхней полосы объявлений (Announcement Bar)</span>
          </label>
          <textarea
            rows={2}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-border flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-noir dark:bg-gold-primary text-white dark:text-noir text-xs font-semibold uppercase tracking-wider hover:opacity-90 shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить настройки</span>
          </button>
        </div>

      </form>

      {/* Edit Admin Profile Modal */}
      <EditAdminProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

    </div>
  );
};
