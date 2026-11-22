import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { initDatabase, dbRun, dbGet, dbAll } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Persistent JWT Secret
const JWT_SECRET_FILE = path.join(__dirname, "data", ".jwt_secret");
let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (fs.existsSync(JWT_SECRET_FILE)) {
    JWT_SECRET = fs.readFileSync(JWT_SECRET_FILE, "utf-8").trim();
  } else {
    JWT_SECRET = crypto.randomBytes(64).toString("hex");
    try {
      fs.writeFileSync(JWT_SECRET_FILE, JWT_SECRET, "utf-8");
    } catch (e) {
      // ignore
    }
  }
}

// Ensure upload directory exists
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ============================================================================
// 🛡️ SECURITY MIDDLEWARE
// ============================================================================

// 1. Helmet: Secure HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// 2. CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// 3. Body parser with reasonable payload limits
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// 4. Rate Limiter for general API (anti-DDoS)
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 600, // limit each IP to 600 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Слишком много запросов. Попробуйте позже." }
});
app.use("/api/", generalApiLimiter);

// 5. Strict Rate Limiter for Auth (Anti-Brute-Force & Anti-Hack)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // Max 10 attempts per 15 minutes to prevent password cracking
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Слишком много попыток входа! В целях безопасности доступ временно заблокирован на 15 минут."
  }
});

// 6. JWT Auth Middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Доступ запрещен: требуется авторизация" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Сессия истекла или недействительна. Войдите снова." });
    }
    req.user = user;
    next();
  });
}

// Serve uploaded images securely
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use("/images", express.static(path.join(__dirname, "images")));

// ============================================================================
// 🔐 AUTH ENDPOINTS
// ============================================================================

// POST /api/auth/login
app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Введите логин и пароль" });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const user = await dbGet("SELECT * FROM users WHERE LOWER(username) = ?", [cleanUsername]);

    if (!user) {
      return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    const isValid = bcrypt.compareSync(String(password), user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

// POST /api/auth/register
app.post("/api/auth/register", authLimiter, async (req, res) => {
  try {
    const { fullName, username, password, email, inviteCode } = req.body;

    if (!fullName || !username || !password) {
      return res.status(400).json({ error: "Заполните все обязательные поля" });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    if (cleanUsername.length < 3) {
      return res.status(400).json({ error: "Логин должен быть не менее 3 символов" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: "Пароль должен быть не менее 6 символов" });
    }

    // Security Invite Code verification
    const inviteSetting = await dbGet("SELECT value FROM settings WHERE key = 'adminInviteCode'");
    const requiredCode = inviteSetting ? inviteSetting.value : "HADIDJA-VIP-2026";

    // If there is already an admin, enforce the inviteCode protection
    const adminCount = await dbGet("SELECT COUNT(*) as count FROM users");
    if (adminCount.count > 0) {
      if (!inviteCode || String(inviteCode).trim() !== requiredCode.trim()) {
        return res.status(403).json({
          error: "Неверный секретный код приглашения! Регистрация разрешена только доверенным администраторам."
        });
      }
    }

    // Check if user already exists
    const existing = await dbGet("SELECT id FROM users WHERE LOWER(username) = ?", [cleanUsername]);
    if (existing) {
      return res.status(409).json({ error: "Пользователь с таким логином уже существует" });
    }

    // Hash password with bcrypt salt
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(String(password), salt);

    const now = new Date().toISOString();
    const result = await dbRun(
      `INSERT INTO users (username, email, fullName, passwordHash, role, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cleanUsername, email || "muhammadganiev235@gmail.com", fullName.trim(), passwordHash, "admin", now]
    );

    const token = jwt.sign(
      {
        id: result.id,
        username: cleanUsername,
        role: "admin",
        fullName: fullName.trim()
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.id,
        username: cleanUsername,
        fullName: fullName.trim(),
        email: email || "muhammadganiev235@gmail.com",
        role: "admin"
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Ошибка регистрации" });
  }
});

// GET /api/auth/me (Verify token)
app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await dbGet("SELECT id, username, fullName, email, role, createdAt FROM users WHERE id = ?", [
      req.user.id
    ]);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "Ошибка проверки авторизации" });
  }
});

// PUT /api/auth/change-password
app.put("/api/auth/change-password", requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Новый пароль должен быть не менее 6 символов" });
    }

    const user = await dbGet("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    if (!bcrypt.compareSync(oldPassword, user.passwordHash)) {
      return res.status(400).json({ error: "Старый пароль неверен" });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    await dbRun("UPDATE users SET passwordHash = ? WHERE id = ?", [newHash, req.user.id]);

    res.json({ success: true, message: "Пароль успешно изменен" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка смены пароля" });
  }
});

// PUT /api/auth/profile (Update admin profile: fullName, username, email, and optional password)
app.put("/api/auth/profile", requireAuth, async (req, res) => {
  try {
    const { fullName, username, email, currentPassword, newPassword } = req.body;
    const user = await dbGet("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    const cleanUsername = username ? String(username).trim().toLowerCase() : user.username;
    if (cleanUsername !== user.username) {
      const existing = await dbGet("SELECT id FROM users WHERE LOWER(username) = ? AND id != ?", [cleanUsername, user.id]);
      if (existing) {
        return res.status(409).json({ error: "Этот логин уже занят другим администратором" });
      }
    }

    let passwordHash = user.passwordHash;
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Для смены пароля введите текущий пароль" });
      }
      if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
        return res.status(400).json({ error: "Текущий пароль введен неверно" });
      }
      if (String(newPassword).length < 6) {
        return res.status(400).json({ error: "Новый пароль должен быть не менее 6 символов" });
      }
      passwordHash = bcrypt.hashSync(String(newPassword), 10);
    }

    const updatedFullName = fullName ? String(fullName).trim() : user.fullName;
    const updatedEmail = email !== undefined ? String(email).trim() : user.email;

    await dbRun(
      `UPDATE users SET fullName = ?, username = ?, email = ?, passwordHash = ? WHERE id = ?`,
      [updatedFullName, cleanUsername, updatedEmail, passwordHash, user.id]
    );

    if (updatedEmail) {
      await dbRun(
        `INSERT INTO settings (key, value) VALUES ('ownerEmail', ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        [updatedEmail]
      );
    }

    const updatedUser = {
      id: user.id,
      username: cleanUsername,
      fullName: updatedFullName,
      email: updatedEmail,
      role: user.role
    };

    const token = jwt.sign(
      {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
        fullName: updatedUser.fullName
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Данные администратора успешно обновлены!",
      token,
      user: updatedUser
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Ошибка при обновлении профиля" });
  }
});

// ============================================================================
// 📦 PRODUCTS ENDPOINTS
// ============================================================================

// GET /api/products (Public)
app.get("/api/products", async (req, res) => {
  try {
    const rows = await dbAll("SELECT * FROM products ORDER BY id DESC");
    const products = rows.map((r) => ({
      ...r,
      colors: r.colors ? JSON.parse(r.colors) : []
    }));
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Ошибка загрузки товаров" });
  }
});

// POST /api/products (Protected)
app.post("/api/products", requireAuth, async (req, res) => {
  try {
    const { name, category, price, oldPrice, badge, material, size, description, image, colors } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Название и цена обязательны" });
    }

    const now = new Date().toISOString();
    const result = await dbRun(
      `INSERT INTO products (name, category, price, oldPrice, badge, material, size, description, image, colors, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category || "Платки",
        Number(price),
        oldPrice ? Number(oldPrice) : null,
        badge || "",
        material || "",
        size || "",
        description || "",
        image || "images/placeholder.jpg",
        JSON.stringify(colors || []),
        now
      ]
    );

    const created = await dbGet("SELECT * FROM products WHERE id = ?", [result.id]);
    created.colors = JSON.parse(created.colors);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Ошибка создания товара" });
  }
});

// PUT /api/products/:id (Protected)
app.put("/api/products/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, oldPrice, badge, material, size, description, image, colors } = req.body;

    const existing = await dbGet("SELECT id FROM products WHERE id = ?", [id]);
    if (!existing) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    await dbRun(
      `UPDATE products
       SET name = ?, category = ?, price = ?, oldPrice = ?, badge = ?,
           material = ?, size = ?, description = ?, image = ?, colors = ?
       WHERE id = ?`,
      [
        name,
        category,
        Number(price),
        oldPrice ? Number(oldPrice) : null,
        badge || "",
        material || "",
        size || "",
        description || "",
        image,
        JSON.stringify(colors || []),
        id
      ]
    );

    const updated = await dbGet("SELECT * FROM products WHERE id = ?", [id]);
    updated.colors = JSON.parse(updated.colors);
    res.json(updated);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Ошибка обновления товара" });
  }
});

// DELETE /api/products/:id (Protected)
app.delete("/api/products/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbGet("SELECT id FROM products WHERE id = ?", [id]);
    if (!existing) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    await dbRun("DELETE FROM products WHERE id = ?", [id]);
    res.json({ success: true, message: "Товар успешно удален" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Ошибка удаления товара" });
  }
});

// ============================================================================
// 📋 ORDERS CRM ENDPOINTS
// ============================================================================

// GET /api/orders (Protected)
app.get("/api/orders", requireAuth, async (req, res) => {
  try {
    const rows = await dbAll("SELECT * FROM orders ORDER BY id DESC");
    const orders = rows.map((r) => ({
      ...r,
      items: r.items ? JSON.parse(r.items) : []
    }));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Ошибка загрузки заказов" });
  }
});

// POST /api/orders (Public - for customer checkout)
app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, items, total, notes } = req.body;

    const now = new Date().toISOString();
    const result = await dbRun(
      `INSERT INTO orders (customerName, customerPhone, customerAddress, items, total, status, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, 'Новый', ?, ?)`,
      [
        customerName || "Покупатель",
        customerPhone || "",
        customerAddress || "",
        JSON.stringify(items || []),
        Number(total) || 0,
        notes || "",
        now
      ]
    );

    res.status(201).json({ success: true, orderId: result.id });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Ошибка сохранения заказа" });
  }
});

// PATCH /api/orders/:id/status (Protected)
app.patch("/api/orders/:id/status", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await dbRun("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    res.json({ success: true, id, status });
  } catch (err) {
    res.status(500).json({ error: "Ошибка обновления статуса" });
  }
});

// ============================================================================
// ⚙️ SETTINGS ENDPOINTS
// ============================================================================

// GET /api/settings (Public)
app.get("/api/settings", async (req, res) => {
  try {
    const rows = await dbAll("SELECT key, value FROM settings");
    const settings = {};
    for (const r of rows) {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch (e) {
        settings[r.key] = r.value;
      }
    }
    // Mask sensitive fields in public response
    const publicSettings = { ...settings };
    delete publicSettings.adminInviteCode; // hide secret invite code from public
    res.json(publicSettings);
  } catch (err) {
    res.status(500).json({ error: "Ошибка загрузки настроек" });
  }
});

// GET /api/settings/admin (Protected - includes adminInviteCode & owner email)
app.get("/api/settings/admin", requireAuth, async (req, res) => {
  try {
    const rows = await dbAll("SELECT key, value FROM settings");
    const settings = {};
    for (const r of rows) {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch (e) {
        settings[r.key] = r.value;
      }
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Ошибка загрузки настроек" });
  }
});

// PUT /api/settings (Protected)
app.put("/api/settings", requireAuth, async (req, res) => {
  try {
    const newSettings = req.body;
    for (const [k, v] of Object.entries(newSettings)) {
      const valStr = typeof v === "object" ? JSON.stringify(v) : String(v);
      await dbRun(
        `INSERT INTO settings (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        [k, valStr]
      );
    }
    res.json({ success: true, message: "Настройки успешно сохранены" });
  } catch (err) {
    console.error("Settings update error:", err);
    res.status(500).json({ error: "Ошибка обновления настроек" });
  }
});

// ============================================================================
// 🖼️ SECURE IMAGE UPLOAD (BASE64 & CLIPBOARD)
// ============================================================================

app.post("/api/upload", requireAuth, async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Нет данных изображения" });
    }

    const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: "Неверный формат изображения (ожидается base64)" });
    }

    let ext = matches[1].toLowerCase();
    if (ext === "jpeg") ext = "jpg";
    if (!["jpg", "png", "webp"].includes(ext)) {
      return res.status(400).json({ error: "Поддерживаются только форматы JPG, PNG, WEBP" });
    }

    const buffer = Buffer.from(matches[2], "base64");
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "Файл превышает допустимый размер (макс 10MB)" });
    }

    // Cryptographically secure unique filename
    const filename = `hadidja_${Date.now()}_${crypto.randomBytes(8).toString("hex")}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, buffer);
    res.json({ success: true, url: `/uploads/${filename}` });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Ошибка сохранения изображения" });
  }
});

// ============================================================================
// 🔄 DATABASE RESET / RESTORE
// ============================================================================

app.post("/api/reset", requireAuth, async (req, res) => {
  try {
    await dbRun("DELETE FROM products");
    const seedProducts = [
      {
        name: "Шёлковый платок «Royal Silk»",
        category: "Платки",
        price: 120,
        oldPrice: 150,
        badge: "ХИТ",
        material: "Натуральный шёлк Гирбишин",
        size: "120 × 120 см",
        description: "Эксклюзивный платок из натурального плотного шёлка гирбишин. Мягко драпируется, держит благородную форму.",
        image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=85",
        colors: [
          { name: "Чёрный графит", hex: "#1c1c1c", quantity: 6 },
          { name: "Шампань-беж", hex: "#ecd9c2", quantity: 5 },
          { name: "Нежная пудра", hex: "#e7cbcf", quantity: 3 }
        ]
      },
      {
        name: "Платье «Madina Silk Abaya»",
        category: "Платья",
        price: 380,
        oldPrice: 450,
        badge: "НОВИНКА",
        material: "Премиальный дубайский шёлк",
        size: "42-48 (Оверсайз с поясом)",
        description: "Роскошное авторское платье-абая в пол свободного кроя. В комплекте идёт акцентный шёлковый пояс.",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85",
        colors: [
          { name: "Глубокий чёрный", hex: "#111111", quantity: 4 },
          { name: "Королевский изумруд", hex: "#1b4d3e", quantity: 3 }
        ]
      }
    ];

    for (const p of seedProducts) {
      await dbRun(
        `INSERT INTO products (name, category, price, oldPrice, badge, material, size, description, image, colors, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.name,
          p.category,
          p.price,
          p.oldPrice,
          p.badge,
          p.material,
          p.size,
          p.description,
          p.image,
          JSON.stringify(p.colors),
          new Date().toISOString()
        ]
      );
    }

    res.json({ success: true, message: "Каталог успешно сброшен к базовым товарам" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сброса каталога" });
  }
});

// Production: serve built static files
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  const indexHtml = path.join(__dirname, "dist", "index.html");
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.send("HADIDJA SHOP API Server is running. (Run 'npm run build' to serve the React frontend)");
  }
});

// Start Server after DB initialization
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✨ HADIDJA SHOP Luxury API Server running on http://localhost:${PORT}`);
      console.log(`🛡️ Rate limiting & JWT authentication active`);
      console.log(`🗄️ Database: SQLite (data/hadidja.sqlite)`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to initialize database:", err);
  });
