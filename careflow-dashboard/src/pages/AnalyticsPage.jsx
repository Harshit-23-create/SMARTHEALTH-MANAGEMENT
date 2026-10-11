import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import { useTranslation } from "react-i18next";
import {
  BarChart3, TrendingUp,
  Download, Calendar, ChevronDown, PieChart as PieChartIcon
} from "lucide-react";
import { downloadFile } from "@/utils/downloadHelper";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 125000, expenses: 85000 },
  { month: "Feb", revenue: 132000, expenses: 88000 },
  { month: "Mar", revenue: 145000, expenses: 92000 },
  { month: "Apr", revenue: 158000, expenses: 95000 },
  { month: "May", revenue: 152000, expenses: 94000 },
  { month: "Jun", revenue: 168000, expenses: 98000 },
];

const departmentPerformance = [
  { name: "Cardiology", patients: 1240, revenue: 450000 },
  { name: "Orthopedics", patients: 980, revenue: 320000 },
  { name: "Pediatrics", patients: 1560, revenue: 280000 },
  { name: "Neurology", patients: 850, revenue: 380000 },
  { name: "General", patients: 3200, revenue: 520000 },
];

const patientDemographics = [
  { name: "0-18 Years", value: 25, color: "#3b82f6" },
  { name: "19-35 Years", value: 35, color: "#10b981" },
  { name: "36-60 Years", value: 25, color: "#f59e0b" },
  { name: "60+ Years", value: 15, color: "#8b5cf6" },
];

const KPICard = ({ title, value, subtitle, trend, isPositive }) => (
  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all">
    <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">{title}</p>
    <div className="flex items-end gap-3 mb-2">
      <h3 className="text-3xl font-black text-gray-900 dark:text-white">{value}</h3>
      <span className={`flex items-center text-xs font-bold mb-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1 rotate-180" />}
        {trend}
      </span>
    </div>
    <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
  </div>
);

const AnalyticsPage = () => {
  const { t } = useTranslation();
  const { push } = useNotifications();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t("analytics.title")}</h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("analytics.subtitle")}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold transition-colors shadow-sm text-sm">
              <Calendar className="w-4 h-4" /> This Year <ChevronDown className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                push("system", "Report Exported", "The analytics report has been downloaded.");
                downloadFile("analytics_report.csv", "Metric,Value\nTotal Revenue,$880.5K\nTotal Expenses,$543.0K\nPatient Volume,12450");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-primary text-white rounded-xl hover:bg-gray-800 dark:hover:bg-primary/90 font-bold shadow-lg shadow-gray-200 dark:shadow-none transition-transform active:scale-95 text-sm"
            >
              <Download className="w-4 h-4" /> {t("analytics.exportReport")}
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title={t("analytics.totalRevenue")} value="$880.5K" trend="+12.5%" isPositive={true} subtitle="Compared to last year" />
          <KPICard title="Total Expenses" value="$543.0K" trend="+4.2%" isPositive={false} subtitle="Compared to last year" />
          <KPICard title="Patient Volume" value="12,450" trend="+18.1%" isPositive={true} subtitle="New and returning patients" />
          <KPICard title={t("analytics.avgStay")} value="3.2 Days" trend="-0.5%" isPositive={true} subtitle="Clinical efficiency" />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">{t("analytics.financialOverview")}</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b22" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1e293b', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={3} fill="url(#colorExp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-gray-400" /> {t("analytics.patientDemographics")}</h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={patientDemographics} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {patientDemographics.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {patientDemographics.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">{d.name}</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{d.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">{t("analytics.departmentPerformance")}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b22" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1e293b', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', fontWeight: 'bold' }} cursor={{fill: '#ffffff10'}} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar yAxisId="right" dataKey="patients" name="Patients Treated" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
