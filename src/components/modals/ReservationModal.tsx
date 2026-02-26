import { useState, useEffect } from 'react';
import { X, User, MapPin, Check, Car as CarIcon, CreditCard, Compass } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DarkDatePicker } from '@/components/ui/DarkDatePicker';
import type { Car } from '@/types';

const TOURS = [
  { id: 'jueves-supercarros',      name: 'Jueves de Supercarros',        emoji: '🔥', desc: 'Bomba de Industriales → Trepar Palmas → Farmamercado',    price: 350000, dayOfWeek: 4    },
  { id: 'noche-poblado',           name: 'Noche VIP en El Poblado',      emoji: '✨', desc: 'Parque Lleras → Vía Primavera → Zona Rosa',               price: 250000, dayOfWeek: null },
  { id: 'fuga-penol',              name: 'Fuga al Peñol',                emoji: '🗺️', desc: 'Autopista → Guatapé → El Peñol → La Ceja',                price: 600000, dayOfWeek: null },
  { id: 'circuito-antioqueno',     name: 'Circuito Antioqueño',          emoji: '🏔️', desc: 'Las Palmas → Llano Grande → El Retiro',                   price: 400000, dayOfWeek: null },
  { id: 'atardecer-santa-elena',   name: 'Atardecer en Santa Elena',     emoji: '🌅', desc: 'El Placer → Mirador Las Palmas → Barro Blanco → Arví',    price: 200000, dayOfWeek: null },
  { id: 'ruta-cafe-girardota',     name: 'Ruta del Café — Norte Cercano',emoji: '☕', desc: 'Autopista Norte → Copacabana → Girardota → Barbosa',       price: 320000, dayOfWeek: null },
  { id: 'luces-medellin',          name: 'Medellín de Mil Luces',        emoji: '🌃', desc: 'Mirador Las Palmas → Cerro Volador → Robledo → Av. 80',   price: 180000, dayOfWeek: null },
  { id: 'alto-minas',              name: 'Alto de Minas & Caramanta',    emoji: '⛰️', desc: 'Autopista al Mar → Alto de Minas → Cañón del Cauca',      price: 700000, dayOfWeek: null },
];

// Returns all ISO dates [pickupDate..returnDate] that match the optional dayOfWeek filter
function getValidTourDates(pickupDate: string, returnDate: string, dayOfWeek: number | null): string[] {
  if (!pickupDate || !returnDate) return [];
  const [py, pm, pd] = pickupDate.split('-').map(Number);
  const [ry, rm, rd] = returnDate.split('-').map(Number);
  const start = new Date(py, pm - 1, pd);
  const end   = new Date(ry, rm - 1, rd);
  const dates: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    if (dayOfWeek === null || cur.getDay() === dayOfWeek) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const d = String(cur.getDate()).padStart(2, '0');
      dates.push(`${y}-${m}-${d}`);
    }
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

const DAY_NAMES: Record<number, string> = { 0:'domingo',1:'lunes',2:'martes',3:'miércoles',4:'jueves',5:'viernes',6:'sábado' };

// Parse ISO date as LOCAL time (avoids UTC timezone-shift showing day before)
function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
  initialTourName?: string;
  car: Car | null;
  onSubmit: (data: {
    car: Car;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    withDriver: boolean;
    additionalNotes: string;
    totalPrice: number;
    tourName?: string;
    tourDate?: string;
  }) => void;
  calculateTotalPrice: (car: Car, pickupDate: string, returnDate: string, withDriver: boolean) => number;
}

const ReservationModal = ({ isOpen, onClose, onOpenAuth, initialTourName, car, onSubmit, calculateTotalPrice }: ReservationModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: 'Aeropuerto José María Córdova',
    customPickupAddress: '',
    withDriver: false,
    additionalNotes: '',
    tourName: initialTourName ?? '',
    tourDate: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reservationId, setReservationId] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setStep(1);
      setFormData({
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        pickupDate: '',
        returnDate: '',
        pickupLocation: 'Aeropuerto José María Córdova',
        customPickupAddress: '',
        withDriver: false,
        additionalNotes: '',
        tourName: initialTourName ?? '',
        tourDate: '',
      });
      setIsSubmitted(false);
      setReservationId('');
    }
  }, [isOpen, initialTourName]);

  if (!isOpen || !car) return null;

  const selectedTourObj = TOURS.find(t => t.name === formData.tourName);
  const tourPrice = selectedTourObj?.price ?? 0;
  const totalPrice = calculateTotalPrice(car, formData.pickupDate, formData.returnDate, formData.withDriver) + tourPrice;
  const days = formData.pickupDate && formData.returnDate 
    ? Math.max(1, Math.ceil((parseLocalDate(formData.returnDate).getTime() - parseLocalDate(formData.pickupDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const handleSubmit = () => {
    const id = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setReservationId(id);
    const { customPickupAddress: _, ...restFormData } = formData;
    onSubmit({
      car,
      ...restFormData,
      pickupLocation: formData.pickupLocation === 'otro'
        ? formData.customPickupAddress
        : formData.pickupLocation,
      totalPrice,
    });
    setIsSubmitted(true);
  };

  const isStep1Valid = formData.pickupDate && formData.returnDate && formData.pickupLocation
    && (formData.pickupLocation !== 'otro' || formData.customPickupAddress.trim())
    && (!formData.tourName || formData.tourDate);
  const isStep2Valid = user && formData.customerName && formData.customerEmail && formData.customerPhone;

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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {isSubmitted ? '¡Reserva Confirmada!' : 'Reservar Vehículo'}
            </h2>
            {!isSubmitted && (
              <p className="text-white/50 text-sm">Paso {step} de 3</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!user ? (
            /* User not logged in */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Inicia sesión para reservar</h3>
              <p className="text-white/60 mb-6">
                Necesitas una cuenta para poder hacer reservaciones.
              </p>
              <button 
                onClick={() => { onClose(); onOpenAuth?.(); }}
                className="btn-primary"
              >
                Crear cuenta o iniciar sesión
              </button>
            </div>
          ) : isSubmitted ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                ¡Reserva Exitosa!
              </h3>
              <p className="text-white/60 mb-6">
                Tu reserva ha sido registrada. Nos pondremos en contacto contigo pronto.
              </p>
              
              <div className="glass rounded-2xl p-6 mb-6 text-left">
                <div className="text-white/50 text-sm mb-1">Número de Reserva</div>
                <div className="text-2xl font-bold text-red-500">{reservationId}</div>
              </div>

              <div className="glass rounded-2xl p-4 mb-6 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Vehículo:</span>
                  <span className="text-white font-medium">{car.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Fecha recogida:</span>
                  <span className="text-white font-medium">{parseLocalDate(formData.pickupDate).toLocaleDateString('es-CO')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Fecha devolución:</span>
                  <span className="text-white font-medium">{parseLocalDate(formData.returnDate).toLocaleDateString('es-CO')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Total:</span>
                  <span className="text-red-500 font-bold">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="btn-primary w-full"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <>
              {/* Car Info */}
              <div className="flex gap-4 mb-6 glass rounded-2xl p-4">
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="w-24 h-20 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{car.name}</h3>
                  <p className="text-white/50 text-sm">{car.category}</p>
                  <p className="text-red-500 font-bold mt-1">
                    {formatPrice(car.price)}<span className="text-white/50 text-sm font-normal">/día</span>
                  </p>
                </div>
              </div>

              {/* Step 1: Dates & Location */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <DarkDatePicker
                      label="Fecha Recogida"
                      value={formData.pickupDate}
                      onChange={(iso) => setFormData(f => ({ ...f, pickupDate: iso, returnDate: f.returnDate < iso ? '' : f.returnDate, tourDate: '' }))}
                      minDate={new Date().toISOString().split('T')[0]}
                    />
                    <DarkDatePicker
                      label="Fecha Devolución"
                      value={formData.returnDate}
                      onChange={(iso) => setFormData(f => ({ ...f, returnDate: iso, tourDate: '' }))}
                      minDate={formData.pickupDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Lugar de Recogida
                    </label>
                    <select
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value, customPickupAddress: '' })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                    >
                      <option value="Aeropuerto José María Córdova" className="bg-black">Aeropuerto José María Córdova</option>
                      <option value="Hotel en El Poblado" className="bg-black">Hotel en El Poblado</option>
                      <option value="Centro de Medellín" className="bg-black">Centro de Medellín</option>
                      <option value="Envigado" className="bg-black">Envigado</option>
                      <option value="Sabaneta" className="bg-black">Sabaneta</option>
                      <option value="otro" className="bg-black">Otro lugar...</option>
                    </select>

                  {formData.pickupLocation === 'otro' && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Escribe la dirección de recogida..."
                        value={formData.customPickupAddress}
                        onChange={(e) => setFormData({ ...formData, customPickupAddress: e.target.value })}
                        autoFocus
                        className="w-full bg-white/5 border border-red-500/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/60 transition-colors"
                      />
                    </div>
                  )}
                  </div>

                  <div className="flex items-center gap-3 glass rounded-xl p-4">
                    <input
                      type="checkbox"
                      id="withDriver"
                      checked={formData.withDriver}
                      onChange={(e) => setFormData({ ...formData, withDriver: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="withDriver" className="flex-1 cursor-pointer">
                      <div className="text-white font-medium">Incluir Conductor</div>
                      <div className="text-white/50 text-sm">+$200.000 COP por día</div>
                    </label>
                    <CarIcon className="w-5 h-5 text-white/30" />
                  </div>

                  {days > 0 && (
                    <div className="glass rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/60">Duración:</span>
                        <span className="text-white">{days} {days === 1 ? 'día' : 'días'}</span>
                      </div>
                      {tourPrice > 0 && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/60">Tour incluido:</span>
                          <span className="text-yellow-400">+{formatPrice(tourPrice)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-white/10 pt-2">
                        <span className="text-white/60">Precio estimado:</span>
                        <span className="text-red-500 font-bold text-lg">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  )}

                  {/* Tour selector */}
                  <div>
                    <label className="block text-white/70 text-sm mb-1 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-red-500" />
                      Tour por Medellín <span className="text-white/30">(opcional)</span>
                    </label>
                    {!formData.pickupDate || !formData.returnDate ? (
                      <p className="text-white/30 text-xs mb-3">Elige primero las fechas de alquiler para ver disponibilidad de tours.</p>
                    ) : (
                      <p className="text-white/30 text-xs mb-3">Solo se muestran fechas dentro de tu periodo de alquiler.</p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {TOURS.map(tour => {
                        const active = formData.tourName === tour.name;
                        const validDates = getValidTourDates(formData.pickupDate, formData.returnDate, tour.dayOfWeek);
                        const datesReady = !!(formData.pickupDate && formData.returnDate);
                        const disabled = datesReady && validDates.length === 0;
                        const unavailableReason = disabled && tour.dayOfWeek !== null
                          ? `No hay ${DAY_NAMES[tour.dayOfWeek]}s en tu periodo`
                          : disabled ? 'Sin fechas disponibles' : null;
                        return (
                          <button
                            key={tour.id}
                            type="button"
                            disabled={disabled || !datesReady}
                            onClick={() => setFormData(f => ({ ...f, tourName: active ? '' : tour.name, tourDate: '' }))}
                            className={`flex items-start gap-2 p-3 rounded-xl border text-left transition-all ${
                              disabled || !datesReady
                                ? 'opacity-40 cursor-not-allowed bg-white/2 border-white/5'
                                : active
                                  ? 'bg-red-600/15 border-red-500/40 shadow-[0_0_12px_rgba(220,38,38,0.2)]'
                                  : 'bg-white/3 border-white/10 hover:bg-white/8'
                            }`}
                          >
                            <span className="text-xl leading-none shrink-0">{tour.emoji}</span>
                            <div className="min-w-0">
                              <p className={`text-xs font-semibold leading-tight ${active ? 'text-red-400' : 'text-white/80'}`}>{tour.name}</p>
                              {unavailableReason
                                ? <p className="text-red-400/70 text-[10px] leading-tight mt-0.5">{unavailableReason}</p>
                                : <p className="text-white/40 text-[10px] leading-tight mt-0.5 truncate">{tour.desc}</p>
                              }
                              <p className="text-yellow-400/80 text-[10px] font-medium mt-0.5">{formatPrice(tour.price)}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Tour date picker — shown when a tour is selected and dates are ready */}
                    {formData.tourName && formData.pickupDate && formData.returnDate && (() => {
                      const activeTour = TOURS.find(t => t.name === formData.tourName);
                      if (!activeTour) return null;
                      const validDates = getValidTourDates(formData.pickupDate, formData.returnDate, activeTour.dayOfWeek);
                      const dayLabel = activeTour.dayOfWeek !== null
                        ? `Solo ${DAY_NAMES[activeTour.dayOfWeek]}s disponibles`
                        : 'Cualquier día de tu alquiler';
                      return (
                        <div className="mt-3 glass rounded-xl p-4 border border-red-500/20">
                          <p className="text-white/70 text-xs mb-1 flex items-center gap-1">
                            <Compass className="w-3 h-3 text-red-500" />
                            Fecha del tour <span className="text-white font-medium ml-1">{activeTour.emoji} {activeTour.name}</span>
                          </p>
                          <p className="text-white/30 text-[11px] mb-3">{dayLabel}</p>
                          <DarkDatePicker
                            label="Día del tour"
                            value={formData.tourDate}
                            onChange={(iso) => setFormData(f => ({ ...f, tourDate: iso }))}
                            allowedDates={validDates}
                            defaultMonth={validDates[0]}
                          />
                        </div>
                      );
                    })()}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {/* Step 2: Personal Info */}
              {step === 2 && (
                <div className="space-y-5">
                  {/* User Info Display */}
                  <div className="glass rounded-xl p-4 mb-4">
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Información de la Reserva
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60">Nombre:</span>
                        <span className="text-white">{formData.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Email:</span>
                        <span className="text-white">{formData.customerEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Teléfono:</span>
                        <span className="text-white">{formData.customerPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Notas Adicionales (opcional)
                    </label>
                    <textarea
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      placeholder="Requisitos especiales, hora preferida, etc."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 btn-outline"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!isStep2Valid}
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Summary */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="glass rounded-2xl p-6 space-y-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-red-500" />
                      Resumen de la Reserva
                    </h4>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Vehículo:</span>
                        <span className="text-white">{car.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Recogida:</span>
                        <span className="text-white">{new Date(formData.pickupDate).toLocaleDateString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Devolución:</span>
                        <span className="text-white">{new Date(formData.returnDate).toLocaleDateString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Duración:</span>
                        <span className="text-white">{days} {days === 1 ? 'día' : 'días'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Lugar:</span>
                        <span className="text-white">{formData.pickupLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Conductor:</span>
                        <span className="text-white">{formData.withDriver ? 'Sí (+$200.000/día)' : 'No'}</span>
                      </div>
                      {formData.tourName && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Tour:</span>
                          <span className="text-white">{formData.tourName}</span>
                        </div>
                      )}
                      {formData.tourDate && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Fecha del tour:</span>
                          <span className="text-yellow-400 font-medium">
                            {new Date(formData.tourDate + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                      {tourPrice > 0 && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Precio tour:</span>
                          <span className="text-yellow-400">+{formatPrice(tourPrice)}</span>
                        </div>
                      )}
                      <div className="border-t border-white/10 pt-3">
                        <div className="flex justify-between">
                          <span className="text-white/60">Cliente:</span>
                          <span className="text-white">{formData.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Email:</span>
                          <span className="text-white">{formData.customerEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Teléfono:</span>
                          <span className="text-white">{formData.customerPhone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Total a Pagar:</span>
                        <span className="text-red-500 font-bold text-2xl">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/50 text-sm text-center">
                    Al confirmar, aceptas nuestros términos y condiciones de alquiler.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 btn-outline"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 btn-primary"
                    >
                      Confirmar Reserva
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
