// server.js
const express = require('express');
const fetch = require('node-fetch'); // node 18+ bisa pakai global fetch
const rateLimit = require('express-rate-limit');
const app = express();

app.use(express.json());

// rate limiter dasar
const limiter = rateLimit({
  windowMs: 1000 * 60, // 1 menit
  max: 60, // max 60 request per IP per window
  message: 'Terlalu banyak request, coba lagi nanti.'
});
app.use(limiter);

// endpoint proxy
app.post('/api/fetch', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url' });

    // contoh: panggil tikwm
    const apiURL = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const r = await fetch(apiURL, { headers: { 'User-Agent': 'TikSaver/1.0' }});
    const json = await r.json();

    // optional: sanitasi response atau cache
    return res.json(json);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// serve static (jika ingin gabung frontend + backend)
const path = require('path');
app.use(express.static(path.join(__dirname, 'public'))); // taruh index.html dll di folder public

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
