
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Book, GraduationCap, LogOut, Menu, X, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getAuth, signOut } from "firebase/auth";
// import 

interface HeaderProps {
  isAuthenticated?: boolean;
  userRole?: 'lecturer' | 'student';
  userName?: string;
  userAvatar?: string;
}



const Header: React.FC<HeaderProps> = ({ 
  isAuthenticated = false, 
  userRole,
  userName,
  userAvatar
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLandingPage = location.pathname === '/';
  const isTransparent = isLandingPage;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    console.log("user: " + storedUser)
    console.log("user: " + user)
  }, []);

  const handleLogout = async () => {
    // In a real app, you would handle logout logic here
    console.log('Logging out...');
    try {
      const auth = getAuth();
      await signOut(auth);
      
      // Clear any local storage/session data
      localStorage.removeItem("user");
      sessionStorage.clear();
      
      // Redirect to login page
      navigate('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getLinkStyle = (path: string) => {
    const isActive = location.pathname === path;
    return `relative px-3 py-2 transition-all duration-200 ease-in-out ${
      isActive 
        ? 'text-rubrix-blue font-medium' 
        : 'text-foreground/80 hover:text-rubrix-blue'
    }`;
  };

  const logoStyle = isTransparent
    ? 'bg-white/10 backdrop-blur-md border border-white/30 shadow-sm'
    : 'bg-white/80 backdrop-blur-md border border-black/5 shadow-sm';

  const getProfilePath = () => {
    if (!isAuthenticated) return '/profile';
    return user?.role === 'lecturer' ? '/lecturer/profile' : '/student/profile';
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent 
          ? 'bg-transparent' 
          : 'bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link 
          to="/" 
          className={`text-xl font-bold flex items-center gap-2 px-4 py-2 rounded-full ${logoStyle} transition-all duration-300 hover:scale-105`}
        >
          <GraduationCap className="w-5 h-5 text-rubrix-blue" />
          <span className={isTransparent ? 'text-foreground' : 'text-foreground'}>rubrix</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {!isAuthenticated ? (
            <>
              <Link to="/sign-in" className={getLinkStyle('/sign-in')}>
                Sign In
              </Link>
              <Link to="/sign-up">
                <Button className="ml-4 bg-rubrix-blue hover:bg-rubrix-blue/90 text-white rounded-full px-6 shadow-sm transition-transform hover:scale-105">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              <nav className="flex items-center space-x-1 mr-4">
                {user?.role === 'lecturer' ? (
                  <>
                    <Link to="/lecturer/dashboard" className={getLinkStyle('/lecturer/dashboard')}>
                      Dashboard
                    </Link>
                    <Link to="/lecturer/courses" className={getLinkStyle('/lecturer/courses')}>
                      Courses
                    </Link>
                    <Link to="/lecturer/assignments" className={getLinkStyle('/lecturer/assignments')}>
                      Assignments
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/student/dashboard" className={getLinkStyle('/student/dashboard')}>
                      Dashboard
                    </Link>
                    <Link to="/student/courses" className={getLinkStyle('/student/courses')}>
                      Courses
                    </Link>
                  </>
                )}
              </nav>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-secondary transition-all duration-200">
                    <Avatar className="h-8 w-8 border border-muted">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-rubrix-blue text-white">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 animate-scale-in">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate(getProfilePath())}
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Book className="h-4 w-4" />
                    <span>{user?.role === 'lecturer' ? 'My Courses' : 'Enrolled Courses'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[260px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-rubrix-blue" />
                    <span className="font-bold">rubrix</span>
                  </div>
                </div>
                <nav className="flex flex-col py-8 space-y-4">
                  {!isAuthenticated ? (
                    <>
                      <Link 
                        to="/sign-in" 
                        className="px-2 py-2 hover:bg-muted rounded transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link 
                        to="/sign-up" 
                        className="px-2 py-2 hover:bg-muted rounded transition-colors"
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 px-2 py-3 border-b">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.name} />
                          <AvatarFallback className="bg-rubrix-blue text-white">
                            {user?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user?.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                        </div>
                      </div>
                      
                      {user?.role === 'lecturer' ? (
                        <>
                          <Link 
                            to="/lecturer/dashboard" 
                            className="px-2 py-2 hover:bg-muted rounded transition-colors"
                          >
                            Dashboard
                          </Link>
                          <Link 
                            to="/lecturer/courses" 
                            className="px-2 py-2 hover:bg-muted rounded transition-colors"
                          >
                            Courses
                          </Link>
                          <Link 
                            to="/lecturer/assignments" 
                            className="px-2 py-2 hover:bg-muted rounded transition-colors"
                          >
                            Assignments
                          </Link>
                          <Link 
                            to="/lecturer/profile" 
                            className="px-2 py-2 hover:bg-muted rounded transition-colors"
                          >
                            Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link 
                            to="/student/dashboard" 
                            className="px-2 py-2 hover:bg-muted rounded transition-colors"
                          >
                            Dashboard
                          </Link>
                          <Link 
                            to="/student/courses" 
                            className="px-2 py-2 hover:bg-muted rounded transition-colors"
                          >
                            Courses
                          </Link>
                          <Link 
                            to="/student/profile" 
                            className="px-2 py-2 hover:bg-muted rounded transition-colors"
                          >
                            Profile
                          </Link>
                        </>
                      )}
                      
                      <div className="mt-auto">
                        <button 
                          className="w-full px-2 py-2 text-destructive hover:bg-destructive/10 rounded transition-colors text-left flex items-center gap-2"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
