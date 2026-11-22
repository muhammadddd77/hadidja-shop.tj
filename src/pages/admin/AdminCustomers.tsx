import React, { useState, useEffect, useMemo } from "react";
import { Users, Search, ShieldCheck, UserCheck, Mail, Phone, Calendar } from "lucide-react";
import { userService } from "../../services/userService";
import { Profile } from "../../types";
import { Loader, EmptyState } from "../../components/common/Loader";

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to load customers", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
    );
  }, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-gold-dark dark:text-gold-light">
          Пользователи
        </span>
        <h1 className="font-serif text-3xl font-bold text-foreground mt-1">
          Клиенты & Аккаунты ({customers.length})
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          База зарегистрированных пользователей интернет-магазина HADIDJA SHOP
        </p>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по имени, email или телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:border-gold-primary transition-colors"
          />
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <Loader text="Загрузка списка клиентов..." />
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          title="Клиенты не найдены"
          description="По вашему запросу не найдено зарегистрированных пользователей"
          actionLabel="Сбросить поиск"
          onAction={() => setSearchQuery("")}
        />
      ) : (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Клиент</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Телефон</th>
                  <th className="py-3.5 px-4">Роль</th>
                  <th className="py-3.5 px-4">Дата регистрации</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-primary/10 text-gold-dark dark:text-gold-light font-bold flex items-center justify-center text-xs">
                        {cust.full_name?.charAt(0) || cust.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-foreground">
                        {cust.full_name || "Покупатель"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-foreground font-mono">
                      {cust.email}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      {cust.phone || "—"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        cust.role === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {cust.role === "admin" && <ShieldCheck className="w-3 h-3" />}
                        {cust.role === "admin" ? "Администратор" : "Покупатель"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      {cust.created_at ? new Date(cust.created_at).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
