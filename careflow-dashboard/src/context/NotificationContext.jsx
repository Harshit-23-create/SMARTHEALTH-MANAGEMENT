import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

const TYPE_META = {
  emergency:    { color: "bg-red-500",    dot: "bg-red-500",    label: "Emergency"    },
  ambulance:    { color: "bg-amber-500",  dot: "bg-amber-500",  label: "Ambulance"    },
  patient:      { color: "bg-blue-500",   dot: "bg-blue-500",   label: "Patient"      },
  bed:          { color: "bg-purple-500", dot: "bg-purple-500", label: "Beds"         },
  hospital:     { color: "bg-teal-500",   dot: "bg-teal-500",   label: "Hospital"     },
  pharmacy:     { color: "bg-green-500",  dot: "bg-green-500",  label: "Pharmacy"     },
  blood:        { color: "bg-rose-500",   dot: "bg-rose-500",   label: "Blood Bank"   },
  system:       { color: "bg-gray-500",   dot: "bg-gray-500",   label: "System"       },
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "emergency",
      title: "Critical Emergency",
      message: "Patient John Doe — Cardiac Arrest admitted",
      time: new Date(Date.now() - 3 * 60000).toISOString(),
      read: false,
    },
    {
      id: 2,
      type: "bed",
      title: "Bed Shortage Alert",
      message: "ICU beds at 94% occupancy — Ward 3",
      time: new Date(Date.now() - 10 * 60000).toISOString(),
      read: false,
    },
    {
      id: 3,
      type: "ambulance",
      title: "Ambulance Dispatched",
      message: "AMB-003 dispatched to Sector 14",
      time: new Date(Date.now() - 22 * 60000).toISOString(),
      read: true,
    },
  ]);

  const push = useCallback((type, title, message) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        type,
        title,
        message,
        time: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, push, markRead, markAllRead, clearAll, unreadCount, TYPE_META }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
};
