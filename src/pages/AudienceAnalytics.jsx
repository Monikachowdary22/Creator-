import { useEffect, useState } from "react";
import { getAudienceReport } from "../services/api";
import { Users, Globe2, UserCheck, Activity } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function AudienceAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAudience = async () => {
      try {
        const result = await getAudienceReport();
        setData(result);
      } catch (err) {
        console.error("Audience API error:", err);
        setError("Unable to load audience analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadAudience();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading audience analytics...</span>
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

  const report = data || {};

  const ageData = [
    { name: "18-24", value: 38, color: "#2563eb" },
    { name: "25-34", value: 44, color: "#3b82f6" },
    { name: "35-44", value: 12, color: "#60a5fa" },
    { name: "45+", value: 6, color: "#93c5fd" },
  ];

  const genderData = [
    { name: "Female", value: 58, color: "#ec4899" },
    { name: "Male", value: 39, color: "#2563eb" },
    { name: "Other", value: 3, color: "#a855f7" },
  ];

  const topLocations = [
    { country: "United States", pct: "34%" },
    { country: "India", pct: "22%" },
    { country: "United Kingdom", pct: "14%" },
    { country: "Canada", pct: "9%" },
    { country: "Germany", pct: "6%" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Audience
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
              {Number(report.total_records || 124500).toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active Followers
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">88.4%</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Engagement Peak
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">6:00 PM</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Top Region
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">North America</h3>
          </div>
        </div>
      </div>

      {/* Demographics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            Age Distribution
          </h2>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={12} />
                <YAxis tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={12} unit="%" />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            Gender Split
          </h2>
          <div className="w-full h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs text-gray-600 mt-2">
            {genderData.map((g) => (
              <span key={g.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }}></span>
                {g.name}: {g.value}%
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-800 mb-4">
              Top Locations
            </h2>
            <div className="space-y-3">
              {topLocations.map((loc) => (
                <div key={loc.country} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">{loc.country}</span>
                  <span className="text-gray-500 font-semibold">{loc.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudienceAnalytics;
