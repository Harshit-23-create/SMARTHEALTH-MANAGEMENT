import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Bed, Users, AlertTriangle, BarChart3,
  CalendarCheck, Droplets, Pill, Truck, Settings, MapPin,
  Bell, Search, Menu, Heart, ChevronDown, LogOut, X,
  CheckCheck, Trash2, Globe, Sun, Moon
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

const navItems = [
  { key: "dashboard",      path: "/dashboard",      icon: LayoutDashboard },
  { key: "beds",           path: "/beds",            icon: Bed             },
  { key: "patients",       path: "/patients",        icon: Users           },
  { key: "emergency",      path: "/emergency",       icon: AlertTriangle   },
  { key: "analytics",      path: "/analytics",       icon: BarChart3       },
  { key: "appointments",   path: "/appointments",    icon: CalendarCheck   },
  { key: "bloodBank",      path: "/blood-bank",      icon: Droplets        },
  { key: "pharmacy",       path: "/pharmacy",        icon: Pill            },
  { key: "ambulance",      path: "/ambulance",       icon: Truck           },
  { key: "hospitalFinder", path: "/hospital-finder", icon: MapPin          },
  { key: "settings",       path: "/settings",        icon: Settings        },
];

const timeAgo = (iso) => {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60)  return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
};

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [mobileOpen,  setMobileOpen]    = useState(false);
  const [notifOpen,   setNotifOpen]     = useState(false);
  const [langOpen,    setLangOpen]      = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const notifRef  = useRef(null);
  const langRef   = useRef(null);

  const { notifications, unreadCount, markRead, markAllRead, clearAll, TYPE_META } = useNotifications();
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Get logged-in user info
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-[72px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-sm">MediCare</h1>
              <p className="text-[10px] text-muted-foreground">{t("common.hospitalManagement")}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                  ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{t(`nav.${item.key}`)}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse */}
        <div className="p-3 border-t border-border hidden lg:block">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary w-full"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${sidebarOpen ? "rotate-90" : "-rotate-90"}`} />
            {sidebarOpen && <span>{t("nav.collapse")}</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("common.search")}
                className="pl-10 pr-4 py-2 bg-secondary rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ── Theme Toggle Button ───────────────────── */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 border border-transparent hover:border-border"
              title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400 animate-fade-in" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 animate-fade-in" />
              )}
            </button>

            {/* ── Language Switcher ───────────────────────── */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((o) => !o)}
                className="p-2 rounded-lg hover:bg-secondary dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 border border-transparent hover:border-border"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span>{i18n.language.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-12 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 z-[9999] overflow-hidden py-1">
                  <button
                    onClick={() => { i18n.changeLanguage('en'); setLangOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs transition flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${i18n.language === 'en' ? 'text-primary font-bold bg-primary/10' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    <span>🇺🇸</span>
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => { i18n.changeLanguage('hi'); setLangOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs transition flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${i18n.language === 'hi' ? 'text-primary font-bold bg-primary/10' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    <span>🇮🇳</span>
                    <span>हिंदी (Hindi)</span>
                  </button>
                  <button
                    onClick={() => { i18n.changeLanguage('es'); setLangOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs transition flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${i18n.language === 'es' ? 'text-primary font-bold bg-primary/10' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    <span>🇪🇸</span>
                    <span>Español</span>
                  </button>
                </div>
              )}
            </div>

            {/* ── Notification Bell ─────────────────────── */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Notifications"
              >
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? "text-primary" : "text-muted-foreground"}`} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center
                    rounded-full bg-red-500 text-white text-[9px] font-bold px-1 shadow-sm">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown panel */}
              {notifOpen && (
                <div className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
                  border border-gray-100 dark:border-gray-700 z-[9999] overflow-hidden">
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <p className="text-[11px] text-gray-500">{unreadCount} unread</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
                          title="Mark all as read"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          All read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAll}
                          className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-600 font-semibold"
                          title="Clear all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Clear
                        </button>
                      )}
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Bell className="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm font-medium">No notifications</p>
                        <p className="text-xs">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const meta = TYPE_META[n.type] || TYPE_META.system;
                        return (
                          <div
                            key={n.id}
                            onClick={() => markRead(n.id)}
                            className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors
                              ${n.read ? "bg-white dark:bg-gray-900 hover:bg-gray-50" : "bg-blue-50/60 hover:bg-blue-50"}`}
                          >
                            {/* Colored dot */}
                            <div className="flex-shrink-0 mt-1">
                              <span className={`w-2.5 h-2.5 rounded-full inline-block ${n.read ? "bg-gray-300" : meta.dot}`} />
                            </div>
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-xs font-bold truncate ${n.read ? "text-gray-500" : "text-gray-900"}`}>
                                  {n.title}
                                </p>
                                <span className="text-[10px] text-gray-400 flex-shrink-0">{timeAgo(n.time)}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                              <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white ${meta.color}`}>
                                {meta.label}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        See all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User info */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">Dr. {user.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role || "Administrator"}</p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t("nav.logout")}</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;