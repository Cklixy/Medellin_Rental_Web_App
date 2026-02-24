import { useEffect, useState } from 'react';
import { ChevronRight, Phone, Shield, Clock, Award } from 'lucide-react';

interface HeroProps {
  onViewFleet: () => void;
  onReserve: () => void;
}

const Hero = ({ onViewFleet, onReserve }: HeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero-car.jpg"
          alt="Luxury Car"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </div>

      {/* Navigation */}
      <nav className="relative z-40 section-padding py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">
              Car Rental <span className="text-red-500">Medellin</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#fleet" className="text-white/70 hover:text-white transition-colors text-sm font-medium">Flota</a>
            <a href="#services" className="text-white/70 hover:text-white transition-colors text-sm font-medium">Servicios</a>
            <a href="#contact" className="text-white/70 hover:text-white transition-colors text-sm font-medium">Contacto</a>
          </div>

          <a 
            href="tel:+573001234567" 
            className="hidden sm:flex items-center gap-2 glass px-4 py-2 rounded-full text-white text-sm font-medium hover:bg-white/10 transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>+57 300 123 4567</span>
          </a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-30 section-padding pt-20 lg:pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white/80 text-sm font-medium">Disponible 24/7 en Medellín</span>
          </div>

          {/* Heading */}
          <h1 
            className={`heading-xl text-white mb-6 transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Alquiler de{' '}
            <span className="text-gradient-red">Autos de Lujo</span>
            <br />
            en Medellín
          </h1>

          {/* Description */}
          <p 
            className={`body-lg max-w-xl mb-10 transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Experimenta el lujo y la elegancia en cada kilómetro. 
            Flota premium de 25 vehículos con conductor o para conducir tú mismo.
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-wrap gap-4 mb-16 transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <button 
              onClick={onViewFleet}
              className="btn-primary flex items-center gap-2"
            >
              <span>Ver Flota</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={onReserve}
              className="btn-outline"
            >
              Reservar Ahora
            </button>
          </div>

          {/* Stats */}
          <div 
            className={`grid grid-cols-3 gap-6 max-w-lg transition-all duration-1000 delay-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="glass-card-hover rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">25+</div>
              <div className="text-white/50 text-xs sm:text-sm">Vehículos</div>
            </div>
            <div className="glass-card-hover rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">5k+</div>
              <div className="text-white/50 text-xs sm:text-sm">Clientes</div>
            </div>
            <div className="glass-card-hover rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-white/50 text-xs sm:text-sm">Servicio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="relative z-30 section-padding pb-12">
        <div 
          className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-1000 delay-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="text-white font-medium text-sm">Seguro Incluido</div>
              <div className="text-white/50 text-xs">Cobertura total</div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="text-white font-medium text-sm">Entrega Rápida</div>
              <div className="text-white/50 text-xs">En 30 minutos</div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="text-white font-medium text-sm">Calidad Premium</div>
              <div className="text-white/50 text-xs">Vehículos 2024</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
