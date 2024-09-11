import React, { useEffect, useState } from 'react';
import { Home, Users, Settings, Bird, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showUserTab, setShowUserTab] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setShowUserTab(userRole === '0' || userRole === '1');
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Flocks', icon: Bird, path: '/myflock' },
    ...(showUserTab ? [{ name: 'Users', icon: Users, path: '/users' }] : []),
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className="text-2xl font-semibold">Dashboard</span>
          <button onClick={toggleSidebar} className="md:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="mt-8">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-2">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center w-full px-4 py-2 text-left hover:bg-gray-700 ${
                      isActive ? 'bg-gray-700' : ''
                    }`
                  }
                  onClick={() => {
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                >
                  <item.icon size={20} className="mr-4" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
