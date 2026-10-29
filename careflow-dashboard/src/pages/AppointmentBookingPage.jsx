import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import { useTranslation } from "react-i18next";
import {
  CalendarCheck, Clock, User, Search, Plus, Phone, X, Calendar, AlertCircle
} from "lucide-react";

export const initialAppointments = [
  { id: 1, patient: "John Doe", doctor: "Dr. Smith", dept: "Cardiology", time: "10:00 AM", date: "Today", status: "Confirmed", type: "Follow-up", phone: "555-0101" },
  { id: 2, patient: "Jane Roe", doctor: "Dr. Martinez", dept: "Orthopedics", time: "11:30 AM", date: "Today", status: "Pending", type: "New Consult", phone: "555-0102" },
  { id: 3, patient: "Mike Ross", doctor: "Dr. Williams", dept: "General", time: "02:00 PM", date: "Tomorrow", status: "Confirmed", type: "Routine Check", phone: "555-0103" },
  { id: 4, patient: "Rachel Zane", doctor: "Dr. Lee", dept: "Pediatrics", time: "09:15 AM", date: "Tomorrow", status: "Cancelled", type: "Vaccination", phone: "555-0104" },
  { id: 5, patient: "Harvey Specter", doctor: "Dr. Smith", dept: "Cardiology", time: "03:45 PM", date: "Today", status: "Confirmed", type: "Consultation", phone: "555-0105" },
];

export const normalizeTime = (timeStr) => {
  if (!timeStr) return "";
  const str = timeStr.trim().toLowerCase();
  
  // Check if it has am/pm
  const match12 = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)?$/);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2];
    const meridiem = match12[3];
    
    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;
    
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }
  return str;
};

export const normalizeDate = (dateStr) => {
  if (!dateStr) return "";
  const str = dateStr.trim().toLowerCase();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  
  if (str === "today") return todayStr;
  if (str === "tomorrow") return tomorrowStr;
  
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return str;
};

export const isSameSlot = (date1, time1, date2, time2) => {
  if (!date1 || !time1 || !date2 || !time2) return false;
  const sameDate =
    date1.trim().toLowerCase() === date2.trim().toLowerCase() ||
    normalizeDate(date1) === normalizeDate(date2);
  const sameTime =
    time1.trim().toLowerCase() === time2.trim().toLowerCase() ||
    normalizeTime(time1) === normalizeTime(time2);
  return sameDate && sameTime;
};

export const checkAppointmentConflict = (appointmentsList, targetAppointmentId, newDate, newTime) => {
  const targetAppt = appointmentsList.find(a => a.id === targetAppointmentId);
  if (!targetAppt) {
    return { hasConflict: false };
  }

  // A cancelled appointment cannot be rescheduled
  if (targetAppt.status === "Cancelled") {
    return {
      hasConflict: true,
      message: "A cancelled appointment cannot be rescheduled."
    };
  }

  // Find if the doctor already has another active appointment at the new slot
  const conflictingAppt = appointmentsList.find(a => 
    a.id !== targetAppt.id &&
    a.status !== "Cancelled" &&
    a.doctor.trim().toLowerCase() === targetAppt.doctor.trim().toLowerCase() &&
    isSameSlot(a.date, a.time, newDate, newTime)
  );

  if (conflictingAppt) {
    return {
      hasConflict: true,
      message: `${targetAppt.doctor} already has another active appointment at this date and time slot.`
    };
  }

  return { hasConflict: false };
};

export const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const normalized = normalizeDate(dateStr);
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
  return dateStr;
};

export const formatTimeForInput = (timeStr) => {
  if (!timeStr) return "";
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  const normalized = normalizeTime(timeStr);
  if (/^\d{2}:\d{2}$/.test(normalized)) return normalized;
  return timeStr;
};

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

  // Reschedule state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");

  const filtered = appointments.filter(a => {
    const mSearch = a.patient.toLowerCase().includes(search.toLowerCase()) || a.doctor.toLowerCase().includes(search.toLowerCase());
    const mFilter = filter === "All" || a.status === filter;
    return mSearch && mFilter;
  });

  const handleStatusChange = (id, status) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      push("system", "Appointment Updated", `${appt.patient}'s appointment is now ${status}`);
    }
  };

  const handleOpenReschedule = (appt) => {
    if (appt.status === "Cancelled") {
      push("system", "Action Denied", "A cancelled appointment cannot be rescheduled.");
      return;
    }
    setSelectedAppt(appt);
    setRescheduleDate(formatDateForInput(appt.date));
    setRescheduleTime(formatTimeForInput(appt.time));
    setRescheduleError("");
    setRescheduleModalOpen(true);
  };

  const handleCloseReschedule = () => {
    setRescheduleModalOpen(false);
    setSelectedAppt(null);
    setRescheduleDate("");
    setRescheduleTime("");
    setRescheduleError("");
  };

  const handleRescheduleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedAppt) return;

    if (selectedAppt.status === "Cancelled") {
      setRescheduleError("A cancelled appointment cannot be rescheduled.");
      return;
    }

    if (!rescheduleDate || !rescheduleTime) {
      setRescheduleError("Please choose both a new date and time.");
      return;
    }

    const conflict = checkAppointmentConflict(
      appointments,
      selectedAppt.id,
      rescheduleDate,
      rescheduleTime
    );

    if (conflict.hasConflict) {
      setRescheduleError(conflict.message);
      push("system", "Reschedule Failed", conflict.message);
      return;
    }

    // Update appointment immediately, preserving identity and other details
    setAppointments(prev => prev.map(a => {
      if (a.id === selectedAppt.id) {
        return {
          ...a,
          date: rescheduleDate,
          time: rescheduleTime
        };
      }
      return a;
    }));

    push("system", "Appointment Rescheduled", `${selectedAppt.patient}'s appointment with ${selectedAppt.doctor} has been moved to ${rescheduleTime} on ${rescheduleDate}.`);
    handleCloseReschedule();
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
            <div key={appt.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all p-5 flex flex-col justify-between">
              <div>
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
              </div>

              {/* Action Buttons */}
              <div className="mt-2 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex flex-wrap gap-2">
                {appt.status === "Pending" && (
                  <button 
                    onClick={() => handleStatusChange(appt.id, "Confirmed")} 
                    className="flex-1 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 rounded-xl text-xs font-bold transition-colors"
                  >
                    Confirm
                  </button>
                )}
                
                <button 
                  disabled={appt.status === "Cancelled"}
                  onClick={() => handleOpenReschedule(appt)}
                  aria-label={`Reschedule appointment for ${appt.patient}`}
                  data-testid={`reschedule-btn-${appt.id}`}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    appt.status === "Cancelled"
                      ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                      : "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-950/80 active:scale-95"
                  }`}
                  title={appt.status === "Cancelled" ? "A cancelled appointment cannot be rescheduled" : "Reschedule appointment"}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {t("appointments.reschedule") || "Reschedule"}
                </button>

                {appt.status !== "Cancelled" && (
                  <button 
                    onClick={() => handleStatusChange(appt.id, "Cancelled")} 
                    className={`py-2 px-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/80 rounded-xl text-xs font-bold transition-colors ${
                      appt.status === "Pending" ? "flex-1" : ""
                    }`}
                  >
                    Cancel
                  </button>
                )}
              </div>
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

      {/* Reschedule Appointment Modal */}
      {rescheduleModalOpen && selectedAppt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black">{t("appointments.rescheduleAppointment") || "Reschedule Appointment"}</h2>
                <p className="text-violet-100 text-xs">Choose a new date and time for the consultation</p>
              </div>
              <button 
                type="button"
                onClick={handleCloseReschedule} 
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                aria-label="Close"
                data-testid="close-reschedule-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-4">
              {/* Context info about appointment */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Patient:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedAppt.patient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Doctor:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedAppt.doctor} ({selectedAppt.dept})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Current Slot:</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedAppt.time} • {selectedAppt.date}</span>
                </div>
              </div>

              {rescheduleError && (
                <div 
                  role="alert" 
                  data-testid="reschedule-error"
                  className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{rescheduleError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reschedule-date" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    New Date
                  </label>
                  <input 
                    id="reschedule-date"
                    name="date"
                    type="date"
                    required
                    aria-label="New Date"
                    data-testid="reschedule-date-input"
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                    value={rescheduleDate}
                    onChange={(e) => {
                      setRescheduleDate(e.target.value);
                      setRescheduleError("");
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="reschedule-time" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    New Time
                  </label>
                  <input 
                    id="reschedule-time"
                    name="time"
                    type="time"
                    required
                    aria-label="New Time"
                    data-testid="reschedule-time-input"
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                    value={rescheduleTime}
                    onChange={(e) => {
                      setRescheduleTime(e.target.value);
                      setRescheduleError("");
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={handleCloseReschedule}
                  data-testid="cancel-reschedule-button"
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-bold transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  data-testid="confirm-reschedule-button"
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-violet-200 dark:shadow-none active:scale-95 text-sm"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AppointmentBookingPage;
