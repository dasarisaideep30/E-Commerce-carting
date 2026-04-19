import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, X, ShoppingBag, User, LayoutDashboard, ShoppingCart, Package, LogOut, LogIn } from "lucide-react";
import { setemail } from "../../store/userAction";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userEmail = useSelector((state) => state.user.email);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(setemail(""));
    navigate("/login");
    setIsOpen(false);
  };

  const isAdmin = userEmail === "saideep@gmail.com";

  const navLinks = [
    { name: "Home", path: "/", icon: ShoppingBag, show: true },
    { name: "My Products", path: "/my-products", icon: LayoutDashboard, show: isAdmin },
    { name: "Add Products", path: "/create-product", icon: Package, show: isAdmin },
    { name: "Cart", path: "/cart", icon: ShoppingCart, show: !!userEmail },
    { name: "Profile", path: "/profile", icon: User, show: !!userEmail },
    { name: "My Orders", path: "/myorders", icon: ShoppingBag, show: !!userEmail }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-lg border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShoppingBag className="text-white" size={22} />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            E-Commerce
          </h1>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.filter(l => l.show).map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? "bg-white/10 text-white shadow-[inset_0_1px_rgba(255,255,255,0.1)]" 
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <link.icon size={18} />
              <span>{link.name}</span>
            </NavLink>
          ))}
          {userEmail ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-300"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 transition-all duration-300"
            >
              <LogIn size={18} />
              <span>Login</span>
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors" onClick={toggleMenu}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 p-4 bg-neutral-800 rounded-2xl border border-white/10 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <ul className="space-y-2">
            {navLinks.filter(l => l.show).map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-base transition-all duration-300 ${
                      isActive ? "bg-white text-neutral-900" : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon size={20} />
                  <span>{link.name}</span>
                </NavLink>
              </li>
            ))}
            <li>
              {userEmail ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base text-red-400 hover:bg-red-500/10 transition-all duration-300"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base text-indigo-400 hover:bg-indigo-500/10 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
