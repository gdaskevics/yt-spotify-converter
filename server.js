require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.get("/", (req, res) => {
    res.send("YouTube to Spotify Playlist Converter is running!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
