import { useState } from "react";
import {
  getDashboardReport,
  downloadPdfReport,
  downloadExcelReport,
} from "../services/api";

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadReport = async () => {
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
  };

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

  const content = report?.content_performance || {};
  const platforms = report?.platform_comparison || [];

  return (
    <div>
      <h1>Reports</h1>

      <p>
        Generate and download your CreatorIQ analytics reports.
      </p>

      <div>
        <button onClick={loadReport}>
          View Report
        </button>

        <button onClick={downloadPdf}>
          Download PDF
        </button>

        <button onClick={downloadExcel}>
          Download Excel
        </button>
      </div>

      {loading && (
        <p>Loading report...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {message && (
        <p>{message}</p>
      )}

      {report && (
        <div>
          <h2>Content Performance</h2>

          <p>
            Total Content:{" "}
            {content.total_content ?? 0}
          </p>

          <p>
            Total Views:{" "}
            {content.total_views ?? 0}
          </p>

          <p>
            Total Likes:{" "}
            {content.total_likes ?? 0}
          </p>

          <p>
            Total Comments:{" "}
            {content.total_comments ?? 0}
          </p>

          <p>
            Total Shares:{" "}
            {content.total_shares ?? 0}
          </p>

          <p>
            Total Reach:{" "}
            {content.total_reach ?? 0}
          </p>

          <h2>Platform Comparison</h2>

          {platforms.length === 0 ? (
            <p>No platform data available.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Content</th>
                  <th>Views</th>
                  <th>Reach</th>
                  <th>Engagement Rate</th>
                </tr>
              </thead>

              <tbody>
                {platforms.map((platform) => (
                  <tr key={platform.platform}>
                    <td>{platform.platform}</td>
                    <td>{platform.content_count}</td>
                    <td>{platform.total_views}</td>
                    <td>{platform.total_reach}</td>
                    <td>
                      {platform.engagement_rate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;