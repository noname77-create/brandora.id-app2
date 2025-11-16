import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Palette, 
  Lightbulb, 
  Calendar, 
  BarChart3, 
  MessageSquare
} from 'lucide-react';

const MobileNav = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/social-media-kit', icon: Palette, label: 'Social Kit' },
    { path: '/bank-ideation', icon: Lightbulb, label: 'Ideas' },
    { path: '/content-planning', icon: Calendar, label: 'Planning' },
    { path: '/performance-report', icon: BarChart3, label: 'Report' },
    { path: '/consultation-expert', icon: MessageSquare, label: 'Expert' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;