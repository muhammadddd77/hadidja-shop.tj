import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Heart, 
  ShoppingBag, 
  MessageCircle, 
  Eye, 
  Check, 
  Star, 
  Shield, 
  Truck, 
  RotateCcw,
  ArrowRight,
  Filter,
  X
} from "lucide-react";
import { productService } from "../../services/productService";
import { userService } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { Product, Category } from "../../types";
import { Loader, EmptyState } from "../../components/common/Loader";

export const Home: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");
  
  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewColor, setQuickViewColor] = useState<string>("");
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catsData, prodsData, favsData] = await Promise.all([
        productService.getCategories(),
        productService.getProducts({ status: "active" }),
        user ? userService.getFavorites(user.id) : Promise.resolve([])
      ]);
      setCategories(catsData);
      setProducts(prodsData);
      setFavorites(favsData);
    } catch (err) {
      console.error("Failed to load home data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      // Local fallback
      const saved = JSON.parse(localStorage.getItem("hadidja_local_favs") || "[]");
      let updated: number[];
      if (saved.includes(productId)) {
        updated = saved.filter((id: number) => id !== productId);
      } else {
        updated = [...saved, productId];
      }
      localStorage.setItem("hadidja_local_favs", JSON.stringify(updated));
      setFavorites(updated);
      return;
    }

    try {
      const isFav = favorites.includes(productId);
      if (isFav) {
        await userService.removeFavorite(user.id, productId);
        setFavorites((prev) => prev.filter((id) => id !== productId));
      } else {
        await userService.addFavorite(user.id, productId);
        setFavorites((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error("Favorite toggle error", err);
    }
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category_id === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: Product, colorName?: string) => {
    const chosenColor = product.colors.find((c) => c.name === colorName) || product.colors[0] || { name: "Стандарт", hex: "#000000" };
    addToCart(product, chosenColor, product.size || "Универсальный", 1);
    
    setAddedToast(`«${product.name}» добавлен в корзину`);
    setTimeout(() => setAddedToast(null), 3000);
    if (quickViewProduct) setQuickViewProduct(null);
  };

  const getWhatsAppLink = (product: Product, colorName?: string) => {
    const color = colorName || (product.colors[0] ? product.colors[0].name : "Стандарт");
    const text = encodeURIComponent(
      `Ассалому алейкум, HADIDJA SHOP! Хочу заказать товар:\n` +
      `✦ Название: ${product.name}\n` +
      `✦ Цвет: ${color}\n` +
      `✦ Цена: ${product.price} сомони\n` +
      `✦ Ссылка: https://hadidja.shop/product/${product.id}`
    );
    return `https://wa.me/992886006528?text=${text}`;
  };

  return (
    <div className="pb-24 lg:pb-16">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-noir text-gold-light px-5 py-3 rounded-full text-sm font-medium shadow-gold-lg flex items-center gap-2 border border-gold-primary/30 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-silk-surface to-background dark:from-noir-soft dark:to-background border-b border-border py-12 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Brand & Copy */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/30 text-gold-dark dark:text-gold-light text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Новая коллекция 2025/2026</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-[1.15]">
                Элегантность & <br className="hidden sm:inline" />
                <span className="italic text-gold-dark dark:text-gold-light">Истинное Благородство</span>
              </h1>

              <p className="text-muted-foreground text-sm sm:text-base max-w-lg leading-relaxed">
                Премиальные платки из натурального шёлка гирбишин, дубайские сатины, турецкие хиджабы и дизайнерские платья. Создано с любовью для утончённых женщин.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto pt-2">
                <a
                  href="#catalog"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-noir dark:bg-gold-primary text-white dark:text-noir font-medium text-sm tracking-wider uppercase hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Смотреть каталог</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://wa.me/992886006528?text=Здравствуйте,%20HADIDJA%20SHOP!%20Хочу%20получить%20консультацию%20по%20ассортименту"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-whatsapp/40 bg-whatsapp/5 text-whatsapp-dark dark:text-whatsapp font-medium text-sm tracking-wider hover:bg-whatsapp/10 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-whatsapp" />
                  <span>Консультация в WhatsApp</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border w-full max-w-md">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-gold-dark dark:text-gold-light">100%</span>
                  <span className="text-[11px] text-muted-foreground">Натуральный шёлк</span>
                </div>
                <div className="flex flex-col items-center lg:items-start border-x border-border px-2">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-gold-dark dark:text-gold-light">Душанбе</span>
                  <span className="text-[11px] text-muted-foreground">Доставка в день заказа</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-gold-dark dark:text-gold-light">Примерка</span>
                  <span className="text-[11px] text-muted-foreground">Оплата при получении</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-border/60 bg-muted relative group">
                  <img
                    src="/images/hero.jpg"
                    alt="HADIDJA Luxury Fashion"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/product-01.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent" />
                  
                  {/* Floating Tag */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl backdrop-blur-md bg-noir/70 border border-white/10 text-white flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-gold-light font-semibold block">В наличии в бутике</span>
                      <span className="font-serif text-lg font-bold">Коллекция «Royal Silk Girbishin»</span>
                    </div>
                    <span className="font-serif text-xl font-bold text-gold-light">от 120 TJS</span>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-gold-primary/30 -z-10 animate-pulse hidden sm:block" />
                <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-full bg-gold-primary/10 blur-2xl -z-10" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="border-b border-border bg-card py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="flex flex-col items-center p-3">
              <Truck className="w-6 h-6 text-gold-dark dark:text-gold-light mb-2" />
              <h4 className="font-medium text-xs sm:text-sm text-foreground">Бесплатная доставка</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">По Душанбе при заказе от 250 TJS</p>
            </div>
            <div className="flex flex-col items-center p-3">
              <Shield className="w-6 h-6 text-gold-dark dark:text-gold-light mb-2" />
              <h4 className="font-medium text-xs sm:text-sm text-foreground">Премиум качество</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Турецкие и дубайские ткани</p>
            </div>
            <div className="flex flex-col items-center p-3">
              <RotateCcw className="w-6 h-6 text-gold-dark dark:text-gold-light mb-2" />
              <h4 className="font-medium text-xs sm:text-sm text-foreground">Примерка перед оплатой</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Курьер подождёт 15 минут</p>
            </div>
            <div className="flex flex-col items-center p-3">
              <MessageCircle className="w-6 h-6 text-whatsapp mb-2" />
              <h4 className="font-medium text-xs sm:text-sm text-foreground">Заказ в 1 клик</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Мгновенный ответ в WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section id="categories" className="py-12 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">Коллекции</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mt-1">Категории Бутика</h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-2">
              Выберите интересующую вас категорию или просмотрите полный каталог ниже
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const el = document.getElementById("catalog");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group relative rounded-2xl overflow-hidden aspect-[4/5] border transition-all text-left ${
                  selectedCategory === cat.id 
                    ? "border-gold-primary ring-2 ring-gold-primary/30 scale-[1.02]" 
                    : "border-border hover:border-gold-primary/50"
                }`}
              >
                <img
                  src={cat.image || "/images/hero.jpg"}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/product-01.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-sm sm:text-base font-semibold group-hover:text-gold-light transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-white/70 block uppercase tracking-wider">
                    Смотреть товары →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog" className="py-12 sm:py-16 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">Эксклюзив</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground mt-1">Каталог Одежды & Платков</h2>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                Все модели в наличии в Душанбе с гарантией подлинности
              </p>
            </div>

            {/* Total items badge */}
            <div className="text-xs text-muted-foreground">
              Найдено товаров: <span className="font-bold text-foreground">{filteredProducts.length}</span>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="bg-card border border-border rounded-2xl p-4 mb-8 shadow-sm space-y-4">
            
            {/* Search Input & Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск по названию, ткани или описанию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:border-gold-primary transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="sm:col-span-4">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:border-gold-primary transition-colors"
                >
                  <option value="featured">Сортировка: Рекомендуемые</option>
                  <option value="price-asc">Цена: Сначала дешевле</option>
                  <option value="price-desc">Цена: Сначала дороже</option>
                  <option value="newest">Новинки каталога</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
                  selectedCategory === "all"
                    ? "bg-noir dark:bg-gold-primary text-white dark:text-noir shadow-sm"
                    : "bg-muted text-foreground/80 hover:bg-muted/80"
                }`}
              >
                Все категории ({products.length})
              </button>
              {categories.map((c) => {
                const count = products.filter((p) => p.category_id === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
                      selectedCategory === c.id
                        ? "bg-noir dark:bg-gold-primary text-white dark:text-noir shadow-sm"
                        : "bg-muted text-foreground/80 hover:bg-muted/80"
                    }`}
                  >
                    {c.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <Loader text="Загрузка эксклюзивной коллекции..." />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="Товары не найдены"
              description="Попробуйте изменить параметры поиска или выбрать другую категорию"
              actionLabel="Сбросить фильтры"
              onAction={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setSortBy("featured");
              }}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {filteredProducts.map((product) => {
                const isFav = favorites.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <Link to={`/product/${product.id}`} className="block w-full h-full">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/product-01.jpg";
                          }}
                        />
                      </Link>

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        {product.badge && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm ${
                            product.badge === "ХИТ"
                              ? "bg-gold-primary text-noir"
                              : product.badge === "СКИДКА"
                              ? "bg-rose-600 text-white"
                              : "bg-noir text-white dark:bg-card dark:text-gold-light"
                          }`}>
                            {product.badge}
                          </span>
                        )}
                        {product.stock <= 3 && product.stock > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-amber-500/90 text-white">
                            Осталось {product.stock} шт.
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleToggleFavorite(product.id, e)}
                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
                          isFav 
                            ? "bg-rose-50 text-rose-500" 
                            : "bg-white/80 dark:bg-noir/80 text-foreground hover:scale-110"
                        }`}
                        title={isFav ? "Удалить из избранного" : "Добавить в избранное"}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? "fill-current text-rose-500" : ""}`} />
                      </button>

                      {/* Quick View Button (hover desktop) */}
                      <button
                        onClick={() => {
                          setQuickViewProduct(product);
                          setQuickViewColor(product.colors[0]?.name || "");
                        }}
                        className="hidden sm:flex absolute bottom-3 left-3 right-3 py-2 rounded-xl bg-noir/80 backdrop-blur-sm text-white text-xs font-medium items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Быстрый просмотр</span>
                      </button>
                    </div>

                    {/* Product Meta */}
                    <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2">
                      <div>
                        {/* Material & Size */}
                        <div className="text-[11px] text-muted-foreground line-clamp-1 mb-1">
                          {product.material || "Натуральные ткани"} {product.size ? `· ${product.size}` : ""}
                        </div>

                        {/* Title */}
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-serif text-sm sm:text-base font-semibold text-foreground hover:text-gold-dark dark:hover:text-gold-light transition-colors line-clamp-2 leading-tight">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      {/* Colors Palette Preview */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1 pt-1">
                          {product.colors.slice(0, 4).map((c, idx) => (
                            <span
                              key={idx}
                              title={c.name}
                              className="w-3 h-3 rounded-full border border-border shadow-xs"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                          {product.colors.length > 4 && (
                            <span className="text-[10px] text-muted-foreground ml-1">
                              +{product.colors.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price & Action Row */}
                      <div className="pt-2 border-t border-border flex items-center justify-between gap-2 mt-auto">
                        <div className="flex flex-col">
                          <span className="font-serif text-base sm:text-lg font-bold text-foreground">
                            {product.price} <span className="text-xs font-sans font-normal text-muted-foreground">TJS</span>
                          </span>
                          {product.old_price && (
                            <span className="text-[11px] text-muted-foreground line-through">
                              {product.old_price} TJS
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          {/* Direct WhatsApp Order */}
                          <a
                            href={getWhatsAppLink(product)}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-full bg-whatsapp/10 hover:bg-whatsapp text-whatsapp hover:text-white flex items-center justify-center transition-colors"
                            title="Быстрый заказ в WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Add to Cart */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-8 h-8 rounded-full bg-noir dark:bg-gold-primary text-white dark:text-noir hover:scale-105 transition-transform flex items-center justify-center shadow-sm"
                            title="В корзину"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
            
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-background/80 text-foreground flex items-center justify-center hover:bg-background transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Product Image */}
            <div className="md:w-1/2 aspect-[4/5] bg-muted relative">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
              {quickViewProduct.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-gold-primary text-noir">
                  {quickViewProduct.badge}
                </span>
              )}
            </div>

            {/* Right: Info & Actions */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gold-dark dark:text-gold-light font-bold">
                  {quickViewProduct.material || "Премиальная ткань"}
                </span>
                <h3 className="font-serif text-2xl font-bold text-foreground mt-1">
                  {quickViewProduct.name}
                </h3>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-bold text-foreground">
                    {quickViewProduct.price} TJS
                  </span>
                  {quickViewProduct.old_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {quickViewProduct.old_price} TJS
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Color Selector */}
                {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-foreground block mb-2">
                      Цвет: <span className="text-gold-dark dark:text-gold-light">{quickViewColor || quickViewProduct.colors[0].name}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.colors.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => setQuickViewColor(c.name)}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${
                            (quickViewColor || quickViewProduct.colors[0].name) === c.name
                              ? "border-gold-primary ring-2 ring-gold-primary/30 scale-110"
                              : "border-border hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-border mt-6 space-y-2">
                <button
                  onClick={() => handleAddToCart(quickViewProduct, quickViewColor)}
                  className="w-full py-3 rounded-xl bg-noir dark:bg-gold-primary text-white dark:text-noir font-medium text-xs tracking-wider uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Добавить в корзину</span>
                </button>

                <a
                  href={getWhatsAppLink(quickViewProduct, quickViewColor)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl border border-whatsapp text-whatsapp font-medium text-xs tracking-wider uppercase hover:bg-whatsapp/10 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Заказать в WhatsApp</span>
                </a>

                <Link
                  to={`/product/${quickViewProduct.id}`}
                  className="block text-center text-xs text-muted-foreground hover:text-foreground pt-1"
                >
                  Подробнее о товаре →
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Boutique Story / About */}
      <section className="py-16 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">О Бутике</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                Философия HADIDJA SHOP
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                HADIDJA SHOP — это пространство, где восточные традиции скромности сочетаются с современной европейской эстетикой. Мы тщательно отбираем ткани из лучших текстильных фабрик Турции и ОАЭ, чтобы каждый платок и каждая абайя дарили вам непревзойденное ощущение комфорта и уверенности.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Наш шоурум в Душанбе предлагает услугу индивидуального подбора образа и быструю доставку с примеркой по всей республике.
              </p>

              <div className="pt-2">
                <a
                  href="https://www.instagram.com/hadidja_shop_tj/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gold-dark dark:text-gold-light hover:underline"
                >
                  <span>Наш Instagram: @hadidja_shop_tj</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-md">
                <img src="/images/product-02.jpg" alt="Hadidja Boutique" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-md mt-6">
                <img src="/images/product-03.jpg" alt="Hadidja Boutique" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
