export type UserRole = "admin" | "user";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  display_order?: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  quantity?: number;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  old_price?: number | null;
  badge?: string;
  material?: string;
  size?: string;
  image: string;
  colors: ProductColor[];
  category_id?: number;
  category?: Category;
  stock: number;
  status: "active" | "draft" | "archived";
  created_at?: string;
}

export interface CartItem {
  id: string; // unique combo key: `${productId}-${colorName}-${size}`
  product: Product;
  color: ProductColor;
  size: string;
  quantity: number;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id?: number;
  product_name: string;
  color?: string;
  size?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: number;
  user_id?: string | null;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_price: number;
  status: "Новый" | "В обработке" | "В доставке" | "Выполнен" | "Отменен";
  payment_method?: string;
  notes?: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface Address {
  id: number;
  user_id: string;
  full_name: string;
  phone: string;
  city: string;
  address: string;
  is_default: boolean;
  created_at?: string;
}

export interface UserSettings {
  id?: number;
  user_id: string;
  theme: "light" | "dark";
  notifications: boolean;
  updated_at?: string;
}
