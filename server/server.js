const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const redirect_uri = "http://127.0.0.1:5000/callback"; // must match what you set in Spotify dashboard

// Step 1: Login endpoint - send user to Spotify authorization
app.get("/login", (req, res) => {
  const scope = "playlist-read-private playlist-modify-private playlist-modify-public";
  const auth_url = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
    response_type: "code",
    client_id,
    scope,
    redirect_uri
  });
  res.redirect(auth_url);
});

// Step 2: Callback - Spotify redirects here with code
app.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri,
       // client_id,
       // client_secret
      }),
      { headers: { 
        "Authorization" : "Basic " + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token } = response.data;

    // For now just send tokens back in browser (in real app you'd store securely)
    //res.json({ access_token, refresh_token });

   res.redirect(`http://127.0.0.1:3000/?access_token=${access_token}&refresh_token=${refresh_token}`);


  } catch (error) {
    console.error("Error exchanging code for token:", error.response?.data || error.message);
    res.status(500).send("Authentication failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
})

// Step 3: Refresh endpoint - get new token when expired
app.get("/refresh_token", async (req, res) => {
  const refresh_token = req.query.refresh_token;
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token,
        client_id,
        client_secret
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error refreshing token:", err.response?.data || err.message);
    res.status(500).send("Refresh failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
