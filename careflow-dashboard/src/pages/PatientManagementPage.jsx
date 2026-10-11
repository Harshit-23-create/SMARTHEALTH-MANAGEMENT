import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "@/utils/api";
import { 
  Search, Plus, X,
  Activity, Bed, Heart, 
  AlertCircle, CheckCircle,
  Edit, Trash2, Eye,
  ChevronLeft, ChevronRight,
  Users, RefreshCw, Stethoscope
} from "lucide-react";

const fallbackPatients = [
  { _id: "demo-p1", name: "Eleanor Vance", age: 48, gender: "Female", disease: "Cardiovascular Hypertension", bed: "ICU-04", department: "Critical Care", status: "Critical", doctor: "Dr. John Smith", contactNumber: "9876543210" },
  { _id: "demo-p2", name: "David Miller", age: 34, gender: "Male", disease: "Compound Tibia Fracture", bed: "ORT-12", department: "Orthopedics", status: "Admitted", doctor: "Dr. Martinez", contactNumber: "9876543211" },
  { _id: "demo-p3", name: "Amina Al-Mansoor", age: 29, gender: "Female", disease: "Acute Appendicitis", bed: "SUR-08", department: "Surgery", status: "Recovering", doctor: "Dr. Williams", contactNumber: "9876543212" },
  { _id: "demo-p4", name: "Carlos Mendez", age: 62, gender: "Male", disease: "Type 2 Diabetic Ketoacidosis", bed: "GEN-22", department: "General Medicine", status: "Admitted", doctor: "Dr. John Smith", contactNumber: "9876543213" },
  { _id: "demo-p5", name: "Sophia Chang", age: 7, gender: "Female", disease: "Severe Bronchitis", bed: "PED-03", department: "Pediatrics", status: "Admitted", doctor: "Dr. Lee", contactNumber: "9876543214" },
  { _id: "demo-p6", name: "Marcus Thorne", age: 55, gender: "Male", disease: "Myocardial Infarction", bed: "ICU-01", department: "Critical Care", status: "Critical", doctor: "Dr. John Smith", contactNumber: "9876543215" },
];

const PatientManagementPage = () => {
  const { push } = useNotifications();
  const { t } = useTranslation();
  const [patients, setPatients] = useState(fallbackPatients);
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
      await new Promise(r => setTimeout(r, 500));
      const res = await fetch(`${API_BASE_URL}/patients`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPatients(data);
        } else {
          setPatients(fallbackPatients);
        }
      } else {
        setPatients(fallbackPatients);
      }
    } catch (error) {
      console.warn("Backend patients endpoint unreachable, using demo data:", error);
      setPatients(fallbackPatients);
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
        push("patient", t("patients.admittedSuccess"), `${formData.name} admitted to ${formData.department}`);
        fetchPatients();
      } else {
        // Local state fallback
        const newPatient = {
          _id: `patient-${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString()
        };
        setPatients(prev => [newPatient, ...prev]);
        push("patient", t("patients.admittedSuccess"), `${formData.name} admitted to ${formData.department}`);
      }
      setShowModal(false);
      setFormData({
        name: "", age: "", gender: "Male", disease: "",
        bed: "", department: "General Medicine",
        contactNumber: "", status: "Admitted", doctor: ""
      });
    } catch (error) {
      console.warn("Using local addition fallback:", error);
      const newPatient = {
        _id: `patient-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString()
      };
      setPatients(prev => [newPatient, ...prev]);
      push("patient", t("patients.admittedSuccess"), `${formData.name} admitted to ${formData.department}`);
      setShowModal(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`${t("patients.confirmDischarge")} ${name}?`)) return;
    try {
      await fetch(`${API_BASE_URL}/patients/${id}`, { method: "DELETE" });
    } catch (error) {
      console.warn("Discharge server error, removing locally:", error);
    }
    setPatients(prev => prev.filter(p => p._id !== id));
    push("patient", "Patient Discharged", `${name} has been discharged.`);
  };

  const filteredPatients = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.disease || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;

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
            <div className="p-3 bg-blue-100 dark:bg-blue-950/60 rounded-2xl text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t("patients.title")}</h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("patients.subtitle")}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchPatients} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold transition-colors shadow-sm text-sm">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> {t("common.refresh")}
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold shadow-lg shadow-blue-500/20 transition-transform active:scale-95 text-sm">
              <Plus className="w-4 h-4" /> {t("patients.admitPatient")}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 transition-colors">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl"><Users className="w-6 h-6" /></div>
            <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("common.all")}</p><p className="text-2xl font-black text-gray-900 dark:text-white">{stats.total}</p></div>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 transition-colors">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
            <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("emergency.critical")}</p><p className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats.critical}</p></div>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 transition-colors">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl"><Activity className="w-6 h-6" /></div>
            <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("patients.statusAdmitted")}</p><p className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.admitted}</p></div>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 transition-colors">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl"><CheckCircle className="w-6 h-6" /></div>
            <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recovering</p><p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.recovering}</p></div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("patients.searchPatients")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div className="flex gap-2 p-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            {["All", "Admitted", "Critical", "Recovering"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${filter === f ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPatients.map(p => (
            <div key={p._id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white">{p.name}</h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{p.age}y • {p.gender}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                  ${p.status === 'Critical' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 animate-pulse' : 
                    p.status === 'Admitted' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'}`}>
                  {p.status}
                </span>
              </div>
              
              <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Heart className="w-4 h-4 text-rose-500" /> <span className="font-semibold truncate">{p.disease}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Stethoscope className="w-4 h-4 text-blue-500" /> <span className="font-semibold">{p.doctor || "Unassigned"}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2"><Bed className="w-4 h-4 text-indigo-500" /> <span className="font-semibold">{p.bed || "TBA"}</span></div>
                  <span className="text-xs font-bold text-gray-400 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-md">{p.department}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <button onClick={() => push("patient", "Viewing Patient", `Medical chart for ${p.name}`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => push("patient", "Editing Patient", `Edit form for ${p.name}`)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-gray-800 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                </div>
                <button onClick={() => handleDelete(p._id, p.name)} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/80 rounded-lg text-xs font-bold transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Discharge
                </button>
              </div>
            </div>
          ))}
          
          {paginatedPatients.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-bold">{t("patients.noPatients")}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex items-center px-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-800 font-bold text-sm">Page {currentPage} of {totalPages}</div>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black">{t("patients.admitPatient")}</h2>
                <p className="text-blue-100 text-xs">Enter patient details below</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddPatient} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("patients.patientName")}</label>
                  <input required placeholder="e.g. John Doe" className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("patients.age")}</label>
                  <input required type="number" min="0" max="150" placeholder="e.g. 35" className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" value={formData.age} onChange={e=>setFormData({...formData, age: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("patients.gender")}</label>
                  <select className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" value={formData.gender} onChange={e=>setFormData({...formData, gender: e.target.value})}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("patients.contact")}</label>
                  <input required placeholder="e.g. 9876543210" className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" value={formData.contactNumber} onChange={e=>setFormData({...formData, contactNumber: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("patients.disease")}</label>
                <input required placeholder="e.g. Malaria, Acute Cardiac..." className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" value={formData.disease} onChange={e=>setFormData({...formData, disease: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("beds.department")}</label>
                  <select className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" value={formData.department} onChange={e=>setFormData({...formData, department: e.target.value})}>
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
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("patients.bedNumber")}</label>
                  <input required placeholder="e.g. B-101" className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" value={formData.bed} onChange={e=>setFormData({...formData, bed: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("common.status")}</label>
                  <select className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})}>
                    <option>Admitted</option>
                    <option>Critical</option>
                    <option>Recovering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("patients.doctor")}</label>
                  <input required placeholder="e.g. Dr. Sharma" className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" value={formData.doctor} onChange={e=>setFormData({...formData, doctor: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg active:scale-95 text-sm">
                {t("patients.admitPatient")}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientManagementPage;