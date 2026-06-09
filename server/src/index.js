// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// import paymentRoutes from "./routes/paymentRoutes.js";

// dotenv.config();

// const app = express();

// const PORT = process.env.PORT || 5000;
// const NODE_ENV = process.env.NODE_ENV || "development";

// const DEFAULT_ALLOWED_ORIGINS = [
//   "http://localhost:5173",
//   "http://127.0.0.1:5173",
//   "https://ai-echoo-ecommerce-platform.onrender.com",
// ];

// const getAllowedOrigins = () => {
//   const raw = process.env.CLIENT_URL || process.env.ALLOWED_ORIGINS || "";

//   const envOrigins = raw
//     .split(",")
//     .map((item) => item.trim())
//     .filter(Boolean);

//   return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins])];
// };

// const allowedOrigins = getAllowedOrigins();

// app.use(
//   cors({
//     origin(origin, callback) {
//       if (!origin) {
//         return callback(null, true);
//       }

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error(`CORS blocked origin: ${origin}`), false);
//     },
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "2mb" }));
// app.use(express.urlencoded({ extended: true }));

// app.get("/api/health", (req, res) => {
//   res.json({
//     success: true,
//     message: "Echoo API is working",
//     environment: NODE_ENV,
//     allowedOrigins,
//   });
// });

// app.use("/api/payments", paymentRoutes);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// /*
//   Current file:
//   server/src/index.js

//   Frontend build path after Render build:
//   client/dist

//   Relative path:
//   server/src -> server -> repo root -> client/dist
// */
// const clientDistPath = path.resolve(__dirname, "../../client/dist");

// app.use(express.static(clientDistPath));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(clientDistPath, "index.html"));
// });

// app.use((error, req, res, next) => {
//   console.error("Server error:", error);

//   res.status(500).json({
//     success: false,
//     message: error.message || "Internal server error",
//   });
// });

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Echoo fullstack server running on port ${PORT}`);
//   console.log(`Environment: ${NODE_ENV}`);
//   console.log(`Serving frontend from: ${clientDistPath}`);
//   console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
  Current file:
  server/src/index.js

  Frontend build folder:
  client/dist

  Correct relative path:
  server/src -> server -> root -> client/dist
*/
const clientDistPath = path.resolve(__dirname, "../../client/dist");
const indexHtmlPath = path.join(clientDistPath, "index.html");
const assetsPath = path.join(clientDistPath, "assets");

/* ---------------- CORS SETUP ---------------- */

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",

  // old deployed url
  "https://ai-echoo-ecommerce-platform.onrender.com",

  // current deployed url
  "https://ai-echoo-ecommerce-platform-2o6u.onrender.com",

  // Render automatically gives this in some cases
  process.env.RENDER_EXTERNAL_URL,
].filter(Boolean);

const getAllowedOrigins = () => {
  const raw = process.env.CLIENT_URL || process.env.ALLOWED_ORIGINS || "";

  const envOrigins = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins])];
};

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server, Postman, curl, same-origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`), false);
    },
    credentials: true,
  })
);

/* ---------------- BASIC MIDDLEWARE ---------------- */

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------- HEALTH CHECK ---------------- */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Echoo API is working",
    environment: NODE_ENV,
    port: PORT,
    clientDistPath,
    indexHtmlExists: fs.existsSync(indexHtmlPath),
    assetsFolderExists: fs.existsSync(assetsPath),
    allowedOrigins,
  });
});

/* ---------------- API ROUTES ---------------- */

app.use("/api/payments", paymentRoutes);

/* ---------------- FRONTEND STATIC FILES ---------------- */

if (fs.existsSync(clientDistPath)) {
  console.log("Frontend dist found:", clientDistPath);

  // Serve Vite assets clearly
  app.use(
    "/assets",
    express.static(assetsPath, {
      fallthrough: true,
      etag: true,
      maxAge: NODE_ENV === "production" ? "1y" : 0,
      immutable: NODE_ENV === "production",
    })
  );

  // Serve other public files from dist
  app.use(
    express.static(clientDistPath, {
      fallthrough: true,
      etag: true,
      maxAge: 0,
      setHeaders(res, filePath) {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache");
        }
      },
    })
  );
} else {
  console.error("Frontend dist folder not found:", clientDistPath);
}

/*
  Important:
  If asset file is missing, do NOT return index.html.
  Otherwise browser gets wrong file and blank screen happens.
*/
app.get(/^\/assets\/.*/, (req, res) => {
  res.status(404).type("text/plain").send(`Asset not found: ${req.originalUrl}`);
});

/*
  React Router fallback.
  This should only run for frontend routes, not API routes.
*/
app.get(/^\/(?!api).*/, (req, res, next) => {
  if (!fs.existsSync(indexHtmlPath)) {
    return res.status(503).send(`
      Frontend build not found.
      Please run: cd client && npm install && npm run build
      Expected file: ${indexHtmlPath}
    `);
  }

  res.sendFile(indexHtmlPath, (error) => {
    if (error) {
      next(error);
    }
  });
});

/* ---------------- ERROR HANDLER ---------------- */

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    path: req.originalUrl,
  });
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Echoo fullstack server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Serving frontend from: ${clientDistPath}`);
  console.log(`Index HTML exists: ${fs.existsSync(indexHtmlPath)}`);
  console.log(`Assets folder exists: ${fs.existsSync(assetsPath)}`);
  console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
});
