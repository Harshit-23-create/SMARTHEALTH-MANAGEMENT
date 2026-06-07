// Central API configuration
// In development: Vite proxies /api to localhost:5000
// In production: Uses the VITE_API_URL environment variable

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_BASE_URL;
