import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Content Analytics", path: "/content" },
    { name: "Audience Analytics", path: "/audience" },
    { name: "Growth & Trends", path: "/growth" },
    { name: "Revenue", path: "/revenue" },
    { name: "Sponsorships", path: "/sponsorships" },
    { name: "Notifications", path: "/notifications" },
    { name: "Reports", path: "/reports" },
    { name: "Profile / Settings", path: "/profile" },
  ];

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        padding: "24px 16px",
        borderRight: "1px solid #ddd",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "30px",
        }}
      >
        CreatorIQ
      </div>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "block",
              padding: "10px 12px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: isActive ? "600" : "400",
              backgroundColor: isActive ? "#e5e7eb" : "transparent",
              color: "#111827",
            })}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;