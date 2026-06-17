import { useEffect, useState } from "react";
import { fetchNotifications } from "../sevices/api";
import { getTopNotifications } from "../utils/priority";
import NotificationCard from "../components/NotificationCard";

function PriorityInbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [readNotifications, setReadNotifications] =
    useState(
      JSON.parse(
        localStorage.getItem("readNotifications")
      ) || []
    );

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchNotifications();

        const top10 = getTopNotifications(data);

        setNotifications(top10);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const markAsRead = (id) => {
    if (readNotifications.includes(id)) return;

    const updated = [...readNotifications, id];

    setReadNotifications(updated);

    localStorage.setItem(
      "readNotifications",
      JSON.stringify(updated)
    );
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Priority Inbox</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Priority Inbox
      </h1>

      <p style={{ textAlign: "center" }}>
        Top Notifications: {notifications.length}
      </p>

      {notifications.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No notifications found.
        </p>
      ) : (
        notifications.map((item, index) => (
          <NotificationCard
            key={item.ID || index}
            notification={item}
            isRead={readNotifications.includes(
              item.ID
            )}
            onClick={() =>
              markAsRead(item.ID)
            }
          />
        ))
      )}
    </div>
  );
}

export default PriorityInbox;