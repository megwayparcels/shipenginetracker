require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// CORS: allow your HubSpot domain(s)
const allowedOrigins = [
  "https://northampton.megwayparcels.co.uk",
  "https://megwayparcels.co.uk",
  "https://northampton.megwayparcels.co.uk/track-your-parcel",
  "http://localhost:3000" // for local testing
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());

// Optional root route
app.get("/", (req, res) => {
  res.send("ShipEngine Tracker API is running. Use /track endpoint.");
});

// POST /track route with auto carrier detection
app.post("/track", async (req, res) => {
  const { tracking_number, carrier_code } = req.body;

  if (!tracking_number) {
    return res.status(400).json({ error: "tracking_number is required" });
  }

  try {
    // ShipEngine auto-detect carrier if carrier_code is not provided
    const url = `https://api.shipengine.com/v1/tracking?tracking_number=${tracking_number}` +
                (carrier_code ? `&carrier_code=${carrier_code}` : "");

    const response = await axios.get(url, {
      headers: { "API-Key": process.env.SHIPENGINE_API_KEY }
    });

    // ShipEngine returns an array of tracking objects
    const trackingInfo = response.data.tracking[0] || {};
    const status = trackingInfo.status || "N/A";
    const events = trackingInfo.events || [];

    res.json({ status, events });

  } catch (error) {
    console.error("ShipEngine API error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch tracking info",
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
