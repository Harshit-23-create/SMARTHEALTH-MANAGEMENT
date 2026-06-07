import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { MapPin, Search, Bed, Activity, AlertTriangle, Star, Phone, Navigation, Clock, Filter, X, CheckCircle, Loader } from "lucide-react";

const initialHospitals = [
  { id: 1, name: "City General Hospital", distance: "2.3 km", icu: 5, ventilator: 3, emergency: 12, rating: 4.5, recommended: true, phone: "+1-555-0101", address: "123 Main St, Downtown", waitTime: "15 min", available: true },
  { id: 2, name: "St. Mary's Medical Center", distance: "4.1 km", icu: 2, ventilator: 1, emergency: 8, rating: 4.2, recommended: false, phone: "+1-555-0102", address: "456 Oak Ave, Uptown", waitTime: "30 min", available: true },
  { id: 3, name: "Apollo Healthcare", distance: "5.8 km", icu: 8, ventilator: 6, emergency: 20, rating: 4.8, recommended: true, phone: "+1-555-0103", address: "789 Pine Rd, Medical District", waitTime: "5 min", available: true },
  { id: 4, name: "Memorial Hospital", distance: "7.2 km", icu: 0, ventilator: 0, emergency: 5, rating: 3.9, recommended: false, phone: "+1-555-0104", address: "321 Elm St, Westside", waitTime: "45 min", available: false },
  { id: 5, name: "Sunrise Medical Hub", distance: "3.5 km", icu: 3, ventilator: 2, emergency: 10, rating: 4.3, recommended: true, phone: "+1-555-0105", address: "654 Cedar Ln, Eastside", waitTime: "20 min", available: true },
  { id: 6, name: "Green Valley Clinic", distance: "9.1 km", icu: 1, ventilator: 0, emergency: 3, rating: 3.7, recommended: false, phone: "+1-555-0106", address: "987 Birch St, Valley View", waitTime: "60 min", available: false },
];

const HospitalFinderPage = () => {
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("distance"); // distance, rating, icu

  const filters = ["All", "ICU", "Ventilator", "Emergency", "Available"];

  // Filter and search hospitals
  const filteredHospitals = hospitals
    .filter((hospital) => {
      // Search filter
      const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hospital.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      let matchesFilter = true;
      if (filter === "ICU") matchesFilter = hospital.icu > 0;
      else if (filter === "Ventilator") matchesFilter = hospital.ventilator > 0;
      else if (filter === "Emergency") matchesFilter = hospital.emergency > 0;
      else if (filter === "Available") matchesFilter = hospital.available;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "distance") {
        return parseFloat(a.distance) - parseFloat(b.distance);
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      } else if (sortBy === "icu") {
        return b.icu - a.icu;
      }
      return 0;
    });

  // Stats
  const totalBeds = hospitals.reduce((sum, h) => sum + h.icu + h.ventilator + h.emergency, 0);
  const availableHospitals = hospitals.filter(h => h.available).length;
  const avgRating = (hospitals.reduce((sum, h) => sum + h.rating, 0) / hospitals.length).toFixed(1);

  // Handle check availability
  const handleCheckAvailability = (hospital) => {
    setSelectedHospital(hospital);
    setIsModalOpen(true);
    setBookingStatus(null);
  };

  // Handle book bed
  const handleBookBed = async (type) => {
    setLoading(true);
    setBookingStatus({ type: "loading", message: "Checking availability..." });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Randomly determine if booking is successful
    const isSuccessful = Math.random() > 0.3;
    
    if (isSuccessful) {
      setBookingStatus({ 
        type: "success", 
        message: `Bed booked successfully at ${selectedHospital.name}! You will receive a confirmation call shortly.` 
      });
      
      // Update hospital availability
      setHospitals(hospitals.map(h => 
        h.id === selectedHospital.id 
          ? { 
              ...h, 
              [type]: h[type] - 1,
              available: h[type] - 1 > 0 || h.icu + h.ventilator + h.emergency - 1 > 0
            }
          : h
      ));
      
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedHospital(null);
        setBookingStatus(null);
        setLoading(false);
      }, 3000);
    } else {
      setBookingStatus({ 
        type: "error", 
        message: "Sorry, the bed is no longer available. Please try another hospital." 
      });
      setLoading(false);
    }
  };

  // Handle get directions
  const handleGetDirections = (hospital) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + " " + hospital.address)}`, "_blank");
  };

  // Handle call hospital
  const handleCallHospital = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  // Get wait time color
  const getWaitTimeColor = (waitTime) => {
    const minutes = parseInt(waitTime);
    if (minutes <= 15) return "text-green-600 bg-green-50";
    if (minutes <= 30) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  // Get bed status color
  const getBedStatusColor = (count) => {
    if (count > 5) return "text-green-600";
    if (count > 0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="page-header">Hospital Finder</h1>
          <p className="page-subtitle">Find nearby hospitals with real-time bed availability</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Beds</p>
                <p className="text-2xl font-bold text-foreground">{totalBeds}</p>
              </div>
              <Bed className="w-8 h-8 text-primary/40" />
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Available Hospitals</p>
                <p className="text-2xl font-bold text-foreground">{availableHospitals}/{hospitals.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500/40" />
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg. Rating</p>
                <p className="text-2xl font-bold text-foreground">{avgRating} ⭐</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500/40" />
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Emergency Beds</p>
                <p className="text-2xl font-bold text-foreground">{hospitals.reduce((sum, h) => sum + h.emergency, 0)}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500/40" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" 
              placeholder="Search hospitals by name or address..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="distance">Sort by Distance</option>
              <option value="rating">Sort by Rating</option>
              <option value="icu">Sort by ICU Beds</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-1 dashboard-section animate-slide-up h-[500px] flex flex-col">
            <div className="flex-1 flex items-center justify-center relative">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Interactive Map</p>
                <p className="text-xs mt-1">Hospital locations will appear here</p>
              </div>
              {/* Mini map representation */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-xs font-medium mb-2">Nearby Hospitals:</p>
                  {filteredHospitals.slice(0, 3).map((h, i) => (
                    <div key={i} className="text-xs mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span>{h.name} ({h.distance})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hospital List */}
          <div className="lg:col-span-2 space-y-3">
            {filteredHospitals.length === 0 ? (
              <div className="text-center py-12 dashboard-section">
                <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-30" />
                <h3 className="text-lg font-semibold text-foreground">No hospitals found</h3>
                <p className="text-muted-foreground text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredHospitals.map((hospital) => (
                <div key={hospital.id} className="stat-card animate-slide-up hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{hospital.name}</h3>
                        {hospital.recommended && (
                          <span className="badge-success flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3" /> Recommended
                          </span>
                        )}
                        {!hospital.available && (
                          <span className="badge-critical text-xs">Full Capacity</span>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" /> {hospital.address} • {hospital.distance} away • ⭐ {hospital.rating}
                      </p>
                      
                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className={`text-xs flex items-center gap-1 ${getBedStatusColor(hospital.icu)}`}>
                          <Activity className="w-3 h-3" /> ICU: {hospital.icu}
                        </span>
                        <span className={`text-xs flex items-center gap-1 ${getBedStatusColor(hospital.ventilator)}`}>
                          <Bed className="w-3 h-3" /> Ventilator: {hospital.ventilator}
                        </span>
                        <span className={`text-xs flex items-center gap-1 ${getBedStatusColor(hospital.emergency)}`}>
                          <AlertTriangle className="w-3 h-3" /> Emergency: {hospital.emergency}
                        </span>
                        <span className={`text-xs flex items-center gap-1 px-2 py-0.5 rounded-full ${getWaitTimeColor(hospital.waitTime)}`}>
                          <Clock className="w-3 h-3" /> Wait: {hospital.waitTime}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCallHospital(hospital.phone)}
                          className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" /> Call
                        </button>
                        <button
                          onClick={() => handleGetDirections(hospital)}
                          className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3" /> Directions
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleCheckAvailability(hospital)}
                      disabled={!hospital.available}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        hospital.available 
                          ? "bg-primary text-primary-foreground hover:opacity-90 hover:scale-105" 
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {hospital.available ? "Check Availability" : "Fully Booked"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && selectedHospital && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Book a Bed</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedHospital(null);
                  setBookingStatus(null);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!bookingStatus ? (
              <>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Select bed type at:</p>
                  <h3 className="font-semibold text-foreground">{selectedHospital.name}</h3>
                </div>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => handleBookBed("icu")}
                    disabled={selectedHospital.icu === 0}
                    className={`w-full p-3 rounded-lg border-2 transition-all flex justify-between items-center ${
                      selectedHospital.icu > 0
                        ? "hover:border-primary cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-blue-500" />
                      <div className="text-left">
                        <p className="font-medium">ICU Bed</p>
                        <p className="text-xs text-muted-foreground">{selectedHospital.icu} beds available</p>
                      </div>
                    </div>
                    {selectedHospital.icu > 0 && <span className="text-primary">→</span>}
                  </button>

                  <button
                    onClick={() => handleBookBed("ventilator")}
                    disabled={selectedHospital.ventilator === 0}
                    className={`w-full p-3 rounded-lg border-2 transition-all flex justify-between items-center ${
                      selectedHospital.ventilator > 0
                        ? "hover:border-primary cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Bed className="w-5 h-5 text-green-500" />
                      <div className="text-left">
                        <p className="font-medium">Ventilator Bed</p>
                        <p className="text-xs text-muted-foreground">{selectedHospital.ventilator} beds available</p>
                      </div>
                    </div>
                    {selectedHospital.ventilator > 0 && <span className="text-primary">→</span>}
                  </button>

                  <button
                    onClick={() => handleBookBed("emergency")}
                    disabled={selectedHospital.emergency === 0}
                    className={`w-full p-3 rounded-lg border-2 transition-all flex justify-between items-center ${
                      selectedHospital.emergency > 0
                        ? "hover:border-primary cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <div className="text-left">
                        <p className="font-medium">Emergency Bed</p>
                        <p className="text-xs text-muted-foreground">{selectedHospital.emergency} beds available</p>
                      </div>
                    </div>
                    {selectedHospital.emergency > 0 && <span className="text-primary">→</span>}
                  </button>
                </div>

                <button
                  onClick={() => handleCallHospital(selectedHospital.phone)}
                  className="w-full py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call Hospital Directly
                </button>
              </>
            ) : (
              <div className="text-center py-6">
                {bookingStatus.type === "loading" && (
                  <>
                    <Loader className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                    <p className="text-foreground">{bookingStatus.message}</p>
                  </>
                )}
                {bookingStatus.type === "success" && (
                  <>
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p className="text-foreground font-medium mb-2">Booking Confirmed!</p>
                    <p className="text-sm text-muted-foreground">{bookingStatus.message}</p>
                  </>
                )}
                {bookingStatus.type === "error" && (
                  <>
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <p className="text-foreground font-medium mb-2">Booking Failed</p>
                    <p className="text-sm text-muted-foreground">{bookingStatus.message}</p>
                    <button
                      onClick={() => setBookingStatus(null)}
                      className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                    >
                      Try Again
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HospitalFinderPage;