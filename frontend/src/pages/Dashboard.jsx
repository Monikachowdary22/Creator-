import { useEffect, useState } from "react";
import { getDashboardReport } from "../services/api";

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

        console.log("Dashboard API response:", result);

        setData(result);
      } catch (err) {
        console.error("Dashboard API error:", err);

        if (err.response) {
          setError(
            `API Error: ${err.response.status} ${
              err.response.data?.detail || ""
            }`
          );
        } else if (err.request) {
          setError(
            "Unable to connect to backend. Make sure FastAPI is running."
          );
        } else {
          setError("Unable to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Dashboard Error</h2>

        <p style={{ color: "red" }}>
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const content = data?.content_performance || {};
  const platforms = data?.platform_comparison || [];

  const cards = [
    {
      title: "Total Content",
      value: content.total_content ?? 0,
    },
    {
      title: "Total Views",
      value: content.total_views ?? 0,
    },
    {
      title: "Total Likes",
      value: content.total_likes ?? 0,
    },
    {
      title: "Total Comments",
      value: content.total_comments ?? 0,
    },
    {
      title: "Total Shares",
      value: content.total_shares ?? 0,
    },
    {
      title: "Total Reach",
      value: content.total_reach ?? 0,
    },
  ];

  return (
    <div style={{ paddingBottom: "30px" }}>
      {/* Header */}

      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ marginBottom: "8px" }}>
          CreatorIQ Dashboard
        </h1>

        <p
          style={{
            margin: 0,
            color: "#6b7280",
          }}
        >
          Overview of your creator performance
        </p>
      </div>

      {/* KPI Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              padding: "20px",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow:
                "0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              {card.title}
            </p>

            <h2
              style={{
                marginTop: "10px",
                marginBottom: 0,
                fontSize: "26px",
              }}
            >
              {Number(card.value).toLocaleString()}
            </h2>
          </div>
        ))}
      </div>

      {/* Charts */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "24px",
          marginBottom: "35px",
        }}
      >
        {/* Views */}

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            backgroundColor: "#ffffff",
          }}
        >
          <h2>Views by Platform</h2>

          {platforms.length === 0 ? (
            <p>No platform data available.</p>
          ) : (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platforms}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="platform" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="total_views"
                    name="Views"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Engagement */}

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            backgroundColor: "#ffffff",
          }}
        >
          <h2>Engagement Rate</h2>

          {platforms.length === 0 ? (
            <p>No engagement data available.</p>
          ) : (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={platforms}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="platform" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="engagement_rate"
                    name="Engagement Rate (%)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Platform Table */}

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "#ffffff",
          overflowX: "auto",
        }}
      >
        <h2>Platform Performance</h2>

        {platforms.length === 0 ? (
          <p>No platform data available.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr>
                <th style={tableHeaderStyle}>
                  Platform
                </th>

                <th style={tableHeaderStyle}>
                  Content
                </th>

                <th style={tableHeaderStyle}>
                  Views
                </th>

                <th style={tableHeaderStyle}>
                  Reach
                </th>

                <th style={tableHeaderStyle}>
                  Engagement Rate
                </th>
              </tr>
            </thead>

            <tbody>
              {platforms.map((platform) => (
                <tr key={platform.platform}>
                  <td style={tableCellStyle}>
                    {platform.platform}
                  </td>

                  <td style={tableCellStyle}>
                    {platform.content_count ?? 0}
                  </td>

                  <td style={tableCellStyle}>
                    {Number(
                      platform.total_views ?? 0
                    ).toLocaleString()}
                  </td>

                  <td style={tableCellStyle}>
                    {Number(
                      platform.total_reach ?? 0
                    ).toLocaleString()}
                  </td>

                  <td style={tableCellStyle}>
                    {platform.engagement_rate ?? 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const tableHeaderStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #e5e7eb",
};

const tableCellStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};

export default Dashboard;