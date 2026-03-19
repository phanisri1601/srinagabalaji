export interface User {
  id: string;
  name: string;
  phone: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'morning' | 'evening';
  isSpecial?: boolean;
  image?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  user: User;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready';
  createdAt: Date;
  paymentMethod: 'upi';
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
