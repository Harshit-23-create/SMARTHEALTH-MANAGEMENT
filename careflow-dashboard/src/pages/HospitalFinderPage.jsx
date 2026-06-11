import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import {
  MapPin, Search, Bed, Activity, AlertTriangle, Star, Phone,
  Navigation, Clock, Filter, X, CheckCircle, Loader, Building2,
  Syringe, Users, Zap, Map, ShieldCheck
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
  <div className={`relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${gradient}`}>
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

      // Update local state to reflect the booked bed
      setHospitals(prev => prev.map(h => {
        if (h.id === selectedHospital.id) {
          if (type === "ICU") return { ...h, icu: h.icu - 1 };
          if (type === "Ventilator") return { ...h, ventilator: h.ventilator - 1 };
          if (type === "Emergency") return { ...h, emergency: h.emergency - 1 };
        }
        return h;
      }));
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-100">
              <MapPin className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Hospital Finder</h1>
              <p className="text-sm text-gray-500">Locate nearby hospitals & real-time bed availability</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Facilities" value={hospitals.length} gradient="from-teal-500 to-emerald-500" icon={Building2} />
          <StatCard label="Total ICU Beds" value={hospitals.reduce((acc, h) => acc + h.icu, 0)} gradient="from-blue-500 to-indigo-500" icon={Activity} />
          <StatCard label="Ventilators" value={hospitals.reduce((acc, h) => acc + h.ventilator, 0)} gradient="from-purple-500 to-pink-500" icon={Syringe} />
          <StatCard label="Available ER" value={hospitals.filter((h) => h.available).length} gradient="from-amber-500 to-orange-500" icon={Zap} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by hospital name or area..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative border border-gray-200 bg-white rounded-xl px-2 flex items-center">
              <Filter className="w-4 h-4 text-gray-400 ml-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="py-3 pl-2 pr-4 bg-transparent text-sm text-gray-700 font-medium focus:outline-none cursor-pointer"
              >
                {["All", "ICU", "Ventilator", "Emergency", "Available"].map((f) => (
                  <option key={f} value={f}>{f} required</option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-3 px-4 border border-gray-200 bg-white rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-200 cursor-pointer"
            >
              <option value="distance">Sort: Nearest</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="icu">Sort: Most ICU</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group">
              {/* Card Header */}
              <div className="p-5 flex-1 border-b border-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors text-lg mb-1">
                      {hospital.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <span className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 mr-1 fill-current" /> {hospital.rating}
                      </span>
                      {hospital.recommended && (
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md flex items-center">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Top Choice
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Distance</p>
                    <p className="text-sm font-black text-gray-900">{hospital.distance}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm mt-4">
                  <p className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" /> {hospital.address}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" /> <a href={`tel:${hospital.phone}`} className="hover:text-teal-600">{hospital.phone}</a>
                  </p>
                </div>
              </div>

              {/* Badges Bar */}
              <div className="grid grid-cols-3 divide-x divide-gray-50 bg-gray-50/50">
                <div className="p-3 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">ICU</p>
                  <p className={`text-lg font-black ${hospital.icu > 0 ? "text-teal-600" : "text-gray-400"}`}>{hospital.icu}</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Ventilator</p>
                  <p className={`text-lg font-black ${hospital.ventilator > 0 ? "text-purple-600" : "text-gray-400"}`}>{hospital.ventilator}</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">ER Beds</p>
                  <p className={`text-lg font-black ${hospital.emergency > 0 ? "text-blue-600" : "text-gray-400"}`}>{hospital.emergency}</p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${hospital.available ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  <span className={`text-xs font-bold ${hospital.available ? "text-green-700" : "text-red-700"}`}>
                    {hospital.available ? "Accepting Patients" : "Full Capacity"}
                  </span>
                </div>
                <button
                  onClick={() => handleCheckAvailability(hospital)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-teal-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No hospitals found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedHospital && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
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
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Bed Reserved!</h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Your bed reservation at {selectedHospital.name} has been confirmed. A notification has been sent.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
                      <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                      <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">ER Wait Time</p>
                      <p className="text-2xl font-black text-amber-900">{selectedHospital.waitTime}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                      <Navigation className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-1">Distance</p>
                      <p className="text-2xl font-black text-blue-900">{selectedHospital.distance}</p>
                    </div>
                  </div>

                  <h4 className="font-black text-gray-900 mb-4 uppercase text-xs tracking-widest border-b border-gray-100 pb-2">
                    Live Bed Availability
                  </h4>
                  
                  <div className="space-y-3 mb-8">
                    {[
                      { type: "ICU", count: selectedHospital.icu, icon: Activity, color: "teal" },
                      { type: "Ventilator", count: selectedHospital.ventilator, icon: Syringe, color: "purple" },
                      { type: "Emergency", count: selectedHospital.emergency, icon: Bed, color: "blue" },
                    ].map(({ type, count, icon: Icon, color }) => (
                      <div key={type} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 bg-${color}-50 rounded-lg`}>
                            <Icon className={`w-5 h-5 text-${color}-600`} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{type} Bed</p>
                            <p className={`text-xs font-semibold ${count > 0 ? `text-${color}-600` : "text-gray-400"}`}>
                              {count} Available
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleBookBed(type)}
                          disabled={loading || count === 0}
                          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all
                            ${count === 0
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                            }`}
                        >
                          {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Reserve"}
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HospitalFinderPage;