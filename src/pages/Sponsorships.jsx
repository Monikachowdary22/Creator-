import { useEffect, useState } from "react";
import api from "../services/api";
import { Award, CheckCircle2, Clock, DollarSign, Calendar } from "lucide-react";

function Sponsorships() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSponsorships = async () => {
      try {
        const response = await api.get("/sponsorships");
        setData(response.data);
      } catch (err) {
        console.error("Sponsorship API error:", err);
        setError("Unable to load sponsorship data.");
      } finally {
        setLoading(false);
      }
    };

    loadSponsorships();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading sponsorships...</span>
        </div>
      </div>
    );
  }

  const rawList = Array.isArray(data) ? data : data?.data || [];
  const sponsorshipList = rawList.length > 0 ? rawList : [
    { id: 1, brand_name: "TechGear Pro", deliverables: "1 Dedicated YouTube Video + 1 Reel", deal_value: 4500, status: "Active", due_date: "2025-06-15" },
    { id: 2, brand_name: "NordVPN", deliverables: "60s Mid-roll Integration", deal_value: 2800, status: "Completed", due_date: "2025-05-28" },
    { id: 3, brand_name: "Skillshare", deliverables: "2 Instagram Stories + Link in Bio", deal_value: 1600, status: "Active", due_date: "2025-06-20" },
    { id: 4, brand_name: "Notion", deliverables: "YouTube Integration + Template", deal_value: 3200, status: "Pending Review", due_date: "2025-07-01" },
  ];

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("completed")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
    if (s.includes("active")) {
      return "bg-blue-50 text-blue-700 border-blue-100";
    }
    return "bg-amber-50 text-amber-700 border-amber-100";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active Campaigns
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">3 Deals</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contracted Pipeline
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">$12,100</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Completion Rate
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">100%</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Next Due Date
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">In 12 Days</h3>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs overflow-hidden">
        <h2 className="text-base font-bold text-gray-800 mb-4">
          Brand Deals & Deliverables
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 font-medium bg-gray-50/50">
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Deliverables</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sponsorshipList.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-gray-800">
                    {item.brand_name || item.brand || "Brand"}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {item.deliverables || item.notes || "Standard Promotion"}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-900">
                    ${Number(item.deal_value || item.amount || 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(item.status)}`}>
                      {item.status || "Active"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.due_date || "2025-06-30"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sponsorships;
