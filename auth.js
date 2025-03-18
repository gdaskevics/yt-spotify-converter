require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const router = express.Router();
router.use(cookieParser());

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "https://yt-spotify-converter-production.up.railway.app/callback";

console.log("SPOTIFY_CLIENT_ID =>", SPOTIFY_CLIENT_ID);

const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// 1️⃣ Login Route
router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie('spotify_auth_state', state);

  const scope = "playlist-modify-public playlist-modify-private";
  const authURL = "https://accounts.spotify.com/authorize?" + querystring.stringify({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
    state
  });

  res.redirect(authURL);
});

// 2️⃣ Callback Route (Handles Token Exchange)
router.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

  if (state === null || state !== storedState) {
    return res.redirect('/error?message=state_mismatch');
  }

  res.clearCookie('spotify_auth_state');

  const tokenData = {
    code,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_CLIENT_SECRET
  };

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token',
      querystring.stringify(tokenData),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    res.redirect('/success?access_token=' + response.data.access_token);
  } catch (error) {
    res.redirect('/error?message=token_error');
  }
});

module.exports = router;
