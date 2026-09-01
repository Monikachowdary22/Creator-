import { useEffect, useState } from "react";
import { getNotifications } from "../services/api";

function Notifications() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const result = await getNotifications();
        setData(result);
      } catch (err) {
        console.error("Notifications API error:", err);
        setError("Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  if (loading) {
    return <h2>Loading notifications...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const notificationList = Array.isArray(data)
    ? data
    : data?.data || [];

  return (
    <div>
      <h1>Notifications</h1>

      {notificationList.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <div>
          {notificationList.map((notification) => (
            <div key={notification.id}>
              <h3>{notification.title}</h3>

              <p>{notification.message}</p>

              <p>
                Status:{" "}
                {notification.is_read
                  ? "Read"
                  : "Unread"}
              </p>

              <p>
                Type: {notification.notification_type}
              </p>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;