import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#4F46E5] mb-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-xl hover:bg-[#4338CA] transition-colors font-semibold"
          >
            <Home size={20} />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
