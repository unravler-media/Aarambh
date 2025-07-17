
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Grid2X2, Search, Book, Hash, LogIn, UserPlus, User } from "lucide-react";
import { categories } from "../data/categories";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActiveRoute = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    if (path !== "/" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="bg-[#090A0E] border-r border-[#1A1B22] w-64 min-h-screen hidden md:block fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <Link to="/" className="flex items-center mb-12 group">
          <h1 className="text-2xl font-bold ml-3 text-white">Aarambh.</h1>
        </Link>

        <nav className="space-y-10">
          <div>
            <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-5 pl-3">Main</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all", isActiveRoute("/") && "bg-[#151619] text-white font-medium shadow-sm")}>
                  <Grid2X2 size={18} strokeWidth={2.5} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/search" className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all", isActiveRoute("/search") && "bg-[#151619] text-white font-medium shadow-sm")}>
                  <Search size={18} strokeWidth={2.5} />
                  <span>Search</span>
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/dashboard" className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all", isActiveRoute("/dashboard") && "bg-[#151619] text-white font-medium shadow-sm")}>
                    <User size={18} strokeWidth={2.5} />
                    <span>Dashboard</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-5 pl-3">Categories</h2>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id}>
                  <Link to={`/category/${category.slug}`} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all", isActiveRoute(`/category/${category.slug}`) && "bg-[#151619] text-white font-medium shadow-sm")}>
                    <Hash size={18} strokeWidth={2.5} />
                    <span>{category.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-5 pl-3">Account</h2>
            <ul className="space-y-2">
              {!user ? (
                <>
                  <li>
                    <Link to="/login" className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all", isActiveRoute("/login") && "bg-[#151619] text-white font-medium shadow-sm")}>
                      <LogIn size={18} strokeWidth={2.5} />
                      <span>Login</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#151619] hover:text-white transition-all", isActiveRoute("/register") && "bg-[#151619] text-white font-medium shadow-sm")}>
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
    </aside>
  );
};

export default Sidebar;
