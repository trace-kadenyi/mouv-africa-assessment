import React, { useEffect, useState } from "react";
import { listListings } from "../api/api";

const Dashboard = ({ token, onLogout }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(15);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const data = await listListings(token, "ACTIVE");
        setListings(data?.Payload || data?.data || []);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [token]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"
            aria-hidden="true"
          />
          <p className="mt-4 text-gray-600">Loading listings…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        role="alert"
      >
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            <span aria-hidden="true">🏠</span> Mouv Africa
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, User</span>
            <button
              type="button"
              className="text-sm text-red-600 hover:text-red-800 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
          <p className="text-gray-700">
            <span className="font-semibold">{listings.length}</span> active
            listings found
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
          {listings.slice(0, visibleCount).map((listing) => (
            <li
              key={listing._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-5xl">🏠</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {listing.name || "Unnamed Listing"}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {listing.description || "No description available"}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
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
                <button
                  type="button"
                  className="w-full mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  aria-label={`View details for ${listing.name || "this listing"}`}
                >
                  View Details <span aria-hidden="true">→</span>
                </button>
              </div>
            </li>
          ))}
        </ul>

        {visibleCount < listings.length && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + 15)}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Load more ({listings.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {listings.length === 0 && (
          <p className="text-center py-12 text-gray-500">No listings found.</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
