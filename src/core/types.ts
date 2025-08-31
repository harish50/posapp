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
  synced: boolean;
  createdAt: string;
}
