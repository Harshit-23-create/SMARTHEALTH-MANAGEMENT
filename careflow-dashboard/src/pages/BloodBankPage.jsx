import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import { useTranslation } from "react-i18next";
import {
  Droplets, Search, Plus, X
} from "lucide-react";

const initialBloodStock = [
  { id: 1, type: "O+", units: 45, status: "Healthy", lastUpdated: "10 mins ago" },
  { id: 2, type: "A+", units: 32, status: "Healthy", lastUpdated: "1 hour ago" },
  { id: 3, type: "B+", units: 12, status: "Low", lastUpdated: "5 mins ago" },
  { id: 4, type: "AB+", units: 5, status: "Critical", lastUpdated: "Just now" },
  { id: 5, type: "O-", units: 8, status: "Critical", lastUpdated: "30 mins ago" },
  { id: 6, type: "A-", units: 15, status: "Low", lastUpdated: "2 hours ago" },
  { id: 7, type: "B-", units: 22, status: "Healthy", lastUpdated: "1 day ago" },
  { id: 8, type: "AB-", units: 2, status: "Critical", lastUpdated: "Just now" },
];

const BloodBankPage = () => {
  const { push } = useNotifications();
  const { t } = useTranslation();
  const [stock, setStock] = useState(initialBloodStock);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [donors, setDonors] = useState([]);
  const [newDonor, setNewDonor] = useState({
    name: "", group: "A+", lastDonation: "", phone: "", status: "Eligible"
  });

  const filtered = stock.filter(s => s.type.toLowerCase().includes(search.toLowerCase()));

  const handleRequest = (type) => {
    push("blood", "Emergency Blood Request", `Requested 5 units of ${type} blood from central blood bank.`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t("bloodBank.title")}</h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("bloodBank.subtitle")}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-primary text-white rounded-xl hover:bg-gray-800 dark:hover:bg-primary/90 font-bold shadow-lg shadow-gray-200 dark:shadow-none transition-transform active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" /> {t("bloodBank.registerDonor")}
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blood group (e.g. O+, A-)..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 
                  ${item.status === 'Healthy' ? 'border-emerald-100 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 
                    item.status === 'Low' ? 'border-amber-100 dark:border-amber-950 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' : 'border-rose-100 dark:border-rose-950 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 animate-pulse'}`}>
                  <Droplets className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-800 text-white text-xs font-black px-3 py-1 rounded-full shadow-md border-2 border-white dark:border-gray-700">
                  {item.type}
                </div>
              </div>
              
              <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-1">{item.units}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t("bloodBank.availableUnits")}</p>

              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-full
                  ${item.status === 'Healthy' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 
                    item.status === 'Low' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'}`}>
                  {item.status} Status
              </span>

              {(item.status === "Critical" || item.status === "Low") && (
                <button onClick={() => handleRequest(item.type)} className="w-full mt-4 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/80 rounded-xl text-xs font-bold transition-colors">
                  {t("bloodBank.requestBlood")}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Donor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black">{t("bloodBank.registerDonor")}</h2>
                <p className="text-red-100 text-xs">Add a new blood donor to the central database</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setDonors([{
                id: Date.now(),
                ...newDonor
              }, ...donors]);
              setShowAddModal(false);
              setNewDonor({ name: "", group: "A+", lastDonation: "", phone: "", status: "Eligible" });
              push("blood", "Donor Registered", `${newDonor.name} has been added successfully.`);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Donor Name</label>
                <input required className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newDonor.name} onChange={e=>setNewDonor({...newDonor, name: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("bloodBank.bloodGroup")}</label>
                  <select required className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newDonor.group} onChange={e=>setNewDonor({...newDonor, group: e.target.value})}>
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>AB+</option><option>AB-</option>
                    <option>O+</option><option>O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                  <input required className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newDonor.phone} onChange={e=>setNewDonor({...newDonor, phone: e.target.value})} placeholder="e.g. 9876543210" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Last Donation Date</label>
                <input type="date" required className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newDonor.lastDonation} onChange={e=>setNewDonor({...newDonor, lastDonation: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-3 mt-4 bg-gray-900 dark:bg-primary text-white rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-primary/90 transition-colors shadow-lg active:scale-95 text-sm">{t("bloodBank.registerDonor")}</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BloodBankPage;