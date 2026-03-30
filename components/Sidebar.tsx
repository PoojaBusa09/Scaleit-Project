import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { UserRole, UserContext } from "../types.ts";
import {
  isNavVisible,
  getVisibleReports,
  canAccessTeam,
  canAccessContentStudio,
} from "../services/rbac.ts";
import {
  LogOutIcon,
  LogoIcon,
  PinIcon,
  PinOffIcon,
} from "./icons.tsx";
import { NAVIGATION_CONFIG, MEMBER_NAV_CONFIG, MENTOR_NAV_CONFIG, NavigationSection, NavigationItem } from "../config/navigation.ts";

interface SidebarProps {
  userRole: UserRole;
  userContext?: UserContext;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const SidebarItem: React.FC<{
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: string | number;
  isCollapsed: boolean;
  onClick?: () => void;
}> = ({ to, icon: Icon, label, badge, isCollapsed, onClick }) => {
  const location = useLocation();

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center h-12 mx-2 rounded-lg text-base font-medium relative
           ${isCollapsed ? "justify-center w-14" : "px-4 w-auto"}
           ${isActive
          ? "bg-secondary/20 text-primary shadow-sm ring-1 ring-secondary/30"
          : "text-black hover:bg-secondary/10 hover:text-primary"
        }`
      }

      title={isCollapsed ? label : undefined}
      style={{
        transition: "background 150ms, color 150ms",
        color: to === location.pathname ? undefined : undefined
      }}
    >
      {({ isActive }) => (
        <>
          {isActive && !isCollapsed && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-r-full" />
          )}
          <Icon
            className={`h-6 w-6 flex-shrink-0 ${isActive ? "text-primary" : "text-black/70 group-hover:text-primary"
              }`}
            style={isActive ? { color: "#0C2340" } : undefined}
          />

          {!isCollapsed && (
            <>
              <span className="ml-3 truncate whitespace-nowrap">{label}</span>
              {badge && (
                <span
                  className="ml-auto bg-accent text-on-accent text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{ color: "#FFFFFF", backgroundColor: "#C89720" }}
                >
                  {badge}
                </span>
              )}
            </>
          )}
        </>
      )}
    </NavLink>
  )
};

const SectionHeader: React.FC<{ label: string; isCollapsed: boolean }> = ({
  label,
  isCollapsed,
}) => {
  if (isCollapsed) return <div className="h-3" />;
  return (
    <div className="px-4 pt-4 pb-1 text-[10px] font-bold text-gray-700 uppercase tracking-widest">
      {label}

    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  userContext,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Initialize pinned state from localStorage, default to true (pinned) or false based on preference
  const [isPinned, setIsPinned] = useState(() => {
    const saved = localStorage.getItem("sidebar_pinned");
    return saved !== null ? saved === "true" : true; // Default to pinned if not set
  });

  const user = userContext || {
    role: userRole,
    name: "User",
    email: "user@example.com",
    id: 1,
    avatarUrl: "",
    contentStudioAccess: false
  };

  // Sidebar is collapsed if NOT hovered AND NOT pinned (Desktop only)
  // On mobile, we don't collapse, we just hide the whole sidebar
  const isCollapsed = !isHovered && !isPinned;

  const togglePin = () => {
    const newState = !isPinned;
    setIsPinned(newState);
    localStorage.setItem("sidebar_pinned", String(newState));
  };

  const roleLabels: Record<UserRole, string> = {
    EC: "Elevate Member",
    SC: "CEO",
    STM: "Team Member",
    M: "Mentor",
    MM: "Mentor Manager",
    ST: "PGN Staff",
    AM: user.contentStudioAccess ? "Admin (CSA)" : "Admin Manager",
    SA: "Super Admin",
  };

  const visibleReports = getVisibleReports(userRole);

  // Determine which navigation mode to use
  const isMemberRole = ["EC", "SC", "STM"].includes(userRole);
  const isMentorRole = ["M", "MM"].includes(userRole);
  const useFlatNav = isMemberRole || isMentorRole;

  const flatNavItems = isMemberRole
    ? MEMBER_NAV_CONFIG
    : isMentorRole
      ? MENTOR_NAV_CONFIG
      : [];

  const shouldRenderSection = (section: NavigationSection) => {
    if (section.roles && !section.roles.includes(userRole)) return false;
    if (section.checkAccess && !section.checkAccess(user)) return false;

    // Special logic for Reports section to check individual items against visibleReports
    if (section.label === "Reports") {
      return section.items.some(item =>
        !item.permissions || (item.permissions && item.permissions.some(p => visibleReports.includes(p)))
      );
    }

    return true;
  };

  const shouldRenderItem = (item: NavigationItem) => {
    if (item.roles && !item.roles.includes(userRole)) return false;

    if (item.permissions) {
      // Special handling for reports items
      return item.permissions.some(p => visibleReports.includes(p));
    }

    return true;
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:relative inset-y-0 left-0 flex-shrink-0 flex flex-col shadow-2xl z-50 h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0"}
          ${!isMobileOpen ? (isCollapsed ? "lg:w-[68px]" : "lg:w-[240px]") : ""}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo & Close (Mobile) */}
        <div className="flex items-center justify-between h-16 px-3 border-b border-gray-100 relative group/header">
          <div className="flex items-center">
            <LogoIcon className="h-10 w-10 text-primary flex-shrink-0" />
            {(isMobileOpen || !isCollapsed) && (
              <div className="ml-2 animate-fade-in">
                <div className="text-xl font-serif font-bold text-primary tracking-widest">
                  PINNACLE
                </div>
                <div className="text-[11px] text-accent font-bold uppercase tracking-wider">
                  Global Network
                </div>
              </div>
            )}
          </div>

          {/* Close button for Mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Pin/Unpin Button - Visible when expanded (Desktop only) */}
          {!isCollapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent anything else from firing
                togglePin();
              }}
              className={`hidden lg:block p-1.5 rounded-md transition-colors ${isPinned
                ? "text-primary/40 hover:text-primary hover:bg-surface-variant"
                : "text-primary/40 hover:text-primary hover:bg-surface-variant"
                }`}
              title={isPinned ? "Unpin Sidebar (Autohide)" : "Pin Sidebar"}
            >
              {isPinned ? <PinIcon className="h-4 w-4" /> : <PinOffIcon className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Nav */}
        <div
          className="flex-1 overflow-y-auto py-2"
          style={{ scrollbarWidth: "none" }}
        >
          {useFlatNav ? (
            /* ── Flat nav for Members & Mentors ── */
            flatNavItems.map((item, index) => {
              if (item.type === 'divider') {
                return (
                  <div key={index} className="mx-4 my-2 border-t border-gray-200" />
                );
              }
              return (
                <SidebarItem
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  label={item.label || ''}
                  badge={item.badge}
                  isCollapsed={!isMobileOpen && isCollapsed}
                  onClick={onCloseMobile}
                />
              );
            })
          ) : (
            /* ── Sectioned nav for Admin/Staff ── */
            NAVIGATION_CONFIG.map((section, index) => {
              if (!shouldRenderSection(section)) return null;

              return (
                <React.Fragment key={index}>
                  {section.label !== "Dashboard" && (
                    <SectionHeader label={section.label} isCollapsed={isCollapsed} />
                  )}

                  {section.items.map((item, itemIndex) => {
                    if (!shouldRenderItem(item)) return null;
                    return (
                      <SidebarItem
                        key={itemIndex}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        badge={item.badge}
                        isCollapsed={isCollapsed}
                        onClick={onCloseMobile}
                      />
                    );
                  })}
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* Account Owner Footer */}
        <div className="border-t border-gray-100 p-3 bg-gray-50">
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-1"
              } mb-2`}
          >
            <img
              src={
                user.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
              }
              alt={user.name}
              className="w-11 h-11 rounded-full border-2 border-primary/20 shadow-sm flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {roleLabels[userRole]}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            className={`w-full flex items-center h-9 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 text-sm font-medium ${isCollapsed ? "justify-center" : "px-3"
              }`}
            style={{ transition: "background 150ms, color 150ms" }}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOutIcon className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
