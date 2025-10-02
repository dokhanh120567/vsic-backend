import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../UI/Button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Heart className="w-8 h-8 text-emerald-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">FoodShare</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Browse Food
            </Link>
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Dashboard
              </Link>
            )}
            {user?.role === 'business_donor' && (
              <Link to="/create-listing" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Share Food
              </Link>
            )}
          </div>

          {/* User actions */}
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user.full_name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Login
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-emerald-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <Link
              to="/browse"
              className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Food
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {user?.role === 'business_donor' && (
              <Link
                to="/create-listing"
                className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Share Food
              </Link>
            )}
            
            {user ? (
              <div className="pt-2 border-t border-gray-200">
                <p className="py-2 text-gray-700">Hello, {user.full_name}</p>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};