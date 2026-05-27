require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

const API_KEY = process.env.OPENWEATHER_API_KEY;

app.get('/weather/current', async (req, res) => {
  const city = req.query.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch current weather' });
  }
});

app.get('/weather/forecast', async (req, res) => {
  const city = req.query.city;
  const days = req.query.days || 3;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${days * 8}&appid=${API_KEY}&units=metric`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
});

app.get('/weather/alerts', async (req, res) => {
  const city = req.query.city;
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
  try {
    const geoRes = await axios.get(geoUrl);
    const { lat, lon } = geoRes.data[0];
    const alertUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const alertRes = await axios.get(alertUrl);
    res.json(alertRes.data.alerts || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));