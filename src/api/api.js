import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// --- Request interceptor -------------------------------------------------
// Callers pass `token` via config (see `withAuth` below) instead of building
// the `{ headers: { SKEY: token } }` object by hand on every request.
apiClient.interceptors.request.use((config) => {
  if (config.token) {
    config.headers.SKEY = config.token;
    delete config.token;
  }
  return config;
});

// --- Response interceptor -------------------------------------------------
// Unwraps `response.data` and normalizes errors into a single readable
// Error so callers can just do `catch (err) { setError(err.message) }`.
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  },
);

const withAuth = (token) => ({ token });

export const getUserDetails = async (token) => {
  return apiClient.post("/getuserdetails", {}, withAuth(token));
};

export const listListings = async (token, status = "ACTIVE") => {
  return apiClient.post("/listClientListings", { status }, withAuth(token));
};

export const getListingDetails = async (token, listingId) => {
  return apiClient.post(
    "/listClientListings",
    { _id: listingId },
    withAuth(token),
  );
};

export const searchListings = async (token, searchTerm) => {
  return apiClient.post(
    "/listClientListings",
    {
      fieldsToSearchFor: [
        { field: "description" },
        { field: "furnishStatus" },
        { field: "listingStatus" },
        { field: "name" },
      ],
      searchTerm,
    },
    withAuth(token),
  );
};
