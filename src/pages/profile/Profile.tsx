import React, { useState, useEffect } from "react";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ExternalLink,
  Phone,
  Sun,
  Moon
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { orderService } from "../../services/orderService";
import { userService } from "../../services/userService";
import { Order, Product, Address } from "../../types";
import { EmptyState, Loader } from "../../components/common/Loader";
import { Link } from "react-router-dom";

export const Profile: React.FC = () => {
  const { profile, updateProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "favorites" | "addresses" | "settings">("profile");

  // Profile Form
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(false);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddressText, setNewAddressText] = useState("");
  const [newCity, setNewCity] = useState("Душанбе");
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      // Load user private data
      setLoadingOrders(true);
      orderService.getUserOrders(profile.id).then((res) => {
        setOrders(res);
        setLoadingOrders(false);
      });

      setLoadingFavs(true);
      userService.getFavorites(profile.id).then((res) => {
        setFavorites(res);
        setLoadingFavs(false);
      });

      userService.getAddresses(profile.id).then((res) => {
        setAddresses(res);
      });
    }
  }, [profile?.id]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");
    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl.trim()
      });
      setProfileMsg("Профиль успешно обновлен!");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch (err: any) {
      setProfileMsg("Ошибка: " + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressText.trim() || !profile) return;

    try {
      const added = await userService.addAddress({
        user_id: profile.id,
        full_name: profile.full_name,
        phone: profile.phone || "+992",
        city: newCity,
        address: newAddressText.trim(),
        is_default: addresses.length === 0
      });
      setAddresses([added, ...addresses]);
      setNewAddressText("");
      setIsAddingAddress(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!profile) return;
    await userService.deleteAddress(id, profile.id);
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleRemoveFavorite = async (productId: number) => {
    if (!profile) return;
    await userService.removeFavorite(profile.id, productId);
    setFavorites(favorites.filter((p) => p.id !== productId));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-border">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-full border-2 border-gold-primary/40 bg-muted flex items-center justify-center text-gold-primary overflow-hidden shrink-0 shadow-gold">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-foreground break-words">
              {profile?.full_name || "Личный кабинет"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 break-all">
              {profile?.email} · Покупатель бутика HADIDJA
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="w-full sm:w-auto self-start sm:self-auto min-h-11 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Выйти из аккаунта</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 pt-6 sm:pt-8">
        
        {/* Sidebar Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 lg:col-span-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full min-h-12 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-2xl text-left text-xs font-semibold tracking-wide transition-all ${
              activeTab === "profile"
                ? "bg-gold-primary/15 text-gold-dark dark:text-gold-light border border-gold-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <User className="w-4 h-4 text-gold-primary" />
            <span>Мой профиль</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full min-h-12 flex items-center justify-between gap-2 px-3 sm:px-4 py-3 rounded-2xl text-left text-xs font-semibold tracking-wide transition-all ${
              activeTab === "orders"
                ? "bg-gold-primary/15 text-gold-dark dark:text-gold-light border border-gold-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <span className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-gold-primary" />
              <span>Мои заказы</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`w-full min-h-12 flex items-center justify-between gap-2 px-3 sm:px-4 py-3 rounded-2xl text-left text-xs font-semibold tracking-wide transition-all ${
              activeTab === "favorites"
                ? "bg-gold-primary/15 text-gold-dark dark:text-gold-light border border-gold-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <span className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-gold-primary" />
              <span>Избранное</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">
              {favorites.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full min-h-12 flex items-center justify-between gap-2 px-3 sm:px-4 py-3 rounded-2xl text-left text-xs font-semibold tracking-wide transition-all ${
              activeTab === "addresses"
                ? "bg-gold-primary/15 text-gold-dark dark:text-gold-light border border-gold-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <span className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gold-primary" />
              <span>Адреса доставки</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">
              {addresses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full min-h-12 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-2xl text-left text-xs font-semibold tracking-wide transition-all ${
              activeTab === "settings"
                ? "bg-gold-primary/15 text-gold-dark dark:text-gold-light border border-gold-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <Settings className="w-4 h-4 text-gold-primary" />
            <span>Настройки темы</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-w-0 lg:col-span-3">
          
          {/* TAB 1: PROFILE EDIT */}
          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-3xl p-4 sm:p-8 shadow-sm">
              <h3 className="font-serif font-bold text-xl text-foreground mb-1">Личные данные</h3>
              <p className="text-xs text-muted-foreground mb-6">Информация для доставки заказов</p>

              {profileMsg && (
                <div className="p-3 mb-6 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-dark dark:text-gold-light text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{profileMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    ФИО / Ваше имя
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Email (Supabase Auth)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profile?.email || ""}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-muted-foreground text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Номер телефона для связи курьера
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+992 9X XXX XX XX"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Аватарка / Фото (URL)
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="min-h-11 w-full sm:w-auto justify-center py-3 px-6 rounded-xl bg-gold-gradient text-noir font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-gold hover:opacity-95 transition-opacity disabled:opacity-50 mt-4"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? "Сохранение..." : "Сохранить изменения"}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === "orders" && (
            <div className="bg-card border border-border rounded-3xl p-4 sm:p-8 shadow-sm">
              <h3 className="font-serif font-bold text-xl text-foreground mb-1">История заказов</h3>
              <p className="text-xs text-muted-foreground mb-6">Только ваши оформленные заказы (RLS защищено)</p>

              {loadingOrders ? (
                <Loader text="Загрузка ваших заказов..." />
              ) : orders.length === 0 ? (
                <EmptyState
                  icon={<ShoppingBag className="w-10 h-10" />}
                  title="У вас пока нет заказов"
                  description="Выберите понравившийся шёлковый платок или платье в каталоге и оформите заказ!"
                  action={
                    <a
                      href="/#catalog"
                      className="px-5 py-2.5 rounded-xl bg-gold-gradient text-noir font-bold text-xs tracking-wider uppercase inline-block shadow-gold"
                    >
                      Перейти в каталог
                    </a>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl border border-border bg-background flex flex-col gap-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
                        <div>
                          <span className="font-bold text-sm text-foreground">Заказ #{order.id}</span>
                          <span className="text-xs text-muted-foreground ml-3">
                            {new Date(order.created_at).toLocaleDateString("ru-RU", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          order.status === "Выполнен"
                            ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                            : order.status === "В доставке"
                            ? "bg-blue-500/15 text-blue-500 border border-blue-500/30"
                            : "bg-gold-primary/15 text-gold-dark dark:text-gold-light border border-gold-primary/30"
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 py-1 text-xs">
                        {order.order_items?.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-muted-foreground">
                            <span>
                              {it.product_name} {it.color ? `(${it.color})` : ""} × {it.quantity}
                            </span>
                            <span className="font-semibold text-foreground">{it.price * it.quantity} с.</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                        <span className="text-muted-foreground">Адрес: {order.customer_address}</span>
                        <span className="font-serif font-bold text-base text-gold-primary">
                          Итого: {order.total_price} сомони
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAVORITES */}
          {activeTab === "favorites" && (
            <div className="bg-card border border-border rounded-3xl p-4 sm:p-8 shadow-sm">
              <h3 className="font-serif font-bold text-xl text-foreground mb-1">Моё избранное</h3>
              <p className="text-xs text-muted-foreground mb-6">Товары, которые вам понравились</p>

              {loadingFavs ? (
                <Loader text="Загрузка избранного..." />
              ) : favorites.length === 0 ? (
                <EmptyState
                  icon={<Heart className="w-10 h-10" />}
                  title="Список избранного пуст"
                  description="Нажмите на сердечко в каталоге, чтобы сохранить понравившиеся платки сюда."
                  action={
                    <a
                      href="/#catalog"
                      className="px-5 py-2.5 rounded-xl bg-gold-gradient text-noir font-bold text-xs tracking-wider uppercase inline-block shadow-gold"
                    >
                      Смотреть каталог
                    </a>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 rounded-2xl border border-border bg-background flex items-center gap-4 group"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-sm text-foreground truncate">
                          {product.name}
                        </h4>
                        <span className="text-gold-primary font-bold text-sm block mt-1">
                          {product.price} сомони
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <Link
                            to={`/product/${product.id}`}
                            className="inline-flex min-h-10 items-center text-[11px] text-gold-primary hover:underline font-semibold"
                          >
                            Подробнее
                          </Link>
                          <span>·</span>
                          <button
                            onClick={() => handleRemoveFavorite(product.id)}
                            className="inline-flex min-h-10 items-center text-[11px] text-destructive hover:underline"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="bg-card border border-border rounded-3xl p-4 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-serif font-bold text-xl text-foreground mb-1">Адреса доставки</h3>
                  <p className="text-xs text-muted-foreground">Для быстрого оформления заказов</p>
                </div>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="min-h-11 w-full sm:w-auto justify-center flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-dark dark:text-gold-light text-xs font-semibold hover:bg-gold-primary/25 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить адрес</span>
                  </button>
                )}
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="p-4 mb-6 rounded-2xl border border-border bg-background space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Новый адрес</h4>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Город</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Улица, дом, квартира</label>
                    <input
                      type="text"
                      required
                      placeholder="ул. Рудаки 15, кв. 4"
                      value={newAddressText}
                      onChange={(e) => setNewAddressText(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      type="submit"
                      className="min-h-11 px-4 py-2 rounded-xl bg-gold-gradient text-noir text-xs font-bold"
                    >
                      Сохранить адрес
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="min-h-11 px-4 py-2 rounded-xl border border-border text-foreground text-xs"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              )}

              {addresses.length === 0 && !isAddingAddress ? (
                <EmptyState
                  icon={<MapPin className="w-10 h-10" />}
                  title="Нет сохраненных адресов"
                  description="Добавьте адрес доставки, чтобы не вводить его каждый раз при заказе."
                />
              ) : (
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <div
                      key={a.id}
                      className="p-4 rounded-2xl border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gold-primary mt-1 shrink-0" />
                        <div>
                          <p className="font-semibold text-sm text-foreground">{a.city}, {a.address}</p>
                          <span className="text-xs text-muted-foreground">{a.full_name} · {a.phone}</span>
                          {a.is_default && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-gold-primary/20 text-gold-dark dark:text-gold-light text-[10px] font-bold">
                              Основной
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(a.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-card border border-border rounded-3xl p-4 sm:p-8 shadow-sm">
              <h3 className="font-serif font-bold text-xl text-foreground mb-1">Настройки интерфейса</h3>
              <p className="text-xs text-muted-foreground mb-6">Персонализация отображения магазина</p>

              <div className="p-4 rounded-2xl border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-foreground">Тема оформления</h4>
                  <p className="text-xs text-muted-foreground">Переключение между тёмной и светлой темой</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="min-h-11 w-full sm:w-auto justify-center px-4 py-2 rounded-xl border border-border flex items-center gap-2 text-xs font-semibold hover:border-gold-primary transition-colors text-foreground"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4 text-gold-primary" /> : <Moon className="w-4 h-4" />}
                  <span>{theme === "dark" ? "Тёмная тема" : "Светлая тема"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
