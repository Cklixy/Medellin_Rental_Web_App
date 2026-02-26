import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, Menu, X } from 'lucide-react';
import AuthModal from '@/components/modals/AuthModal';

const NAV_LINKS = [
    { label: 'Inicio',    anchor: 'hero'     },
    { label: 'Flota',     path:   '/fleet'   },
    { label: 'Servicios', anchor: 'services' },
    { label: 'Tours',     anchor: 'tours'    },
    { label: 'Contacto',  anchor: 'contact'  },
];

const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export function Navbar() {
    const { user, isAdmin } = useAuth();
    const [showAuth, setShowAuth] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent, item: typeof NAV_LINKS[number]) => {
        e.preventDefault();
        setMobileOpen(false);
        if ('path' in item) {
            navigate(item.path!);
            return;
        }
        const id = item.anchor!;
        if (location.pathname === '/') {
            scrollTo(id);
        } else {
            navigate('/');
            setTimeout(() => scrollTo(id), 150);
        }
    };

    return (
        <>
            {/* Desktop nav pill */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 glass px-3 py-2 rounded-full">
                {NAV_LINKS.map((item) => (
                    <a
                        key={item.label}
                        href="#"
                        onClick={e => handleClick(e, item)}
                        className="px-4 py-1.5 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                        {item.label}
                    </a>
                ))}
            </nav>

            {/* Mobile: hamburger toggle */}
            <button
                onClick={() => setMobileOpen(prev => !prev)}
                className="md:hidden fixed top-5 left-4 z-[60] w-10 h-10 rounded-xl glass flex items-center justify-center transition-colors hover:bg-white/10"
                aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
                {mobileOpen
                    ? <X className="w-5 h-5 text-white" />
                    : <Menu className="w-5 h-5 text-white" />
                }
            </button>

            {/* Mobile full-screen menu */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex flex-col">
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-black/97 backdrop-blur-xl"
                        onClick={() => setMobileOpen(false)}
                    />
                    {/* Content */}
                    <div className="relative flex flex-col items-center justify-center flex-1 gap-2 px-6">
                        <div className="text-red-600 font-black text-2xl tracking-widest uppercase mb-8">
                            Medellín Rental
                        </div>
                        {NAV_LINKS.map((item) => (
                            <a
                                key={item.label}
                                href="#"
                                onClick={e => handleClick(e, item)}
                                className="w-full max-w-xs text-center py-4 px-6 rounded-2xl text-white/75 text-xl font-medium hover:text-white hover:bg-white/8 transition-all active:scale-95"
                            >
                                {item.label}
                            </a>
                        ))}

                        {/* Auth section */}
                        <div className="mt-8 w-full max-w-xs">
                            {user ? (
                                <Link
                                    to={isAdmin ? "/admin" : "/dashboard"}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full glass py-3 px-6 rounded-2xl text-white font-medium hover:bg-white/10 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span>{user.name}</span>
                                    {isAdmin && <Settings className="w-4 h-4 text-red-500" />}
                                </Link>
                            ) : (
                                <button
                                    onClick={() => { setMobileOpen(false); setShowAuth(true); }}
                                    className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Iniciar Sesión</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop user button */}
            <div className="fixed top-6 right-6 z-50 hidden md:flex items-center gap-2">
                {user ? (
                    <Link
                        to={isAdmin ? "/admin" : "/dashboard"}
                        className="flex items-center gap-2 glass px-4 py-2 rounded-full text-white hover:bg-white/10 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                            <User className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                        {isAdmin && <Settings className="w-4 h-4 text-red-500" />}
                    </Link>
                ) : (
                    <button
                        onClick={() => setShowAuth(true)}
                        className="flex items-center gap-2 glass px-4 py-2 rounded-full text-white hover:bg-white/10 transition-all"
                    >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">Iniciar Sesión</span>
                    </button>
                )}
            </div>

            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
            />
        </>
    );
}
