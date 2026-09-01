import { useEffect, useState } from "react";
import { getContentReport } from "../services/api";

function ContentAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      try {
        const result = await getContentReport();
        setData(result);
      } catch (err) {
        console.error("Content API error:", err);
        setError("Unable to load content analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return <div style={{ padding: "20px" }}><h2>Loading content analytics...</h2></div>;
  }

  if (error) {
    return <div style={{ padding: "20px" }}><h2>{error}</h2></div>;
  }

  const report = data || {};
  const contentList = Array.isArray(report.content) ? report.content : [];

  const formatNum = (n) => {
    if (n === undefined || n === null) return "-";
    const num = Number(n);
    if (isNaN(num)) return "-";
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Content Analytics</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "14px", color: "#666" }}>Total Content</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{formatNum(report.total_content)}</p>
        </div>

        <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "14px", color: "#666" }}>Total Views</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{formatNum(report.total_views)}</p>
        </div>

        <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "14px", color: "#666" }}>Total Likes</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{formatNum(report.total_likes)}</p>
        </div>

        <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "14px", color: "#666" }}>Total Comments</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{formatNum(report.total_comments)}</p>
        </div>

        <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "14px", color: "#666" }}>Total Shares</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{formatNum(report.total_shares)}</p>
        </div>
      </div>

      <h2>Content Details</h2>

      {contentList.length === 0 ? (
        <p>No content data available.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee", background: "#f9f9f9" }}>
              <th style={{ padding: "12px" }}>Title</th>
              <th style={{ padding: "12px" }}>Platform</th>
              <th style={{ padding: "12px" }}>Views</th>
              <th style={{ padding: "12px" }}>Likes</th>
              <th style={{ padding: "12px" }}>Comments</th>
              <th style={{ padding: "12px" }}>Shares</th>
            </tr>
          </thead>

          <tbody>
            {contentList.map((item, idx) => (
              <tr key={item.id || idx} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{item.title || item.content_title || "Untitled"}</td>
                <td style={{ padding: "12px" }}>{item.platform || "-"}</td>
                <td style={{ padding: "12px" }}>{formatNum(item.views)}</td>
                <td style={{ padding: "12px" }}>{formatNum(item.likes)}</td>
                <td style={{ padding: "12px" }}>{formatNum(item.comments)}</td>
                <td style={{ padding: "12px" }}>{formatNum(item.shares)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ContentAnalytics;
