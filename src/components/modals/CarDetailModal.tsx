import { X, Users, DoorOpen, Settings, Fuel, CalendarDays, Check, ChevronRight, Gauge } from 'lucide-react';
import type { Car } from '@/types';

interface CarDetailModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onReserve: (car: Car) => void;
}

export default function CarDetailModal({ car, isOpen, onClose, onReserve }: CarDetailModalProps) {
  if (!isOpen || !car) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  const specs = [
    { icon: Users,        label: 'Pasajeros',    value: `${car.seats}` },
    { icon: DoorOpen,     label: 'Puertas',      value: `${car.doors}` },
    { icon: Settings,     label: 'Transmisión',  value: car.transmission },
    { icon: Fuel,         label: 'Combustible',  value: car.fuel || 'Gasolina' },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto glass-card rounded-3xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Hero Image */}
        <div className="relative h-52 sm:h-72 overflow-hidden rounded-t-3xl">
          <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="glass px-3 py-1 rounded-full text-white text-xs font-medium">
              {car.category}
            </span>
            {car.year && (
              <span className="glass px-3 py-1 rounded-full text-white/80 text-xs flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> {car.year}
              </span>
            )}
          </div>

          {/* Not available */}
          {!car.available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="glass px-6 py-3 rounded-full text-white font-semibold">No Disponible</span>
            </div>
          )}

          {/* Price */}
          <div className="absolute bottom-5 left-6 right-16">
            <p className="text-white/50 text-xs mb-0.5">Precio por día</p>
            <p className="text-red-500 font-bold text-2xl sm:text-3xl leading-none">
              {formatPrice(car.price)}
              <span className="text-white/40 text-sm font-normal ml-1">/día</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Name */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{car.name}</h2>

          {/* Description */}
          {car.description && (
            <p className="text-white/65 text-sm sm:text-base leading-relaxed">{car.description}</p>
          )}

          {/* Specs grid */}
          <div>
            <h3 className="text-white/50 text-xs uppercase tracking-widest mb-3">Especificaciones</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="glass rounded-2xl p-4 text-center">
                  <div className="w-9 h-9 rounded-xl bg-red-600/15 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4 h-4 text-red-500" />
                  </div>
                  <p className="text-white/40 text-xs mb-1">{label}</p>
                  <p className="text-white font-semibold text-sm leading-tight">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div>
              <h3 className="text-white/50 text-xs uppercase tracking-widest mb-3">Características</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {car.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 glass rounded-xl px-3 py-2.5">
                    <div className="w-5 h-5 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-red-500" />
                    </div>
                    <span className="text-white/80 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price summary */}
          <div className="glass rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs">Precio estimado (1 día)</p>
              <p className="text-red-500 font-bold text-xl">{formatPrice(car.price)}</p>
            </div>
            <Gauge className="w-6 h-6 text-white/20" />
          </div>

          {/* CTA */}
          <button
            onClick={() => { onReserve(car); onClose(); }}
            disabled={!car.available}
            className="w-full btn-primary flex items-center justify-center gap-2 text-base disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{car.available ? 'Reservar Ahora' : 'No Disponible'}</span>
            {car.available && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
