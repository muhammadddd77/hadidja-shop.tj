import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  MapPin,
  User,
  CreditCard,
  MessageCircle,
  ArrowLeft,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { orderService } from "../../services/orderService";
import { userService } from "../../services/userService";
import { Order } from "../../types";
import { Loader } from "../../components/common/Loader";

export const Checkout: React.FC = () => {
  const { user, profile } = useAuth();
  const {
    cart: items,
    subtotal,
    totalPrice,
    discount: discountAmount,
    discountPercent,
    promoCode,
    clearCart,
    freeShippingThreshold
  } = useCart();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+992 ");
  const [city, setCity] = useState("г. Душанбе");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Наличными курьеру (после примерки)");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Delivery fee
  const deliveryFee = totalPrice >= freeShippingThreshold ? 0 : (items.length > 0 ? 20 : 0);
  const finalTotal = Math.max(0, totalPrice + deliveryFee);

  useEffect(() => {
    // Redirect if cart is empty and not completed
    if (items.length === 0 && !completedOrder) {
      navigate("/cart");
    }

    // Auto-fill from profile and user address
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.phone) setPhone(profile.phone);
    }

    if (user) {
      userService.getAddresses(user.id).then((addresses) => {
        const def = addresses.find((a) => a.is_default) || addresses[0];
        if (def) {
          if (def.city) setCity(def.city);
          if (def.address) setAddress(def.address);
          if (def.phone && !phone) setPhone(def.phone);
        }
      });
    }
  }, [user, profile, items.length, completedOrder, navigate]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Укажите ваше имя");
      return;
    }
    if (!phone.trim() || phone.trim() === "+992") {
      setError("Укажите контактный номер телефона для курьера");
      return;
    }
    if (!address.trim()) {
      setError("Укажите адрес доставки в Душанбе");
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        user_id: user?.id || null,
        customer_name: fullName.trim(),
        customer_phone: phone.trim(),
        customer_address: `${city}, ${address.trim()}`,
        total_price: finalTotal,
        payment_method: paymentMethod,
        notes: notes.trim()
      };

      const orderItems = items.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.name,
        color: i.color.name,
        size: i.size,
        quantity: i.quantity,
        price: i.product.price,
        image: i.color.image || i.product.image
      }));

      const newOrder = await orderService.createOrder(orderPayload, orderItems);
      setCompletedOrder(newOrder);
      clearCart();

    } catch (err: any) {
      console.error("Order creation error", err);
      setError(err.message || "Не удалось сохранить заказ. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppConfirmationLink = () => {
    if (!completedOrder) return "";
    let text = `Ассалому алейкум, HADIDJA SHOP!\nЯ оформил(а) заказ #${completedOrder.id} на сайте:\n\n`;
    text += `✦ Покупатель: ${completedOrder.customer_name}\n`;
    text += `✦ Телефон: ${completedOrder.customer_phone}\n`;
    text += `✦ Адрес: ${completedOrder.customer_address}\n`;
    text += `✦ Оплата: ${completedOrder.payment_method}\n`;
    text += `✦ Сумма к оплате: ${completedOrder.total_price} сомони\n\n`;
    text += `Пожалуйста, подтвердите доставку!`;
    return `https://wa.me/992886006528?text=${encodeURIComponent(text)}`;
  };

  // Confirmation Success View
  if (completedOrder) {
    return (
      <div className="py-16 sm:py-24 bg-background">
        <div className="max-w-xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">
              Заказ успешно оформлен
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Спасибо за ваш заказ!
            </h1>
            <p className="text-muted-foreground text-sm">
              Номер вашего заказа: <strong className="text-foreground">#{completedOrder.id}</strong>. Наш менеджер свяжется с вами в течение 10–15 минут для подтверждения времени доставки.
            </p>
          </div>

          {/* WhatsApp Direct Notification */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm text-left space-y-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-whatsapp shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">Ускорьте подтверждение в WhatsApp</h4>
                <p className="text-xs text-muted-foreground">Нажмите кнопку ниже, чтобы отправить детали заказа менеджеру напрямую</p>
              </div>
            </div>

            <a
              href={getWhatsAppConfirmationLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-2xl bg-whatsapp text-white font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-whatsapp-dark shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Отправить в WhatsApp менеджеру</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {user && (
              <Link
                to="/profile"
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-border text-foreground text-xs font-medium hover:bg-muted transition-colors"
              >
                Мои заказы в профиле
              </Link>
            )}
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-noir dark:bg-gold-primary text-white dark:text-noir text-xs font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Вернуться на главную
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-14 pb-24 lg:pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back */}
        <Link to="/cart" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться в корзину</span>
        </Link>

        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">
            Шаг 2 из 2
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mt-1">
            Оформление Доставки
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Delivery Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Customer Contact */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-gold-dark dark:text-gold-light" />
                  <span>Контактные данные</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Ваше имя *</label>
                    <input
                      type="text"
                      required
                      placeholder="Имя и фамилия"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:border-gold-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Номер телефона *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+992 88 600 65 28"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:border-gold-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold-dark dark:text-gold-light" />
                  <span>Адрес доставки</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Город / Регион</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:border-gold-primary transition-colors"
                    >
                      <option value="г. Душанбе">г. Душанбе</option>
                      <option value="г. Худжанд">г. Худжанд</option>
                      <option value="г. Бохтар">г. Бохтар</option>
                      <option value="г. Куляб">г. Куляб</option>
                      <option value="Другой регион Таджикистана">Другой регион Таджикистана</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Улица, дом, квартира, ориентир *</label>
                    <input
                      type="text"
                      required
                      placeholder="напр., ул. Рудаки 45, кв. 12 (напротив ЦУМ)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:border-gold-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-medium text-foreground">Комментарий к заказу (пожелания по времени)</label>
                  <textarea
                    rows={2}
                    placeholder="Например: удобнее принять после 17:00, домофон не работает"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:border-gold-primary transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gold-dark dark:text-gold-light" />
                  <span>Способ оплаты</span>
                </h3>

                <div className="space-y-2.5">
                  {[
                    {
                      id: "Наличными курьеру (после примерки)",
                      title: "Наличными при получении",
                      desc: "Примерьте изделия при курьере и оплатите только подходящие"
                    },
                    {
                      id: "Корти Милли / Dushanbe City / Alif",
                      title: "Перевод (Корти Милли / DC / Alif)",
                      desc: "Оплата по номеру или QR-коду после согласования с менеджером"
                    },
                    {
                      id: "Перевод Kaspi / Сбербанк",
                      title: "Kaspi QR или Сбербанк Онлайн",
                      desc: "Для заказов из стран СНГ или держателей зарубежных карт"
                    }
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-gold-primary bg-gold-primary/5 ring-1 ring-gold-primary/30"
                          : "border-border hover:border-gold-primary/40 bg-card"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 accent-gold-dark text-gold-dark"
                      />
                      <div>
                        <div className="text-sm font-semibold text-foreground">{method.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{method.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Order Review */}
            <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-foreground">
                Ваш заказ ({items.reduce((s, i) => s + i.quantity, 0)} шт.)
              </h3>

              {/* Items scroll */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/50">
                    <img
                      src={item.color.image || item.product.image}
                      alt={item.product.name}
                      className="w-12 h-14 rounded-lg object-cover bg-muted shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-foreground truncate">{item.product.name}</div>
                      <div className="text-[11px] text-muted-foreground">{item.color.name} · {item.quantity} шт.</div>
                    </div>
                    <div className="text-xs font-bold text-foreground font-serif">
                      {item.product.price * item.quantity} TJS
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-muted-foreground border-t border-border pt-4">
                <div className="flex justify-between">
                  <span>Подытог:</span>
                  <span className="text-foreground">{subtotal} TJS</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Скидка ({promoCode}, {discountPercent}%):</span>
                    <span>-{discountAmount} TJS</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Доставка ({city}):</span>
                  <span className="text-foreground">
                    {deliveryFee === 0 ? "Бесплатно" : `${deliveryFee} TJS`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
                  <span>К оплате:</span>
                  <span className="font-serif text-2xl">{finalTotal} TJS</span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
                  {error}
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-noir dark:bg-gold-primary text-white dark:text-noir font-semibold text-xs sm:text-sm tracking-wider uppercase hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Оформление заказа...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Подтвердить заказ ({finalTotal} TJS)</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-muted-foreground text-center leading-relaxed">
                ✦ Нажимая кнопку, вы соглашаетесь на примерку и оплату при получении заказа курьеру.
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
