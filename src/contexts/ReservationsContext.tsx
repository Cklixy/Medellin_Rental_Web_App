import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Car, Reservation } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

interface ReservationsContextType {
  // State
  cars: Car[];
  reservations: Reservation[];
  showReservationModal: boolean;
  selectedCar: Car | null;
  selectedTour: string | null;
  // Actions
  openReservationModal: (car: Car, tourName?: string) => void;
  closeReservationModal: () => void;
  createReservation: (data: Omit<Reservation, 'id' | 'status' | 'createdAt' | 'userId'>) => Promise<Reservation | null>;
  cancelReservation: (reservationId: string) => Promise<void>;
  calculateTotalPrice: (car: Car, pickupDate: string, returnDate: string, withDriver: boolean) => number;
  refreshCars: () => Promise<void>;
}

const ReservationsContext = createContext<ReservationsContextType | undefined>(undefined);

export function ReservationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [cars, setCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedTour, setSelectedTour] = useState<string | null>(null);

  const refreshCars = useCallback(async () => {
    try {
      const data = await api.getCars();
      setCars(data);
    } catch (e) {
      console.error('Error fetching cars', e);
    }
  }, []);

  useEffect(() => {
    refreshCars();
  }, [refreshCars]);

  useEffect(() => {
    if (user) {
      api.getReservations()
        .then(setReservations)
        .catch(e => console.error('Error fetching reservations', e));
    }
  }, [user]);

  const openReservationModal = useCallback((car: Car, tourName?: string) => {
    setSelectedCar(car);
    setSelectedTour(tourName ?? null);
    setShowReservationModal(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeReservationModal = useCallback(() => {
    setShowReservationModal(false);
    setSelectedCar(null);
    setSelectedTour(null);
    document.body.style.overflow = 'auto';
  }, []);

  const createReservation = useCallback(async (data: Omit<Reservation, 'id' | 'status' | 'createdAt' | 'userId'>) => {
    if (!user) return null;
    try {
      const newReservation = await api.createReservation(data);
      setReservations(prev => [newReservation, ...prev]);
      return newReservation;
    } catch (error) {
      console.error('Failed creating reservation', error);
    }
    return null;
  }, [user]);

  const cancelReservation = useCallback(async (reservationId: string) => {
    try {
      await api.updateReservationStatus(reservationId, 'cancelled');
      setReservations(prev =>
        prev.map(r => r.id === reservationId ? { ...r, status: 'cancelled' } : r)
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

  const calculateTotalPrice = useCallback((car: Car, pickupDate: string, returnDate: string, withDriver: boolean) => {
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const driverCost = withDriver ? 200000 * days : 0;
    return (car.price * days) + driverCost;
  }, []);

  return (
    <ReservationsContext.Provider value={{
      cars,
      reservations,
      showReservationModal,
      selectedCar,
      selectedTour,
      openReservationModal,
      closeReservationModal,
      createReservation,
      cancelReservation,
      calculateTotalPrice,
      refreshCars,
    }}>
      {children}
    </ReservationsContext.Provider>
  );
}

export function useReservationsContext() {
  const context = useContext(ReservationsContext);
  if (!context) throw new Error('useReservationsContext must be used within ReservationsProvider');
  return context;
}
