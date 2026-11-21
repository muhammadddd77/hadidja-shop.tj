/**
 * HADIDJA SHOP — Luxury Atelier & Boutique
 * Unified E-Commerce Engine & Data Sync
 * Contact: +992 88 600 65 28 | Instagram: @hadidja_shop_tj
 */

// Default Store Configuration
const DEFAULT_SETTINGS = {
  whatsapp: "992886006528",
  whatsappFormatted: "+992 88 600 65 28",
  instagram: "@hadidja_shop_tj",
  instagramUrl: "https://www.instagram.com/hadidja_shop_tj/",
  address: "г. Душанбе, Таджикистан",
  announcement: "✦ БЕСПЛАТНАЯ ДОСТАВКА ПО ДУШАНБЕ ОТ 250 СОМОНИ · ПРИМЕРКА ПЕРЕД ОПЛАТОЙ · ЗАКАЗ В WHATSAPP",
  freeShippingThreshold: 250,
  currency: "сомони"
};

// Default Luxury Catalog Database
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Шёлковый платок «Royal Silk»",
    category: "Платки",
    price: 120,
    oldPrice: 150,
    discount: 20,
    size: "120 × 120 см",
    material: "Натуральный шёлк Гирбишин",
    badge: "ХИТ",
    rating: 5.0,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=85",
    fallback: "images/product-01.jpg",
    description: "Эксклюзивный платок из натурального плотного шёлка гирбишин. Мягко драпируется, держит благородную форму и обладает лёгким жемчужным переливом.",
    colors: [
      { name: "Чёрный графит", hex: "#1c1c1c", quantity: 6, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=85" },
      { name: "Шампань-беж", hex: "#ecd9c2", quantity: 5, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=85" },
      { name: "Нежная пудра", hex: "#e7cbcf", quantity: 3, image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=85" }
    ]
  },
  {
    id: 2,
    name: "Платок «Dubai Satin Carré»",
    category: "Платки",
    price: 95,
    oldPrice: 120,
    discount: 21,
    size: "110 × 110 см",
    material: "Дубайский сатин-жаккард",
    badge: "СКИДКА",
    rating: 4.9,
    reviewsCount: 24,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=85",
    fallback: "images/product-02.jpg",
    description: "Глянцевый атласный платок с изысканным восточным переливом. Идеален как для праздничного образа, так и на каждый день.",
    colors: [
      { name: "Молочный перламутр", hex: "#f3ede3", quantity: 7, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=85" },
      { name: "Горький шоколад", hex: "#3e2723", quantity: 4, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=85" },
      { name: "Глубокий чёрный", hex: "#111111", quantity: 5, image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=85" }
    ]
  },
  {
    id: 3,
    name: "Платок «Florence Monogram»",
    category: "Платки",
    price: 135,
    oldPrice: null,
    discount: 0,
    size: "120 × 120 см",
    material: "Итальянский твил",
    badge: "PREMIUM",
    rating: 5.0,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=85",
    fallback: "images/product-03.jpg",
    description: "Коллекционная модель из шелковистого твила с аккуратной ручной обработкой края рулик (Hand Rolled).",
    colors: [
      { name: "Крем-брюле", hex: "#e8dcce", quantity: 4, image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=85" },
      { name: "Королевский сапфир", hex: "#1a2c4e", quantity: 3, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=85" }
    ]
  },
  {
    id: 4,
    name: "Палантин «Dubai Chiffon Stole»",
    category: "Шарфы",
    price: 110,
    oldPrice: 135,
    discount: 19,
    size: "185 × 75 см",
    material: "Премиальный дубайский шифон",
    badge: "ХИТ",
    rating: 4.9,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=85",
    fallback: "images/product-04.jpg",
    description: "Лёгкий струящийся палантин из оригинального дубайского шифона. Не просвечивает при сложении, ложится воздушными складками.",
    colors: [
      { name: "Песочный беж", hex: "#d8c5aa", quantity: 6, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=85" },
      { name: "Кофейный мокко", hex: "#634c3e", quantity: 4, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=85" },
      { name: "Чёрный оникс", hex: "#141414", quantity: 5, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=85" }
    ]
  },
  {
    id: 5,
    name: "Шарф «Soft Cashmere Touch»",
    category: "Шарфы",
    price: 105,
    oldPrice: null,
    discount: 0,
    size: "190 × 80 см",
    material: "Шёлк с кашемиром",
    badge: "NEW",
    rating: 5.0,
    reviewsCount: 15,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85",
    fallback: "images/product-05.jpg",
    description: "Невероятно мягкий и уютный шарф с бархатистой текстурой под кашемир. Идеален для прохладных вечеров и осенне-весеннего сезона.",
    colors: [
      { name: "Кремовая ваниль", hex: "#f5f0e6", quantity: 5, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85" },
      { name: "Дымчатый серый", hex: "#8c8c8c", quantity: 4, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=85" },
      { name: "Тёплый тауп", hex: "#7a6a5a", quantity: 3, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=85" }
    ]
  },
  {
    id: 6,
    name: "Хиджаб «Medina Silk»",
    category: "Хиджабы",
    price: 90,
    oldPrice: 115,
    discount: 22,
    size: "180 × 75 см",
    material: "Шёлк Медина (Турция)",
    badge: "ХИТ",
    rating: 5.0,
    reviewsCount: 56,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85",
    fallback: "images/product-06.jpg",
    description: "Хит восточного гардероба. Знаменитый турецкий шёлк медина — абсолютно матовый, не скользит по волосам, не мнётся и пропускает воздух.",
    colors: [
      { name: "Чёрный", hex: "#111111", quantity: 8, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85" },
      { name: "Капучино", hex: "#c8b39b", quantity: 7, image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=85" },
      { name: "Пыльная роза", hex: "#d4a9a9", quantity: 4, image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=85" }
    ]
  },
  {
    id: 7,
    name: "Хиджаб «Jersey Royal Luxe»",
    category: "Хиджабы",
    price: 85,
    oldPrice: null,
    discount: 0,
    size: "180 × 75 см",
    material: "Премиум Джерси Люкс",
    badge: "КОМФОРТ",
    rating: 4.9,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=85",
    fallback: "images/product-07.jpg",
    description: "Мягкий эластичный трикотаж джерси премиум качества. Идеально сидит без единой булавки, сохраняя безупречный комфорт на весь день.",
    colors: [
      { name: "Белоснежный", hex: "#ffffff", quantity: 5, image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=85" },
      { name: "Песочно-бежевый", hex: "#cfbeaa", quantity: 6, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85" },
      { name: "Тёмно-коричневый", hex: "#422e23", quantity: 4, image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=85" }
    ]
  },
  {
    id: 8,
    name: "Хиджаб «Chiffon Plissé»",
    category: "Хиджабы",
    price: 115,
    oldPrice: 140,
    discount: 18,
    size: "185 × 75 см",
    material: "Жатка-плиссе премиум",
    badge: "СКИДКА",
    rating: 5.0,
    reviewsCount: 18,
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=85",
    fallback: "images/product-08.jpg",
    description: "Фактурный хиджаб с элегантной мелкой плиссировкой. Не требует глажки, выглядит объемно и необычайно нарядно.",
    colors: [
      { name: "Пыльная роза", hex: "#cda2a2", quantity: 5, image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=85" },
      { name: "Благородный изумруд", hex: "#224b3b", quantity: 3, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85" },
      { name: "Чёрный", hex: "#111111", quantity: 6, image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=85" }
    ]
  },
  {
    id: 9,
    name: "Платье-Абайя «Grace Modest»",
    category: "Платья",
    price: 260,
    oldPrice: 320,
    discount: 19,
    size: "S / M / L / XL",
    sizes: ["S", "M", "L", "XL"],
    material: "Дубайский креп премиум",
    badge: "ХИТ",
    rating: 5.0,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85",
    fallback: "images/dress-01.jpg",
    description: "Утонченное свободное платье-абайя с безупречной драпировкой и манжетами. Ткань не мнется, приятна к телу и дарит свободу движений.",
    colors: [
      { name: "Чёрный оникс", hex: "#111111", quantity: 4, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85" },
      { name: "Тёплый песочный", hex: "#d5c4af", quantity: 3, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85" }
    ]
  },
  {
    id: 10,
    name: "Платье «Velvet Night»",
    category: "Платья",
    price: 310,
    oldPrice: 380,
    discount: 18,
    size: "S / M / L",
    sizes: ["S", "M", "L"],
    material: "Королевский бархат",
    badge: "LUXURY",
    rating: 5.0,
    reviewsCount: 16,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85",
    fallback: "images/dress-02.jpg",
    description: "Роскошное вечернее закрытое платье из глубокого королевского бархата с мягким жемчужным переливом.",
    colors: [
      { name: "Молочный крем", hex: "#f1ede4", quantity: 2, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85" },
      { name: "Кофейный шоколад", hex: "#483226", quantity: 3, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85" }
    ]
  },
  {
    id: 11,
    name: "Платье «Dubai Silk Abaya»",
    category: "Платья",
    price: 340,
    oldPrice: 410,
    discount: 17,
    size: "M / L / XL",
    sizes: ["M", "L", "XL"],
    material: "Плотный дубайский шёлк",
    badge: "ЭКСКЛЮЗИВ",
    rating: 5.0,
    reviewsCount: 21,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=85",
    fallback: "images/dress-03.jpg",
    description: "Эксклюзивная модель свободного кроя из тяжелого дубайского шёлка. Создает статный, элегантный силуэт высочайшего класса.",
    colors: [
      { name: "Благородный бордо", hex: "#581825", quantity: 3, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=85" },
      { name: "Чёрный уголь", hex: "#141414", quantity: 4, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85" }
    ]
  },
  {
    id: 12,
    name: "Платье «Emerald Elegance»",
    category: "Платья",
    price: 290,
    oldPrice: null,
    discount: 0,
    size: "S / M / L / XL",
    sizes: ["S", "M", "L", "XL"],
    material: "Плотный турецкий трикотаж",
    badge: "NEW",
    rating: 4.9,
    reviewsCount: 14,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=85",
    fallback: "images/dress-04.jpg",
    description: "Элегантное закрытое платье в пол со съёмным поясом. Превосходно садится по фигуре, не сковывая движений.",
    colors: [
      { name: "Глубокий изумруд", hex: "#194334", quantity: 4, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=85" },
      { name: "Чёрный бархат", hex: "#111111", quantity: 5, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85" }
    ]
  },
  {
    id: 13,
    name: "Подарочный бокс «Hadidja Royal Box»",
    category: "Аксессуары",
    price: 165,
    oldPrice: 200,
    discount: 18,
    size: "Luxury Box Set",
    material: "Шёлк + Магнитные булавки + Шапочка",
    badge: "ПОДАРОК",
    rating: 5.0,
    reviewsCount: 33,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85",
    fallback: "images/placeholder.jpg",
    description: "Идеальный подарок в фирменной золотой коробке: шёлковый платок, 4 пары ультра-прочных магнитных булавок и хлопковая шапочка-подхиджабник.",
    colors: [
      { name: "Золотистый сет", hex: "#c5a880", quantity: 5, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85" },
      { name: "Чёрный нуар", hex: "#111111", quantity: 4, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=85" }
    ]
  }
];

// Initialize and Sync Database from LocalStorage
function getStoredProducts() {
  const data = localStorage.getItem("hadidja_products_db");
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error("Error reading stored products:", e);
    }
  }
  // If first time or empty, store defaults
  localStorage.setItem("hadidja_products_db", JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

function getStoredSettings() {
  const data = localStorage.getItem("hadidja_settings_db");
  if (data) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      console.error("Error reading stored settings:", e);
    }
  }
  localStorage.setItem("hadidja_settings_db", JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
}

// Global active store state
let storeSettings = getStoredSettings();
let products = getStoredProducts();

const WHATSAPP_NUMBER = storeSettings.whatsapp || "992886006528";
const FREE_SHIPPING_THRESHOLD = Number(storeSettings.freeShippingThreshold) || 250;

// App State
let activeCategory = "Все";
let searchQuery = "";
let currentSort = "popular";
let appliedDiscount = 0; // percentage
let favorites = JSON.parse(localStorage.getItem("hadidja_favs_v2") || "[]");
let cart = JSON.parse(localStorage.getItem("hadidja_cart_v2") || "[]");

// Selected product for modal & 1-click order
let currentModalProduct = null;
let selectedColorIndex = 0;
let selectedSize = "";
let selectedQuantity = 1;
let checkoutTarget = "cart"; // "cart" or "single"

// DOM Elements
const productsGrid = document.getElementById("productsGrid");
const emptyCatalog = document.getElementById("emptyCatalog");
const cartBadge = document.getElementById("cartCountBadge");
const favBadge = document.getElementById("favCountBadge");
const overlay = document.getElementById("mainOverlay");

// Helpers
function formatMoney(amount) {
  return `${amount} ${storeSettings.currency || "сомони"}`;
}

function saveState() {
  localStorage.setItem("hadidja_favs_v2", JSON.stringify(favorites));
  localStorage.setItem("hadidja_cart_v2", JSON.stringify(cart));
}

function showToast(message, icon = "fa-sparkles") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}

// Dynamic Settings Injection
function applySettingsToDom() {
  // Update WhatsApp links
  const waUrl = `https://wa.me/${storeSettings.whatsapp}`;
  document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
    if (!a.href.includes("text=")) {
      a.href = waUrl;
    }
  });

  // Update Instagram links
  document.querySelectorAll('a[href*="instagram.com"]').forEach(a => {
    if (storeSettings.instagramUrl) a.href = storeSettings.instagramUrl;
  });

  // Update handles
  document.querySelectorAll(".insta-handle-badge span").forEach(el => {
    el.textContent = `${storeSettings.instagram} · Официальный Instagram`;
  });
}

// Render Catalog Cards
function renderCatalog() {
  if (!productsGrid) return;
  products = getStoredProducts();

  let list = products.filter(p => {
    const matchesCategory =
      activeCategory === "Все" ||
      (activeCategory === "Скидки" ? p.discount > 0 :
       activeCategory === "Новинки" ? p.badge === "NEW" || p.badge === "PREMIUM" :
       p.category === activeCategory);

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.material && p.material.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Sorting
  if (currentSort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === "discount") {
    list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }

  if (list.length === 0) {
    productsGrid.innerHTML = "";
    if (emptyCatalog) emptyCatalog.style.display = "block";
  } else {
    if (emptyCatalog) emptyCatalog.style.display = "none";
    productsGrid.innerHTML = list.map(product => {
      const isFav = favorites.includes(product.id);
      const colors = product.colors || [];
      const totalStock = colors.reduce((sum, c) => sum + (c.quantity || 0), 0);

      // Badge style
      let badgeClass = "card-badge";
      if (product.discount > 0) badgeClass += " sale";
      else if (product.badge === "ХИТ") badgeClass += " hit";
      else if (product.badge === "NEW") badgeClass += " new";

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-image-box" onclick="openProductModal(${product.id})">
            <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='${product.fallback || 'images/placeholder.jpg'}'">
            ${product.badge ? `<span class="${badgeClass}">${product.discount ? `-${product.discount}%` : product.badge}</span>` : ""}
            <button class="card-fav-btn ${isFav ? "active" : ""}" onclick="event.stopPropagation(); toggleFavorite(${product.id})" aria-label="В избранное">
              <i class="${isFav ? "fa-solid" : "fa-regular"} fa-heart"></i>
            </button>
            <div class="card-quick-view">
              <span class="quick-view-btn"><i class="fa-regular fa-eye"></i> Быстрый просмотр</span>
            </div>
          </div>
          <div class="product-details">
            <span class="product-cat">${product.category}</span>
            <h3 class="product-title" onclick="openProductModal(${product.id})">${product.name}</h3>
            <p class="product-meta">${product.size || ""} · ${product.material || ""}</p>
            
            <div class="color-swatches-preview">
              ${colors.slice(0, 4).map(c => `
                <span class="color-dot" style="background-color: ${c.hex || '#333'};" title="${c.name} (${c.quantity} шт.)"></span>
              `).join("")}
              ${colors.length > 4 ? `<span class="more-colors-count">+${colors.length - 4}</span>` : ""}
            </div>

            <div class="price-container">
              <span class="current-price">${formatMoney(product.price)}</span>
              ${product.oldPrice ? `<span class="old-price">${formatMoney(product.oldPrice)}</span>` : ""}
              ${product.discount ? `<span class="discount-tag">Экономия ${product.oldPrice - product.price} с.</span>` : ""}
            </div>

            <div class="card-actions-grid">
              <button class="btn-card-add" onclick="quickAddToCart(${product.id})">
                <i class="fa-solid fa-bag-shopping"></i> В корзину
              </button>
              <button class="btn-card-wa" onclick="orderOneClick(${product.id})" title="Заказать в WhatsApp">
                <i class="fa-brands fa-whatsapp"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  renderDressesSpotlight();
  updateBadges();
}

// Render Dresses Section
function renderDressesSpotlight() {
  const container = document.getElementById("dressesGridContainer");
  if (!container) return;

  const dresses = products.filter(p => p.category === "Платья");
  container.innerHTML = dresses.map(d => {
    const totalQty = (d.colors || []).reduce((acc, c) => acc + (c.quantity || 0), 0);
    return `
      <article class="dress-card-spotlight">
        <div class="dress-img-wrap" onclick="openProductModal(${d.id})">
          <img src="${d.image}" alt="${d.name}" onerror="this.onerror=null; this.src='${d.fallback || 'images/placeholder.jpg'}'">
          <span class="dress-stock-badge">В наличии ${totalQty} шт.</span>
        </div>
        <div class="dress-info-box">
          <h3>${d.name}</h3>
          <div class="dress-price-line">
            <strong>${formatMoney(d.price)}</strong>
            ${d.oldPrice ? `<del>${formatMoney(d.oldPrice)}</del>` : ""}
          </div>
          <p style="font-size: 12px; color: rgba(255,255,255,0.7); margin-bottom: 12px;">${d.material || ""}</p>
          <div class="dress-sizes-row">
            ${d.sizes ? d.sizes.map(s => `<span class="size-pill">${s}</span>`).join("") : ""}
          </div>
          <button class="btn-dress-order" onclick="openProductModal(${d.id})">
            Выбрать размер и цвет <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </article>
    `;
  }).join("");
}

// Quick Add To Cart from Card
function quickAddToCart(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;

  const colors = p.colors || [{ name: "Стандарт", hex: "#000", quantity: 5 }];
  const availableIndex = colors.findIndex(c => (c.quantity || 0) > 0);
  const colorIdx = availableIndex !== -1 ? availableIndex : 0;
  const size = p.sizes ? p.sizes[0] : (p.size || "");

  addToCartItem(p.id, colorIdx, size, 1);
  showToast(`«${p.name}» добавлен в корзину!`, "fa-bag-shopping");
}

// Product Details Modal
function openProductModal(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;

  currentModalProduct = p;
  const colors = p.colors || [{ name: "Стандарт", hex: "#000", quantity: 5 }];
  selectedColorIndex = colors.findIndex(c => (c.quantity || 0) > 0);
  if (selectedColorIndex === -1) selectedColorIndex = 0;
  selectedSize = p.sizes ? p.sizes[0] : (p.size || "");
  selectedQuantity = 1;

  const modal = document.getElementById("productModal");
  const layout = document.getElementById("modalProductContent");
  if (!modal || !layout) return;

  const activeColor = colors[selectedColorIndex] || { name: "Стандарт", quantity: 5 };

  layout.innerHTML = `
    <div class="modal-gallery-main">
      <img id="modalMainImg" src="${activeColor.image || p.image}" onerror="this.onerror=null; this.src='${p.fallback || 'images/placeholder.jpg'}'" alt="${p.name}">
    </div>
    <div class="modal-details-content">
      <span class="eyebrow">${p.category} · HADIDJA BOUTIQUE</span>
      <h2 class="modal-product-title">${p.name}</h2>
      
      <div class="modal-price-box">
        <span class="modal-current-price">${formatMoney(p.price)}</span>
        ${p.oldPrice ? `<span class="modal-old-price">${formatMoney(p.oldPrice)}</span>` : ""}
        ${p.discount ? `<span class="discount-tag">Скидка -${p.discount}%</span>` : ""}
      </div>

      <p style="font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
        ${p.description || "Премиальное качество HADIDJA SHOP."}
      </p>

      <div style="font-size: 13px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px;">
        <div><strong>Материал:</strong> ${p.material || "Премиум"}</div>
        <div><strong>Размер:</strong> ${p.size || "Универсальный"}</div>
      </div>

      <!-- Color Selector -->
      <div class="modal-option-group">
        <label class="option-group-label">Расцветка: <span id="selectedColorName" style="color: var(--noir); font-weight: 700;">${activeColor.name}</span></label>
        <div class="swatches-selector">
          ${colors.map((c, idx) => `
            <button class="color-badge-btn ${idx === selectedColorIndex ? "selected" : ""} ${(c.quantity || 0) <= 0 ? "disabled" : ""}" 
              onclick="onSelectColor(${idx})" ${(c.quantity || 0) <= 0 ? "disabled" : ""}>
              <span class="color-circle-icon" style="background-color: ${c.hex || '#333'};"></span>
              <span>${c.name}</span>
              <small style="opacity: 0.7;">(${(c.quantity || 0) > 0 ? c.quantity + ' шт.' : 'нет'})</small>
            </button>
          `).join("")}
        </div>
      </div>

      <!-- Size Selector (if applicable) -->
      ${p.sizes ? `
        <div class="modal-option-group">
          <label class="option-group-label">Выберите размер:</label>
          <div class="sizes-selector">
            ${p.sizes.map((s, idx) => `
              <button class="size-btn-choice ${s === selectedSize ? "selected" : ""}" onclick="onSelectSize('${s}', this)">
                ${s}
              </button>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <div class="stock-status-notice" id="modalStockNotice">
        <i class="fa-solid fa-circle-check"></i> В наличии на складе в Душанбе (${activeColor.quantity || 1} шт.)
      </div>

      <!-- Qty Stepper -->
      <div class="modal-qty-row">
        <label class="option-group-label" style="margin: 0;">Количество:</label>
        <div class="qty-stepper">
          <button onclick="changeModalQty(-1)">−</button>
          <span id="modalQtyDisplay">1</span>
          <button onclick="changeModalQty(1)">+</button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="modal-actions-box">
        <button class="btn btn-luxury full" onclick="addModalProductToCart()">
          <i class="fa-solid fa-bag-shopping"></i> Добавить в корзину · <span id="modalTotalPrice">${formatMoney(p.price)}</span>
        </button>
        <button class="btn btn-whatsapp full" onclick="orderOneClickFromModal()">
          <i class="fa-brands fa-whatsapp"></i> Заказать в WhatsApp в 1 клик
        </button>
      </div>
    </div>
  `;

  modal.classList.add("open");
  document.body.classList.add("lock-scroll");
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  if (modal) modal.classList.remove("open");
  document.body.classList.remove("lock-scroll");
}

function onSelectColor(index) {
  if (!currentModalProduct) return;
  const colors = currentModalProduct.colors || [];
  const c = colors[index];
  if (!c || (c.quantity || 0) <= 0) return;

  selectedColorIndex = index;
  selectedQuantity = 1;

  document.querySelectorAll(".color-badge-btn").forEach((b, i) => {
    b.classList.toggle("selected", i === index);
  });

  const img = document.getElementById("modalMainImg");
  if (img) img.src = c.image || currentModalProduct.image;

  const nameEl = document.getElementById("selectedColorName");
  if (nameEl) nameEl.textContent = c.name;

  const stockEl = document.getElementById("modalStockNotice");
  if (stockEl) {
    stockEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> В наличии (${c.quantity} шт.)`;
  }

  updateModalPrice();
}

function onSelectSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll(".size-btn-choice").forEach(b => b.classList.remove("selected"));
  if (btn) btn.classList.add("selected");
}

function changeModalQty(delta) {
  if (!currentModalProduct) return;
  const colors = currentModalProduct.colors || [{ quantity: 99 }];
  const max = (colors[selectedColorIndex] && colors[selectedColorIndex].quantity) || 99;
  selectedQuantity = Math.max(1, Math.min(max, selectedQuantity + delta));
  
  const display = document.getElementById("modalQtyDisplay");
  if (display) display.textContent = selectedQuantity;
  
  updateModalPrice();
}

function updateModalPrice() {
  if (!currentModalProduct) return;
  const total = currentModalProduct.price * selectedQuantity;
  const totalEl = document.getElementById("modalTotalPrice");
  if (totalEl) totalEl.textContent = formatMoney(total);
}

function addModalProductToCart() {
  if (!currentModalProduct) return;
  addToCartItem(currentModalProduct.id, selectedColorIndex, selectedSize, selectedQuantity);
  closeProductModal();
  openDrawer("cartDrawer");
  showToast(`«${currentModalProduct.name}» добавлен в корзину!`, "fa-bag-shopping");
}

// Order 1-Click Directly
function orderOneClick(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;

  currentModalProduct = p;
  const colors = p.colors || [{ name: "Стандарт", quantity: 5 }];
  selectedColorIndex = colors.findIndex(c => (c.quantity || 0) > 0);
  if (selectedColorIndex === -1) selectedColorIndex = 0;
  selectedSize = p.sizes ? p.sizes[0] : (p.size || "");
  selectedQuantity = 1;

  checkoutTarget = "single";
  openCheckoutModal();
}

function orderOneClickFromModal() {
  if (!currentModalProduct) return;
  checkoutTarget = "single";
  closeProductModal();
  openCheckoutModal();
}

// Cart Operations
function addToCartItem(productId, colorIdx, size, qty) {
  const p = products.find(x => x.id === productId);
  if (!p) return;

  const key = `${productId}-${colorIdx}-${size}`;
  const existing = cart.find(item => item.key === key);
  const colors = p.colors || [{ quantity: 99 }];
  const maxStock = (colors[colorIdx] && colors[colorIdx].quantity) || 99;

  if (existing) {
    existing.qty = Math.min(maxStock, existing.qty + qty);
  } else {
    cart.push({
      key,
      id: productId,
      colorIndex: colorIdx,
      size,
      qty
    });
  }

  saveState();
  updateBadges();
  renderCartDrawer();
}

function updateCartQty(key, delta) {
  const item = cart.find(x => x.key === key);
  if (!item) return;

  const p = products.find(x => x.id === item.id);
  const colors = p ? (p.colors || [{ quantity: 99 }]) : [{ quantity: 99 }];
  const maxStock = (colors[item.colorIndex] && colors[item.colorIndex].quantity) || 99;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(key);
    return;
  }
  if (item.qty > maxStock) {
    item.qty = maxStock;
    showToast(`Максимум в наличии: ${maxStock} шт.`, "fa-circle-exclamation");
  }

  saveState();
  updateBadges();
  renderCartDrawer();
}

function removeFromCart(key) {
  cart = cart.filter(x => x.key !== key);
  saveState();
  updateBadges();
  renderCartDrawer();
  showToast("Товар удалён из корзины");
}

function renderCartDrawer() {
  const body = document.getElementById("cartDrawerBody");
  const totalEl = document.getElementById("cartTotalSum");
  const shippingTrack = document.getElementById("shippingBarFill");
  const shippingText = document.getElementById("shippingTextMsg");
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="drawer-empty-msg">
        <i class="fa-solid fa-bag-shopping"></i>
        <h4 style="font-family: var(--font-serif); font-size: 22px; margin-bottom: 6px;">Корзина пока пуста</h4>
        <p style="font-size: 13px;">Выберите красивые платки или платья из каталога</p>
      </div>
    `;
    if (totalEl) totalEl.textContent = formatMoney(0);
    if (shippingTrack) shippingTrack.style.width = "0%";
    if (shippingText) shippingText.innerHTML = `До бесплатной доставки: <b>${formatMoney(FREE_SHIPPING_THRESHOLD)}</b>`;
    return;
  }

  let subtotal = 0;
  body.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return "";
    const colors = p.colors || [{ name: "Стандарт", hex: "#000" }];
    const color = colors[item.colorIndex] || { name: "Стандарт", hex: "#000" };
    const itemTotal = p.price * item.qty;
    subtotal += itemTotal;

    return `
      <div class="drawer-item">
        <img src="${color.image || p.image}" onerror="this.onerror=null; this.src='${p.fallback || 'images/placeholder.jpg'}'" alt="${p.name}">
        <div class="drawer-item-info">
          <h4>${p.name}</h4>
          <small>${color.name}${item.size ? ' · ' + item.size : ''}</small>
          <div class="drawer-qty-controls">
            <button onclick="updateCartQty('${item.key}', -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateCartQty('${item.key}', 1)">+</button>
          </div>
          <div class="drawer-item-price">${formatMoney(itemTotal)}</div>
        </div>
        <button class="drawer-remove-btn" onclick="removeFromCart('${item.key}')" title="Удалить">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    `;
  }).join("");

  // Calculate discounts & totals
  let finalTotal = subtotal;
  if (appliedDiscount > 0) {
    finalTotal = Math.round(subtotal * (1 - appliedDiscount / 100));
  }

  if (totalEl) totalEl.textContent = formatMoney(finalTotal);

  // Free shipping progress
  if (shippingTrack && shippingText) {
    const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
    shippingTrack.style.width = `${pct}%`;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      shippingText.innerHTML = `<span style="color: #3b8754;"><i class="fa-solid fa-truck-fast"></i> Доставка по Душанбе БЕСПЛАТНА!</span>`;
    } else {
      const diff = FREE_SHIPPING_THRESHOLD - subtotal;
      shippingText.innerHTML = `<span>До бесплатной доставки:</span> <b>${formatMoney(diff)}</b>`;
    }
  }
}

// Promo Code Application
function applyPromoCode() {
  const input = document.getElementById("couponInput");
  if (!input) return;
  const val = input.value.trim().toUpperCase();

  if (val === "HADIDJA" || val === "HADIDJA10" || val === "DUSHANBE") {
    appliedDiscount = 10;
    showToast("✨ Промокод применён! Скидка 10% на ваш заказ.", "fa-percent");
    renderCartDrawer();
  } else if (val === "") {
    showToast("Введите промокод");
  } else {
    showToast("Промокод не найден или истёк", "fa-circle-xmark");
  }
}

// Favorites Operations
function toggleFavorite(id) {
  const idx = favorites.indexOf(id);
  if (idx !== -1) {
    favorites.splice(idx, 1);
    showToast("Товар удалён из избранного");
  } else {
    favorites.push(id);
    showToast("❤️ Добавлено в избранное!", "fa-heart");
  }

  saveState();
  updateBadges();
  renderCatalog();
  renderFavoritesDrawer();
}

function renderFavoritesDrawer() {
  const body = document.getElementById("favoritesDrawerBody");
  if (!body) return;

  const favList = favorites.map(id => products.find(x => x.id === id)).filter(Boolean);

  if (favList.length === 0) {
    body.innerHTML = `
      <div class="drawer-empty-msg">
        <i class="fa-regular fa-heart"></i>
        <h4 style="font-family: var(--font-serif); font-size: 22px; margin-bottom: 6px;">В избранном пока пусто</h4>
        <p style="font-size: 13px;">Нажимайте на сердечко в каталоге, чтобы сохранить понравившиеся модели</p>
      </div>
    `;
    return;
  }

  body.innerHTML = favList.map(p => `
    <div class="drawer-item">
      <img src="${p.image}" onerror="this.onerror=null; this.src='${p.fallback || 'images/placeholder.jpg'}'" alt="${p.name}">
      <div class="drawer-item-info">
        <h4>${p.name}</h4>
        <small>${p.material || ""}</small>
        <div class="drawer-item-price">${formatMoney(p.price)}</div>
        <button class="btn btn-luxury" style="padding: 6px 14px; font-size: 10px; margin-top: 8px;" onclick="openProductModal(${p.id})">
          Выбрать и заказать
        </button>
      </div>
      <button class="drawer-remove-btn" onclick="toggleFavorite(${p.id})" title="Удалить">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join("");
}

// Update Badges Counters
function updateBadges() {
  const cartQty = cart.reduce((acc, item) => acc + item.qty, 0);
  if (cartBadge) {
    cartBadge.textContent = cartQty;
    cartBadge.classList.add("pop");
    setTimeout(() => cartBadge.classList.remove("pop"), 200);
  }

  if (favBadge) {
    favBadge.textContent = favorites.length;
    favBadge.classList.add("pop");
    setTimeout(() => favBadge.classList.remove("pop"), 200);
  }
}

// Drawers & Overlays Management
function openDrawer(drawerId) {
  closeAllDrawers();
  const drawer = document.getElementById(drawerId);
  if (drawer) drawer.classList.add("open");
  if (overlay) overlay.classList.add("active");
  document.body.classList.add("lock-scroll");
}

function closeAllDrawers() {
  document.querySelectorAll(".side-drawer").forEach(d => d.classList.remove("open"));
  document.querySelectorAll(".mobile-nav-drawer").forEach(d => d.classList.remove("open"));
  if (overlay) overlay.classList.remove("active");
  document.body.classList.remove("lock-scroll");
}

// WhatsApp Smart Checkout Flow
function openCheckoutModal(target = "cart") {
  checkoutTarget = target;
  closeAllDrawers();

  const modal = document.getElementById("checkoutModal");
  const summaryBox = document.getElementById("checkoutSummaryList");
  const totalAmountEl = document.getElementById("checkoutTotalAmount");
  if (!modal) return;

  let itemsHtml = "";
  let totalCost = 0;

  if (checkoutTarget === "single" && currentModalProduct) {
    const colors = currentModalProduct.colors || [{ name: "Стандарт" }];
    const c = colors[selectedColorIndex] || { name: "Стандарт" };
    const lineTotal = currentModalProduct.price * selectedQuantity;
    totalCost = lineTotal;
    itemsHtml = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>${currentModalProduct.name} (${c.name}${selectedSize ? ', ' + selectedSize : ''}) × ${selectedQuantity}</span>
        <strong>${formatMoney(lineTotal)}</strong>
      </div>
    `;
  } else {
    // From cart
    if (cart.length === 0) {
      showToast("Ваша корзина пуста!");
      return;
    }
    itemsHtml = cart.map(item => {
      const p = products.find(x => x.id === item.id);
      if (!p) return "";
      const colors = p.colors || [{ name: "Стандарт" }];
      const c = colors[item.colorIndex] || { name: "Стандарт" };
      const lineTotal = p.price * item.qty;
      totalCost += lineTotal;
      return `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>${p.name} (${c.name}${item.size ? ', ' + item.size : ''}) × ${item.qty}</span>
          <strong>${formatMoney(lineTotal)}</strong>
        </div>
      `;
    }).join("");

    if (appliedDiscount > 0) {
      totalCost = Math.round(totalCost * (1 - appliedDiscount / 100));
    }
  }

  if (summaryBox) summaryBox.innerHTML = itemsHtml;
  if (totalAmountEl) totalAmountEl.textContent = formatMoney(totalCost);

  modal.classList.add("open");
  document.body.classList.add("lock-scroll");
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.remove("open");
  document.body.classList.remove("lock-scroll");
}

// Submit Order directly to WhatsApp and save to Admin CRM
function submitWhatsAppOrder(e) {
  if (e) e.preventDefault();

  const name = document.getElementById("orderCustomerName")?.value.trim() || "Клиент";
  const phone = document.getElementById("orderCustomerPhone")?.value.trim() || "Не указан";
  const address = document.getElementById("orderCustomerAddress")?.value.trim() || "г. Душанбе";
  const payment = document.getElementById("orderPaymentMethod")?.value || "Наличными при получении";
  const note = document.getElementById("orderCustomerNote")?.value.trim();

  let message = `✨ *ЗАКАЗ ИЗ ИНТЕРНЕТ-МАГАЗИНА HADIDJA SHOP* ✨\n`;
  message += `────────────────────────────\n`;
  message += `🛍 *СОСТАВ ЗАКАЗА:*\n\n`;

  let totalCost = 0;
  const orderItems = [];

  if (checkoutTarget === "single" && currentModalProduct) {
    const colors = currentModalProduct.colors || [{ name: "Стандарт" }];
    const c = colors[selectedColorIndex] || { name: "Стандарт" };
    const cost = currentModalProduct.price * selectedQuantity;
    totalCost = cost;
    message += `1. *${currentModalProduct.name}*\n`;
    message += `   • Расцветка: ${c.name}\n`;
    if (selectedSize) message += `   • Размер: ${selectedSize}\n`;
    message += `   • Количество: ${selectedQuantity} шт.\n`;
    message += `   • Сумма: ${formatMoney(cost)}\n\n`;

    orderItems.push({
      id: currentModalProduct.id,
      name: currentModalProduct.name,
      color: c.name,
      size: selectedSize || "",
      qty: selectedQuantity,
      price: currentModalProduct.price
    });
  } else {
    cart.forEach((item, index) => {
      const p = products.find(x => x.id === item.id);
      if (!p) return;
      const colors = p.colors || [{ name: "Стандарт" }];
      const c = colors[item.colorIndex] || { name: "Стандарт" };
      const cost = p.price * item.qty;
      totalCost += cost;

      message += `${index + 1}. *${p.name}*\n`;
      message += `   • Расцветка: ${c.name}\n`;
      if (item.size) message += `   • Размер: ${item.size}\n`;
      message += `   • Количество: ${item.qty} шт.\n`;
      message += `   • Сумма: ${formatMoney(cost)}\n\n`;

      orderItems.push({
        id: p.id,
        name: p.name,
        color: c.name,
        size: item.size || "",
        qty: item.qty,
        price: p.price
      });
    });

    if (appliedDiscount > 0) {
      const beforeDisc = totalCost;
      totalCost = Math.round(totalCost * (1 - appliedDiscount / 100));
      message += `🏷 *Промокод:* -${appliedDiscount}% (Скидка: ${beforeDisc - totalCost} сомони)\n\n`;
    }
  }

  message += `────────────────────────────\n`;
  message += `💰 *ИТОГО К ОПЛАТЕ:* *${formatMoney(totalCost)}*\n`;
  if (totalCost >= FREE_SHIPPING_THRESHOLD) {
    message += `🚚 *Доставка:* БЕСПЛАТНАЯ (акция от ${FREE_SHIPPING_THRESHOLD} сомони)\n`;
  }
  message += `────────────────────────────\n\n`;

  message += `📍 *ДАННЫЕ ПОЛУЧАТЕЛЯ:*\n`;
  message += `• *Имя:* ${name}\n`;
  message += `• *Телефон:* ${phone}\n`;
  message += `• *Адрес доставки:* ${address}\n`;
  message += `• *Оплата:* ${payment}\n`;
  if (note) message += `• *Пожелания:* ${note}\n`;

  message += `\nПожалуйста, подтвердите наличие и время доставки! 🌸`;

  // Save to Admin CRM (hadidja_orders_db)
  try {
    const orders = JSON.parse(localStorage.getItem("hadidja_orders_db") || "[]");
    const newOrder = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleString("ru-RU"),
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      paymentMethod: payment,
      note: note || "",
      total: totalCost,
      status: "Новый",
      items: orderItems
    };
    orders.unshift(newOrder);
    localStorage.setItem("hadidja_orders_db", JSON.stringify(orders));
  } catch (err) {
    console.error("Failed to save order to local CRM:", err);
  }

  // Open WhatsApp Link
  const encoded = encodeURIComponent(message);
  const waTarget = storeSettings.whatsapp || WHATSAPP_NUMBER;
  const waUrl = `https://wa.me/${waTarget}?text=${encoded}`;

  window.open(waUrl, "_blank");

  // If ordering cart, clear cart
  if (checkoutTarget === "cart") {
    cart = [];
    saveState();
    updateBadges();
    renderCartDrawer();
  }

  closeCheckoutModal();
  showToast("Заказ сформирован! Переходим в WhatsApp...", "fa-brands fa-whatsapp");
}

// Initial Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  applySettingsToDom();

  // Category tabs filter
  document.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.dataset.filter || "Все";
      renderCatalog();
    });
  });

  // Search input
  const searchInput = document.getElementById("catalogSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // Sort select
  const sortSelect = document.getElementById("catalogSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderCatalog();
    });
  }

  // Category showcase clicks
  document.querySelectorAll(".category-tile").forEach(tile => {
    tile.addEventListener("click", () => {
      const cat = tile.dataset.category;
      if (cat) {
        activeCategory = cat;
        document.querySelectorAll(".filter-pill").forEach(p => {
          p.classList.toggle("active", p.dataset.filter === cat);
        });
        renderCatalog();
        document.getElementById("catalogSection")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Header scroll appearance
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    const backToTop = document.getElementById("backToTopBtn");

    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    if (window.scrollY > 500) {
      backToTop?.classList.add("visible");
    } else {
      backToTop?.classList.remove("visible");
    }
  });

  // Back to top click
  document.getElementById("backToTopBtn")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // FAQ Accordions
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-question");
    if (q) {
      q.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
      });
    }
  });

  // Mobile drawer trigger
  document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
    document.getElementById("mobileNavDrawer")?.classList.add("open");
    overlay?.classList.add("active");
    document.body.classList.add("lock-scroll");
  });

  // Drawer triggers
  document.getElementById("openCartBtn")?.addEventListener("click", () => {
    renderCartDrawer();
    openDrawer("cartDrawer");
  });

  document.getElementById("openFavBtn")?.addEventListener("click", () => {
    renderFavoritesDrawer();
    openDrawer("favoritesDrawer");
  });

  // Close overlays
  overlay?.addEventListener("click", () => {
    closeAllDrawers();
    closeProductModal();
    closeCheckoutModal();
  });

  document.querySelectorAll(".drawer-close").forEach(btn => {
    btn.addEventListener("click", closeAllDrawers);
  });

  // Secret Hotkey Ctrl+Shift+A to open Admin Panel
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a" || e.key === "Ф" || e.key === "ф")) {
      window.location.href = "admin.html";
    }
  });

  // Initial Renders
  renderCatalog();
  renderCartDrawer();
  renderFavoritesDrawer();
  updateBadges();
});
