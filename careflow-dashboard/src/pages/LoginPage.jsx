import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "@/utils/api";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import {
  Heart,
  Mail,
  Lock,
  ChevronDown,
  Eye,
  EyeOff,
  Shield,
  Activity,
  Users,
  Clock,
  Hospital,
  CheckCircle,
  Zap,
  Globe,
  Sun,
  Moon,
  Sparkles,
  ArrowRight
} from "lucide-react";
import hospitalBg from "@/assets/hospital-bg.jpg";

const demoAccounts = [
  {
    role: "Admin",
    titleKey: "login.adminRole",
    descKey: "login.adminDesc",
    email: "admin@medicare.com",
    name: "Dr. Admin Alex",
    password: "password123",
    icon: Shield,
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    gradient: "from-purple-600 to-indigo-600",
  },
  {
    role: "Doctor",
    titleKey: "login.doctorRole",
    descKey: "login.doctorDesc",
    email: "doctor@medicare.com",
    name: "Dr. John Smith",
    password: "password123",
    icon: Activity,
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    role: "Nurse",
    titleKey: "login.nurseRole",
    descKey: "login.nurseDesc",
    email: "nurse@medicare.com",
    name: "Nurse Sarah Lee",
    password: "password123",
    icon: Users,
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    role: "Receptionist",
    titleKey: "login.receptionRole",
    descKey: "login.receptionDesc",
    email: "reception@medicare.com",
    name: "Desk Officer Priya",
    password: "password123",
    icon: Clock,
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    gradient: "from-amber-500 to-orange-600",
  },
];

const roles = [
  { value: "Admin", label: "Admin", icon: Shield, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950/40", textColor: "text-purple-700 dark:text-purple-300", borderColor: "border-purple-200 dark:border-purple-800" },
  { value: "Doctor", label: "Doctor", icon: Activity, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/40", textColor: "text-blue-700 dark:text-blue-300", borderColor: "border-blue-200 dark:border-blue-800" },
  { value: "Nurse", label: "Nurse", icon: Users, color: "from-green-500 to-green-600", bgColor: "bg-green-50 dark:bg-green-950/40", textColor: "text-green-700 dark:text-green-300", borderColor: "border-green-200 dark:border-green-800" },
  { value: "Receptionist", label: "Receptionist", icon: Clock, color: "from-amber-500 to-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950/40", textColor: "text-amber-700 dark:text-amber-300", borderColor: "border-amber-200 dark:border-amber-800" }
];

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [selectedRoleData, setSelectedRoleData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [langOpen, setLangOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    let isValid = true;

    if (!role) {
      setRoleError(t("login.selectRole"));
      isValid = false;
    } else {
      setRoleError("");
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const executeSuccessfulLogin = (userData, token) => {
    localStorage.setItem("token", token || `demo-jwt-token-${Date.now()}`);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("user", JSON.stringify(userData));

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", userData.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    navigate("/dashboard");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If credentials match standard demo accounts and backend returned error (or offline), allow graceful fallback
        const matchingDemo = demoAccounts.find(
          (d) => d.email.toLowerCase() === email.toLowerCase().trim() && d.password === password
        );
        if (matchingDemo) {
          executeSuccessfulLogin({
            id: `demo-${matchingDemo.role.toLowerCase()}`,
            name: matchingDemo.name,
            email: matchingDemo.email,
            role: matchingDemo.role,
          });
          return;
        }
        throw new Error(data.message || "Login failed");
      }

      executeSuccessfulLogin(data.user, data.token);
    } catch (error) {
      console.error("Login Error:", error);
      // Fallback for demo users if backend is unreachable
      const matchingDemo = demoAccounts.find(
        (d) => d.email.toLowerCase() === email.toLowerCase().trim() && d.password === password
      );
      if (matchingDemo) {
        executeSuccessfulLogin({
          id: `demo-${matchingDemo.role.toLowerCase()}`,
          name: matchingDemo.name,
          email: matchingDemo.email,
          role: matchingDemo.role,
        });
        return;
      }
      setLoginError(error.message || "Unable to connect to server. Please try again or use Quick Demo Login.");
    } finally {
      setIsLoading(false);
    }
  };

  // Instant 1-Click Demo Login handler
  const handleInstantDemoLogin = async (demo) => {
    setIsLoading(true);
    setLoginError("");
    const roleObj = roles.find((r) => r.value === demo.role);
    if (roleObj) {
      setRole(roleObj.value);
      setSelectedRoleData(roleObj);
    }
    setEmail(demo.email);
    setPassword(demo.password);

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: demo.email,
          password: demo.password,
          role: demo.role,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        executeSuccessfulLogin(data.user, data.token);
        return;
      }
    } catch (err) {
      console.warn("Backend unavailable during demo login, using fallback:", err);
    }

    // Direct fallback login for demo accounts
    executeSuccessfulLogin({
      id: `demo-${demo.role.toLowerCase()}`,
      name: demo.name,
      email: demo.email,
      role: demo.role,
    });
    setIsLoading(false);
  };

  const handleAutofillDemo = (demo, e) => {
    e.stopPropagation();
    setEmail(demo.email);
    setPassword(demo.password);
    setRole(demo.role);
    const roleObj = roles.find((r) => r.value === demo.role);
    if (roleObj) setSelectedRoleData(roleObj);
    setEmailError("");
    setPasswordError("");
    setRoleError("");
    setLoginError("");
  };

  const handleRoleSelect = (r) => {
    setRole(r.value);
    setSelectedRoleData(r);
    setRoleOpen(false);
    setRoleError("");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Top right language & theme toggle controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{i18n.language.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
          {langOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden py-1 z-50">
              <button
                onClick={() => { i18n.changeLanguage("en"); setLangOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs transition ${i18n.language === "en" ? "font-bold text-primary bg-primary/10" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                🇺🇸 English
              </button>
              <button
                onClick={() => { i18n.changeLanguage("hi"); setLangOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs transition ${i18n.language === "hi" ? "font-bold text-primary bg-primary/10" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                🇮🇳 हिंदी (Hindi)
              </button>
              <button
                onClick={() => { i18n.changeLanguage("es"); setLangOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs transition ${i18n.language === "es" ? "font-bold text-primary bg-primary/10" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                🇪🇸 Español
              </button>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* Left side - Hospital branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 opacity-95"></div>
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url(${hospitalBg})` }}
        ></div>

        <div className="relative z-10 flex flex-col justify-between p-16 text-white w-full">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-3xl font-extrabold tracking-tight">MediCare Pro</span>
              <p className="text-xs text-white/70 font-medium">Smart Healthcare Management</p>
            </div>
          </div>

          <div className="space-y-6 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Version 2.0 • Live Enterprise Platform</span>
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Hospital Operations Reimagined
            </h1>

            <p className="text-lg text-white/90 leading-relaxed font-normal">
              Unified digital management for patients, ICU bed occupancy, emergency triage, and real-time ambulance telematics.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: "Active Hospitals", value: "500+", icon: Hospital },
                { label: "Patients Served", value: "100k+", icon: Users },
                { label: "Fleet Telemetry", value: "99.9%", icon: CheckCircle },
                { label: "Emergency Response", value: "< 8 min", icon: Clock },
              ].map((stat, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-xs text-white/80">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-white/60 text-xs flex justify-between items-center border-t border-white/10 pt-4">
            <span>© 2026 MediCare Pro HMS. Enterprise Edition.</span>
            <span className="text-emerald-300 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              All Services Operational
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Login form & Demo Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-xl py-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
            <div className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-md">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediCare HMS
            </span>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10 transition-colors">
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {t("login.welcomeTitle")}
              </h2>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                {t("login.welcomeSubtitle")}
              </p>
            </div>

            {/* 🚀 PROMINENT 1-CLICK DEMO LOGIN SECTION */}
            <div className="mb-8 p-5 bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-purple-50/80 dark:from-gray-800/80 dark:via-gray-800/50 dark:to-gray-800/90 rounded-2xl border border-blue-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-sm">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                    {t("login.demoTitle")}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                  1-Click Access
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 font-normal">
                {t("login.demoSubtitle")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {demoAccounts.map((demo) => {
                  const DemoIcon = demo.icon;
                  return (
                    <div
                      key={demo.role}
                      className="group flex flex-col justify-between p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${demo.badgeColor}`}>
                            <DemoIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-900 dark:text-white block">
                              {t(demo.titleKey)}
                            </span>
                            <span className="text-[10px] text-gray-400 block truncate max-w-[130px]">
                              {demo.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <button
                          type="button"
                          onClick={() => handleInstantDemoLogin(demo)}
                          disabled={isLoading}
                          className="flex-1 text-center py-1.5 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-1"
                        >
                          <span>{t("login.loginAs")}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleAutofillDemo(demo, e)}
                          title="Autofill form fields"
                          className="px-2 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-[11px] font-semibold transition"
                        >
                          {t("login.autofillBtn")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Standard Login Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-gray-200 dark:border-gray-800 w-full"></div>
              <span className="bg-white dark:bg-gray-900 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Or Sign In With Credentials
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  {t("login.selectRole")}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoleOpen(!roleOpen)}
                    className={`w-full border ${roleError ? "border-red-400" : "border-gray-200 dark:border-gray-700"} rounded-xl px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition duration-200 ${selectedRoleData ? selectedRoleData.bgColor : ""}`}
                  >
                    <div className="flex items-center space-x-3">
                      {selectedRoleData ? (
                        <>
                          <div className={`p-1.5 rounded-lg ${selectedRoleData.bgColor}`}>
                            <selectedRoleData.icon className={`w-4 h-4 ${selectedRoleData.textColor}`} />
                          </div>
                          <span className={`font-semibold text-sm ${selectedRoleData.textColor}`}>
                            {selectedRoleData.label}
                          </span>
                        </>
                      ) : (
                        <>
                          <Hospital className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">{t("login.chooseRole")}</span>
                        </>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${roleOpen ? "rotate-180" : ""}`} />
                  </button>

                  {roleOpen && (
                    <div className="absolute w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl mt-2 z-30 shadow-2xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                      {roles.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => handleRoleSelect(r)}
                          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
                        >
                          <div className={`p-2 rounded-lg ${r.bgColor}`}>
                            <r.icon className={`w-4 h-4 ${r.textColor}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm text-gray-900 dark:text-white">{r.label}</div>
                            <div className="text-xs text-gray-400">Access as {r.label}</div>
                          </div>
                          {role === r.value && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {roleError && (
                  <p className="text-xs text-red-500 mt-1">{roleError}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  {t("login.emailAddress")}
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-3.5 w-4 h-4 ${emailError ? "text-red-400" : "text-gray-400"}`} />
                  <input
                    type="email"
                    placeholder="doctor@medicare.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border ${emailError ? "border-red-400 focus:ring-red-200" : "border-gray-200 dark:border-gray-700 focus:ring-blue-200 dark:focus:ring-blue-900"} rounded-xl focus:outline-none focus:ring-4 transition text-sm`}
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-500 mt-1">{emailError}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    {t("login.password")}
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Demo Password: password123. For live system reset, contact admin@medicare.com")}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    {t("login.forgotPassword")}
                  </button>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-3.5 w-4 h-4 ${passwordError ? "text-red-400" : "text-gray-400"}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className={`w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border ${passwordError ? "border-red-400 focus:ring-red-200" : "border-gray-200 dark:border-gray-700 focus:ring-blue-200 dark:focus:ring-blue-900"} rounded-xl focus:outline-none focus:ring-4 transition text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {t("login.rememberMe")}
                  </span>
                </label>
              </div>

              {/* Inline Login Error */}
              {loginError && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{loginError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 transition shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t("login.signingIn")}</span>
                  </>
                ) : (
                  <span>{t("login.signIn")}</span>
                )}
              </button>

              <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
                {t("login.dontHaveAccount")}{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition"
                >
                  {t("login.registerHere")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;