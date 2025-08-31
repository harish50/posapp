import {dbPromise} from "../core/db.ts";
import type {Item} from "../core/types.ts";

export class OfflineDataStore {
  isOnline = navigator.onLine;

  constructor() {
    window.addEventListener("online", () => {
      this.isOnline = true;
    });
    window.addEventListener("offline", () => {
      this.isOnline = false;
    })
  }


  async saveItems(items: Item[]): Promise<void> {
    const db = await dbPromise;
    const tx = db.transaction("items", "readwrite");
    for (const item of items) {
      await tx.store.put(item);
    }
    await tx.done;
  }

  async loadItems(): Promise<Item[]> {
    if(this.isOnline) {
      try {
        const res = await fetch('/api/Restaurant/items');
        const data = await res.json()
        this.saveItems(data)
        return data;
      } catch {
        return await this.getItems()
      }
    } else {
      return await this.getItems()
    }
  }

  async getItems(): Promise<Item[]> {
    const db = await dbPromise;
    return db.getAll("items");
  }

  async saveCart(cart: any[]): Promise<void> {
    const db = await dbPromise;
    const tx = db.transaction("cart", "readwrite");
    await tx.store.put(cart, "current");
    await tx.done;
  }

  async loadCart(): Promise<any[]> {
    const db = await dbPromise;
    return (await db.get("cart", "current")) ?? [];
  }

  async searchItemsByName(name: string): Promise<Item[]> {
    const db = await dbPromise;
    const tx = db.transaction("items", "readonly");
    const index = tx.store.index("by-name");
    const lower = name.toLowerCase();
    const results: Item[] = [];
    let cursor = await index.openCursor();
    while (cursor) {
      if (cursor.value?.itemName.toLowerCase().includes(lower)) {
        results.push(cursor.value);
      }
      cursor = await cursor.continue();
    }
    return results;
  }

  async saveOrder(order: any): Promise<void> {
    const db = await dbPromise;
    const tx = db.transaction("orders", "readwrite");
    await tx.store.put(order);
    await tx.done;
  }

  async loadOrders(): Promise<any[]> {
    const db = await dbPromise;
    return await db.getAll("orders");
  }

  async syncOrders(): Promise<void> {
    const db = await dbPromise;
    const tx = db.transaction("orders", "readwrite");
    const index = tx.store.index("by-synced");
    let cursor = await index.openCursor(false);
    while (cursor) {
      const order = cursor.value;
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
        order.synced = true;
        order.status = 'Preparing';
        await cursor.update(order);
      } catch (e) {
        // Leave as unsynced
      }
      cursor = await cursor.continue();
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const db = await dbPromise;
    const order = await db.get("orders", orderId);
    if (order) {
      order.status = status;
      const tx = db.transaction("orders", "readwrite");
      await tx.store.put(order, orderId);
      await tx.done;
    }
  }
}