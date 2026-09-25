const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DayMark API is running"
  });
});

// Routes
app.use("/api", routes);

// Error middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
