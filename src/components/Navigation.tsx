import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, CheckSquare, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const { theme, setTheme } = useAuthStore();
  const location = useLocation();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Home' },
    { path: '/schedule', icon: <Calendar size={24} />, label: 'Schedule' },
    { path: '/tasks', icon: <CheckSquare size={24} />, label: 'Tasks' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto bg-white dark:bg-gray-900 shadow-lg z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around md:justify-between py-2">
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Productivity HS</span>
          </div>
          
          <div className="flex items-center justify-center space-x-6 md:space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.icon}
                    <span className="text-xs md:text-sm">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 md:bottom-auto md:left-0 h-1 md:h-full w-full md:w-1 bg-indigo-500 dark:bg-indigo-400 rounded-t-full md:rounded-l-full md:rounded-tr-none"
                        layoutId="activeTab"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;