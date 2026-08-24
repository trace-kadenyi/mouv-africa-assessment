import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserDetails } from "../api/api";

const Profile = () => {
  const { token, email, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getUserDetails(token);
        setProfile(data?.Payload || data?.data || data);
      } catch (err) {
        console.error("Error:", err);
        setError("Couldn't load profile — showing what we know from login.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            ← Back to listings
          </button>
          <button
            type="button"
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-800 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

        {loading && (
          <div
            role="status"
            aria-live="polite"
            className="text-center py-16 text-gray-500"
          >
            Loading profile…
          </div>
        )}

        {!loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
            {error && (
              <p
                role="alert"
                className="text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 text-sm mb-2"
              >
                {error}
              </p>
            )}

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Email
              </p>
              <p className="text-gray-900">{profile?.email || email || "—"}</p>
            </div>

            {profile?.name && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Name
                </p>
                <p className="text-gray-900">{profile.name}</p>
              </div>
            )}

            {profile?._id && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  User ID
                </p>
                <p className="text-gray-900 text-xs break-all">{profile._id}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
