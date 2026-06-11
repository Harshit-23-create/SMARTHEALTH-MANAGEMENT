import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  AlertTriangle, Truck, MapPin, Clock, Phone,
  CheckCircle, X, Activity, Siren, Radio,
  HeartPulse, User, Zap, Shield, TrendingUp,
} from "lucide-react";
import LiveMap from "@/components/LiveMap";

/* ── Priority config ─────────────────────────────────────── */
const PRIORITIES = [
  { id: "Low",      color: "from-emerald-500 to-green-500",    bg: "bg-emerald-50",   border: "border-emerald-300",   text: "text-emerald-700", dot: "bg-emerald-500" },
  { id: "Medium",   color: "from-sky-500 to-blue-500",         bg: "bg-sky-50",       border: "border-sky-300",       text: "text-sky-700",     dot: "bg-sky-500"     },
  { id: "High",     color: "from-amber-500 to-orange-500",     bg: "bg-amber-50",     border: "border-amber-300",     text: "text-amber-700",   dot: "bg-amber-500"   },
  { id: "Critical", color: "from-red-600 to-rose-500",         bg: "bg-red-50",       border: "border-red-300",       text: "text-red-700",     dot: "bg-red-500"     },
];

const getPriority = (id) => PRIORITIES.find((p) => p.id === id) || PRIORITIES[2];

/* ── Stat card ───────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, gradient, pulse }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${gradient}`}>
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
    }, 1000);
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
      showToast(`🚑 ${d.unit} dispatched! ETA: ${d.eta}`);
    }, 1200);
  };

  const pendingCount    = submittedRequests.filter((r) => r.status === "pending").length;
  const fulfilledCount  = submittedRequests.filter((r) => r.status === "fulfilled").length;
  const criticalCount   = submittedRequests.filter((r) => r.priority === "Critical" && r.status === "pending").length;

  return (
    <DashboardLayout>
      {/* ── Toast ───────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl
            border backdrop-blur-md animate-slide-up max-w-sm
            ${toast.type === "error"
              ? "bg-white/95 border-red-200 text-red-700"
              : "bg-white/95 border-green-200 text-green-700"
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

      <div className="space-y-6">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-100">
                <Siren className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Emergency Control</h1>
                <p className="text-sm text-gray-500">Real-time emergency coordination & ambulance dispatch</p>
              </div>
            </div>
          </div>
          {/* Critical alert badge */}
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-bold">{criticalCount} Critical Alert{criticalCount > 1 ? "s" : ""}!</span>
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-rose-500 flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-white/20">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Emergency Bed Request</h3>
                <p className="text-xs text-red-100">Submit urgent patient intake</p>
              </div>
            </div>

            <form onSubmit={handleEmergencySubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Patient Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      value={emergencyForm.patientName}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, patientName: e.target.value })}
                      placeholder="Full name"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                        focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Age</label>
                  <input
                    type="number"
                    min="0" max="150"
                    value={emergencyForm.age}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, age: e.target.value })}
                    placeholder="Years"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                      focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Condition / Complaint *</label>
                <input
                  value={emergencyForm.condition}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, condition: e.target.value })}
                  placeholder="e.g., Cardiac Arrest, Severe Trauma..."
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                    focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
                />
              </div>

              {/* Priority selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Priority Level</label>
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
                      {priority === p.id && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-current flex items-center justify-center">
                          <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                        </span>
                      )}
                      {p.id}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading === "emergency"}
                className="w-full py-3 rounded-xl font-bold text-sm text-white
                  bg-gradient-to-r from-red-600 to-rose-500
                  hover:from-red-700 hover:to-rose-600
                  shadow-lg shadow-red-200
                  disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2
                  hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading === "emergency" ? (
                  <>
                    <Activity className="w-4 h-4 animate-pulse" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Submit Emergency Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Ambulance Dispatch */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-white/20">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Dispatch Ambulance</h3>
                <p className="text-xs text-amber-100">Assign & track ambulance unit</p>
              </div>
            </div>

            <form onSubmit={handleAmbulanceDispatch} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pickup Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    value={ambulanceForm.pickup}
                    onChange={(e) => setAmbulanceForm({ ...ambulanceForm, pickup: e.target.value })}
                    placeholder="Street address or landmark"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                      focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contact Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="tel"
                    value={ambulanceForm.contact}
                    onChange={(e) => setAmbulanceForm({ ...ambulanceForm, contact: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                      focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ambulance Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {["BLS", "ALS", "ICU"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAmbulanceForm({ ...ambulanceForm, type })}
                      className={`py-2 rounded-xl text-xs font-bold border-2 transition-all duration-200
                        ${ambulanceForm.type === type
                          ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white border-transparent shadow-md scale-105"
                          : "bg-amber-50 text-amber-700 border-amber-200 hover:scale-105"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">BLS = Basic · ALS = Advanced · ICU = Critical Care</p>
              </div>

              <button
                type="submit"
                disabled={loading === "ambulance"}
                className="w-full py-3 rounded-xl font-bold text-sm text-white
                  bg-gradient-to-r from-amber-500 to-orange-500
                  hover:from-amber-600 hover:to-orange-600
                  shadow-lg shadow-amber-200
                  disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2
                  hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading === "ambulance" ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin" />
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    Dispatch Ambulance
                  </>
                )}
              </button>
            </form>

            {/* Dispatched units list */}
            {dispatchedAmbulances.length > 0 && (
              <div className="px-6 pb-6 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Active Dispatches
                </p>
                {dispatchedAmbulances.slice(0, 3).map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50
                      rounded-xl px-3 py-2.5 border border-amber-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-400
                      flex items-center justify-center text-white text-sm flex-shrink-0">
                      🚑
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-amber-800">{d.unit} · {d.type || "BLS"}</p>
                      <p className="text-[10px] text-amber-600 truncate">{d.pickup}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-black text-orange-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{d.eta}
                      </p>
                      <p className="text-[10px] text-gray-400">{d.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Requests table ──────────────────────────────────── */}
        {submittedRequests.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-red-100">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Emergency Requests</h3>
                  <p className="text-[11px] text-gray-400">{submittedRequests.length} total · {pendingCount} pending</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Live Queue</span>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {submittedRequests.map((req) => {
                const p = getPriority(req.priority);
                return (
                  <div
                    key={req.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Priority dot */}
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${p.dot}
                      ${req.priority === "Critical" && req.status === "pending" ? "animate-pulse shadow-[0_0_8px]" : ""}`}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900 truncate">{req.patientName}</p>
                        {req.age && <span className="text-[10px] text-gray-400">• {req.age}y</span>}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{req.condition}</p>
                    </div>

                    {/* Priority badge */}
                    <span className={`hidden sm:inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full border
                      ${p.bg} ${p.text} ${p.border}`}>
                      {req.priority}
                    </span>

                    {/* Time */}
                    <span className="text-xs text-gray-400 hidden sm:block flex-shrink-0">{req.time}</span>

                    {/* Action */}
                    {req.status === "pending" ? (
                      <button
                        onClick={() =>
                          setSubmittedRequests((prev) =>
                            prev.map((r) => r.id === req.id ? { ...r, status: "fulfilled" } : r)
                          )
                        }
                        className="flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg
                          bg-emerald-50 text-emerald-700 border border-emerald-200
                          hover:bg-emerald-100 transition-colors"
                      >
                        ✓ Fulfill
                      </button>
                    ) : (
                      <span className="flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg
                        bg-gray-100 text-gray-400">
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Map header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-blue-100">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Live Ambulance Tracking</h3>
                <p className="text-[11px] text-gray-400">Real-time GPS · Auto-updates every 2s</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Legend */}
              <div className="hidden sm:flex items-center gap-3 text-[10px] font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Hospital
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Patient
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Ambulance
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Live</span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <LiveMap />
          </div>

          {/* Map footer stats */}
          <div className="px-6 pb-5 grid grid-cols-3 gap-3">
            {[
              { label: "Hospital",    val: "City General",  icon: "🏥", color: "blue"  },
              { label: "Ambulance",   val: "AMB-003 · BLS", icon: "🚑", color: "amber" },
              { label: "Patient",     val: "Sector 14, ND", icon: "📍", color: "red"   },
            ].map(({ label, val, icon, color }) => (
              <div key={label}
                className={`flex items-center gap-2.5 bg-${color}-50 rounded-xl px-3 py-2.5 border border-${color}-100`}
              >
                <span className="text-lg">{icon}</span>
                <div>
                  <p className={`text-[10px] font-bold text-${color}-600 uppercase tracking-wide`}>{label}</p>
                  <p className="text-xs font-semibold text-gray-700 truncate">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmergencyPage;