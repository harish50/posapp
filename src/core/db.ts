import {type DBSchema, openDB} from "idb";
import type {Item} from "./types.ts";

export interface POSDB extends DBSchema {
  items: {
    key: string;
    value: Item;
    indexes: { "by-name": string };
  }
}

export const dbPromise = openDB<POSDB>('pos-db', 1, {
  upgrade(db) {
    const itemStores = db.createObjectStore("items", {keyPath: "id"});
    itemStores.createIndex("by-name", "name");
  }
})