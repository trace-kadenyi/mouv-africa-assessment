import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { searchListings } from "../api/api";

const Search = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!term.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const data = await searchListings(token, term.trim());
      setResults(data?.Payload || data?.data || []);
    } catch (err) {
      console.error("Error:", err);
      setError("Couldn't search right now — the API may be unreachable.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            ← Back to listings
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Search listings
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <label htmlFor="search-term" className="sr-only">
            Search listings
          </label>
          <input
            id="search-term"
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by name, description, furnishing, status…"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !term.trim()}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="text-amber-700 bg-amber-50 border border-amber-200 rounded p-3 text-sm mb-4"
          >
            {error}
          </p>
        )}

        {loading && (
          <div
            role="status"
            aria-live="polite"
            className="text-center py-12 text-gray-500"
          >
            Searching…
          </div>
        )}

        {!loading && searched && results.length === 0 && !error && (
          <p className="text-center py-12 text-gray-500">
            No listings matched "{term}".
          </p>
        )}

        {!loading && results.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
            {results.map((listing) => (
              <li
                key={listing._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {listing.name || "Unnamed Listing"}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {listing.description || "No description available"}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/listings/${listing._id}`)}
                    className="w-full mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    aria-label={`View details for ${listing.name || "this listing"}`}
                  >
                    View Details <span aria-hidden="true">→</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Search;
