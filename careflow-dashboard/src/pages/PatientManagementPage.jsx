import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API_BASE_URL from "@/utils/api";
import { 
  Search, Plus, X, Filter, Download, Upload,
  User, Calendar, Activity, Bed, Heart, 
  Phone, Mail, MapPin, AlertCircle, CheckCircle,
  Clock, Edit, Trash2, Eye, MoreVertical,
  ChevronDown, ChevronLeft, ChevronRight,
  Users, UserPlus, FileText, Printer,
  ArrowUpDown, RefreshCw, Loader
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientManagementPage = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [formErrors, setFormErrors] = useState({});
  
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    disease: "",
    bed: "",
    department: "",
    admissionDate: new Date().toISOString().split('T')[0],
    contactNumber: "",
    emergencyContact: "",
    address: "",
    bloodGroup: "",
    status: "Admitted",
    doctor: "",
    notes: ""
  });

  // Department options
  const departments = [
    "General Medicine",
    "Cardiology", 
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Surgery",
    "ICU",
    "Obstetrics"
  ];

  // Blood groups
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  /* ===========================
     FETCH PATIENTS
  ============================ */
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/patients`);
      if (!res.ok) throw new Error("Failed to fetch patients");

      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Unable to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  /* ===========================
     VALIDATE FORM
  ============================ */
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.age) errors.age = "Age is required";
    else if (formData.age < 0 || formData.age > 150) errors.age = "Invalid age";
    
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.disease.trim()) errors.disease = "Disease is required";
    if (!formData.bed.trim()) errors.bed = "Bed number is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.contactNumber.trim()) errors.contactNumber = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contactNumber)) errors.contactNumber = "Invalid phone number";
    
    if (!formData.bloodGroup) errors.bloodGroup = "Blood group is required";
    if (!formData.doctor.trim()) errors.doctor = "Doctor name is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ===========================
     ADD PATIENT
  ============================ */
  const handleAddPatient = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          admissionDate: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add patient");
        return;
      }

      // Reset form
      setFormData({
        name: "",
        age: "",
        gender: "",
        disease: "",
        bed: "",
        department: "",
        admissionDate: new Date().toISOString().split('T')[0],
        contactNumber: "",
        emergencyContact: "",
        address: "",
        bloodGroup: "",
        status: "Admitted",
        doctor: "",
        notes: ""
      });

      setShowModal(false);
      fetchPatients();

    } catch (error) {
      console.error("Add error:", error);
      alert("Server error while adding patient");
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     DELETE PATIENT
  ============================ */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this patient record? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      fetchPatients();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete patient");
    }
  };

  /* ===========================
     UPDATE PATIENT STATUS
  ============================ */
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      fetchPatients();
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update patient status");
    }
  };

  /* ===========================
     SORTING & FILTERING
  ============================ */
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filtered = patients
    .filter((p) => {
      const matchSearch = 
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.disease?.toLowerCase().includes(search.toLowerCase()) ||
        p.department?.toLowerCase().includes(search.toLowerCase()) ||
        p.doctor?.toLowerCase().includes(search.toLowerCase());

      const matchFilter = filter === "All" || p.status === filter;
      const matchDept = departmentFilter === "All" || p.department === departmentFilter;

      return matchSearch && matchFilter && matchDept;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === "age" || sortField === "name") {
        if (sortDirection === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      }
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedPatients = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const totalPatients = patients.length;
  const admittedPatients = patients.filter(p => p.status === "Admitted").length;
  const dischargedPatients = patients.filter(p => p.status === "Discharged").length;
  const icuPatients = patients.filter(p => p.department === "ICU").length;

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage patient records, admissions, and discharges
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Export</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Print</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Patient</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalPatients}</h3>
            <p className="text-sm text-gray-500 mt-1">Total Patients</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Current
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{admittedPatients}</h3>
            <p className="text-sm text-gray-500 mt-1">Admitted Patients</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                Discharged
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{dischargedPatients}</h3>
            <p className="text-sm text-gray-500 mt-1">Discharged Patients</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                ICU
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{icuPatients}</h3>
            <p className="text-sm text-gray-500 mt-1">ICU Patients</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, disease, department, or doctor..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Filters</span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="All">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
                <select
                  value={sortField}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                  <option value="admissionDate">Admission Date</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Patient Grid/List View */}
        {!loading && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginatedPatients.map((patient) => (
                  <div 
                    key={patient._id} 
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Card Header */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {patient.name?.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">{patient.age} yrs</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{patient.bloodGroup || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="relative group">
                          <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                          <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10">
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Eye className="w-3 h-3" /> View
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Edit className="w-3 h-3" /> Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(patient._id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-600">{patient.disease}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-600">Bed: {patient.bed}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-600">{patient.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-600">{patient.contactNumber || "N/A"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">Dr. {patient.doctor || "Not assigned"}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patient.status === "Admitted" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {patient.status}
                        </span>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => handleStatusChange(patient._id, "Discharged")}
                          className="flex-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Discharge
                        </button>
                        <button className="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          View Details
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Patient
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort("age")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Age
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedPatients.map((patient) => (
                      <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {patient.name?.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">{patient.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{patient.age}</td>
                        <td className="px-6 py-4 text-gray-600">{patient.disease}</td>
                        <td className="px-6 py-4 text-gray-600">{patient.department}</td>
                        <td className="px-6 py-4 text-gray-600">{patient.bed}</td>
                        <td className="px-6 py-4 text-gray-600">Dr. {patient.doctor}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            patient.status === "Admitted" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button 
                              onClick={() => handleDelete(patient._id)}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} patients
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* No Results */}
            {filtered.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No patients found matching your criteria</p>
                <button 
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                    setDepartmentFilter("All");
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}

        {/* ADD PATIENT MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Add New Patient</h2>
                    <p className="text-sm text-gray-500 mt-1">Enter patient details below</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddPatient} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Information */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        formErrors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter patient name"
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-500">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        formErrors.age ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter age"
                    />
                    {formErrors.age && (
                      <p className="text-xs text-red-500">{formErrors.age}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        formErrors.gender ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.gender && (
                      <p className="text-xs text-red-500">{formErrors.gender}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Blood Group <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        formErrors.bloodGroup ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                    {formErrors.bloodGroup && (
                      <p className="text-xs text-red-500">{formErrors.bloodGroup}</p>
                    )}
                  </div>

                  {/* Medical Information */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Disease <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.disease}
                      onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        formErrors.disease ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter disease/diagnosis"
                    />
                    {formErrors.disease && (
                      <p className="text-xs text-red-500">{formErrors.disease}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        formErrors.department ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {formErrors.department && (
                      <p className="text-xs text-red-500">{formErrors.department}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bed Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.bed}
                      onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        formErrors.bed ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter bed number"
                    />
                    {formErrors.bed && (
                      <p className="text-xs text-red-500">{formErrors.bed}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Attending Doctor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.doctor}
                      onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        formErrors.doctor ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter doctor name"
                    />
                    {formErrors.doctor && (
                      <p className="text-xs text-red-500">{formErrors.doctor}</p>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        formErrors.contactNumber ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                    />
                    {formErrors.contactNumber && (
                      <p className="text-xs text-red-500">{formErrors.contactNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Emergency contact number"
                      maxLength="10"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Enter address"
                      rows="2"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Any additional notes or medical history"
                      rows="2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Add Patient
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientManagementPage;