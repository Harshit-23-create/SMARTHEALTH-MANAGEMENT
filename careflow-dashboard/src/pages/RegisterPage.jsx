import { useState } from "react";
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
  User,
  Globe,
  Sun,
  Moon
} from "lucide-react";
import hospitalBg from "@/assets/hospital-bg.jpg";

const roles = [
  { value: "Admin", label: "Admin", icon: Shield, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950/40", textColor: "text-purple-700 dark:text-purple-300", borderColor: "border-purple-200 dark:border-purple-800" },
  { value: "Doctor", label: "Doctor", icon: Activity, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/40", textColor: "text-blue-700 dark:text-blue-300", borderColor: "border-blue-200 dark:border-blue-800" },
  { value: "Nurse", label: "Nurse", icon: Users, color: "from-green-500 to-green-600", bgColor: "bg-green-50 dark:bg-green-950/40", textColor: "text-green-700 dark:text-green-300", borderColor: "border-green-200 dark:border-green-800" },
  { value: "Receptionist", label: "Receptionist", icon: Clock, color: "from-amber-500 to-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950/40", textColor: "text-amber-700 dark:text-amber-300", borderColor: "border-amber-200 dark:border-amber-800" }
];

const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [selectedRoleData, setSelectedRoleData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Full name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!role) {
      setRoleError("Please select a role");
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
          role
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setRegisterSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Register Error:", error);
      setRegisterError(error.message || "Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Join the Hospital Management System
            </h1>
            
            <p className="text-lg text-white/90 leading-relaxed font-normal">
              Register a staff account to access patient charts, monitor bed availability in real time, and coordinate clinical care.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: "Active Hospitals", value: "500+", icon: Hospital },
                { label: "Staff Members", value: "10,000+", icon: Users },
                { label: "Uptime SLA", value: "99.9%", icon: CheckCircle },
                { label: "Live Telemetry", value: "Always On", icon: Clock }
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

          <div className="text-white/60 text-xs">
            © 2026 MediCare Pro HMS. Enterprise Edition.
          </div>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10 transition-colors">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">Create Account</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Register a new profile to access the dashboard
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3.5 top-3.5 w-4 h-4 ${nameError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Dr. John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError("");
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border ${nameError ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition text-sm`}
                  />
                </div>
                {nameError && (
                  <p className="text-xs text-red-500 mt-1">{nameError}</p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Select Your Role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoleOpen(!roleOpen)}
                    className={`w-full border ${roleError ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition ${selectedRoleData ? selectedRoleData.bgColor : ''}`}
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
                          <span className="text-sm text-gray-400">Choose your role</span>
                        </>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-3.5 w-4 h-4 ${emailError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border ${emailError ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition text-sm`}
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-500 mt-1">{emailError}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-3.5 w-4 h-4 ${passwordError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className={`w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border ${passwordError ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition text-sm`}
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

              {/* Errors/Success */}
              {registerError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{registerError}</p>
                </div>
              )}

              {registerSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Registration successful! Redirecting to login...</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 transition shadow-lg shadow-blue-500/20 disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  <span>Create Staff Account</span>
                )}
              </button>

              <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition"
                >
                  Sign In Here
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
