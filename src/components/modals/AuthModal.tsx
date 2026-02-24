import { useState } from 'react';
import { X, User, Mail, Lock, Phone, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          setSuccess('¡Bienvenido!');
          setTimeout(() => {
            onClose();
            setSuccess('');
          }, 1000);
        } else {
          setError(result.error || 'Error al iniciar sesión');
        }
      } else {
        const result = await register(formData.name, formData.email, formData.password, formData.phone);
        if (result.success) {
          setSuccess('¡Cuenta creada exitosamente!');
          setTimeout(() => {
            onClose();
            setSuccess('');
          }, 1000);
        } else {
          setError(result.error || 'Error al registrarse');
        }
      }
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md glass-card rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                  placeholder="Tu nombre"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-white/70 text-sm mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="tu@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required={!isLogin}
                  placeholder="+57 300 000 0000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="text-red-500 hover:text-red-400 font-medium"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="mt-4 p-3 glass rounded-xl text-center">
              <p className="text-white/50 text-xs mb-1">Cuenta de administrador:</p>
              <p className="text-white/70 text-xs">admin@carrentalmedellin.com / admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
