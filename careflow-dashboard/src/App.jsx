import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BedManagementPage from "./pages/BedManagementPage";
import PatientManagementPage from "./pages/PatientManagementPage";
import EmergencyPage from "./pages/EmergencyPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import HospitalFinderPage from "./pages/HospitalFinderPage";
import AppointmentBookingPage from "./pages/AppointmentBookingPage";
import BloodBankPage from "./pages/BloodBankPage";
import PharmacyPage from "./pages/PharmacyPage";
import AmbulancePage from "./pages/AmbulancePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientDetailsPage from "@/pages/PatientDetailsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <Routes>
        <Route path="/patients/:id" element={<PatientDetailsPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/beds" element={<ProtectedRoute><BedManagementPage /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><PatientManagementPage /></ProtectedRoute>} />
        <Route path="/emergency" element={<ProtectedRoute><EmergencyPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/hospital-finder" element={<ProtectedRoute><HospitalFinderPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><AppointmentBookingPage /></ProtectedRoute>} />
        <Route path="/blood-bank" element={<ProtectedRoute><BloodBankPage /></ProtectedRoute>} />
        <Route path="/pharmacy" element={<ProtectedRoute><PharmacyPage /></ProtectedRoute>} />
        <Route path="/ambulance" element={<ProtectedRoute><AmbulancePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;