import { createContext } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { OfflineDataStore } from '../core/OfflineDataStore.ts';
import type { CartItem } from '../core/types.ts';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, options?: { size?: string; addons?: string[]; specialRequest?: string }) => void;
  updateCartItem: (id: string, changes: Partial<CartItem>) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: any }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const offlineStore = new OfflineDataStore();

  // Load cart from IndexedDB on mount
  useEffect(() => {
    offlineStore.loadCart().then((loadedCart) => {
      if (loadedCart?.length) setCart(loadedCart);
    });
  }, []);

  // Save cart to IndexedDB whenever it changes
  useEffect(() => {
    offlineStore.saveCart(cart);
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.size === item.size && JSON.stringify(i.addons) === JSON.stringify(item.addons) && i.specialRequest === item.specialRequest);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string, options?: { size?: string; addons?: string[]; specialRequest?: string }) => {
    setCart(prev => prev.filter(i => {
      if (i.id !== id) return true;
      // If options provided, match customisation
      if (options) {
        if (options.size && i.size !== options.size) return true;
        if (options.addons && JSON.stringify(i.addons) !== JSON.stringify(options.addons)) return true;
        if (options.specialRequest && i.specialRequest !== options.specialRequest) return true;
        return false;
      }
      // If no options, remove all with id
      return false;
    }));
  };

  const updateCartItem = (id: string, changes: Partial<CartItem>) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, ...changes } : i));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartItem }}>
      {children}
    </CartContext.Provider>
  );
}
