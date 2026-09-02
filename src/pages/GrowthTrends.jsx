import { useEffect, useState } from "react";
import { getGrowthReport } from "../services/api";
import { TrendingUp, UserPlus, Eye, Flame } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function GrowthTrends() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGrowth = async () => {
      try {
        const result = await getGrowthReport();
        setData(result);
      } catch (err) {
        console.error("Growth API error:", err);
        setError("Unable to load growth trends.");
      } finally {
        setLoading(false);
      }
    };

    loadGrowth();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading growth trends...</span>
        </div>
      </div>
    );
  }

  const chartData = [
    { month: "Jan", followers: 42000, views: 180000 },
    { month: "Feb", followers: 56000, views: 240000 },
    { month: "Mar", followers: 69000, views: 320000 },
    { month: "Apr", followers: 85000, views: 410000 },
    { month: "May", followers: 104000, views: 560000 },
    { month: "Jun", followers: 124500, views: 780000 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Net Followers Growth
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">+24.5%</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Views Velocity
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">+39.2%</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Viral Coefficient
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">1.42x</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Projected 30-Day
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">150K</h3>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-gray-800 mb-4">
          Follower & Viewership Trajectory
        </h2>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={12} />
              <YAxis tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="views" name="Monthly Views" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default GrowthTrends;
