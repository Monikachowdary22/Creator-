import { useEffect, useState } from "react";
import api from "../services/api";

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
    return <h2>Loading sponsorships...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const report = data || {};
  const sponsorshipList = Array.isArray(data)
    ? data
    : data?.data || [];

  return (
    <div>
      <h1>Sponsorships</h1>

      {sponsorshipList.length === 0 ? (
        <p>No sponsorship data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              {Object.keys(sponsorshipList[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sponsorshipList.map((record, index) => (
              <tr key={record.id ?? index}>
                {Object.keys(sponsorshipList[0]).map((key) => (
                  <td key={key}>{record[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {sponsorshipList.length === 0 && report.message && (
        <p>{report.message}</p>
      )}
    </div>
  );
}

export default Sponsorships;