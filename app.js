const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_GATEWAY_URL = process.env.API_GATEWAY_URL;

app.get('/list-files', async (req, res) => {
  try {
    // Fetch data dari API Gateway
    const response = await axios.get(API_GATEWAY_URL);

    // Parsing XML ke JSON
    const parser = new xml2js.Parser({ explicitArray: false });
    const jsonData = await parser.parseStringPromise(response.data);

    // Ekstrak bucket names
    const buckets = jsonData.ListAllMyBucketsResult.Buckets.Bucket;
    const bucketNames = Array.isArray(buckets)
      ? buckets.map(bucket => bucket.Name)
      : [buckets.Name]; // Jika hanya ada 1 bucket, tetap buat array

    // Kirimkan hasil sebagai respon
    res.send(`Your bucket is: ${bucketNames.join(', ')}`);
  } catch (error) {
    console.error('Error fetching or parsing data:', error.message);
    res.status(500).send('Failed to fetch or process data');
  }
});

// Endpoint untuk status
app.get('/status', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
