import API_BASE_URL from "@/services/apiBaseUrl";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const readResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === "string" ? payload : payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload;
};

const publicRequest = async (endpoint) => readResponse(await fetch(buildUrl(endpoint)));

const adminRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("uc_admin_token");
  return readResponse(await fetch(buildUrl(endpoint), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  }));
};

export const staticContentAdminApi = {
  me: () => adminRequest("/static-content-admin/profile"),
  dashboard: () => adminRequest("/static-content-admin/dashboard"),
  getHotLinks: () => adminRequest("/static-content-admin/hot-links"),
  getHotLinkById: (id) => adminRequest(`/static-content-admin/hot-links/${id}`),
  createHotLink: (data) => adminRequest("/static-content-admin/hot-links", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  updateHotLink: (id, data) => adminRequest(`/static-content-admin/hot-links/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  deleteHotLink: (id) => adminRequest(`/static-content-admin/hot-links/${id}`, {
    method: "DELETE",
  }),
  toggleHotLinkStatus: (id, isActive) => adminRequest(`/static-content-admin/hot-links/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  }),
  reorderHotLinks: (items) => adminRequest("/static-content-admin/hot-links/reorder", {
    method: "PATCH",
    body: JSON.stringify({ items }),
  }),
  getAchievers: () => adminRequest("/static-content-admin/achievers"),
  getAchieverExams: () => adminRequest("/static-content-admin/achievers/exams"),
  getAchieverCounts: () => adminRequest("/static-content-admin/achievers/counts"),
  createAchieverExam: (data) => adminRequest("/static-content-admin/achievers/exams", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  deleteAchieverExam: (id) => adminRequest(`/static-content-admin/achievers/exams/${id}`, {
    method: "DELETE",
  }),
  createExamAchiever: (examId, data) => adminRequest(`/static-content-admin/achievers/exams/${examId}/records`, {
    method: "POST",
    body: JSON.stringify(data),
  }),
  getTopAchievers: ({ category, year = "", studentClass = "", limit = "all" }) => {
    const params = new URLSearchParams({ category });
    if (year) params.set("year", year);
    if (studentClass) params.set("class", String(studentClass));
    if (limit) params.set("limit", String(limit));
    return adminRequest(`/static-content-admin/achievers/top-50?${params.toString()}`);
  },
  createAchiever: (data) => adminRequest("/static-content-admin/achievers", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  updateAchiever: (id, data) => adminRequest(`/static-content-admin/achievers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  deleteAchiever: (id) => adminRequest(`/static-content-admin/achievers/${id}`, {
    method: "DELETE",
  }),
};

export const staticContentPublicApi = {
  hotLinks: () => publicRequest("/hot-links/public"),
  achievers: ({ category, year, studentClass, limit = "all" } = {}) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (year) params.set("year", String(year));
    if (studentClass) params.set("class", String(studentClass));
    if (limit) params.set("limit", String(limit));
    const queryString = params.toString();
    return publicRequest(`/achievers/public${queryString ? `?${queryString}` : ""}`);
  },
};
