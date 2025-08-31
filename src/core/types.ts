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