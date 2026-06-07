import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Bed, RefreshCw, Search, Filter, Download,
  AlertTriangle, Activity, Users, Clock,
  TrendingUp, TrendingDown,
  Edit, Eye, Archive,
  Info, PieChart, BarChart3,
  ArrowUpRight, ArrowDownRight, CheckCircle2,
  XCircle, AlertCircle, X, Wrench, UserCheck
} from "lucide-react";

const wards = [
  {
    id: 1,
    name: "General Ward A",
    total: 50,
    available: 12,
    occupied: 38,
    status: "green",
    department: "General Medicine",
    headNurse: "Sarah Johnson",
    occupancy: 76,
    maintenance: 0,
    lastUpdated: "2 min ago",
    trend: "+3",
  },
  {
    id: 2,
    name: "General Ward B",
    total: 50,
    available: 5,
    occupied: 45,
    status: "yellow",
    department: "General Medicine",
    headNurse: "Michael Chen",
    occupancy: 90,
    maintenance: 0,
    lastUpdated: "5 min ago",
    trend: "-2",
  },
  {
    id: 3,
    name: "ICU",
    total: 20,
    available: 2,
    occupied: 17,
    status: "red",
    department: "Critical Care",
    headNurse: "Emily Williams",
    occupancy: 85,
    maintenance: 1,
    lastUpdated: "1 min ago",
    trend: "+1",
  },
  {
    id: 4,
    name: "Pediatric Ward",
    total: 30,
    available: 15,
    occupied: 15,
    status: "green",
    department: "Pediatrics",
    headNurse: "David Martinez",
    occupancy: 50,
    maintenance: 0,
    lastUpdated: "10 min ago",
    trend: "+5",
  },
  {
    id: 5,
    name: "Maternity Ward",
    total: 25,
    available: 8,
    occupied: 16,
    status: "green",
    department: "Obstetrics",
    headNurse: "Lisa Thompson",
    occupancy: 64,
    maintenance: 1,
    lastUpdated: "3 min ago",
    trend: "+2",
  },
  {
    id: 6,
    name: "Surgical Ward",
    total: 40,
    available: 3,
    occupied: 35,
    status: "red",
    department: "Surgery",
    headNurse: "Robert Garcia",
    occupancy: 87.5,
    maintenance: 2,
    lastUpdated: "4 min ago",
    trend: "-1",
  },
  {
    id: 7,
    name: "Orthopedic Ward",
    total: 35,
    available: 10,
    occupied: 23,
    status: "yellow",
    department: "Orthopedics",
    headNurse: "Patricia Brown",
    occupancy: 65.7,
    maintenance: 2,
    lastUpdated: "7 min ago",
    trend: "+4",
  },
  {
    id: 8,
    name: "Cardiac Care",
    total: 15,
    available: 1,
    occupied: 13,
    status: "red",
    department: "Cardiology",
    headNurse: "James Wilson",
    occupancy: 86.7,
    maintenance: 1,
    lastUpdated: "2 min ago",
    trend: "-3",
  },
  {
    id: 9,
    name: "Neurology Ward",
    total: 20,
    available: 7,
    occupied: 12,
    status: "green",
    department: "Neurology",
    headNurse: "Maria Rodriguez",
    occupancy: 60,
    maintenance: 1,
    lastUpdated: "6 min ago",
    trend: "+2",
  },
];

const recentUpdates = [
  { id: 1, ward: "ICU", bed: "ICU-07", action: "Patient Admitted", patient: "John Doe", time: "5 min ago", status: "completed" },
  { id: 2, ward: "Surgical Ward", bed: "SW-12", action: "Patient Discharged", patient: "Jane Smith", time: "12 min ago", status: "completed" },
  { id: 3, ward: "Cardiac Care", bed: "CC-03", action: "Bed Maintenance", patient: "Bed cleaning", time: "20 min ago", status: "pending" },
  { id: 4, ward: "General Ward A", bed: "GW-23", action: "Bed Assigned", patient: "Mike Johnson", time: "25 min ago", status: "completed" },
  { id: 5, ward: "ICU", bed: "ICU-12", action: "Bed Reserved", patient: "Emergency", time: "30 min ago", status: "pending" },
];

const statusColor = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-rose-500",
};

const statusBg = {
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  yellow: "bg-amber-100 text-amber-700 border-amber-200",
  red: "bg-rose-100 text-rose-700 border-rose-200",
};

// ─── Ward Detail Modal ───────────────────────────────────────────────────────
const WardDetailModal = ({ ward, onClose }) => {
  if (!ward) return null;

  const maintainedBeds = ward.maintenance;
  const occupiedBeds = ward.occupied - maintainedBeds;
  const availableBeds = ward.available;

  const statusLabel = {
    green: "Available",
    yellow: "Moderate",
    red: "Critical",
  }[ward.status];

  const statusDotColor = {
    green: "bg-emerald-500",
    yellow: "bg-amber-500",
    red: "bg-rose-500",
  }[ward.status];

  const barColor = {
    green: "bg-emerald-500",
    yellow: "bg-amber-500",
    red: "bg-rose-500",
  }[ward.status];

  const headerBg = {
    green: "bg-emerald-50",
    yellow: "bg-amber-50",
    red: "bg-rose-50",
  }[ward.status];

  // Build bed map array: O = occupied, M = maintenance, A = available
  const bedMap = [];
  for (let i = 0; i < ward.total; i++) {
    if (i < occupiedBeds) bedMap.push("occupied");
    else if (i < occupiedBeds + maintainedBeds) bedMap.push("maintenance");
    else bedMap.push("available");
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className={`${headerBg} rounded-t-2xl px-6 py-4 border-b border-gray-100`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  ward.status === "red"
                    ? "bg-rose-200"
                    : ward.status === "yellow"
                    ? "bg-amber-200"
                    : "bg-emerald-200"
                }`}
              >
                <Bed
                  className={`w-5 h-5 ${
                    ward.status === "red"
                      ? "text-rose-700"
                      : ward.status === "yellow"
                      ? "text-amber-700"
                      : "text-emerald-700"
                  }`}
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{ward.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm text-gray-500">{ward.department}</span>
                  <span className="text-gray-300">•</span>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusBg[ward.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor}`} />
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/60 transition-colors text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Beds</p>
              <p className="text-2xl font-bold text-gray-900">{ward.total}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <p className="text-xs text-emerald-600 mb-1">Available</p>
              <p className="text-2xl font-bold text-emerald-700">{ward.available}</p>
            </div>
            <div className="bg-rose-50 rounded-xl p-4 text-center">
              <p className="text-xs text-rose-500 mb-1">Occupied</p>
              <p className="text-2xl font-bold text-rose-700">{ward.occupied}</p>
            </div>
          </div>

          {/* Occupancy Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Occupancy Rate</span>
              <span className="font-bold text-gray-900">{ward.occupancy}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                style={{ width: `${ward.occupancy}%` }}
              />
            </div>
          </div>

          {/* Ward Info Grid */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Ward Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
                <UserCheck className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Head Nurse</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{ward.headNurse}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
                <Clock className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{ward.lastUpdated}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
                <Wrench className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Maintenance Beds</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{ward.maintenance}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
                {ward.trend.startsWith("+") ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="text-xs text-gray-500">Today's Trend</p>
                  <p
                    className={`text-sm font-medium mt-0.5 ${
                      ward.trend.startsWith("+") ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {ward.trend} beds
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bed Map */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Bed Map</h3>
            <div className="flex flex-wrap gap-1.5">
              {bedMap.map((type, i) => (
                <div
                  key={i}
                  title={`Bed ${i + 1} — ${type}`}
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold cursor-default transition-transform hover:scale-110 ${
                    type === "occupied"
                      ? "bg-rose-100 text-rose-700"
                      : type === "maintenance"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {type === "occupied" ? "O" : type === "maintenance" ? "M" : "A"}
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-300 inline-block" />
                Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-100 border border-rose-300 inline-block" />
                Occupied
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300 inline-block" />
                Maintenance
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            <Edit className="w-4 h-4" />
            Edit Ward
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const BedManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedWard, setSelectedWard] = useState(null);

  const totalBeds = wards.reduce((acc, ward) => acc + ward.total, 0);
  const totalAvailable = wards.reduce((acc, ward) => acc + ward.available, 0);
  const totalOccupied = wards.reduce((acc, ward) => acc + ward.occupied, 0);
  const criticalWards = wards.filter((w) => w.status === "red").length;
  const occupancyRate = Math.round((totalOccupied / totalBeds) * 100);

  const filteredWards = wards.filter((ward) => {
    const matchesSearch =
      ward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ward.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || ward.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      {/* Ward Detail Modal */}
      {selectedWard && (
        <WardDetailModal ward={selectedWard} onClose={() => setSelectedWard(null)} />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bed Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor and manage hospital bed allocation across all departments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Export</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Bed className="w-4 h-4" />
              <span className="text-sm font-medium">Add Ward</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bed className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalBeds}</h3>
            <p className="text-sm text-gray-500 mt-1">Total Beds</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {Math.round((totalAvailable / totalBeds) * 100)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalAvailable}</h3>
            <p className="text-sm text-gray-500 mt-1">Available Beds</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                {Math.round((totalOccupied / totalBeds) * 100)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalOccupied}</h3>
            <p className="text-sm text-gray-500 mt-1">Occupied Beds</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-rose-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <span className="text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                Critical
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{criticalWards}</h3>
            <p className="text-sm text-gray-500 mt-1">Critical Wards</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Rate
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{occupancyRate}%</h3>
            <p className="text-sm text-gray-500 mt-1">Occupancy Rate</p>
          </div>
        </div>

        {/* Alerts */}
        {criticalWards > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-rose-800">Critical Bed Shortage Alert</h4>
              <p className="text-sm text-rose-700 mt-1">
                {criticalWards} wards have critically low bed availability. Immediate attention
                required for ICU, Surgical Ward, and Cardiac Care.
              </p>
              <button
                onClick={() => setFilterStatus("red")}
                className="mt-2 text-xs font-medium text-rose-800 bg-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-300 transition-colors"
              >
                View Critical Wards
              </button>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search wards or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All Status</option>
              <option value="green">Available</option>
              <option value="yellow">Moderate</option>
              <option value="red">Critical</option>
            </select>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 ${viewMode === "grid" ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`}
              >
                <BarChart3 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 ${viewMode === "list" ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`}
              >
                <PieChart className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Wards Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredWards.map((ward) => (
              <div
                key={ward.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Card Header */}
                <div
                  className={`p-4 border-b ${
                    ward.status === "red"
                      ? "bg-rose-50"
                      : ward.status === "yellow"
                      ? "bg-amber-50"
                      : "bg-emerald-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          ward.status === "red"
                            ? "bg-rose-200"
                            : ward.status === "yellow"
                            ? "bg-amber-200"
                            : "bg-emerald-200"
                        }`}
                      >
                        <Bed
                          className={`w-5 h-5 ${
                            ward.status === "red"
                              ? "text-rose-700"
                              : ward.status === "yellow"
                              ? "text-amber-700"
                              : "text-emerald-700"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{ward.name}</h3>
                        <p className="text-xs text-gray-500">{ward.department}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusBg[ward.status]}`}
                    >
                      {ward.available} Available
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-lg font-semibold text-gray-900">{ward.total}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Occupied</p>
                      <p className="text-lg font-semibold text-gray-900">{ward.occupied}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Available</p>
                      <p className="text-lg font-semibold text-gray-900">{ward.available}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Occupancy Rate</span>
                      <span className="font-medium text-gray-700">{ward.occupancy}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          ward.status === "red"
                            ? "bg-rose-500"
                            : ward.status === "yellow"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${ward.occupancy}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ward.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Head:</span>
                      <span className="font-medium text-gray-700">
                        {ward.headNurse.split(" ")[1]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {ward.trend.startsWith("+") ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span
                        className={
                          ward.trend.startsWith("+") ? "text-emerald-600" : "text-rose-600"
                        }
                      >
                        {ward.trend}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons — View Details now opens modal */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedWard(ward)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                    <button className="flex items-center justify-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Edit className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <button className="flex items-center justify-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Beds</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupied</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head Nurse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredWards.map((ward) => (
                  <tr key={ward.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{ward.name}</td>
                    <td className="px-6 py-4 text-gray-600">{ward.department}</td>
                    <td className="px-6 py-4 text-gray-600">{ward.total}</td>
                    <td className="px-6 py-4 text-gray-600">{ward.occupied}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBg[ward.status]}`}>
                        {ward.available}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`w-2 h-2 rounded-full ${statusColor[ward.status]}`} />
                    </td>
                    <td className="px-6 py-4 text-gray-600">{ward.headNurse}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedWard(ward)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Bed Updates</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {recentUpdates.map((update) => (
              <div
                key={update.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      update.status === "completed" ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-semibold">{update.ward}</span> - Bed {update.bed}
                    </p>
                    <p className="text-xs text-gray-500">
                      {update.action}: {update.patient}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{update.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BedManagementPage;
