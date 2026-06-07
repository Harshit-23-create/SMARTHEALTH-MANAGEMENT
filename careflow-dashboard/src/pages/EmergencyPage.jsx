import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { AlertTriangle, Truck, MapPin, Clock, Phone } from "lucide-react";
import LiveMap from "@/components/LiveMap";

const EmergencyPage = () => {
  const [priority, setPriority] = useState("High");
  const priorities = ["Low", "Medium", "High", "Critical"];

  const priorityColor = {
    Low: "badge-success",
    Medium: "badge-info",
    High: "badge-warning",
    Critical: "badge-critical",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-header">Emergency</h1>
          <p className="page-subtitle">
            Handle emergency requests and ambulance dispatch
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Form */}
          <div className="dashboard-section">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Emergency Bed Request
            </h3>

            <form className="space-y-4">
              <input
                placeholder="Patient Name"
                className="w-full p-2 border rounded-lg"
              />
              <input
                placeholder="Condition"
                className="w-full p-2 border rounded-lg"
              />

              <div className="flex gap-2 flex-wrap">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1 rounded-lg ${
                      priority === p
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button className="w-full py-2 bg-red-600 text-white rounded-lg">
                Submit Emergency Request
              </button>
            </form>
          </div>

          {/* Ambulance */}
          <div className="dashboard-section">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              Request Ambulance
            </h3>

            <input
              placeholder="Pickup location"
              className="w-full p-2 border rounded-lg mb-2"
            />
            <input
              placeholder="Contact number"
              className="w-full p-2 border rounded-lg mb-2"
            />

            <button className="w-full py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Dispatch Ambulance
            </button>
          </div>
        </div>

        {/* Live Map Section */}
        <div className="dashboard-section">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Live Ambulance Tracking
          </h3>

          <LiveMap />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmergencyPage;