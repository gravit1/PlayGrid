export interface Game {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  releaseDate: string;
  thumbnailUrl: string;
  category: string;
  developer: string;
  publisher: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistItem {
  id: number;
  gameId: number;
  title: string;
  price: number;
  thumbnailUrl: string;
  category: string;
  developer: string;
  addedAt: string;
}

export interface LibraryItem {
  id: number;
  userId: number;
  gameId: number;
  purchasePrice: number;
  purchaseDate: string;
}

export interface Review {
  id: number;
  userId: number;
  username?: string;
  gameId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  gameId: number;
  gameTitle: string;
  originalPrice: number;
  discountPercentage: number;
  finalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  items: OrderItem[];
  createdAt: string;
}

