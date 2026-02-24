import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings } from 'lucide-react';
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
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent, item: typeof NAV_LINKS[number]) => {
        e.preventDefault();
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
            {/* Left nav links */}
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

            <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
                {user ? (
                    <Link
                        to={isAdmin ? "/admin" : "/dashboard"}
                        className="flex items-center gap-2 glass px-4 py-2 rounded-full text-white hover:bg-white/10 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                            <User className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium hidden sm:block">{user.name}</span>
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
