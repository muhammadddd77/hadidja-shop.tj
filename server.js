/**
 * HADIDJA SHOP — Backend API Server
 * Node.js & Express REST API Engine
 * Port: 5000
 */

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Directories
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");
const IMAGES_DIR = path.join(__dirname, "images");
const DIST_DIR = path.join(__dirname, "dist");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static Folders
app.use("/uploads", express.static(UPLOADS_DIR));
if (fs.existsSync(IMAGES_DIR)) {
  app.use("/images", express.static(IMAGES_DIR));
}

// Initial Seed Data
const INITIAL_SETTINGS = {
  whatsapp: "992886006528",
  whatsappFormatted: "+992 88 600 65 28",
  instagram: "@hadidja_shop_tj",
  instagramUrl: "https://www.instagram.com/hadidja_shop_tj/",
  address: "г. Душанбе, Таджикистан",
  announcement: "✦ БЕСПЛАТНАЯ ДОСТАВКА ПО ДУШАНБЕ ОТ 250 СОМОНИ · ПРИМЕРКА ПЕРЕД ОПЛАТОЙ · ЗАКАЗ В WHATSAPP",
  freeShippingThreshold: 250,
  currency: "сомони"
};

const INITIAL_ADMINS = [
  {
    id: 1,
    username: "admin",
    passwordHash: crypto.createHash("sha256").update("admin").digest("hex"),
    fullName: "Главный Администратор",
    role: "Владелец",
    createdAt: new Date().toISOString()
  }
];

const INITIAL_PRODUCTS = [
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
    description: "Идеальный подарок в фирменной золотой коробке: шёлковый платок, 4 пары ультра-прочных магнитных булавок и хлопковая шапочка-подхиджабник.",
    colors: [
      { name: "Золотистый сет", hex: "#c5a880", quantity: 5, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85" },
      { name: "Чёрный нуар", hex: "#111111", quantity: 4, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=85" }
    ]
  }
];

// Database Helper
function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb = {
      settings: INITIAL_SETTINGS,
      admins: INITIAL_ADMINS,
      products: INITIAL_PRODUCTS,
      orders: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
    return initialDb;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading DB file, recreating...", err);
    const fallbackDb = {
      settings: INITIAL_SETTINGS,
      admins: INITIAL_ADMINS,
      products: INITIAL_PRODUCTS,
      orders: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallbackDb, null, 2), "utf-8");
    return fallbackDb;
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// 1. Health & Info
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", boutique: "HADIDJA SHOP", time: new Date().toISOString() });
});

// 2. Settings
app.get("/api/settings", (req, res) => {
  const db = readDb();
  res.json(db.settings || INITIAL_SETTINGS);
});

app.put("/api/settings", (req, res) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// 3. Auth (Login & Register)
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Введите логин и пароль" });
  }

  const db = readDb();
  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
  const admin = (db.admins || []).find(
    (a) => a.username.toLowerCase() === username.toLowerCase() && a.passwordHash === passwordHash
  );

  if (!admin) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  // Store session token in admin record
  admin.token = token;
  writeDb(db);

  res.json({
    success: true,
    token,
    user: {
      id: admin.id,
      username: admin.username,
      fullName: admin.fullName,
      role: admin.role
    }
  });
});

app.post("/api/auth/register", (req, res) => {
  const { username, password, fullName } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Логин и пароль обязательны" });
  }

  const db = readDb();
  const exists = (db.admins || []).some(
    (a) => a.username.toLowerCase() === username.toLowerCase()
  );

  if (exists) {
    return res.status(400).json({ error: "Администратор с таким логином уже существует" });
  }

  const newAdmin = {
    id: Date.now(),
    username: username.trim(),
    passwordHash: crypto.createHash("sha256").update(password).digest("hex"),
    fullName: fullName ? fullName.trim() : "Администратор",
    role: "Менеджер",
    createdAt: new Date().toISOString()
  };

  db.admins.push(newAdmin);
  writeDb(db);

  const token = crypto.randomBytes(32).toString("hex");
  newAdmin.token = token;
  writeDb(db);

  res.json({
    success: true,
    token,
    user: {
      id: newAdmin.id,
      username: newAdmin.username,
      fullName: newAdmin.fullName,
      role: newAdmin.role
    }
  });
});

app.get("/api/auth/me", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Не авторизован" });

  const db = readDb();
  const admin = (db.admins || []).find((a) => a.token === token);
  if (!admin) return res.status(401).json({ error: "Сессия истекла" });

  res.json({
    user: {
      id: admin.id,
      username: admin.username,
      fullName: admin.fullName,
      role: admin.role
    }
  });
});

// 4. Products (CRUD)
app.get("/api/products", (req, res) => {
  const db = readDb();
  res.json(db.products || []);
});

app.get("/api/products/:id", (req, res) => {
  const db = readDb();
  const id = Number(req.params.id);
  const product = (db.products || []).find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: "Товар не найден" });
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const db = readDb();
  const p = req.body;
  if (!p.name || !p.price) {
    return res.status(400).json({ error: "Название и цена обязательны" });
  }

  const newProduct = {
    id: Date.now(),
    name: p.name.trim(),
    category: p.category || "Платки",
    price: Number(p.price) || 0,
    oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
    discount: p.oldPrice && p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0,
    size: p.size || "120 × 120 см",
    sizes: p.sizes || (p.category === "Платья" ? ["S", "M", "L", "XL"] : undefined),
    material: p.material || "Премиум шёлк",
    badge: p.badge || "",
    rating: 5.0,
    reviewsCount: Math.floor(12 + Math.random() * 30),
    image: p.image || "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=85",
    description: p.description || "Премиальное качество HADIDJA SHOP.",
    colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [
      { name: "Основной", hex: "#111111", quantity: 5, image: p.image }
    ],
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  writeDb(db);
  res.status(201).json({ success: true, product: newProduct });
});

app.put("/api/products/:id", (req, res) => {
  const db = readDb();
  const id = Number(req.params.id);
  const index = (db.products || []).findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Товар не найден" });

  const p = req.body;
  const updated = {
    ...db.products[index],
    ...p,
    id,
    price: Number(p.price) || db.products[index].price,
    oldPrice: p.oldPrice !== undefined ? (p.oldPrice ? Number(p.oldPrice) : null) : db.products[index].oldPrice,
    discount: p.oldPrice && p.price ? Math.round((1 - Number(p.price) / Number(p.oldPrice)) * 100) : 0
  };

  db.products[index] = updated;
  writeDb(db);
  res.json({ success: true, product: updated });
});

app.delete("/api/products/:id", (req, res) => {
  const db = readDb();
  const id = Number(req.params.id);
  db.products = (db.products || []).filter((p) => p.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// 5. Image Upload & Clipboard Paste (Base64 -> File on disk)
app.post("/api/upload", (req, res) => {
  const { image, filename } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Изображение не предоставлено" });
  }

  // Handle base64 data url (e.g. data:image/jpeg;base64,...)
  let base64Data = image;
  let extension = "jpg";

  if (image.startsWith("data:image/")) {
    const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      extension = matches[1] === "jpeg" ? "jpg" : matches[1];
      base64Data = matches[2];
    } else {
      base64Data = image.split(",")[1] || image;
    }
  }

  const uniqueName = `hadidja-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, uniqueName);

  try {
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${uniqueName}`;
    res.json({ success: true, url: publicUrl, name: uniqueName });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Ошибка сохранения изображения" });
  }
});

// 6. Orders (CRM)
app.get("/api/orders", (req, res) => {
  const db = readDb();
  res.json(db.orders || []);
});

app.post("/api/orders", (req, res) => {
  const db = readDb();
  const order = {
    id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toLocaleString("ru-RU"),
    createdAt: new Date().toISOString(),
    status: "Новый",
    ...req.body
  };

  if (!db.orders) db.orders = [];
  db.orders.unshift(order);
  writeDb(db);

  res.status(201).json({ success: true, order });
});

app.patch("/api/orders/:id/status", (req, res) => {
  const db = readDb();
  const { status } = req.body;
  const order = (db.orders || []).find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Заказ не найден" });

  order.status = status;
  writeDb(db);
  res.json({ success: true, order });
});

// 7. Reset Catalog to Default Luxury Seed
app.post("/api/reset", (req, res) => {
  const db = readDb();
  db.products = INITIAL_PRODUCTS;
  db.settings = INITIAL_SETTINGS;
  writeDb(db);
  res.json({ success: true, message: "Каталог сброшен к исходным товарам HADIDJA" });
});

// Serve frontend in production (dist folder)
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api") && !req.path.startsWith("/uploads")) {
      res.sendFile(path.join(DIST_DIR, "index.html"));
    }
  });
}

// Start Server
readDb(); // Initialize database file immediately if not present

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✦ HADIDJA SHOP API Server running on http://localhost:${PORT}`);
  console.log(`✦ API Endpoints: http://localhost:${PORT}/api/products`);
  console.log(`✦ Uploads: http://localhost:${PORT}/uploads`);
  console.log(`======================================================\n`);
});
