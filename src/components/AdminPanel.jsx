import React, { useState, useEffect } from "react";

export default function AdminPanel({
  products,
  settings,
  onRefreshData,
  onNavigateToStore,
  showToast
}) {
  // Auth state
  const [authToken, setAuthToken] = useState(localStorage.getItem("hadidja_admin_token") || "");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("hadidja_admin_user") || "null")
  );
  const [authTab, setAuthTab] = useState("login"); // "login" or "register"

  // Login form
  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("admin");

  // Register form
  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Admin Navigation
  const [activeTab, setActiveTab] = useState("products"); // "products", "orders", "settings", "backup"

  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);

  // Product Filter
  const [searchFilter, setSearchFilter] = useState("");
  const [catFilter, setCatFilter] = useState("Все");

  // Product Add / Edit Modal
  const [editingProduct, setEditingProduct] = useState(null); // null = modal closed, {} = new product, {...} = edit
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Платки");
  const [formPrice, setFormPrice] = useState("");
  const [formOldPrice, setFormOldPrice] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formMaterial, setFormMaterial] = useState("");
  const [formSize, setFormSize] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formColors, setFormColors] = useState([
    { name: "Основной", hex: "#1c1c1c", quantity: 5 }
  ]);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    if (authToken) {
      loadOrders();
    }
  }, [authToken]);

  // Listen for Clipboard Paste (Ctrl+V) when modal is open!
  useEffect(() => {
    const handlePaste = (e) => {
      if (!editingProduct) return;
      const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            handleImageFile(file);
            showToast("📸 Фото вставлено из буфера обмена!");
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [editingProduct]);

  // Load orders from API
  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Convert image file or pasted blob to compressed base64 / upload
  const handleImageFile = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      // Optimize image on canvas to avoid huge payloads
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 900;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.84);

        // Upload to server endpoint /api/upload
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: compressedBase64 })
          });
          if (res.ok) {
            const data = await res.json();
            setFormImage(data.url);
            showToast("Фото успешно загружено на сервер!");
          } else {
            // Fallback to compressed base64 directly
            setFormImage(compressedBase64);
          }
        } catch (err) {
          setFormImage(compressedBase64);
        }
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  };

  // Auth: Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem("hadidja_admin_token", data.token);
        localStorage.setItem("hadidja_admin_user", JSON.stringify(data.user));
        showToast(`Добро пожаловать, ${data.user.fullName || data.user.username}!`);
      } else {
        alert(data.error || "Неверный логин или пароль");
      }
    } catch (err) {
      alert("Ошибка подключения к серверу");
    }
  };

  // Auth: Register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: regFullName,
          username: regUsername,
          password: regPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem("hadidja_admin_token", data.token);
        localStorage.setItem("hadidja_admin_user", JSON.stringify(data.user));
        showToast("Администратор успешно зарегистрирован!");
      } else {
        alert(data.error || "Ошибка регистрации");
      }
    } catch (err) {
      alert("Ошибка регистрации");
    }
  };

  // Logout
  const handleLogout = () => {
    setAuthToken("");
    setCurrentUser(null);
    localStorage.removeItem("hadidja_admin_token");
    localStorage.removeItem("hadidja_admin_user");
    showToast("Вы вышли из системы");
  };

  // Open Edit / Add Product Modal
  const openEditModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormName(product.name || "");
      setFormCategory(product.category || "Платки");
      setFormPrice(product.price || "");
      setFormOldPrice(product.oldPrice || "");
      setFormBadge(product.badge || "");
      setFormMaterial(product.material || "");
      setFormSize(product.size || "");
      setFormDescription(product.description || "");
      setFormImage(product.image || "");
      setFormColors(
        product.colors && product.colors.length > 0
          ? JSON.parse(JSON.stringify(product.colors))
          : [{ name: "Основной", hex: "#111111", quantity: 5 }]
      );
    } else {
      setEditingProduct({});
      setFormName("");
      setFormCategory("Платки");
      setFormPrice("");
      setFormOldPrice("");
      setFormBadge("NEW");
      setFormMaterial("Натуральный шёлк");
      setFormSize("120 × 120 см");
      setFormDescription("Новая эксклюзивная модель бутика HADIDJA SHOP.");
      setFormImage("https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=85");
      setFormColors([
        { name: "Чёрный", hex: "#111111", quantity: 5 },
        { name: "Шампань", hex: "#ecd9c2", quantity: 5 }
      ]);
    }
  };

  // Save Product (Add or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formName || !formPrice) {
      alert("Пожалуйста, заполните название и цену");
      return;
    }

    const payload = {
      name: formName,
      category: formCategory,
      price: Number(formPrice),
      oldPrice: formOldPrice ? Number(formOldPrice) : null,
      badge: formBadge,
      material: formMaterial,
      size: formSize,
      description: formDescription,
      image: formImage || "images/placeholder.jpg",
      colors: formColors
    };

    try {
      if (editingProduct && editingProduct.id) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast("Товар успешно обновлен!");
          setEditingProduct(null);
          onRefreshData();
        }
      } else {
        // Create
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast("Новый товар добавлен в каталог!");
          setEditingProduct(null);
          onRefreshData();
        }
      }
    } catch (err) {
      alert("Ошибка сохранения товара");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Вы уверены, что хотите удалить «${name}»?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Товар удалён");
        onRefreshData();
      }
    } catch (err) {
      alert("Ошибка при удалении товара");
    }
  };

  // Duplicate Product
  const handleDuplicateProduct = async (product) => {
    const copy = {
      ...product,
      name: `${product.name} (Копия)`,
      id: undefined
    };
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(copy)
      });
      if (res.ok) {
        showToast("Товар скопирован!");
        onRefreshData();
      }
    } catch (err) {
      alert("Ошибка при копировании товара");
    }
  };

  // Update Order Status
  const handleOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Статус заказа изменен на: ${status}`);
        loadOrders();
      }
    } catch (err) {
      alert("Ошибка обновления статуса");
    }
  };

  // Save Store Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        showToast("Настройки магазина успешно сохранены!");
        onRefreshData();
      }
    } catch (err) {
      alert("Ошибка сохранения настроек");
    }
  };

  // Reset database to defaults
  const handleResetCatalog = async () => {
    if (!window.confirm("Сбросить каталог к стандартным товарам HADIDJA SHOP?")) return;
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      if (res.ok) {
        showToast("Каталог сброшен к стандартным товарам");
        onRefreshData();
      }
    } catch (err) {
      alert("Ошибка сброса базы");
    }
  };

  // Export JSON
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ products, settings, orders }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hadidja_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Colors management in modal
  const addColorOption = () => {
    setFormColors([...formColors, { name: "Новый цвет", hex: "#c5a880", quantity: 5 }]);
  };

  const removeColorOption = (index) => {
    setFormColors(formColors.filter((_, i) => i !== index));
  };

  const updateColorOption = (index, field, val) => {
    const updated = [...formColors];
    updated[index][field] = field === "quantity" ? Number(val) : val;
    setFormColors(updated);
  };

  // If not logged in -> Show Luxury Auth Screen
  if (!authToken) {
    return (
      <div className="admin-auth-screen">
        <div className="admin-auth-card">
          <div className="auth-header">
            <div className="logo-monogram" style={{ margin: "0 auto", width: "54px", height: "54px", fontSize: "28px" }}>
              H
            </div>
            <h2>HADIDJA ATELIER</h2>
            <p style={{ fontSize: "12px", color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "4px" }}>
              Панель управления бутиком
            </p>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${authTab === "login" ? "active" : ""}`}
              onClick={() => setAuthTab("login")}
            >
              Вход
            </button>
            <button
              className={`auth-tab ${authTab === "register" ? "active" : ""}`}
              onClick={() => setAuthTab("register")}
            >
              Регистрация
            </button>
          </div>

          {authTab === "login" ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-field">
                <label>Логин администратора</label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                />
              </div>

              <div className="auth-field">
                <label>Пароль</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn btn-gold full" style={{ marginTop: "12px", padding: "14px" }}>
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Войти в панель
              </button>

              <div className="auth-demo-hint">
                ✨ Логин по умолчанию: <strong>admin</strong> | Пароль: <strong>admin</strong>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="auth-field">
                <label>ФИО / Имя сотрудника</label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Мадина (Менеджер)"
                />
              </div>

              <div className="auth-field">
                <label>Придумайте логин</label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="hadidja_manager"
                />
              </div>

              <div className="auth-field">
                <label>Придумайте пароль</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn btn-gold full" style={{ marginTop: "12px", padding: "14px" }}>
                <i className="fa-solid fa-user-plus"></i> Создать аккаунт администратора
              </button>
            </form>
          )}

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <button
              onClick={onNavigateToStore}
              style={{ color: "var(--text-light)", fontSize: "12px", textDecoration: "underline" }}
            >
              ← Вернуться на витрину магазина
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered products list for admin table
  const adminProducts = products.filter((p) => {
    const matchesCat = catFilter === "Все" || p.category === catFilter;
    const matchesSearch =
      !searchFilter ||
      p.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalStockUnits = products.reduce((acc, p) => {
    const cSum = (p.colors || []).reduce((s, c) => s + (c.quantity || 0), 0);
    return acc + cSum;
  }, 0);

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="admin-wrapper">
      {/* ==================== ADMIN TOP NAVBAR ==================== */}
      <div className="admin-navbar">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="logo-monogram" style={{ width: "40px", height: "40px", fontSize: "20px" }}>H</div>
          <div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "#ffffff", lineHeight: 1 }}>HADIDJA SHOP</h3>
            <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--gold-light)" }}>Панель администратора</span>
          </div>
        </div>

        <div className="admin-nav-user">
          <button onClick={onNavigateToStore} className="btn btn-outline" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.2)", fontSize: "11px", padding: "8px 16px" }}>
            <i className="fa-solid fa-eye"></i> На сайт магазина
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 14px", background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-pill)" }}>
            <i className="fa-solid fa-user-shield" style={{ color: "var(--gold-light)" }}></i>
            <span style={{ fontSize: "12px", fontWeight: "600" }}>{currentUser?.fullName || currentUser?.username}</span>
          </div>

          <button onClick={handleLogout} className="action-btn" title="Выйти" style={{ color: "#cf4949" }}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </div>

      {/* ==================== ADMIN TABS BAR ==================== */}
      <div className="admin-tabs-bar">
        <button
          className={`admin-tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <i className="fa-solid fa-gem"></i> Товары ({products.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => { setActiveTab("orders"); loadOrders(); }}
        >
          <i className="fa-solid fa-box-open"></i> Заказы CRM ({orders.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <i className="fa-solid fa-sliders"></i> Настройки магазина
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "backup" ? "active" : ""}`}
          onClick={() => setActiveTab("backup")}
        >
          <i className="fa-solid fa-database"></i> Резервная копия & Сброс
        </button>
      </div>

      {/* ==================== MAIN ADMIN CONTENT ==================== */}
      <div className="admin-content">
        {/* STATS OVERVIEW */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon"><i className="fa-solid fa-layer-group"></i></div>
            <div>
              <div className="admin-stat-val">{products.length}</div>
              <div className="admin-stat-lbl">Всего товаров</div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon"><i className="fa-solid fa-boxes-stacked"></i></div>
            <div>
              <div className="admin-stat-val">{totalStockUnits} шт.</div>
              <div className="admin-stat-lbl">Остаток на складе</div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon"><i className="fa-solid fa-cart-shopping"></i></div>
            <div>
              <div className="admin-stat-val">{orders.length}</div>
              <div className="admin-stat-lbl">Заказов оформлено</div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon"><i className="fa-solid fa-coins"></i></div>
            <div>
              <div className="admin-stat-val">{totalRevenue} с.</div>
              <div className="admin-stat-lbl">Сумма заказов</div>
            </div>
          </div>
        </div>

        {/* TAB 1: PRODUCTS MANAGER */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "12px", flex: 1, maxWidth: "600px" }}>
                <input
                  type="text"
                  placeholder="Поиск товара по названию..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{ flex: 1, background: "#1d1a17", borderColor: "rgba(197,168,128,0.25)", color: "#fff", padding: "10px 16px", borderRadius: "var(--radius-pill)" }}
                />
                <select
                  value={catFilter}
                  onChange={(e) => setCatFilter(e.target.value)}
                  style={{ background: "#1d1a17", borderColor: "rgba(197,168,128,0.25)", color: "#fff", padding: "10px 16px", borderRadius: "var(--radius-pill)" }}
                >
                  <option value="Все">Все категории</option>
                  <option value="Платки">Платки</option>
                  <option value="Шарфы">Шарфы</option>
                  <option value="Хиджабы">Хиджабы</option>
                  <option value="Платья">Платья</option>
                  <option value="Аксессуары">Аксессуары</option>
                </select>
              </div>

              <button className="btn btn-gold" onClick={() => openEditModal(null)}>
                <i className="fa-solid fa-plus"></i> Добавить новый товар
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Фото</th>
                    <th>Название</th>
                    <th>Категория</th>
                    <th>Цена</th>
                    <th>Расцветки & Остатки</th>
                    <th>Бейдж</th>
                    <th style={{ textAlign: "right" }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {adminProducts.map((p) => {
                    const totalQty = (p.colors || []).reduce((s, c) => s + (c.quantity || 0), 0);
                    return (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{ width: "50px", height: "65px", objectFit: "cover", borderRadius: "6px" }}
                            onError={(e) => { e.target.onerror = null; e.target.src = "images/placeholder.jpg"; }}
                          />
                        </td>
                        <td>
                          <strong style={{ display: "block", fontSize: "14px" }}>{p.name}</strong>
                          <small style={{ color: "var(--text-light)" }}>{p.material || "—"}</small>
                        </td>
                        <td>
                          <span style={{ background: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: "9999px", fontSize: "11px" }}>
                            {p.category}
                          </span>
                        </td>
                        <td>
                          <strong>{p.price} с.</strong>
                          {p.oldPrice && <del style={{ color: "var(--text-light)", fontSize: "11px", marginLeft: "6px" }}>{p.oldPrice} с.</del>}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                            {(p.colors || []).map((c, i) => (
                              <span
                                key={i}
                                className="color-dot"
                                style={{ backgroundColor: c.hex || "#333", width: "14px", height: "14px" }}
                                title={`${c.name}: ${c.quantity} шт.`}
                              ></span>
                            ))}
                            <small style={{ marginLeft: "6px", color: totalQty > 0 ? "#6ed191" : "#f08282" }}>
                              {totalQty > 0 ? `Всего ${totalQty} шт.` : "Нет в наличии"}
                            </small>
                          </div>
                        </td>
                        <td>
                          {p.badge && (
                            <span className="card-badge" style={{ position: "static", display: "inline-block" }}>
                              {p.badge}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            onClick={() => openEditModal(p)}
                            className="action-btn"
                            title="Редактировать"
                            style={{ color: "var(--gold-light)" }}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            onClick={() => handleDuplicateProduct(p)}
                            className="action-btn"
                            title="Дублировать"
                            style={{ color: "#72aeff" }}
                          >
                            <i className="fa-solid fa-clone"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="action-btn"
                            title="Удалить"
                            style={{ color: "#cf4949" }}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS CRM */}
        {activeTab === "orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px" }}>Заказы покупательниц с сайта</h3>
              <button onClick={loadOrders} className="btn btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}>
                <i className="fa-solid fa-rotate-right"></i> Обновить список
              </button>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#1d1a17", borderRadius: "var(--radius-lg)" }}>
                <i className="fa-solid fa-clipboard-list" style={{ fontSize: "40px", color: "var(--gold-light)", marginBottom: "12px", display: "block" }}></i>
                <h4>Заказов пока нет</h4>
                <p style={{ color: "var(--text-light)", fontSize: "13px" }}>Когда клиент оформит заказ на сайте, он мгновенно появится здесь.</p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>№ Заказа</th>
                      <th>Дата</th>
                      <th>Клиент</th>
                      <th>Телефон & WhatsApp</th>
                      <th>Адрес доставки</th>
                      <th>Товары</th>
                      <th>Сумма</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td>
                        <td><small style={{ color: "var(--text-light)" }}>{o.date}</small></td>
                        <td><strong>{o.customerName}</strong></td>
                        <td>
                          <a
                            href={`https://wa.me/${o.customerPhone?.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#25d366", display: "inline-flex", alignItems: "center", gap: "6px" }}
                          >
                            <i className="fa-brands fa-whatsapp"></i> {o.customerPhone}
                          </a>
                        </td>
                        <td><small>{o.customerAddress}</small></td>
                        <td>
                          <div style={{ fontSize: "12px", maxWidth: "240px" }}>
                            {o.items?.map((it, i) => (
                              <div key={i}>• {it.name} ({it.color}) × {it.qty}</div>
                            ))}
                          </div>
                        </td>
                        <td><strong style={{ color: "var(--gold-light)", fontSize: "15px" }}>{o.total} с.</strong></td>
                        <td>
                          <select
                            value={o.status || "Новый"}
                            onChange={(e) => handleOrderStatus(o.id, e.target.value)}
                            style={{ background: "#151311", color: "#fff", borderColor: "rgba(197,168,128,0.3)", padding: "6px 10px", borderRadius: "6px", fontSize: "12px" }}
                          >
                            <option value="Новый">Новый</option>
                            <option value="В доставке">В доставке</option>
                            <option value="Выполнен">Выполнен</option>
                            <option value="Отменен">Отменен</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STORE SETTINGS */}
        {activeTab === "settings" && (
          <div style={{ maxWidth: "700px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", marginBottom: "20px" }}>Настройки магазина HADIDJA</h3>
            <form onSubmit={handleSaveSettings} style={{ background: "#1d1a17", border: "1px solid rgba(197,168,128,0.2)", borderRadius: "var(--radius-lg)", padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="auth-field">
                <label>Номер WhatsApp (для получения заказов)</label>
                <input
                  type="text"
                  value={settingsForm.whatsapp || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                  placeholder="992886006528"
                />
                <small style={{ color: "var(--text-light)" }}>Вводите в международном формате без плюса, например: 992886006528</small>
              </div>

              <div className="auth-field">
                <label>Instagram аккаунт (логин)</label>
                <input
                  type="text"
                  value={settingsForm.instagram || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                  placeholder="@hadidja_shop_tj"
                />
              </div>

              <div className="auth-field">
                <label>Ссылка на Instagram профиль</label>
                <input
                  type="text"
                  value={settingsForm.instagramUrl || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                  placeholder="https://www.instagram.com/hadidja_shop_tj/"
                />
              </div>

              <div className="auth-field">
                <label>Верхняя полоса объявлений (текст акции)</label>
                <input
                  type="text"
                  value={settingsForm.announcement || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                />
              </div>

              <div className="auth-field">
                <label>Порог суммы для бесплатной доставки (сомони)</label>
                <input
                  type="number"
                  value={settingsForm.freeShippingThreshold || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                />
              </div>

              <div className="auth-field">
                <label>Адрес бутика в Душанбе</label>
                <input
                  type="text"
                  value={settingsForm.address || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-gold" style={{ padding: "14px" }}>
                <i className="fa-solid fa-check"></i> Сохранить настройки
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: BACKUP & RESTORE */}
        {activeTab === "backup" && (
          <div style={{ maxWidth: "700px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", marginBottom: "20px" }}>Резервное копирование и сброс</h3>
            <div style={{ background: "#1d1a17", border: "1px solid rgba(197,168,128,0.2)", borderRadius: "var(--radius-lg)", padding: "30px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h4 style={{ fontSize: "16px", marginBottom: "6px" }}>📥 Экспорт базы данных</h4>
                <p style={{ fontSize: "13px", color: "var(--text-light)", marginBottom: "14px" }}>
                  Скачайте резервную копию всех ваших товаров, настроек и заказов в один файл JSON на свой компьютер.
                </p>
                <button onClick={handleExportData} className="btn btn-outline" style={{ color: "#fff", borderColor: "rgba(197,168,128,0.4)" }}>
                  <i className="fa-solid fa-download"></i> Скачать копию базы (.json)
                </button>
              </div>

              <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />

              <div>
                <h4 style={{ fontSize: "16px", marginBottom: "6px", color: "#f08282" }}>🔄 Сброс к стандартным товарам</h4>
                <p style={{ fontSize: "13px", color: "var(--text-light)", marginBottom: "14px" }}>
                  Восстанавливает 13 оригинальных роскошных товаров HADIDJA SHOP (платки, палантины, хиджабы, абайи).
                </p>
                <button onClick={handleResetCatalog} className="btn btn-luxury" style={{ borderColor: "#cf4949", color: "#f08282" }}>
                  <i className="fa-solid fa-rotate-left"></i> Сбросить каталог к стандартному
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== PRODUCT ADD / EDIT MODAL ==================== */}
      {editingProduct && (
        <div className="modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div
            className="modal-window"
            style={{ maxWidth: "800px", background: "#1a1715", color: "#fff", borderColor: "rgba(197,168,128,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" style={{ background: "#26221f", color: "#fff" }} onClick={() => setEditingProduct(null)}>
              ×
            </button>
            <div style={{ padding: "36px" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "#ffffff", marginBottom: "6px" }}>
                {editingProduct.id ? "Редактирование товара" : "Добавление нового товара"}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-light)", marginBottom: "24px" }}>
                Заполните данные о товаре. Вы можете легко вставить фото с помощью <span className="paste-key-badge">Ctrl+V</span> прямо из буфера!
              </p>

              <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="auth-field">
                    <label>Название товара *</label>
                    <input
                      type="text"
                      required
                      placeholder="Например: Шёлковый платок «Royal Silk»"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>

                  <div className="auth-field">
                    <label>Категория</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      style={{ padding: "13px 16px", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(197,168,128,0.25)", color: "#fff" }}
                    >
                      <option value="Платки">Платки</option>
                      <option value="Шарфы">Шарфы & Палантины</option>
                      <option value="Хиджабы">Хиджабы</option>
                      <option value="Платья">Платья & Абайи</option>
                      <option value="Аксессуары">Аксессуары / Подарки</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  <div className="auth-field">
                    <label>Цена (сомони) *</label>
                    <input
                      type="number"
                      required
                      placeholder="120"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                    />
                  </div>

                  <div className="auth-field">
                    <label>Старая цена (для скидки)</label>
                    <input
                      type="number"
                      placeholder="150"
                      value={formOldPrice}
                      onChange={(e) => setFormOldPrice(e.target.value)}
                    />
                  </div>

                  <div className="auth-field">
                    <label>Бейдж на фото</label>
                    <select
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      style={{ padding: "13px 16px", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(197,168,128,0.25)", color: "#fff" }}
                    >
                      <option value="">Без бейджа</option>
                      <option value="ХИТ">ХИТ</option>
                      <option value="NEW">NEW</option>
                      <option value="СКИДКА">СКИДКА</option>
                      <option value="PREMIUM">PREMIUM</option>
                      <option value="LUXURY">LUXURY</option>
                      <option value="ЭКСКЛЮЗИВ">ЭКСКЛЮЗИВ</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="auth-field">
                    <label>Ткань / Материал</label>
                    <input
                      type="text"
                      placeholder="Натуральный шёлк гирбишин"
                      value={formMaterial}
                      onChange={(e) => setFormMaterial(e.target.value)}
                    />
                  </div>

                  <div className="auth-field">
                    <label>Размер</label>
                    <input
                      type="text"
                      placeholder="120 × 120 см или S / M / L / XL"
                      value={formSize}
                      onChange={(e) => setFormSize(e.target.value)}
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label>Описание товара</label>
                  <textarea
                    rows={3}
                    placeholder="Подробности о ткани, посадке, драпировке..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    style={{ padding: "12px 16px", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(197,168,128,0.25)", color: "#fff" }}
                  ></textarea>
                </div>

                {/* ==================== INNOVATIVE IMAGE PASTE ZONE ==================== */}
                <div className="auth-field">
                  <label>Фотография товара (Вставка из буфера, файл или URL)</label>
                  <div
                    className={`image-paste-dropzone ${isDragActive ? "drag-active" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragActive(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleImageFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => document.getElementById("productFileInput").click()}
                  >
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <h4>Скопируйте фото и нажмите <span className="paste-key-badge">Ctrl + V</span></h4>
                    <p>Либо нажмите сюда для выбора файла с устройства, или перетащите файл</p>

                    <input
                      id="productFileInput"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageFile(e.target.files[0]);
                        }
                      }}
                    />

                    {formImage && (
                      <div className="preview-thumb-box" onClick={(e) => e.stopPropagation()}>
                        <img src={formImage} alt="Превью" />
                        <div
                          className="preview-remove-btn"
                          title="Удалить фото"
                          onClick={() => setFormImage("")}
                        >
                          ×
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ==================== COLOR SWATCHES & STOCK ==================== */}
                <div className="auth-field">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ margin: 0 }}>Расцветки и остатки на складе</label>
                    <button
                      type="button"
                      onClick={addColorOption}
                      style={{ color: "var(--gold-light)", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}
                    >
                      + Добавить расцветку
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {formColors.map((col, idx) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "1.2fr 80px 100px 36px", gap: "10px", alignItems: "center" }}>
                        <input
                          type="text"
                          placeholder="Цвет (напр. Чёрный)"
                          value={col.name}
                          onChange={(e) => updateColorOption(idx, "name", e.target.value)}
                        />
                        <input
                          type="color"
                          value={col.hex || "#c5a880"}
                          onChange={(e) => updateColorOption(idx, "hex", e.target.value)}
                          style={{ height: "42px", padding: "2px", cursor: "pointer" }}
                        />
                        <input
                          type="number"
                          placeholder="Шт."
                          value={col.quantity}
                          onChange={(e) => updateColorOption(idx, "quantity", e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeColorOption(idx)}
                          style={{ color: "#cf4949", fontSize: "16px" }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "14px", marginTop: "12px" }}>
                  <button type="submit" className="btn btn-gold" style={{ flex: 1, padding: "14px" }}>
                    <i className="fa-solid fa-floppy-disk"></i> Сохранить товар
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="btn btn-outline"
                    style={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
