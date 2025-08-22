 const express = require('express');

const axios = require('axios');

require('dotenv').config();

 

const app = express();

const PORT = process.env.PORT || 5000;

 

app.get('/token', async (req, res) => {

  try {

    const response = await axios.post('https://accounts.spotify.com/api/token', null, {

      params: {

        grant_type: 'client_credentials'

      },

      headers: {

        Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,

        'Content-Type': 'application/x-www-form-urlencoded'

      }

    });

 

    res.json({ token: response.data.access_token });

  } catch (error) {

    console.error('Error fetching token:', error.response?.data || error.message);

    res.status(500).send('Failed to retrieve token');

  }

});

 

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});