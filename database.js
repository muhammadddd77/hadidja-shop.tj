import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "hadidja.sqlite");

// Enable verbose mode in dev
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(DB_PATH);

// Helper wrappers for Promises
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Initialize schema & migrate from db.json if exists
export async function initDatabase() {
  // WAL mode for fast concurrency & durability
  await dbRun("PRAGMA journal_mode = WAL;");
  await dbRun("PRAGMA foreign_keys = ON;");

  // 1. Users table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT,
      fullName TEXT,
      passwordHash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      createdAt TEXT NOT NULL
    )
  `);

  // 2. Products table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      oldPrice REAL,
      badge TEXT,
      material TEXT,
      size TEXT,
      description TEXT,
      image TEXT NOT NULL,
      colors TEXT NOT NULL, -- JSON string
      createdAt TEXT NOT NULL
    )
  `);

  // 3. Orders table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT,
      customerPhone TEXT,
      customerAddress TEXT,
      items TEXT NOT NULL, -- JSON string
      total REAL NOT NULL,
      status TEXT DEFAULT 'Новый',
      notes TEXT,
      createdAt TEXT NOT NULL
    )
  `);

  // 4. Settings table (key-value)
  await dbRun(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Migration from db.json if table is empty
  const productsCount = await dbGet("SELECT COUNT(*) as count FROM products");
  const usersCount = await dbGet("SELECT COUNT(*) as count FROM users");

  const legacyDbFile = path.join(DATA_DIR, "db.json");
  let legacyData = null;
  if (fs.existsSync(legacyDbFile)) {
    try {
      legacyData = JSON.parse(fs.readFileSync(legacyDbFile, "utf-8"));
    } catch (e) {
      console.warn("Could not parse legacy db.json:", e);
    }
  }

  // Seed default settings
  const defaultSettings = {
    whatsapp: "992886006528",
    whatsappFormatted: "+992 88 600 65 28",
    instagram: "@hadidja_shop_tj",
    instagramUrl: "https://www.instagram.com/hadidja_shop_tj/",
    address: "г. Душанбе, Таджикистан",
    announcement: "✦ БЕСПЛАТНАЯ ДОСТАВКА ПО ДУШАНБЕ ОТ 250 СОМОНИ · ПРИМЕРКА ПЕРЕД ОПЛАТОЙ · ЗАКАЗ В WHATSAPP",
    freeShippingThreshold: "250",
    currency: "сомони",
    ownerEmail: "muhammadganiev235@gmail.com",
    adminInviteCode: "HADIDJA-VIP-2026" // Секретный код для регистрации новых админов
  };

  const currentSettings = legacyData?.settings || defaultSettings;
  for (const [k, v] of Object.entries(currentSettings)) {
    const existing = await dbGet("SELECT key FROM settings WHERE key = ?", [k]);
    if (!existing) {
      await dbRun("INSERT INTO settings (key, value) VALUES (?, ?)", [
        k,
        typeof v === "object" ? JSON.stringify(v) : String(v)
      ]);
    }
  }
  // Make sure invite code and email exist
  if (!(await dbGet("SELECT key FROM settings WHERE key = 'ownerEmail'"))) {
    await dbRun("INSERT INTO settings (key, value) VALUES ('ownerEmail', ?)", ["muhammadganiev235@gmail.com"]);
  }
  if (!(await dbGet("SELECT key FROM settings WHERE key = 'adminInviteCode'"))) {
    await dbRun("INSERT INTO settings (key, value) VALUES ('adminInviteCode', ?)", ["HADIDJA-VIP-2026"]);
  }

  // Seed admin user if none
  if (usersCount.count === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("admin", salt);
    await dbRun(`
      INSERT INTO users (username, email, fullName, passwordHash, role, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      "admin",
      "muhammadganiev235@gmail.com",
      "Владелец Hadidja Shop",
      hash,
      "superadmin",
      new Date().toISOString()
    ]);
    console.log("🔒 Default admin created: admin / admin (Salted bcrypt hash)");
  }

  // Seed products if empty
  if (productsCount.count === 0 && legacyData?.products?.length > 0) {
    console.log(`📦 Migrating ${legacyData.products.length} products to SQLite database...`);
    for (const p of legacyData.products) {
      await dbRun(`
        INSERT INTO products (name, category, price, oldPrice, badge, material, size, description, image, colors, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        p.name,
        p.category || "Платки",
        Number(p.price) || 0,
        p.oldPrice ? Number(p.oldPrice) : null,
        p.badge || "",
        p.material || "",
        p.size || "",
        p.description || "",
        p.image || "images/placeholder.jpg",
        JSON.stringify(p.colors || []),
        new Date().toISOString()
      ]);
    }
    console.log("✅ Products migrated successfully into SQLite!");
  }

  // If old db.json exists, rename it to db.json.bak so it's no longer used
  if (fs.existsSync(legacyDbFile)) {
    try {
      fs.renameSync(legacyDbFile, path.join(DATA_DIR, "db.json.bak"));
      console.log("🗑️ Legacy db.json converted to backup db.json.bak. SQLite is now the active DB.");
    } catch (e) {
      // ignore
    }
  }

  console.log("⚡ SQLite Database initialized successfully: data/hadidja.sqlite");
}

export default db;
