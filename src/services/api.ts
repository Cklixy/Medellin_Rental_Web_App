import type { Car, Reservation, User, Quote } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('crm_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const api = {
    // Cars
    getCars: async (): Promise<Car[]> => {
        const resp = await fetch(`${API_URL}/cars`);
        if (!resp.ok) throw new Error('Error fetching cars');
        return resp.json();
    },

    addCar: async (car: Omit<Car, 'id'>): Promise<Car> => {
        const resp = await fetch(`${API_URL}/cars`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(car)
        });
        if (!resp.ok) throw new Error('Error adding car');
        return resp.json();
    },

    deleteCar: async (id: number): Promise<void> => {
        const resp = await fetch(`${API_URL}/cars/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!resp.ok) throw new Error('Error deleting car');
    },

    updateCar: async (id: number, car: Partial<Omit<Car, 'id'>>): Promise<Car> => {
        const resp = await fetch(`${API_URL}/cars/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(car)
        });
        if (!resp.ok) throw new Error('Error updating car');
        return resp.json();
    },

    // Users
    getUsers: async (): Promise<User[]> => {
        const resp = await fetch(`${API_URL}/users`, { headers: getHeaders() });
        if (!resp.ok) throw new Error('Error fetching users');
        return resp.json();
    },

    updateUserRole: async (id: string, role: 'admin' | 'user'): Promise<User> => {
        const resp = await fetch(`${API_URL}/users/${id}/role`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ role })
        });
        if (!resp.ok) throw new Error('Error updating role');
        return resp.json();
    },

    // Reservations
    getReservations: async (): Promise<Reservation[]> => {
        const resp = await fetch(`${API_URL}/reservations`, { headers: getHeaders() });
        if (!resp.ok) throw new Error('Error fetching reservations');
        return resp.json();
    },

    createReservation: async (data: Omit<Reservation, 'id' | 'status' | 'createdAt' | 'userId'>): Promise<Reservation> => {
        const resp = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!resp.ok) throw new Error('Error creating reservation');
        return resp.json();
    },

    updateReservationStatus: async (id: string, status: Reservation['status'], adminMessage?: string): Promise<Reservation> => {
        const resp = await fetch(`${API_URL}/reservations/${id}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status, adminMessage: adminMessage ?? '' })
        });
        if (!resp.ok) throw new Error('Error updating reservation status');
        return resp.json();
    },

    // Quotes
    submitQuote: async (data: Omit<Quote, 'id' | 'status' | 'createdAt'>): Promise<Quote> => {
        const resp = await fetch(`${API_URL}/quotes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!resp.ok) throw new Error('Error submitting quote');
        return resp.json();
    },

    getQuotes: async (): Promise<Quote[]> => {
        const resp = await fetch(`${API_URL}/quotes`, { headers: getHeaders() });
        if (!resp.ok) throw new Error('Error fetching quotes');
        return resp.json();
    },

    updateQuoteStatus: async (id: number, status: 'new' | 'attended'): Promise<Quote> => {
        const resp = await fetch(`${API_URL}/quotes/${id}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        if (!resp.ok) throw new Error('Error updating quote');
        return resp.json();
    },

    deleteQuote: async (id: number): Promise<void> => {
        const resp = await fetch(`${API_URL}/quotes/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!resp.ok) throw new Error('Error deleting quote');
    },
};
