 const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const complaintRoutes = require("./routes/complaintRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
 
// Middleware
 // Middleware
app.use(cors({
  origin: "https://civic-fix-4.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));
// Routes
app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Civic Fix Backend is Running!");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});