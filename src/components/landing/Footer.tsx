import { ChevronRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Inicio', href: '#' },
    { label: 'Nuestra Flota', href: '#fleet' },
    { label: 'Servicios', href: '#services' },
    { label: 'Contacto', href: '#contact' },
  ];

  const services = [
    { label: 'Alquiler con Conductor', href: '#services' },
    { label: 'Alquiler sin Conductor', href: '#services' },
    { label: 'Tours por Medellín', href: '#services' },
    { label: 'Traslados Aeropuerto', href: '#services' },
  ];

  const fleet = [
    { label: 'Sedanes de Lujo', href: '#fleet' },
    { label: 'SUV Premium', href: '#fleet' },
    { label: 'Deportivos', href: '#fleet' },
    { label: 'Convertibles', href: '#fleet' },
  ];

  return (
    <footer className="relative w-full bg-black border-t border-white/5">
      {/* Main Footer */}
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-white font-semibold text-lg">
                Car Rental <span className="text-red-500">Medellin</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              La experiencia premium en alquiler de vehículos de lujo en Medellín. 
              Servicio excepcional, flota inigualable.
            </p>
            <div className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white/70 text-sm">Servicio disponible</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="group flex items-center gap-2 text-white/50 hover:text-red-500 transition-colors text-sm"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6">Servicios</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <a 
                    href={service.href}
                    className="group flex items-center gap-2 text-white/50 hover:text-red-500 transition-colors text-sm"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <span>{service.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Fleet */}
          <div>
            <h4 className="text-white font-semibold mb-6">Nuestra Flota</h4>
            <ul className="space-y-3">
              {fleet.map((item) => (
                <li key={item.label}>
                  <a 
                    href={item.href}
                    className="group flex items-center gap-2 text-white/50 hover:text-red-500 transition-colors text-sm"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="section-padding py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              {currentYear} Car Rental Medellin. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
