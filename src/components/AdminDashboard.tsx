import { useState } from 'react';
import { 
  X, Users, Car, Calendar, DollarSign, TrendingUp, 
  Trash2, Check, XCircle, Clock, Search,
  LogOut, BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useReservations';
import type { Reservation } from '@/types';

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
    // addCar, 
    // updateCar, 
    deleteCar,
    updateReservationStatus,
    // refreshData
  } = useAdmin();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cars' | 'reservations' | 'users'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  // const [showAddCar, setShowAddCar] = useState(false);
  // const [editingCar, setEditingCar] = useState<CarType | null>(null);

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
        <div className="flex border-b border-white/10 bg-black/30">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'cars', label: 'Vehículos', icon: Car },
            { id: 'reservations', label: 'Reservas', icon: Calendar },
            { id: 'users', label: 'Clientes', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
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
                {/* <button
                  onClick={() => setShowAddCar(true)}
                  className="btn-primary flex items-center gap-2 ml-4"
                >
                  <Plus className="w-5 h-5" />
                  Agregar Vehículo
                </button> */}
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
                        {/* <button
                          onClick={() => setEditingCar(car)}
                          className="w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-white" />
                        </button> */}
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar este vehículo?')) {
                              deleteCar(car.id);
                            }
                          }}
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
                                    onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                                    className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center hover:bg-green-500/30"
                                  >
                                    <Check className="w-4 h-4 text-green-500" />
                                  </button>
                                  <button
                                    onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                                    className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center hover:bg-red-500/30"
                                  >
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  </button>
                                </>
                              )}
                              {reservation.status === 'confirmed' && (
                                <button
                                  onClick={() => updateReservationStatus(reservation.id, 'completed')}
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
