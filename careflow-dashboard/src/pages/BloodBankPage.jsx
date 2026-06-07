import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Droplets, AlertTriangle, Plus, UserPlus, CheckCircle, XCircle, Trash2, Mail, Phone, Calendar, Search, Filter } from "lucide-react";

const initialBloodGroups = [
  { type: "A+", units: 45, status: "normal" },
  { type: "A-", units: 12, status: "low" },
  { type: "B+", units: 38, status: "normal" },
  { type: "B-", units: 8, status: "critical" },
  { type: "AB+", units: 22, status: "normal" },
  { type: "AB-", units: 5, status: "critical" },
  { type: "O+", units: 52, status: "normal" },
  { type: "O-", units: 15, status: "low" },
];

const statusStyles = {
  normal: { bg: "bg-[hsl(145_65%_92%)]", text: "text-[hsl(145_65%_30%)]", label: "Adequate" },
  low: { bg: "bg-[hsl(38_92%_92%)]", text: "text-[hsl(38_80%_30%)]", label: "Low Stock" },
  critical: { bg: "bg-[hsl(0_72%_92%)]", text: "text-[hsl(0_72%_40%)]", label: "Critical" },
};

const BloodBankPage = () => {
  const [bloodGroups, setBloodGroups] = useState(initialBloodGroups);
  const [donors, setDonors] = useState([
    { id: 1, name: "John Doe", bloodGroup: "A+", phone: "+1234567890", email: "john@example.com", lastDonation: "2024-01-15", status: "active" },
    { id: 2, name: "Jane Smith", bloodGroup: "O-", phone: "+1234567891", email: "jane@example.com", lastDonation: "2024-02-20", status: "active" },
    { id: 3, name: "Mike Johnson", bloodGroup: "B+", phone: "+1234567892", email: "mike@example.com", lastDonation: "2024-03-10", status: "active" },
  ]);
  
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Form states
  const [donorForm, setDonorForm] = useState({
    name: "",
    bloodGroup: "",
    phone: "",
    email: "",
    lastDonation: "",
  });
  
  const [emergencyForm, setEmergencyForm] = useState({
    patientName: "",
    bloodGroup: "",
    hospital: "",
    requiredUnits: "",
    contactPerson: "",
    contactNumber: "",
    urgency: "high",
  });

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const updateBloodStock = (bloodGroup, units) => {
    setBloodGroups(prev => prev.map(bg => {
      if (bg.type === bloodGroup) {
        const newUnits = bg.units - units;
        let newStatus = bg.status;
        if (newUnits <= 5) newStatus = "critical";
        else if (newUnits <= 15) newStatus = "low";
        else newStatus = "normal";
        return { ...bg, units: newUnits, status: newStatus };
      }
      return bg;
    }));
  };

  const handleAddDonor = () => {
    if (!donorForm.name || !donorForm.bloodGroup || !donorForm.phone) {
      showToastMessage("Please fill all required fields!", "error");
      return;
    }

    const newDonor = {
      id: Date.now(),
      ...donorForm,
      status: "active",
      lastDonation: donorForm.lastDonation || new Date().toISOString().split('T')[0],
    };

    setDonors([...donors, newDonor]);
    
    // Add blood units from donor
    updateBloodStock(donorForm.bloodGroup, -1); // Negative to add units
    setBloodGroups(prev => prev.map(bg => {
      if (bg.type === donorForm.bloodGroup) {
        const newUnits = bg.units + 1;
        let newStatus = bg.status;
        if (newUnits > 15) newStatus = "normal";
        else if (newUnits > 5) newStatus = "low";
        else newStatus = "critical";
        return { ...bg, units: newUnits, status: newStatus };
      }
      return bg;
    }));

    setDonorForm({ name: "", bloodGroup: "", phone: "", email: "", lastDonation: "" });
    setShowDonorModal(false);
    showToastMessage(`Donor ${donorForm.name} registered successfully! +1 unit of ${donorForm.bloodGroup} added.`);
  };

  const handleEmergencyRequest = () => {
    if (!emergencyForm.patientName || !emergencyForm.bloodGroup || !emergencyForm.requiredUnits) {
      showToastMessage("Please fill all required fields!", "error");
      return;
    }

    const bloodGroupStock = bloodGroups.find(bg => bg.type === emergencyForm.bloodGroup);
    
    if (!bloodGroupStock || bloodGroupStock.units < parseInt(emergencyForm.requiredUnits)) {
      showToastMessage(`Insufficient stock for ${emergencyForm.bloodGroup}! Available: ${bloodGroupStock?.units || 0} units`, "error");
      return;
    }

    const newRequest = {
      id: Date.now(),
      ...emergencyForm,
      requiredUnits: parseInt(emergencyForm.requiredUnits),
      status: "pending",
      requestTime: new Date().toLocaleString(),
    };

    setEmergencyRequests([newRequest, ...emergencyRequests]);
    updateBloodStock(emergencyForm.bloodGroup, parseInt(emergencyForm.requiredUnits));
    
    setEmergencyForm({ patientName: "", bloodGroup: "", hospital: "", requiredUnits: "", contactPerson: "", contactNumber: "", urgency: "high" });
    setShowEmergencyModal(false);
    showToastMessage(`Emergency request for ${emergencyForm.patientName} submitted successfully!`);
  };

  const handleRequestAction = (requestId, action) => {
    if (action === "fulfill") {
      setEmergencyRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: "fulfilled" } : req
      ));
      showToastMessage("Request marked as fulfilled", "success");
    } else if (action === "cancel") {
      // Return blood units to stock when cancelling pending request
      const request = emergencyRequests.find(req => req.id === requestId);
      if (request && request.status === "pending") {
        setBloodGroups(prev => prev.map(bg => {
          if (bg.type === request.bloodGroup) {
            const newUnits = bg.units + request.requiredUnits;
            let newStatus = bg.status;
            if (newUnits > 15) newStatus = "normal";
            else if (newUnits > 5) newStatus = "low";
            else newStatus = "critical";
            return { ...bg, units: newUnits, status: newStatus };
          }
          return bg;
        }));
      }
      setEmergencyRequests(prev => prev.filter(req => req.id !== requestId));
      showToastMessage("Request cancelled", "info");
    }
  };

  const deleteDonor = (donorId) => {
    setDonors(prev => prev.filter(donor => donor.id !== donorId));
    showToastMessage("Donor removed from database", "info");
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      default: return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
            <div className={`rounded-lg shadow-lg p-4 flex items-center gap-3 border-l-4 ${
              toastType === "success" ? "bg-white dark:bg-gray-800 border-green-500" :
              toastType === "error" ? "bg-white dark:bg-gray-800 border-red-500" :
              "bg-white dark:bg-gray-800 border-blue-500"
            }`}>
              {toastType === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
              {toastType === "error" && <AlertTriangle className="w-5 h-5 text-red-500" />}
              {toastType === "info" && <XCircle className="w-5 h-5 text-blue-500" />}
              <div className="flex-1">
                <p className="text-sm text-foreground">{toastMessage}</p>
              </div>
              <button onClick={() => setShowToast(false)} className="text-muted-foreground hover:text-foreground">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Donor Registration Modal */}
        {showDonorModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowDonorModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 animate-scale-up" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Register New Donor</h3>
                <button onClick={() => setShowDonorModal(false)} className="text-muted-foreground hover:text-foreground">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Full Name *" value={donorForm.name} onChange={e => setDonorForm({...donorForm, name: e.target.value})} className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <select value={donorForm.bloodGroup} onChange={e => setDonorForm({...donorForm, bloodGroup: e.target.value})} className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Select Blood Group *</option>
                  {bloodGroups.map(bg => <option key={bg.type} value={bg.type}>{bg.type}</option>)}
                </select>
                <input type="tel" placeholder="Phone Number *" value={donorForm.phone} onChange={e => setDonorForm({...donorForm, phone: e.target.value})} className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="email" placeholder="Email" value={donorForm.email} onChange={e => setDonorForm({...donorForm, email: e.target.value})} className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="date" placeholder="Last Donation Date" value={donorForm.lastDonation} onChange={e => setDonorForm({...donorForm, lastDonation: e.target.value})} className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleAddDonor} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Register Donor</button>
                <button onClick={() => setShowDonorModal(false)} className="flex-1 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-accent">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Request Modal */}
        {showEmergencyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowEmergencyModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 animate-scale-up" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" /> Emergency Blood Request
                </h3>
                <button onClick={() => setShowEmergencyModal(false)} className="text-muted-foreground hover:text-foreground">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Patient Name *" value={emergencyForm.patientName} onChange={e => setEmergencyForm({...emergencyForm, patientName: e.target.value})} className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <select value={emergencyForm.bloodGroup} onChange={e => setEmergencyForm({...emergencyForm, bloodGroup: e.target.value})} className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Select Blood Group *</option>
                  {bloodGroups.map(bg => <option key={bg.type} value={bg.type}>{bg.type} ({bg.units} units available)</option>)}
                </select>
                <input type="number" placeholder="Required Units *" value={emergencyForm.requiredUnits} onChange={e => setEmergencyForm({...emergencyForm, requiredUnits: e.target.value})} className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="text" placeholder="Hospital Name" value={emergencyForm.hospital} onChange={e => setEmergencyForm({...emergencyForm, hospital: e.target.value})} className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="text" placeholder="Contact Person" value={emergencyForm.contactPerson} onChange={e => setEmergencyForm({...emergencyForm, contactPerson: e.target.value})} className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="tel" placeholder="Contact Number" value={emergencyForm.contactNumber} onChange={e => setEmergencyForm({...emergencyForm, contactNumber: e.target.value})} className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <select value={emergencyForm.urgency} onChange={e => setEmergencyForm({...emergencyForm, urgency: e.target.value})} className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="high">High Urgency</option>
                  <option value="medium">Medium Urgency</option>
                  <option value="low">Low Urgency</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleEmergencyRequest} className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90">Submit Request</button>
                <button onClick={() => setShowEmergencyModal(false)} className="flex-1 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-accent">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">Blood Bank</h1>
            <p className="page-subtitle">Manage blood inventory and requests</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowDonorModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              <UserPlus className="w-4 h-4" /> Register Donor
            </button>
            <button onClick={() => setShowEmergencyModal(true)} className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              <AlertTriangle className="w-4 h-4" /> Emergency Request
            </button>
          </div>
        </div>

        {/* Blood Stock Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {bloodGroups.map((bg) => {
            const style = statusStyles[bg.status];
            return (
              <div key={bg.type} className="stat-card animate-slide-up text-center">
                <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-destructive">{bg.type}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{bg.units}</p>
                <p className="text-xs text-muted-foreground mb-2">units available</p>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                  {bg.status !== "normal" && <AlertTriangle className="w-3 h-3" />}
                  {style.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Donors List */}
        <div className="dashboard-section animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Registered Donors ({donors.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Blood Group</th>
                  <th className="pb-2 font-medium">Phone</th>
                  <th className="pb-2 font-medium">Last Donation</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donors.map(donor => (
                  <tr key={donor.id} className="border-b border-border">
                    <td className="py-3">{donor.name}</td>
                    <td className="py-3"><span className="px-2 py-1 bg-destructive/10 text-destructive rounded text-xs font-semibold">{donor.bloodGroup}</span></td>
                    <td className="py-3">{donor.phone}</td>
                    <td className="py-3">{donor.lastDonation}</td>
                    <td className="py-3">
                      <button onClick={() => deleteDonor(donor.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Emergency Requests */}
        {emergencyRequests.length > 0 && (
          <div className="dashboard-section animate-slide-up">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" /> Emergency Requests ({emergencyRequests.length})
            </h3>
            <div className="space-y-3">
              {emergencyRequests.map(request => (
                <div key={request.id} className="p-4 bg-card border border-border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{request.patientName}</h4>
                      <p className="text-xs text-muted-foreground">Requested: {request.requestTime}</p>
                    </div>
                    <div className="flex gap-2">
                      {request.status === "pending" && (
                        <>
                          <button onClick={() => handleRequestAction(request.id, "fulfill")} className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">Mark Fulfilled</button>
                          <button onClick={() => handleRequestAction(request.id, "cancel")} className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">Cancel</button>
                        </>
                      )}
                      {request.status === "fulfilled" && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs">Fulfilled</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Blood Group:</span> {request.bloodGroup}</div>
                    <div><span className="text-muted-foreground">Units:</span> {request.requiredUnits}</div>
                    <div><span className="text-muted-foreground">Hospital:</span> {request.hospital || "N/A"}</div>
                    <div><span className="text-muted-foreground">Contact:</span> {request.contactNumber || "N/A"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-up { animation: scale-up 0.2s ease-out; }
      `}</style>
    </DashboardLayout>
  );
};

export default BloodBankPage;