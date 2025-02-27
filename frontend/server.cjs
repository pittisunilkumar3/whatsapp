const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Check if dist directory exists
if (!fs.existsSync('./dist')) {
  console.error('Error: dist directory not found!');
  console.error('Please make sure to build the application before running the server.');
  process.exit(1);
}

// Serve static files from the dist directory
app.use(express.static('./dist'));

// For any request that doesn't match a static file, send the index.html
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: './dist' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
