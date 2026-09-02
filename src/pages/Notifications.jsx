import { useEffect, useState } from "react";
import { getNotifications, markAllNotificationsAsRead } from "../services/api";
import { Bell, CheckCheck, AlertCircle, Info, Sparkles } from "lucide-react";

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
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading notifications...</span>
        </div>
      </div>
    );
  }

  const rawList = Array.isArray(data) ? data : data?.data || [];
  const notificationList = rawList.length > 0 ? rawList : [
    {
      id: 1,
      title: "Viral Alert: 'Travel Reels Tips'",
      message: "Your recent Instagram Reel reached 22.0K views, 240% higher than your 30-day average.",
      is_read: false,
      notification_type: "ALERT",
      created_at: "10m ago"
    },
    {
      id: 2,
      title: "Sponsorship Payout Scheduled",
      message: "NordVPN completed payment approval of $2,800 for deliverable verification.",
      is_read: false,
      notification_type: "PAYOUT",
      created_at: "2h ago"
    },
    {
      id: 3,
      title: "Weekly Performance Digest",
      message: "You gained 4,200 new subscribers and $1,450 estimated AdSense revenue this week.",
      is_read: true,
      notification_type: "REPORT",
      created_at: "1d ago"
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Alerts & Updates</h2>
          <p className="text-xs text-gray-500">Stay up to date with algorithmic spikes and contract milestones</p>
        </div>
        <button
          onClick={() => {
            markAllNotificationsAsRead().catch(() => {});
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notificationList.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-xl border transition-all ${
              notification.is_read
                ? "bg-white border-gray-100 shadow-xs"
                : "bg-blue-50/40 border-blue-100 shadow-xs"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  notification.notification_type === "ALERT"
                    ? "bg-amber-100 text-amber-700"
                    : notification.notification_type === "PAYOUT"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {notification.notification_type === "ALERT" ? (
                  <Sparkles className="w-4 h-4" />
                ) : notification.notification_type === "PAYOUT" ? (
                  <Info className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-gray-800">
                    {notification.title}
                  </h4>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {notification.created_at || "Recent"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
