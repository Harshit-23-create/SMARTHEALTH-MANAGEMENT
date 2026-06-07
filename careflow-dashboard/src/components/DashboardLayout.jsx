import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bed,
  Users,
  AlertTriangle,
  BarChart3,
  CalendarCheck,
  Droplets,
  Pill,
  Truck,
  Settings,
  MapPin,
  Bell,
  Search,
  Menu,
  Heart,
  ChevronDown,
  LogOut,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Beds", path: "/beds", icon: Bed },
  { title: "Patients", path: "/patients", icon: Users },
  { title: "Emergency", path: "/emergency", icon: AlertTriangle },
  { title: "Analytics", path: "/analytics", icon: BarChart3 },
  { title: "Appointments", path: "/appointments", icon: CalendarCheck },
  { title: "Blood Bank", path: "/blood-bank", icon: Droplets },
  { title: "Pharmacy", path: "/pharmacy", icon: Pill },
  { title: "Ambulance", path: "/ambulance", icon: Truck },
  { title: "Hospital Finder", path: "/hospital-finder", icon: MapPin },
  { title: "Settings", path: "/settings", icon: Settings },
];

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // ✅ correct position

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-[72px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-sm">MediCare</h1>
              <p className="text-[10px] text-muted-foreground">
                Hospital Management
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className="p-3 border-t border-border hidden lg:block">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary w-full"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                sidebarOpen ? "rotate-90" : "-rotate-90"
              }`}
            />
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
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
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-secondary rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-secondary">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </button>

            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">Dr. Admin</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;