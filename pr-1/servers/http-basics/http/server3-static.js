/**
 * Task 3: Serve HTML + static assets
 *
 * Requirements:
 *  - Serve an HTML CV page at '/'
 *  - Serve CSS / JS / images
 *  - Use only built-in http + fs modules
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const PORT = process.env.HTTP3_PORT || 3103;

const publicDir = path.join(__dirname, "public");

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("404 Not Found");
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    return serveFile(res, path.join(publicDir, "index.html"), "text/html");
  }

  if (req.url.endsWith(".css")) {
    return serveFile(res, path.join(publicDir, req.url), "text/css");
  }

  if (req.url.endsWith(".js")) {
    return serveFile(
      res,
      path.join(publicDir, req.url),
      "application/javascript"
    );
  }

  if (req.url.endsWith(".png") || req.url.endsWith(".jpg")) {
    return serveFile(res, path.join(publicDir, req.url), "image/png");
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
});
