import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import LogoutModal from './LogoutModal';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <>
      <nav className="glass-panel border-b border-white/10 px-6 py-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            InterviewAce
          </Link>
          
          <div>
            {user ? (
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-white/5">
                  <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full border border-blue-500/50" />
                  <span className="text-sm font-medium">{user.name}</span>
                  <button 
                    onClick={() => setShowLogoutModal(true)}
                    className="ml-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="px-6 py-2 rounded-full border border-blue-500/30 hover:border-blue-500 text-blue-400 transition-all">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-medium transition-all shadow-lg shadow-blue-900/20">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout confirmation modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Navbar;
