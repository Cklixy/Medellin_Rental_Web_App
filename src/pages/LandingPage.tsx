import { useNavigate } from 'react-router-dom';
import { useReservationsContext } from '../contexts/ReservationsContext';
import Hero from '../components/landing/Hero';
import Fleet from '../components/landing/Fleet';
import Services from '../components/landing/Services';
import Tours from '../components/landing/Tours';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
    const navigate = useNavigate();
    const { cars, openReservationModal } = useReservationsContext();

    const handleBookTour = (tourName: string) => {
        const available = cars.find(c => c.available);
        if (available) {
            openReservationModal(available, tourName);
        } else {
            navigate('/fleet');
        }
    };

    const handleHeroReserve = () => {
        if (cars.length > 0) {
            openReservationModal(cars[0]);
        }
    };

    return (
        <div className="w-full">
            <Hero onViewFleet={() => navigate('/fleet')} onReserve={handleHeroReserve} />
            <Fleet
                cars={cars}
                onReserve={openReservationModal}
                onViewAll={() => navigate('/fleet')}
            />
            <Services />
            <Tours onBookTour={handleBookTour} />
            <Contact />
            <Footer />
        </div>
    );
}
