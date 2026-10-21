const { createProxyMiddleware } = require("http-proxy-middleware");

const rawApiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

const resolveProxyTarget = (apiBaseUrl) => {
  try {
    const parsedUrl = new URL(apiBaseUrl);
    return `${parsedUrl.protocol}//${parsedUrl.host}`;
  } catch (_error) {
    return "http://localhost:8000";
  }
};

module.exports = function setupProxy(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: resolveProxyTarget(rawApiBaseUrl),
      changeOrigin: true,
      secure: true,
    })
  );
};
