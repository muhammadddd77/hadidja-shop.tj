import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Upload, 
  Clipboard, 
  Check, 
  Filter, 
  Package, 
  Eye, 
  AlertTriangle,
  Image as ImageIcon
} from "lucide-react";
import { productService } from "../../services/productService";
import { Product, Category, ProductColor } from "../../types";
import { Loader, EmptyState } from "../../components/common/Loader";

export const AdminProducts: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "archived">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pasteNotice, setPasteNotice] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [oldPrice, setOldPrice] = useState<number | "">("");
  const [badge, setBadge] = useState("");
  const [material, setMaterial] = useState("");
  const [size, setSize] = useState("");
  const [stock, setStock] = useState<number>(10);
  const [status, setStatus] = useState<"active" | "draft" | "archived">("active");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState("");
  const [colors, setColors] = useState<ProductColor[]>([
    { name: "Классический", hex: "#1c1c1c", quantity: 5 }
  ]);

  // Color input state
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#c5a880");

  const pasteAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodsData, catsData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories()
      ]);
      setProducts(prodsData);
      setCategories(catsData);

      // Check if URL has ?new=1 or ?edit=ID
      if (searchParams.get("new") === "1") {
        openCreateModal();
      } else if (searchParams.get("edit")) {
        const id = parseInt(searchParams.get("edit")!, 10);
        const match = prodsData.find((p) => p.id === id);
        if (match) openEditModal(match);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice(120);
    setOldPrice("");
    setBadge("NEW");
    setMaterial("Натуральный шёлк");
    setSize("120 × 120 см");
    setStock(10);
    setStatus("active");
    setCategoryId(categories[0]?.id || 1);
    setImageUrl("/images/product-01.jpg");
    setColors([{ name: "Чёрный", hex: "#1c1c1c", quantity: 5 }]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description || "");
    setPrice(p.price);
    setOldPrice(p.old_price || "");
    setBadge(p.badge || "");
    setMaterial(p.material || "");
    setSize(p.size || "");
    setStock(p.stock);
    setStatus(p.status);
    setCategoryId(p.category_id || (categories[0]?.id || 1));
    setImageUrl(p.image);
    setColors(p.colors || [{ name: "Классический", hex: "#1c1c1c", quantity: 5 }]);
    setIsModalOpen(true);
  };

  // Clipboard Paste support (Ctrl+V into the image container!)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setImageUrl(event.target.result as string);
              setPasteNotice(true);
              setTimeout(() => setPasteNotice(false), 2500);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  // Local File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Color to list
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors((prev) => [
      ...prev,
      { name: newColorName.trim(), hex: newColorHex, quantity: 5 }
    ]);
    setNewColorName("");
  };

  const handleRemoveColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  // Save (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSaving(true);

      const payload: Partial<Product> = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        old_price: oldPrice ? Number(oldPrice) : null,
        badge: badge.trim() || undefined,
        material: material.trim(),
        size: size.trim(),
        stock: Number(stock),
        status,
        category_id: Number(categoryId),
        image: imageUrl || "/images/product-01.jpg",
        colors: colors.length > 0 ? colors : [{ name: "Стандарт", hex: "#000000", quantity: Number(stock) }]
      };

      if (editingProduct) {
        const updated = await productService.updateProduct(editingProduct.id, payload);
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)));
      } else {
        const created = await productService.createProduct(payload as any);
        setProducts((prev) => [created, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Save product failed", err);
      alert("Ошибка при сохранении товара");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await productService.deleteProduct(deleteCandidate.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteCandidate.id));
      setDeleteCandidate(null);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Не удалось удалить товар");
    }
  };

  // Filtered List
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category_id === selectedCategory);
    }

    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }

    return list;
  }, [products, searchQuery, selectedCategory, statusFilter]);

  return (
    <div className="space-y-5 sm:space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">
            Каталог Бутика
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1">
            Управление Товарами ({products.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Добавление, редактирование, загрузка фото через буфер обмена (Ctrl+V) и складские остатки
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto min-h-11 px-5 py-3 rounded-2xl bg-noir dark:bg-gold-primary text-white dark:text-noir text-xs font-semibold tracking-wider uppercase hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить изделие</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по названию или ткани..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-11 pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary transition-colors"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="w-full min-h-11 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary transition-colors"
          >
            <option value="all">Все категории ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary transition-colors"
          >
            <option value="all">Любой статус</option>
            <option value="active">Активные</option>
            <option value="draft">Черновики</option>
            <option value="archived">Архив</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <Loader text="Загрузка списка товаров..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="Товары не найдены"
          description="По вашим критериям поиска ничего не найдено"
          actionLabel="Сбросить фильтры"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("all");
            setStatusFilter("all");
          }}
        />
      ) : (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Фото</th>
                  <th className="py-3.5 px-4">Название & Ткань</th>
                  <th className="py-3.5 px-4">Категория</th>
                  <th className="py-3.5 px-4">Цена</th>
                  <th className="py-3.5 px-4">Остаток</th>
                  <th className="py-3.5 px-4">Цвета</th>
                  <th className="py-3.5 px-4">Статус</th>
                  <th className="py-3.5 px-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProducts.map((p) => {
                  const cat = categories.find((c) => c.id === p.category_id);
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-14 rounded-xl object-cover bg-muted border border-border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/product-01.jpg";
                          }}
                        />
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-foreground truncate">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {p.material || "Не указано"} {p.badge && `· [${p.badge}]`}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-foreground font-medium">
                        {cat?.name || "—"}
                      </td>

                      <td className="py-3 px-4 font-serif font-bold text-foreground">
                        {p.price} TJS
                        {p.old_price && (
                          <span className="block text-[10px] text-muted-foreground line-through font-sans">
                            {p.old_price} TJS
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`font-semibold ${p.stock <= 3 ? "text-rose-500" : "text-foreground"}`}>
                          {p.stock} шт.
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {p.colors?.slice(0, 3).map((c, i) => (
                            <span
                              key={i}
                              title={c.name}
                              className="w-3.5 h-3.5 rounded-full border border-border"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                          {p.colors && p.colors.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{p.colors.length - 3}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.status === "active"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {p.status === "active" ? "Активен" : "Черновик"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="w-10 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors inline-flex items-center justify-center"
                          title="Редактировать"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(p)}
                          className="w-10 h-10 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors inline-flex items-center justify-center"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-noir/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[95dvh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-border flex items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                  {editingProduct ? "Редактирование изделия" : "Новое изделие в бутик"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Заполните характеристики и загрузите фото (можно вставить через Ctrl+V)
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 shrink-0 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
              
              {/* Image Upload Area with Clipboard Paste Support */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Фотография изделия</span>
                  <span className="text-[11px] text-gold-dark dark:text-gold-light">
                    💡 Поддерживается Ctrl+V (вставка из буфера обмена)
                  </span>
                </label>

                <div
                  ref={pasteAreaRef}
                  tabIndex={0}
                  onPaste={handlePaste}
                  className="border-2 border-dashed border-border hover:border-gold-primary rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-muted/20 cursor-pointer focus:border-gold-primary outline-none transition-colors"
                >
                  {/* Preview Image */}
                  <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden bg-muted border border-border relative shrink-0">
                    <img
                      src={imageUrl || "/images/product-01.jpg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {pasteNotice && (
                      <div className="absolute inset-0 bg-emerald-600/90 text-white text-[10px] font-bold flex items-center justify-center text-center p-1">
                        ✓ Вставлено из буфера!
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-xs text-muted-foreground">
                      Нажмите сюда и нажмите <strong className="text-foreground">Ctrl+V</strong>, чтобы вставить скопированное фото из интернета или Instagram, либо выберите файл на компьютере:
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="min-h-11 px-4 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-medium hover:bg-muted transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Выбрать файл с диска</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="text-xs text-muted-foreground">или укажите URL:</div>
                    </div>

                    <input
                      type="text"
                      placeholder="https://... или /images/product-01.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full min-h-11 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-xs font-medium text-foreground">Название изделия *</label>
                  <input
                    type="text"
                    required
                    placeholder="напр. Шёлковый платок «Royal Silk»"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-medium text-foreground">Категория *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full min-h-11 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prices & Badges */}
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Цена (TJS) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Старая цена (TJS)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="необязательно"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Бейдж</label>
                  <input
                    type="text"
                    placeholder="ХИТ / СКИДКА / NEW"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Остаток на складе *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
                  />
                </div>
              </div>

              {/* Material, Size & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Материал / Ткань</label>
                  <input
                    type="text"
                    placeholder="Шёлк Гирбишин / Сатин"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Размер / параметры</label>
                  <input
                    type="text"
                    placeholder="120 × 120 см / M-L"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Статус видимости</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary"
                  >
                    <option value="active">Активен (виден клиентам)</option>
                    <option value="draft">Черновик</option>
                    <option value="archived">Архив</option>
                  </select>
                </div>
              </div>

              {/* Colors Management */}
              <div className="space-y-3 pt-2 border-t border-border">
                <label className="text-xs font-semibold text-foreground block">
                  Варианты цветов ({colors.length})
                </label>

                <div className="flex flex-wrap gap-2">
                  {colors.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card text-xs shadow-2xs"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                      <span className="font-medium text-foreground">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(i)}
                        className="w-9 h-9 shrink-0 rounded-lg text-muted-foreground hover:text-rose-500 ml-1 inline-flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new color row */}
                <div className="flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Название цвета (напр. Изумрудный)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="w-full min-h-11 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs flex-1 max-w-none min-[420px]:max-w-xs focus:border-gold-primary"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-11 h-11 shrink-0 rounded-xl border border-border cursor-pointer p-0.5 bg-card"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="min-h-11 px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-medium hover:bg-muted/80 transition-colors"
                  >
                    Добавить цвет
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1 pt-2 border-t border-border">
                <label className="text-xs font-medium text-foreground">Описание изделия</label>
                <textarea
                  rows={3}
                  placeholder="Опишите тактильные ощущения, плотность и особенности ухода..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary resize-none"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-border flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto min-h-11 px-5 py-2.5 rounded-xl border border-border text-foreground text-xs font-medium hover:bg-muted"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto min-h-11 px-6 py-2.5 rounded-xl bg-noir dark:bg-gold-primary text-white dark:text-noir text-xs font-semibold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? "Сохранение..." : editingProduct ? "Сохранить изменения" : "Создать товар"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-noir/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Удалить изделие?
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Вы действительно хотите удалить «{deleteCandidate.name}»? Это действие нельзя отменить.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="w-full sm:w-auto min-h-11 px-4 py-2 rounded-xl border border-border text-foreground text-xs font-medium hover:bg-muted"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto min-h-11 px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Удалить навсегда
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
