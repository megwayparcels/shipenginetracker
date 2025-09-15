require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// ✅ Allow your domain(s)
app.use(
  cors({
    origin: [
      "https://northampton.megwayparcels.co.uk",
      "http://localhost:3000"
    ],
  })
);

app.use(express.json());

// --- POST /track (for Postman or frontend fetch) ---
app.post("/track", async (req, res) => {
  try {
    const { tracking_number } = req.body;

    if (!tracking_number) {
      return res.status(400).json({ error: "Tracking number is required" });
    }

    const response = await axios.get(
      `https://api.shipengine.com/v1/tracking?tracking_number=${tracking_number}`,
      {
        headers: {
          "API-Key": process.env.SHIPENGINE_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Tracking error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch tracking info",
      details: error.response?.data || error.message,
    });
  }
});

// --- ✅ NEW: GET /track?tracking_number=123 ---
app.get("/track", async (req, res) => {
  try {
    const { tracking_number } = req.query;

    if (!tracking_number) {
      return res.status(400).json({ error: "Tracking number is required" });
    }

    const response = await axios.get(
      `https://api.shipengine.com/v1/tracking?tracking_number=${tracking_number}`,
      {
        headers: {
          "API-Key": process.env.SHIPENGINE_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Tracking error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch tracking info",
      details: error.response?.data || error.message,
    });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
