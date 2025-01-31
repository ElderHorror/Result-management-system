import { Link } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4 md:text-8xl">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 md:text-3xl">Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-base md:text-lg">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="flex items-center px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
      >
        <AiOutlineHome className="mr-2" size={24} />
        Go Back to Home
      </Link>
    </div>
  );
}
