import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, Users, Settings, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { useReservationsContext } from '@/contexts/ReservationsContext';
import type { Car } from '@/types';

const categories = [
  'Todos', 'Sedán de Lujo', 'SUV Premium', 'Deportivo', 'Convertible',
  'Ultra Lujo', 'Super SUV', 'Supercar', 'Gran Turismo', 'Eléctrico', 'SUV Deportivo',
];

export default function FleetPage() {
  const navigate = useNavigate();
  const { cars, openReservationModal } = useReservationsContext();

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filteredCars = useMemo(() => {
    return cars.filter((car: Car) => {
      const matchesCategory = selectedCategory === 'Todos' || car.category === selectedCategory;
      const matchesSearch =
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.category.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesPrice = true;
      if (priceRange === 'low') matchesPrice = car.price < 1000000;
      else if (priceRange === 'medium') matchesPrice = car.price >= 1000000 && car.price < 2000000;
      else if (priceRange === 'high') matchesPrice = car.price >= 2000000;

      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [cars, selectedCategory, searchQuery, priceRange]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(220,38,38,0.1)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Volver</span>
          </button>

          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
            <span className="text-red-500 text-sm font-medium">Nuestra Flota</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            Flota <span className="text-red-500">Completa</span>
          </h1>
          <p className="text-white/50">
            {filteredCars.length} vehículo{filteredCars.length !== 1 ? 's' : ''} disponible{filteredCars.length !== 1 ? 's' : ''} de {cars.length}
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-5 mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar vehículo..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
            />
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-white/40 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white'
                    : 'glass text-white/70 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white/50 text-sm">Precio:</span>
            {[
              { key: 'all', label: 'Todos' },
              { key: 'low', label: '< $1M' },
              { key: 'medium', label: '$1M – $2M' },
              { key: 'high', label: '> $2M' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setPriceRange(opt.key as typeof priceRange)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  priceRange === opt.key
                    ? 'bg-red-600/20 text-red-500 border border-red-500/30'
                    : 'glass text-white/50 hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-white/20 text-7xl mb-4">🚗</div>
            <h3 className="text-white font-semibold text-xl mb-2">No se encontraron vehículos</h3>
            <p className="text-white/40">Intenta con otros filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car: Car, index: number) => (
              <div
                key={car.id}
                className="group glass-card-hover rounded-2xl overflow-hidden transition-all duration-500"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3 glass px-3 py-1 rounded-full">
                    <span className="text-white text-xs font-medium">{car.category}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-red-600 px-3 py-1.5 rounded-xl">
                    <span className="text-white font-bold text-sm">{formatPrice(car.price)}</span>
                    <span className="text-white/70 text-xs">/día</span>
                  </div>

                  {!car.available && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="text-white font-semibold">No Disponible</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-1">{car.name}</h3>
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">{car.description}</p>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-1.5 text-white/50 text-xs">
                      <Users className="w-3.5 h-3.5" />
                      <span>{car.seats} pasajeros</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/50 text-xs">
                      <Settings className="w-3.5 h-3.5" />
                      <span>{car.transmission}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {car.features.slice(0, 3).map((feature) => (
                      <div key={feature} className="flex items-center gap-1 glass px-2 py-0.5 rounded-lg">
                        <Check className="w-3 h-3 text-red-500" />
                        <span className="text-white/60 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => car.available && openReservationModal(car)}
                    disabled={!car.available}
                    className="w-full btn-primary flex items-center justify-center gap-2 text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Reservar Ahora</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
