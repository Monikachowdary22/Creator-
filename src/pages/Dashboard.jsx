import { useEffect, useState } from "react";
import { getDashboardReport } from "../services/api";
import {
  FileText,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Radio,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getDashboardReport();
        setData(result);
      } catch (err) {
        console.error("Dashboard API error:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  const content = data?.content_performance || {};
  const platforms = data?.platform_comparison || [];

  const cards = [
    {
      title: "Total Content",
      value: content.total_content ?? 0,
      icon: FileText,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Total Views",
      value: content.total_views ?? 0,
      icon: Eye,
      color: "text-cyan-600 bg-cyan-50",
    },
    {
      title: "Total Likes",
      value: content.total_likes ?? 0,
      icon: Heart,
      color: "text-rose-500 bg-rose-50",
    },
    {
      title: "Total Comments",
      value: content.total_comments ?? 0,
      icon: MessageSquare,
      color: "text-blue-500 bg-blue-50",
    },
    {
      title: "Total Shares",
      value: content.total_shares ?? 0,
      icon: Share2,
      color: "text-emerald-500 bg-emerald-50",
    },
    {
      title: "Total Reach",
      value: content.total_reach ?? 0,
      icon: Radio,
      color: "text-amber-500 bg-amber-50",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs flex items-center gap-3.5 hover:border-gray-200 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 truncate">
                  {card.title}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  {Number(card.value).toLocaleString()}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-gray-800">
              Views by Platform
            </h2>
          </div>

          {platforms.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              No platform data available.
            </p>
          ) : (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platforms}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="platform" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={12} />
                  <YAxis tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="total_views" name="Views" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Engagement */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-gray-800">
              Engagement Rate (%)
            </h2>
          </div>

          {platforms.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              No engagement data available.
            </p>
          ) : (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={platforms}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="platform" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={12} />
                  <YAxis tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="engagement_rate"
                    name="Engagement Rate (%)"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Platform Table */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs overflow-hidden">
        <h2 className="text-base font-bold text-gray-800 mb-4">
          Platform Performance Breakdown
        </h2>

        {platforms.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">
            No platform data available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 font-medium bg-gray-50/50">
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Content Count</th>
                  <th className="py-3 px-4">Total Views</th>
                  <th className="py-3 px-4">Total Reach</th>
                  <th className="py-3 px-4">Engagement Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {platforms.map((platform) => (
                  <tr key={platform.platform} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {platform.platform}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {platform.content_count ?? 0}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {Number(platform.total_views ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {Number(platform.total_reach ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                        {platform.engagement_rate ?? 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
