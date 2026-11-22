import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  MessageCircle, 
  Truck, 
  Check, 
  Tag
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { EmptyState } from "../../components/common/Loader";

export const Cart: React.FC = () => {
  const { 
    cart: items,
    subtotal,
    totalPrice,
    discount: discountAmount,
    discountPercent,
    updateQuantity, 
    removeFromCart, 
    clearCart,
    freeShippingThreshold,
    promoCode,
    applyPromoCode,
    removePromoCode
  } = useCart();
  const navigate = useNavigate();

  const [inputPromo, setInputPromo] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);

  // Delivery fee calculation
  const deliveryFee = totalPrice >= freeShippingThreshold ? 0 : (items.length > 0 ? 20 : 0);
  const finalTotal = Math.max(0, totalPrice + deliveryFee);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);
  const freeShippingProgress = Math.min(100, Math.round((totalPrice / freeShippingThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!inputPromo.trim()) return;

    const success = applyPromoCode(inputPromo.trim());
    if (!success) {
      setPromoError("Неверный промокод. Попробуйте HADIDJA10");
    } else {
      setInputPromo("");
    }
  };

  const getWhatsAppCartOrder = () => {
    let text = `Ассалому алейкум, HADIDJA SHOP!\nХочу оформить заказ из корзины:\n\n`;
    items.forEach((item, index) => {
      text += `${index + 1}. ${item.product.name}\n   Цвет: ${item.color.name} | Кол-во: ${item.quantity} шт. | ${item.product.price * item.quantity} сомони\n`;
    });
    text += `\n✦ Подытог: ${subtotal} сомони\n`;
    if (discountPercent > 0) {
      text += `✦ Скидка по промокоду (${promoCode}): -${discountAmount} сомони\n`;
    }
    text += `✦ Доставка: ${deliveryFee === 0 ? "БЕСПЛАТНО" : `${deliveryFee} сомони`}\n`;
    text += `✦ ИТОГО К ОПЛАТЕ: ${finalTotal} сомони\n\n`;
    text += `Адрес доставки в Душанбе: `;

    return `https://wa.me/992886006528?text=${encodeURIComponent(text)}`;
  };

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EmptyState
          title="Ваша корзина пуста"
          description="Вы ещё не выбрали ни одного изделия. Взгляните на нашу новую коллекцию платков и платьев!"
          actionLabel="Перейти к покупкам"
          onAction={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-14 pb-24 lg:pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">
              Оформление
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mt-1">
              Корзина Покупок
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="inline-flex min-h-11 items-center rounded-xl px-3 text-xs text-muted-foreground hover:text-rose-500 transition-colors self-start sm:self-auto"
          >
            Очистить корзину
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-8 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm font-medium mb-2.5">
            <div className="flex min-w-0 items-start gap-2">
              <Truck className="w-4 h-4 mt-0.5 shrink-0 text-gold-dark dark:text-gold-light" />
              <div className="min-w-0">
                {remainingForFreeShipping > 0 ? (
                  <span className="block">
                    До бесплатной доставки по Душанбе осталось{" "}
                    <strong className="text-foreground">{remainingForFreeShipping} TJS</strong>
                  </span>
                ) : (
                  <span className="flex items-start gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Поздравляем! Доставка по Душанбе бесплатная</span>
                  </span>
                )}
              </div>
            </div>
            <span className="self-end shrink-0 text-xs font-bold text-muted-foreground sm:self-auto">{freeShippingProgress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-primary to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Items List */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-2xl p-3 sm:p-4 flex items-start sm:items-center gap-3 sm:gap-4 shadow-xs"
              >
                {/* Thumbnail */}
                <Link
                  to={`/product/${item.product.id}`}
                  className="w-16 h-20 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-muted shrink-0"
                >
                  <img
                    src={item.color.image || item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-1">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-serif text-sm sm:text-base font-semibold text-foreground hover:text-gold-dark dark:hover:text-gold-light transition-colors truncate">
                          {item.product.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-muted transition-colors"
                        title="Удалить товар"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: item.color.hex }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.color.name} {item.size ? `· ${item.size}` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Item Total */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <div className="flex items-center border border-border rounded-xl bg-background">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors rounded-l-xl text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="w-9 text-center text-xs font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors rounded-r-xl text-sm font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="whitespace-nowrap font-serif text-sm sm:text-lg font-bold text-foreground">
                      {item.product.price * item.quantity} TJS
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code Input Box */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Промокод (напр. HADIDJA10)"
                      value={inputPromo}
                      onChange={(e) => setInputPromo(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs uppercase font-medium focus:border-gold-primary transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="min-h-11 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-noir dark:bg-gold-primary text-white dark:text-noir text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    Применить
                  </button>
                </div>

                {promoError && (
                  <p className="text-xs text-rose-500 font-medium">{promoError}</p>
                )}

                {promoCode && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-xl mt-2">
                    <span className="font-medium">Промокод «{promoCode}» активен (-{discountPercent}%)</span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="min-h-9 self-start rounded-lg px-2 text-rose-500 hover:underline font-semibold sm:self-auto"
                    >
                      Отменить
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground">
              Итог заказа
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Товары ({items.reduce((s, i) => s + i.quantity, 0)} шт.)</span>
                <span>{subtotal} TJS</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Скидка ({discountPercent}%)</span>
                  <span>-{discountAmount} TJS</span>
                </div>
              )}

              <div className="flex items-center justify-between text-muted-foreground">
                <span>Доставка по Душанбе</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-600 dark:text-emerald-400">Бесплатно</strong>
                  ) : (
                    `${deliveryFee} TJS`
                  )}
                </span>
              </div>

              <div className="pt-4 border-t border-border flex items-baseline justify-between text-foreground">
                <span className="font-bold text-base">К оплате:</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold">
                  {finalTotal} <span className="text-sm font-sans font-normal text-muted-foreground">сомони</span>
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <Link
                to="/checkout"
                className="w-full py-4 rounded-2xl bg-noir dark:bg-gold-primary text-white dark:text-noir font-semibold text-xs sm:text-sm tracking-wider uppercase hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>Перейти к оформлению</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={getWhatsAppCartOrder()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-whatsapp text-white font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-whatsapp-dark shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Быстрый заказ через WhatsApp</span>
              </a>
            </div>

            {/* Safety Guarantee */}
            <div className="text-[11px] text-muted-foreground text-center pt-2 leading-relaxed">
              ✦ Оплата курьеру наличными или картой после примерки. Вы оплачиваете только то, что вам подошло.
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
