const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 3030;

// --- Logs et CORS
app.use(morgan("dev"));
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (curl/bruno) that don't send an Origin header
    if (!origin) return callback(null, true);

    const allowedOrigin = "http://localhost:5173";
    return callback(null, origin === allowedOrigin);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// --- Health-check gateway ---
app.get("/health", (_req, res) =>
  res.json({ status: "ok", service: "api-gateway" }),
);

// --- Proxy vers microservices
const services = [
  {
    route: "/auth/health",
    target: process.env.AUTH_URL || "http://127.0.0.1:4002",
    pathRewrite: { "^/auth/health": "/health" },
  },
  { route: "/auth", target: process.env.AUTH_URL || "http://127.0.0.1:4002" },
  {
    route: "/catalogue",
    target: process.env.CATALOG_URL || "http://127.0.0.1:4001",
  },
  {
    route: "/movies",
    target: process.env.CATALOG_URL || "http://127.0.0.1:4001",
    pathRewrite: { "^/movies": "/catalogue/movies" },
  },
  {
    route: "/sessions",
    target: process.env.BOOKING_URL || "http://127.0.0.1:4003",
  },
  {
    route: "/reservation",
    target: process.env.BOOKING_URL || "http://127.0.0.1:4003",
  },
  {
    route: "/admin",
    target: process.env.ADMIN_URL || "http://ms-cinema-admin:4010",
  },
];

services.forEach(({ route, target, pathRewrite }) => {
  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      pathRewrite: pathRewrite || undefined,
      onProxyReq: (proxyReq, req) => {
        if (req.headers.cookie) {
          proxyReq.setHeader("cookie", req.headers.cookie);
        }
      },
    }),
  );
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
