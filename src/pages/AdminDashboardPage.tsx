import React, { useState, useEffect } from 'react';
import {
  Users, Car, Calendar, DollarSign, TrendingUp,
  Trash2, Check, XCircle, Clock, Search,
  LogOut, BarChart3, Plus, Shield,
  MessageSquare, MessageCircle, ChevronDown, Phone, Mail,
  FileText, Inbox, CheckCheck,
} from 'lucide-react';
import AdminChatTab from '@/components/chat/AdminChatTab';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useReservations';
import { api } from '@/services/api';
import type { Car as CarType, Reservation, Quote } from '@/types';

const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const STATUS_MAP: Record<Reservation['status'], { label: string; cls: string }> = {
  pending:   { label: 'Pendiente',  cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  confirmed: { label: 'Confirmada', cls: 'bg-green-500/20  text-green-400  border-green-500/30'  },
  completed: { label: 'Completada', cls: 'bg-blue-500/20   text-blue-400   border-blue-500/30'   },
  cancelled: { label: 'Cancelada',  cls: 'bg-red-500/20    text-red-400    border-red-500/30'   },
};

const CAR_CATEGORIES = [
  'Sedán de Lujo', 'SUV Premium', 'Deportivo', 'Convertible',
  'Ultra Lujo', 'Super SUV', 'Supercar', 'Gran Turismo', 'Eléctrico', 'SUV Deportivo',
];

function StatusBadge({ status }: { status: Reservation['status'] }) {
  const { label, cls } = STATUS_MAP[status];
  const icons: Record<Reservation['status'], React.ReactNode> = {
    pending:   <Clock   className="w-3 h-3" />,
    confirmed: <Check   className="w-3 h-3" />,
    completed: <Check   className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${cls}`}>
      {icons[status]} {label}
    </span>
  );
}

/* ── tiny helpers for the form ── */
function PillGroup({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt} type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              value === opt
                ? 'bg-red-600 border-red-500 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stepper({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-0 bg-white/5 border border-white/10 rounded-xl overflow-hidden w-fit">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
        >−</button>
        <span className="w-10 text-center text-white text-sm font-semibold">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
        >+</button>
      </div>
    </div>
  );
}

const FUEL_OPTIONS        = ['Gasolina', 'Diesel', 'Eléctrico', 'Híbrido'];
const TRANSMISSION_OPTIONS = ['Automática', 'Manual'];

interface AddCarFormProps { onAdd: (car: Omit<CarType, 'id'>) => Promise<void>; onCancel: () => void }
function AddCarForm({ onAdd, onCancel }: AddCarFormProps) {
  const [form, setForm] = useState({
    name: '', category: CAR_CATEGORIES[0], image: '', price: '', seats: 5, doors: 4,
    transmission: 'Automática', fuel: 'Gasolina', year: new Date().getFullYear(),
    features: '', description: '', available: true,
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | boolean | number) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onAdd({
      name: form.name, category: form.category, image: form.image,
      price: Number(form.price), seats: form.seats, doors: form.doors,
      transmission: form.transmission as 'Automática' | 'Manual', fuel: form.fuel, year: form.year,
      features: form.features.split(',').map(s => s.trim()).filter(Boolean),
      description: form.description, available: form.available,
    });
    setSaving(false);
  };

  const input = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 text-sm transition-colors';

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-6 mb-6 border border-white/10">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <Plus className="w-4 h-4 text-red-500" /> Agregar Vehículo
      </h3>

      {/* Row 1 — name + image */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-white/40 text-xs uppercase tracking-wider">Nombre *</p>
          <input className={input} placeholder="Ej. BMW Serie 7" value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <p className="text-white/40 text-xs uppercase tracking-wider">URL de imagen *</p>
          <input className={input} placeholder="https://..." value={form.image} onChange={e => set('image', e.target.value)} required />
        </div>
      </div>

      {/* Row 2 — price + year */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-white/40 text-xs uppercase tracking-wider">Precio por día (COP) *</p>
          <input className={input} placeholder="Ej. 450000" type="number" value={form.price} onChange={e => set('price', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <p className="text-white/40 text-xs uppercase tracking-wider">Año</p>
          <input className={input} placeholder="Ej. 2024" type="number" value={form.year} onChange={e => set('year', Number(e.target.value))} />
        </div>
      </div>

      {/* Categoría — pill grid */}
      <PillGroup label="Categoría" options={CAR_CATEGORIES} value={form.category} onChange={v => set('category', v)} />

      {/* Transmisión + Combustible */}
      <div className="grid grid-cols-2 gap-6">
        <PillGroup label="Transmisión" options={TRANSMISSION_OPTIONS} value={form.transmission} onChange={v => set('transmission', v)} />
        <PillGroup label="Combustible"  options={FUEL_OPTIONS}         value={form.fuel}         onChange={v => set('fuel', v)} />
      </div>

      {/* Steppers */}
      <div className="flex gap-8">
        <Stepper label="Asientos" value={form.seats} min={2} max={9} onChange={v => set('seats', v)} />
        <Stepper label="Puertas"  value={form.doors} min={2} max={6} onChange={v => set('doors', v)} />
      </div>

      {/* Características + descripción */}
      <div className="space-y-2">
        <p className="text-white/40 text-xs uppercase tracking-wider">Características <span className="normal-case">(separadas por coma)</span></p>
        <input className={input} placeholder="Ej. GPS, Techo solar, Asientos de cuero" value={form.features} onChange={e => set('features', e.target.value)} />
      </div>
      <div className="space-y-2">
        <p className="text-white/40 text-xs uppercase tracking-wider">Descripción</p>
        <textarea className={`${input} h-20 resize-none`} placeholder="Descripción del vehículo..." value={form.description} onChange={e => set('description', e.target.value)} />
      </div>

      {/* Disponible toggle */}
      <button
        type="button"
        onClick={() => set('available', !form.available)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-all ${
          form.available
            ? 'bg-green-500/15 border-green-500/30 text-green-400'
            : 'bg-white/5 border-white/10 text-white/40'
        }`}
      >
        <div className={`w-9 h-5 rounded-full relative transition-colors ${form.available ? 'bg-green-500' : 'bg-white/20'}`}>
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.available ? 'left-4' : 'left-0.5'}`} />
        </div>
        {form.available ? 'Disponible para reservas' : 'No disponible'}
      </button>

      <div className="flex gap-3 justify-end pt-2 border-t border-white/10">
        <button type="button" onClick={onCancel} className="px-5 py-2 rounded-xl glass text-white/70 hover:text-white text-sm transition-colors">Cancelar</button>
        <button type="submit" disabled={saving} className="btn-primary text-sm px-5 py-2">{saving ? 'Guardando…' : 'Guardar Vehículo'}</button>
      </div>
    </form>
  );
}

interface ActionModalProps {
  reservation: Reservation;
  action: 'confirmed' | 'cancelled' | 'completed';
  cars: CarType[];
  onConfirm: (msg: string) => void;
  onCancel: () => void;
}
function ActionModal({ reservation, action, cars, onConfirm, onCancel }: ActionModalProps) {
  const [msg, setMsg] = useState('');
  const car = cars.find(c => c.id === reservation.carId);
  const labels = { confirmed: 'Confirmar reserva', cancelled: 'Cancelar reserva', completed: 'Marcar como completada' };
  const colors = { confirmed: 'bg-green-600 hover:bg-green-700', cancelled: 'bg-red-600 hover:bg-red-700', completed: 'bg-blue-600 hover:bg-blue-700' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-white font-semibold text-lg">{labels[action]}</h3>
        <p className="text-white/60 text-sm">
          Reserva #{reservation.id} — <span className="text-white">{car?.name ?? 'Vehículo'}</span>
        </p>
        <div>
          <label className="text-white/50 text-xs mb-1 block">Mensaje al cliente (opcional)</label>
          <textarea
            value={msg}
            onChange={e => setMsg(e.target.value)}
            rows={3}
            placeholder="Escribe un mensaje para el cliente..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 text-sm resize-none"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-5 py-2 rounded-xl glass text-white/70 hover:text-white text-sm">Volver</button>
          <button onClick={() => onConfirm(msg)} className={`px-5 py-2 rounded-xl text-white text-sm font-medium transition-colors ${colors[action]}`}>
            {labels[action]}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { logout, user: authUser } = useAuth();
  const {
    cars, allReservations, allUsers, stats,
    addCar, deleteCar, updateReservationStatus, updateUserRole,
  } = useAdmin();

  const [tab, setTab]             = useState<'dashboard' | 'cars' | 'reservations' | 'users' | 'quotes' | 'chat'>('dashboard');
  const [carSearch, setCarSearch]   = useState('');
  const [showAddCar, setShowAddCar] = useState(false);
  const [expandedRes, setExpandedRes] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{
    reservation: Reservation;
    action: 'confirmed' | 'cancelled' | 'completed';
  } | null>(null);

  // Quotes
  const [quotes, setQuotes]             = useState<Quote[]>([]);
  const [quotesFilter, setQuotesFilter] = useState<'all' | 'new' | 'attended'>('all');

  useEffect(() => {
    if (tab === 'quotes') {
      api.getQuotes().then(setQuotes).catch(console.error);
    }
  }, [tab]);

  const markAttended = async (q: Quote) => {
    const updated = await api.updateQuoteStatus(q.id, q.status === 'new' ? 'attended' : 'new');
    setQuotes(prev => prev.map(x => x.id === updated.id ? updated : x));
  };

  const removeQuote = async (id: number) => {
    await api.deleteQuote(id);
    setQuotes(prev => prev.filter(x => x.id !== id));
  };

  const filteredQuotes = quotes.filter(q => quotesFilter === 'all' || q.status === quotesFilter);

  const filteredCars = cars.filter(c =>
    c.name.toLowerCase().includes(carSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(carSearch.toLowerCase())
  );

  const handleAddCar = async (car: Omit<CarType, 'id'>) => {
    await addCar(car);
    setShowAddCar(false);
  };

  const handleAction = async (msg: string) => {
    if (!actionModal) return;
    await updateReservationStatus(actionModal.reservation.id, actionModal.action, msg);
    setActionModal(null);
  };

  return (
    <div className="min-h-screen bg-black flex justify-center py-20 px-4">
      <div className="w-full max-w-6xl glass-card rounded-3xl overflow-hidden flex flex-col h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Panel de Administración</h2>
              <p className="text-white/50 text-sm">Gestión completa del sistema</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); window.location.href = '/'; }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-white/70 hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-black/30 shrink-0 overflow-x-auto">
          {([
            { id: 'dashboard',    label: 'Dashboard',    Icon: BarChart3      },
            { id: 'cars',         label: 'Vehículos',    Icon: Car            },
            { id: 'reservations', label: 'Reservas',     Icon: Calendar       },
            { id: 'users',        label: 'Clientes',     Icon: Users          },
            { id: 'quotes',       label: 'Cotizaciones', Icon: FileText       },
            { id: 'chat',         label: 'Chat',         Icon: MessageCircle  },
          ] as { id: typeof tab; label: string; Icon: React.ElementType }[]).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                tab === id
                  ? 'text-red-500 border-b-2 border-red-500 bg-red-500/5'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Clientes',    value: stats.totalUsers,        Icon: Users,    color: 'blue'   },
                  { label: 'Vehículos',   value: stats.totalCars,         Icon: Car,      color: 'green'  },
                  { label: 'Reservas',    value: stats.totalReservations, Icon: Calendar, color: 'yellow' },
                  { label: 'Ingresos',    value: formatPrice(stats.totalRevenue), Icon: DollarSign, color: 'red' },
                ].map(({ label, value, Icon, color }) => (
                  <div key={label} className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${color}-500`} />
                      </div>
                      <span className="text-white/50 text-sm">{label}</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Pendientes',  value: stats.pendingReservations,   color: 'yellow' },
                  { label: 'Confirmadas', value: stats.confirmedReservations,  color: 'green'  },
                  { label: 'Completadas', value: stats.completedReservations,  color: 'blue'   },
                  { label: 'Canceladas',  value: stats.cancelledReservations,  color: 'red'    },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`glass rounded-2xl p-4 border border-${color}-500/20`}>
                    <div className={`text-${color}-400 text-sm mb-1`}>{label}</div>
                    <div className="text-2xl font-bold text-white">{value ?? 0}</div>
                  </div>
                ))}
              </div>

              {(stats.topCars?.length ?? 0) > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-red-500" /> Vehículos Más Reservados
                  </h3>
                  <div className="space-y-3">
                    {stats.topCars!.map(({ car, count }, i) => (
                      <div key={car?.id ?? i} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center text-red-500 font-bold text-sm">{i + 1}</div>
                        {car?.image && <img src={car.image} alt={car.name} className="w-12 h-8 object-cover rounded-lg" />}
                        <div className="flex-1">
                          <div className="text-white text-sm">{car?.name}</div>
                          <div className="text-white/50 text-xs">{car?.category}</div>
                        </div>
                        <div className="text-red-500 font-semibold text-sm">{count} reservas</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {allReservations.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Reservas Recientes</h3>
                  <div className="space-y-2">
                    {allReservations.slice(0, 5).map(r => {
                      const car = cars.find(c => c.id === r.carId);
                      return (
                        <div key={r.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div>
                            <span className="text-white text-sm">{r.customerName}</span>
                            <span className="text-white/40 text-xs ml-2">— {car?.name ?? 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-red-500 text-sm font-medium">{formatPrice(r.totalPrice)}</span>
                            <StatusBadge status={r.status} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── CARS ── */}
          {tab === 'cars' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text" value={carSearch} onChange={e => setCarSearch(e.target.value)}
                    placeholder="Buscar vehículo..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 text-sm"
                  />
                </div>
                <button
                  onClick={() => setShowAddCar(v => !v)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-colors ${showAddCar ? 'bg-white/10 text-white' : 'btn-primary'}`}
                >
                  <Plus className="w-4 h-4" /> {showAddCar ? 'Cerrar' : 'Agregar Vehículo'}
                </button>
              </div>

              {showAddCar && <AddCarForm onAdd={handleAddCar} onCancel={() => setShowAddCar(false)} />}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCars.map(car => (
                  <div key={car.id} className="glass rounded-2xl overflow-hidden group">
                    <div className="relative h-40">
                      <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => { if (confirm('¿Eliminar este vehículo?')) deleteCar(car.id); }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                      {!car.available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">No Disponible</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-semibold">{car.name}</h4>
                      <p className="text-white/50 text-sm">{car.category}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-red-500 font-bold text-sm">{formatPrice(car.price)}/día</span>
                        <span className="text-white/50 text-xs">{car.seats} plazas · {car.doors ?? 4} puertas</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RESERVATIONS ── */}
          {tab === 'reservations' && (
            <div className="space-y-3">
              {allReservations.length === 0 && (
                <p className="text-white/40 text-center py-10">No hay reservas aún.</p>
              )}
              {allReservations.map(reservation => {
                const car  = cars.find(c => c.id === reservation.carId);
                const expanded = expandedRes === reservation.id;
                return (
                  <div key={reservation.id} className="glass rounded-2xl overflow-hidden">
                    {/* Summary row */}
                    <button
                      className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/3 transition-colors"
                      onClick={() => setExpandedRes(expanded ? null : reservation.id)}
                    >
                      {car?.image && <img src={car.image} alt={car.name} className="w-14 h-10 object-cover rounded-lg shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm truncate">{reservation.customerName}</div>
                        <div className="text-white/50 text-xs">{car?.name ?? 'N/A'}</div>
                      </div>
                      <div className="text-red-500 font-semibold text-sm shrink-0">{formatPrice(reservation.totalPrice)}</div>
                      <StatusBadge status={reservation.status} />
                      <ChevronDown className={`w-4 h-4 text-white/40 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Expanded detail */}
                    {expanded && (
                      <div className="border-t border-white/10 p-4 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-white/40 text-xs mb-0.5">Cliente</p>
                            <p className="text-white">{reservation.customerName}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs mb-0.5 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
                            <p className="text-white/80">{reservation.customerEmail}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs mb-0.5 flex items-center gap-1"><Phone className="w-3 h-3" /> Teléfono</p>
                            <p className="text-white/80">{reservation.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs mb-0.5">Recogida</p>
                            <p className="text-white/80">{new Date(reservation.pickupDate).toLocaleDateString('es-CO')}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs mb-0.5">Devolución</p>
                            <p className="text-white/80">{new Date(reservation.returnDate).toLocaleDateString('es-CO')}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs mb-0.5">Lugar de recogida</p>
                            <p className="text-white/80">{reservation.pickupLocation}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs mb-0.5">Con conductor</p>
                            <p className="text-white/80">{reservation.withDriver ? 'Sí' : 'No'}</p>
                          </div>
                          {reservation.additionalNotes && (
                            <div className="col-span-2">
                              <p className="text-white/40 text-xs mb-0.5">Notas</p>
                              <p className="text-white/80">{reservation.additionalNotes}</p>
                            </div>
                          )}
                        </div>

                        {reservation.adminMessage && (
                          <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                            <MessageSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-blue-300 text-xs font-medium mb-0.5">Mensaje enviado al cliente</p>
                              <p className="text-white/70 text-sm">{reservation.adminMessage}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap">
                          {reservation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => setActionModal({ reservation, action: 'confirmed' })}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 text-sm transition-colors"
                              >
                                <Check className="w-4 h-4" /> Confirmar
                              </button>
                              <button
                                onClick={() => setActionModal({ reservation, action: 'cancelled' })}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition-colors"
                              >
                                <XCircle className="w-4 h-4" /> Cancelar
                              </button>
                            </>
                          )}
                          {reservation.status === 'confirmed' && (
                            <>
                              <button
                                onClick={() => setActionModal({ reservation, action: 'completed' })}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm transition-colors"
                              >
                                <Check className="w-4 h-4" /> Marcar completada
                              </button>
                              <button
                                onClick={() => setActionModal({ reservation, action: 'cancelled' })}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition-colors"
                              >
                                <XCircle className="w-4 h-4" /> Cancelar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── USERS ── */}
          {tab === 'users' && (
            <div className="space-y-3">
              {allUsers.length === 0 && (
                <p className="text-white/40 text-center py-10">No hay usuarios aún.</p>
              )}
              {allUsers.map(u => {
                const resCount = allReservations.filter(r => r.userId === u.id).length;
                const isSelf = authUser?.id === u.id;
                return (
                  <div key={u.id} className="glass rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-400 font-bold text-sm shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">{u.name}</span>
                        {u.role === 'admin' && <Shield className="w-3.5 h-3.5 text-red-400" />}
                        {isSelf && <span className="text-white/30 text-xs">(tú)</span>}
                      </div>
                      <div className="text-white/50 text-xs">{u.email}</div>
                    </div>
                    <div className="text-white/40 text-xs shrink-0">{resCount} reservas</div>
                    <div className="text-white/40 text-xs shrink-0 hidden md:block">
                      {new Date(u.createdAt).toLocaleDateString('es-CO')}
                    </div>
                    {!isSelf && (
                      <button
                        onClick={() => updateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                          u.role === 'admin'
                            ? 'bg-white/10 text-white/60 hover:bg-white/15'
                            : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                        }`}
                      >
                        {u.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── QUOTES ── */}
          {tab === 'quotes' && (
            <div className="space-y-4">
              {/* filter */}
              <div className="flex items-center gap-2">
                {(['all', 'new', 'attended'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setQuotesFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      quotesFilter === f
                        ? 'bg-red-600/20 border-red-500/40 text-red-400'
                        : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    {{ all: 'Todas', new: 'Nuevas', attended: 'Atendidas' }[f]} 
                    {f !== 'all' && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({quotes.filter(q => q.status === f).length})
                      </span>
                    )}
                  </button>
                ))}
                <div className="ml-auto text-white/40 text-xs flex items-center gap-1">
                  <Inbox className="w-3.5 h-3.5" />
                  {filteredQuotes.length} cotizaci{filteredQuotes.length === 1 ? 'ón' : 'ones'}
                </div>
              </div>

              {filteredQuotes.length === 0 && (
                <div className="glass rounded-2xl p-12 text-center">
                  <FileText className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No hay cotizaciones {quotesFilter !== 'all' ? `"${quotesFilter === 'new' ? 'nuevas' : 'atendidas'}"` : ''}.</p>
                </div>
              )}

              <div className="space-y-3">
                {filteredQuotes.map(q => (
                  <div key={q.id} className={`glass rounded-2xl p-5 border transition-all ${
                    q.status === 'new' ? 'border-yellow-500/20' : 'border-white/5'
                  }`}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-400 font-bold text-sm shrink-0">
                          {q.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{q.name}</p>
                          <p className="text-white/40 text-xs">
                            {new Date(q.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${
                        q.status === 'new'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-green-500/20 text-green-400 border-green-500/30'
                      }`}>
                        {q.status === 'new' ? <><Clock className="w-3 h-3" /> Nueva</> : <><CheckCheck className="w-3 h-3" /> Atendida</>}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-3 text-xs">
                      <a href={`mailto:${q.email}`} className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5" /> {q.email}
                      </a>
                      <a href={`tel:${q.phone}`} className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5" /> {q.phone}
                      </a>
                    </div>

                    <div className="bg-white/3 border border-white/8 rounded-xl p-3 mb-4">
                      <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{q.message}</p>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => markAttended(q)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors border ${
                          q.status === 'new'
                            ? 'bg-green-500/15 border-green-500/25 text-green-400 hover:bg-green-500/25'
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                        }`}
                      >
                        {q.status === 'new' ? <><Check className="w-3.5 h-3.5" /> Marcar atendida</> : 'Marcar nueva'}
                      </button>
                      <button
                        onClick={() => { if (confirm('¿Eliminar esta cotización?')) removeQuote(q.id); }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CHAT ── */}
          {tab === 'chat' && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Chat con Clientes</h3>
              <AdminChatTab />
            </div>
          )}

        </div>
      </div>

      {actionModal && (
        <ActionModal
          reservation={actionModal.reservation}
          action={actionModal.action}
          cars={cars}
          onConfirm={handleAction}
          onCancel={() => setActionModal(null)}
        />
      )}
    </div>
  );
}

