import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import {
  Truck,
  Phone,
  MapPin,
  Clock,
  User,
  AlertCircle,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

// Initial ambulance data
const initialAmbulances = [
  {
    id: "AMB-001",
    driver: "James Miller",
    phone: "+1-555-0101",
    status: "Available",
    location: "Station A",
    eta: "—",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "AMB-002",
    driver: "Sarah Lee",
    phone: "+1-555-0102",
    status: "On Duty",
    location: "Downtown",
    eta: "8 min",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "AMB-003",
    driver: "Robert Brown",
    phone: "+1-555-0103",
    status: "On Duty",
    location: "Highway 5",
    eta: "15 min",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "AMB-004",
    driver: "Maria Garcia",
    phone: "+1-555-0104",
    status: "Available",
    location: "Station B",
    eta: "—",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "AMB-005",
    driver: "David Kim",
    phone: "+1-555-0105",
    status: "Maintenance",
    location: "Garage",
    eta: "—",
    lastUpdated: new Date().toISOString(),
  },
];

const AmbulancePage = () => {
  const [ambulances, setAmbulances] = useState(initialAmbulances);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState(null);
  const [formData, setFormData] = useState({
    driver: "",
    phone: "",
    status: "Available",
    location: "",
    eta: "—",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Stats
  const available = ambulances.filter((a) => a.status === "Available").length;
  const onDuty = ambulances.filter((a) => a.status === "On Duty").length;
  const maintenance = ambulances.filter((a) => a.status === "Maintenance").length;

  // Filter
  const filteredAmbulances = ambulances.filter((amb) => {
    const matchesSearch =
      amb.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amb.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amb.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || amb.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Auto ETA update
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulances((prev) =>
        prev.map((amb) => {
          if (amb.status === "On Duty" && amb.eta !== "—") {
            const etaValue = amb.eta.replace(" min", "");
            const current = parseInt(etaValue);
            if (!isNaN(current) && current > 0) {
              const newETA = current - 1;
              return {
                ...amb,
                eta: newETA > 0 ? `${newETA} min` : "Arriving",
                lastUpdated: new Date().toISOString(),
              };
            }
          }
          return amb;
        })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Add
  const handleAdd = () => {
    if (!formData.driver || !formData.phone || !formData.location) {
      alert("Please fill all required fields");
      return;
    }

    const newAmbulance = {
      id: `AMB-${Date.now()}`,
      ...formData,
      lastUpdated: new Date().toISOString(),
    };

    setAmbulances([...ambulances, newAmbulance]);
    resetForm();
    setIsModalOpen(false);
  };

  // Edit
  const handleEdit = () => {
    if (editingAmbulance) {
      setAmbulances(
        ambulances.map((amb) =>
          amb.id === editingAmbulance.id
            ? { ...amb, ...formData, lastUpdated: new Date().toISOString() }
            : amb
        )
      );
      resetForm();
      setIsModalOpen(false);
      setEditingAmbulance(null);
    }
  };

  // Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ambulance?")) {
      setAmbulances(ambulances.filter((a) => a.id !== id));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      driver: "",
      phone: "",
      status: "Available",
      location: "",
      eta: "—",
    });
  };

  // Open modal for add
  const openAddModal = () => {
    setEditingAmbulance(null);
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (ambulance) => {
    setEditingAmbulance(ambulance);
    setFormData({
      driver: ambulance.driver,
      phone: ambulance.phone,
      status: ambulance.status,
      location: ambulance.location,
      eta: ambulance.eta,
    });
    setIsModalOpen(true);
  };

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    setAmbulances(
      ambulances.map((amb) =>
        amb.id === id
          ? {
              ...amb,
              status: newStatus,
              eta: newStatus === "On Duty" ? "10 min" : "—",
              lastUpdated: new Date().toISOString(),
            }
          : amb
      )
    );
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    return `${Math.floor(minutes / 60)} hours ago`;
  };

  // Get status color class
  const getStatusClass = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "On Duty":
        return "bg-yellow-100 text-yellow-800";
      case "Maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ambulance Management</h1>
            <p className="text-gray-600 mt-1">Track and manage ambulance fleet in real-time</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Ambulance
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Available" value={available} icon={Truck} variant="success" />
          <StatCard title="On Duty" value={onDuty} icon={Truck} variant="warning" />
          <StatCard title="Maintenance" value={maintenance} icon={AlertCircle} variant="critical" />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by ID, driver, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Available", "On Duty", "Maintenance"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Ambulance List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAmbulances.map((amb) => (
            <div key={amb.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900">{amb.id}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(amb)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(amb.id)}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-3.5 h-3.5" />
                    <span>{amb.driver}</span>
                  </div>
                  <select
                    value={amb.status}
                    onChange={(e) => handleStatusChange(amb.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded ${getStatusClass(amb.status)} border-0 focus:outline-none cursor-pointer`}
                  >
                    <option value="Available">Available</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-3.5 h-3.5" />
                  <a href={`tel:${amb.phone}`} className="hover:text-blue-600 transition-colors">
                    {amb.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{amb.location}</span>
                </div>

                {amb.status === "On Duty" && (
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>ETA: {amb.eta}</span>
                  </div>
                )}

                <div className="text-xs text-gray-400 pt-2 border-t">
                  Last updated: {formatTimeAgo(amb.lastUpdated)}
                </div>
              </div>

              {amb.status === "On Duty" && (
                <button
                  onClick={() => handleStatusChange(amb.id, "Available")}
                  className="mt-3 w-full py-1.5 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                >
                  Mark as Available
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAmbulances.length === 0 && (
          <div className="text-center py-12">
            <Truck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No ambulances found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingAmbulance ? "Edit Ambulance" : "Add Ambulance"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAmbulance(null);
                    resetForm();
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Driver Name *</label>
                  <input
                    placeholder="Enter driver name"
                    value={formData.driver}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <input
                    placeholder="Enter phone number"
                    value={formData.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <input
                    placeholder="Enter location"
                    value={formData.location}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                {formData.status === "On Duty" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">ETA (minutes)</label>
                    <input
                      placeholder="e.g., 10 min"
                      value={formData.eta}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={editingAmbulance ? handleEdit : handleAdd}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingAmbulance ? "Save Changes" : "Add Ambulance"}
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingAmbulance(null);
                      resetForm();
                    }}
                    className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AmbulancePage;