// components/Navbar.jsx
import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoBanner from '../assets/LogoBanner.png';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 md:hidden">
          <Menu size={24} />
        </button>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img src={logoBanner} alt="Logo" className="h-8" />
      </div>
      <button
        className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
        onClick={handleLogout}
      >
        <LogOut size={18} className="mr-2" />
        Logout
      </button>
    </header>
  );
};

export default Navbar;
