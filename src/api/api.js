import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const getUserDetails = async (token) => {
  const response = await apiClient.post(
    "/getuserdetails",
    {},
    { headers: { SKEY: token } },
  );
  return response.data;
};

export const listListings = async (token, status = "ACTIVE") => {
  const response = await apiClient.post(
    "/listClientListings",
    { status },
    { headers: { SKEY: token } },
  );
  return response.data;
};

export const getListingDetails = async (token, listingId) => {
  const response = await apiClient.post(
    "/listClientListings",
    { _id: listingId },
    { headers: { SKEY: token } },
  );
  return response.data;
};

export const searchListings = async (token, searchTerm) => {
  const response = await apiClient.post(
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
    { headers: { SKEY: token } },
  );
  return response.data;
};
