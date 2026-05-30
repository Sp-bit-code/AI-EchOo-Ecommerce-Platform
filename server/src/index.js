// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import paymentRoutes from "./routes/paymentRoutes.js";

// dotenv.config();

// const app = express();

// const PORT = process.env.PORT || 5000;
// const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// /* Middleware */
// app.use(
//   cors({
//     origin: CLIENT_URL,
//     credentials: true,
//   })
// );

// app.use(express.json());

// /* Test route */
// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Echoo backend server is running",
//   });
// });

// /* API health route */
// app.get("/api/health", (req, res) => {
//   res.json({
//     success: true,
//     message: "API is working",
//   });
// });

// /* Payment routes */
// app.use("/api/payments", paymentRoutes);

// /* Start server */
// app.listen(PORT, () => {
//   console.log(`Payment server running on http://localhost:${PORT}`);
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

/* Middleware */
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

/* Test route */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Echoo backend server is running",
  });
});

/* API health route */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
  });
});

/* Payment routes */
app.use("/api/payments", paymentRoutes);

/* Start server */
app.listen(PORT, () => {
  console.log(`Payment server running on http://localhost:${PORT}`);
});