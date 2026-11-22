import { supabase, isSupabaseConfigured } from "./supabase";
import { Order, OrderItem } from "../types";

export const orderService = {
  // Create Order (User or Guest checkout)
  async createOrder(
    orderData: {
      user_id?: string | null;
      customer_name: string;
      customer_phone: string;
      customer_address: string;
      total_price: number;
      payment_method?: string;
      notes?: string;
    },
    items: Array<{
      product_id?: number;
      product_name: string;
      color?: string;
      size?: string;
      quantity: number;
      price: number;
      image?: string;
    }>
  ): Promise<Order> {
    if (!isSupabaseConfigured()) {
      return this._localCreateOrder(orderData, items);
    }

    // 1. Insert order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.user_id || null,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address,
        total_price: orderData.total_price,
        payment_method: orderData.payment_method || "Наличными курьеру",
        notes: orderData.notes || "",
        status: "Новый"
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    // 2. Insert order items
    if (items && items.length > 0) {
      const orderItems = items.map((it) => ({
        order_id: order.id,
        product_id: it.product_id || null,
        product_name: it.product_name,
        color: it.color || "",
        size: it.size || "",
        quantity: it.quantity,
        price: it.price,
        image: it.image || ""
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) console.warn("Could not insert order items:", itemsErr);
    }

    return order as Order;
  },

  // Get orders of the current user (Private per User)
  async getUserOrders(userId: string): Promise<Order[]> {
    if (!isSupabaseConfigured()) {
      return this._localGetUserOrders(userId);
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return this._localGetUserOrders(userId);
    return data as Order[];
  },

  // Get ALL orders (Admin Only)
  async getAllOrders(): Promise<Order[]> {
    if (!isSupabaseConfigured()) {
      return this._localGetAllOrders();
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error || !data) return this._localGetAllOrders();
    return data as Order[];
  },

  // Update order status (Admin Only)
  async updateOrderStatus(orderId: number, status: Order["status"]): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return this._localUpdateStatus(orderId, status);
    }

    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) throw error;
    return true;
  },

  // Local storage helpers
  _localCreateOrder(orderData: any, items: any[]): Order {
    const list: Order[] = this._localGetAllOrders();
    const newOrder: Order = {
      id: Date.now(),
      user_id: orderData.user_id || null,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_address: orderData.customer_address,
      total_price: orderData.total_price,
      status: "Новый",
      payment_method: orderData.payment_method || "Наличными",
      notes: orderData.notes || "",
      created_at: new Date().toISOString(),
      order_items: items.map((it, idx) => ({
        id: idx + 1,
        product_name: it.product_name,
        color: it.color || "",
        size: it.size || "",
        quantity: it.quantity,
        price: it.price,
        image: it.image || ""
      }))
    };

    list.unshift(newOrder);
    localStorage.setItem("hadidja_orders_store", JSON.stringify(list));
    return newOrder;
  },

  _localGetUserOrders(userId: string): Order[] {
    const all = this._localGetAllOrders();
    return all.filter((o) => o.user_id === userId);
  },

  _localGetAllOrders(): Order[] {
    const stored = localStorage.getItem("hadidja_orders_store");
    return stored ? JSON.parse(stored) : [];
  },

  _localUpdateStatus(orderId: number, status: Order["status"]): boolean {
    const list = this._localGetAllOrders();
    const order = list.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem("hadidja_orders_store", JSON.stringify(list));
      return true;
    }
    return false;
  }
};
