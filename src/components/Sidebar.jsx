import React, { useEffect, useState, useRef } from 'react';
import {
  Home,
  Users,
  Settings,
  Bird,
  Archive,
  Landmark,
  LogOut,
  Menu,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import logoBanner from '../assets/LogoBanner.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const [showUserTab, setShowUserTab] = useState(false);
  const sidebarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');

    // Navigate to login page
    navigate('/');
  };

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setShowUserTab(userRole === '0' || userRole === '1');

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Automatically open sidebar on desktop, close on mobile
      setIsOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, isOpen]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (isMobile && isOpen) toggleSidebar();
    },
    onSwipedRight: () => {
      if (isMobile && !isOpen) toggleSidebar();
    },
    trackMouse: true,
  });

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Flocks', icon: Bird, path: '/myflock' },
    ...(showUserTab
      ? [{ name: 'Archive', icon: Archive, path: '/archieves' }]
      : []),
    ...(showUserTab
      ? [{ name: 'Accounts', icon: Landmark, path: '/accounts' }]
      : []),
    ...(showUserTab ? [{ name: 'Users', icon: Users, path: '/users' }] : []),
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Toggle button for mobile and desktop */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-1 left-0 z-50 text-black p-2 rounded-md md:hidden ${
          isOpen ? 'hidden' : 'block'
        }`}
      >
        <Menu size={24} />
      </button>

      <div
        {...handlers}
        ref={sidebarRef}
        className={`fixed top-0 left-0 bottom-0 z-40 w-44 bg-[#1a1f2b] text-gray-100 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <img
            src={logoBanner}
            alt="Shreenagar Logo"
            className="h-8 select-none"
          />
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
          )}
        </div>
        <nav className="mt-6 flex-grow">
          <ul className="space-y-1 list-none p-0 m-0">
            {navItems.map((item) => (
              <li key={item.name} className="w-full select-none">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 w-full no-underline ${
                      isActive
                        ? 'bg-[#2a3041] text-white'
                        : 'text-gray-400 hover:bg-[#2a3041] hover:text-white'
                    }`
                  }
                  onClick={() => {
                    if (isMobile) toggleSidebar();
                  }}
                >
                  <item.icon size={18} className="mr-3" />
                  <span className="no-underline">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 select-none"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-3 select-none" />
            Logout
          </button>
        </div>
      </div>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
