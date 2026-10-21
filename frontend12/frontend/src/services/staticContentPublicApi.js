import API_BASE_URL from "./apiBaseUrl";

const publicRequest = async (path, signal) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    signal,
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message || "Unable to load public content.");
  }

  return payload;
};

export const getPublicHotLinks = async (signal) => {
  const payload = await publicRequest("/hot-links/public", signal);
  if (!Array.isArray(payload?.data)) {
    throw new Error("The hot links response was invalid.");
  }

  return payload.data;
};

export const getPublicAchievers = async (
  { category, year = "", studentClass = "", limit = "all" },
  signal
) => {
  const params = new URLSearchParams({ category, limit: String(limit) });
  if (year) params.set("year", String(year));
  if (studentClass) params.set("class", String(studentClass));
  const payload = await publicRequest(`/achievers/public?${params.toString()}`, signal);

  if (!payload?.data || !Array.isArray(payload.data.years) || !Array.isArray(payload.data.records)) {
    throw new Error("The achievers response was invalid.");
  }

  return payload.data;
};

export const getPublicAchieverExams = async (signal) => {
  const payload = await publicRequest("/achievers/exams/public", signal);
  if (!Array.isArray(payload?.data)) {
    throw new Error("The exam archives response was invalid.");
  }

  return payload.data;
};
