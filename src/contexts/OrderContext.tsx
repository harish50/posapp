import { createContext } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { OfflineDataStore } from '../core/OfflineDataStore.ts';
import { PrintJobManager } from "../core/PrintJobManager.ts";
import type { Order } from '../core/types.ts';

interface OrderContextType {
  orders: Order[];
  orderStatus: { [orderId: string]: string };
  placeOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  syncOrders: () => Promise<void>;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: any }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatus, setOrderStatus] = useState<{ [orderId: string]: string }>({});
  const offlineStore = new OfflineDataStore();
  const printManager = new PrintJobManager();

  useEffect(() => {
    const loadOrders = async () => {
      const loadedOrders = await offlineStore.loadOrders();
      setOrders(loadedOrders);
      const statusMap: { [orderId: string]: string } = {};
      loadedOrders.forEach(o => statusMap[o.id] = o.status);
      setOrderStatus(statusMap);
    };
    loadOrders();
    window.addEventListener('online', () => {
      syncOrders();
    });
  }, []);

  const placeOrder = async (order: Order) => {
    setOrders(prev => [...prev, order]);
    setOrderStatus(prev => ({ ...prev, [order.id]: order.status }));
    await offlineStore.saveOrder(order);
    printManager.addJob(order.id, "kitchen", "high", "kitchen");
    printManager.addJob(order.id, "receipt", "normal", "receipt");
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setOrderStatus(prev => ({ ...prev, [orderId]: status }));
    await offlineStore.updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (status === "Preparing") {
      printManager.addJob(orderId, "bar", "high", "bar");
    }
  };

  const syncOrders = async () => {
    await offlineStore.syncOrders();
    const loadedOrders = await offlineStore.loadOrders();
    setOrders(loadedOrders);
    const statusMap: { [orderId: string]: string } = {};
    loadedOrders.forEach(o => statusMap[o.id] = o.status);
    setOrderStatus(statusMap);
  };

  return (
    <OrderContext.Provider value={{ orders, orderStatus, placeOrder, updateOrderStatus, syncOrders }}>
      {children}
    </OrderContext.Provider>
  );
}
