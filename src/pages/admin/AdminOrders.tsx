import React, { useState, useEffect, useMemo } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  User, 
  MapPin, 
  Phone,
  X
} from "lucide-react";
import { orderService } from "../../services/orderService";
import { Order } from "../../types";
import { Loader, EmptyState } from "../../components/common/Loader";

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected Order for detail modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load admin orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: any) => {
    try {
      setIsUpdatingStatus(true);
      const updated = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Ошибка при обновлении статуса");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.includes(q) ||
          o.id.toString().includes(q) ||
          (o.customer_address && o.customer_address.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter);
    }

    return list;
  }, [orders, searchQuery, statusFilter]);

  const getWhatsAppMessageLink = (order: Order) => {
    const clean = order.customer_phone.replace(/\D/g, "");
    let text = `Ассалому алейкум, ${order.customer_name}! Вас приветствует администратор HADIDJA SHOP по поводу вашего заказа #${order.id}.\n`;
    text += `Статус заказа: ${order.status}.\n`;
    text += `Сумма к оплате: ${order.total_price} сомони.\n`;
    text += `Адрес: ${order.customer_address}.`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">
            CRM & Продажи
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground mt-1">
            Заказы Покупателей ({orders.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Контроль статусов доставки, связь с покупателями через WhatsApp и детальный состав каждого заказа
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по номеру заказа, имени клиента, телефону или адресу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary transition-colors"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary transition-colors"
          >
            <option value="all">Все статусы ({orders.length})</option>
            <option value="Новый">Новые</option>
            <option value="В обработке">В обработке</option>
            <option value="В доставке">В доставке</option>
            <option value="Выполнен">Выполненные</option>
            <option value="Отменен">Отмененные</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <Loader text="Загрузка списка заказов..." />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title="Заказы не найдены"
          description="По вашим критериям поиска нет ни одного заказа"
          actionLabel="Сбросить фильтры"
          onAction={() => {
            setSearchQuery("");
            setStatusFilter("all");
          }}
        />
      ) : (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">№ Заказа</th>
                  <th className="py-3.5 px-4">Клиент</th>
                  <th className="py-3.5 px-4">Телефон</th>
                  <th className="py-3.5 px-4">Адрес доставки</th>
                  <th className="py-3.5 px-4">Сумма</th>
                  <th className="py-3.5 px-4">Дата</th>
                  <th className="py-3.5 px-4">Статус</th>
                  <th className="py-3.5 px-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground font-serif">
                      #{ord.id}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {ord.customer_name}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      {ord.customer_phone}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-muted-foreground" title={ord.customer_address}>
                      {ord.customer_address}
                    </td>

                    <td className="py-3.5 px-4 font-serif font-bold text-foreground">
                      {ord.total_price} TJS
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      {new Date(ord.created_at).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                          ord.status === "Новый"
                            ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900"
                            : ord.status === "В обработке"
                            ? "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900"
                            : ord.status === "В доставке"
                            ? "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900"
                            : ord.status === "Выполнен"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900"
                            : "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900"
                        }`}
                      >
                        <option value="Новый">Новый</option>
                        <option value="В обработке">В обработке</option>
                        <option value="В доставке">В доставке</option>
                        <option value="Выполнен">Выполнен</option>
                        <option value="Отменен">Отменен</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      <a
                        href={getWhatsAppMessageLink(ord)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 p-1.5 rounded-lg text-whatsapp hover:bg-whatsapp/10 transition-colors"
                        title="Написать в WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Подробнее"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Заказ #{selectedOrder.id}
                </h3>
                <span className="text-xs text-muted-foreground">
                  от {new Date(selectedOrder.created_at).toLocaleString("ru-RU")}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Customer Info Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
                <div className="space-y-1">
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Покупатель</div>
                  <div className="text-sm font-bold text-foreground">{selectedOrder.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{selectedOrder.customer_phone}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Доставка & Оплата</div>
                  <div className="text-xs text-foreground">{selectedOrder.customer_address}</div>
                  <div className="text-xs text-gold-dark dark:text-gold-light font-medium">{selectedOrder.payment_method}</div>
                </div>

                {selectedOrder.notes && (
                  <div className="sm:col-span-2 pt-2 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground font-semibold">Комментарий клиента: </span>
                    <span className="italic text-foreground">{selectedOrder.notes}</span>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="font-serif text-base font-bold text-foreground">
                  Состав заказа
                </h4>

                <div className="space-y-2">
                  {selectedOrder.order_items?.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                      <img
                        src={it.image || "/images/product-01.jpg"}
                        alt={it.product_name}
                        className="w-12 h-14 rounded-lg object-cover bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">{it.product_name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          Цвет: {it.color || "Стандарт"} · {it.size || "120x120"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-serif font-bold text-foreground">{it.price * it.quantity} TJS</div>
                        <div className="text-[10px] text-muted-foreground">{it.quantity} шт. × {it.price} TJS</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Action */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">Статус заказа:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs font-bold"
                  >
                    <option value="Новый">Новый</option>
                    <option value="В обработке">В обработке</option>
                    <option value="В доставке">В доставке</option>
                    <option value="Выполнен">Выполнен</option>
                    <option value="Отменен">Отменен</option>
                  </select>
                </div>

                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">Итого к оплате:</span>
                  <span className="font-serif text-2xl font-bold text-foreground">{selectedOrder.total_price} TJS</span>
                </div>
              </div>

              {/* WhatsApp direct button */}
              <a
                href={getWhatsAppMessageLink(selectedOrder)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-2xl bg-whatsapp text-white text-xs font-semibold uppercase tracking-wider hover:bg-whatsapp-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Связаться с покупателем в WhatsApp</span>
              </a>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
