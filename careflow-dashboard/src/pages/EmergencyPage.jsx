import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle, Truck, MapPin, Clock, Phone,
  CheckCircle, X, Siren, Radio,
  HeartPulse, User, Shield, TrendingUp,
} from "lucide-react";
import LiveMap from "@/components/LiveMap";

/* ── Priority config ─────────────────────────────────────── */
const PRIORITIES = [
  { id: "Low",      color: "from-emerald-500 to-green-500",    bg: "bg-emerald-50 dark:bg-emerald-950/40",   border: "border-emerald-300 dark:border-emerald-800",   text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  { id: "Medium",   color: "from-sky-500 to-blue-500",         bg: "bg-sky-50 dark:bg-sky-950/40",       border: "border-sky-300 dark:border-sky-800",       text: "text-sky-700 dark:text-sky-300",     dot: "bg-sky-500"     },
  { id: "High",     color: "from-amber-500 to-orange-500",     bg: "bg-amber-50 dark:bg-amber-950/40",     border: "border-amber-300 dark:border-amber-800",     text: "text-amber-700 dark:text-amber-300",   dot: "bg-amber-500"   },
  { id: "Critical", color: "from-red-600 to-rose-500",         bg: "bg-red-50 dark:bg-red-950/40",       border: "border-red-300 dark:border-red-800",       text: "text-red-700 dark:text-red-300",     dot: "bg-red-500"     },
];

const getPriority = (id) => PRIORITIES.find((p) => p.id === id) || PRIORITIES[2];

/* ── Stat card ───────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, gradient, pulse }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${gradient} shadow-lg`}>
    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
    <div className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full bg-white/5" />
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl bg-white/20 ${pulse ? "animate-pulse" : ""}`}>
          <Icon className="w-5 h-5" />
        </div>
        {pulse && (
          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Live
          </span>
        )}
      </div>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-xs text-white/80 font-medium mt-1">{label}</p>
    </div>
  </div>
);

const EmergencyPage = () => {
  const { t } = useTranslation();
  const [priority, setPriority] = useState("High");
  const [emergencyForm, setEmergencyForm] = useState({ patientName: "", condition: "", age: "" });
  const [ambulanceForm, setAmbulanceForm] = useState({ pickup: "", contact: "", type: "BLS" });
  const [toast, setToast] = useState(null);
  const [submittedRequests, setSubmittedRequests] = useState([
    { id: 1, patientName: "John Doe", condition: "Cardiac Arrest", priority: "Critical", time: "14:22", status: "pending", age: "58" },
    { id: 2, patientName: "Sarah Khan", condition: "Fracture", priority: "Medium", time: "14:35", status: "fulfilled", age: "34" },
  ]);
  const [dispatchedAmbulances, setDispatchedAmbulances] = useState([
    { id: 1, unit: "AMB-003", pickup: "Sector 14, New Delhi", contact: "9876543210", eta: "8 min", time: "14:20", status: "dispatched" },
  ]);
  const [loading, setLoading] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleEmergencySubmit = (e) => {
    e.preventDefault();
    if (!emergencyForm.patientName.trim() || !emergencyForm.condition.trim()) {
      showToast("Please fill in all required fields!", "error");
      return;
    }
    setLoading("emergency");
    setTimeout(() => {
      const r = {
        id: Date.now(),
        ...emergencyForm,
        priority,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "pending",
      };
      setSubmittedRequests((prev) => [r, ...prev]);
      setEmergencyForm({ patientName: "", condition: "", age: "" });
      setPriority("High");
      setLoading("");
      showToast(`🚨 Emergency request for ${r.patientName} submitted! Priority: ${priority}`);
    }, 800);
  };

  const handleAmbulanceDispatch = (e) => {
    e.preventDefault();
    if (!ambulanceForm.pickup.trim() || !ambulanceForm.contact.trim()) {
      showToast("Please fill in pickup location and contact!", "error");
      return;
    }
    setLoading("ambulance");
    setTimeout(() => {
      const d = {
        id: Date.now(),
        ...ambulanceForm,
        eta: `${Math.floor(Math.random() * 8) + 4} min`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        unit: `AMB-00${Math.floor(Math.random() * 8) + 1}`,
        status: "dispatched",
      };
      setDispatchedAmbulances((prev) => [d, ...prev]);
      setAmbulanceForm({ pickup: "", contact: "", type: "BLS" });
      setLoading("");
      showToast(`🚑 Ambulance ${d.unit} dispatched to ${d.pickup}! ETA: ${d.eta}`);
    }, 800);
  };

  const pendingCount   = submittedRequests.filter((r) => r.status === "pending").length;
  const fulfilledCount = submittedRequests.filter((r) => r.status === "fulfilled").length;
  const criticalCount  = submittedRequests.filter((r) => r.priority === "Critical" && r.status === "pending").length;

  return (
    <DashboardLayout>
      {/* Toast banner */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border
            backdrop-blur-md transition-all animate-bounce ${
              toast.type === "error"
                ? "bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                : "bg-green-50 dark:bg-green-950/80 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
            }`}
        >
          {toast.type === "error"
            ? <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            : <CheckCircle className="w-5 h-5 flex-shrink-0" />
          }
          <p className="text-sm font-semibold flex-1">{toast.message}</p>
          <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                <Siren className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t("emergency.title")}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("emergency.subtitle")}</p>
              </div>
            </div>
          </div>
          {/* Critical alert badge */}
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg animate-pulse text-sm font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>{criticalCount} Critical Alert{criticalCount > 1 ? "s" : ""}!</span>
            </div>
          )}
        </div>

        {/* ── Stats ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Pending Requests"     value={pendingCount}                    icon={AlertTriangle}  gradient="from-red-500 to-rose-600"      pulse={pendingCount > 0} />
          <StatCard label="Dispatched Ambulances" value={dispatchedAmbulances.length}    icon={Truck}          gradient="from-amber-500 to-orange-500" />
          <StatCard label="Fulfilled Today"       value={fulfilledCount}                  icon={CheckCircle}    gradient="from-emerald-500 to-green-600" />
          <StatCard label="Response Rate"         value="94%"                             icon={TrendingUp}     gradient="from-blue-500 to-indigo-600" />
        </div>

        {/* ── Forms row ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Emergency Bed Request */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
            <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-white/20">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{t("emergency.requestEmergency")}</h3>
                <p className="text-xs text-red-100">Submit urgent patient intake</p>
              </div>
            </div>

            <form onSubmit={handleEmergencySubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{t("patients.patientName")} *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      value={emergencyForm.patientName}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, patientName: e.target.value })}
                      placeholder="Full name"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{t("patients.age")}</label>
                  <input
                    type="number"
                    min="0" max="150"
                    value={emergencyForm.age}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, age: e.target.value })}
                    placeholder="Years"
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{t("emergency.condition")} *</label>
                <input
                  value={emergencyForm.condition}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, condition: e.target.value })}
                  placeholder="e.g., Cardiac Arrest, Severe Trauma..."
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Priority selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">{t("emergency.priority")}</label>
                <div className="grid grid-cols-4 gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id)}
                      className={`relative py-2 rounded-xl text-xs font-bold transition-all duration-200 border-2
                        ${priority === p.id
                          ? `bg-gradient-to-br ${p.color} text-white border-transparent shadow-lg scale-105`
                          : `${p.bg} ${p.text} ${p.border} hover:scale-105`
                        }`}
                    >
                      {t(`emergency.${p.id.toLowerCase()}`) || p.id}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading === "emergency"}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/20 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {loading === "emergency" ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <HeartPulse className="w-4 h-4" />
                    Submit Emergency Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Ambulance Dispatch */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
            <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-white/20">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{t("emergency.dispatchAmbulance")}</h3>
                <p className="text-xs text-amber-100">Deploy nearest available unit</p>
              </div>
            </div>

            <form onSubmit={handleAmbulanceDispatch} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{t("emergency.pickupLocation")} *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    value={ambulanceForm.pickup}
                    onChange={(e) => setAmbulanceForm({ ...ambulanceForm, pickup: e.target.value })}
                    placeholder="Enter street, landmark, area"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Contact Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="tel"
                    value={ambulanceForm.contact}
                    onChange={(e) => setAmbulanceForm({ ...ambulanceForm, contact: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Ambulance Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {["BLS", "ALS", "ICU"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAmbulanceForm({ ...ambulanceForm, type })}
                      className={`py-2 rounded-xl text-xs font-bold border-2 transition-all duration-200
                        ${ambulanceForm.type === type
                          ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white border-transparent shadow-md scale-105"
                          : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading === "ambulance"}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/20 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {loading === "ambulance" ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin" />
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    {t("emergency.dispatchAmbulance")}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── Requests table ──────────────────────────────────── */}
        {submittedRequests.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t("emergency.activeAlerts")}</h3>
                  <p className="text-[11px] text-gray-400">{submittedRequests.length} total · {pendingCount} pending</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">Live Queue</span>
              </div>
            </div>

            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {submittedRequests.map((req) => {
                const p = getPriority(req.priority);
                return (
                  <div key={req.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${p.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{req.patientName}</p>
                        {req.age && <span className="text-[10px] text-gray-400">• {req.age}y</span>}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{req.condition}</p>
                    </div>

                    <span className={`hidden sm:inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full border ${p.bg} ${p.text} ${p.border}`}>
                      {req.priority}
                    </span>

                    <span className="text-xs text-gray-400 hidden sm:block flex-shrink-0">{req.time}</span>

                    {req.status === "pending" ? (
                      <button
                        onClick={() =>
                          setSubmittedRequests((prev) =>
                            prev.map((r) => r.id === req.id ? { ...r, status: "fulfilled" } : r)
                          )
                        }
                        className="flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                      >
                        ✓ Fulfill
                      </button>
                    ) : (
                      <span className="flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400">
                        Fulfilled
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Live Map ────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t("emergency.liveTracking")}</h3>
                <p className="text-[11px] text-gray-400">Real-time GPS · Auto-updates every 2s</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <LiveMap />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmergencyPage;