import { useLocation } from "react-router-dom";
import { User } from "lucide-react";

function Header() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/content":
        return "Content Analytics";
      case "/audience":
        return "Audience Analytics";
      case "/growth":
        return "Growth & Trends";
      case "/revenue":
        return "Revenue";
      case "/reports":
        return "Platform Comparison";
      case "/sponsorships":
        return "Sponsorships";
      case "/notifications":
        return "Notifications";
      case "/profile":
        return "Profile";
      default:
        return "Content Analytics";
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200/80 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium py-1 px-3 rounded-full hover:bg-gray-50 transition-colors">
          <User className="w-4 h-4 text-gray-500" />
          <span>Monika</span>
          <span className="ml-1 text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200/60">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
