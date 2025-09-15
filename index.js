require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Allow only specific domains (multiple supported)
app.use(cors({
  origin: [
    "https://northampton.megwayparcels.co.uk", // HubSpot site
    "http://localhost:3000" // local testing
  ]
}));

app.use(express.json());

// ✅ GET route - test only
app.get("/track", (req, res) => {
  res.json({ message: "Tracking endpoint is live. Use POST with tracking_number & carrier_code to track a parcel." });
});

// ✅ POST route - actual ShipEngine tracking
app.post("/track", async (req, res) => {
  const { tracking_number, carrier_code } = req.body;

  if (!tracking_number || !carrier_code) {
    return res.status(400).json({ error: "tracking_number and carrier_code are required" });
  }

  try {
    const response = await axios.get(
      `https://api.shipengine.com/v1/tracking?carrier_code=${carrier_code}&tracking_number=${tracking_number}`,
      {
        headers: {
          "API-Key": process.env.SHIPENGINE_API_KEY
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("ShipEngine API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch tracking info", details: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
