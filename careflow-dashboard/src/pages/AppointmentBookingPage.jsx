import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, Clock, Video, Search, Star, CheckCircle, XCircle } from "lucide-react";

const doctors = [
  { name: "Dr. Sarah Johnson", specialization: "Cardiologist", rating: 4.9, experience: "15 years", online: true, slots: ["9:00 AM", "10:30 AM", "2:00 PM"] },
  { name: "Dr. Michael Chen", specialization: "Neurologist", rating: 4.7, experience: "12 years", online: true, slots: ["11:00 AM", "3:00 PM", "4:30 PM"] },
  { name: "Dr. Emily Davis", specialization: "Pediatrician", rating: 4.8, experience: "10 years", online: false, slots: ["9:30 AM", "1:00 PM"] },
  { name: "Dr. James Wilson", specialization: "Orthopedic", rating: 4.6, experience: "20 years", online: true, slots: ["10:00 AM", "2:30 PM", "5:00 PM"] },
  { name: "Dr. Lisa Park", specialization: "Dermatologist", rating: 4.5, experience: "8 years", online: false, slots: ["11:30 AM", "3:30 PM"] },
  { name: "Dr. Robert Kim", specialization: "General Medicine", rating: 4.4, experience: "18 years", online: true, slots: ["9:00 AM", "12:00 PM", "4:00 PM"] },
];

const specializations = ["All", "Cardiologist", "Neurologist", "Pediatrician", "Orthopedic", "Dermatologist", "General Medicine"];

const AppointmentBookingPage = () => {
  const [specFilter, setSpecFilter] = useState("All");
  const [selectedSlots, setSelectedSlots] = useState({});
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const filtered = specFilter === "All" ? doctors : doctors.filter((d) => d.specialization === specFilter);

  const handleBookAppointment = (doctor, selectedSlot) => {
    // Check if time slot is selected
    if (!selectedSlot) {
      showToastMessage("Please select a time slot before booking!");
      return;
    }

    // Check if appointment already exists for this doctor and time slot
    const alreadyBooked = bookedAppointments.some(
      (app) => app.doctorName === doctor.name && app.slot === selectedSlot
    );

    if (alreadyBooked) {
      showToastMessage(`You already have an appointment with ${doctor.name} at ${selectedSlot}!`);
      return;
    }

    // Create new appointment
    const newAppointment = {
      id: Date.now(),
      doctorName: doctor.name,
      specialization: doctor.specialization,
      slot: selectedSlot,
      date: new Date().toLocaleDateString(),
      bookingTime: new Date().toLocaleString(),
      status: "confirmed"
    };

    setBookedAppointments([...bookedAppointments, newAppointment]);
    setShowConfirmation(newAppointment);
    
    // Clear the selected slot for this doctor after booking
    setSelectedSlots((prev) => {
      const updated = { ...prev };
      delete updated[doctor.name];
      return updated;
    });

    // Auto-hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(null);
    }, 3000);
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const cancelAppointment = (appointmentId) => {
    setBookedAppointments(bookedAppointments.filter((app) => app.id !== appointmentId));
    showToastMessage("Appointment cancelled successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center gap-3 border-l-4 border-primary">
              <div className="flex-1">
                <p className="text-sm text-foreground">{toastMessage}</p>
              </div>
              <button onClick={() => setShowToast(false)} className="text-muted-foreground hover:text-foreground">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 animate-scale-up">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Appointment Booked!</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p><span className="font-medium">Doctor:</span> {showConfirmation.doctorName}</p>
                  <p><span className="font-medium">Specialization:</span> {showConfirmation.specialization}</p>
                  <p><span className="font-medium">Time:</span> {showConfirmation.slot}</p>
                  <p><span className="font-medium">Date:</span> {showConfirmation.date}</p>
                </div>
                <button
                  onClick={() => setShowConfirmation(null)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <h1 className="page-header">Appointment Booking</h1>
          <p className="page-subtitle">Schedule appointments with our specialists</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {specializations.map((s) => (
            <button
              key={s}
              onClick={() => setSpecFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                specFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, i) => {
            const selectedSlot = selectedSlots[doc.name];
            const isBooked = bookedAppointments.some(app => app.doctorName === doc.name);
            
            return (
              <div key={i} className="stat-card animate-slide-up">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{doc.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-sm">{doc.name}</h3>
                      {doc.online && (
                        <span className="badge-info flex items-center gap-1">
                          <Video className="w-3 h-3" /> Online
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{doc.specialization} • {doc.experience}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-warning fill-warning" />
                      <span className="text-xs font-medium text-foreground">{doc.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Available Slots
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doc.slots.map((slot) => {
                      const isSlotBooked = bookedAppointments.some(
                        (app) => app.doctorName === doc.name && app.slot === slot
                      );
                      
                      return (
                        <button
                          key={slot}
                          onClick={() => {
                            if (!isSlotBooked) {
                              setSelectedSlots((prev) => ({ ...prev, [doc.name]: slot }));
                            }
                          }}
                          disabled={isSlotBooked}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isSlotBooked
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : selectedSlots[doc.name] === slot
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-accent"
                          }`}
                        >
                          {slot} {isSlotBooked && "(Booked)"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => handleBookAppointment(doc, selectedSlot)}
                  className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Appointment
                </button>

                {isBooked && (
                  <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-green-600 dark:text-green-400 text-center">
                      ✓ Appointment booked for {bookedAppointments.find(app => app.doctorName === doc.name)?.slot}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* My Appointments Section */}
        {bookedAppointments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">My Appointments</h2>
            <div className="space-y-3">
              {bookedAppointments.map((appointment) => (
                <div key={appointment.id} className="stat-card flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{appointment.doctorName}</h3>
                      <span className="badge-info text-xs">{appointment.specialization}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {appointment.slot}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {appointment.date}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => cancelAppointment(appointment.id)}
                    className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-up {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-up {
          animation: scale-up 0.2s ease-out;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default AppointmentBookingPage;