import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Menu, X, ArrowRight, User as UserIcon, LogOut, LayoutDashboard, CalendarPlus, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
              <Leaf className="w-6 h-6 transform -rotate-12 group-hover:rotate-0 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-brand-black">
                Green<span className="text-brand-primary">Route</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-brand-grey font-semibold -mt-1">
                Eco Scheduling
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-brand-primary font-semibold' : 'text-brand-dGrey hover:text-brand-primary'
              }`}
            >
              Home
            </Link>
            <a
              href="/#features"
              className="text-sm font-medium text-brand-dGrey hover:text-brand-primary transition-colors"
            >
              Services
            </a>
            <a
              href="/#how-it-works"
              className="text-sm font-medium text-brand-dGrey hover:text-brand-primary transition-colors"
            >
              How It Works
            </a>
            <a
              href="/#impact"
              className="text-sm font-medium text-brand-dGrey hover:text-brand-primary transition-colors"
            >
              Impact
            </a>

            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/dashboard') ? 'text-brand-primary font-semibold' : 'text-brand-dGrey hover:text-brand-primary'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Pickups
                </Link>
                <Link
                  to="/schedule"
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/schedule') ? 'text-brand-primary font-semibold' : 'text-brand-dGrey hover:text-brand-primary'
                  }`}
                >
                  <CalendarPlus className="w-4 h-4" />
                  Book Slot
                </Link>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/admin') ? 'text-brand-primary font-semibold' : 'text-brand-dGrey hover:text-brand-primary'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-brand-primary" />
                Admin Console
              </Link>
            )}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-brand-silver border border-gray-200">
                  <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col text-left pr-2">
                    <span className="text-xs font-semibold text-brand-black leading-tight truncate max-w-[110px]">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-brand-grey capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-brand-grey hover:text-brand-error hover:bg-red-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-brand-dGrey hover:text-brand-primary px-3 py-2 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm !py-2.5 !px-5"
                >
                  Register Now
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-brand-dGrey hover:text-brand-black hover:bg-brand-silver"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-brand-black hover:bg-brand-silver"
          >
            Home
          </Link>
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-brand-black hover:bg-brand-silver"
          >
            Services
          </a>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-brand-black hover:bg-brand-silver"
          >
            How It Works
          </a>
          <a
            href="/#impact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-brand-black hover:bg-brand-silver"
          >
            Impact
          </a>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="px-3 py-1 text-xs text-brand-grey font-medium">
                Signed in as {user?.name} ({user?.role})
              </div>
              {isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-brand-primary bg-brand-tint5"
                >
                  Admin Console
                </Link>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-brand-primary bg-brand-tint5"
                  >
                    My Resident Dashboard
                  </Link>
                  <Link
                    to="/schedule"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-brand-black hover:bg-brand-silver"
                  >
                    Schedule Pickup
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-brand-error hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-base font-medium text-brand-dGrey border border-gray-200 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-base font-medium btn-primary"
              >
                Register Now
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
