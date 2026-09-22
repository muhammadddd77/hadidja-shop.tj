const WHATSAPP = "992886006528";

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
    quantity: 5,
    badge: "ХИТ",
    image: "images/product-01.jpg",
    colors: [
      { name: "Чёрный", quantity: 2, image: "images/product-01-black.jpg" },
      { name: "Бежевый", quantity: 2, image: "images/product-01-beige.jpg" },
      { name: "Розовый", quantity: 1, image: "images/product-01-pink.jpg" },
    ],
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
    quantity: 7,
    badge: "СКИДКА",
    image: "images/product-02.jpg",
    colors: [
      { name: "Молочный", quantity: 3, image: "images/product-02-milk.jpg" },
      { name: "Коричневый", quantity: 2, image: "images/product-02-brown.jpg" },
      { name: "Чёрный", quantity: 2, image: "images/product-02-black.jpg" },
    ],
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
    quantity: 3,
    badge: "НОВИНКА",
    image: "images/product-03.jpg",
    colors: [
      { name: "Кремовый", quantity: 1, image: "images/product-03-cream.jpg" },
      { name: "Синий", quantity: 2, image: "images/product-03-blue.jpg" },
    ],
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
    quantity: 4,
    badge: "СКИДКА",
    image: "images/product-04.jpg",
    colors: [
      { name: "Бежевый", quantity: 2, image: "images/product-04-beige.jpg" },
      { name: "Коричневый", quantity: 1, image: "images/product-04-brown.jpg" },
      { name: "Чёрный", quantity: 1, image: "images/product-04-black.jpg" },
    ],
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
    quantity: 8,
    badge: "",
    image: "images/product-05.jpg",
    colors: [
      { name: "Кремовый", quantity: 4, image: "images/product-05-cream.jpg" },
      { name: "Серый", quantity: 2, image: "images/product-05-grey.jpg" },
      { name: "Коричневый", quantity: 2, image: "images/product-05-brown.jpg" },
    ],
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
    quantity: 6,
    badge: "СКИДКА",
    image: "images/product-06.jpg",
    colors: [
      { name: "Чёрный", quantity: 2, image: "images/product-06-black.jpg" },
      { name: "Бежевый", quantity: 2, image: "images/product-06-beige.jpg" },
      { name: "Пудровый", quantity: 2, image: "images/product-06-powder.jpg" },
    ],
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
    quantity: 9,
    badge: "",
    image: "images/product-07.jpg",
    colors: [
      { name: "Белый", quantity: 3, image: "images/product-07-white.jpg" },
      { name: "Бежевый", quantity: 3, image: "images/product-07-beige.jpg" },
      { name: "Коричневый", quantity: 3, image: "images/product-07-brown.jpg" },
    ],
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
    quantity: 5,
    badge: "НОВИНКА",
    image: "images/product-08.jpg",
    colors: [
      { name: "Пудровый", quantity: 2, image: "images/product-08-powder.jpg" },
      { name: "Зелёный", quantity: 1, image: "images/product-08-green.jpg" },
      { name: "Чёрный", quantity: 2, image: "images/product-08-black.jpg" },
    ],
  },
  // ТОВАР №9 — ФОТО ПЛАТЬЯ: images/dress-01.jpg
  {
    id: 9,
    name: "Платье Grace",
    category: "Платья",
    price: 240,
    oldPrice: 290,
    discount: 17,
    size: "S / M / L / XL",
    sizes: ["S", "M", "L", "XL"],
    material: "Креп",
    quantity: 4,
    badge: "СКИДКА",
    image: "images/dress-01.jpg",
    colors: [
      { name: "Чёрный", quantity: 2, image: "images/dress-01-black.jpg" },
      { name: "Бежевый", quantity: 2, image: "images/dress-01-beige.jpg" },
    ],
  },
  // ТОВАР №10 — ФОТО ПЛАТЬЯ: images/dress-02.jpg
  {
    id: 10,
    name: "Платье Modest",
    category: "Платья",
    price: 260,
    oldPrice: null,
    discount: 0,
    size: "S / M / L",
    sizes: ["S", "M", "L"],
    material: "Креп-сатин",
    quantity: 3,
    badge: "",
    image: "images/dress-02.jpg",
    colors: [
      { name: "Молочный", quantity: 1, image: "images/dress-02-milk.jpg" },
      { name: "Коричневый", quantity: 2, image: "images/dress-02-brown.jpg" },
    ],
  },
  // ТОВАР №11 — ФОТО ПЛАТЬЯ: images/dress-03.jpg
  {
    id: 11,
    name: "Платье Dubai",
    category: "Платья",
    price: 300,
    oldPrice: 350,
    discount: 14,
    size: "M / L / XL",
    sizes: ["M", "L", "XL"],
    material: "Dubai",
    quantity: 2,
    badge: "СКИДКА",
    image: "images/dress-03.jpg",
    colors: [
      { name: "Бордовый", quantity: 1, image: "images/dress-03-burgundy.jpg" },
      { name: "Чёрный", quantity: 1, image: "images/dress-03-black.jpg" },
    ],
  },
  // ТОВАР №12 — ФОТО ПЛАТЬЯ: images/dress-04.jpg
  {
    id: 12,
    name: "Платье Elegant",
    category: "Платья",
    price: 280,
    oldPrice: null,
    discount: 0,
    size: "S / M / L / XL",
    sizes: ["S", "M", "L", "XL"],
    material: "Трикотаж",
    quantity: 5,
    badge: "",
    image: "images/dress-04.jpg",
    colors: [
      { name: "Изумрудный", quantity: 2, image: "images/dress-04-green.jpg" },
      { name: "Чёрный", quantity: 3, image: "images/dress-04-black.jpg" },
    ],
  },
  // ТОВАР №13 — ФОТО: images/product-13.jpg — quantity: 0 => товар полностью исчезает с сайта
  {
    id: 13,
    name: "Limited Collection",
    category: "Новинки",
    price: 150,
    oldPrice: 175,
    discount: 14,
    size: "120 × 120 см",
    material: "Premium",
    quantity: 0,
    badge: "ЗАКОНЧИЛСЯ",
    image: "images/product-13.jpg",
    colors: [
      { name: "Золотой", quantity: 0, image: "images/product-13-gold.jpg" },
      { name: "Чёрный", quantity: 0, image: "images/product-13-black.jpg" },
    ],
  },
];

let activeFilter = "Все";
let searchText = "";
let favorites = JSON.parse(localStorage.getItem("hadidjaFavorites") || "[]");
let cart = JSON.parse(localStorage.getItem("hadidjaCart") || "[]");
let selected = { id: null, color: 0, size: "", qty: 1 };

const productsBox = document.getElementById("products");
const emptyProducts = document.getElementById("emptyProducts");
const overlay = document.getElementById("overlay");
const dressGrid = document.querySelector(".dress-grid");

function money(n) {
  return `${n} сомони`;
}
function pct(p) {
  return p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
}
function save() {
  localStorage.setItem("hadidjaFavorites", JSON.stringify(favorites));
  localStorage.setItem("hadidjaCart", JSON.stringify(cart));
}
function available(p) {
  return p.quantity > 0;
}

function colorButtons(p) {
  return `<div class="detail-color-box"><b>Расцветки:</b><div class="color-options">${p.colors.map((c, i) => `<button class="color-choice ${c.quantity <= 0 ? "disabled" : ""}" ${c.quantity <= 0 ? "disabled" : ""} onclick="chooseColor(${p.id},${i})">${c.name}<span>${c.quantity > 0 ? c.quantity + " шт." : "Нет"}</span></button>`).join("")}</div></div>`;
}

function card(p) {
  if (!available(p)) return "";
  const fav = favorites.includes(p.id);
  return `<article class="product-card">
    <div class="product-image">
      <!-- ФОТО ТОВАРА №${p.id}: ${p.image} -->
      <img src="${p.image}" alt="${p.name}" onerror="this.src='images/placeholder.jpg'">
      ${p.badge ? `<span class="badge ${p.discount ? "sale" : ""}">${p.badge}</span>` : ""}
      <button class="favorite ${fav ? "active" : ""}" onclick="toggleFavorite(${p.id})"><i class="${fav ? "fa-solid" : "fa-regular"} fa-heart"></i></button>
    </div>
    <div class="product-info">
      <h3>${p.name}</h3><p>${p.size} · ${p.material}</p>
      <div class="price-line"><strong>${money(p.price)}</strong>${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span><span class="discount">-${pct(p)}%</span>` : ""}</div>
      <div class="quick-colors">${p.colors
        .slice(0, 4)
        .map(
          (c) =>
            `<span class="quick-color ${c.quantity <= 0 ? "off" : ""}" title="${c.name}">${c.quantity > 0 ? "" : "×"}</span>`,
        )
        .join("")}</div>
      <div class="product-actions"><button onclick="openProduct(${p.id})">Подробнее</button><button class="add" onclick="openProduct(${p.id})"><i class="fa-solid fa-plus"></i> Выбрать</button></div>
    </div>
  </article>`;
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
    return available(p) && cat && text.includes(searchText.toLowerCase());
  });
  const sort = document.getElementById("sortSelect").value;
  if (sort === "cheap") list.sort((a, b) => a.price - b.price);
  if (sort === "expensive") list.sort((a, b) => b.price - a.price);
  if (sort === "discount") list.sort((a, b) => b.discount - a.discount);
  productsBox.innerHTML = list.map(card).join("");
  emptyProducts.style.display = list.length ? "none" : "block";
  renderDresses();
  updateCounts();
}

function renderDresses() {
  if (!dressGrid) return;
  const dresses = products.filter(
    (p) => p.category === "Платья" && p.quantity > 0,
  );
  dressGrid.innerHTML = dresses
    .map(
      (p) => `<article class="dress-card enhanced-dress">
    <!-- ФОТО ПЛАТЬЯ №${p.id - 8}: ${p.image} -->
    <div class="dress-photo"><img src="${p.image}" alt="${p.name}" onerror="this.src='images/placeholder.jpg'"><span class="dress-stock">${p.quantity} шт.</span></div>
    <div class="dress-info"><p class="dress-label">${p.name}</p><h3>${money(p.price)} ${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ""}</h3><p>${p.material} · размеры ${p.size}</p>${colorButtons(p)}<button class="btn dark" onclick="openProduct(${p.id})">Выбрать цвет и размер</button></div>
  </article>`,
    )
    .join("");
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

function openProduct(id) {
  const p = products.find((x) => x.id === id);
  if (!p || !available(p)) return;
  const first = Math.max(
    0,
    p.colors.findIndex((c) => c.quantity > 0),
  );
  selected = { id, color: first, size: p.sizes?.[0] || "", qty: 1 };
  document.getElementById("productDetails").innerHTML =
    `<div class="product-detail enhanced-detail">
    <div class="detail-photo-wrap"><!-- ФОТО ТОВАРА/ПЛАТЬЯ В КАРТОЧКЕ: ${p.image} --><img id="detailMainImage" src="${p.colors[first].image}" onerror="this.src='${p.image}'" alt="${p.name}"></div>
    <div><p class="eyebrow">${p.category}</p><h2>${p.name}</h2><div class="detail-price">${money(p.price)} ${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ""}</div><div class="detail-row"><b>Материал:</b> ${p.material}</div>
    ${p.sizes ? `<div class="detail-row"><b>Размер:</b><div class="size-options">${p.sizes.map((s, i) => `<button class="size-choice ${i === 0 ? "selected" : ""}" onclick="chooseSize('${s}',this)">${s}</button>`).join("")}</div></div>` : `<div class="detail-row"><b>Размер:</b> ${p.size}</div>`}
    ${colorButtons(p)}<div id="selectedStock" class="selected-stock"></div>
    <div class="qty-box"><button onclick="changeQty(-1)">−</button><span id="detailQty">1</span><button onclick="changeQty(1)">+</button></div>
    <button class="btn dark" onclick="addSelectedToCart()">Добавить в корзину</button>
    <a id="detailWhatsApp" class="btn light full" target="_blank"><i class="fa-brands fa-whatsapp"></i> Заказать в WhatsApp</a></div></div>`;
  updateSelected();
  document.getElementById("productModal").classList.add("open");
  document.body.classList.add("lock");
}
function chooseColor(id, index) {
  if (id !== selected.id) return;
  const p = products.find((x) => x.id === id),
    c = p.colors[index];
  if (c.quantity <= 0) return;
  selected.color = index;
  selected.qty = Math.min(selected.qty, c.quantity);
  document
    .querySelectorAll(".color-choice")
    .forEach((b) => b.classList.remove("selected"));
  const btn = [...document.querySelectorAll(".color-choice")].find((b) =>
    b.textContent.startsWith(c.name),
  );
  if (btn) btn.classList.add("selected");
  updateSelected();
}
function chooseSize(size, btn) {
  selected.size = size;
  document
    .querySelectorAll(".size-choice")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
  updateSelected();
}
function updateSelected() {
  const p = products.find((x) => x.id === selected.id),
    c = p.colors[selected.color];
  document.getElementById("detailMainImage").src = c.image;
  document.getElementById("selectedStock").textContent =
    `${c.name}: ${c.quantity > 0 ? "в наличии " + c.quantity + " шт." : "нет в наличии"}`;
  document.getElementById("detailQty").textContent = selected.qty;
  const msg = `Здравствуйте! Хочу заказать ${p.name}. Расцветка: ${c.name}${selected.size ? " | Размер: " + selected.size : ""} | Количество: ${selected.qty} шт. | Цена: ${money(p.price * selected.qty)}`;
  document.getElementById("detailWhatsApp").href =
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}
function changeQty(d) {
  const p = products.find((x) => x.id === selected.id),
    max = p.colors[selected.color].quantity;
  selected.qty = Math.max(1, Math.min(max, selected.qty + d));
  updateSelected();
}
function addSelectedToCart() {
  const p = products.find((x) => x.id === selected.id),
    c = p.colors[selected.color];
  if (c.quantity <= 0) return;
  const key = `${p.id}-${selected.color}-${selected.size}`;
  const old = cart.find((x) => x.key === key);
  if (old) old.qty = Math.min(c.quantity, old.qty + selected.qty);
  else
    cart.push({
      key,
      id: p.id,
      color: selected.color,
      size: selected.size,
      qty: selected.qty,
    });
  save();
  renderCart();
  updateCounts();
  closeProduct();
  openPanel("cartPanel");
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
    .map((i, idx) => {
      const p = products.find((x) => x.id === i.id),
        c = p.colors[i.color];
      total += p.price * i.qty;
      return `<div class="cart-item"><img src="${c.image}" onerror="this.src='${p.image}'"><div><h4>${p.name}</h4><small>${c.name}${i.size ? " · " + i.size : ""} · ${i.qty} шт.</small><br>${money(p.price * i.qty)}</div><button class="remove-item" onclick="removeFromCart(${idx})"><i class="fa-solid fa-trash"></i></button></div>`;
    })
    .join("");
  document.getElementById("cartTotal").textContent = money(total);
  document.getElementById("whatsappOrder").href =
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      "Здравствуйте! Хочу заказать:\n" +
        cart
          .map((i) => {
            const p = products.find((x) => x.id === i.id),
              c = p.colors[i.color];
            return `${p.name} — ${c.name}${i.size ? " — " + i.size : ""} — ${i.qty} шт.`;
          })
          .join("\n") +
        "\nИтого: " +
        money(total),
    )}`;
}
function removeFromCart(index) {
  cart.splice(index, 1);
  save();
  renderCart();
  updateCounts();
}
function renderFavorites() {
  const box = document.getElementById("favoriteItems");
  const list = favorites
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.quantity > 0);
  box.innerHTML = list.length
    ? list
        .map(
          (p) =>
            `<div class="fav-item"><img src="${p.image}"><div><h4>${p.name}</h4><small>${money(p.price)}</small></div><button class="remove-item" onclick="toggleFavorite(${p.id})">×</button></div>`,
        )
        .join("")
    : '<p class="muted">Избранных товаров пока нет.</p>';
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
function closeProduct() {
  document.getElementById("productModal").classList.remove("open");
  document.body.classList.remove("lock");
}

document
  .getElementById("menuBtn")
  .addEventListener("click", () =>
    document.body.classList.toggle("nav-menu-open"),
  );
document
  .querySelectorAll("nav a")
  .forEach((a) =>
    a.addEventListener("click", () =>
      document.body.classList.remove("nav-menu-open"),
    ),
  );
document.querySelectorAll(".filter").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".filter")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    activeFilter = b.dataset.filter;
    renderProducts();
  }),
);
document.querySelectorAll(".category-card").forEach((b) =>
  b.addEventListener("click", () => {
    activeFilter = b.dataset.category;
    document
      .querySelectorAll(".filter")
      .forEach((x) =>
        x.classList.toggle("active", x.dataset.filter === activeFilter),
      );
    renderProducts();
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
  }),
);
document.getElementById("productSearch").addEventListener("input", (e) => {
  searchText = e.target.value;
  renderProducts();
});
document
  .getElementById("sortSelect")
  .addEventListener("change", renderProducts);
document.getElementById("cartOpen").addEventListener("click", () => {
  renderCart();
  openPanel("cartPanel");
});
document.getElementById("favoritesOpen").addEventListener("click", () => {
  renderFavorites();
  openPanel("favoritePanel");
});
document
  .querySelectorAll(".close-panel")
  .forEach((b) => b.addEventListener("click", closePanels));
overlay.addEventListener("click", closePanels);
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
document.getElementById("productClose").addEventListener("click", closeProduct);
document.getElementById("productModal").addEventListener("click", (e) => {
  if (e.target.id === "productModal") closeProduct();
});
renderProducts();
renderCart();
renderFavorites();
