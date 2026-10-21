import axios from "axios";
import API_BASE_URL from "@/services/apiBaseUrl";

const schoolDashboardApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default schoolDashboardApi;
