export interface Item {
  itemID: string;
  itemName: string;
  itemPrice: number;
  category?: string;
  imageUrl?: string;
  stock?: number;
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  size?: string;
  addons?: string[];
  specialRequest?: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: string;
  synced: string; // "true" | "false"
  syncStatus: string;
  lastModified: number;
  lastSynced?: number;
  createdAt: string;
}

export type PrintDestination = "kitchen" | "bar" | "receipt";
export type PrintStatus = "pending" | "printing" | "success" | "failed";
export type PrintPriority = "high" | "normal" | "low";

export interface PrintJob {
  id: string;
  orderId: string;
  destination: PrintDestination;
  status: PrintStatus;
  priority: PrintPriority;
  attempts: number;
  createdAt: string;
  lastError?: string;
  templateType: string;
}
