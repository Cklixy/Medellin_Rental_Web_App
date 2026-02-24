import { MapPin, Clock, Calendar, ChevronRight, Flame, Star, Compass, Car } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stops: string[];
  duration: string;
  schedule: string;
  intensity: 'Alta' | 'Media' | 'Relajada';
  featured?: boolean;
  emoji: string;
  badge?: string;
}

const TOURS: Tour[] = [
  {
    id: 'jueves-supercarros',
    name: 'Jueves de Supercarros',
    tagline: 'La cita más épica del motor en Medellín',
    description:
      'Cada jueves la élite automotriz de Medellín converge en la mítica Bomba de Industriales. Motores rugiendo, luces intermitentes y la adrenalina de exhibir tu supercarro alquilado entre los mejores. Luego, la caravana sube a toda velocidad por Avenida Las Palmas —"trepar palmas"— y termina en zona de Farmamercado Las Palmas donde la noche sigue con algo de comer y más cultura del motor.',
    stops: ['Bomba de Industriales', 'Avenida Las Palmas (subida nocturna)', 'Farmamercado Las Palmas'],
    duration: '4 – 5 horas',
    schedule: 'Jueves — Noche',
    intensity: 'Alta',
    featured: true,
    emoji: '🔥',
    badge: 'Exclusivo Jueves',
  },
  {
    id: 'noche-poblado',
    name: 'Noche VIP en El Poblado',
    tagline: 'El brillo de la ciudad desde el asiento correcto',
    description:
      'Recorre el corazón vibrante de El Poblado a bordo de tu vehículo de lujo. Desde el ambiente artístico del Parque El Poblado hasta la efervescencia de Parque Lleras y la elegancia de los restaurantes de Vía Primavera. Medellín de noche en su máxima expresión.',
    stops: ['Parque El Poblado', 'Parque Lleras', 'Vía Primavera', 'Zona Rosa'],
    duration: '3 – 4 horas',
    schedule: 'Viernes y Sábado — Noche',
    intensity: 'Media',
    emoji: '✨',
  },
  {
    id: 'fuga-penol',
    name: 'Fuga al Peñol de Guatapé',
    tagline: '80 km de asfalto hasta la roca más imponente de Antioquia',
    description:
      'Casi 80 km de autopista y carreteras serpenteantes hasta el espectacular embalse Guatapé-Peñol. Curvas, rectas, vistas de la montaña antioqueña y una roca de 220 metros de altura como destino. El road-trip definitivo en Antioquia.',
    stops: ['Autopista Medellín–Bogotá', 'Embalse de Guatapé', 'El Peñol', 'Casco urbano Guatapé', 'Regreso por La Ceja'],
    duration: '8 – 10 horas',
    schedule: 'Sáb / Dom — Día completo',
    intensity: 'Relajada',
    emoji: '🗺️',
  },
  {
    id: 'circuito-antioqueno',
    name: 'Circuito Antioqueño',
    tagline: 'Las Palmas, El Retiro y el Valle de San Nicolás',
    description:
      'La ruta favorita de los pilotos aficionados de Medellín. Sube por Las Palmas, atraviesa Llano Grande y llega hasta el tranquilo municipio de El Retiro con sus cafés artesanales. De regreso, el Valle de San Nicolás te espera con kilómetros de carretera abierta.',
    stops: ['Avenida Las Palmas', 'Llano Grande', 'El Retiro', 'Valle de San Nicolás'],
    duration: '5 – 6 horas',
    schedule: 'Cualquier día — Mañana',
    intensity: 'Media',
    emoji: '🏔️',
  },
  {
    id: 'atardecer-santa-elena',
    name: 'Atardecer en Santa Elena',
    tagline: 'El balcón natural de Medellín al caer el sol',
    description:
      'Sube hasta Santa Elena y disfruta de un atardecer espectacular sobre el Valle de Aburrá. Caminos rurales serpenteantes, silleteros, flores y el olor a tierra mojada. Ideal para terminar el día con una vista que pocas ciudades del mundo pueden ofrecer.',
    stops: ['Sector El Placer', 'Mirador Alto de las Palmas', 'Vereda Barro Blanco', 'Parque Arví (ingreso)'],
    duration: '3 – 4 horas',
    schedule: 'Cualquier día — Tarde',
    intensity: 'Relajada',
    emoji: '🌅',
    badge: 'Vista Panorámica',
  },
  {
    id: 'ruta-cafe-girardota',
    name: 'Ruta del Café — Norte Cercano',
    tagline: 'Fincas, café y carretera abierta al norte de Medellín',
    description:
      'Dirígete al norte del Valle de Aburrá cruzando Bello y Copacabana hasta llegar a las fincas cafeteras de Girardota y Barbosa. Paradas en trapiches artesanales, cañaverales y una taza de café de origen directo de la tierra paisa.',
    stops: ['Autopista Norte', 'Copacabana', 'Girardota', 'Trapiche La Isabela', 'Barbosa'],
    duration: '6 – 7 horas',
    schedule: 'Sáb / Dom — Mañana',
    intensity: 'Relajada',
    emoji: '☕',
  },
  {
    id: 'luces-medellin',
    name: 'Medellín de Mil Luces',
    tagline: 'La ciudad iluminada desde los mejores miradores',
    description:
      'Un recorrido nocturno por los miradores más icónicos de Medellín: Las Palmas, Cerro El Volador y el barrio de Las Flores en Robledo. El mar de luces del Valle de Aburrá de noche es un espectáculo que se disfruta desde la comodidad de tu vehículo de lujo.',
    stops: ['Mirador Las Palmas', 'Cerro El Volador', 'Barrio Robledo (Las Flores)', 'Avenida 80'],
    duration: '3 – 4 horas',
    schedule: 'Viernes y Sábado — Noche',
    intensity: 'Relajada',
    emoji: '🌃',
    badge: 'Nuevo',
  },
  {
    id: 'alto-minas',
    name: 'Alto de Minas & Caramanta',
    tagline: 'El paso de montaña más dramático del suroeste antioqueño',
    description:
      'Sal de Medellín por la autopista Medellín–Quibdó hacia el suroeste antioqueño. El Alto de Minas a 3.100 m sobre el nivel del mar te recibe con niebla, curvas cerradas y un paisaje salvaje. Baja hasta Caramanta para almorzar bandeja paisa vista al cañón y regresa por un circuito diferente.',
    stops: ['Autopista al Mar (inicio)', 'Alto de Minas', 'Mirador Cañón del Cauca', 'Caramanta'],
    duration: '9 – 11 horas',
    schedule: 'Sáb / Dom — Día completo',
    intensity: 'Alta',
    emoji: '⛰️',
    badge: 'Aventura Extrema',
  },
];

const INTENSITY_STYLE: Record<Tour['intensity'], string> = {
  Alta:     'bg-red-500/20    text-red-400    border-red-500/30',
  Media:    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Relajada: 'bg-green-500/20  text-green-400  border-green-500/30',
};

const INTENSITY_ICON: Record<Tour['intensity'], React.ReactNode> = {
  Alta:     <Flame  className="w-3 h-3" />,
  Media:    <Star   className="w-3 h-3" />,
  Relajada: <Compass className="w-3 h-3" />,
};

interface ToursProps {
  onBookTour: (tourName: string) => void;
}

export default function Tours({ onBookTour }: ToursProps) {
  const featured = TOURS.find(t => t.featured)!;
  const rest     = TOURS.filter(t => !t.featured);

  return (
    <section id="tours" className="relative w-full py-24 bg-black overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(220,38,38,0.1)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(220,38,38,0.07)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 section-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Car className="w-4 h-4 text-red-500" />
            <span className="text-red-500 text-sm font-medium">Tours por Medellín</span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            Experimenta la ciudad <span className="text-gradient-red">como nunca</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Rutas cuidadosamente diseñadas para vivir Medellín desde el asiento de un 
            supercarro. Cultura, adrenalina y paisajes únicos.
          </p>
        </div>

        {/* Featured tour */}
        <div className="glass-card rounded-3xl overflow-hidden mb-6 group">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left — visual */}
            <div className="lg:col-span-2 relative min-h-[260px] lg:min-h-[380px] bg-gradient-to-br from-red-950 via-black to-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.25)_0%,transparent_70%)]" />
              <span className="text-[120px] lg:text-[160px] leading-none select-none relative z-10 drop-shadow-2xl">
                {featured.emoji}
              </span>
              {featured.badge && (
                <div className="absolute top-5 left-5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {featured.badge}
                </div>
              )}
            </div>

            {/* Right — content */}
            <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${INTENSITY_STYLE[featured.intensity]}`}>
                    {INTENSITY_ICON[featured.intensity]} Intensidad {featured.intensity}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs">
                    <Calendar className="w-3 h-3" /> {featured.schedule}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs">
                    <Clock className="w-3 h-3" /> {featured.duration}
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{featured.name}</h3>
                <p className="text-red-400 text-sm font-medium mb-4">{featured.tagline}</p>
                <p className="text-white/60 text-sm leading-relaxed">{featured.description}</p>
              </div>

              {/* Stops */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Paradas del recorrido
                </p>
                <div className="flex flex-wrap gap-2">
                  {featured.stops.map((stop, i) => (
                    <div key={stop} className="flex items-center gap-2">
                      <span className="glass px-3 py-1 rounded-full text-sm text-white/80">{stop}</span>
                      {i < featured.stops.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onBookTour(featured.name)}
                className="btn-primary self-start flex items-center gap-2"
              >
                Reservar este tour <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 smaller tours */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rest.map(tour => (
            <div key={tour.id} className="glass-card rounded-3xl p-7 flex flex-col gap-5 hover:border-red-500/20 transition-colors group">
              {/* top */}
              <div className="flex items-start justify-between">
                <span className="text-5xl leading-none">{tour.emoji}</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${INTENSITY_STYLE[tour.intensity]}`}>
                  {INTENSITY_ICON[tour.intensity]} {tour.intensity}
                </span>
              </div>

              {/* info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{tour.name}</h3>
                <p className="text-red-400 text-xs font-medium mb-3">{tour.tagline}</p>
                <p className="text-white/55 text-sm leading-relaxed line-clamp-3">{tour.description}</p>
              </div>

              {/* stops */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Paradas
                </p>
                <div className="space-y-1">
                  {tour.stops.map(stop => (
                    <div key={stop} className="flex items-center gap-2 text-white/60 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 shrink-0" />
                      {stop}
                    </div>
                  ))}
                </div>
              </div>

              {/* meta + cta */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-white/50 text-xs">
                    <Clock className="w-3 h-3" /> {tour.duration}
                  </div>
                  <div className="flex items-center gap-1 text-white/50 text-xs">
                    <Calendar className="w-3 h-3" /> {tour.schedule}
                  </div>
                </div>
                <button
                  onClick={() => onBookTour(tour.name)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/20 hover:bg-red-600/30 hover:text-red-300 text-sm font-medium transition-all"
                >
                  Reservar <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-white/30 text-sm mt-10">
          Los tours se realizan con el vehículo de tu elección. El precio varía según el auto seleccionado.
          <br />Disponible sujeto a reservación previa.
        </p>
      </div>
    </section>
  );
}
