import { useEffect, useState } from "react";
import { getAudienceReport } from "../services/api";

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
    return <h2>Loading audience analytics...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const report = data || {};
  const audienceList = report.data || [];

  return (
    <div>
      <h1>Audience Analytics</h1>

      <h3>Total Records</h3>
      <p>{report.total_records ?? 0}</p>

      <h2>Audience Data</h2>

      {audienceList.length === 0 ? (
        <p>No audience data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              {Object.keys(audienceList[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {audienceList.map((record, index) => (
              <tr key={record.id ?? index}>
                {Object.keys(audienceList[0]).map((key) => (
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

export default AudienceAnalytics;