import { useState } from 'react';
import { Calendar, Car, DollarSign, MapPin, Phone, Mail, User, LogOut, Check, Clock, XCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useReservationsContext } from '@/contexts/ReservationsContext';
import { fmtDate } from '@/lib/utils';
import { type Reservation } from '@/types';

const UserDashboardPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'reservations' | 'profile'>('reservations');

  const { reservations, cancelReservation, cars } = useReservationsContext();

  if (!user) return null;

  const getCarById = (carId: number) => cars.find(c => c.id === carId);

  const getStatusIcon = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return <Check className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed': return <Check className="w-4 h-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black p-4 py-20 flex justify-center">

      <div className="relative w-full max-w-4xl overflow-hidden glass-card rounded-3xl flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 flex items-center justify-center">
              <User className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Mi Cuenta</h2>
              <p className="text-white/50 text-sm">{user.email}</p>
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
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'reservations'
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-white/50 hover:text-white'
              }`}
          >
            Mis Reservas
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'profile'
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-white/50 hover:text-white'
              }`}
          >
            Mi Perfil
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'reservations' ? (
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">No tienes reservas</h3>
                  <p className="text-white/50">Explora nuestra flota y haz tu primera reserva</p>
                </div>
              ) : (
                reservations.map((reservation) => {
                  const car = getCarById(reservation.carId);
                  return (
                    <div key={reservation.id} className="glass rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {car && (
                            <img
                              src={car.image}
                              alt={car.name}
                              className="w-16 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h4 className="text-white font-semibold">{car?.name || 'Vehículo'}</h4>
                            <p className="text-white/50 text-sm">{reservation.id}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 ${getStatusClass(reservation.status)}`}>
                          {getStatusIcon(reservation.status)}
                          <span className="text-xs font-medium">{getStatusText(reservation.status)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-white/50 text-xs mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Recogida
                          </div>
                          <div className="text-white text-sm">{fmtDate(reservation.pickupDate)}</div>
                        </div>
                        <div>
                          <div className="text-white/50 text-xs mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Devolución
                          </div>
                          <div className="text-white text-sm">{fmtDate(reservation.returnDate)}</div>
                        </div>
                        <div>
                          <div className="text-white/50 text-xs mb-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Lugar
                          </div>
                          <div className="text-white text-sm truncate">{reservation.pickupLocation}</div>
                        </div>
                        <div>
                          <div className="text-white/50 text-xs mb-1 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" /> Total
                          </div>
                          <div className="text-red-500 font-semibold text-sm">{formatPrice(reservation.totalPrice)}</div>
                        </div>
                      </div>

                      {reservation.withDriver && (
                        <div className="text-white/50 text-xs mb-3">
                          ✓ Incluye conductor
                        </div>
                      )}

                      {reservation.adminMessage && (
                        <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-3">
                          <MessageSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-blue-300 text-xs font-medium mb-0.5">Mensaje del equipo</p>
                            <p className="text-white/70 text-sm">{reservation.adminMessage}</p>
                          </div>
                        </div>
                      )}

                      {reservation.status === 'pending' && (
                        <button
                          onClick={() => cancelReservation(reservation.id)}
                          className="text-red-500 text-sm hover:text-red-400"
                        >
                          Cancelar reserva
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Información Personal</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">Nombre</div>
                      <div className="text-white">{user.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">Email</div>
                      <div className="text-white">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">Teléfono</div>
                      <div className="text-white">{user.phone}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Estadísticas</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{reservations.length}</div>
                    <div className="text-white/50 text-xs">Total Reservas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {reservations.filter(r => r.status === 'completed').length}
                    </div>
                    <div className="text-white/50 text-xs">Completadas</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-red-500">
                      {formatPrice(reservations.filter(r => r.status !== 'cancelled').reduce((sum, r) => sum + r.totalPrice, 0))}
                    </div>
                    <div className="text-white/50 text-xs">Total Gastado</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
