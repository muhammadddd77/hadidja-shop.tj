import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Package } from "lucide-react";
import { productService } from "../../services/productService";
import { Category, Product } from "../../types";
import { Loader } from "../../components/common/Loader";

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catsData, prodsData] = await Promise.all([
        productService.getCategories(),
        productService.getProducts()
      ]);
      setCategories(catsData);
      setProducts(prodsData);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setImage("/images/hero.jpg");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setImage(cat.image || "/images/hero.jpg");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSaving(true);
      const generatedSlug = slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-");

      if (editingCategory) {
        const updatedList = categories.map((c) =>
          c.id === editingCategory.id ? { ...c, name: name.trim(), slug: generatedSlug, image: image.trim() } : c
        );
        await productService.saveCategories(updatedList);
        setCategories(updatedList);
      } else {
        const newCat = await productService.createCategory({
          name: name.trim(),
          slug: generatedSlug,
          image: image.trim() || "/images/hero.jpg",
          display_order: categories.length + 1
        });
        setCategories((prev) => [...prev, newCat]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save category", err);
      alert("Ошибка при сохранении категории");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Удалить эту категорию?")) return;
    try {
      await productService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete category", err);
      alert("Не удалось удалить категорию");
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <Loader text="Загрузка категорий..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">
            Каталог
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1">
            Категории Товаров ({categories.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Управление разделами бутика: платки, шарфы, хиджабы, абайи и платья
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="min-h-11 px-5 py-3 rounded-2xl bg-noir dark:bg-gold-primary text-white dark:text-noir text-xs font-semibold tracking-wider uppercase hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить категорию</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {categories.map((cat) => {
          const prodsInCat = products.filter((p) => p.category_id === cat.id);
          return (
            <div
              key={cat.id}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="aspect-[16/9] relative bg-muted">
                <img
                  src={cat.image || "/images/hero.jpg"}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/product-01.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-serif text-xl font-bold">{cat.name}</h3>
                  <span className="text-[11px] text-gold-light font-mono break-all">/{cat.slug}</span>
                </div>
              </div>

              <div className="p-3 sm:p-4 flex items-center justify-between gap-2">
                <div className="min-w-0 flex items-center gap-2 text-xs text-muted-foreground">
                  <Package className="w-4 h-4 shrink-0 text-gold-dark dark:text-gold-light" />
                  <span className="min-w-0">
                    Товаров в разделе: <strong className="text-foreground">{prodsInCat.length}</strong>
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Редактировать"
                    aria-label={`Редактировать категорию ${cat.name}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Удалить"
                    aria-label={`Удалить категорию ${cat.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4 bg-noir/70 backdrop-blur-sm animate-fadeIn">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            className="bg-card border border-border rounded-3xl max-w-md w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 shadow-2xl my-auto"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
              <h3 id="category-modal-title" className="font-serif text-xl font-bold text-foreground">
                {editingCategory ? "Редактировать категорию" : "Новая категория"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Закрыть окно"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Название категории *</label>
                <input
                  type="text"
                  required
                  placeholder="напр. Платья & Абайи"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "-"));
                    }
                  }}
                  className="w-full min-h-11 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:border-gold-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Slug (URL метка) *</label>
                <input
                  type="text"
                  required
                  placeholder="dresses"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full min-h-11 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:border-gold-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">URL обложки</label>
                <input
                  type="text"
                  placeholder="/images/hero.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full min-h-11 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:border-gold-primary"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-11 px-4 py-2 rounded-xl border border-border text-foreground text-xs font-medium hover:bg-muted transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="min-h-11 px-5 py-2 rounded-xl bg-noir dark:bg-gold-primary text-white dark:text-noir text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isSaving ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
