import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Calendar,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  LayoutDashboard,
  Clock,
  Wrench,
} from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  const adminNavItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/spaces', label: 'Spaces', icon: Building2 },
    { to: '/admin/bookings', label: 'All Bookings', icon: Calendar },
    { to: '/admin/approvals', label: 'Approvals', icon: Clock },
    { to: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-semibold shadow-sm transition-transform group-hover:scale-105">
                  <Building2 className="w-5 h-5 text-teal-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base tracking-tight text-slate-900">CoWork Hub</span>
                  <span className="text-[10px] text-slate-500 font-medium -mt-1 tracking-wider uppercase">Workspace Suite</span>
                </div>
              </Link>

              {/* Desktop Main Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <NavLink
                  to="/spaces"
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      isActive ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>Spaces</span>
                </NavLink>

                {user && (
                  <>
                    <NavLink
                      to="/my-bookings"
                      className={({ isActive }) =>
                        `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                          isActive ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span>My Bookings</span>
                    </NavLink>

                    {isAdmin && (
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                            isActive || isAdminRoute ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`
                        }
                      >
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                        <span>Admin Console</span>
                      </NavLink>
                    )}
                  </>
                )}
              </nav>
            </div>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center uppercase shadow-xs">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800 leading-none">{user.name}</span>
                      <span className="text-[10px] text-slate-500 capitalize">{user.role || 'Member'}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4 text-slate-500" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 animate-fade-in">
            <NavLink
              to="/spaces"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Building2 className="w-5 h-5 text-slate-500" />
              <span>Spaces</span>
            </NavLink>
            {user && (
              <>
                <NavLink
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <span>My Bookings</span>
                </NavLink>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-teal-700 bg-teal-50"
                  >
                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                    <span>Admin Console</span>
                  </NavLink>
                )}
              </>
            )}
            <div className="pt-3 border-t border-slate-200">
              {user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center uppercase">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-800">{user.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-1 text-xs text-rose-600 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Console Dedicated Sub-Navbar */}
        {isAdminRoute && (
          <div className="bg-slate-900 text-white border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-none">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mr-2 hidden sm:inline-block">
                  Admin:
                </span>
                {adminNavItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/admin'}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                          isActive
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`
                      }
                    >
                      <ItemIcon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-700">CoWork Hub</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/spaces" className="hover:text-slate-900 transition-colors">Spaces</Link>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Portal Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
