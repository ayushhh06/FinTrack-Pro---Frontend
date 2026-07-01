import React, { useState } from 'react';
import { LogOut, User, Menu, X } from 'lucide-react';

export default function UserIdentityHeader({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      onLogout();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">FinTrack Pro</h1>
            <p className="text-xs text-gray-500">Wealth Management Platform</p>
          </div>
        </div>

        {/* Right: User & Actions */}
        <div className="flex items-center gap-6">
          {/* Active Identity */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">
              Active Identity: <span className="font-semibold">{user?.username || 'User'}</span>
            </span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            title="Sign out of your account"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          {/* Mobile Menu Toggle (optional) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-gray-50 p-4">
          <div className="text-sm text-gray-700 mb-4">
            Signed in as <span className="font-semibold">{user?.username || 'User'}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}