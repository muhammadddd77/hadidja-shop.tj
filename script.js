const products = [
  // ТОВАР №1 — ФОТО: images/product-01.jpg
  {
    id: 1,
    name: "Платок Premium",
    category: "Платки",
    price: 99,
    oldPrice: 120,
    discount: 18,
    size: "120 × 120 см",
    material: "Гирбишин",
    stock: 5,
    badge: "ХИТ",
    image: "images/product-01.jpg",
    colors: ["#111", "#d8c7ae", "#8b6b52"],
  },
  // ТОВАР №2 — ФОТО: images/product-02.jpg
  {
    id: 2,
    name: "Платок Classic",
    category: "Платки",
    price: 89,
    oldPrice: 110,
    discount: 19,
    size: "110 × 110 см",
    material: "Dubai Chiffon",
    stock: 7,
    badge: "СКИДКА",
    image: "images/product-02.jpg",
    colors: ["#e8dfd1", "#746354", "#222"],
  },
  // ТОВАР №3 — ФОТО: images/product-03.jpg
  {
    id: 3,
    name: "Платок Elegant",
    category: "Платки",
    price: 120,
    oldPrice: null,
    discount: 0,
    size: "120 × 120 см",
    material: "Premium",
    stock: 3,
    badge: "НОВИНКА",
    image: "images/product-03.jpg",
    colors: ["#c5b09a", "#9d7b64", "#f2eee8"],
  },
  // ТОВАР №4 — ФОТО: images/product-04.jpg
  {
    id: 4,
    name: "Dubai Collection",
    category: "Шарфы",
    price: 110,
    oldPrice: 135,
    discount: 19,
    size: "180 × 70 см",
    material: "Dubai Chiffon",
    stock: 4,
    badge: "СКИДКА",
    image: "images/product-04.jpg",
    colors: ["#c6a58e", "#5c514b", "#e7d9ca"],
  },
  // ТОВАР №5 — ФОТО: images/product-05.jpg
  {
    id: 5,
    name: "Soft Shawl",
    category: "Шарфы",
    price: 95,
    oldPrice: null,
    discount: 0,
    size: "180 × 70 см",
    material: "Soft Fabric",
    stock: 8,
    badge: "",
    image: "images/product-05.jpg",
    colors: ["#ded0c1", "#76685c"],
  },
  // ТОВАР №6 — ФОТО: images/product-06.jpg
  {
    id: 6,
    name: "Hijab Premium",
    category: "Хиджабы",
    price: 85,
    oldPrice: 100,
    discount: 15,
    size: "180 × 75 см",
    material: "Premium Chiffon",
    stock: 6,
    badge: "СКИДКА",
    image: "images/product-06.jpg",
    colors: ["#111", "#e5d6c4", "#b99a7b"],
  },
  // ТОВАР №7 — ФОТО: images/product-07.jpg
  {
    id: 7,
    name: "Hijab Classic",
    category: "Хиджабы",
    price: 75,
    oldPrice: null,
    discount: 0,
    size: "180 × 75 см",
    material: "Chiffon",
    stock: 9,
    badge: "",
    image: "images/product-07.jpg",
    colors: ["#fff", "#cbb8a7", "#4b413b"],
  },
  // ТОВАР №8 — ФОТО: images/product-08.jpg
  {
    id: 8,
    name: "New Color",
    category: "Новинки",
    price: 105,
    oldPrice: null,
    discount: 0,
    size: "120 × 120 см",
    material: "Premium",
    stock: 5,
    badge: "НОВИНКА",
    image: "images/product-08.jpg",
    colors: ["#d8b8b0", "#87938b", "#333"],
  },
  // ТОВАР №9 — ФОТО: images/product-09.jpg
  {
    id: 9,
    name: "Silk Touch",
    category: "Платки",
    price: 130,
    oldPrice: 155,
    discount: 16,
    size: "120 × 120 см",
    material: "Silk Touch",
    stock: 2,
    badge: "СКИДКА",
    image: "images/product-09.jpg",
    colors: ["#c5a991", "#8e6f61", "#222"],
  },
  // ТОВАР №10 — ФОТО: images/product-10.jpg
  {
    id: 10,
    name: "Daily Scarf",
    category: "Шарфы",
    price: 70,
    oldPrice: null,
    discount: 0,
    size: "170 × 65 см",
    material: "Soft Fabric",
    stock: 10,
    badge: "",
    image: "images/product-10.jpg",
    colors: ["#eee5da", "#a99583", "#34302d"],
  },
  // ТОВАР №11 — ФОТО: images/product-11.jpg
  {
    id: 11,
    name: "Elegant Hijab",
    category: "Хиджабы",
    price: 115,
    oldPrice: 135,
    discount: 15,
    size: "180 × 75 см",
    material: "Premium Chiffon",
    stock: 3,
    badge: "ХИТ",
    image: "images/product-11.jpg",
    colors: ["#d8c4ae", "#6d625b", "#222"],
  },
  // ТОВАР №12 — ФОТО: images/product-12.jpg
  {
    id: 12,
    name: "Signature",
    category: "Новинки",
    price: 140,
    oldPrice: null,
    discount: 0,
    size: "120 × 120 см",
    material: "Premium",
    stock: 4,
    badge: "НОВИНКА",
    image: "images/product-12.jpg",
    colors: ["#d0b19e", "#b9b2a7", "#333"],
  },
  // ТОВАР №13 — ФОТО: images/product-13.jpg
  {
    id: 13,
    name: "Limited Collection",
    category: "Новинки",
    price: 150,
    oldPrice: 175,
    discount: 14,
    size: "120 × 120 см",
    material: "Premium",
    stock: 2,
    badge: "LIMITED",
    image: "images/product-13.jpg",
    colors: ["#bca58e", "#e8ddd0", "#222"],
  },
];

let activeFilter = "Все";
let searchText = "";
let favorites = JSON.parse(localStorage.getItem("hadidjaFavorites") || "[]");
let cart = JSON.parse(localStorage.getItem("hadidjaCart") || "[]");

const productsBox = document.getElementById("products");
const emptyProducts = document.getElementById("emptyProducts");
const overlay = document.getElementById("overlay");

function money(n) {
  return `${n} сомони`;
}
function save() {
  localStorage.setItem("hadidjaFavorites", JSON.stringify(favorites));
  localStorage.setItem("hadidjaCart", JSON.stringify(cart));
}
function pct(p) {
  return p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
}

function renderProducts() {
  let list = products.filter((p) => {
    const cat =
      activeFilter === "Все" ||
      (activeFilter === "Скидки"
        ? p.discount > 0
        : p.category === activeFilter);
    const text =
      `${p.name} ${p.category} ${p.material} ${p.size}`.toLowerCase();
    return cat && text.includes(searchText.toLowerCase());
  });

  const sort = document.getElementById("sortSelect").value;
  if (sort === "cheap") list.sort((a, b) => a.price - b.price);
  if (sort === "expensive") list.sort((a, b) => b.price - a.price);
  if (sort === "discount") list.sort((a, b) => b.discount - a.discount);

  productsBox.innerHTML = list.map(card).join("");
  emptyProducts.style.display = list.length ? "none" : "block";
  updateCounts();
}

function card(p) {
  const fav = favorites.includes(p.id);
  return `<article class="product-card">
    <div class="product-image">
      <!-- ФОТО ТОВАРА №${p.id}: заменить на images/product-${String(p.id).padStart(2, "0")}.jpg -->
      <img src="${p.image}" alt="${p.name}" onerror="this.src='images/placeholder.jpg'">
      ${p.badge ? `<span class="badge ${p.discount ? "sale" : ""}">${p.badge}</span>` : ""}
      <button class="favorite ${fav ? "active" : ""}" onclick="toggleFavorite(${p.id})">
        <i class="${fav ? "fa-solid" : "fa-regular"} fa-heart"></i>
      </button>
    </div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <p>${p.size} · ${p.material}</p>
      <div class="price-line">
        <strong>${money(p.price)}</strong>
        ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span><span class="discount">-${pct(p)}%</span>` : ""}
      </div>
      <div class="product-actions">
        <button onclick="openProduct(${p.id})">Подробнее</button>
        <button class="add" onclick="addToCart(${p.id})"><i class="fa-solid fa-plus"></i> В корзину</button>
      </div>
    </div>
  </article>`;
}

function updateCounts() {
  document.getElementById("favoriteCount").textContent = favorites.length;
  document.getElementById("cartCount").textContent = cart.reduce(
    (s, x) => s + x.qty,
    0,
  );
}

function toggleFavorite(id) {
  favorites = favorites.includes(id)
    ? favorites.filter((x) => x !== id)
    : [...favorites, id];
  save();
  renderProducts();
  renderFavorites();
}

function addToCart(id) {
  const item = cart.find((x) => x.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  save();
  renderCart();
  updateCounts();
  openPanel("cartPanel");
}

function removeFromCart(id) {
  cart = cart.filter((x) => x.id !== id);
  save();
  renderCart();
  updateCounts();
}

function renderCart() {
  const box = document.getElementById("cartItems");

  if (!cart.length) {
    box.innerHTML = '<p class="muted">Корзина пока пустая.</p>';
    document.getElementById("cartTotal").textContent = "0 сомони";
    return;
  }

  let total = 0;

  box.innerHTML = cart
    .map((i) => {
      const p = products.find((x) => x.id === i.id);
      total += p.price * i.qty;

      return `<div class="cart-item">
      <img src="${p.image}" onerror="this.src='images/placeholder.jpg'" alt="${p.name}">
      <div>
        <h4>${p.name}</h4>
        <small>${i.qty} × ${money(p.price)}</small>
      </div>
      <button class="remove-item" onclick="removeFromCart(${p.id})"><i class="fa-solid fa-trash"></i></button>
    </div>`;
    })
    .join("");

  document.getElementById("cartTotal").textContent = money(total);

  document.getElementById("whatsappOrder").href =
    "https://wa.me/992886006528?text=" +
    encodeURIComponent(
      "Здравствуйте! Хочу заказать:\n" +
        cart
          .map((i) => {
            const p = products.find((x) => x.id === i.id);
            return `${p.name} — ${i.qty} шт.`;
          })
          .join("\n") +
        `\nИтого: ${money(total)}`,
    );
}

function renderFavorites() {
  const box = document.getElementById("favoriteItems");

  if (!favorites.length) {
    box.innerHTML = '<p class="muted">Избранных товаров пока нет.</p>';
    return;
  }

  box.innerHTML = favorites
    .map((id) => {
      const p = products.find((x) => x.id === id);

      return `<div class="fav-item">
      <img src="${p.image}" onerror="this.src='images/placeholder.jpg'" alt="${p.name}">
      <div>
        <h4>${p.name}</h4>
        <small>${money(p.price)}</small>
      </div>
      <button class="remove-item" onclick="toggleFavorite(${p.id})">×</button>
    </div>`;
    })
    .join("");
}

function openPanel(id) {
  document.getElementById(id).classList.add("open");
  overlay.classList.add("show");
  document.body.classList.add("lock");
}

function closePanels() {
  document
    .querySelectorAll(".side-panel")
    .forEach((x) => x.classList.remove("open"));
  overlay.classList.remove("show");
  document.body.classList.remove("lock");
}

function openProduct(id) {
  const p = products.find((x) => x.id === id);
  const colors = p.colors
    .map((c) => `<span class="color-dot" style="background:${c}"></span>`)
    .join("");

  document.getElementById("productDetails").innerHTML = `
    <div class="product-detail">
      <!-- ФОТО ТОВАРА НА СТРАНИЦЕ ТОВАРА -->
      <img src="${p.image}" onerror="this.src='images/placeholder.jpg'" alt="${p.name}">

      <div>
        <p class="eyebrow">${p.category}</p>
        <h2>${p.name}</h2>
        <div class="stars">★★★★★</div>

        <div class="detail-price">
          ${money(p.price)}
          ${p.oldPrice ? `<del style="font-size:12px;color:#999">${money(p.oldPrice)}</del>` : ""}
        </div>

        <div class="detail-row"><b>Размер:</b> ${p.size}</div>
        <div class="detail-row"><b>Материал:</b> ${p.material}</div>
        <div class="detail-row"><b>Наличие:</b> <span style="color:#2b8a4b">В наличии (${p.stock} шт.)</span></div>
        <div class="detail-row"><b>Расцветки:</b><br>${colors}</div>

        <button class="btn dark" onclick="addToCart(${p.id});closeProduct()">Добавить в корзину</button>

        <!-- WHATSAPP ЗАКАЗ ТОВАРА -->
        <a class="btn light full" style="margin-top:8px"
          target="_blank"
          href="https://wa.me/992886006528?text=${encodeURIComponent("Здравствуйте! Меня интересует товар: " + p.name + " — " + money(p.price))}">
          <i class="fa-brands fa-whatsapp"></i> Заказать в WhatsApp
        </a>
      </div>
    </div>`;

  document.getElementById("productModal").classList.add("open");
  document.body.classList.add("lock");
}

function closeProduct() {
  document.getElementById("productModal").classList.remove("open");
  document.body.classList.remove("lock");
}

/* MENU */
document.getElementById("menuBtn").addEventListener("click", () => {
  document.body.classList.toggle("nav-menu-open");
});

document.querySelectorAll("nav a").forEach((a) => {
  a.addEventListener("click", () =>
    document.body.classList.remove("nav-menu-open"),
  );
});

/* FILTERS */
document.querySelectorAll(".filter").forEach((b) => {
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".filter")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    activeFilter = b.dataset.filter;
    renderProducts();
  });
});

/* CATEGORY CARDS */
document.querySelectorAll(".category-card").forEach((b) => {
  b.addEventListener("click", () => {
    activeFilter = b.dataset.category;
    document.querySelectorAll(".filter").forEach((x) => {
      x.classList.toggle("active", x.dataset.filter === activeFilter);
    });
    renderProducts();
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
  });
});

/* SEARCH */
document.getElementById("productSearch").addEventListener("input", (e) => {
  searchText = e.target.value;
  renderProducts();
});

document
  .getElementById("sortSelect")
  .addEventListener("change", renderProducts);

/* CART */
document.getElementById("cartOpen").addEventListener("click", () => {
  renderCart();
  openPanel("cartPanel");
});

/* FAVORITES */
document.getElementById("favoritesOpen").addEventListener("click", () => {
  renderFavorites();
  openPanel("favoritePanel");
});

document.querySelectorAll(".close-panel").forEach((b) => {
  b.addEventListener("click", () => {
    if (b.dataset.close) closePanels();
  });
});

overlay.addEventListener("click", closePanels);

/* SEARCH MODAL */
document.getElementById("searchOpen").addEventListener("click", () => {
  document.getElementById("searchModal").classList.add("open");
  document.body.classList.add("lock");
  document.getElementById("modalSearch").focus();
});

document.getElementById("searchClose").addEventListener("click", () => {
  document.getElementById("searchModal").classList.remove("open");
  document.body.classList.remove("lock");
});

document.getElementById("modalSearch").addEventListener("input", (e) => {
  document.getElementById("productSearch").value = e.target.value;
  searchText = e.target.value;
  renderProducts();
});

/* PRODUCT MODAL */
document.getElementById("productClose").addEventListener("click", closeProduct);

document.getElementById("productModal").addEventListener("click", (e) => {
  if (e.target.id === "productModal") closeProduct();
});

renderProducts();
renderCart();
renderFavorites();
