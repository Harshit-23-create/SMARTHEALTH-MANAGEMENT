import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNotifications } from "@/context/NotificationContext";
import { 
  Bed, Users, AlertTriangle, Activity, Heart, 
  TrendingUp, TrendingDown, Calendar, Clock, 
  Ambulance, Stethoscope, Pill, Syringe,
  ArrowUpRight, ArrowDownRight, MoreVertical,
  Download, RefreshCw, Filter, Check, Thermometer
} from "lucide-react";
import { downloadFile } from "@/utils/downloadHelper";
import { 
  LineChart, Line, AreaChart, Area, 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from "recharts";

// Mock Data
const monthlyData = [
  { month: "Jan", patients: 320, admissions: 145, discharges: 132, occupancy: 68 },
  { month: "Feb", patients: 280, admissions: 138, discharges: 141, occupancy: 72 },
  { month: "Mar", patients: 350, admissions: 162, discharges: 158, occupancy: 75 },
  { month: "Apr", patients: 400, admissions: 178, discharges: 169, occupancy: 78 },
  { month: "May", patients: 380, admissions: 165, discharges: 172, occupancy: 76 },
  { month: "Jun", patients: 420, admissions: 185, discharges: 180, occupancy: 80 },
];

const departmentOccupancy = [
  { name: "ICU", beds: 45, occupied: 42, color: "#ef4444" },
  { name: "Cardiology", beds: 60, occupied: 48, color: "#f59e0b" },
  { name: "Orthopedics", beds: 55, occupied: 41, color: "#10b981" },
  { name: "Pediatrics", beds: 40, occupied: 28, color: "#3b82f6" },
  { name: "General", beds: 300, occupied: 231, color: "#8b5cf6" },
];

const staffOnDuty = [
  { name: "Doctors", count: 24, icon: Stethoscope, color: "text-blue-500", bg: "bg-blue-100" },
  { name: "Nurses", count: 68, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-100" },
  { name: "Support", count: 32, icon: Users, color: "text-amber-500", bg: "bg-amber-100" },
];

const upcomingSurgeries = [
  { time: "09:00", patient: "Robert", procedure: "Appendectomy", surgeon: "Dr. Williams", room: "OT-3", status: "Ongoing" },
  { time: "10:30", patient: "Maria", procedure: "C-Section", surgeon: "Dr. Martinez", room: "OT-1", status: "Next" },
  { time: "14:00", patient: "James", procedure: "Knee Replacement", surgeon: "Dr. Smith", room: "OT-2", status: "Scheduled" },
];

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, gradient }) => (
  <div className={`relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br ${gradient} shadow-xl hover:-translate-y-1 transition-transform duration-300`}>
    <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
    <div className="relative z-10 flex justify-between items-start mb-4">
      <div>
        <p className="text-white/80 text-sm font-semibold mb-1">{title}</p>
        <h3 className="text-4xl font-black">{value}</h3>
      </div>
      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="relative z-10 flex items-center justify-between">
      <div className="flex items-center gap-1.5 px-2 py-1 bg-white/20 rounded-lg text-xs font-bold backdrop-blur-sm">
        {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        <span>{trendValue}</span>
      </div>
      <span className="text-xs font-medium text-white/70">{subtitle}</span>
    </div>
  </div>
);

const DashboardPage = () => {
  const { t } = useTranslation();
  const { push } = useNotifications();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsRefreshing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t("dashboard.title")}</h1>
              <p className="text-gray-500 font-medium mt-1">{t("dashboard.subtitle")}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                push("system", "Report Exported", "The dashboard report has been downloaded.");
                downloadFile("dashboard_report.csv", "Metric,Value\nTotal Patients,1284\nAvailable Beds,142\nCritical Cases,28\nActive Staff,124");
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 font-semibold border border-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
            <button onClick={handleRefresh} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-semibold shadow-lg shadow-primary/30 transition-all active:scale-95">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title={t("dashboard.totalPatients")} value="1,284" subtitle="vs last month" 
            icon={Users} trend="up" trendValue="+12.5%" gradient="from-blue-600 to-indigo-600" 
          />
          <StatCard 
            title={t("dashboard.availableBeds")} value="142" subtitle="84% occupancy" 
            icon={Bed} trend="down" trendValue="-3.2%" gradient="from-emerald-500 to-teal-600" 
          />
          <StatCard 
            title={t("dashboard.criticalCases")} value="28" subtitle="Requires attention" 
            icon={AlertTriangle} trend="up" trendValue="+5.1%" gradient="from-rose-500 to-red-600" 
          />
          <StatCard 
            title={t("dashboard.activeStaff")} value="124" subtitle="On current shift" 
            icon={Activity} trend="up" trendValue="+2.4%" gradient="from-amber-500 to-orange-500" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{t("dashboard.patientFlow")}</h3>
                <p className="text-sm text-gray-500 mt-1">Admissions vs Discharges over 6 months</p>
              </div>
              <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDischarges" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '14px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAdmissions)" />
                  <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorDischarges)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Occupancy */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t("dashboard.departmentOccupancy")}</h3>
            <div className="space-y-5">
              {departmentOccupancy.map((dept) => {
                const percentage = Math.round((dept.occupied / dept.beds) * 100);
                return (
                  <div key={dept.name}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-gray-700 text-sm">{dept.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-black" style={{ color: dept.color }}>{percentage}%</span>
                        <span className="text-xs text-gray-500 ml-1">({dept.occupied}/{dept.beds})</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="h-2.5 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${percentage}%`, backgroundColor: dept.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Surgeries */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t("dashboard.upcomingSurgeries")}</h3>
              <button 
                onClick={() => push("system", "Schedule Module", "Opening full surgery schedule view...")}
                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                {t("dashboard.viewFullSchedule")}
              </button>
            </div>
            <div className="space-y-4">
              {upcomingSurgeries.map((surgery, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group">
                  <div className="w-16 flex flex-col items-center justify-center border-r border-gray-100 pr-4">
                    <span className="text-xs text-gray-500 font-bold uppercase">Time</span>
                    <span className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors">{surgery.time}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 text-lg">{surgery.procedure}</h4>
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg
                        ${surgery.status === 'Ongoing' ? 'bg-rose-100 text-rose-600 animate-pulse' : 
                          surgery.status === 'Next' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        {surgery.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Patient: <span className="text-gray-900">{surgery.patient}</span> • {surgery.room}</p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5" /> {surgery.surgeon}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Staff */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t("dashboard.staffOnDuty")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {staffOnDuty.map((staff, i) => (
                <div key={i} className="p-5 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-all">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${staff.bg} ${staff.color}`}>
                    <staff.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-3xl font-black text-gray-900">{staff.count}</h4>
                  <p className="text-sm font-semibold text-gray-500 mt-1">{staff.name}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Current Shift</p>
                <h4 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" /> Morning Shift (08:00 - 16:00)
                </h4>
              </div>
              <button 
                onClick={() => push("system", "Staff Roster", "Opening complete staff roster and shift manager...")}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors backdrop-blur-sm"
              >
                View Roster
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;