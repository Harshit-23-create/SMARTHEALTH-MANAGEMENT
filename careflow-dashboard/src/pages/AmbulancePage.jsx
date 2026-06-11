import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import {
  Truck, Phone, MapPin, Clock, User, AlertCircle,
  RefreshCw, Plus, Edit2, Trash2, X, Activity,
  Fuel, Shield, Navigation, Radio, Zap, CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

const initialAmbulances = [
  { id: "AMB-001", driver: "James Miller",  phone: "+1-555-0101", status: "Available",   location: "Station A",   eta: "—",      type: "BLS", fuel: 92, lastUpdated: new Date().toISOString() },
  { id: "AMB-002", driver: "Sarah Lee",     phone: "+1-555-0102", status: "On Duty",     location: "Downtown",    eta: "8 min",  type: "ALS", fuel: 67, lastUpdated: new Date().toISOString() },
  { id: "AMB-003", driver: "Robert Brown",  phone: "+1-555-0103", status: "On Duty",     location: "Highway 5",   eta: "15 min", type: "ICU", fuel: 45, lastUpdated: new Date().toISOString() },
  { id: "AMB-004", driver: "Maria Garcia",  phone: "+1-555-0104", status: "Available",   location: "Station B",   eta: "—",      type: "BLS", fuel: 88, lastUpdated: new Date().toISOString() },
  { id: "AMB-005", driver: "David Kim",     phone: "+1-555-0105", status: "Maintenance", location: "Garage",      eta: "—",      type: "ALS", fuel: 30, lastUpdated: new Date().toISOString() },
  { id: "AMB-006", driver: "Emily Chen",    phone: "+1-555-0106", status: "Available",   location: "Station C",   eta: "—",      type: "ICU", fuel: 100, lastUpdated: new Date().toISOString() },
];

const STATUS_CONFIG = {
  "Available":   { gradient: "from-emerald-500 to-green-500",  bg: "bg-emerald-50",   border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  "On Duty":     { gradient: "from-amber-500 to-orange-500",   bg: "bg-amber-50",     border: "border-amber-200",   text: "text-amber-700",   dot: "bg-amber-500"   },
  "Maintenance": { gradient: "from-red-500 to-rose-500",       bg: "bg-red-50",       border: "border-red-200",     text: "text-red-700",     dot: "bg-red-500"     },
};

const TYPE_BADGE = {
  BLS: "bg-blue-100 text-blue-700",
  ALS: "bg-purple-100 text-purple-700",
  ICU: "bg-rose-100 text-rose-700",
};

const FuelBar = ({ pct }) => {
  const color = pct > 60 ? "from-emerald-400 to-green-500" : pct > 30 ? "from-amber-400 to-orange-400" : "from-red-400 to-rose-500";
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
};

const AmbulancePage = () => {
  const { push } = useNotifications();
  const [ambulances, setAmbulances] = useState(initialAmbulances);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState(null);
  const [formData, setFormData] = useState({ driver: "", phone: "", status: "Available", location: "", eta: "—", type: "BLS", fuel: 100 });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const available    = ambulances.filter((a) => a.status === "Available").length;
  const onDuty       = ambulances.filter((a) => a.status === "On Duty").length;
  const maintenance  = ambulances.filter((a) => a.status === "Maintenance").length;

  const filtered = ambulances.filter((a) => {
    const s = searchTerm.toLowerCase();
    const matchSearch = a.id.toLowerCase().includes(s) || a.driver.toLowerCase().includes(s) || a.location.toLowerCase().includes(s);
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Live ETA countdown
  useEffect(() => {
    const t = setInterval(() => {
      setAmbulances((prev) =>
        prev.map((a) => {
          if (a.status === "On Duty" && a.eta !== "—" && a.eta !== "Arriving") {
            const n = parseInt(a.eta);
            if (!isNaN(n) && n > 0) {
              const next = n - 1;
              if (next === 0) push("ambulance", "Ambulance Arriving", `${a.id} is arriving at destination`);
              return { ...a, eta: next > 0 ? `${next} min` : "Arriving", lastUpdated: new Date().toISOString() };
            }
          }
          return a;
        })
      );
    }, 60000);
    return () => clearInterval(t);
  }, [push]);

  const handleStatusChange = (id, newStatus) => {
    const amb = ambulances.find((a) => a.id === id);
    setAmbulances((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: newStatus, eta: newStatus === "On Duty" ? "10 min" : "—", lastUpdated: new Date().toISOString() } : a
      )
    );
    push("ambulance", `${id} Status Changed`, `${amb?.driver} — status updated to ${newStatus}`);
    showToast(`${id} marked as ${newStatus}`);
  };

  const handleDispatch = (amb) => {
    handleStatusChange(amb.id, "On Duty");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsRefreshing(false);
    showToast("Fleet data refreshed");
  };

  const openAdd = () => { setEditingAmbulance(null); setFormData({ driver: "", phone: "", status: "Available", location: "", eta: "—", type: "BLS", fuel: 100 }); setIsModalOpen(true); };
  const openEdit = (a)  => { setEditingAmbulance(a); setFormData({ driver: a.driver, phone: a.phone, status: a.status, location: a.location, eta: a.eta, type: a.type, fuel: a.fuel }); setIsModalOpen(true); };

  const handleSave = () => {
    if (!formData.driver || !formData.phone || !formData.location) { showToast("Fill all required fields", "error"); return; }
    if (editingAmbulance) {
      setAmbulances((p) => p.map((a) => a.id === editingAmbulance.id ? { ...a, ...formData, lastUpdated: new Date().toISOString() } : a));
      push("ambulance", "Ambulance Updated", `${editingAmbulance.id} details updated`);
      showToast(`${editingAmbulance.id} updated`);
    } else {
      const id = `AMB-${String(ambulances.length + 1).padStart(3, "0")}`;
      setAmbulances((p) => [...p, { id, ...formData, lastUpdated: new Date().toISOString() }]);
      push("ambulance", "New Ambulance Added", `${id} — ${formData.driver} added to fleet`);
      showToast(`${id} added to fleet`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm(`Remove ${id} from fleet?`)) return;
    setAmbulances((p) => p.filter((a) => a.id !== id));
    push("ambulance", "Ambulance Removed", `${id} removed from fleet`);
    showToast(`${id} removed`);
  };

  const timeAgo = (ts) => {
    const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return `${Math.floor(s / 3600)}h ago`;
  };

  return (
    <DashboardLayout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border
          ${toast.type === "error" ? "bg-white border-red-200 text-red-700" : "bg-white border-green-200 text-green-700"}`}>
          {toast.type === "error" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span className="text-sm font-semibold">{toast.msg}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <Truck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Ambulance Fleet</h1>
              <p className="text-sm text-gray-500">Real-time fleet management & dispatch control</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-sm font-medium transition-all">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-600" : "text-gray-600"}`} />
              Refresh
            </button>
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500
                text-white rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200 text-sm font-medium transition-all">
              <Plus className="w-4 h-4" />
              Add Ambulance
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Fleet",    val: ambulances.length, gradient: "from-blue-500 to-indigo-600",   icon: Truck,        pulse: false },
            { label: "Available",      val: available,         gradient: "from-emerald-500 to-green-600", icon: CheckCircle,  pulse: available > 0 },
            { label: "On Duty",        val: onDuty,            gradient: "from-amber-500 to-orange-500",  icon: Navigation,   pulse: onDuty > 0 },
            { label: "Maintenance",    val: maintenance,       gradient: "from-red-500 to-rose-600",      icon: AlertCircle,  pulse: false },
          ].map(({ label, val, gradient, icon: Icon, pulse }) => (
            <div key={label} className={`relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${gradient}`}>
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
              <div className="relative">
                <div className={`p-2 rounded-xl bg-white/20 w-fit mb-3 ${pulse ? "animate-pulse" : ""}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-3xl font-black">{val}</p>
                <p className="text-xs text-white/80 font-medium mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Radio className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by unit ID, driver or location..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "Available", "On Duty", "Maintenance"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${statusFilter === s
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((amb) => {
            const cfg = STATUS_CONFIG[amb.status];
            return (
              <div key={amb.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
                {/* Card top bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.gradient}`} />

                <div className="p-5">
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cfg.bg} border ${cfg.border}`}>
                        <span className="text-xl">🚑</span>
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm">{amb.id}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_BADGE[amb.type] || "bg-gray-100 text-gray-600"}`}>
                          {amb.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(amb)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
                        <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                      <button onClick={() => handleDelete(amb.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot} ${amb.status === "On Duty" ? "animate-pulse" : ""}`} />
                    <span className={`text-xs font-bold ${cfg.text}`}>{amb.status}</span>
                    {amb.status === "On Duty" && (
                      <span className="ml-auto flex items-center gap-1 text-xs font-black text-amber-600">
                        <Clock className="w-3 h-3 animate-pulse" />
                        ETA {amb.eta}
                      </span>
                    )}
                  </div>

                  {/* Info rows */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium text-gray-800">{amb.driver}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`tel:${amb.phone}`} className="hover:text-blue-600 transition-colors">{amb.phone}</a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{amb.location}</span>
                    </div>

                    {/* Fuel gauge */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Fuel className="w-3 h-3" />
                          Fuel Level
                        </div>
                        <span className={`text-xs font-bold ${amb.fuel > 60 ? "text-green-600" : amb.fuel > 30 ? "text-amber-600" : "text-red-600"}`}>
                          {amb.fuel}%
                        </span>
                      </div>
                      <FuelBar pct={amb.fuel} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">Updated {timeAgo(amb.lastUpdated)}</span>
                    {amb.status === "Available" ? (
                      <button onClick={() => handleDispatch(amb)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                          bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm">
                        <Zap className="w-3 h-3" /> Dispatch
                      </button>
                    ) : amb.status === "On Duty" ? (
                      <button onClick={() => handleStatusChange(amb.id, "Available")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                          bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all">
                        <CheckCircle className="w-3 h-3" /> Complete
                      </button>
                    ) : (
                      <button onClick={() => handleStatusChange(amb.id, "Available")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                          bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all">
                        <Shield className="w-3 h-3" /> Cleared
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">🚑</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No units found</h3>
            <p className="text-gray-500 text-sm">Adjust your search or filters</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">{editingAmbulance ? "Edit Unit" : "Add New Unit"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Driver Name *", key: "driver", placeholder: "Full name" },
                { label: "Phone Number *", key: "phone", placeholder: "+1-555-xxxx" },
                { label: "Location *",    key: "location", placeholder: "e.g. Station A" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  <input
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200">
                    {["Available", "On Duty", "Maintenance"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200">
                    {["BLS", "ALS", "ICU"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fuel Level: {formData.fuel}%</label>
                <input type="range" min="0" max="100" value={formData.fuel}
                  onChange={(e) => setFormData({ ...formData, fuel: Number(e.target.value) })}
                  className="w-full accent-amber-500" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white
                    bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all">
                  {editingAmbulance ? "Save Changes" : "Add to Fleet"}
                </button>
                <button onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AmbulancePage;