import { useState, useMemo } from 'react';
import { X, Filter, Search, Users, Fuel, Settings, ChevronRight, Check } from 'lucide-react';
import type { Car } from '@/types';

interface AllCarsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cars: Car[];
  onSelectCar: (car: Car) => void;
}

const categories = ['Todos', 'Sedán de Lujo', 'SUV Premium', 'Deportivo', 'Convertible', 'Ultra Lujo', 'Super SUV', 'Supercar', 'Gran Turismo', 'Eléctrico', 'SUV Deportivo'];

const AllCarsModal = ({ isOpen, onClose, cars, onSelectCar }: AllCarsModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesCategory = selectedCategory === 'Todos' || car.category === selectedCategory;
      const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           car.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesPrice = true;
      if (priceRange === 'low') matchesPrice = car.price < 1000000;
      else if (priceRange === 'medium') matchesPrice = car.price >= 1000000 && car.price < 2000000;
      else if (priceRange === 'high') matchesPrice = car.price >= 2000000;

      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [cars, selectedCategory, searchQuery, priceRange]);

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-7xl max-h-[90vh] overflow-hidden glass-card rounded-3xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-semibold text-white">Nuestra Flota Completa</h2>
            <p className="text-white/50 text-sm">{filteredCars.length} vehículos disponibles de {cars.length}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-white/10 bg-black/30">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar vehículo..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
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

          {/* Price Filter */}
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">Precio:</span>
            {[
              { key: 'all', label: 'Todos' },
              { key: 'low', label: '< $1M' },
              { key: 'medium', label: '$1M - $2M' },
              { key: 'high', label: '> $2M' },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setPriceRange(option.key as any)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  priceRange === option.key
                    ? 'bg-red-600/20 text-red-500 border border-red-500/30'
                    : 'glass text-white/50 hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white/30 text-6xl mb-4">🚗</div>
              <h3 className="text-white font-semibold mb-2">No se encontraron vehículos</h3>
              <p className="text-white/50">Intenta con otros filtros de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car, index) => (
                <div
                  key={car.id}
                  className="group glass-card-hover rounded-2xl overflow-hidden transition-all duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 glass px-3 py-1 rounded-full">
                      <span className="text-white text-xs font-medium">{car.category}</span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-red-600 px-3 py-1.5 rounded-xl">
                      <span className="text-white font-bold text-sm">{formatPrice(car.price)}</span>
                    </div>

                    {/* Not Available Overlay */}
                    {!car.available && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-white font-semibold">No Disponible</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-2">{car.name}</h3>
                    <p className="text-white/50 text-sm mb-4 line-clamp-2">{car.description}</p>
                    
                    {/* Specs */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-1.5 text-white/50 text-xs">
                        <Users className="w-3.5 h-3.5" />
                        <span>{car.seats}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/50 text-xs">
                        <Settings className="w-3.5 h-3.5" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/50 text-xs">
                        <Fuel className="w-3.5 h-3.5" />
                        <span>{car.fuel}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {car.features.slice(0, 3).map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-1 glass px-2 py-0.5 rounded-lg"
                        >
                          <Check className="w-3 h-3 text-red-500" />
                          <span className="text-white/60 text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => {
                        if (car.available) {
                          onSelectCar(car);
                          onClose();
                        }
                      }}
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
    </div>
  );
};

export default AllCarsModal;
