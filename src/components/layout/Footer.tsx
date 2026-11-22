import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, ShieldCheck, Truck, RefreshCw, Sparkles } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/40 mt-20 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features / Advantages Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center text-gold-primary shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-foreground mb-1">Натуральный шёлк гирбишин</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Плотные, не скользящие ткани с благородным жемчужным переливом, привезённые из лучших текстильных фабрик.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center text-gold-primary shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-foreground mb-1">Бесплатная доставка по Душанбе</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                При заказе от 250 сомони курьер привезёт заказ в течение 24 часов в любую точку города.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center text-gold-primary shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-foreground mb-1">Примерка перед оплатой</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Вы можете примерить понравившиеся модели при курьере и оплатить только то, что идеально вам подошло.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Brand Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full border border-gold-primary/40 bg-card flex items-center justify-center text-gold-primary font-serif font-bold text-lg">
                H
              </div>
              <span className="font-serif font-bold text-xl tracking-widest text-foreground">
                HADIDJA
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Премиальный бутик скромной женской моды в Душанбе. Шелковые платки, палантины, турецкие хиджабы и дизайнерские абайи.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/hadidja_shop_tj/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold-primary hover:border-gold-primary transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/992886006528"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-500 hover:border-emerald-500 transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h5 className="font-serif font-bold text-sm tracking-wider uppercase text-foreground mb-4">
              Коллекции
            </h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="/#catalog" className="hover:text-gold-primary transition-colors">Шёлковые платки</a></li>
              <li><a href="/#catalog" className="hover:text-gold-primary transition-colors">Палантины & Шарфы</a></li>
              <li><a href="/#catalog" className="hover:text-gold-primary transition-colors">Турецкие хиджабы</a></li>
              <li><a href="/#dresses" className="hover:text-gold-primary transition-colors">Платья & Абайи</a></li>
              <li><a href="/#catalog" className="hover:text-gold-primary transition-colors">Подарочные наборы</a></li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="font-serif font-bold text-sm tracking-wider uppercase text-foreground mb-4">
              Покупателям
            </h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/cart" className="hover:text-gold-primary transition-colors">Корзина покупок</Link></li>
              <li><Link to="/profile" className="hover:text-gold-primary transition-colors">Личный кабинет</Link></li>
              <li><Link to="/profile/orders" className="hover:text-gold-primary transition-colors">Мои заказы</Link></li>
              <li><Link to="/login" className="hover:text-gold-primary transition-colors">Вход / Регистрация</Link></li>
              <li><Link to="/admin" className="hover:text-gold-primary transition-colors">Панель администратора</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h5 className="font-serif font-bold text-sm tracking-wider uppercase text-foreground mb-4">
              Контакты бутика
            </h5>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-primary shrink-0 mt-0.5" />
                <span>г. Душанбе, Республика Таджикистан</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="https://wa.me/992886006528" target="_blank" rel="noreferrer" className="hover:underline text-foreground font-semibold">
                  +992 88 600 65 28
                </a>
              </div>
              <p className="text-[11px] text-muted-foreground/80 pt-1">
                Ежедневно с 09:00 до 21:00 без выходных.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} HADIDJA SHOP. Все права защищены.</p>
          <p className="flex items-center gap-2">
            <span>Powered by Supabase & React</span>
            <span>·</span>
            <span className="text-gold-primary font-medium">Haute Couture</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
