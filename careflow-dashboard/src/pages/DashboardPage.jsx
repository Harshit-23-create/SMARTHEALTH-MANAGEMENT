import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { 
  Bed, Users, AlertTriangle, Activity, Heart, 
  TrendingUp, TrendingDown, Calendar, Clock, 
  Ambulance, Stethoscope, Pill, Syringe,
  ArrowUpRight, ArrowDownRight, MoreVertical,
  Download, RefreshCw, Filter
} from "lucide-react";
import { 
  LineChart, Line, AreaChart, Area, 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from "recharts";

// Enhanced data with more metrics
const monthlyData = [
  { month: "Jan", patients: 320, admissions: 145, discharges: 132, occupancy: 68 },
  { month: "Feb", patients: 280, admissions: 138, discharges: 141, occupancy: 72 },
  { month: "Mar", patients: 350, admissions: 162, discharges: 158, occupancy: 75 },
  { month: "Apr", patients: 400, admissions: 178, discharges: 169, occupancy: 78 },
  { month: "May", patients: 380, admissions: 165, discharges: 172, occupancy: 76 },
  { month: "Jun", patients: 420, admissions: 185, discharges: 180, occupancy: 80 },
  { month: "Jul", patients: 390, admissions: 172, discharges: 168, occupancy: 79 },
  { month: "Aug", patients: 450, admissions: 198, discharges: 190, occupancy: 82 },
  { month: "Sep", patients: 410, admissions: 182, discharges: 176, occupancy: 81 },
  { month: "Oct", patients: 470, admissions: 205, discharges: 198, occupancy: 84 },
  { month: "Nov", patients: 440, admissions: 192, discharges: 185, occupancy: 83 },
  { month: "Dec", patients: 500, admissions: 220, discharges: 210, occupancy: 86 },
];

const recentAdmissions = [
  { id: 1, name: "Rakesh", age: 45, disease: "Pneumonia", bed: "ICU-03", date: "2026-02-23", time: "14:30", status: "Critical", doctor: "Dr. Williams", department: "ICU" },
  { id: 2, name: "Suresh", age: 32, disease: "Fracture", bed: "W2-12", date: "2026-02-22", time: "09:15", status: "Stable", doctor: "Dr. Martinez", department: "Ortho" },
  { id: 3, name: "Mukesh", age: 58, disease: "Cardiac", bed: "ICU-07", date: "2026-02-22", time: "16:45", status: "Critical", doctor: "Dr. Thompson", department: "Cardio" },
  { id: 4, name: "Rupesh", age: 27, disease: "Appendicitis", bed: "W1-05", date: "2026-02-21", time: "11:20", status: "Recovering", doctor: "Dr. Garcia", department: "Surgery" },
  
  
];

const departmentOccupancy = [
  { name: "ICU", beds: 45, occupied: 42, color: "#ef4444" },
  { name: "Cardiology", beds: 60, occupied: 48, color: "#f59e0b" },
  { name: "Orthopedics", beds: 55, occupied: 41, color: "#10b981" },
  { name: "Pediatrics", beds: 40, occupied: 28, color: "#3b82f6" },
  { name: "General", beds: 300, occupied: 231, color: "#8b5cf6" },
];

const staffOnDuty = [
  { name: "Doctors", count: 24, icon: Stethoscope, color: "#3b82f6" },
  { name: "Nurses", count: 68, icon: Activity, color: "#10b981" },
  { name: "Support", count: 32, icon: Users, color: "#f59e0b" },
];

const upcomingSurgeries = [
  { time: "09:00", patient: "Robert", procedure: "Appendectomy", surgeon: "Dr. Williams", room: "OT-3" },
  { time: "10:30", patient: "Maria", procedure: "C-Section", surgeon: "Dr. Martinez", room: "OT-1" },
  { time: "13:00", patient: "James Wilson", procedure: "Knee Replacement", surgeon: "Dr. Thompson", room: "OT-2" },
  
];

const statusColors = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  Stable: "bg-green-100 text-green-700 border-green-200",
  Recovering: "bg-blue-100 text-blue-700 border-blue-200",
  "Under Observation": "bg-yellow-100 text-yellow-700 border-yellow-200"
};

const DashboardPage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("monthly");
  const [occupancyRate, setOccupancyRate] = useState(78);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Calculate metrics
  const totalPatients = recentAdmissions.length;
  const avgWaitTime = "12 min";
  const emergencyCases = 3;
  const surgeryCount = 8;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, Dr. Smith • Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setSelectedTimeRange("daily")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedTimeRange === "daily" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setSelectedTimeRange("weekly")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedTimeRange === "weekly" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setSelectedTimeRange("monthly")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedTimeRange === "monthly" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Monthly
              </button>
            </div>
            
            <button 
              onClick={handleRefresh}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12.5%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">156</h3>
            <p className="text-sm text-gray-500 mt-1">Total Patients</p>
            <p className="text-xs text-gray-400 mt-2">↑ 8 from yesterday</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                Average
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{avgWaitTime}</h3>
            <p className="text-sm text-gray-500 mt-1">Avg. Wait Time</p>
            <p className="text-xs text-gray-400 mt-2">↓ 3 min from yesterday</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Ambulance className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Urgent
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{emergencyCases}</h3>
            <p className="text-sm text-gray-500 mt-1">Emergency Cases</p>
            <p className="text-xs text-gray-400 mt-2">↑ 2 from yesterday</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Scheduled
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{surgeryCount}</h3>
            <p className="text-sm text-gray-500 mt-1">Surgeries Today</p>
            <p className="text-xs text-gray-400 mt-2">Next in 45 min</p>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-800">Predicted Bed Shortage Alert</h4>
            <p className="text-sm text-amber-700 mt-1">
              ICU beds expected to reach 95% occupancy by next week. Consider preparing overflow capacity in Ward 3.
            </p>
            <div className="flex gap-3 mt-3">
              <button className="text-xs font-medium text-amber-800 bg-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-300 transition-colors">
                View Details
              </button>
              <button className="text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors">
                Dismiss
              </button>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart - Patient Trends */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Patient Trends</h3>
                <p className="text-sm text-gray-500">Monthly admission and discharge patterns</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  name="Total Patients"
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="admissions" 
                  name="Admissions"
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#10b981" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="discharges" 
                  name="Discharges"
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#f59e0b" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department Occupancy */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Department Occupancy</h3>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {Math.round((departmentOccupancy.reduce((acc, dept) => acc + dept.occupied, 0) / 
                 departmentOccupancy.reduce((acc, dept) => acc + dept.beds, 0)) * 100)}% Full
              </span>
            </div>
            
            <div className="space-y-4">
              {departmentOccupancy.map((dept) => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                    <span className="text-sm text-gray-600">
                      {dept.occupied}/{dept.beds} beds
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(dept.occupied / dept.beds) * 100}%`,
                        backgroundColor: dept.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Staff on Duty</h4>
              <div className="grid grid-cols-3 gap-3">
                {staffOnDuty.map((staff) => (
                  <div key={staff.name} className="text-center">
                    <div className={`inline-flex p-2 rounded-lg mb-2`} style={{ backgroundColor: `${staff.color}20` }}>
                      <staff.icon className="w-4 h-4" style={{ color: staff.color }} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{staff.count}</p>
                    <p className="text-xs text-gray-500">{staff.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Recent Admissions & Upcoming Surgeries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Admissions Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Admissions</h3>
                  <p className="text-sm text-gray-500">Latest patient admissions</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentAdmissions.slice(0, 5).map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{patient.name}</div>
                          <div className="text-xs text-gray-500">{patient.age}y • {patient.disease}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{patient.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{patient.bed}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[patient.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{patient.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Surgeries */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Today's Surgeries</h3>
                  <p className="text-sm text-gray-500">Scheduled operations</p>
                </div>
                <span className="text-sm font-medium text-gray-600">{upcomingSurgeries.length} scheduled</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {upcomingSurgeries.map((surgery, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{surgery.patient}</h4>
                        <p className="text-sm text-gray-500">{surgery.procedure}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{surgery.time}</span>
                  </div>
                  <div className="flex items-center gap-4 ml-13">
                    <span className="text-xs text-gray-500">{surgery.surgeon}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">Room {surgery.room}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Full Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;