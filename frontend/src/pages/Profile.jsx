import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/users/me");
        setProfile(response.data);
      } catch (err) {
        console.error("Profile API error:", err);
        setError("Unable to load profile information.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <h2>Loading profile...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Profile / Settings</h1>

      {profile ? (
        <div>
          <p>
            <strong>Name:</strong>{" "}
            {profile.full_name ?? "N/A"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {profile.email ?? "N/A"}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {profile.role ?? "N/A"}
          </p>
        </div>
      ) : (
        <p>No profile information available.</p>
      )}
    </div>
  );
}

export default Profile;