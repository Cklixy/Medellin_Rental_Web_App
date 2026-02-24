export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'admin' | 'user';
  createdAt: string;
  avatar?: string;
}

export interface Car {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  seats: number;
  doors: number;
  transmission: 'Automática' | 'Manual';
  features: string[];
  description: string;
  available: boolean;
  fuel?: string;
  year?: number;
}

export interface Reservation {
  id: string;
  userId: string;
  carId: number;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  withDriver: boolean;
  additionalNotes?: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  adminMessage?: string;
  tourName?: string;
  tourDate?: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface Quote {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'attended';
  createdAt: string;
}

// Este archivo anteriormente contenía `class Database` que persistía a localStorage.
// Ha sido convertido sólo en una definición de tipos para integrarse con `fetch` del backend.
