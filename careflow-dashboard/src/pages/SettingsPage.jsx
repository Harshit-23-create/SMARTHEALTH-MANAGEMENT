import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import { useTranslation } from "react-i18next";
import {
  Settings, User, Bell, Shield, Paintbrush, Globe,
  Save, CheckCircle, AlertCircle
} from "lucide-react";

const SettingsPage = () => {
  const { push } = useNotifications();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("Profile");
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: "Profile", icon: User },
    { id: "Notifications", icon: Bell },
    { id: "Appearance", icon: Paintbrush },
    { id: "Language", icon: Globe },
    { id: "Security", icon: Shield },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    push("system", "Settings Saved", "Your account settings have been successfully updated.");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-900 rounded-2xl">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{t("nav.settings")}</h1>
            <p className="text-sm font-medium text-gray-500">Manage your account preferences</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                  ${activeTab === tab.id 
                    ? "bg-gray-900 text-white shadow-lg" 
                    : "text-gray-500 hover:bg-white hover:text-gray-900"}`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-gray-400"}`} />
                {tab.id}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">{activeTab} Settings</h2>

            {activeTab === "Language" && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-500 mb-4">Choose your preferred dashboard language.</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => i18n.changeLanguage('en')} className={`p-4 rounded-2xl border-2 transition-all ${i18n.language === 'en' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 hover:border-gray-200 text-gray-500'}`}>
                    <h3 className="font-bold text-lg mb-1">English</h3>
                    <p className="text-xs">United States</p>
                  </button>
                  <button onClick={() => i18n.changeLanguage('hi')} className={`p-4 rounded-2xl border-2 transition-all ${i18n.language === 'hi' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 hover:border-gray-200 text-gray-500'}`}>
                    <h3 className="font-bold text-lg mb-1">हिंदी</h3>
                    <p className="text-xs">Hindi</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Profile" && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-2xl border-4 border-white shadow-lg">
                    DA
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Dr. Admin</h3>
                    <p className="text-sm text-gray-500">Administrator</p>
                    <button type="button" onClick={() => alert("Avatar upload coming soon! Please contact admin to update your profile picture.")} className="mt-2 text-xs font-bold text-primary hover:underline">Change Avatar</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input defaultValue="Dr. Admin" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input defaultValue="admin@medicare.com" type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                    <input defaultValue="+1-555-0199" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Role</label>
                    <input disabled defaultValue="Administrator" className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-400 cursor-not-allowed" />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  {saved ? (
                    <span className="flex items-center text-emerald-600 font-bold text-sm">
                      <CheckCircle className="w-4 h-4 mr-2" /> Settings saved!
                    </span>
                  ) : <span />}
                  <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-transform active:scale-95">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            )}

            {["Notifications", "Appearance", "Security"].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Module Under Construction</h3>
                <p className="text-sm text-gray-500 max-w-xs mt-2">The {activeTab} settings are currently being upgraded in our new premium UI system.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
