import { useEffect, useState } from "react";
import { getGrowthReport } from "../services/api";

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
    return <h2>Loading growth trends...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const report = data || {};
  const growthList = report.data || [];

  return (
    <div>
      <h1>Growth & Trends</h1>

      <h3>Total Records</h3>
      <p>{report.total_records ?? 0}</p>

      <h2>Growth Data</h2>

      {growthList.length === 0 ? (
        <p>No growth data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              {Object.keys(growthList[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {growthList.map((record, index) => (
              <tr key={record.id ?? index}>
                {Object.keys(growthList[0]).map((key) => (
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

export default GrowthTrends;