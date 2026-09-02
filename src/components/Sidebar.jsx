import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  TrendingUp,
  DollarSign,
  BarChart2,
  Award,
  Bell,
  FileSpreadsheet,
  User,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Content Analytics", path: "/content", icon: FileText },
    { name: "Audience Analytics", path: "/audience", icon: Users },
    { name: "Growth & Trends", path: "/growth", icon: TrendingUp },
    { name: "Revenue", path: "/revenue", icon: DollarSign },
    { name: "Platform Comparison", path: "/reports", icon: BarChart2 },
    { name: "Sponsorships", path: "/sponsorships", icon: Award },
    { name: "Notifications", path: "/notifications", icon: Bell },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#163a7a] text-white flex flex-col justify-between shrink-0 select-none shadow-md">
      {/* Brand Header */}
      <div>
        <div className="px-6 pt-6 pb-5">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            CreatorIQ
          </h1>
          <p className="text-xs text-blue-200/90 font-normal mt-0.5">
            Analytics Dashboard
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                    isActive
                      ? "bg-[#2563eb] text-white font-medium shadow-sm"
                      : "text-blue-100/90 hover:bg-[#1e4896] hover:text-white font-normal"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 opacity-90" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-blue-800/40">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-blue-200 hover:bg-[#1e4896] hover:text-white transition-colors duration-150 cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 shrink-0 opacity-90" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
