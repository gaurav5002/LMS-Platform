import React from 'react';
import { Home, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSidebarStore } from '../../zustand/useSidebarStore'; // ensure correct path

const Sidebar = () => {
  const { activeTab, setActiveTab } = useSidebarStore();

  const menuItems = [
    { compId: 'dashboard', label: 'Dashboard', icon: Home },
    { compId: 'browse', label: 'Browse Courses', icon: BookOpen },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-16 sm:w-20 lg:w-64 shadow-lg z-50 transition-all duration-300" style={{ backgroundColor: '#FFFDF6' }}>
      
      {/* Brand Section */}
      <div className="p-3 lg:p-6 border-b flex items-center justify-center lg:justify-start" style={{ borderColor: '#DDEB9D' }}>
        <div className="lg:hidden">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base" style={{ backgroundColor: '#A0C878' }}>
            LH
          </div>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold" style={{ color: '#A0C878' }}>LearnHub</h1>
          <p className="text-sm text-gray-600 mt-1">Learning Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2 lg:px-3 flex-1">
        <ul className="space-y-2">
          {menuItems.map(({ compId, label, icon: Icon }) => {
            const isActive = activeTab === compId;

            return (
              <li key={compId}>
                <Link to={`/${compId}`}>
                  <button
                    onClick={() => setActiveTab(compId)}
                    className={`w-full flex items-center justify-center lg:justify-start px-2 lg:px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                      isActive ? 'text-white shadow-md' : 'text-gray-700 hover:text-gray-900'
                    }`}
                    style={{
                      backgroundColor: isActive ? '#A0C878' : 'transparent',
                    }}
                  >
                    <Icon size={20} className="lg:mr-3 flex-shrink-0" />
                    <span className="font-medium hidden lg:block">{label}</span>

                    {/* Tooltip for mobile/tablet */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      {label}
                    </div>
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
