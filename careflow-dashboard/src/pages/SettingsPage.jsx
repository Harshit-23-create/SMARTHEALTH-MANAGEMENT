import DashboardLayout from "@/components/DashboardLayout";
import { Settings as SettingsIcon } from "lucide-react";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-header">Settings</h1>
          <p className="page-subtitle">Manage system preferences and configurations</p>
        </div>
        <div className="dashboard-section animate-slide-up flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <SettingsIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Settings page</p>
            <p className="text-xs mt-1">System configuration options will appear here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
