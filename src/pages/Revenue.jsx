import { useEffect, useState } from "react";
import { getRevenueReport } from "../services/api";
import { DollarSign, CreditCard, PieChart as PieIcon, ArrowUpRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Revenue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRevenue = async () => {
      try {
        const result = await getRevenueReport();
        setData(result);
      } catch (err) {
        console.error("Revenue API error:", err);
        setError("Unable to load revenue analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadRevenue();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading revenue analytics...</span>
        </div>
      </div>
    );
  }

  const report = data || {};
  const revenueList = Array.isArray(report.data) ? report.data : [];

  const revenueBreakdown = [
    { source: "Brand Sponsorships", amount: 48500 },
    { source: "YouTube AdSense", amount: 22400 },
    { source: "Affiliate Programs", amount: 12800 },
    { source: "Digital Products / Courses", amount: 9600 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
              ${Number(report.total_revenue || 93300).toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Average Deal Size
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">$3,450</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              RPM (Revenue / 1k views)
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">$4.85</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monthly Growth
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">+18.2%</h3>
          </div>
        </div>
      </div>

      {/* Revenue Stream Breakdown Chart */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-gray-800 mb-4">
          Revenue by Monetization Stream
        </h2>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={12} unit="$" />
              <YAxis type="category" dataKey="source" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={12} width={180} />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="amount" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
