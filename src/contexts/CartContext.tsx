import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product, ProductColor } from "../types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, color: ProductColor, size?: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  discount: number;
  discountPercent: number;
  totalPrice: number;
  freeShippingThreshold: number;
  isFreeShipping: boolean;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("hadidja_cart_v3");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const freeShippingThreshold = 250;

  useEffect(() => {
    localStorage.setItem("hadidja_cart_v3", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: Product,
    color: ProductColor,
    size: string = "",
    quantity: number = 1
  ) => {
    const itemKey = `${product.id}-${color.name}-${size}`;

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === itemKey);

      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }

      return [...prev, { id: itemKey, product, color, size, quantity }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removePromoCode = () => {
    setPromoCode("");
    setDiscountPercent(0);
  };

  const clearCart = () => {
    setCart([]);
    removePromoCode();
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();

    if (clean === "HADIDJA10" || clean === "LUXURY10") {
      setPromoCode(clean);
      setDiscountPercent(10);
      return true;
    }

    if (clean === "VIP20") {
      setPromoCode(clean);
      setDiscountPercent(20);
      return true;
    }

    return false;
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discount = Math.round((subtotal * discountPercent) / 100);
  const totalPrice = Math.max(0, subtotal - discount);
  const isFreeShipping = totalPrice >= freeShippingThreshold;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        discount,
        discountPercent,
        totalPrice,
        freeShippingThreshold,
        isFreeShipping,
        promoCode,
        applyPromoCode,
        removePromoCode
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
