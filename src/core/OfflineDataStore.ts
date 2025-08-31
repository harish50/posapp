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
      tx.store.put(item);
    }
    await tx.done;
  }

  async loadItems(): Promise<Item[]> {
    if(this.isOnline) {
      try {
        const res = await fetch('/api/Restaurant/items');        const data = await res.json()
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
}