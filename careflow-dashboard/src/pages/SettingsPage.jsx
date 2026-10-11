import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import {
  Settings, User, Bell, Shield, Paintbrush, Globe,
  Save, CheckCircle, AlertCircle, Sun, Moon, Laptop, Check
} from "lucide-react";

const SettingsPage = () => {
  const { push } = useNotifications();
  const { t, i18n } = useTranslation();
  const { theme, setTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("Appearance");
  const [saved, setSaved] = useState(false);

  // Read logged in user if available
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const tabs = [
    { id: "Appearance", label: t("settings.appearance"), icon: Paintbrush },
    { id: "Language",   label: t("settings.language"),   icon: Globe },
    { id: "Profile",    label: t("settings.profile"),    icon: User },
    { id: "Notifications", label: t("settings.notifications"), icon: Bell },
    { id: "Security",   label: t("settings.security"),   icon: Shield },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    push("system", "Settings Saved", t("settings.savedSuccess"));
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-900 dark:bg-primary text-white rounded-2xl shadow-sm">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t("settings.title")}</h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("settings.subtitle")}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                  ${activeTab === tab.id 
                    ? "bg-gray-900 dark:bg-primary text-white shadow-md shadow-gray-900/10 dark:shadow-primary/20" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-gray-400 dark:text-gray-500"}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sm:p-8 transition-colors">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              {tabs.find(t => t.id === activeTab)?.label || activeTab}
            </h2>

            {/* ── APPEARANCE TAB ── */}
            {activeTab === "Appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{t("settings.themeMode")}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t("settings.themeDesc")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Light Mode Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`group relative text-left p-4 rounded-2xl border-2 transition-all duration-200
                      ${theme === "light"
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-600/20"
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-800/50"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shadow-sm">
                        <Sun className="w-5 h-5" />
                      </div>
                      {theme === "light" && (
                        <span className="p-1 rounded-full bg-blue-600 text-white">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">{t("common.light")}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {t("settings.themeLightDesc")}
                    </p>
                    {/* Visual UI mini-mockup preview */}
                    <div className="mt-4 p-2 bg-slate-100 rounded-lg border border-slate-200 flex flex-col gap-1.5 opacity-90">
                      <div className="h-2 w-12 bg-blue-500 rounded-full"></div>
                      <div className="h-2 w-full bg-white rounded"></div>
                      <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                    </div>
                  </button>

                  {/* Dark Mode Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`group relative text-left p-4 rounded-2xl border-2 transition-all duration-200
                      ${theme === "dark"
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-600/20"
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-800/50"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-indigo-900/60 text-indigo-300 shadow-sm">
                        <Moon className="w-5 h-5" />
                      </div>
                      {theme === "dark" && (
                        <span className="p-1 rounded-full bg-blue-600 text-white">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">{t("common.dark")}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {t("settings.themeDarkDesc")}
                    </p>
                    {/* Visual UI mini-mockup preview */}
                    <div className="mt-4 p-2 bg-gray-950 rounded-lg border border-gray-800 flex flex-col gap-1.5 opacity-90">
                      <div className="h-2 w-12 bg-blue-500 rounded-full"></div>
                      <div className="h-2 w-full bg-gray-800 rounded"></div>
                      <div className="h-2 w-3/4 bg-gray-900 rounded"></div>
                    </div>
                  </button>

                  {/* System Theme Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`group relative text-left p-4 rounded-2xl border-2 transition-all duration-200
                      ${theme === "system"
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-600/20"
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-800/50"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 shadow-sm">
                        <Laptop className="w-5 h-5" />
                      </div>
                      {theme === "system" && (
                        <span className="p-1 rounded-full bg-blue-600 text-white">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">{t("common.system")}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {t("settings.themeSystemDesc")}
                    </p>
                    {/* Visual UI mini-mockup preview */}
                    <div className="mt-4 p-2 bg-gradient-to-r from-slate-100 to-gray-950 rounded-lg border border-gray-300 dark:border-gray-700 flex flex-col gap-1.5 opacity-90">
                      <div className="h-2 w-12 bg-blue-500 rounded-full"></div>
                      <div className="h-2 w-full bg-white/50 rounded"></div>
                      <div className="h-2 w-3/4 bg-gray-400/30 rounded"></div>
                    </div>
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Current theme active: <strong className="text-gray-900 dark:text-white capitalize">{theme}</strong> ({isDark ? "Dark View" : "Light View"})</span>
                  <button
                    type="button"
                    onClick={() => push("system", "Theme Applied", `Active theme updated to ${theme}`)}
                    className="text-primary hover:underline font-bold"
                  >
                    Confirm theme applied
                  </button>
                </div>
              </div>
            )}

            {/* ── LANGUAGE TAB ── */}
            {activeTab === "Language" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{t("settings.languageSelection")}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t("settings.languageDesc")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* English */}
                  <button
                    type="button"
                    onClick={() => i18n.changeLanguage('en')}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-200
                      ${i18n.language === 'en'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-600/20'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-800/50'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">🇺🇸</span>
                      {i18n.language === 'en' && (
                        <span className="p-1 rounded-full bg-blue-600 text-white">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">English</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">United States / Global</p>
                  </button>

                  {/* Hindi */}
                  <button
                    type="button"
                    onClick={() => i18n.changeLanguage('hi')}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-200
                      ${i18n.language === 'hi'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-600/20'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-800/50'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">🇮🇳</span>
                      {i18n.language === 'hi' && (
                        <span className="p-1 rounded-full bg-blue-600 text-white">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">हिंदी</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hindi (India)</p>
                  </button>

                  {/* Spanish */}
                  <button
                    type="button"
                    onClick={() => i18n.changeLanguage('es')}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-200
                      ${i18n.language === 'es'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-600/20'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-800/50'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">🇪🇸</span>
                      {i18n.language === 'es' && (
                        <span className="p-1 rounded-full bg-blue-600 text-white">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Español</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Spanish (International)</p>
                  </button>
                </div>
              </div>
            )}

            {/* ── PROFILE TAB ── */}
            {activeTab === "Profile" && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-black text-2xl border-4 border-white dark:border-gray-800 shadow-lg">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "DR"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{user.name || "Dr. Administrator"}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.role || "Administrator"}</p>
                    <button type="button" onClick={() => alert("Avatar upload: Please contact your IT administrator to update your profile photo.")} className="mt-2 text-xs font-bold text-primary hover:underline">
                      {t("settings.changeAvatar")}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      {t("settings.fullName")}
                    </label>
                    <input
                      defaultValue={user.name || "Dr. Administrator"}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      {t("settings.emailAddress")}
                    </label>
                    <input
                      defaultValue={user.email || "admin@medicare.com"}
                      type="email"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      {t("settings.phoneNumber")}
                    </label>
                    <input
                      defaultValue="+1-555-0199"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      {t("common.role") || "Role"}
                    </label>
                    <input
                      disabled
                      defaultValue={user.role || "Administrator"}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  {saved ? (
                    <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <CheckCircle className="w-4 h-4 mr-2" /> {t("settings.savedSuccess")}
                    </span>
                  ) : <span />}
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-primary text-white rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-primary/90 transition-transform active:scale-95 shadow-md"
                  >
                    <Save className="w-4 h-4" /> {t("settings.saveChanges")}
                  </button>
                </div>
              </form>
            )}

            {/* ── NOTIFICATIONS & SECURITY ── */}
            {["Notifications", "Security"].includes(activeTab) && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">{activeTab} Policy Active</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      {activeTab === "Notifications"
                        ? "Real-time browser notifications, critical emergency push alerts, and bed turnover alerts are active."
                        : "Two-factor authentication (2FA) is enforced for Administrator and Doctor accounts. Encryption: AES-256."}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {activeTab === "Notifications" ? "Emergency Alarm Push Notifications" : "Enforce Session Auto-Timeout"}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activeTab === "Notifications" ? "Receive immediate auditory & visual alarms for critical patients" : "Automatically lock dashboard after 15 minutes of inactivity"}
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {activeTab === "Notifications" ? "Email Daily Activity Summary" : "JWT Token Refresh Rotation"}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activeTab === "Notifications" ? "Receive end-of-day bed occupancy and admissions breakdown" : "Rotate authorization secrets every 24 hours"}
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-primary text-white rounded-xl font-bold hover:opacity-90 transition text-sm"
                  >
                    <Save className="w-4 h-4" /> {t("settings.saveChanges")}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
