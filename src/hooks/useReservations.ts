import { useState, useCallback, useEffect } from 'react';
import type { Car, Reservation, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { parseLocalDate } from '@/lib/utils';

export const useReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showAllCars, setShowAllCars] = useState(false);
  const [showUserReservations, setShowUserReservations] = useState(false);

  useEffect(() => {
    if (user) {
      api.getReservations()
        .then(setReservations)
        .catch(e => console.error("Error fetching reservations", e));
    }
  }, [user]);

  const openReservationModal = useCallback((car: Car) => {
    setSelectedCar(car);
    setShowReservationModal(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeReservationModal = useCallback(() => {
    setShowReservationModal(false);
    setSelectedCar(null);
    document.body.style.overflow = 'auto';
  }, []);

  const createReservation = useCallback(async (data: Omit<Reservation, 'id' | 'status' | 'createdAt' | 'userId'>) => {
    if (!user) return null;
    try {
      const newReservation = await api.createReservation(data);
      setReservations(prev => [newReservation, ...prev]);
      return newReservation;
    } catch (error) {
      console.error("Failed creating reservation", error);
    }
    return null;
  }, [user]);

  const cancelReservation = useCallback(async (reservationId: string) => {
    try {
      await api.updateReservationStatus(reservationId, 'cancelled');
      setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'cancelled' } : r));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const calculateTotalPrice = useCallback((car: Car, pickupDate: string, returnDate: string, withDriver: boolean) => {
    const start = parseLocalDate(pickupDate);
    const end = parseLocalDate(returnDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const driverCost = withDriver ? 200000 * days : 0;
    return (car.price * days) + driverCost;
  }, []);

  const openAllCars = useCallback(() => {
    setShowAllCars(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeAllCars = useCallback(() => {
    setShowAllCars(false);
    document.body.style.overflow = 'auto';
  }, []);

  const openUserReservations = useCallback(() => {
    setShowUserReservations(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeUserReservations = useCallback(() => {
    setShowUserReservations(false);
    document.body.style.overflow = 'auto';
  }, []);

  return {
    reservations,
    showReservationModal,
    selectedCar,
    showAllCars,
    showUserReservations,
    openReservationModal,
    closeReservationModal,
    createReservation,
    cancelReservation,
    calculateTotalPrice,
    openAllCars,
    closeAllCars,
    openUserReservations,
    closeUserReservations,
  };
};

export const useAdmin = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const refreshData = useCallback(async () => {
    try {
      const [carsData, resData, usersData] = await Promise.all([
        api.getCars(),
        api.getReservations(),
        api.getUsers(),
      ]);
      setCars(carsData);
      setAllReservations(resData);
      setAllUsers(usersData);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    refreshData();
    // Poll every 30 seconds so admin data stays fresh without manual refresh
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Compute stats derived from data
  const stats = {
    totalUsers: allUsers.length,
    totalCars: cars.length,
    totalReservations: allReservations.length,
    totalRevenue: allReservations
      .filter(r => r.status === 'confirmed' || r.status === 'completed')
      .reduce((sum, r) => sum + r.totalPrice, 0),
    pendingReservations: allReservations.filter(r => r.status === 'pending').length,
    confirmedReservations: allReservations.filter(r => r.status === 'confirmed').length,
    completedReservations: allReservations.filter(r => r.status === 'completed').length,
    cancelledReservations: allReservations.filter(r => r.status === 'cancelled').length,
    topCars: Object.values(
      allReservations.reduce((acc: Record<number, { car: Car | undefined; count: number }>, r) => {
        if (!acc[r.carId]) {
          acc[r.carId] = { car: cars.find(c => c.id === r.carId), count: 0 };
        }
        acc[r.carId].count++;
        return acc;
      }, {})
    ).sort((a, b) => b.count - a.count).slice(0, 5),
  };

  const addCar = async (car: Omit<Car, 'id'>) => {
    const newCar = await api.addCar(car);
    setCars(prev => [...prev, newCar]);
    return newCar;
  };

  const deleteCar = async (id: number) => {
    await api.deleteCar(id);
    setCars(prev => prev.filter(c => c.id !== id));
  };

  const updateReservationStatus = async (id: string, status: Reservation['status'], adminMessage?: string) => {
    const updated = await api.updateReservationStatus(id, status, adminMessage);
    setAllReservations(prev => prev.map(r => r.id === id ? updated : r));
  };

  const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
    const updated = await api.updateUserRole(userId, role);
    setAllUsers(prev => prev.map(u => u.id === userId ? updated : u));
  };

  return {
    cars,
    allReservations,
    allUsers,
    stats,
    addCar,
    deleteCar,
    updateReservationStatus,
    updateUserRole,
    refreshData,
  };
};

export const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);

  const refreshCars = async () => {
    try {
      const data = await api.getCars();
      setCars(data);
    } catch (e) {
      console.error("Error fetching cars", e);
    }
  };

  useEffect(() => {
    refreshCars();
  }, []);

  return { cars, refreshCars };
};
