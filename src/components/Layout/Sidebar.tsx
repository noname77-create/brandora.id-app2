import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Palette,
  Lightbulb,
  Calendar,
  BarChart3,
  Users,
  Settings as SettingsIcon,
  User,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Social Media Kit", icon: Palette, href: "/social-media-kit" },
    { name: "Bank Ideation", icon: Lightbulb, href: "/bank-ideation" },
    { name: "Content Planning", icon: Calendar, href: "/content-planning" },
    { name: "Performance Report", icon: BarChart3, href: "/performance-report" },
    { name: "Consultation Expert", icon: Users, href: "/consultation-expert" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg fixed h-screen flex flex-col justify-between">
      {/* Logo dan Menu */}
      <div>
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">Brandora.id</h1>
        </div>

        <nav className="p-4 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition 
                  ${active ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profil, Settings, Logout */}
      <div className="p-4 border-t space-y-2">
        <Link
          to="/profile"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition 
            ${location.pathname === "/profile" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <User className="w-5 h-5" />
          Profil Akun
        </Link>
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition 
            ${location.pathname === "/settings" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <SettingsIcon className="w-5 h-5" />
          Settings
        </Link>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
