import axios from "axios";
import { config } from "../App";

export { config };

const getAuthHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
};

const resolveUrl = (url) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanEndpoint = config.endpoint.replace(/\/$/, "");
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${cleanEndpoint}${cleanUrl}`;
};

const unwrapError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again.";
  return new Error(message);
};

const apiClient = {
  get: async (url, options = {}) => {
    try {
      const fullUrl = resolveUrl(url);
      const headers = getAuthHeaders(options.headers);
      const res = await axios.get(fullUrl, { ...options, headers });
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
  post: async (url, data, options = {}) => {
    try {
      const fullUrl = resolveUrl(url);
      const headers = getAuthHeaders(options.headers);
      const res = await axios.post(fullUrl, data, { ...options, headers });
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
  delete: async (url, options = {}) => {
    try {
      const fullUrl = resolveUrl(url);
      const headers = getAuthHeaders(options.headers);
      const res = await axios.delete(fullUrl, { ...options, headers });
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
};

export default apiClient;
