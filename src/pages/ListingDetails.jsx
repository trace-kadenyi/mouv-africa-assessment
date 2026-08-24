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
        const listing = data?.Payload?.[0] ?? data?.data?.[0] ?? data;

        setListing(listing);
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Images */}
            {listing.images?.length > 0 && (
              <img
                src={listing.images[0].url}
                alt={listing.name}
                className="w-full h-80 object-cover"
              />
            )}

            <div className="p-6">
              {/* Header */}
              <h1 className="text-3xl font-bold">{listing.name}</h1>

              <p className="text-gray-600 mt-2">{listing.description}</p>

              {/* Status */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {listing.status}
                </span>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {listing.listingStatus}
                </span>

                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  {listing.propertyType?.name}
                </span>
              </div>

              {/* Price */}
              <section className="mt-8">
                <h2 className="font-semibold text-xl mb-3">Pricing</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Nightly Price</p>
                    <p className="font-semibold">
                      {listing.currency?.prefix} {listing.pricing?.nightlyPrice}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Weekend Price</p>
                    <p className="font-semibold">
                      {listing.currency?.prefix} {listing.pricing?.weekendPrice}
                    </p>
                  </div>
                </div>
              </section>

              {/* Property Details */}
              <section className="mt-8">
                <h2 className="font-semibold text-xl mb-3">Property Details</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <p>Bedrooms: {listing.details?.bedrooms}</p>

                  <p>Bathrooms: {listing.details?.bathrooms}</p>

                  <p>Guests: {listing.details?.maxGuests}</p>

                  <p>Floor: {listing.details?.listingFloor}</p>

                  <p>Elevator: {listing.details?.elevatorAccess}</p>

                  <p>Pets Allowed: {listing.details?.petsAllowed}</p>

                  <p>Smoking: {listing.details?.smokingAllowed}</p>

                  <p>Events: {listing.details?.eventsAllowed}</p>
                </div>
              </section>

              {/* Location */}
              <section className="mt-8">
                <h2 className="font-semibold text-xl mb-3">Location</h2>

                <p>{listing.location?.buildingName}</p>

                <p>{listing.location?.streetAddress}</p>

                <p>{listing.location?.cityTown}</p>
              </section>

              {/* Amenities */}
              <section className="mt-8">
                <h2 className="font-semibold text-xl mb-3">Amenities</h2>

                <div className="space-y-5">
                  {listing.freeAmenities?.map((group) => (
                    <div key={group.group}>
                      <h3 className="font-medium">{group.group}</h3>

                      <ul className="list-disc list-inside text-gray-600">
                        {group.data.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Premium Amenities */}
              <section className="mt-8">
                <h2 className="font-semibold text-xl mb-3">
                  Premium Amenities
                </h2>

                <ul className="list-disc list-inside">
                  {listing.premium?.amenities?.map((item) => (
                    <li key={item.name}>
                      {item.name}
                      {item.isFree
                        ? " (Free)"
                        : ` (${listing.currency?.prefix} ${item.amount})`}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Refund Policy */}
              <section className="mt-8">
                <h2 className="font-semibold text-xl mb-3">Refund Policy</h2>

                <p>{listing.refundPolicy?.policy}</p>
              </section>

              {/* Check In */}
              <section className="mt-8">
                <h2 className="font-semibold text-xl mb-3">Check In / Out</h2>

                <p>Check In: {listing.checkIn}</p>

                <p>Check Out: {listing.checkOut}</p>
              </section>

              {/* Host */}
              <section className="mt-8">
                <h2 className="font-semibold text-xl mb-3">Host</h2>

                <p>{listing.organisation?.name}</p>

                <p>{listing.organisation?.email}</p>

                <p>{listing.organisation?.telephone1}</p>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListingDetails;
