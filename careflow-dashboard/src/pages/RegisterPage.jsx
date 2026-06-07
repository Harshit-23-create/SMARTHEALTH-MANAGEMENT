import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "@/utils/api";
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
  User
} from "lucide-react";
import hospitalBg from "@/assets/hospital-bg.jpg";

const roles = [
  { value: "Admin", label: "Admin", icon: Shield, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50", textColor: "text-purple-700", borderColor: "border-purple-200" },
  { value: "Doctor", label: "Doctor", icon: Activity, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" },
  { value: "Nurse", label: "Nurse", icon: Users, color: "from-green-500 to-green-600", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200" },
  { value: "Receptionist", label: "Receptionist", icon: Clock, color: "from-amber-500 to-amber-600", bgColor: "bg-amber-50", textColor: "text-amber-700", borderColor: "border-amber-200" }
];

const RegisterPage = () => {
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

      alert("User registered successfully! Redirecting to login... ✅");
      navigate("/login");

    } catch (error) {
      console.error("Register Error:", error);
      alert(error.message || "Unable to register. Please try again.");
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
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Left side - Hospital branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url(${hospitalBg})` }}
        ></div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Heart className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold">MediCare Pro</span>
          </div>

          <div className="space-y-8">
            <h1 className="text-5xl font-bold leading-tight">
              Join the Hospital Management System
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed">
              Create an account to gain portal access and start coordinating patient care operations seamlessly.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-8">
              {[
                { label: "Active Users", value: "10,000+", icon: Users },
                { label: "Hospitals", value: "500+", icon: Hospital },
                { label: "Success Rate", value: "99.9%", icon: CheckCircle },
                { label: "Support 24/7", value: "Always", icon: Clock }
              ].map((stat, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-white/60 text-sm">
            © 2024 MediCare Pro. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediCare HMS
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-500">
                Register a new profile to access the dashboard
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-3.5 w-5 h-5 ${nameError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Dr. John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError("");
                    }}
                    className={`w-full pl-10 pr-4 py-3.5 border ${nameError ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'} rounded-xl focus:outline-none focus:ring-4 transition-all duration-200`}
                  />
                </div>
                {nameError && (
                  <p className="text-sm text-red-500 mt-1">{nameError}</p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Select Your Role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoleOpen(!roleOpen)}
                    className={`w-full border ${roleError ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 flex items-center justify-between bg-white hover:border-gray-300 transition-all duration-200 ${selectedRoleData ? selectedRoleData.bgColor : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      {selectedRoleData ? (
                        <>
                          <div className={`p-2 rounded-lg ${selectedRoleData.bgColor}`}>
                            <selectedRoleData.icon className={`w-5 h-5 ${selectedRoleData.textColor}`} />
                          </div>
                          <span className={`font-medium ${selectedRoleData.textColor}`}>
                            {selectedRoleData.label}
                          </span>
                        </>
                      ) : (
                        <>
                          <Hospital className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-500">Choose your role</span>
                        </>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${roleOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {roleOpen && (
                    <div className="absolute w-full bg-white border border-gray-200 rounded-xl mt-2 z-20 shadow-lg overflow-hidden">
                      {roles.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => handleRoleSelect(r)}
                          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-0"
                        >
                          <div className={`p-2 rounded-lg ${r.bgColor}`}>
                            <r.icon className={`w-5 h-5 ${r.textColor}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900">{r.label}</div>
                            <div className="text-sm text-gray-500">Register as {r.label}</div>
                          </div>
                          {role === r.value && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {roleError && (
                  <p className="text-sm text-red-500 mt-1">{roleError}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-3.5 w-5 h-5 ${emailError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    placeholder="doctor@medicare.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    className={`w-full pl-10 pr-4 py-3.5 border ${emailError ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'} rounded-xl focus:outline-none focus:ring-4 transition-all duration-200`}
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-red-500 mt-1">{emailError}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3.5 w-5 h-5 ${passwordError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Choose password (min 6 chars)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className={`w-full pl-10 pr-12 py-3.5 border ${passwordError ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'} rounded-xl focus:outline-none focus:ring-4 transition-all duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-4"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  <span>Register</span>
                )}
              </button>

              <div className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign In
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
