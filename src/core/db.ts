import {type DBSchema, openDB} from "idb";
import type {Item, CartItem, Order} from "./types";

export interface POSDB extends DBSchema {
  items: {
    key: string;
    value: Item;
    indexes: { "by-name": string };
  },
  cart: {
    key: string;
    value: CartItem[];
  },
  // @ts-ignore
  orders: {
    key: string;
    value: Order;
    indexes: { "by-status": string; "by-createdAt": string; "by-synced": boolean };
  }
}

export const dbPromise = openDB<POSDB>('pos-db', 1, {
  upgrade(db) {
    const itemStores = db.createObjectStore("items", {keyPath: "itemID"});
    itemStores.createIndex("by-name", "itemName");
    if (!db.objectStoreNames.contains("cart")) {
      db.createObjectStore("cart");
    }
    if (!db.objectStoreNames.contains("orders")) {
      const orderStore = db.createObjectStore("orders", {keyPath: "id"});
      orderStore.createIndex("by-status", "status");
      orderStore.createIndex("by-createdAt", "createdAt");
      orderStore.createIndex("by-synced", "synced", { unique: false } );
    }
  }
})