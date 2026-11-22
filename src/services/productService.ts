import { supabase, isSupabaseConfigured } from "./supabase";
import { Product, Category } from "../types";

const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: "Платки", slug: "scarves", image: "/images/category-scarves.jpg", display_order: 1 },
  { id: 2, name: "Шарфы & Палантины", slug: "shawls", image: "/images/category-shawls.jpg", display_order: 2 },
  { id: 3, name: "Хиджабы", slug: "hijab", image: "/images/category-hijab.jpg", display_order: 3 },
  { id: 4, name: "Платья & Абайи", slug: "dresses", image: "/images/category-dresses.jpg", display_order: 4 },
  { id: 5, name: "Аксессуары", slug: "accessories", image: "/images/hero.jpg", display_order: 5 }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Шёлковый платок «Royal Silk»",
    category_id: 1,
    price: 120,
    old_price: 150,
    badge: "ХИТ",
    material: "Натуральный шёлк Гирбишин",
    size: "120 × 120 см",
    image: "/images/product-01.jpg",
    description: "Эксклюзивный платок из натурального плотного шёлка гирбишин. Мягко драпируется, держит благородную форму и обладает лёгким жемчужным переливом.",
    stock: 14,
    status: "active",
    colors: [
      { name: "Чёрный графит", hex: "#1c1c1c", quantity: 6 },
      { name: "Шампань-беж", hex: "#ecd9c2", quantity: 5 },
      { name: "Нежная пудра", hex: "#e7cbcf", quantity: 3 }
    ]
  },
  {
    id: 2,
    name: "Платок «Dubai Satin Carré»",
    category_id: 1,
    price: 95,
    old_price: 120,
    badge: "СКИДКА",
    material: "Дубайский сатин-жаккард",
    size: "110 × 110 см",
    image: "/images/product-02.jpg",
    description: "Глянцевый атласный платок с изысканным восточным переливом. Идеален как для праздничного образа, так и на каждый день.",
    stock: 11,
    status: "active",
    colors: [
      { name: "Молочный перламутр", hex: "#f3ede3", quantity: 7 },
      { name: "Горький шоколад", hex: "#3e2723", quantity: 4 }
    ]
  },
  {
    id: 3,
    name: "Платок «Florence Monogram»",
    category_id: 1,
    price: 135,
    old_price: null,
    badge: "PREMIUM",
    material: "Итальянский шёлк-твил",
    size: "120 × 120 см",
    image: "/images/product-03.jpg",
    description: "Изысканный платок с авторским вензелем. Матовая фактура саржевого плетения не скользит и прекрасно носится.",
    stock: 9,
    status: "active",
    colors: [
      { name: "Королевский синий", hex: "#1d3557", quantity: 5 },
      { name: "Тёплый крем", hex: "#f5ebe0", quantity: 4 }
    ]
  },
  {
    id: 4,
    name: "Платье «Madina Silk Abaya»",
    category_id: 4,
    price: 380,
    old_price: 450,
    badge: "NEW",
    material: "Премиальный дубайский шёлк",
    size: "42-48 (Оверсайз с поясом)",
    image: "/images/dress-01.jpg",
    description: "Роскошное авторское платье-абая в пол свободного кроя. В комплекте идёт акцентный шёлковый пояс.",
    stock: 7,
    status: "active",
    colors: [
      { name: "Глубокий чёрный", hex: "#111111", quantity: 4 },
      { name: "Королевский изумруд", hex: "#1b4d3e", quantity: 3 }
    ]
  },
  {
    id: 5,
    name: "Шарф-палантин «Cashmere Touch»",
    category_id: 2,
    price: 110,
    old_price: 130,
    badge: "УЮТ",
    material: "Шёлк + Кашемир",
    size: "190 × 75 см",
    image: "/images/product-04.jpg",
    description: "Нежнейший палантин с бахромой ручной работы. Прекрасно согревает и драпируется в элегантные складки.",
    stock: 12,
    status: "active",
    colors: [
      { name: "Кофейный мокко", hex: "#6f4e37", quantity: 6 },
      { name: "Сливочный беж", hex: "#f3ede3", quantity: 6 }
    ]
  },
  {
    id: 6,
    name: "Хиджаб «Turkish Modal Silk»",
    category_id: 3,
    price: 85,
    old_price: null,
    badge: "ХИТ",
    material: "Турецкий шёлковый модал",
    size: "180 × 80 см",
    image: "/images/product-05.jpg",
    description: "Дышащий, струящийся хиджаб из высококачественного модала. Не требует булавок и отлично держится весь день.",
    stock: 15,
    status: "active",
    colors: [
      { name: "Графит", hex: "#2b2b2b", quantity: 8 },
      { name: "Пыльная роза", hex: "#d8a47f", quantity: 7 }
    ]
  }
];

export const productService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured()) {
      return INITIAL_CATEGORIES;
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_CATEGORIES;
    }
    return data as Category[];
  },

  // Get products with optional filter
  async getProducts(params?: { categoryId?: number; search?: string; status?: string }): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      return this._localGetProducts(params);
    }

    let query = supabase.from("products").select("*, categories(*)");

    if (params?.categoryId) {
      query = query.eq("category_id", params.categoryId);
    }
    if (params?.status) {
      query = query.eq("status", params.status);
    } else {
      query = query.eq("status", "active");
    }
    if (params?.search) {
      query = query.ilike("name", `%${params.search}%`);
    }

    const { data, error } = await query.order("id", { ascending: false });

    if (error || !data || data.length === 0) {
      return this._localGetProducts(params);
    }

    return data.map((p) => ({
      ...p,
      colors: typeof p.colors === "string" ? JSON.parse(p.colors) : p.colors || []
    })) as Product[];
  },

  // Get product by ID
  async getProductById(id: number): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
      const all = this._localGetProducts();
      return all.find((p) => p.id === Number(id)) || null;
    }

    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return {
      ...data,
      colors: typeof data.colors === "string" ? JSON.parse(data.colors) : data.colors || []
    } as Product;
  },

  // Create Product (Admin Only)
  async createProduct(product: Omit<Product, "id">): Promise<Product> {
    if (!isSupabaseConfigured()) {
      return this._localCreateProduct(product);
    }

    const payload = {
      ...product,
      colors: JSON.stringify(product.colors || [])
    };

    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      colors: typeof data.colors === "string" ? JSON.parse(data.colors) : data.colors || []
    } as Product;
  },

  // Update Product (Admin Only)
  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    if (!isSupabaseConfigured()) {
      return this._localUpdateProduct(id, product);
    }

    const payload = { ...product };
    if (payload.colors) {
      payload.colors = JSON.stringify(payload.colors) as any;
    }

    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      colors: typeof data.colors === "string" ? JSON.parse(data.colors) : data.colors || []
    } as Product;
  },

  // Delete Product (Admin Only)
  async deleteProduct(id: number): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return this._localDeleteProduct(id);
    }

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  // Upload Product Image (Storage or Base64 fallback)
  async uploadImage(file: File): Promise<string> {
    if (!isSupabaseConfigured()) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const ext = file.name.split(".").pop();
    const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `items/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      // Fallback to data URL if bucket is not yet created
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  },

  // Local Storage Helpers
  _localGetProducts(params?: { categoryId?: number; search?: string; status?: string }): Product[] {
    const stored = localStorage.getItem("hadidja_products_store");
    let list: Product[] = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;

    if (params?.categoryId) {
      list = list.filter((p) => p.category_id === params.categoryId);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  },

  _localCreateProduct(product: Omit<Product, "id">): Product {
    const list = this._localGetProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now()
    };
    list.unshift(newProduct);
    localStorage.setItem("hadidja_products_store", JSON.stringify(list));
    return newProduct;
  },

  _localUpdateProduct(id: number, updates: Partial<Product>): Product {
    const list = this._localGetProducts();
    const idx = list.findIndex((p) => p.id === Number(id));
    if (idx === -1) throw new Error("Товар не найден");
    list[idx] = { ...list[idx], ...updates, id: Number(id) };
    localStorage.setItem("hadidja_products_store", JSON.stringify(list));
    return list[idx];
  },

  _localDeleteProduct(id: number): boolean {
    let list = this._localGetProducts();
    list = list.filter((p) => p.id !== Number(id));
    localStorage.setItem("hadidja_products_store", JSON.stringify(list));
    return true;
  }
};
