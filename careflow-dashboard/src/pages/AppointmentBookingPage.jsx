import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import { useTranslation } from "react-i18next";
import {
  CalendarCheck, Clock, User, Search, Plus, Phone, X
} from "lucide-react";

const initialAppointments = [
  { id: 1, patient: "John Doe", doctor: "Dr. Smith", dept: "Cardiology", time: "10:00 AM", date: "Today", status: "Confirmed", type: "Follow-up", phone: "555-0101" },
  { id: 2, patient: "Jane Roe", doctor: "Dr. Martinez", dept: "Orthopedics", time: "11:30 AM", date: "Today", status: "Pending", type: "New Consult", phone: "555-0102" },
  { id: 3, patient: "Mike Ross", doctor: "Dr. Williams", dept: "General", time: "02:00 PM", date: "Tomorrow", status: "Confirmed", type: "Routine Check", phone: "555-0103" },
  { id: 4, patient: "Rachel Zane", doctor: "Dr. Lee", dept: "Pediatrics", time: "09:15 AM", date: "Tomorrow", status: "Cancelled", type: "Vaccination", phone: "555-0104" },
  { id: 5, patient: "Harvey Specter", doctor: "Dr. Smith", dept: "Cardiology", time: "03:45 PM", date: "Today", status: "Confirmed", type: "Consultation", phone: "555-0105" },
];

const AppointmentBookingPage = () => {
  const { push } = useNotifications();
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppt, setNewAppt] = useState({
    patient: "", doctor: "", dept: "General", time: "", date: "", type: "New Consult", phone: ""
  });

  const filtered = appointments.filter(a => {
    const mSearch = a.patient.toLowerCase().includes(search.toLowerCase()) || a.doctor.toLowerCase().includes(search.toLowerCase());
    const mFilter = filter === "All" || a.status === filter;
    return mSearch && mFilter;
  });

  const handleStatusChange = (id, status) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    const appt = appointments.find(a => a.id === id);
    push("system", "Appointment Updated", `${appt.patient}'s appointment is now ${status}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 rounded-2xl">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t("appointments.title")}</h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("appointments.subtitle")}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-primary text-white rounded-xl hover:bg-gray-800 dark:hover:bg-primary/90 font-bold shadow-lg shadow-gray-200 dark:shadow-none transition-transform active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" /> {t("appointments.bookAppointment")}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("appointments.totalToday")}</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white">42</h3>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("appointments.confirmed")}</p>
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">28</h3>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("appointments.pending")}</p>
            <h3 className="text-3xl font-black text-amber-500 dark:text-amber-400">10</h3>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("appointments.cancelled")}</p>
            <h3 className="text-3xl font-black text-rose-500 dark:text-rose-400">4</h3>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient or doctor..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
            />
          </div>
          <div className="flex gap-2 p-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            {["All", "Confirmed", "Pending", "Cancelled"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${filter === f ? "bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(appt => (
            <div key={appt.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center font-black text-lg">
                    {appt.patient.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white">{appt.patient}</h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{appt.type}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                  ${appt.status === 'Confirmed' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 
                    appt.status === 'Pending' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'}`}>
                  {appt.status}
                </span>
              </div>
              
              <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4 text-violet-500" /> <span className="font-semibold">{appt.doctor}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> <span className="font-semibold">{appt.time} • {appt.date}</span></div>
                  <span className="text-xs font-bold text-gray-400 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-md">{appt.dept}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Phone className="w-4 h-4 text-green-500" /> <span className="font-semibold">{appt.phone}</span>
                </div>
              </div>

              {appt.status === "Pending" && (
                <div className="flex gap-2">
                  <button onClick={() => handleStatusChange(appt.id, "Confirmed")} className="flex-1 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 rounded-xl text-xs font-bold transition-colors">Confirm</button>
                  <button onClick={() => handleStatusChange(appt.id, "Cancelled")} className="flex-1 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/80 rounded-xl text-xs font-bold transition-colors">Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black">{t("appointments.bookAppointment")}</h2>
                <p className="text-violet-100 text-xs">Schedule a new patient consultation</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setAppointments([...appointments, {
                id: Date.now(),
                ...newAppt,
                status: "Pending"
              }]);
              setShowAddModal(false);
              setNewAppt({ patient: "", doctor: "", dept: "General", time: "", date: "", type: "New Consult", phone: "" });
              push("system", "Appointment Booked", `${newAppt.patient}'s appointment has been scheduled.`);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("appointments.patient")}</label>
                <input required className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newAppt.patient} onChange={e=>setNewAppt({...newAppt, patient: e.target.value})} placeholder="e.g. Rachel Green" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("appointments.doctor")}</label>
                  <input required className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newAppt.doctor} onChange={e=>setNewAppt({...newAppt, doctor: e.target.value})} placeholder="e.g. Dr. Adams" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("appointments.department")}</label>
                  <select className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newAppt.dept} onChange={e=>setNewAppt({...newAppt, dept: e.target.value})}>
                    <option>General</option>
                    <option>Cardiology</option>
                    <option>Orthopedics</option>
                    <option>Pediatrics</option>
                    <option>Neurology</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("appointments.dateTime")}</label>
                  <input required type="time" className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newAppt.time} onChange={e=>setNewAppt({...newAppt, time: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Date</label>
                  <input required type="date" className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newAppt.date} onChange={e=>setNewAppt({...newAppt, date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                <input required className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm" value={newAppt.phone} onChange={e=>setNewAppt({...newAppt, phone: e.target.value})} placeholder="e.g. 555-0199" />
              </div>
              <button type="submit" className="w-full py-3 mt-4 bg-gray-900 dark:bg-primary text-white rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-primary/90 transition-colors shadow-lg active:scale-95 text-sm">{t("appointments.bookAppointment")}</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AppointmentBookingPage;