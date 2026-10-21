const configuredApiBaseUrl = (process.env.REACT_APP_API_BASE_URL || "").trim();
const localHostnames = new Set(["localhost", "127.0.0.1", "::1"]);
const currentHostname = typeof window === "undefined" ? "localhost" : window.location.hostname;

const PUBLIC_API_BASE_URL = "https://api.unifiedcouncil.com/api";
const LOCAL_API_BASE_URL = "http://localhost:8000/api";

const API_BASE_URL = (
  localHostnames.has(currentHostname)
    ? LOCAL_API_BASE_URL
    : configuredApiBaseUrl || PUBLIC_API_BASE_URL
).replace(/\/+$/, "");

export default API_BASE_URL;
