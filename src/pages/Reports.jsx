import { useState, useEffect, useCallback } from "react";
import {
  getDashboardReport,
  downloadPdfReport,
  downloadExcelReport,
} from "../services/api";
import { FileSpreadsheet, Download, RefreshCw, CheckCircle2 } from "lucide-react";

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await getDashboardReport();
      setReport(data);
    } catch (err) {
      console.error("Report API error:", err);
      setError("Unable to load report.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const data = await getDashboardReport();
        if (!ignore) {
          setReport(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const downloadPdf = async () => {
    try {
      setMessage("");
      setError("");
      const blob = await downloadPdfReport();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "creator_report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setMessage("PDF report downloaded successfully.");
    } catch (err) {
      console.error("PDF download error:", err);
      setError("Unable to download PDF report.");
    }
  };

  const downloadExcel = async () => {
    try {
      setMessage("");
      setError("");
      const blob = await downloadExcelReport();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "creator_report.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setMessage("Excel report downloaded successfully.");
    } catch (err) {
      console.error("Excel download error:", err);
      setError("Unable to download Excel report.");
    }
  };

  const platforms = report?.platform_comparison || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner with Action Buttons */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Export Analytics Reports
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Generate and export consolidated PDF or Excel audits for brand pitches & tax filings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadReport}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={downloadPdf}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-3 rounded-lg">
          <span>{error}</span>
        </div>
      )}

      {/* Platform Comparison */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs overflow-hidden">
        <h2 className="text-base font-bold text-gray-800 mb-4">
          Platform Performance Summary
        </h2>

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
                  <td className="py-3.5 px-4 font-semibold text-gray-800">
                    {platform.platform}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {platform.content_count}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {Number(platform.total_views).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {Number(platform.total_reach).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">
                      {platform.engagement_rate}%
                    </span>
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

export default Reports;
