import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Heart, 
  ShoppingBag, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  ChevronRight
} from "lucide-react";
import { productService } from "../../services/productService";
import { userService } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { Product, ProductColor } from "../../types";
import { Loader, EmptyState } from "../../components/common/Loader";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id, 10));
      window.scrollTo(0, 0);
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      if (data) {
        setProduct(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }

        // Check favorite status
        if (user) {
          const favs = await userService.getFavorites(user.id);
          setIsFavorite(favs.includes(data.id));
        } else {
          const localFavs = JSON.parse(localStorage.getItem("hadidja_local_favs") || "[]");
          setIsFavorite(localFavs.includes(data.id));
        }

        // Load related items
        const allActive = await productService.getProducts({ status: "active" });
        setRelatedProducts(
          allActive.filter((p) => p.id !== data.id && p.category_id === data.category_id).slice(0, 4)
        );
      }
    } catch (err) {
      console.error("Failed to load product details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!product) return;
    if (!user) {
      const localFavs = JSON.parse(localStorage.getItem("hadidja_local_favs") || "[]");
      let updated: number[];
      if (localFavs.includes(product.id)) {
        updated = localFavs.filter((i: number) => i !== product.id);
        setIsFavorite(false);
      } else {
        updated = [...localFavs, product.id];
        setIsFavorite(true);
      }
      localStorage.setItem("hadidja_local_favs", JSON.stringify(updated));
      return;
    }

    try {
      if (isFavorite) {
        await userService.removeFavorite(user.id, product.id);
        setIsFavorite(false);
      } else {
        await userService.addFavorite(user.id, product.id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Toggle favorite failed", err);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const color = selectedColor || product.colors[0] || { name: "Стандарт", hex: "#000000" };
    addToCart(product, color, product.size || "Универсальный", quantity);
    
    setToastMessage(`«${product.name}» (${quantity} шт.) добавлен в корзину`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getWhatsAppLink = () => {
    if (!product) return "";
    const colorName = selectedColor?.name || "Стандарт";
    const total = product.price * quantity;
    const text = encodeURIComponent(
      `Ассалому алейкум, HADIDJA SHOP!\n` +
      `Хочу оформить заказ:\n` +
      `✦ Товар: ${product.name}\n` +
      `✦ Цвет: ${colorName}\n` +
      `✦ Количество: ${quantity} шт.\n` +
      `✦ Сумма: ${total} сомони\n` +
      `✦ Адрес доставки в Душанбе: `
    );
    return `https://wa.me/992886006528?text=${text}`;
  };

  if (loading) {
    return (
      <div className="py-24">
        <Loader text="Загрузка деталей изделия..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24">
        <EmptyState
          title="Изделие не найдено"
          description="Возможно, данный товар был раскуплен или снят с производства"
          actionLabel="Вернуться в каталог"
          onAction={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-12 pb-24 lg:pb-16">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 sm:bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-noir text-gold-light px-4 sm:px-5 py-3 rounded-full text-sm font-medium shadow-gold-lg flex items-center justify-center gap-2 text-center border border-gold-primary/30 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/#catalog" className="hover:text-foreground">Каталог</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          
          {/* Left Column: Visual Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-muted border border-border relative group shadow-sm">
              <img
                src={selectedColor?.image || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/product-01.jpg";
                }}
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.badge && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-gold-primary text-noir uppercase tracking-wider shadow-sm">
                    {product.badge}
                  </span>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500 text-white shadow-sm">
                    Осталось {product.stock} шт.
                  </span>
                )}
              </div>

              {/* Favorite Action */}
              <button
                onClick={handleToggleFavorite}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
                  isFavorite 
                    ? "bg-rose-50 text-rose-500 scale-105" 
                    : "bg-white/90 dark:bg-noir/90 text-foreground hover:scale-110"
                }`}
                title={isFavorite ? "В избранном" : "В избранное"}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current text-rose-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* Right Column: Information & Buying Actions */}
          <div className="flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Material & Atelier Origin */}
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs font-semibold tracking-wider text-gold-dark dark:text-gold-light uppercase">
                <span>{product.material || "Премиальная ткань"}</span>
                {product.stock > 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ В наличии в Душанбе</span>
                ) : (
                  <span className="text-rose-500 font-medium">Под заказ</span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-foreground leading-tight">
                {product.name}
              </h1>

              {/* Price & Discounts */}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-serif text-2xl sm:text-4xl font-bold text-foreground">
                  {product.price} <span className="text-lg font-sans font-normal text-muted-foreground">сомони (TJS)</span>
                </span>
                {product.old_price && (
                  <span className="text-base text-muted-foreground line-through">
                    {product.old_price} TJS
                  </span>
                )}
                {product.old_price && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                    -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs font-medium mb-2.5">
                    <span>
                      Цвет: <strong className="text-foreground">{selectedColor?.name}</strong>
                    </span>
                    <span className="text-muted-foreground">{product.colors.length} оттенка(-ов)</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((c, index) => {
                      const isSelected = selectedColor?.name === c.name;
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(c)}
                          className={`group min-h-11 flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-xs ${
                            isSelected
                              ? "border-gold-primary ring-2 ring-gold-primary/30 bg-gold-primary/5 font-semibold text-foreground"
                              : "border-border hover:border-gold-primary/40 text-muted-foreground"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-border shadow-xs"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size / Dimensions if applicable */}
              {product.size && (
                <div className="pt-1">
                  <span className="text-xs text-muted-foreground">Размер / параметры: </span>
                  <span className="text-xs font-semibold text-foreground">{product.size}</span>
                </div>
              )}

              {/* Quantity Counter */}
              <div className="pt-2 flex items-center gap-4">
                <span className="text-xs font-medium text-foreground">Количество:</span>
                <div className="flex items-center border border-border rounded-xl bg-card">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center text-foreground hover:bg-muted transition-colors rounded-l-xl font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-foreground tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    className="w-11 h-11 flex items-center justify-center text-foreground hover:bg-muted transition-colors rounded-r-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Actions: Cart + WhatsApp 1-click */}
            <div className="pt-6 border-t border-border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full min-h-14 px-4 py-4 rounded-2xl bg-noir dark:bg-gold-primary text-white dark:text-noir font-semibold text-xs sm:text-sm tracking-wider uppercase hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 text-center group"
                >
                  <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>В корзину ({product.price * quantity} TJS)</span>
                </button>

                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full min-h-14 px-4 py-4 rounded-2xl bg-whatsapp text-white font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-whatsapp-dark shadow-md transition-all flex items-center justify-center gap-2 text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Купить в WhatsApp</span>
                </a>
              </div>

              {/* Trust Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-muted-foreground border-t border-border/60">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold-dark dark:text-gold-light shrink-0" />
                  <span>Доставка по Душанбе за 2 часа</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-gold-dark dark:text-gold-light shrink-0" />
                  <span>Примерка перед оплатой</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-dark dark:text-gold-light shrink-0" />
                  <span>100% гарантия качества</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 sm:mt-20 pt-8 sm:pt-12 border-t border-border">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6 sm:mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">Рекомендации</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">Вам также понравится</h3>
              </div>
              <Link to="/#catalog" className="text-xs font-semibold text-gold-dark dark:text-gold-light hover:underline">
                Все товары →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/product/${rel.id}`}
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-serif text-xs sm:text-sm font-semibold text-foreground line-clamp-1">
                      {rel.name}
                    </h4>
                    <span className="text-xs font-bold text-foreground block mt-1">
                      {rel.price} TJS
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
