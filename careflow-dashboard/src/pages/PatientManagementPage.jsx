import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "@/utils/api";
import { 
  Search, Plus, X, Filter, Download,
  User, Activity, Bed, Heart, 
  Phone, AlertCircle, CheckCircle,
  Clock, Edit, Trash2, Eye,
  ChevronLeft, ChevronRight,
  Users, RefreshCw, Loader, Stethoscope
} from "lucide-react";

const PatientManagementPage = () => {
  const { push } = useNotifications();
  const { t } = useTranslation();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    name: "", age: "", gender: "Male", disease: "",
    bed: "", department: "General Medicine", 
    contactNumber: "", status: "Admitted", doctor: ""
  });

  const fetchPatients = async () => {
    try {
      setLoading(true);
      // Artificial delay so the user sees the refresh spin animation
      await new Promise(r => setTimeout(r, 600));
      const res = await fetch(`${API_BASE_URL}/patients`);
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        push("patient", "Patient Admitted", `${formData.name} admitted to ${formData.department}`);
        fetchPatients();
        setShowModal(false);
        // Reset form for next use
        setFormData({
          name: "", age: "", gender: "Male", disease: "",
          bed: "", department: "General Medicine",
          contactNumber: "", status: "Admitted", doctor: ""
        });
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to admit patient. Please try again.");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Cannot connect to server. Make sure the backend is running.");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Discharge patient ${name}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${id}`, { method: "DELETE" });
      if (res.ok) {
        push("patient", "Patient Discharged", `${name} has been discharged.`);
        fetchPatients();
      } else {
        alert("Failed to discharge patient. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Cannot connect to server. Make sure the backend is running.");
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.disease || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const stats = {
    total: patients.length,
    critical: patients.filter(p => p.status === "Critical").length,
    admitted: patients.filter(p => p.status === "Admitted").length,
    recovering: patients.filter(p => p.status === "Recovering").length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">{t("nav.patients")} Directory</h1>
              <p className="text-sm font-medium text-gray-500">Manage admissions, discharges & patient records</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchPatients} className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-gray-700 hover:bg-gray-50 font-bold transition-colors shadow-sm">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold shadow-lg shadow-blue-200 transition-transform active:scale-95">
              <Plus className="w-4 h-4" /> Admit Patient
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-6 h-6" /></div>
            <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total</p><p className="text-2xl font-black text-gray-900">{stats.total}</p></div>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
            <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Critical</p><p className="text-2xl font-black text-rose-600">{stats.critical}</p></div>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Activity className="w-6 h-6" /></div>
            <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Admitted</p><p className="text-2xl font-black text-amber-600">{stats.admitted}</p></div>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-6 h-6" /></div>
            <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Recovering</p><p className="text-2xl font-black text-emerald-600">{stats.recovering}</p></div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div className="flex gap-2 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
            {["All", "Admitted", "Critical", "Recovering"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === f ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPatients.map(p => (
            <div key={p._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">{p.name}</h3>
                    <p className="text-xs font-bold text-gray-500">{p.age}y • {p.gender}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                  ${p.status === 'Critical' ? 'bg-rose-100 text-rose-600 animate-pulse' : 
                    p.status === 'Admitted' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {p.status}
                </span>
              </div>
              
              <div className="space-y-3 p-4 bg-gray-50 rounded-2xl mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Heart className="w-4 h-4 text-rose-500" /> <span className="font-semibold truncate">{p.disease}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Stethoscope className="w-4 h-4 text-blue-500" /> <span className="font-semibold">{p.doctor || "Unassigned"}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div className="flex items-center gap-2"><Bed className="w-4 h-4 text-indigo-500" /> <span className="font-semibold">{p.bed || "TBA"}</span></div>
                  <span className="text-xs font-bold text-gray-400 px-2 py-0.5 bg-gray-200 rounded-md">{p.department}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <button onClick={() => push("patient", "Viewing Patient", `Loading medical record for ${p.name}...`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => push("patient", "Editing Patient", `Opening edit form for ${p.name}...`)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                </div>
                <button onClick={() => handleDelete(p._id, p.name)} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Discharge
                </button>
              </div>
            </div>
          ))}
          
          {paginatedPatients.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-gray-100">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-bold">No patients found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 bg-white rounded-lg border border-gray-200 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex items-center px-4 bg-white rounded-lg border border-gray-200 font-bold text-sm">Page {currentPage} of {totalPages}</div>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 bg-white rounded-lg border border-gray-200 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black">Admit New Patient</h2>
                <p className="text-blue-100 text-sm">Enter patient details below</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddPatient} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Row 1: Name + Age */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input required placeholder="e.g. John Doe" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Age</label>
                  <input required type="number" min="0" max="150" placeholder="e.g. 35" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.age} onChange={e=>setFormData({...formData, age: e.target.value})} />
                </div>
              </div>

              {/* Row 2: Gender + Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Gender</label>
                  <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.gender} onChange={e=>setFormData({...formData, gender: e.target.value})}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Contact Number</label>
                  <input required placeholder="e.g. 9876543210" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.contactNumber} onChange={e=>setFormData({...formData, contactNumber: e.target.value})} />
                </div>
              </div>

              {/* Row 3: Diagnosis */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Diagnosis / Disease</label>
                <input required placeholder="e.g. Malaria, Typhoid..." className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.disease} onChange={e=>setFormData({...formData, disease: e.target.value})} />
              </div>

              {/* Row 4: Department + Bed */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Department</label>
                  <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.department} onChange={e=>setFormData({...formData, department: e.target.value})}>
                    <option>General Medicine</option>
                    <option>Critical Care</option>
                    <option>Pediatrics</option>
                    <option>Obstetrics</option>
                    <option>Surgery</option>
                    <option>Orthopedics</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>Oncology</option>
                    <option>Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bed Number</label>
                  <input required placeholder="e.g. B-101" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.bed} onChange={e=>setFormData({...formData, bed: e.target.value})} />
                </div>
              </div>

              {/* Row 5: Status + Doctor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                  <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})}>
                    <option>Admitted</option>
                    <option>Critical</option>
                    <option>Recovering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Doctor Assigned</label>
                  <input required placeholder="e.g. Dr. Sharma" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.doctor} onChange={e=>setFormData({...formData, doctor: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg active:scale-95">
                Admit Patient
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientManagementPage;