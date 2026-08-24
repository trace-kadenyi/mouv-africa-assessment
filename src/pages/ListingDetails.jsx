import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getListingDetails } from "../api/api";

const ListingDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getListingDetails(token, id);
        setListing(data?.Payload || data?.data || data);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load listing details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [token, id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            ← Back to listings
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {loading && (
          <div
            role="status"
            aria-live="polite"
            className="text-center py-16 text-gray-500"
          >
            Loading listing…
          </div>
        )}

        {error && (
          <p role="alert" className="text-red-600 text-center py-16">
            {error}
          </p>
        )}

        {!loading && !error && listing && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {listing.name || "Unnamed Listing"}
            </h1>
            <p className="text-gray-600 mb-4">
              {listing.description || "No description available"}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {listing.listingStatus || "Unknown"}
              </span>
              {listing.furnishStatus && (
                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                  {listing.furnishStatus}
                </span>
              )}
              {listing.price && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                  ${listing.price}
                </span>
              )}
            </div>

            {listing._id && (
              <p className="text-xs text-gray-400 break-all pt-3 border-t border-gray-100">
                ID: {listing._id}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ListingDetails;
