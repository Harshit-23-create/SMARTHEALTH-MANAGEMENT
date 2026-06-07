import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { TrendingUp, DollarSign, Activity, Users } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const occupancyData = [
  { month: "Jan", rate: 72 }, { month: "Feb", rate: 68 },
  { month: "Mar", rate: 75 }, { month: "Apr", rate: 80 },
  { month: "May", rate: 78 }, { month: "Jun", rate: 82 },
  { month: "Jul", rate: 85 }, { month: "Aug", rate: 79 },
  { month: "Sep", rate: 81 }, { month: "Oct", rate: 88 },
  { month: "Nov", rate: 84 }, { month: "Dec", rate: 90 },
];

const icuData = [
  { day: "Mon", usage: 85 }, { day: "Tue", usage: 78 },
  { day: "Wed", usage: 92 }, { day: "Thu", usage: 88 },
  { day: "Fri", usage: 76 }, { day: "Sat", usage: 70 },
  { day: "Sun", usage: 65 },
];

const admissionTrend = [
  { month: "Jul", admissions: 380 }, { month: "Aug", admissions: 420 },
  { month: "Sep", admissions: 400 }, { month: "Oct", admissions: 460 },
  { month: "Nov", admissions: 440 }, { month: "Dec", admissions: 500 },
];

const predictiveData = [
  { week: "W1", actual: 78, predicted: 80 },
  { week: "W2", actual: 82, predicted: 84 },
  { week: "W3", actual: 85, predicted: 88 },
  { week: "W4", actual: null, predicted: 92 },
  { week: "W5", actual: null, predicted: 95 },
];

const chartStyle = {
  borderRadius: "8px", border: "1px solid hsl(214, 25%, 90%)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)", fontSize: "13px",
};

const AnalyticsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-header">Analytics</h1>
          <p className="page-subtitle">Comprehensive hospital performance insights</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Avg Occupancy" value="82%" icon={Activity} trend="3% vs last month" trendUp variant="info" />
          <StatCard title="Monthly Revenue" value="$2.4M" icon={DollarSign} trend="12% increase" trendUp variant="success" />
          <StatCard title="Total Admissions" value="500" icon={Users} trend="This month" variant="default" />
          <StatCard title="Growth Rate" value="+8.5%" icon={TrendingUp} trend="Year over year" trendUp variant="warning" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="dashboard-section animate-slide-up">
            <h3 className="text-sm font-semibold text-foreground mb-4">Occupancy Rate Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 25%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} />
                <Tooltip contentStyle={chartStyle} />
                <Area type="monotone" dataKey="rate" stroke="hsl(205, 80%, 45%)" fill="hsl(205, 80%, 45%)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-section animate-slide-up">
            <h3 className="text-sm font-semibold text-foreground mb-4">ICU Usage (This Week)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={icuData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 25%, 90%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} />
                <Tooltip contentStyle={chartStyle} />
                <Bar dataKey="usage" fill="hsl(205, 80%, 45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-section animate-slide-up">
            <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Admission Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={admissionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 25%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="admissions" stroke="hsl(145, 65%, 42%)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-section animate-slide-up">
            <h3 className="text-sm font-semibold text-foreground mb-4">Predictive Bed Demand</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={predictiveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 25%, 90%)" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="actual" stroke="hsl(205, 80%, 45%)" strokeWidth={2} dot={{ r: 4 }} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="hsl(38, 92%, 50%)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-section animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { label: "Inpatient Revenue", value: "$1.2M", change: "+8%" },
              { label: "Outpatient Revenue", value: "$680K", change: "+12%" },
              { label: "Lab & Diagnostics", value: "$340K", change: "+5%" },
              { label: "Pharmacy Revenue", value: "$180K", change: "+3%" },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xl font-bold text-foreground mt-1">{item.value}</p>
                <p className="text-xs text-success font-medium mt-1">{item.change} vs last month</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
