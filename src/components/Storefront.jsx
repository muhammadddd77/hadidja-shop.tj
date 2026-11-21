import React, { useState, useEffect } from "react";

export default function Storefront({
  products,
  settings,
  cart,
  favorites,
  onAddToCart,
  onToggleFavorite,
  onOpenCart,
  onOpenFavorites,
  onNavigateToAdmin,
  showToast
}) {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("popular");

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // 1-Click / Checkout Modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState("single"); // "single" or "cart"

  // Checkout Form fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Наличными курьеру при получении");
  const [customerNote, setCustomerNote] = useState("");

  // FAQ state
  const [openFaq, setOpenFaq] = useState(0);

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Back to top scroll state
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatMoney = (amount) => `${amount} ${settings.currency || "сомони"}`;

  // Filter & Sort Products
  const filteredProducts = products.filter((p) => {
    const matchesCat =
      activeCategory === "Все" ||
      (activeCategory === "Скидки"
        ? p.discount > 0
        : activeCategory === "Новинки"
        ? p.badge === "NEW" || p.badge === "PREMIUM"
        : p.category === activeCategory);

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.material?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  if (sortOption === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "discount") {
    filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }

  // Open Product Quick View
  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    const colors = product.colors || [{ name: "Основной", quantity: 5 }];
    const firstAvail = colors.findIndex((c) => (c.quantity || 0) > 0);
    setActiveColorIdx(firstAvail !== -1 ? firstAvail : 0);
    setSelectedSize(product.sizes ? product.sizes[0] : product.size || "");
    setQuantity(1);
  };

  // 1-Click WhatsApp Order
  const handleQuickOrder = (product) => {
    setSelectedProduct(product);
    const colors = product.colors || [{ name: "Основной", quantity: 5 }];
    const firstAvail = colors.findIndex((c) => (c.quantity || 0) > 0);
    setActiveColorIdx(firstAvail !== -1 ? firstAvail : 0);
    setSelectedSize(product.sizes ? product.sizes[0] : product.size || "");
    setQuantity(1);
    setCheckoutTarget("single");
    setIsCheckoutOpen(true);
  };

  // Submit WhatsApp Order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    const name = customerName.trim() || "Покупательница";
    const phone = customerPhone.trim() || "Не указан";
    const address = customerAddress.trim() || "г. Душанбе";

    let message = `✨ *ЗАКАЗ ИЗ ИНТЕРНЕТ-МАГАЗИНА HADIDJA SHOP* ✨\n`;
    message += `────────────────────────────\n`;
    message += `🛍 *СОСТАВ ЗАКАЗА:*\n\n`;

    let totalCost = 0;
    const orderItems = [];

    if (checkoutTarget === "single" && selectedProduct) {
      const colors = selectedProduct.colors || [{ name: "Основной" }];
      const color = colors[activeColorIdx] || { name: "Основной" };
      const lineCost = selectedProduct.price * quantity;
      totalCost = lineCost;

      message += `1. *${selectedProduct.name}*\n`;
      message += `   • Расцветка: ${color.name}\n`;
      if (selectedSize) message += `   • Размер: ${selectedSize}\n`;
      message += `   • Количество: ${quantity} шт.\n`;
      message += `   • Сумма: ${formatMoney(lineCost)}\n\n`;

      orderItems.push({
        id: selectedProduct.id,
        name: selectedProduct.name,
        color: color.name,
        size: selectedSize || "",
        qty: quantity,
        price: selectedProduct.price
      });
    }

    message += `────────────────────────────\n`;
    message += `💰 *ИТОГО К ОПЛАТЕ:* *${formatMoney(totalCost)}*\n`;
    if (totalCost >= (settings.freeShippingThreshold || 250)) {
      message += `🚚 *Доставка:* БЕСПЛАТНАЯ (акция от ${settings.freeShippingThreshold || 250} сомони)\n`;
    }
    message += `────────────────────────────\n\n`;

    message += `📍 *ДАННЫЕ ПОЛУЧАТЕЛЯ:*\n`;
    message += `• *Имя:* ${name}\n`;
    message += `• *Телефон:* ${phone}\n`;
    message += `• *Адрес доставки:* ${address}\n`;
    message += `• *Оплата:* ${paymentMethod}\n`;
    if (customerNote) message += `• *Пожелания:* ${customerNote}\n`;

    message += `\nПожалуйста, подтвердите наличие и удобное время доставки! 🌸`;

    // Save order to backend API
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          paymentMethod,
          note: customerNote,
          total: totalCost,
          items: orderItems
        })
      });
    } catch (err) {
      console.error("Order logging error:", err);
    }

    // Launch WhatsApp
    const waUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    setIsCheckoutOpen(false);
    showToast("✨ Заказ сформирован! Переходим в WhatsApp...");
  };

  return (
    <div>
      {/* ==================== ANNOUNCEMENT BAR ==================== */}
      <div className="announcement-bar">
        <div className="container inner">
          <span>{settings.announcement || "✦ БЕСПЛАТНАЯ ДОСТАВКА ПО ДУШАНБЕ ОТ 250 СОМОНИ"}</span>
          <span>
            ✦ ЗАКАЗ В WHATSAPP:{" "}
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">
              {settings.whatsappFormatted || `+${settings.whatsapp}`}
            </a>
          </span>
          <span>
            ✦ INSTAGRAM:{" "}
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
              {settings.instagram}
            </a>
          </span>
        </div>
      </div>

      {/* ==================== HEADER ==================== */}
      <header className="header">
        <div className="container nav">
          <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="logo-monogram">H</div>
            <div className="logo-text">
              <span className="logo-title">HADIDJA</span>
              <span className="logo-subtitle">ATELIER & BOUTIQUE · DUSHANBE</span>
            </div>
          </div>

          <nav className="nav-links">
            <a href="#home">Главная</a>
            <a href="#categories">Категории</a>
            <a href="#catalog">Каталог</a>
            <a href="#dresses">Платья</a>
            <a href="#instagram">Instagram</a>
            <a href="#reviews">Отзывы</a>
            <a href="#contacts">Контакты</a>
          </nav>

          <div className="nav-actions">
            {/* Admin entry link */}
            <button
              onClick={onNavigateToAdmin}
              className="admin-nav-link"
              title="Панель администратора"
            >
              <i className="fa-solid fa-lock"></i>
              <span>Админка</span>
            </button>

            {/* Wishlist */}
            <button className="action-btn" onClick={onOpenFavorites} aria-label="Избранное" title="Избранное">
              <i className="fa-regular fa-heart"></i>
              <span className="badge-count">{favorites.length}</span>
            </button>

            {/* Cart */}
            <button className="action-btn" onClick={onOpenCart} aria-label="Корзина" title="Корзина">
              <i className="fa-solid fa-bag-shopping"></i>
              <span className="badge-count">
                {cart.reduce((s, i) => s + (i.qty || 1), 0)}
              </span>
            </button>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-nav-btn"
            >
              <i className="fa-brands fa-whatsapp"></i>
              <span>WhatsApp</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              className="action-btn"
              style={{ display: "none" }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Меню"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="hero" id="home">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="hero-tagline">
              ✦ Новая коллекция 2026 · Душанбе
            </span>
            <h1 className="hero-title">
              Истинная роскошь<br />
              <em>в каждой детали.</em>
            </h1>
            <p className="hero-subtitle">
              Эксклюзивные шёлковые платки, дубайские палантины, премиальные турецкие хиджабы и элегантные платья для утончённого женского образа.
            </p>

            <div className="hero-buttons">
              <a href="#catalog" className="btn btn-luxury">
                Смотреть каталог <i className="fa-solid fa-arrow-right"></i>
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
              >
                <i className="fa-brands fa-whatsapp"></i> Консультация в WhatsApp
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-label">Натуральный шёлк</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">3 500+</span>
                <span className="stat-label">Довольных клиенток</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">24 ч.</span>
                <span className="stat-label">Доставка в Душанбе</span>
              </div>
            </div>
          </div>

          <div className="hero-media">
            <div className="hero-corner-seal">
              <span>HADIDJA</span>
              BOUTIQUE
            </div>
            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85"
                alt="HADIDJA SHOP Haute Couture"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "images/hero.jpg";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ADVANTAGES ==================== */}
      <section className="advantages-bar">
        <div className="container">
          <div className="advantages-grid">
            <div className="advantage-item">
              <div className="adv-icon"><i className="fa-solid fa-crown"></i></div>
              <div className="adv-info">
                <h4>Премиум ткани</h4>
                <p>Натуральный шёлк гирбишин, медина, шифон и королевский бархат.</p>
              </div>
            </div>
            <div className="advantage-item">
              <div className="adv-icon"><i className="fa-solid fa-truck-fast"></i></div>
              <div className="adv-info">
                <h4>Быстрая доставка</h4>
                <p>Доставка в день заказа по Душанбе и быстрая отправка в регионы РТ.</p>
              </div>
            </div>
            <div className="advantage-item">
              <div className="adv-icon"><i className="fa-solid fa-vest"></i></div>
              <div className="adv-info">
                <h4>Примерка перед оплатой</h4>
                <p>Курьер доставит несколько расцветок на выбор перед покупкой.</p>
              </div>
            </div>
            <div className="advantage-item">
              <div className="adv-icon"><i className="fa-brands fa-whatsapp"></i></div>
              <div className="adv-info">
                <h4>Заказ через WhatsApp</h4>
                <p>Прямая связь со стилистом-консультантом и мгновенное оформление.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES SHOWCASE ==================== */}
      <section className="section" id="categories">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">КОЛЛЕКЦИИ</span>
            <h2 className="section-title">Выберите <em>свой стиль</em></h2>
            <p className="section-desc">
              Изысканный ассортимент для любого повода: от повседневной грации до роскошных праздничных торжеств.
            </p>
          </div>

          <div className="category-showcase-grid">
            <div className="category-tile" onClick={() => { setActiveCategory("Платки"); document.getElementById("catalog").scrollIntoView({ behavior: "smooth" }); }}>
              <img src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=700&q=80" alt="Платки" />
              <div className="category-overlay">
                <span className="category-label">COLLECTION</span>
                <h3 className="category-name">Шёлковые платки</h3>
                <span className="category-arrow">Смотреть платки <i className="fa-solid fa-arrow-right"></i></span>
              </div>
            </div>

            <div className="category-tile" onClick={() => { setActiveCategory("Шарфы"); document.getElementById("catalog").scrollIntoView({ behavior: "smooth" }); }}>
              <img src="https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=700&q=80" alt="Шарфы" />
              <div className="category-overlay">
                <span className="category-label">COLLECTION</span>
                <h3 className="category-name">Шарфы & Палантины</h3>
                <span className="category-arrow">Смотреть шарфы <i className="fa-solid fa-arrow-right"></i></span>
              </div>
            </div>

            <div className="category-tile" onClick={() => { setActiveCategory("Хиджабы"); document.getElementById("catalog").scrollIntoView({ behavior: "smooth" }); }}>
              <img src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=700&q=80" alt="Хиджабы" />
              <div className="category-overlay">
                <span className="category-label">COLLECTION</span>
                <h3 className="category-name">Хиджабы Медина</h3>
                <span className="category-arrow">Смотреть хиджабы <i className="fa-solid fa-arrow-right"></i></span>
              </div>
            </div>

            <div className="category-tile" onClick={() => { setActiveCategory("Платья"); document.getElementById("catalog").scrollIntoView({ behavior: "smooth" }); }}>
              <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80" alt="Платья" />
              <div className="category-overlay">
                <span className="category-label">COLLECTION</span>
                <h3 className="category-name">Платья & Абайи</h3>
                <span className="category-arrow">Смотреть платья <i className="fa-solid fa-arrow-right"></i></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MAIN CATALOG ==================== */}
      <section className="section catalog-section" id="catalog">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">CATALOG · 2026</span>
            <h2 className="section-title">Наш <em>каталог</em></h2>
            <p className="section-desc">
              Все товары в наличии на нашем складе в Душанбе. Нажмите на понравившийся товар для выбора размера, цвета и моментального заказа.
            </p>
          </div>

          <div className="catalog-controls">
            <div className="filter-pills">
              {["Все", "Платки", "Шарфы", "Хиджабы", "Платья", "Аксессуары", "Новинки", "Скидки"].map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === "Все" ? "Все товары" : cat}
                </button>
              ))}
            </div>

            <div className="filter-search-row">
              <div className="search-field">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Поиск по названию, ткани или размеру..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="sort-field">
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="popular">По популярности</option>
                  <option value="price-asc">Сначала доступные (по цене)</option>
                  <option value="price-desc">Сначала премиальные</option>
                  <option value="discount">По величине скидки</option>
                </select>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <i className="fa-regular fa-folder-open" style={{ fontSize: "48px", color: "var(--gold-primary)", marginBottom: "16px" }}></i>
              <h3 style={{ fontSize: "24px", marginBottom: "8px" }}>Товары не найдены</h3>
              <p style={{ color: "var(--text-muted)" }}>Попробуйте изменить поисковый запрос или категорию.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((p) => {
                const isFav = favorites.includes(p.id);
                const colors = p.colors || [];

                return (
                  <article key={p.id} className="product-card">
                    <div className="product-image-box" onClick={() => handleOpenProduct(p)}>
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "images/placeholder.jpg";
                        }}
                      />
                      {p.badge && (
                        <span className={`card-badge ${p.discount ? "sale" : p.badge === "ХИТ" ? "hit" : p.badge === "NEW" ? "new" : ""}`}>
                          {p.discount ? `-${p.discount}%` : p.badge}
                        </span>
                      )}
                      <button
                        className={`card-fav-btn ${isFav ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(p.id);
                        }}
                        aria-label="В избранное"
                      >
                        <i className={`${isFav ? "fa-solid" : "fa-regular"} fa-heart`}></i>
                      </button>
                    </div>

                    <div className="product-details">
                      <span className="product-cat">{p.category}</span>
                      <h3 className="product-title" onClick={() => handleOpenProduct(p)}>
                        {p.name}
                      </h3>
                      <p className="product-meta">{p.size || ""} · {p.material || ""}</p>

                      <div className="color-swatches-preview">
                        {colors.slice(0, 4).map((c, i) => (
                          <span
                            key={i}
                            className="color-dot"
                            style={{ backgroundColor: c.hex || "#333" }}
                            title={`${c.name} (${c.quantity || 0} шт.)`}
                          ></span>
                        ))}
                        {colors.length > 4 && (
                          <span style={{ fontSize: "10px", color: "var(--text-light)" }}>
                            +{colors.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="price-container">
                        <span className="current-price">{formatMoney(p.price)}</span>
                        {p.oldPrice && <span className="old-price">{formatMoney(p.oldPrice)}</span>}
                        {p.discount ? (
                          <span className="discount-tag">Экономия {p.oldPrice - p.price} с.</span>
                        ) : null}
                      </div>

                      <div className="card-actions-grid">
                        <button
                          className="btn-card-add"
                          onClick={() => {
                            onAddToCart(p, 0, p.sizes ? p.sizes[0] : p.size || "", 1);
                            showToast(`«${p.name}» добавлен в корзину!`);
                          }}
                        >
                          <i className="fa-solid fa-bag-shopping"></i> В корзину
                        </button>
                        <button
                          className="btn-card-wa"
                          onClick={() => handleQuickOrder(p)}
                          title="Заказать в WhatsApp"
                        >
                          <i className="fa-brands fa-whatsapp"></i>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ==================== DRESSES SPOTLIGHT ==================== */}
      <section className="section dresses-spotlight" id="dresses">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">DRESS & ABAYA ATELIER</span>
            <h2 className="section-title">Коллекция <em>платьев</em></h2>
            <p className="section-desc">
              Линейка закрытых платьев и абай HADIDJA: премиальный дубайский крой, свобода силуэта и благородные ткани.
            </p>
          </div>

          <div className="dresses-grid">
            {products.filter((p) => p.category === "Платья").map((d) => (
              <article key={d.id} className="dress-card-spotlight">
                <div className="dress-img-wrap" onClick={() => handleOpenProduct(d)}>
                  <img
                    src={d.image}
                    alt={d.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "images/placeholder.jpg";
                    }}
                  />
                  <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(14,13,12,0.8)", padding: "4px 10px", borderRadius: "9999px", fontSize: "10px", color: "var(--gold-light)" }}>
                    {d.material}
                  </span>
                </div>
                <div className="dress-info-box">
                  <h3>{d.name}</h3>
                  <div className="dress-price-line">
                    <strong>{formatMoney(d.price)}</strong>
                    {d.oldPrice && <del>{formatMoney(d.oldPrice)}</del>}
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
                    {d.sizes?.map((s) => (
                      <span key={s} className="size-pill">{s}</span>
                    ))}
                  </div>
                  <button className="btn-dress-order" onClick={() => handleOpenProduct(d)}>
                    Выбрать размер и цвет <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PROMO BANNER ==================== */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-content">
              <span className="eyebrow" style={{ color: "var(--gold-light)" }}>SPECIAL OFFER</span>
              <h2>Скидка 10% на ваш заказ<br /><em>по промокоду HADIDJA</em></h2>
              <p>Укажите промокод в корзине при оформлении заказа и получите скидку на любую позицию из каталога.</p>
            </div>
            <div className="promo-coupon">
              <div>
                <small style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-light)" }}>Ваш промокод:</small>
                <span className="coupon-code">HADIDJA</span>
              </div>
              <button
                className="btn btn-gold"
                onClick={() => document.getElementById("catalog").scrollIntoView({ behavior: "smooth" })}
              >
                Выбрать товар <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== INSTAGRAM SECTION ==================== */}
      <section className="section instagram-section" id="instagram">
        <div className="container">
          <div className="section-head">
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="insta-handle-badge">
              <i className="fa-brands fa-instagram" style={{ color: "#d62976" }}></i>
              <span>{settings.instagram} · Официальный Instagram</span>
            </a>
            <h2 className="section-title">Мы в <em>Instagram</em></h2>
            <p className="section-desc">
              Смотрите видеообзоры тканей в движении, распаковку новинок и отзывы покупательниц в нашем профиле.
            </p>
          </div>

          <div className="insta-feed-grid">
            {[
              "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=500&q=80",
              "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80",
              "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=500&q=80",
              "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80",
              "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=500&q=80",
              "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=500&q=80"
            ].map((imgUrl, idx) => (
              <a key={idx} href={settings.instagramUrl} target="_blank" rel="noreferrer" className="insta-card">
                <img src={imgUrl} alt="HADIDJA Instagram" />
                <div className="insta-card-overlay">
                  <i className="fa-brands fa-instagram"></i>
                  <span>{settings.instagram}</span>
                </div>
              </a>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="btn btn-luxury">
              <i className="fa-brands fa-instagram"></i> Подписаться на наш Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ==================== REVIEWS ==================== */}
      <section className="section reviews-section" id="reviews">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">ОТЗЫВЫ КЛИЕНТОВ</span>
            <h2 className="section-title">Что говорят <em>наши покупательницы</em></h2>
            <p className="section-desc">
              Искренние слова благодарности от жительниц Душанбе и регионов, доверивших нам свой образ.
            </p>
          </div>

          <div className="reviews-grid">
            <div className="review-card">
              <div className="stars-rating">★★★★★</div>
              <p className="review-text">
                «Шёлковый платок превзошёл все ожидания! Вживую ткань выглядит ещё богаче, чем на фото. Не соскальзывает и очень красиво переливается при свете.»
              </p>
              <div className="reviewer-meta">
                <div className="reviewer-avatar">М</div>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "600" }}>Мадина Рахимова</h4>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>г. Душанбе · Постоянная клиентка</p>
                </div>
              </div>
            </div>

            <div className="review-card">
              <div className="stars-rating">★★★★★</div>
              <p className="review-text">
                «Очень приятно удивлена сервисом в WhatsApp! Написала, мне сразу прислали видео расцветок платьев, помогли подобрать размер и доставили вечером. Спасибо большое!»
              </p>
              <div className="reviewer-meta">
                <div className="reviewer-avatar">Ф</div>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "600" }}>Фарангис Саидова</h4>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>г. Душанбе · Заказ в WhatsApp</p>
                </div>
              </div>
            </div>

            <div className="review-card">
              <div className="stars-rating">★★★★★</div>
              <p className="review-text">
                «Заказывала хиджаб Медина и дубайский палантин. Качество турецкое, швы аккуратнейшие. Курьер привёз вовремя, была примерка перед оплатой.»
              </p>
              <div className="reviewer-meta">
                <div className="reviewer-avatar">З</div>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "600" }}>Зарина Каримова</h4>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>г. Душанбе · Доставка курьером</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="section faq-section" id="faq">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">ВОПРОСЫ И ОТВЕТЫ</span>
            <h2 className="section-title">Часто задаваемые <em>вопросы</em></h2>
          </div>

          <div className="faq-list">
            {[
              {
                q: "Как сделать заказ через WhatsApp?",
                a: "Выберите любой понравившийся товар и нажмите «Заказать в WhatsApp в 1 клик» либо добавьте товары в корзину и нажмите «Оформить заказ». Сайт автоматически составит структурированное сообщение с выбранным цветом, размером и суммой, после чего откроет чат с нашим менеджером."
              },
              {
                q: "Сколько стоит доставка по Душанбе и регионам?",
                a: `При заказе от ${settings.freeShippingThreshold || 250} сомони доставка по городу Душанбе осуществляется БЕСПЛАТНО. Доставка по регионам Таджикистана занимает 24–48 часов.`
              },
              {
                q: "Можно ли примерить товар перед покупкой?",
                a: "Да! По городу Душанбе курьер привозит товары с возможностью примерки перед оплатой, чтобы вы лично оценили качество ткани и посадку."
              },
              {
                q: "Какие способы оплаты вы принимаете?",
                a: "Наличными курьеру при получении, а также онлайн-переводом через Алиф Моби и Корти Милли (Dushanbe City, DCB, Эсхата)."
              }
            ].map((item, idx) => (
              <div key={idx} className={`faq-item ${openFaq === idx ? "open" : ""}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                  <span>{item.q}</span>
                  <i className="fa-solid fa-chevron-down" style={{ transform: openFaq === idx ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}></i>
                </button>
                {openFaq === idx && <div className="faq-answer">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CONTACTS ==================== */}
      <section className="section contacts-section" id="contacts">
        <div className="container">
          <div className="contacts-grid">
            <div>
              <span className="eyebrow">СВЯЖИТЕСЬ С НАМИ</span>
              <h2 className="section-title">Мы всегда рады<br /><em>вам помочь</em></h2>
              <p className="section-desc">
                Есть вопросы по тканям, размерам или наличию? Напишите нам напрямую — мы на связи каждый день с 10:00 до 21:00.
              </p>

              <div className="contact-card-box">
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="contact-entry wa-special">
                  <div className="contact-entry-icon">
                    <i className="fa-brands fa-whatsapp"></i>
                  </div>
                  <div>
                    <small style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)" }}>Оформление заказа в WhatsApp</small>
                    <strong style={{ display: "block", fontSize: "15px" }}>{settings.whatsappFormatted || `+${settings.whatsapp}`}</strong>
                  </div>
                </a>

                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="contact-entry">
                  <div className="contact-entry-icon">
                    <i className="fa-brands fa-instagram"></i>
                  </div>
                  <div>
                    <small style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)" }}>Instagram профиль</small>
                    <strong style={{ display: "block", fontSize: "15px" }}>{settings.instagram}</strong>
                  </div>
                </a>

                <div className="contact-entry">
                  <div className="contact-entry-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <small style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)" }}>Локация бутика</small>
                    <strong style={{ display: "block", fontSize: "15px" }}>{settings.address}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="boutique-card">
              <i className="fa-solid fa-gem" style={{ fontSize: "40px", color: "var(--gold-dark)", marginBottom: "16px" }}></i>
              <h3 style={{ fontSize: "26px", marginBottom: "8px" }}>HADIDJA SHOP</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
                Премиальный бутик платков, палантинов и женской восточной одежды в самом сердце Душанбе.
              </p>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp full"
              >
                <i className="fa-brands fa-whatsapp"></i> Написать менеджеру
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer>
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo" style={{ cursor: "default" }}>
                <div className="logo-monogram" style={{ background: "rgba(255,255,255,0.06)", color: "var(--gold-light)" }}>H</div>
                <div className="logo-text">
                  <span className="logo-title">HADIDJA</span>
                  <span className="logo-subtitle">BOUTIQUE & ATELIER</span>
                </div>
              </div>
              <p>
                Эксклюзивная коллекция платков, шарфов, хиджабов и платьев. Красота, грация и скромность в каждой линии.
              </p>
            </div>

            <div className="footer-col">
              <h4>Навигация</h4>
              <ul>
                <li><a href="#home">Главная</a></li>
                <li><a href="#categories">Категории</a></li>
                <li><a href="#catalog">Каталог</a></li>
                <li><a href="#dresses">Платья</a></li>
                <li><a href="#reviews">Отзывы</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Контакты</h4>
              <ul>
                <li><a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp"></i> {settings.whatsappFormatted || settings.whatsapp}</a></li>
                <li><a href={settings.instagramUrl} target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i> {settings.instagram}</a></li>
                <li><i className="fa-solid fa-location-dot"></i> {settings.address}</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Управление</h4>
              <button
                onClick={onNavigateToAdmin}
                className="btn btn-luxury"
                style={{ fontSize: "11px", padding: "10px 18px", marginTop: "8px" }}
              >
                <i className="fa-solid fa-lock"></i> Панель администратора
              </button>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© 2026 HADIDJA SHOP. Все права защищены.</div>
            <div>Сделано с любовью к стилю и красоте 🌸</div>
          </div>
        </div>
      </footer>

      {/* ==================== PRODUCT QUICK VIEW MODAL ==================== */}
      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="modal-product-layout">
              <div className="modal-gallery-main">
                <img
                  src={
                    (selectedProduct.colors && selectedProduct.colors[activeColorIdx]?.image) ||
                    selectedProduct.image
                  }
                  alt={selectedProduct.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "images/placeholder.jpg";
                  }}
                />
              </div>

              <div className="modal-details-content">
                <span className="eyebrow">{selectedProduct.category} · HADIDJA BOUTIQUE</span>
                <h2 className="modal-product-title">{selectedProduct.name}</h2>

                <div className="modal-price-box">
                  <span className="modal-current-price">{formatMoney(selectedProduct.price)}</span>
                  {selectedProduct.oldPrice && <span className="modal-old-price">{formatMoney(selectedProduct.oldPrice)}</span>}
                  {selectedProduct.discount ? (
                    <span className="discount-tag">Скидка -{selectedProduct.discount}%</span>
                  ) : null}
                </div>

                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "20px" }}>
                  {selectedProduct.description || "Премиальное качество HADIDJA SHOP."}
                </p>

                <div style={{ fontSize: "13px", marginBottom: "16px" }}>
                  <div><strong>Материал:</strong> {selectedProduct.material || "Премиум"}</div>
                  <div><strong>Размер:</strong> {selectedProduct.size || "Универсальный"}</div>
                </div>

                {/* Color Selector */}
                {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                  <div className="modal-option-group">
                    <label className="option-group-label">
                      Расцветка: <strong>{selectedProduct.colors[activeColorIdx]?.name}</strong>
                    </label>
                    <div className="swatches-selector">
                      {selectedProduct.colors.map((c, i) => (
                        <button
                          key={i}
                          className={`color-badge-btn ${activeColorIdx === i ? "selected" : ""}`}
                          onClick={() => setActiveColorIdx(i)}
                        >
                          <span className="color-circle-icon" style={{ backgroundColor: c.hex || "#333" }}></span>
                          <span>{c.name}</span>
                          <small style={{ opacity: 0.7 }}>({c.quantity || 0} шт.)</small>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="modal-option-group">
                    <label className="option-group-label">Выберите размер:</label>
                    <div className="sizes-selector">
                      {selectedProduct.sizes.map((s) => (
                        <button
                          key={s}
                          className={`size-btn-choice ${selectedSize === s ? "selected" : ""}`}
                          onClick={() => setSelectedSize(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="modal-qty-row">
                  <label className="option-group-label" style={{ margin: 0 }}>Количество:</label>
                  <div className="qty-stepper">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>

                {/* Actions */}
                <div className="modal-actions-box">
                  <button
                    className="btn btn-luxury full"
                    onClick={() => {
                      onAddToCart(selectedProduct, activeColorIdx, selectedSize, quantity);
                      setSelectedProduct(null);
                      showToast(`«${selectedProduct.name}» добавлен в корзину!`);
                    }}
                  >
                    <i className="fa-solid fa-bag-shopping"></i> Добавить в корзину · {formatMoney(selectedProduct.price * quantity)}
                  </button>
                  <button
                    className="btn btn-whatsapp full"
                    onClick={() => {
                      setCheckoutTarget("single");
                      setIsCheckoutOpen(true);
                    }}
                  >
                    <i className="fa-brands fa-whatsapp"></i> Заказать в WhatsApp в 1 клик
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== WHATSAPP CHECKOUT MODAL ==================== */}
      {isCheckoutOpen && (
        <div className="modal-backdrop" onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-window" style={{ maxWidth: "540px" }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsCheckoutOpen(false)}>×</button>
            <div style={{ padding: "36px" }}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <i className="fa-brands fa-whatsapp" style={{ fontSize: "40px", color: "#25d366", marginBottom: "12px", display: "inline-block" }}></i>
                <h3 style={{ fontSize: "26px", color: "var(--noir)", marginBottom: "6px" }}>Оформление заказа</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  Заполните контактные данные для мгновенной отправки заказа в WhatsApp нашему менеджеру.
                </p>
              </div>

              <form onSubmit={handleSubmitOrder} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Ваше имя *</label>
                  <input
                    type="text"
                    placeholder="Например: Мадина"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Номер телефона *</label>
                  <input
                    type="tel"
                    placeholder="+992 9X XXX XX XX"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Адрес доставки (Душанбе / Регион) *</label>
                  <input
                    type="text"
                    placeholder="г. Душанбе, ул. Рудаки 15"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Способ оплаты</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="Наличными курьеру при получении">Наличными курьеру при получении</option>
                    <option value="Перевод через Алиф Моби">Перевод через Алиф Моби</option>
                    <option value="Корти Милли (Dushanbe City, DCB, Эсхата)">Корти Милли (Dushanbe City / DCB)</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Комментарий / Пожелания</label>
                  <textarea
                    placeholder="Удобное время доставки или особенности адреса..."
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                  ></textarea>
                </div>

                <div style={{ background: "var(--silk-surface)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--silk-border)" }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--gold-dark)", textTransform: "uppercase", marginBottom: "8px" }}>Товар:</div>
                  {selectedProduct && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span>{selectedProduct.name} ({selectedProduct.colors?.[activeColorIdx]?.name || ""}) × {quantity}</span>
                      <strong>{formatMoney(selectedProduct.price * quantity)}</strong>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-whatsapp full" style={{ padding: "16px", marginTop: "8px" }}>
                  <i className="fa-brands fa-whatsapp"></i> Отправить заказ в WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating Buttons */}
      <div className="floating-actions-container">
        {showBackToTop && (
          <button
            className="back-to-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Наверх"
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        )}
        <a
          href={`https://wa.me/${settings.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="floating-whatsapp-btn"
        >
          <i className="fa-brands fa-whatsapp"></i>
          <span>Написать нам</span>
        </a>
      </div>
    </div>
  );
}
