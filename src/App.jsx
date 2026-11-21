import React, { useState, useEffect } from "react";
import Storefront from "./components/Storefront.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

export default function App() {
  const [view, setView] = useState("store"); // "store" or "admin"
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({
    whatsapp: "992886006528",
    whatsappFormatted: "+992 88 600 65 28",
    instagram: "@hadidja_shop_tj",
    instagramUrl: "https://www.instagram.com/hadidja_shop_tj/",
    address: "г. Душанбе, Таджикистан",
    announcement: "✦ БЕСПЛАТНАЯ ДОСТАВКА ПО ДУШАНБЕ ОТ 250 СОМОНИ · ПРИМЕРКА ПЕРЕД ОПЛАТОЙ · ЗАКАЗ В WHATSAPP",
    freeShippingThreshold: 250,
    currency: "сомони"
  });

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hadidja_cart_v2") || "[]");
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hadidja_favs_v2") || "[]");
    } catch {
      return [];
    }
  });

  // Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Toast notification
  const [toasts, setToasts] = useState([]);

  const showToast = (message, icon = "fa-sparkles") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  // Sync data from Backend API
  const fetchData = async () => {
    try {
      // 1. Fetch settings
      const settingsRes = await fetch("/api/settings");
      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        setSettings(sData);
      }
    } catch (err) {
      console.warn("API settings offline, using local defaults.");
    }

    try {
      // 2. Fetch products
      const prodRes = await fetch("/api/products");
      if (prodRes.ok) {
        const pData = await prodRes.json();
        if (Array.isArray(pData) && pData.length > 0) {
          setProducts(pData);
          localStorage.setItem("hadidja_products_cache", JSON.stringify(pData));
          return;
        }
      }
    } catch (err) {
      console.warn("API products offline, loading from local cache.");
    }

    // Fallback to local cache if offline
    const cached = localStorage.getItem("hadidja_products_cache");
    if (cached) {
      try {
        setProducts(JSON.parse(cached));
      } catch (e) {}
    }
  };

  useEffect(() => {
    fetchData();

    // Check hash for #admin
    if (window.location.hash === "#admin") {
      setView("admin");
    }

    // Secret hotkey Ctrl+Shift+A
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a" || e.key === "Ф" || e.key === "ф")) {
        setView((prev) => (prev === "store" ? "admin" : "store"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Save cart & favorites to localStorage
  useEffect(() => {
    localStorage.setItem("hadidja_cart_v2", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("hadidja_favs_v2", JSON.stringify(favorites));
  }, [favorites]);

  // Cart operations
  const handleAddToCart = (product, colorIdx, size, qty = 1) => {
    const colors = product.colors || [{ name: "Основной", quantity: 5 }];
    const color = colors[colorIdx] || { name: "Основной", quantity: 5 };
    const key = `${product.id}-${colorIdx}-${size}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      const maxStock = color.quantity || 99;
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, qty: Math.min(maxStock, item.qty + qty) }
            : item
        );
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: color.image || product.image,
          fallback: product.fallback,
          color: color.name,
          colorIndex: colorIdx,
          size,
          qty,
          maxStock
        }
      ];
    });
  };

  const updateCartQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.key === key) {
            const newQty = item.qty + delta;
            if (newQty <= 0) return null;
            if (newQty > item.maxStock) {
              showToast(`Максимум в наличии: ${item.maxStock} шт.`);
              return item;
            }
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
    showToast("Товар удалён из корзины");
  };

  // Favorites operations
  const handleToggleFavorite = (id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        showToast("Товар удалён из избранного");
        return prev.filter((x) => x !== id);
      } else {
        showToast("❤️ Добавлено в избранное!");
        return [...prev, id];
      }
    });
  };

  // Promo code
  const handleApplyPromo = () => {
    const val = promoCode.trim().toUpperCase();
    if (val === "HADIDJA" || val === "HADIDJA10" || val === "DUSHANBE") {
      setAppliedDiscount(10);
      showToast("✨ Промокод применён! Скидка 10% на ваш заказ.");
    } else {
      showToast("Промокод не найден");
    }
  };

  // Cart Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const finalTotal = appliedDiscount > 0 ? Math.round(subtotal * (1 - appliedDiscount / 100)) : subtotal;
  const freeThreshold = settings.freeShippingThreshold || 250;
  const shippingPct = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  // WhatsApp checkout from cart
  const handleCheckoutFromCart = async () => {
    if (cart.length === 0) return;

    let message = `✨ *ЗАКАЗ ИЗ ИНТЕРНЕТ-МАГАЗИНА HADIDJA SHOP* ✨\n`;
    message += `────────────────────────────\n`;
    message += `🛍 *СОСТАВ КОРЗИНЫ:*\n\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   • Расцветка: ${item.color}\n`;
      if (item.size) message += `   • Размер: ${item.size}\n`;
      message += `   • Количество: ${item.qty} шт.\n`;
      message += `   • Сумма: ${item.price * item.qty} ${settings.currency || "сомони"}\n\n`;
    });

    if (appliedDiscount > 0) {
      message += `🏷 *Промокод:* -${appliedDiscount}% (Скидка: ${subtotal - finalTotal} сомони)\n\n`;
    }

    message += `────────────────────────────\n`;
    message += `💰 *ИТОГО К ОПЛАТЕ:* *${finalTotal} ${settings.currency || "сомони"}*\n`;
    if (finalTotal >= freeThreshold) {
      message += `🚚 *Доставка:* БЕСПЛАТНАЯ (акция от ${freeThreshold} сомони)\n`;
    }
    message += `────────────────────────────\n\n`;
    message += `Пожалуйста, подтвердите наличие и адрес доставки! 🌸`;

    // Log order to backend
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Клиент корзины",
          customerPhone: "Через WhatsApp",
          customerAddress: "Душанбе",
          total: finalTotal,
          items: cart
        })
      });
    } catch (err) {}

    const waUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    setIsCartOpen(false);
    setCart([]);
    showToast("Заказ сформирован! Переходим в WhatsApp...");
  };

  return (
    <div>
      {view === "store" ? (
        <Storefront
          products={products}
          settings={settings}
          cart={cart}
          favorites={favorites}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          onNavigateToAdmin={() => setView("admin")}
          showToast={showToast}
        />
      ) : (
        <AdminPanel
          products={products}
          settings={settings}
          onRefreshData={fetchData}
          onNavigateToStore={() => setView("store")}
          showToast={showToast}
        />
      )}

      {/* ==================== CART DRAWER ==================== */}
      <aside className={`side-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Ваша корзина</h3>
          <button className="drawer-close" onClick={() => setIsCartOpen(false)}>×</button>
        </div>

        <div style={{ padding: "16px 24px 0" }}>
          <div className="free-shipping-progress">
            <div className="shipping-text">
              {subtotal >= freeThreshold ? (
                <span style={{ color: "#3b8754" }}><i className="fa-solid fa-truck-fast"></i> Доставка по Душанбе БЕСПЛАТНА!</span>
              ) : (
                <>
                  <span>До бесплатной доставки:</span>
                  <b>{freeThreshold - subtotal} {settings.currency || "сомони"}</b>
                </>
              )}
            </div>
            <div className="shipping-bar-track">
              <div className="shipping-bar-fill" style={{ width: `${shippingPct}%` }}></div>
            </div>
          </div>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
              <i className="fa-solid fa-bag-shopping" style={{ fontSize: "42px", color: "var(--gold-primary)", marginBottom: "14px", display: "block" }}></i>
              <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "6px" }}>Корзина пока пуста</h4>
              <p style={{ fontSize: "13px" }}>Выберите красивые платки или платья из каталога</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.key} className="drawer-item">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = "images/placeholder.jpg"; }}
                />
                <div className="drawer-item-info">
                  <h4>{item.name}</h4>
                  <small>{item.color}{item.size ? ` · ${item.size}` : ""}</small>
                  <div className="drawer-qty-controls">
                    <button onClick={() => updateCartQty(item.key, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.key, 1)}>+</button>
                  </div>
                  <div className="drawer-item-price">{item.price * item.qty} {settings.currency || "сомони"}</div>
                </div>
                <button className="drawer-remove-btn" onClick={() => removeFromCart(item.key)} title="Удалить">
                  <i className="fa-regular fa-trash-can"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="coupon-input-box">
              <input
                type="text"
                placeholder="Промокод (HADIDJA)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handleApplyPromo}>Применить</button>
            </div>

            <div className="drawer-total-row">
              <span>Итого к оплате:</span>
              <strong>{finalTotal} {settings.currency || "сомони"}</strong>
            </div>

            <button className="btn btn-whatsapp full" onClick={handleCheckoutFromCart}>
              <i className="fa-brands fa-whatsapp"></i> Оформить заказ в WhatsApp
            </button>
          </div>
        )}
      </aside>

      {/* ==================== FAVORITES DRAWER ==================== */}
      <aside className={`side-drawer ${isFavoritesOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Избранное ({favorites.length})</h3>
          <button className="drawer-close" onClick={() => setIsFavoritesOpen(false)}>×</button>
        </div>

        <div className="drawer-body">
          {favorites.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
              <i className="fa-regular fa-heart" style={{ fontSize: "42px", color: "var(--gold-primary)", marginBottom: "14px", display: "block" }}></i>
              <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "6px" }}>В избранном пока пусто</h4>
              <p style={{ fontSize: "13px" }}>Нажимайте на сердечко в каталоге, чтобы сохранить понравившиеся модели</p>
            </div>
          ) : (
            products
              .filter((p) => favorites.includes(p.id))
              .map((p) => (
                <div key={p.id} className="drawer-item">
                  <img
                    src={p.image}
                    alt={p.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = "images/placeholder.jpg"; }}
                  />
                  <div className="drawer-item-info">
                    <h4>{p.name}</h4>
                    <small>{p.material || ""}</small>
                    <div className="drawer-item-price">{p.price} {settings.currency || "сомони"}</div>
                    <button
                      className="btn btn-luxury"
                      style={{ padding: "6px 14px", fontSize: "10px", marginTop: "8px" }}
                      onClick={() => {
                        handleAddToCart(p, 0, p.sizes ? p.sizes[0] : p.size || "", 1);
                        showToast(`«${p.name}» добавлен в корзину!`);
                      }}
                    >
                      В корзину
                    </button>
                  </div>
                  <button className="drawer-remove-btn" onClick={() => handleToggleFavorite(p.id)} title="Удалить">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))
          )}
        </div>
      </aside>

      {/* Backdrop overlay for drawers */}
      {(isCartOpen || isFavoritesOpen) && (
        <div
          className="overlay"
          onClick={() => {
            setIsCartOpen(false);
            setIsFavoritesOpen(false);
          }}
        ></div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <i className={`fa-solid ${t.icon}`}></i>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
