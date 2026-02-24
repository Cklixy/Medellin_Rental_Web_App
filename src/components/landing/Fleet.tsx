import { useState } from 'react';
import { Users, Settings, ChevronRight, Check } from 'lucide-react';
import type { Car } from '@/types';

interface FleetProps {
  cars: Car[];
  onReserve: (car: Car) => void;
  onViewAll: () => void;
}

const Fleet = ({ cars, onReserve, onViewAll }: FleetProps) => {
  const [hoveredCar, setHoveredCar] = useState<number | null>(null);

  // Show only first 4 cars on homepage
  const featuredCars = cars.slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="fleet" className="relative w-full py-24 bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.1)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 section-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <span className="text-red-500 text-sm font-medium">Nuestra Flota</span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            Vehículos <span className="text-gradient-red">Premium</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Descubre nuestra exclusiva colección de vehículos de lujo. 
            Cada auto está meticulosamente mantenido para ofrecerte la mejor experiencia.
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {featuredCars.map((car, index) => (
            <div
              key={car.id}
              className="group relative glass-card-hover rounded-3xl overflow-hidden transition-all duration-700"
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCar(car.id)}
              onMouseLeave={() => setHoveredCar(null)}
            >
              {/* Image */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-medium">{car.category}</span>
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-red-600 px-4 py-2 rounded-xl">
                  <span className="text-white font-bold">{formatPrice(car.price)}</span>
                  <span className="text-white/70 text-xs">/día</span>
                </div>

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
                  hoveredCar === car.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <button
                    onClick={() => onReserve(car)}
                    className="btn-primary flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <span>Reservar Ahora</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{car.name}</h3>
                
                {/* Specs */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{car.seats} pasajeros</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Settings className="w-4 h-4" />
                    <span>{car.transmission}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {car.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-1 glass px-2 py-1 rounded-lg"
                    >
                      <Check className="w-3 h-3 text-red-500" />
                      <span className="text-white/70 text-xs">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => onReserve(car)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <span>Reservar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={onViewAll}
            className="btn-outline inline-flex items-center gap-2"
          >
            <span>Ver Toda la Flota</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Fleet;
