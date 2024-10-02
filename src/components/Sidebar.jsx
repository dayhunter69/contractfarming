import React, { useEffect, useState, useRef } from 'react';
import { Home, Users, Settings, Bird } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import logoBanner from '../assets/LogoBanner.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showUserTab, setShowUserTab] = useState(false);
  const sidebarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setShowUserTab(userRole === '0' || userRole === '1');

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
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
  }, [isMobile, isOpen, toggleSidebar]);

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
    ...(showUserTab ? [{ name: 'Users', icon: Users, path: '/users' }] : []),
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      <div
        {...handlers}
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1a1f2b] text-gray-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-700">
          <img src={logoBanner} alt="Shreenagar Logo" className="h-8" />
        </div>
        <nav className="mt-6">
          <ul className="space-y-1 list-none p-0 m-0">
            {navItems.map((item) => (
              <li key={item.name} className="w-full">
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
