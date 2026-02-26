import { useState, useEffect } from 'react';
import { 
  X, Users, Car, Calendar, DollarSign, TrendingUp, 
  Trash2, Check, XCircle, Clock, Search,
  LogOut, BarChart3, Plus, MessageSquare, MessageCircle, Send
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useReservations';
import { api } from '@/services/api';
import { toast } from 'sonner';
import type { Reservation, Quote, Car as CarType } from '@/types';
import AdminChatTab from '@/components/chat/AdminChatTab';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminDashboard = ({ isOpen, onClose }: AdminDashboardProps) => {
  const { logout } = useAuth();
  const { 
    cars, 
    allReservations, 
    allUsers, 
    stats, 
    addCar,
    deleteCar,
    updateReservationStatus,
  } = useAdmin();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cars' | 'reservations' | 'users' | 'quotes' | 'chat'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Car
  const [showAddCar, setShowAddCar] = useState(false);
  const [addCarLoading, setAddCarLoading] = useState(false);
  const [addCarForm, setAddCarForm] = useState<Omit<CarType, 'id'>>({
    name: '', category: '', image: '', price: 0, seats: 5, doors: 4,
    transmission: 'Automática', fuel: 'Gasolina', features: [],
    description: '', year: new Date().getFullYear(), available: true,
  });

  // Admin message modal for reservation status
  const [adminAction, setAdminAction] = useState<{ id: string; status: Reservation['status'] } | null>(null);
  const [adminMessage, setAdminMessage] = useState('');

  // Quotes
  const [quotes, setQuotes] = useState<Quote[]>([]);
  useEffect(() => {
    api.getQuotes()
      .then(setQuotes)
      .catch(e => console.error('Error fetching quotes', e));
  }, []);

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleDeleteCar = async (id: number) => {
    if (!confirm('¿Eliminar este vehículo?')) return;
    try {
      await deleteCar(id);
      toast.success('Vehículo eliminado correctamente');
    } catch {
      toast.error('Error al eliminar el vehículo');
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddCarLoading(true);
    try {
      await addCar(addCarForm);
      toast.success('Vehículo agregado correctamente');
      setShowAddCar(false);
      setAddCarForm({ name: '', category: '', image: '', price: 0, seats: 5, doors: 4, transmission: 'Automática', fuel: 'Gasolina', features: [], description: '', year: new Date().getFullYear(), available: true });
    } catch {
      toast.error('Error al agregar el vehículo');
    } finally {
      setAddCarLoading(false);
    }
  };

  const openAdminAction = (id: string, status: Reservation['status']) => {
    setAdminAction({ id, status });
    setAdminMessage('');
  };

  const confirmAdminAction = async () => {
    if (!adminAction) return;
    try {
      await updateReservationStatus(adminAction.id, adminAction.status, adminMessage);
      toast.success('Reserva actualizada correctamente');
      setAdminAction(null);
    } catch {
      toast.error('Error al actualizar la reserva');
    }
  };

  const handleDeleteQuote = async (id: number) => {
    if (!confirm('¿Eliminar esta cotización?')) return;
    try {
      await api.deleteQuote(id);
      setQuotes(prev => prev.filter(q => q.id !== id));
      toast.success('Cotización eliminada');
    } catch {
      toast.error('Error al eliminar la cotización');
    }
  };

  const handleMarkAttended = async (id: number) => {
    try {
      const updated = await api.updateQuoteStatus(id, 'attended');
      setQuotes(prev => prev.map(q => q.id === id ? updated : q));
      toast.success('Cotización marcada como atendida');
    } catch {
      toast.error('Error al actualizar cotización');
    }
  };

  const getStatusIcon = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return <Check className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed': return <Check className="w-4 h-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusClass = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  // Filter cars
  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden glass-card rounded-3xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Panel de Administración</h2>
              <p className="text-white/50 text-sm">Gestión completa del sistema</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-white/70 hover:text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-black/30 overflow-x-auto scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'cars', label: 'Vehículos', icon: Car },
            { id: 'reservations', label: 'Reservas', icon: Calendar },
            { id: 'users', label: 'Clientes', icon: Users },
            { id: 'quotes', label: 'Cotizaciones', icon: MessageSquare },
            { id: 'chat', label: 'Chat', icon: MessageCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'text-red-500 border-b-2 border-red-500 bg-red-500/5' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-white/50 text-sm">Clientes</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                </div>
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Car className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-white/50 text-sm">Vehículos</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.totalCars}</div>
                </div>
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-yellow-500" />
                    </div>
                    <span className="text-white/50 text-sm">Reservas</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.totalReservations}</div>
                </div>
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="text-white/50 text-sm">Ingresos</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{formatPrice(stats.totalRevenue)}</div>
                </div>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-2xl p-4 border border-yellow-500/20">
                  <div className="text-yellow-500 text-sm mb-1">Pendientes</div>
                  <div className="text-2xl font-bold text-white">{stats.pendingReservations}</div>
                </div>
                <div className="glass rounded-2xl p-4 border border-green-500/20">
                  <div className="text-green-500 text-sm mb-1">Confirmadas</div>
                  <div className="text-2xl font-bold text-white">{stats.confirmedReservations}</div>
                </div>
                <div className="glass rounded-2xl p-4 border border-blue-500/20">
                  <div className="text-blue-500 text-sm mb-1">Completadas</div>
                  <div className="text-2xl font-bold text-white">{stats.completedReservations}</div>
                </div>
              </div>

              {/* Top Cars */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  Vehículos Más Reservados
                </h3>
                <div className="space-y-3">
                  {stats.topCars?.map(({ car, count }, index) => (
                    <div key={car?.id} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center text-red-500 font-bold text-sm">
                        {index + 1}
                      </div>
                      {car && (
                        <img 
                          src={car.image} 
                          alt={car.name}
                          className="w-12 h-8 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="text-white text-sm">{car?.name}</div>
                        <div className="text-white/50 text-xs">{car?.category}</div>
                      </div>
                      <div className="text-red-500 font-semibold">{count} reservas</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cars' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar vehículo..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>
                <button
                  onClick={() => setShowAddCar(true)}
                  className="ml-4 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Vehículo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCars.map((car) => (
                  <div key={car.id} className="glass rounded-2xl overflow-hidden">
                    <div className="relative h-40">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => handleDeleteCar(car.id)}
                          className="w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      {!car.available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-semibold">No Disponible</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-semibold">{car.name}</h4>
                      <p className="text-white/50 text-sm">{car.category}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-red-500 font-bold">{formatPrice(car.price)}/día</span>
                        <span className="text-white/50 text-sm">{car.seats} plazas</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left text-white/50 text-sm p-4">ID</th>
                      <th className="text-left text-white/50 text-sm p-4">Cliente</th>
                      <th className="text-left text-white/50 text-sm p-4">Vehículo</th>
                      <th className="text-left text-white/50 text-sm p-4">Fechas</th>
                      <th className="text-left text-white/50 text-sm p-4">Total</th>
                      <th className="text-left text-white/50 text-sm p-4">Estado</th>
                      <th className="text-left text-white/50 text-sm p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allReservations.map((reservation) => {
                      const car = cars.find(c => c.id === reservation.carId);
                      const user = allUsers.find(u => u.id === reservation.userId);
                      return (
                        <tr key={reservation.id} className="border-t border-white/5">
                          <td className="p-4 text-white text-sm">{reservation.id}</td>
                          <td className="p-4 text-white text-sm">{user?.name || reservation.customerName}</td>
                          <td className="p-4 text-white text-sm">{car?.name || 'N/A'}</td>
                          <td className="p-4 text-white/70 text-sm">
                            {new Date(reservation.pickupDate).toLocaleDateString('es-CO')} - 
                            {new Date(reservation.returnDate).toLocaleDateString('es-CO')}
                          </td>
                          <td className="p-4 text-red-500 font-semibold text-sm">
                            {formatPrice(reservation.totalPrice)}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full border text-xs flex items-center gap-1.5 w-fit ${getStatusClass(reservation.status)}`}>
                              {getStatusIcon(reservation.status)}
                              {reservation.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {reservation.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => openAdminAction(reservation.id, 'confirmed')}
                                    title="Confirmar"
                                    className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center hover:bg-green-500/30"
                                  >
                                    <Check className="w-4 h-4 text-green-500" />
                                  </button>
                                  <button
                                    onClick={() => openAdminAction(reservation.id, 'cancelled')}
                                    title="Cancelar"
                                    className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center hover:bg-red-500/30"
                                  >
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  </button>
                                </>
                              )}
                              {reservation.status === 'confirmed' && (
                                <button
                                  onClick={() => openAdminAction(reservation.id, 'completed')}
                                  title="Completar"
                                  className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center hover:bg-blue-500/30"
                                >
                                  <Check className="w-4 h-4 text-blue-500" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left text-white/50 text-sm p-4">Nombre</th>
                      <th className="text-left text-white/50 text-sm p-4">Email</th>
                      <th className="text-left text-white/50 text-sm p-4">Teléfono</th>
                      <th className="text-left text-white/50 text-sm p-4">Registro</th>
                      <th className="text-left text-white/50 text-sm p-4">Reservas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => {
                      const userReservations = allReservations.filter(r => r.userId === user.id);
                      return (
                        <tr key={user.id} className="border-t border-white/5">
                          <td className="p-4 text-white text-sm">{user.name}</td>
                          <td className="p-4 text-white/70 text-sm">{user.email}</td>
                          <td className="p-4 text-white/70 text-sm">{user.phone}</td>
                          <td className="p-4 text-white/70 text-sm">
                            {new Date(user.createdAt).toLocaleDateString('es-CO')}
                          </td>
                          <td className="p-4 text-red-500 font-semibold text-sm">
                            {userReservations.length}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="space-y-4">
              {quotes.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">No hay cotizaciones aún</p>
                </div>
              ) : (
                quotes.map((quote) => (
                  <div key={quote.id} className="glass rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold">{quote.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            quote.status === 'new'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {quote.status === 'new' ? 'Nuevo' : 'Atendido'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-white/50 text-sm">
                          <span>{quote.email}</span>
                          <span>{quote.phone}</span>
                          <span>{new Date(quote.createdAt).toLocaleDateString('es-CO')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {quote.status === 'new' && (
                          <button
                            onClick={() => handleMarkAttended(quote.id)}
                            title="Marcar como atendido"
                            className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center hover:bg-green-500/30"
                          >
                            <Check className="w-4 h-4 text-green-500" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          title="Eliminar"
                          className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm bg-white/5 rounded-lg p-3">{quote.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === 'chat' && <AdminChatTab />}
        </div>
      </div>

      {/* Add Car Modal */}
      {showAddCar && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowAddCar(false)} />
          <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Agregar Vehículo</h3>
              <button onClick={() => setShowAddCar(false)} className="w-8 h-8 rounded-xl glass flex items-center justify-center hover:bg-white/10">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <form onSubmit={handleAddCar} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs mb-1">Nombre</label>
                  <input required value={addCarForm.name} onChange={e => setAddCarForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1">Categoría</label>
                  <input required value={addCarForm.category} onChange={e => setAddCarForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50" />
                </div>
                <div className="col-span-2">
                  <label className="block text-white/50 text-xs mb-1">URL de Imagen</label>
                  <input required value={addCarForm.image} onChange={e => setAddCarForm(p => ({ ...p, image: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1">Precio/día (COP)</label>
                  <input required type="number" value={addCarForm.price} onChange={e => setAddCarForm(p => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1">Año</label>
                  <input required type="number" value={addCarForm.year} onChange={e => setAddCarForm(p => ({ ...p, year: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1">Asientos</label>
                  <input required type="number" value={addCarForm.seats} onChange={e => setAddCarForm(p => ({ ...p, seats: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1">Puertas</label>
                  <input required type="number" value={addCarForm.doors} onChange={e => setAddCarForm(p => ({ ...p, doors: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1">Transmisión</label>
                  <select value={addCarForm.transmission} onChange={e => setAddCarForm(p => ({ ...p, transmission: e.target.value as any }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50">
                    <option value="Automática">Automática</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1">Combustible</label>
                  <input value={addCarForm.fuel} onChange={e => setAddCarForm(p => ({ ...p, fuel: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50" />
                </div>
                <div className="col-span-2">
                  <label className="block text-white/50 text-xs mb-1">Descripción</label>
                  <textarea value={addCarForm.description} onChange={e => setAddCarForm(p => ({ ...p, description: e.target.value }))}
                    rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50 resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-white/50 text-xs mb-1">Características (separadas por coma)</label>
                  <input
                    value={addCarForm.features.join(', ')}
                    onChange={e => setAddCarForm(p => ({ ...p, features: e.target.value.split(',').map(f => f.trim()).filter(Boolean) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="available" checked={addCarForm.available} onChange={e => setAddCarForm(p => ({ ...p, available: e.target.checked }))}
                    className="accent-red-500" />
                  <label htmlFor="available" className="text-white/70 text-sm">Disponible</label>
                </div>
              </div>
              <button type="submit" disabled={addCarLoading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                {addCarLoading ? 'Guardando...' : <><Plus className="w-4 h-4" /> Agregar Vehículo</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Message Modal */}
      {adminAction && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setAdminAction(null)} />
          <div className="relative w-full max-w-md glass-card rounded-3xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">
              {adminAction.status === 'confirmed' ? 'Confirmar Reserva' :
               adminAction.status === 'cancelled' ? 'Cancelar Reserva' : 'Completar Reserva'}
            </h3>
            <p className="text-white/50 text-sm mb-4">Puedes agregar un mensaje opcional para el cliente.</p>
            <textarea
              value={adminMessage}
              onChange={e => setAdminMessage(e.target.value)}
              placeholder="Mensaje para el cliente (opcional)..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setAdminAction(null)}
                className="flex-1 py-2 rounded-xl glass text-white/70 hover:text-white transition-colors text-sm">
                Cancelar
              </button>
              <button onClick={confirmAdminAction}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors text-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
