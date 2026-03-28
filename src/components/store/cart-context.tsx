"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { CartItem } from "@/types/store";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantLabel?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantLabel?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "shine-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return {
      items,
      isOpen,
      total,
      addItem: (item) => {
        setItems((current) => {
          const existingIndex = current.findIndex(
            (entry) =>
              entry.productId === item.productId &&
              entry.variantLabel === item.variantLabel
          );

          if (existingIndex >= 0) {
            return current.map((entry, index) =>
              index === existingIndex
                ? { ...entry, quantity: entry.quantity + item.quantity }
                : entry
            );
          }

          return [...current, item];
        });
        setIsOpen(true);
      },
      removeItem: (productId, variantLabel) => {
        setItems((current) =>
          current.filter(
            (entry) =>
              !(
                entry.productId === productId && entry.variantLabel === variantLabel
              )
          )
        );
      },
      updateQuantity: (productId, quantity, variantLabel) => {
        setItems((current) =>
          current.flatMap((entry) => {
            if (
              entry.productId === productId &&
              entry.variantLabel === variantLabel
            ) {
              if (quantity <= 0) {
                return [];
              }
              return [{ ...entry, quantity }];
            }
            return [entry];
          })
        );
      },
      clearCart: () => setItems([]),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false)
    };
  }, [isOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
