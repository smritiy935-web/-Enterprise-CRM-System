import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  PieChart,
  Settings,
  LogOut,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const sections = [
    {
      label: "Core",
      links: [
        { title: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
        {
          title: "Leads Repository",
          path: "/leads",
          icon: <Users size={20} />,
        },
      ],
    },
    {
      label: "Management",
      links: [
        {
          title: "Activities",
          path: "/activities",
          icon: <MessageSquare size={20} />,
        },
        {
          title: "Sales Analytics",
          path: "/analytics",
          icon: <PieChart size={20} />,
        },
      ],
    },
    {
      label: "Configuration",
      links: [
        {
          title: "System Settings",
          path: "/settings",
          icon: <Settings size={20} />,
        },
      ],
    },
  ];

  return (
    <div
      className="sidebar glass-card"
      style={{
        width: "200px",
        height: "100vh",
        padding: "0.75rem",
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
        borderLeft: "none",
        borderTop: "none",
        borderBottom: "none",
        position: "sticky",
        top: 0,
        zIndex: 110,
        background: "var(--glass-bg)",
      }}
    >
      <div
        className="logo"
        style={{ marginBottom: "1.5rem", padding: "0 8px" }}
      >
        <h2
          style={{
            fontSize: "1.2rem",
            letterSpacing: "-1px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              background: "var(--accent-primary)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                border: "2px solid var(--text-primary)",
                borderRadius: "3px",
              }}
            ></div>
          </div>
          <span style={{ fontWeight: 700 }}>APEX</span>
        </h2>
      </div>

      <nav style={{ flex: 1, overflowY: "auto" }}>
        {sections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: "1.5rem" }}>
            <p
              style={{
                fontSize: "0.6rem",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                fontWeight: 700,
                letterSpacing: "1px",
                marginBottom: "8px",
                paddingLeft: "8px",
              }}
            >
              {section.label}
            </p>
            {section.links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 10px",
                  borderRadius: "10px",
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                  background: isActive
                    ? "linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%)"
                    : "transparent",
                  textDecoration: "none",
                  marginBottom: "2px",
                  transition: "var(--transition)",
                  borderLeft: isActive
                    ? "3px solid var(--accent-primary)"
                    : "3px solid transparent",
                })}
              >
                {link.icon}
                <span style={{ fontWeight: 500, fontSize: "0.85rem" }}>
                  {link.title}
                </span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div
        style={{
          marginTop: "auto",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "0 8px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--accent-primary)",
                }}
              >
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "U"}
              </span>
            )}
          </div>
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 600 }}>
              {user?.name || "User"}
            </p>
            <p style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
              {user?.role || "Admin"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="btn"
          style={{
            color: "#ef4444",
            justifyContent: "flex-start",
            padding: "8px 10px",
            background: "transparent",
            fontSize: "0.85rem",
          }}
        >
          <LogOut size={16} />
          <span style={{ fontWeight: 500 }}>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
