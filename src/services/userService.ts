import { supabase, isSupabaseConfigured } from "./supabase";
import { Address, UserSettings, Profile, Product } from "../types";

export const userService = {
  // ── FAVORITES (Per User) ──────────────────────────────────────────────────
  async getFavorites(userId: string): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      return this._localGetFavorites(userId);
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("product_id, products(*)")
      .eq("user_id", userId);

    if (error || !data) return this._localGetFavorites(userId);
    return data.map((f: any) => ({
      ...f.products,
      colors: typeof f.products.colors === "string" ? JSON.parse(f.products.colors) : f.products.colors || []
    }));
  },

  async addFavorite(userId: string, productId: number): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return this._localAddFavorite(userId, productId);
    }

    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, product_id: productId });
    return !error;
  },

  async removeFavorite(userId: string, productId: number): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return this._localRemoveFavorite(userId, productId);
    }

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);
    return !error;
  },

  // ── ADDRESSES (Per User) ──────────────────────────────────────────────────
  async getAddresses(userId: string): Promise<Address[]> {
    if (!isSupabaseConfigured()) {
      return this._localGetAddresses(userId);
    }

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return this._localGetAddresses(userId);
    return data as Address[];
  },

  async addAddress(address: Omit<Address, "id">): Promise<Address> {
    if (!isSupabaseConfigured()) {
      return this._localAddAddress(address);
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert(address)
      .select()
      .single();

    if (error) throw error;
    return data as Address;
  },

  async deleteAddress(id: number, userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return this._localDeleteAddress(id, userId);
    }

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    return !error;
  },

  // ── USER SETTINGS (Theme & Notifications) ────────────────────────────────
  async getUserSettings(userId: string): Promise<UserSettings> {
    const defaultSettings: UserSettings = {
      user_id: userId,
      theme: (localStorage.getItem("hadidja_theme") as "light" | "dark") || "dark",
      notifications: true
    };

    if (!isSupabaseConfigured()) {
      return defaultSettings;
    }

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) return defaultSettings;
    return data as UserSettings;
  },

  async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<boolean> {
    if (updates.theme) {
      localStorage.setItem("hadidja_theme", updates.theme);
    }

    if (!isSupabaseConfigured()) return true;

    const { error } = await supabase
      .from("user_settings")
      .upsert({ user_id: userId, ...updates, updated_at: new Date().toISOString() });
    return !error;
  },

  // ── ADMIN: CUSTOMERS DIRECTORY ────────────────────────────────────────────
  async getAllCustomers(): Promise<Profile[]> {
    if (!isSupabaseConfigured()) {
      const usersStr = localStorage.getItem("hadidja_mock_users") || "[]";
      return JSON.parse(usersStr);
    }

    // Admins can read all profiles via RLS policy
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as Profile[];
  },

  // ── Local storage helpers ─────────────────────────────────────────────────
  _localGetFavorites(userId: string): Product[] {
    const key = `hadidja_favs_${userId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  },

  _localAddFavorite(userId: string, productId: number): boolean {
    const key = `hadidja_favs_${userId}`;
    const stored = localStorage.getItem(key);
    const list: any[] = stored ? JSON.parse(stored) : [];
    if (!list.some((p) => p.id === productId)) {
      list.push({ id: productId });
      localStorage.setItem(key, JSON.stringify(list));
    }
    return true;
  },

  _localRemoveFavorite(userId: string, productId: number): boolean {
    const key = `hadidja_favs_${userId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return true;
    let list: any[] = JSON.parse(stored);
    list = list.filter((p) => p.id !== productId);
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  },

  _localGetAddresses(userId: string): Address[] {
    const key = `hadidja_addr_${userId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  },

  _localAddAddress(address: Omit<Address, "id">): Address {
    const key = `hadidja_addr_${address.user_id}`;
    const list = this._localGetAddresses(address.user_id);
    const newAddr: Address = { ...address, id: Date.now() };
    list.unshift(newAddr);
    localStorage.setItem(key, JSON.stringify(list));
    return newAddr;
  },

  _localDeleteAddress(id: number, userId: string): boolean {
    const key = `hadidja_addr_${userId}`;
    let list = this._localGetAddresses(userId);
    list = list.filter((a) => a.id !== id);
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  }
};
