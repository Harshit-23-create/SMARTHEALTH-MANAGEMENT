import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import { useTranslation } from "react-i18next";
import {
  Bed, RefreshCw, Search,
  Activity, Users,
  TrendingUp, TrendingDown,
  Edit, Plus, CheckCircle, X
} from "lucide-react";

const initialWards = [
  { id: 1, name: "General Ward A", total: 50, available: 12, occupied: 38, status: "green",  department: "General Medicine", headNurse: "Sarah Johnson", occupancy: 76, maintenance: 0, lastUpdated: "2 min ago", trend: "+3" },
  { id: 2, name: "General Ward B", total: 50, available: 5,  occupied: 45, status: "yellow", department: "General Medicine", headNurse: "Michael Chen", occupancy: 90, maintenance: 0, lastUpdated: "5 min ago", trend: "-2" },
  { id: 3, name: "ICU",            total: 20, available: 2,  occupied: 17, status: "red",    department: "Critical Care",    headNurse: "Emily Williams", occupancy: 85, maintenance: 1, lastUpdated: "1 min ago", trend: "+1" },
  { id: 4, name: "Pediatric Ward", total: 30, available: 15, occupied: 15, status: "green",  department: "Pediatrics",       headNurse: "David Martinez", occupancy: 50, maintenance: 0, lastUpdated: "10 min ago", trend: "+5" },
  { id: 5, name: "Maternity Ward", total: 25, available: 8,  occupied: 16, status: "green",  department: "Obstetrics",       headNurse: "Lisa Thompson", occupancy: 64, maintenance: 1, lastUpdated: "3 min ago", trend: "+2" },
  { id: 6, name: "Surgical Ward",  total: 40, available: 3,  occupied: 35, status: "red",    department: "Surgery",          headNurse: "Robert Garcia", occupancy: 87.5, maintenance: 2, lastUpdated: "4 min ago", trend: "-1" },
  { id: 7, name: "Orthopedic",     total: 35, available: 10, occupied: 24, status: "green",  department: "Orthopedics",      headNurse: "James Wilson", occupancy: 68.5, maintenance: 1, lastUpdated: "15 min ago", trend: "0" },
  { id: 8, name: "Cardiac Care",   total: 15, available: 1,  occupied: 14, status: "red",    department: "Cardiology",       headNurse: "Amanda Taylor", occupancy: 93.3, maintenance: 0, lastUpdated: "Just now", trend: "+2" },
  { id: 9, name: "Neurology",      total: 20, available: 4,  occupied: 16, status: "yellow", department: "Neurology",        headNurse: "Thomas Anderson", occupancy: 80, maintenance: 0, lastUpdated: "8 min ago", trend: "+1" },
];

const StatCard = ({ title, value, icon: Icon, gradient, pulse }) => (
  <div className={`relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br ${gradient} shadow-xl hover:-translate-y-1 transition-transform`}>
    <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-black">{value}</h3>
      </div>
      <div className={`p-4 bg-white/20 rounded-2xl backdrop-blur-sm ${pulse ? "animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.5)]" : ""}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
  </div>
);

const OccupancyRing = ({ percentage, colorClass }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="40" cy="40" r={radius} className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="6" fill="none" />
        <circle
          cx="40" cy="40" r={radius}
          className={`stroke-current ${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth="6" strokeLinecap="round" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-sm font-black ${colorClass}`}>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

const BedManagementPage = () => {
  const { push } = useNotifications();
  const { t } = useTranslation();
  const [wards, setWards] = useState(initialWards);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWard, setNewWard] = useState({
    name: "", department: "General Medicine", total: "", headNurse: ""
  });

  const [editForm, setEditForm] = useState({ available: "", occupied: "", maintenance: "", headNurse: "" });

  const totalBeds = wards.reduce((acc, w) => acc + w.total, 0);
  const availableBeds = wards.reduce((acc, w) => acc + w.available, 0);
  const occupiedBeds = wards.reduce((acc, w) => acc + w.occupied, 0);
  const maintenanceBeds = wards.reduce((acc, w) => acc + w.maintenance, 0);

  const filteredWards = wards.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" ? true : filter === "Critical" ? w.status === "red" : filter === "Warning" ? w.status === "yellow" : w.status === "green";
    return matchesSearch && matchesFilter;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 600));
    setIsRefreshing(false);
    push("bed", "Bed Data Refreshed", "Ward occupancy synchronized across all hospital wings");
  };

  const handleOpenEdit = (ward) => {
    push("bed", "Editing Ward", `Opening configuration for ${ward.name}...`);
    setSelectedWard(ward);
    setEditForm({ available: ward.available, occupied: ward.occupied, maintenance: ward.maintenance, headNurse: ward.headNurse });
    setIsModalOpen(true);
  };

  const handleAdmitPatient = (wardId) => {
    setWards(prev => prev.map(w => {
      if (w.id === wardId && w.available > 0) {
        push("bed", "Patient Admitted", `New admission in ${w.name}`);
        const newAvailable = w.available - 1;
        const newOccupied = w.occupied + 1;
        const newOccPct = (newOccupied / w.total) * 100;
        let newStatus = "green";
        if (newOccPct >= 90) newStatus = "red";
        else if (newOccPct >= 80) newStatus = "yellow";
        
        return { ...w, available: newAvailable, occupied: newOccupied, occupancy: newOccPct, status: newStatus };
      }
      return w;
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <Bed className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t("beds.title")}</h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("beds.subtitle")}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold transition-colors shadow-sm text-sm">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} /> {t("common.refresh")}
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 font-bold shadow-lg shadow-indigo-500/20 transition-transform active:scale-95 text-sm"
            >
              <Plus className="w-4 h-4" /> {t("beds.addWard")}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t("beds.totalBeds")} value={totalBeds} icon={Bed} gradient="from-blue-500 to-indigo-600" />
          <StatCard title={t("beds.available")} value={availableBeds} icon={CheckCircle} gradient="from-emerald-400 to-teal-500" />
          <StatCard title={t("beds.occupied")} value={occupiedBeds} icon={Users} gradient="from-amber-400 to-orange-500" />
          <StatCard title={t("beds.maintenance")} value={maintenanceBeds} icon={Activity} gradient="from-rose-400 to-red-500" pulse={maintenanceBeds > 0} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search wards or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
          <div className="flex gap-2 p-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            {["All", "Available", "Warning", "Critical"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  filter === f ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWards.map(ward => {
            const statusColor = ward.status === "red" ? "text-rose-600 dark:text-rose-400" : ward.status === "yellow" ? "text-amber-500 dark:text-amber-400" : "text-emerald-500 dark:text-emerald-400";
            const cardBg = ward.status === "red" ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40" : 
                           ward.status === "yellow" ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40" : 
                           "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800";
            return (
              <div key={ward.id} className={`rounded-3xl border ${cardBg} shadow-sm hover:shadow-xl transition-all p-5 flex flex-col`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">{ward.name}</h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">{ward.department}</p>
                  </div>
                  <button onClick={() => handleOpenEdit(ward)} className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <OccupancyRing percentage={ward.occupancy} colorClass={statusColor} />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div className="bg-white dark:bg-gray-800/80 rounded-xl p-2.5 border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{t("beds.available")}</p>
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{ward.available}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800/80 rounded-xl p-2.5 border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{t("beds.occupied")}</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">{ward.occupied}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    <Users className="w-4 h-4 text-gray-400" />
                    {t("beds.headNurse")}: <span className="text-gray-900 dark:text-white font-bold">{ward.headNurse}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    <Activity className="w-4 h-4 text-gray-400" />
                    {t("beds.maintenance")}: <span className={ward.maintenance > 0 ? "text-rose-600 dark:text-rose-400 font-bold" : "text-gray-900 dark:text-white"}>{ward.maintenance} Beds</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100/50 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                    {ward.trend.startsWith("+") ? <TrendingUp className="w-3.5 h-3.5 text-rose-500" /> : <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />}
                    {ward.trend} this week
                  </div>
                  <button 
                    onClick={() => handleAdmitPatient(ward.id)}
                    disabled={ward.available === 0}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5
                      ${ward.available === 0 
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed" 
                        : "bg-gray-900 dark:bg-primary text-white hover:bg-gray-800 dark:hover:bg-primary/90 shadow-md hover:-translate-y-0.5 active:translate-y-0"}`}
                  >
                    <Plus className="w-3.5 h-3.5" /> Admit Patient
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Ward Modal */}
      {isModalOpen && selectedWard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black">{t("beds.editWard")}</h2>
                <p className="text-blue-100 text-xs">{selectedWard.name} — {selectedWard.department}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const available = parseInt(editForm.available) || 0;
              const occupied = parseInt(editForm.occupied) || 0;
              const maintenance = parseInt(editForm.maintenance) || 0;
              const newOccPct = selectedWard.total > 0 ? (occupied / selectedWard.total) * 100 : 0;
              let newStatus = "green";
              if (newOccPct >= 90) newStatus = "red";
              else if (newOccPct >= 80) newStatus = "yellow";
              setWards(prev => prev.map(w => w.id === selectedWard.id
                ? { ...w, available, occupied, maintenance, headNurse: editForm.headNurse, occupancy: newOccPct, status: newStatus, lastUpdated: "Just now" }
                : w
              ));
              push("bed", "Ward Updated", `${selectedWard.name} configuration saved.`);
              setIsModalOpen(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("beds.headNurse")}</label>
                <input required className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={editForm.headNurse} onChange={e => setEditForm({...editForm, headNurse: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("beds.available")}</label>
                  <input required type="number" min="0" max={selectedWard.total} className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={editForm.available} onChange={e => setEditForm({...editForm, available: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("beds.occupied")}</label>
                  <input required type="number" min="0" max={selectedWard.total} className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={editForm.occupied} onChange={e => setEditForm({...editForm, occupied: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("beds.maintenance")}</label>
                  <input required type="number" min="0" className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={editForm.maintenance} onChange={e => setEditForm({...editForm, maintenance: e.target.value})} />
                </div>
              </div>
              <p className="text-xs text-gray-400">Total capacity: <span className="font-bold text-gray-700 dark:text-gray-300">{selectedWard.total} beds</span></p>
              <button type="submit" className="w-full py-3 mt-4 bg-gray-900 dark:bg-primary text-white rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-primary/90 transition-colors shadow-lg active:scale-95 text-sm">{t("common.save")}</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Ward Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black">{t("beds.addWard")}</h2>
                <p className="text-blue-100 text-xs">Enter ward configuration details</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const total = parseInt(newWard.total) || 0;
              setWards([...wards, {
                id: Date.now(),
                name: newWard.name,
                total: total,
                available: total,
                occupied: 0,
                status: "green",
                department: newWard.department,
                headNurse: newWard.headNurse,
                occupancy: 0,
                maintenance: 0,
                lastUpdated: "Just now",
                trend: "0"
              }]);
              setShowAddModal(false);
              setNewWard({ name: "", department: "General Medicine", total: "", headNurse: "" });
              push("bed", "Ward Created", `${newWard.name} has been added successfully.`);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("beds.wardName")}</label>
                <input required className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newWard.name} onChange={e=>setNewWard({...newWard, name: e.target.value})} placeholder="e.g. Isolation Ward" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("beds.department")}</label>
                <input required className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newWard.department} onChange={e=>setNewWard({...newWard, department: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Capacity</label>
                  <input required type="number" min="1" className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newWard.total} onChange={e=>setNewWard({...newWard, total: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("beds.headNurse")}</label>
                  <input required className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newWard.headNurse} onChange={e=>setNewWard({...newWard, headNurse: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full py-3 mt-4 bg-gray-900 dark:bg-primary text-white rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-primary/90 transition-colors shadow-lg active:scale-95 text-sm">{t("beds.addWard")}</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BedManagementPage;
