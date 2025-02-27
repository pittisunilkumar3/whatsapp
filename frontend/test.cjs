const http = require('http');

// Create a very simple HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Node.js Test Server</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          line-height: 1.6;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        h1 {
          color: #333;
        }
        .success {
          color: green;
          font-weight: bold;
        }
        .info {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Node.js Test Server</h1>
        <p class="success">✅ Node.js is working correctly!</p>
        
        <div class="info">
          <p><strong>Server Information:</strong></p>
          <ul>
            <li>Node.js Version: ${process.version}</li>
            <li>Platform: ${process.platform}</li>
            <li>Architecture: ${process.arch}</li>
            <li>Process ID: ${process.pid}</li>
            <li>Current Directory: ${process.cwd()}</li>
          </ul>
        </div>
        
        <p>If you can see this page, your Node.js server is running correctly on cPanel.</p>
        <p>You can now proceed with deploying your full application.</p>
      </div>
    </body>
    </html>
  `);
});

// Listen on the specified port
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}/`);
});
