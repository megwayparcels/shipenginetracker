require("dotenv").config();
const express = require("express");
const cors = require("cors");
const trackRoute = require("./track-route");

const app = express();
app.use(express.json());

// ✅ CORS settings go here
app.use(
  cors({
    origin: ["https://northampton.megwayparcels.co.uk"], // HubSpot site
  })
);

app.use(trackRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
