import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');

    // Navigate to login page
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 md:hidden">
          <Menu size={24} />
        </button>
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
