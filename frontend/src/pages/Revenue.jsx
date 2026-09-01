import { useEffect, useState } from "react";
import { getRevenueReport } from "../services/api";

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
    return <h2>Loading revenue analytics...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const report = data || {};
  const revenueList = report.data || [];

  return (
    <div>
      <h1>Revenue Analytics</h1>

      <h3>Total Revenue</h3>
      <p>₹{report.total_revenue ?? 0}</p>

      <h3>Total Records</h3>
      <p>{report.total_records ?? 0}</p>

      <h2>Revenue Details</h2>

      {revenueList.length === 0 ? (
        <p>No revenue data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              {Object.keys(revenueList[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {revenueList.map((record, index) => (
              <tr key={record.id ?? index}>
                {Object.keys(revenueList[0]).map((key) => (
                  <td key={key}>{record[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Revenue;