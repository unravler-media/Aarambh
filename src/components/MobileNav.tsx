
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Grid2X2, Search, Hash, LogIn, UserPlus, User } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const isActiveRoute = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    if (path !== "/" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <div className="fixed top-0 left-0 right-0 z-30 border-b border-[#1A1B22] px-4 py-3 flex justify-between items-center bg-[#090A0E]">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-white">Aarambh.</h1>
        </Link>

        <button onClick={toggleMenu} className="p-2 text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-20 pt-16 pb-6 px-6 bg-[#090A0E]">
          <nav className="h-full overflow-y-auto space-y-8">
            <div>
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-4 pl-3">Main</h2>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/" 
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all", isActiveRoute("/") && "bg-[#151619] text-white font-medium")} 
                    onClick={() => setIsOpen(false)}
                  >
                    <Grid2X2 size={18} strokeWidth={2.5} />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/search" 
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all", isActiveRoute("/search") && "bg-[#151619] text-white font-medium")} 
                    onClick={() => setIsOpen(false)}
                  >
                    <Search size={18} strokeWidth={2.5} />
                    <span>Search</span>
                  </Link>
                </li>
                {user && (
                  <li>
                    <Link 
                      to="/dashboard" 
                      className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all", isActiveRoute("/dashboard") && "bg-[#151619] text-white font-medium")} 
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={18} strokeWidth={2.5} />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-4 pl-3">Categories</h2>
              <ul className="space-y-2">
                {categoriesLoading ? (
                  <li className="px-3 py-2.5 text-gray-500">Loading categories...</li>
                ) : (
                  (Array.isArray(categories) ? categories : []).map(category => (
                    <li key={category.ID}>
                      <Link 
                        to={`/category/${category.Slug}`} 
                        className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all", isActiveRoute(`/category/${category.Slug}`) && "bg-[#151619] text-white font-medium")} 
                        onClick={() => setIsOpen(false)}
                      >
                        <Hash size={18} strokeWidth={2.5} />
                        <span>{category.Name}</span>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-4 pl-3">Account</h2>
              <ul className="space-y-2">
                {!user ? (
                  <>
                    <li>
                      <Link 
                        to="/login" 
                        className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all", isActiveRoute("/login") && "bg-[#151619] text-white font-medium")} 
                        onClick={() => setIsOpen(false)}
                      >
                        <LogIn size={18} strokeWidth={2.5} />
                        <span>Login</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/register" 
                        className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all", isActiveRoute("/register") && "bg-[#151619] text-white font-medium")} 
                        onClick={() => setIsOpen(false)}
                      >
                        <UserPlus size={18} strokeWidth={2.5} />
                        <span>Register</span>
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all w-full text-left"
                    >
                      <LogIn size={18} strokeWidth={2.5} />
                      <span>Logout</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
