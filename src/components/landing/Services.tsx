import { useEffect, useRef, useState } from 'react';
import { 
  Car, 
  UserCheck, 
  MapPin, 
  Clock, 
  Shield, 
  Headphones,
  ChevronRight,
  X,
  Check
} from 'lucide-react';

interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  details: string;
  price: string;
}

const services: Service[] = [
  {
    icon: Car,
    title: 'Alquiler con Conductor',
    description: 'Disfruta de un servicio VIP con conductor profesional bilingüe para tus traslados en Medellín.',
    features: ['Conductor bilingüe', 'Disponible 24/7', 'Itinerario personalizado'],
    details: 'Nuestros conductores profesionales están certificados y hablan inglés y español. Te recogerán puntualmente y te llevarán a tu destino con total seguridad y comodidad.',
    price: 'Desde $200.000 COP/día',
  },
  {
    icon: UserCheck,
    title: 'Alquiler sin Conductor',
    description: 'Conduce tú mismo vehículos de lujo con todos los seguros incluidos y asistencia en carretera.',
    features: ['Seguro completo', 'Asistencia 24h', 'Entrega a domicilio'],
    details: 'Todos nuestros vehículos incluyen seguro de cobertura total sin deducible. Requisitos: licencia de conducir válida, mayor de 25 años y tarjeta de crédito para garantía.',
    price: 'Desde $850.000 COP/día',
  },
  {
    icon: MapPin,
    title: 'Tours por Medellín',
    description: 'Recorre los lugares más emblemáticos de la ciudad de Medellín con rutas personalizadas.',
    features: ['Guía turístico', 'Rutas personalizadas', 'Paradas flexibles'],
    details: 'Descubre Comuna 13, Plaza Botero, Pueblito Paisa, Metrocable y más. Nuestros guías locales te mostrarán lo mejor de la ciudad con rutas adaptadas a tus intereses.',
    price: 'Desde $500.000 COP/persona',
  },
  {
    icon: Clock,
    title: 'Traslados Aeropuerto',
    description: 'Servicio puntual de recogida y entrega en el Aeropuerto Internacional José María Córdova.',
    features: ['Monitoreo de vuelos', 'Espera incluida', 'Vehículo premium'],
    details: 'Monitoreamos tu vuelo en tiempo real. Si hay retrasos, no te preocupes, te estaremos esperando. Incluye 60 minutos de espera gratuita después del aterrizaje.',
    price: 'Desde $350.000 COP',
  },
  {
    icon: Shield,
    title: 'Seguro Completo',
    description: 'Todos nuestros vehículos incluyen cobertura total contra daños y robos sin deducible.',
    features: ['Cobertura total', 'Sin deducible', 'Asistencia inmediata'],
    details: 'Nuestro seguro todo riesgo cubre daños, robos, accidentes y responsabilidad civil. Viaja tranquilo sabiendo que estás completamente protegido.',
    price: 'Incluido en el alquiler',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    description: 'Nuestro equipo de atención al cliente está disponible las 24 horas para ayudarte.',
    features: ['Atención inmediata', 'Múltiples idiomas', 'Resolución rápida'],
    details: 'Estamos disponibles por teléfono, WhatsApp y email las 24 horas del día, los 7 días de la semana. Respuesta promedio de menos de 5 minutos.',
    price: 'Gratuito',
  },
];

const Services = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="relative w-full py-24 bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 section-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <span className="text-red-500 text-sm font-medium">Servicios</span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            Experiencia <span className="text-gradient-red">Premium</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Ofrecemos una gama completa de servicios diseñados para hacer tu experiencia 
            de alquiler inolvidable.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isVisible = visibleCards.has(index);
            
            return (
              <div
                key={service.title}
                ref={(el) => { cardRefs.current[index] = el; }}
                data-index={index}
                className={`group glass-card-hover rounded-3xl p-8 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-red-600/10 flex items-center justify-center mb-6 group-hover:bg-red-600/20 transition-colors">
                  <Icon className="w-7 h-7 text-red-500" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-white/70 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Link */}
                <button 
                  onClick={() => setSelectedService(service)}
                  className="flex items-center gap-2 text-red-500 text-sm font-medium group-hover:gap-3 transition-all"
                >
                  <span>Más información</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedService(null)}
          />
          
          <div className="relative w-full max-w-lg glass-card rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center">
                  <selectedService.icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-white">{selectedService.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedService(null)}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-white/70 mb-6">{selectedService.details}</p>

              <div className="glass rounded-xl p-4 mb-6">
                <div className="text-white/50 text-sm mb-1">Precio</div>
                <div className="text-red-500 font-bold text-lg">{selectedService.price}</div>
              </div>

              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Características incluidas:</h4>
                <ul className="space-y-2">
                  {selectedService.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-white/70 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href="#contact"
                onClick={() => setSelectedService(null)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <span>Solicitar Información</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
