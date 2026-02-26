import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
        <p className="text-white/50 mb-8">La página que buscas no existe o fue movida.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
