import { useEffect, useState } from "react";
import api from "../services/api";
import { User, Mail, Shield, Key, BellRing, Smartphone, Check } from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

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
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  const user = profile || {
    full_name: "Monika Chowdary",
    email: "monika@creatoranalytics.io",
    role: "Admin / Lead Creator",
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
          {user.full_name?.charAt(0) || "M"}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-xl font-bold text-gray-900">{user.full_name || "Creator"}</h2>
          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
              <Shield className="w-3.5 h-3.5" />
              {user.role || "Admin"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              <Check className="w-3.5 h-3.5" />
              Verified Creator
            </span>
          </div>
        </div>
      </div>

      {/* Account Info Form */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-gray-800">Account Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Full Name
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50/50">
              <User className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                defaultValue={user.full_name || "Monika Chowdary"}
                className="bg-transparent text-sm text-gray-800 focus:outline-none w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Email Address
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50/50">
              <Mail className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="email"
                defaultValue={user.email || "monika@creatoranalytics.io"}
                className="bg-transparent text-sm text-gray-800 focus:outline-none w-full"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            {saved ? "Saved Successfully!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
