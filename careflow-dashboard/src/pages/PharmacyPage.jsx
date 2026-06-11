import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import { useTranslation } from "react-i18next";
import {
  Pill, Search, Plus, AlertCircle, CheckCircle, Package, TrendingDown, X
} from "lucide-react";

const initialInventory = [
  { id: 1, name: "Amoxicillin", category: "Antibiotic", stock: 1200, unit: "Tablets", status: "In Stock", expiry: "2026-12-01" },
  { id: 2, name: "Paracetamol", category: "Analgesic", stock: 45, unit: "Tablets", status: "Low Stock", expiry: "2025-08-15" },
  { id: 3, name: "Ibuprofen", category: "Anti-inflammatory", stock: 0, unit: "Tablets", status: "Out of Stock", expiry: "2025-05-20" },
  { id: 4, name: "Omeprazole", category: "Antacid", stock: 800, unit: "Capsules", status: "In Stock", expiry: "2027-01-10" },
  { id: 5, name: "Ciprofloxacin", category: "Antibiotic", stock: 30, unit: "Tablets", status: "Low Stock", expiry: "2025-11-22" },
];

const PharmacyPage = () => {
  const { push } = useNotifications();
  const { t } = useTranslation();
  const [inventory, setInventory] = useState(initialInventory);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "", category: "Antibiotics", stock: "", status: "In Stock"
  });

  const filtered = inventory.filter(i => {
    const mSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase());
    const mFilter = filter === "All" || i.status === filter;
    return mSearch && mFilter;
  });

  const handleOrder = (id, name) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, stock: i.stock + 500, status: "In Stock" } : i));
    push("pharmacy", "Stock Ordered", `500 units of ${name} ordered.`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-2xl">
              <Pill className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">{t("nav.pharmacy")} Inventory</h1>
              <p className="text-sm font-medium text-gray-500">Manage medicine stock and expiry alerts</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-bold shadow-lg shadow-gray-200 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Items</p>
            <h3 className="text-3xl font-black text-gray-900">{inventory.length}</h3>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">In Stock</p>
            <h3 className="text-3xl font-black text-emerald-600">{inventory.filter(i => i.status === "In Stock").length}</h3>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Low Stock</p>
            <h3 className="text-3xl font-black text-amber-500">{inventory.filter(i => i.status === "Low Stock").length}</h3>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Out of Stock</p>
            <h3 className="text-3xl font-black text-rose-500">{inventory.filter(i => i.status === "Out of Stock").length}</h3>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicines..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
          <div className="flex gap-2 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
            {["All", "In Stock", "Low Stock", "Out of Stock"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === f ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-black">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">{item.name}</h3>
                    <p className="text-xs font-bold text-gray-500">{item.category}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                  ${item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 
                    item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-rose-100 text-rose-700 animate-pulse'}`}>
                  {item.status}
                </span>
              </div>
              
              <div className="space-y-3 p-4 bg-gray-50 rounded-2xl mb-4">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div className="flex items-center gap-2"><Package className="w-4 h-4 text-emerald-500" /> <span className="font-semibold">Stock Level</span></div>
                  <span className={`font-black ${item.status === 'Out of Stock' ? 'text-rose-600' : item.status === 'Low Stock' ? 'text-amber-600' : 'text-gray-900'}`}>{item.stock} {item.unit}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div className="flex items-center gap-2"><TrendingDown className="w-4 h-4 text-gray-400" /> <span className="font-semibold">Expiry Date</span></div>
                  <span className="font-bold text-gray-500">{item.expiry}</span>
                </div>
              </div>

              {(item.status === "Low Stock" || item.status === "Out of Stock") && (
                <button onClick={() => handleOrder(item.id, item.name)} className="w-full py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-sm font-bold transition-colors">Order Restock</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black">Add Medicine</h2>
                <p className="text-emerald-100 text-sm">Add a new item to the pharmacy inventory</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setInventory([{
                id: Date.now(),
                ...newMed,
                stock: parseInt(newMed.stock) || 0
              }, ...inventory]);
              setShowAddModal(false);
              setNewMed({ name: "", category: "Antibiotics", stock: "", status: "In Stock" });
              push("pharmacy", "Medicine Added", `${newMed.name} has been added successfully.`);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Medicine Name</label>
                <input required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" value={newMed.name} onChange={e=>setNewMed({...newMed, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <select required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" value={newMed.category} onChange={e=>setNewMed({...newMed, category: e.target.value})}>
                    <option>Antibiotics</option><option>Painkillers</option>
                    <option>Cardiology</option><option>Neurology</option>
                    <option>Vitamins</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Initial Stock</label>
                  <input required type="number" min="0" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" value={newMed.stock} onChange={e=>setNewMed({...newMed, stock: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                <select required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" value={newMed.status} onChange={e=>setNewMed({...newMed, status: e.target.value})}>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 mt-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg active:scale-95">Add Medicine</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PharmacyPage;