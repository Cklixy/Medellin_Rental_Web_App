import { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Instagram, 
  Facebook, 
  Twitter,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { api } from '@/services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.submitQuote(formData);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 4000);
    } catch {
      setError('Hubo un error al enviar. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="relative w-full py-24 bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.12)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 section-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <span className="text-red-500 text-sm font-medium">Contacto</span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            Reserva tu <span className="text-gradient-red">Auto</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Contáctanos ahora y reserva tu vehículo de lujo. 
            Nuestro equipo está listo para atenderte.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Info Cards */}
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">
                Información de Contacto
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">Teléfono</div>
                    <a href="tel:+573001234567" className="text-white/60 hover:text-red-500 transition-colors">
                      +57 300 123 4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">Email</div>
                    <a href="mailto:info@carrentalmedellin.com" className="text-white/60 hover:text-red-500 transition-colors">
                      info@carrentalmedellin.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">Ubicación</div>
                    <span className="text-white/60">
                      El Poblado, Medellín, Colombia
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">Horario</div>
                    <span className="text-white/60">
                      24 horas, 7 días a la semana
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass rounded-3xl p-6">
              <div className="text-white font-medium mb-4">Síguenos</div>
              <div className="flex gap-4">
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-red-600/20 hover:border-red-500/50 transition-all"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-red-600/20 hover:border-red-500/50 transition-all"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-red-600/20 hover:border-red-500/50 transition-all"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">
              Solicita una Cotización
            </h3>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-red-500" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  ¡Mensaje Enviado!
                </h4>
                <p className="text-white/60">
                  Nos pondremos en contacto contigo pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Nombre completo</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
                      placeholder="+57 300 000 0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Mensaje</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                    placeholder="¿Qué vehículo te interesa y para qué fechas?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                  ) : (
                    <><span>Enviar Solicitud</span><Send className="w-4 h-4" /></>
                  )}
                </button>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
