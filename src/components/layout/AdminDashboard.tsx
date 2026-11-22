import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  MessageCircle,
  Plus
} from "lucide-react";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { userService } from "../../services/userService";
import { Product, Order, Profile } from "../../types";
import { Loader } from "../../components/common/Loader";

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [prodsData, ordersData, custsData] = await Promise.all([
        productService.getProducts(),
        orderService.getAllOrders(),
        userService.getAllCustomers()
      ]);
      setProducts(prodsData);
      setOrders(ordersData);
      setCustomers(custsData);
    } catch (err) {
      console.error("Dashboard data load error", err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== "Отменен")
    .reduce((sum, o) => sum + (o.total_price || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === "Новый" || o.status === "В обработке");
  const completedOrders = orders.filter((o) => o.status === "Выполнен");
  const lowStockProducts = products.filter((p) => p.stock <= 3);

  if (loading) {
    return (
      <div className="py-20">
        <Loader text="Загрузка аналитики магазина..." />
      </div>
    );
  }

  return (
    <div className="admin-dashboard min-w-0 space-y-6 sm:space-y-8">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">
            Управление Бутиком
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1 leading-tight break-words">
            Панель Управления (Dashboard)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Сводка заказов, выручки и остатков товаров в Душанбе
          </p>
        </div>

        <div className="flex w-full sm:w-auto flex-col min-[560px]:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Link
            to="/admin/products?new=1"
            className="inline-flex w-full sm:w-auto justify-center px-4 py-3 sm:py-2.5 rounded-xl bg-noir dark:bg-gold-primary text-white dark:text-noir text-xs font-semibold tracking-wider uppercase hover:opacity-90 shadow-sm transition-all items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить товар</span>
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex w-full sm:w-auto justify-center px-4 py-3 sm:py-2.5 rounded-xl border border-border bg-card text-foreground text-xs font-medium hover:bg-muted transition-colors"
          >
            Все заказы
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Revenue */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs flex min-w-0 flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Общая выручка</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {totalRevenue}
            </span>
            <span className="text-xs font-sans text-muted-foreground ml-1">TJS</span>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              ✓ Заказы без отмен
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs flex min-w-0 flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Всего заказов</span>
            <div className="w-8 h-8 rounded-lg bg-gold-primary/10 text-gold-dark dark:text-gold-light flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {orders.length}
            </span>
            <span className="text-xs font-sans text-muted-foreground ml-1">заказов</span>
            <div className="text-[11px] text-amber-500 font-medium mt-1">
              {pendingOrders.length} в ожидании
            </div>
          </div>
        </div>

        {/* Products in Catalog */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs flex min-w-0 flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Товары в бутике</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {products.length}
            </span>
            <span className="text-xs font-sans text-muted-foreground ml-1">позиций</span>
            <div className="text-[11px] text-muted-foreground mt-1">
              {lowStockProducts.length > 0 ? (
                <span className="text-rose-500 font-medium">{lowStockProducts.length} заканчиваются</span>
              ) : (
                "Все в наличии"
              )}
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs flex min-w-0 flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Клиентская база</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {customers.length}
            </span>
            <span className="text-xs font-sans text-muted-foreground ml-1">клиентов</span>
            <div className="text-[11px] text-muted-foreground mt-1">
              Зарегистрировано
            </div>
          </div>
        </div>

      </div>

      {/* Two-Column Grid: Recent Orders & Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col min-[560px]:flex-row min-[560px]:items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Недавние заказы
              </h2>
              <p className="text-xs text-muted-foreground">
                Последние поступившие заказы покупателей
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-gold-dark dark:text-gold-light hover:underline flex items-center gap-1"
            >
              <span>Все заказы</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Заказов пока нет
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-3 px-3">№</th>
                    <th className="py-3 px-3">Клиент</th>
                    <th className="py-3 px-3">Телефон</th>
                    <th className="py-3 px-3">Сумма</th>
                    <th className="py-3 px-3">Статус</th>
                    <th className="py-3 px-3 text-right">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {orders.slice(0, 5).map((ord) => {
                    const cleanPhone = ord.customer_phone.replace(/\D/g, "");
                    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Здравствуйте, ${ord.customer_name}! Вас беспокоит администратор HADIDJA SHOP по поводу вашего заказа #${ord.id}.`
                    )}`;

                    return (
                      <tr key={ord.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-foreground">
                          #{ord.id}
                        </td>
                        <td className="py-3 px-3 font-medium text-foreground">
                          {ord.customer_name}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">
                          {ord.customer_phone}
                        </td>
                        <td className="py-3 px-3 font-serif font-bold text-foreground">
                          {ord.total_price} TJS
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.status === "Новый"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                              : ord.status === "В обработке"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                              : ord.status === "В доставке"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                              : ord.status === "Выполнен"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-whatsapp hover:underline"
                            title="Написать клиенту в WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <h2 className="font-serif text-base sm:text-lg font-bold text-foreground flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Заканчивающиеся остатки</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Товары с количеством на складе 3 шт. или менее
          </p>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Остатки всех товаров в норме
              </div>
            ) : (
              lowStockProducts.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 border border-border/60">
                  <img src={p.image} alt={p.name} className="w-10 h-12 rounded-lg object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-foreground truncate">{p.name}</h4>
                    <span className="text-[11px] text-rose-500 font-bold">Осталось: {p.stock} шт.</span>
                  </div>
                  <Link
                    to={`/admin/products?edit=${p.id}`}
                    className="text-xs font-medium text-gold-dark dark:text-gold-light hover:underline"
                  >
                    Правка
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
