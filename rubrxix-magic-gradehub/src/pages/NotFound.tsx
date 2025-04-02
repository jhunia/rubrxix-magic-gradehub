
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, HomeIcon, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine if user is in student or lecturer section
  const getUserRole = () => {
    const path = location.pathname;
    if (path.includes('/student/')) return 'student';
    if (path.includes('/lecturer/')) return 'lecturer';
    return null;
  };

  const userRole = getUserRole();
  const dashboardLink = userRole ? `/${userRole}/dashboard` : '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4 py-8 bg-white shadow-lg rounded-lg text-center">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-700 mb-2">Page Not Found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or you don't have permission to access it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="gap-2">
            <Link to={dashboardLink}>
              <HomeIcon className="h-4 w-4" />
              {userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard` : 'Home'}
            </Link>
          </Button>
          
          <Button asChild className="gap-2">
            <Link to="#" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
