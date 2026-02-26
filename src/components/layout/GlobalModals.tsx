import { useState } from 'react';
import { useReservationsContext } from '@/contexts/ReservationsContext';
import type { Car } from '@/types';
import ReservationModal from '@/components/modals/ReservationModal';
import AuthModal from '@/components/modals/AuthModal';
import ChatWidget from '@/components/chat/ChatWidget';

export function GlobalModals() {
    const [showAuth, setShowAuth] = useState(false);
    const {
        showReservationModal,
        selectedCar,
        selectedTour,
        closeReservationModal,
        createReservation,
        calculateTotalPrice,
    } = useReservationsContext();

    const handleReservationSubmit = (data: {
        car: Car;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        pickupDate: string;
        returnDate: string;
        pickupLocation: string;
        withDriver: boolean;
        additionalNotes: string;
        totalPrice: number;
        tourName?: string;
        tourDate?: string;
    }) => {
        createReservation({
            carId: data.car.id,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            pickupDate: data.pickupDate,
            returnDate: data.returnDate,
            pickupLocation: data.pickupLocation,
            withDriver: data.withDriver,
            additionalNotes: data.additionalNotes,
            totalPrice: data.totalPrice,
            tourName: data.tourName,
            tourDate: data.tourDate,
        });
    };

    return (
        <>
            <ReservationModal
                isOpen={showReservationModal}
                onClose={closeReservationModal}
                onOpenAuth={() => setShowAuth(true)}
                car={selectedCar}
                initialTourName={selectedTour ?? undefined}
                onSubmit={handleReservationSubmit}
                calculateTotalPrice={calculateTotalPrice}
            />

            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
            />

            <ChatWidget />
        </>
    );
}
