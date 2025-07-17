
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-7xl md:text-9xl font-bold mb-6 text-tech-red">404</h1>
        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">Page Not Found</h2>
        <p className="text-lg text-gray-400 mb-10 max-w-lg">
          The page you're looking for doesn't exist or has been moved to another address.
        </p>
        <Link 
          to="/" 
          className="bg-tech-red hover:bg-tech-red/90 text-white font-medium py-3 px-8 rounded-xl transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
