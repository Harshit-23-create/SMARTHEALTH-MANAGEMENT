import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Pill, 
  AlertTriangle, 
  Plus, 
  Search, 
  X, 
  Check,
  Package,
  Clock,
  TrendingUp,
  FileText,
  Filter,
  MoreVertical,
  Printer,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  ShoppingCart,
  Send,
  FileBarChart,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2
} from "lucide-react";

// Mock data with IDs
const initialMedicines = [
  { id: "1", name: "Paracetamol", category: "Analgesic", stock: 500, unit: "tablets", status: "normal", expiry: "2024-12", manufacturer: "PharmaCorp", price: 0.15, reorderLevel: 100, batchNumber: "PC-2024-001", location: "A-12" },
  { id: "2", name: "Amoxicillin", category: "Antibiotic", stock: 120, unit: "capsules", status: "normal", expiry: "2024-10", manufacturer: "MediHealth", price: 0.45, reorderLevel: 50, batchNumber: "AM-2024-045", location: "B-08" },
  { id: "3", name: "Insulin", category: "Hormone", stock: 25, unit: "vials", status: "low", expiry: "2024-08", manufacturer: "BioCare", price: 12.50, reorderLevel: 30, batchNumber: "IN-2024-012", location: "C-03" },
  { id: "4", name: "Aspirin", category: "Analgesic", stock: 800, unit: "tablets", status: "normal", expiry: "2025-06", manufacturer: "PharmaCorp", price: 0.08, reorderLevel: 200, batchNumber: "AS-2024-089", location: "A-15" },
  { id: "5", name: "Metformin", category: "Antidiabetic", stock: 15, unit: "bottles", status: "critical", expiry: "2024-09", manufacturer: "DiabeCare", price: 5.25, reorderLevel: 25, batchNumber: "MT-2024-034", location: "D-02" },
  { id: "6", name: "Omeprazole", category: "Antacid", stock: 200, unit: "capsules", status: "normal", expiry: "2024-11", manufacturer: "GastroHealth", price: 0.35, reorderLevel: 80, batchNumber: "OM-2024-056", location: "E-07" },
  { id: "7", name: "Diazepam", category: "Sedative", stock: 30, unit: "tablets", status: "low", expiry: "2024-07", manufacturer: "NeuroPharm", price: 0.60, reorderLevel: 40, batchNumber: "DZ-2024-023", location: "F-11" },
  { id: "8", name: "Morphine", category: "Opioid", stock: 10, unit: "ampoules", status: "critical", expiry: "2024-05", manufacturer: "PainRelief Inc", price: 8.75, reorderLevel: 20, batchNumber: "MR-2024-009", location: "F-14" },
];

const initialPrescriptions = [
  { id: "RX-001", patientName: "John Doe", doctorName: "Dr. Smith", date: "2024-01-15", medicineId: "1", quantity: 30, status: "pending" },
  { id: "RX-002", patientName: "Jane Smith", doctorName: "Dr. Johnson", date: "2024-01-14", medicineId: "2", quantity: 20, status: "pending" },
];

const initialOrders = [
  { id: "PO-001", medicineId: "3", quantity: 50, orderDate: "2024-01-10", status: "pending", supplier: "BioCare", totalCost: 625 },
  { id: "PO-002", medicineId: "5", quantity: 30, orderDate: "2024-01-12", status: "approved", supplier: "DiabeCare", totalCost: 157.50 },
];

const categories = ["Analgesic", "Antibiotic", "Hormone", "Antidiabetic", "Antacid", "Sedative", "Opioid", "Antiviral", "Antifungal", "Vaccine"];
const suppliers = ["PharmaCorp", "MediHealth", "BioCare", "DiabeCare", "GastroHealth", "NeuroPharm", "PainRelief Inc"];

const PharmacyPage = () => {
  // State management
  const [medicines, setMedicines] = useState(initialMedicines);
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [stockOrders, setStockOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [activeTab, setActiveTab] = useState("inventory");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [medicineForm, setMedicineForm] = useState({
    name: "",
    category: "",
    stock: 0,
    unit: "tablets",
    expiry: "",
    manufacturer: "",
    price: 0,
    reorderLevel: 0,
    batchNumber: "",
    location: "",
  });
  
  const [prescriptionForm, setPrescriptionForm] = useState({
    id: "",
    patientName: "",
    doctorName: "",
    date: "",
    medicineId: "",
    quantity: 1,
  });
  
  const [orderForm, setOrderForm] = useState({
    medicineId: "",
    quantity: 1,
    supplier: "",
  });
  
  const [reportPeriod, setReportPeriod] = useState("monthly");

  // Derived data
  const lowStockItems = medicines.filter((m) => m.status !== "normal");
  const criticalItems = medicines.filter((m) => m.status === "critical");
  const totalStockValue = medicines.reduce((sum, m) => sum + (m.stock * m.price), 0);
  const expiringSoon = medicines.filter(m => {
    const expiryDate = new Date(m.expiry);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  });

  const stats = [
    { label: "Total Items", value: medicines.reduce((sum, m) => sum + m.stock, 0).toString(), icon: Package, change: "+12%", color: "bg-blue-500" },
    { label: "Low Stock", value: lowStockItems.length.toString(), icon: AlertTriangle, change: `-${lowStockItems.length}`, color: "bg-yellow-500" },
    { label: "Expiring Soon", value: expiringSoon.length.toString(), icon: Clock, change: "30 days", color: "bg-purple-500" },
    { label: "Inventory Value", value: `$${totalStockValue.toFixed(2)}`, icon: TrendingUp, change: "+8.3%", color: "bg-green-500" },
  ];

  // Filtered medicines
  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                         m.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
                         m.category.toLowerCase().includes(search.toLowerCase());
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "low") return matchesSearch && m.status !== "normal";
    if (selectedFilter === "critical") return matchesSearch && m.status === "critical";
    return matchesSearch;
  });

  // Filtered prescriptions
  const filteredPrescriptions = prescriptions.filter(p => 
    p.patientName.toLowerCase().includes(search.toLowerCase()) ||
    p.doctorName.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  // Filtered orders
  const filteredOrders = stockOrders.filter(o => 
    medicines.find(m => m.id === o.medicineId)?.name.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.supplier.toLowerCase().includes(search.toLowerCase())
  );

  // Helper functions
  const showToast = (type, message) => {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "normal": return "bg-green-100 text-green-700 border-green-200";
      case "low": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "critical": return "bg-red-100 text-red-700 border-red-200";
      case "pending": return "bg-orange-100 text-orange-700 border-orange-200";
      case "verified": return "bg-blue-100 text-blue-700 border-blue-200";
      case "dispensed": return "bg-green-100 text-green-700 border-green-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      case "approved": return "bg-green-100 text-green-700 border-green-200";
      case "shipped": return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const updateStockStatus = (stock, reorderLevel = 50) => {
    if (stock <= reorderLevel / 2) return "critical";
    if (stock <= reorderLevel) return "low";
    return "normal";
  };

  // CRUD Operations for Medicines
  const handleAddMedicine = () => {
    if (!medicineForm.name || !medicineForm.category || !medicineForm.manufacturer) {
      showToast("error", "Please fill in all required fields");
      return;
    }
    
    const newMedicine = {
      id: Date.now().toString(),
      name: medicineForm.name,
      category: medicineForm.category,
      stock: medicineForm.stock || 0,
      unit: medicineForm.unit || "tablets",
      expiry: medicineForm.expiry || new Date().toISOString().split('T')[0],
      manufacturer: medicineForm.manufacturer,
      price: medicineForm.price || 0,
      reorderLevel: medicineForm.reorderLevel || 50,
      batchNumber: medicineForm.batchNumber,
      location: medicineForm.location,
      status: updateStockStatus(medicineForm.stock || 0, medicineForm.reorderLevel || 50),
    };
    
    setMedicines([...medicines, newMedicine]);
    setShowAddModal(false);
    setMedicineForm({ name: "", category: "", stock: 0, unit: "tablets", expiry: "", manufacturer: "", price: 0, reorderLevel: 0, batchNumber: "", location: "" });
    showToast("success", `${newMedicine.name} added successfully`);
  };

  const handleEditMedicine = () => {
    if (!selectedMedicine) return;
    
    const updatedMedicines = medicines.map(m => 
      m.id === selectedMedicine.id 
        ? { 
            ...selectedMedicine, 
            ...medicineForm,
            status: updateStockStatus(medicineForm.stock || selectedMedicine.stock, medicineForm.reorderLevel || selectedMedicine.reorderLevel)
          }
        : m
    );
    
    setMedicines(updatedMedicines);
    setShowEditModal(false);
    setSelectedMedicine(null);
    setMedicineForm({});
    showToast("success", "Medicine updated successfully");
  };

  const handleDeleteMedicine = () => {
    if (!selectedMedicine) return;
    
    setMedicines(medicines.filter(m => m.id !== selectedMedicine.id));
    setShowDeleteConfirm(false);
    setSelectedMedicine(null);
    showToast("success", `${selectedMedicine.name} deleted successfully`);
  };

  const handleRestock = (medicine) => {
    const newStock = medicine.stock + (medicine.reorderLevel || 50);
    const updatedMedicines = medicines.map(m =>
      m.id === medicine.id
        ? { ...m, stock: newStock, status: updateStockStatus(newStock, m.reorderLevel) }
        : m
    );
    setMedicines(updatedMedicines);
    showToast("success", `Restocked ${medicine.name} (+${medicine.reorderLevel || 50} ${medicine.unit})`);
  };

  // Prescription Operations
  const handleVerifyPrescription = () => {
    if (!prescriptionForm.patientName || !prescriptionForm.doctorName || !prescriptionForm.medicineId) {
      showToast("error", "Please fill in all prescription details");
      return;
    }
    
    const medicine = medicines.find(m => m.id === prescriptionForm.medicineId);
    if (!medicine) {
      showToast("error", "Selected medicine not found");
      return;
    }
    
    if (medicine.stock < prescriptionForm.quantity) {
      showToast("error", `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}`);
      return;
    }
    
    // Reduce stock
    const updatedMedicines = medicines.map(m =>
      m.id === prescriptionForm.medicineId
        ? { ...m, stock: m.stock - prescriptionForm.quantity, status: updateStockStatus(m.stock - prescriptionForm.quantity, m.reorderLevel) }
        : m
    );
    setMedicines(updatedMedicines);
    
    // Add prescription record
    const newPrescription = {
      id: `RX-${Date.now()}`,
      patientName: prescriptionForm.patientName,
      doctorName: prescriptionForm.doctorName,
      date: prescriptionForm.date || new Date().toISOString().split('T')[0],
      medicineId: prescriptionForm.medicineId,
      quantity: prescriptionForm.quantity,
      status: "dispensed",
    };
    setPrescriptions([...prescriptions, newPrescription]);
    
    setShowPrescriptionModal(false);
    setPrescriptionForm({ id: "", patientName: "", doctorName: "", date: "", medicineId: "", quantity: 1 });
    showToast("success", "Prescription verified and dispensed successfully");
  };

  // Stock Order Operations
  const handlePlaceOrder = () => {
    if (!orderForm.medicineId || !orderForm.supplier) {
      showToast("error", "Please select medicine and supplier");
      return;
    }
    
    const medicine = medicines.find(m => m.id === orderForm.medicineId);
    if (!medicine) return;
    
    const totalCost = medicine.price * orderForm.quantity;
    
    const newOrder = {
      id: `PO-${Date.now()}`,
      medicineId: orderForm.medicineId,
      quantity: orderForm.quantity,
      orderDate: new Date().toISOString().split('T')[0],
      status: "pending",
      supplier: orderForm.supplier,
      totalCost: totalCost,
    };
    
    setStockOrders([...stockOrders, newOrder]);
    setShowOrderModal(false);
    setOrderForm({ medicineId: "", quantity: 1, supplier: "" });
    showToast("success", `Order placed for ${medicine.name} (${orderForm.quantity} ${medicine.unit})`);
  };

  const handleReceiveOrder = (order) => {
    const medicine = medicines.find(m => m.id === order.medicineId);
    if (!medicine) return;
    
    // Update stock
    const updatedMedicines = medicines.map(m =>
      m.id === order.medicineId
        ? { ...m, stock: m.stock + order.quantity, status: updateStockStatus(m.stock + order.quantity, m.reorderLevel) }
        : m
    );
    setMedicines(updatedMedicines);
    
    // Update order status
    const updatedOrders = stockOrders.map(o =>
      o.id === order.id ? { ...o, status: "delivered" } : o
    );
    setStockOrders(updatedOrders);
    
    showToast("success", `Order received for ${medicine.name}`);
  };

  // Report Generation
  const handleGenerateReport = () => {
    setShowReportModal(false);
    showToast("info", `Generating ${reportPeriod} report...`);
    setTimeout(() => {
      showToast("success", `${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} report downloaded`);
    }, 1500);
  };

  // Export functionality
  const handleExport = () => {
    const data = activeTab === "inventory" 
      ? medicines 
      : activeTab === "prescriptions" 
        ? prescriptions 
        : stockOrders;
    
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("success", "Export completed");
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || "")).join(","))
    ];
    return csvRows.join("\n");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setMedicines([...medicines]);
      setLoading(false);
      showToast("info", "Inventory refreshed");
    }, 500);
  };

  // Toast Component
  const Toast = () => {
    if (!toastMessage) return null;
    const bgColor = toastMessage.type === "success" ? "bg-green-500" : toastMessage.type === "error" ? "bg-red-500" : "bg-blue-500";
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
        <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
          {toastMessage.type === "success" && <Check className="w-4 h-4" />}
          {toastMessage.type === "error" && <AlertTriangle className="w-4 h-4" />}
          {toastMessage.type === "info" && <Info className="w-4 h-4" />}
          {toastMessage.message}
        </div>
      </div>
    );
  };

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText = "Confirm", cancelText = "Cancel" }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6">{children}</div>
          {onConfirm && (
            <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                {cancelText}
              </button>
              <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                {confirmText}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-8">
        <Toast />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pharmacy Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage inventory, prescriptions, and dispensary operations</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow">
              <Plus className="w-4 h-4" /> Add Medicine
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg bg-opacity-10`}>
                    <Icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
                <div className="mt-3 text-xs">
                  <span className={stat.change.startsWith('+') || stat.change.startsWith('-') ? 'text-green-600' : 'text-gray-500'}>
                    {stat.change}
                  </span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === "inventory" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Inventory
            </div>
          </button>
          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === "prescriptions" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Prescriptions
              {prescriptions.filter(p => p.status === "pending").length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {prescriptions.filter(p => p.status === "pending").length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === "orders" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </div>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Search..."
            />
          </div>
          
          {activeTab === "inventory" && (
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === "all" 
                    ? "bg-gray-900 text-white" 
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                All Items
              </button>
              <button 
                onClick={() => setSelectedFilter("low")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === "low" 
                    ? "bg-yellow-500 text-white" 
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Low Stock
              </button>
              <button 
                onClick={() => setSelectedFilter("critical")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === "critical" 
                    ? "bg-red-500 text-white" 
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Critical
              </button>
            </div>
          )}
          
          {activeTab === "prescriptions" && (
            <button
              onClick={() => setShowPrescriptionModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              <Plus className="w-4 h-4" /> New Prescription
            </button>
          )}
          
          {activeTab === "orders" && (
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all"
            >
              <ShoppingCart className="w-4 h-4" /> Place Order
            </button>
          )}
        </div>

        {/* Low Stock Alert Banner */}
        {lowStockItems.length > 0 && activeTab === "inventory" && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-slide-up">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Low Stock Alert:</span>{" "}
                {lowStockItems.map((m) => `${m.name} (${m.stock} ${m.unit})`).join(", ")} need restocking.
              </p>
            </div>
            <button onClick={() => setShowAlertModal(true)} className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-800 rounded-lg text-xs font-medium transition-colors">
              View All
            </button>
          </div>
        )}

        {/* Inventory Table */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Current Inventory</h3>
              <div className="flex items-center gap-2">
                <button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Medicine", "Category", "Stock", "Unit", "Price", "Expiry", "Status", ""].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((m) => (
                    <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Pill className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{m.name}</p>
                            <p className="text-xs text-gray-400">{m.manufacturer}</p>
                          </div>
                        </div>
                       </td>
                      <td className="py-3 px-4 text-gray-600">{m.category}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          m.status === "critical" ? "text-red-600" : 
                          m.status === "low" ? "text-yellow-600" : 
                          "text-gray-900"
                        }`}>
                          {m.stock}
                        </span>
                       </td>
                      <td className="py-3 px-4 text-gray-500">{m.unit}</td>
                      <td className="py-3 px-4 text-gray-900 font-medium">${m.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-500">{m.expiry}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(m.status)}`}>
                          {m.status === "normal" ? "In Stock" : m.status === "low" ? "Low Stock" : "Critical"}
                        </span>
                       </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setSelectedMedicine(m);
                              setMedicineForm(m);
                              setShowEditModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedMedicine(m);
                              setShowDetailsModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          <button 
                            onClick={() => handleRestock(m)}
                            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4 text-gray-500" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedMedicine(m);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredMedicines.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No medicines found matching your search.</p>
                </div>
              )}
            </div>
            
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Showing {filteredMedicines.length} of {medicines.length} items
              </p>
            </div>
          </div>
        )}

        {/* Prescriptions Table */}
        {activeTab === "prescriptions" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Prescription Records</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["ID", "Patient", "Doctor", "Medicine", "Quantity", "Date", "Status", ""].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPrescriptions.map((p) => {
                    const medicine = medicines.find(m => m.id === p.medicineId);
                    return (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-gray-500">{p.id}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{p.patientName}</td>
                        <td className="py-3 px-4 text-gray-600">{p.doctorName}</td>
                        <td className="py-3 px-4 text-gray-600">{medicine?.name || "Unknown"}</td>
                        <td className="py-3 px-4 text-gray-600">{p.quantity}</td>
                        <td className="py-3 px-4 text-gray-500">{p.date}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(p.status)}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {p.status === "pending" && (
                            <button
                              onClick={() => {
                                setPrescriptionForm({
                                  id: p.id,
                                  patientName: p.patientName,
                                  doctorName: p.doctorName,
                                  date: p.date,
                                  medicineId: p.medicineId,
                                  quantity: p.quantity,
                                });
                                setShowPrescriptionModal(true);
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                            >
                              Verify
                            </button>
                          )}
                        </td>
                       </tr>
                    );
                  })}
                </tbody>
               </table>
              {filteredPrescriptions.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No prescriptions found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Table */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Stock Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Order ID", "Medicine", "Quantity", "Supplier", "Total Cost", "Order Date", "Status", ""].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">{h}</th>
                    ))}
                   </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => {
                    const medicine = medicines.find(m => m.id === o.medicineId);
                    return (
                      <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-gray-500">{o.id}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{medicine?.name || "Unknown"}</td>
                        <td className="py-3 px-4 text-gray-600">{o.quantity} {medicine?.unit}</td>
                        <td className="py-3 px-4 text-gray-600">{o.supplier}</td>
                        <td className="py-3 px-4 text-gray-900 font-medium">${o.totalCost.toFixed(2)}</td>
                        <td className="py-3 px-4 text-gray-500">{o.orderDate}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(o.status)}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {o.status === "shipped" && (
                            <button
                              onClick={() => handleReceiveOrder(o)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                            >
                              Receive
                            </button>
                          )}
                        </td>
                       </tr>
                    );
                  })}
                </tbody>
               </table>
              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => setShowPrescriptionModal(true)} className="p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Check className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Verify Prescription</h4>
                <p className="text-xs text-gray-500 mt-1">Check and approve new prescriptions</p>
              </div>
            </div>
          </button>
          
          <button onClick={() => setShowOrderModal(true)} className="p-4 bg-white border border-gray-100 rounded-xl hover:border-green-200 hover:shadow-sm transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Order Stock</h4>
                <p className="text-xs text-gray-500 mt-1">Place orders for low inventory items</p>
              </div>
            </div>
          </button>
          
          <button onClick={() => setShowReportModal(true)} className="p-4 bg-white border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Generate Report</h4>
                <p className="text-xs text-gray-500 mt-1">Monthly inventory and usage report</p>
              </div>
            </div>
          </button>
        </div>

        {/* Add Medicine Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Medicine" onConfirm={handleAddMedicine} confirmText="Add Medicine">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
              <input value={medicineForm.name || ""} onChange={(e) => setMedicineForm({...medicineForm, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Enter medicine name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select value={medicineForm.category || ""} onChange={(e) => setMedicineForm({...medicineForm, category: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option value="">Select category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer *</label>
                <select value={medicineForm.manufacturer || ""} onChange={(e) => setMedicineForm({...medicineForm, manufacturer: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option value="">Select manufacturer</option>
                  {suppliers.map(sup => <option key={sup} value={sup}>{sup}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input type="number" value={medicineForm.stock || 0} onChange={(e) => setMedicineForm({...medicineForm, stock: parseInt(e.target.value)})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input value={medicineForm.unit || "tablets"} onChange={(e) => setMedicineForm({...medicineForm, unit: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input type="number" step="0.01" value={medicineForm.price || 0} onChange={(e) => setMedicineForm({...medicineForm, price: parseFloat(e.target.value)})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input type="date" value={medicineForm.expiry || ""} onChange={(e) => setMedicineForm({...medicineForm, expiry: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                <input type="number" value={medicineForm.reorderLevel || 0} onChange={(e) => setMedicineForm({...medicineForm, reorderLevel: parseInt(e.target.value)})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input value={medicineForm.location || ""} onChange={(e) => setMedicineForm({...medicineForm, location: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g., A-12" />
              </div>
            </div>
          </div>
        </Modal>

        {/* Edit Medicine Modal */}
        <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setSelectedMedicine(null); }} title="Edit Medicine" onConfirm={handleEditMedicine} confirmText="Save Changes">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
              <input value={medicineForm.name || ""} onChange={(e) => setMedicineForm({...medicineForm, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" value={medicineForm.stock || 0} onChange={(e) => setMedicineForm({...medicineForm, stock: parseInt(e.target.value)})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input type="number" step="0.01" value={medicineForm.price || 0} onChange={(e) => setMedicineForm({...medicineForm, price: parseFloat(e.target.value)})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input type="date" value={medicineForm.expiry || ""} onChange={(e) => setMedicineForm({...medicineForm, expiry: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                <input type="number" value={medicineForm.reorderLevel || 0} onChange={(e) => setMedicineForm({...medicineForm, reorderLevel: parseInt(e.target.value)})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            </div>
          </div>
        </Modal>

        {/* Prescription Modal */}
        <Modal isOpen={showPrescriptionModal} onClose={() => setShowPrescriptionModal(false)} title="Verify Prescription" onConfirm={handleVerifyPrescription} confirmText="Verify & Dispense">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prescription ID</label>
              <input value={prescriptionForm.id} onChange={(e) => setPrescriptionForm({...prescriptionForm, id: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" placeholder="RX-XXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
              <input value={prescriptionForm.patientName} onChange={(e) => setPrescriptionForm({...prescriptionForm, patientName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" placeholder="Full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name *</label>
              <input value={prescriptionForm.doctorName} onChange={(e) => setPrescriptionForm({...prescriptionForm, doctorName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" placeholder="Doctor's name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine *</label>
                <select value={prescriptionForm.medicineId} onChange={(e) => setPrescriptionForm({...prescriptionForm, medicineId: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm">
                  <option value="">Select medicine</option>
                  {medicines.map(m => (
                    <option key={m.id} value={m.id}>{m.name} (Stock: {m.stock})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input type="number" value={prescriptionForm.quantity} onChange={(e) => setPrescriptionForm({...prescriptionForm, quantity: parseInt(e.target.value)})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" value={prescriptionForm.date} onChange={(e) => setPrescriptionForm({...prescriptionForm, date: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
        </Modal>

        {/* Order Modal */}
        <Modal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} title="Place Stock Order" onConfirm={handlePlaceOrder} confirmText="Place Order">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine *</label>
              <select value={orderForm.medicineId} onChange={(e) => setOrderForm({...orderForm, medicineId: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm">
                <option value="">Select medicine</option>
                {medicines.filter(m => m.status !== "normal").map(m => (
                  <option key={m.id} value={m.id}>{m.name} (Current: {m.stock} {m.unit})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input type="number" value={orderForm.quantity} onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value)})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
              <select value={orderForm.supplier} onChange={(e) => setOrderForm({...orderForm, supplier: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm">
                <option value="">Select supplier</option>
                {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </Modal>

        {/* Report Modal */}
        <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Generate Report" onConfirm={handleGenerateReport} confirmText="Generate">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Period</label>
              <div className="flex gap-3">
                {["monthly", "quarterly", "yearly"].map(period => (
                  <button
                    key={period}
                    onClick={() => setReportPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      reportPeriod === period ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Report will include:</p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• Inventory valuation summary</li>
                <li>• Low stock and expiring items</li>
                <li>• Prescription dispensing statistics</li>
                <li>• Order history and costs</li>
              </ul>
            </div>
          </div>
        </Modal>

        {/* Medicine Details Modal */}
        <Modal isOpen={showDetailsModal} onClose={() => { setShowDetailsModal(false); setSelectedMedicine(null); }} title="Medicine Details">
          {selectedMedicine && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Pill className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedMedicine.name}</h4>
                  <p className="text-xs text-gray-500">{selectedMedicine.manufacturer}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{selectedMedicine.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Batch Number</p>
                  <p className="font-medium text-gray-900">{selectedMedicine.batchNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Stock</p>
                  <p className="font-medium text-gray-900">{selectedMedicine.stock} {selectedMedicine.unit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-medium text-gray-900">${selectedMedicine.price.toFixed(2)} per {selectedMedicine.unit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expiry Date</p>
                  <p className="font-medium text-gray-900">{selectedMedicine.expiry}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{selectedMedicine.location || "Not assigned"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reorder Level</p>
                  <p className="font-medium text-gray-900">{selectedMedicine.reorderLevel || 50} {selectedMedicine.unit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMedicine.status)}`}>
                    {selectedMedicine.status === "normal" ? "In Stock" : selectedMedicine.status === "low" ? "Low Stock" : "Critical"}
                  </span>
                </div>
              </div>
              <div className="pt-3 flex gap-2">
                <button onClick={() => handleRestock(selectedMedicine)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Restock</button>
                <button onClick={() => { setShowDetailsModal(false); setMedicineForm(selectedMedicine); setShowEditModal(true); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Edit</button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setSelectedMedicine(null); }} title="Delete Medicine" onConfirm={handleDeleteMedicine} confirmText="Delete" cancelText="Cancel">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-gray-700">Are you sure you want to delete <span className="font-semibold">{selectedMedicine?.name}</span>?</p>
            <p className="text-xs text-gray-500 mt-2">This action cannot be undone.</p>
          </div>
        </Modal>

        {/* Low Stock Alert Modal */}
        <Modal isOpen={showAlertModal} onClose={() => setShowAlertModal(false)} title="Low Stock Items">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {lowStockItems.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="font-medium text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-500">Stock: {m.stock} {m.unit} | Reorder at: {m.reorderLevel}</p>
                </div>
                <button onClick={() => handleRestock(m)} className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-xs font-medium hover:bg-yellow-700">Restock</button>
              </div>
            ))}
            {criticalItems.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-red-600 mb-2">Critical Items (Below 50% of reorder level)</p>
                {criticalItems.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 mt-2">
                    <div>
                      <p className="font-medium text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-500">Stock: {m.stock} {m.unit}</p>
                    </div>
                    <button onClick={() => handleRestock(m)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">Order Now</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default PharmacyPage;