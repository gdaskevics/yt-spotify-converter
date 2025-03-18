const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const authRouter = require("./auth.js");
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("YouTube to Spotify Converter is running!");
});

app.post("/convert", async (req, res) => {
  try {
    const { youtubePlaylistUrl } = req.body;
    
    if (!youtubePlaylistUrl) {
      return res.status(400).json({ error: "YouTube playlist URL is required." });
    }


    res.json({ message: "Playlist conversion started!", youtubePlaylistUrl });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
