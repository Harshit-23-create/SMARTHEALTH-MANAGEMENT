import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import { useTranslation } from "react-i18next";
import {
  MapPin, Search, Activity, Star, Phone,
  Filter, X, CheckCircle, Loader, Building2,
  Syringe, Zap, ShieldCheck
} from "lucide-react";

const initialHospitals = [
  { id: 1, name: "City General Hospital",      distance: "2.3 km",  icu: 5, ventilator: 3, emergency: 12, rating: 4.8, recommended: true,  phone: "+1-555-0101", address: "123 Main St, Downtown",         waitTime: "15 min", available: true },
  { id: 2, name: "St. Mary's Medical Center",  distance: "4.1 km",  icu: 2, ventilator: 1, emergency: 8,  rating: 4.2, recommended: false, phone: "+1-555-0102", address: "456 Oak Ave, Uptown",           waitTime: "30 min", available: true },
  { id: 3, name: "Apollo Healthcare Hub",      distance: "5.8 km",  icu: 8, ventilator: 6, emergency: 20, rating: 4.9, recommended: true,  phone: "+1-555-0103", address: "789 Pine Rd, Medical District", waitTime: "5 min",  available: true },
  { id: 4, name: "Memorial Hospital",          distance: "7.2 km",  icu: 0, ventilator: 0, emergency: 5,  rating: 3.9, recommended: false, phone: "+1-555-0104", address: "321 Elm St, Westside",          waitTime: "45 min", available: false },
  { id: 5, name: "Sunrise Specialist Clinic",  distance: "3.5 km",  icu: 3, ventilator: 2, emergency: 10, rating: 4.5, recommended: true,  phone: "+1-555-0105", address: "654 Cedar Ln, Eastside",        waitTime: "20 min", available: true },
  { id: 6, name: "Green Valley Medical Hub",   distance: "9.1 km",  icu: 1, ventilator: 0, emergency: 3,  rating: 3.7, recommended: false, phone: "+1-555-0106", address: "987 Birch St, Valley View",     waitTime: "60 min", available: false },
];

const StatCard = ({ label, value, icon: Icon, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${gradient} shadow-lg`}>
    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
    <div className="relative">
      <div className="p-2 rounded-xl bg-white/20 w-fit mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-xs text-white/80 font-medium mt-1">{label}</p>
    </div>
  </div>
);

const HospitalFinderPage = () => {
  const { push } = useNotifications();
  const { t } = useTranslation();
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("distance");

  const filteredHospitals = hospitals
    .filter((h) => {
      const matchSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.address.toLowerCase().includes(searchTerm.toLowerCase());
      let matchFilter = true;
      if (filter === "ICU") matchFilter = h.icu > 0;
      else if (filter === "Ventilator") matchFilter = h.ventilator > 0;
      else if (filter === "Emergency") matchFilter = h.emergency > 0;
      else if (filter === "Available") matchFilter = h.available;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === "rating")   return b.rating - a.rating;
      if (sortBy === "icu")      return b.icu - a.icu;
      return 0;
    });

  const handleCheckAvailability = (hospital) => {
    setSelectedHospital(hospital);
    setBookingStatus(null);
    setIsModalOpen(true);
  };

  const handleBookBed = (type) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBookingStatus("success");
      push("hospital", "Bed Reserved", `1 ${type} Bed reserved at ${selectedHospital.name}`);

      setHospitals(prev => prev.map(h => {
        if (h.id === selectedHospital.id) {
          if (type === "ICU") return { ...h, icu: h.icu - 1 };
          if (type === "Ventilator") return { ...h, ventilator: h.ventilator - 1 };
          if (type === "Emergency") return { ...h, emergency: h.emergency - 1 };
        }
        return h;
      }));
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t("hospitalFinder.title")}</h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("hospitalFinder.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Facilities" value={hospitals.length} gradient="from-teal-500 to-emerald-500" icon={Building2} />
          <StatCard label="Total ICU Beds" value={hospitals.reduce((acc, h) => acc + h.icu, 0)} gradient="from-blue-500 to-indigo-500" icon={Activity} />
          <StatCard label="Ventilators" value={hospitals.reduce((acc, h) => acc + h.ventilator, 0)} gradient="from-purple-500 to-pink-500" icon={Syringe} />
          <StatCard label="Active ERs" value={hospitals.filter((h) => h.available).length} gradient="from-amber-500 to-orange-500" icon={Zap} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by hospital name or area..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-2 flex items-center shadow-sm">
              <Filter className="w-4 h-4 text-gray-400 ml-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="py-3 pl-2 pr-4 bg-transparent text-sm text-gray-700 dark:text-gray-200 font-medium focus:outline-none cursor-pointer"
              >
                {["All", "ICU", "Ventilator", "Emergency", "Available"].map((f) => (
                  <option key={f} value={f} className="dark:bg-gray-900">{f} required</option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-3 px-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer shadow-sm"
            >
              <option value="distance" className="dark:bg-gray-900">Sort: Nearest</option>
              <option value="rating" className="dark:bg-gray-900">Sort: Top Rated</option>
              <option value="icu" className="dark:bg-gray-900">Sort: Most ICU</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden group">
              {/* Card Header */}
              <div className="p-5 flex-1 border-b border-gray-50 dark:border-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-lg mb-1">
                      {hospital.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <span className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 mr-1 fill-current" /> {hospital.rating}
                      </span>
                      {hospital.recommended && (
                        <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md flex items-center">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Top Choice
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-xl text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t("hospitalFinder.distance")}</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{hospital.distance}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm mt-4">
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" /> {hospital.address}
                  </p>
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" /> <a href={`tel:${hospital.phone}`} className="hover:text-teal-600 dark:hover:text-teal-400">{hospital.phone}</a>
                  </p>
                </div>
              </div>

              {/* Badges Bar */}
              <div className="grid grid-cols-3 divide-x divide-gray-50 dark:divide-gray-800 bg-gray-50/50 dark:bg-gray-800/40">
                <div className="p-3 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">ICU</p>
                  <p className={`text-lg font-black ${hospital.icu > 0 ? "text-teal-600 dark:text-teal-400" : "text-gray-400"}`}>{hospital.icu}</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Ventilator</p>
                  <p className={`text-lg font-black ${hospital.ventilator > 0 ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`}>{hospital.ventilator}</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">ER Beds</p>
                  <p className={`text-lg font-black ${hospital.emergency > 0 ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}>{hospital.emergency}</p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-white dark:bg-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${hospital.available ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  <span className={`text-xs font-bold ${hospital.available ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                    {hospital.available ? "Accepting Patients" : "Full Capacity"}
                  </span>
                </div>
                <button
                  onClick={() => handleCheckAvailability(hospital)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all active:scale-95"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedHospital && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 text-white relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-black mb-1">{selectedHospital.name}</h2>
              <p className="text-teal-100 flex items-center text-sm font-medium">
                <MapPin className="w-4 h-4 mr-1.5 opacity-80" /> {selectedHospital.address}
              </p>
            </div>

            <div className="p-6">
              {bookingStatus === "success" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-950/60 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bed Successfully Reserved!</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Patient allocation dispatched to hospital intake desk.</p>
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-gray-900 dark:bg-primary text-white font-bold rounded-xl text-sm">
                    {t("common.close")}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Instant Bed Allocation</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleBookBed("ICU")}
                      disabled={loading || selectedHospital.icu === 0}
                      className="p-3 rounded-2xl border-2 border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 font-bold text-xs hover:scale-105 transition disabled:opacity-50"
                    >
                      Book ICU ({selectedHospital.icu})
                    </button>
                    <button
                      onClick={() => handleBookBed("Ventilator")}
                      disabled={loading || selectedHospital.ventilator === 0}
                      className="p-3 rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 font-bold text-xs hover:scale-105 transition disabled:opacity-50"
                    >
                      Ventilator ({selectedHospital.ventilator})
                    </button>
                    <button
                      onClick={() => handleBookBed("Emergency")}
                      disabled={loading || selectedHospital.emergency === 0}
                      className="p-3 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 font-bold text-xs hover:scale-105 transition disabled:opacity-50"
                    >
                      ER Bed ({selectedHospital.emergency})
                    </button>
                  </div>
                  {loading && (
                    <div className="flex items-center justify-center gap-2 py-3 text-teal-600 font-bold text-sm">
                      <Loader className="w-5 h-5 animate-spin" /> Reserving bed with hospital intake...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HospitalFinderPage;