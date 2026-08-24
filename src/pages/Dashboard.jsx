import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listListings } from "../api/api";

const MOCK_LISTINGS = [
  {
    _id: "mock1",
    name: "Modern Heights Apartment",
    description: "A bright 2-bedroom apartment in a modern estate.",
    listingStatus: "ACTIVE",
    furnishStatus: "FURNISHED",
    price: 45000,
  },
  {
    _id: "mock2",
    name: "Garden View Studio",
    description: "Cozy studio with a private garden view.",
    listingStatus: "ACTIVE",
    furnishStatus: "UNFURNISHED",
    price: 25000,
  },
  {
    _id: "mock3",
    name: "Riverside Townhouse",
    description: "Spacious townhouse near the river.",
    listingStatus: "ACTIVE",
    furnishStatus: "SEMI-FURNISHED",
    price: 60000,
  },
];

const Dashboard = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingMockData, setUsingMockData] = useState(false);
  const [visibleCount, setVisibleCount] = useState(15);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const data = await listListings(token, "ACTIVE");
        const items = data?.Payload || data?.data || [];
        console.log("First listing:", items[0]);
        setListings(items);
        setUsingMockData(false);
      } catch (err) {
        console.error("Error:", err);
        console.warn("Falling back to mock data — API request failed.");
        setListings(MOCK_LISTINGS);
        setUsingMockData(true);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            <span aria-hidden="true">🏠</span> Mouv Africa
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome</span>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => navigate("/search")}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
            >
              Search
            </button>
            <button
              type="button"
              className="text-sm text-red-600 hover:text-red-800 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {usingMockData && (
          <div
            className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg p-3 mb-4"
            role="status"
          >
            Showing sample data — the live API couldn't be reached (likely a
            CORS/network issue on their end).
          </div>
        )}

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
              {listing.images?.length > 0 ? (
                <img
                  src={listing.images[0].url}
                  alt={listing.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div
                  className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-5xl">🏠</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">
                      {listing.name || "Unnamed Listing"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {listing.location?.buildingName || "Unknown Building"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {listing.location?.cityTown || "Unknown Location"}
                    </p>
                  </div>

                  <span
                    className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full"
                    aria-label={`Listing status: ${listing.status || "Unknown"}`}
                  >
                    {listing.status || "Unknown"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mt-4">
                  {listing.description || "No description available"}
                </p>

                <div
                  className="grid grid-cols-3 gap-3 mt-5 border border-gray-200 rounded-lg p-3"
                  aria-label="Property summary"
                >
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {listing.details?.bedrooms ?? "-"}
                    </p>
                    <p className="text-xs text-gray-500">Bedrooms</p>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {listing.details?.bathrooms ?? "-"}
                    </p>
                    <p className="text-xs text-gray-500">Bathrooms</p>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {listing.details?.maxGuests ?? "-"}
                    </p>
                    <p className="text-xs text-gray-500">Guests</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  {listing.propertyType?.name && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {listing.propertyType.name}
                    </span>
                  )}

                  {listing.listingStatus && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {listing.listingStatus}
                    </span>
                  )}

                  {listing.product && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {listing.product}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    {listing.pricing?.nightlyPrice != null ? (
                      <>
                        <p className="text-xs text-gray-500">Starting from</p>

                        <p className="text-2xl font-bold text-green-700">
                          {listing.currency?.prefix?.toUpperCase() ?? ""}{" "}
                          {listing.pricing.nightlyPrice.toLocaleString()}
                        </p>

                        <p className="text-xs text-gray-500">per night</p>
                      </>
                    ) : (
                      <p className="text-gray-500 italic">Price unavailable</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/listings/${listing._id}`)}
                    className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    aria-label={`View details for ${listing.name || "this listing"}`}
                  >
                    View Details <span aria-hidden="true">→</span>
                  </button>
                </div>
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
