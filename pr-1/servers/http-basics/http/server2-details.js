/**
 * Task 2: Display Request Details
 *
 * Requirements:
 *  - Show HTTP method
 *  - Show URL
 *  - Show HTTP version
 *  - Show request headers
 *  - Output must be HTML
 */

const http = require("http");

const server = http.createServer((req, res) => {
  const details = `
    <h1>Request Details</h1>
    <p><strong>Method:</strong> ${req.method}</p>
    <p><strong>URL:</strong> ${req.url}</p>
    <p><strong>HTTP Version:</strong> ${req.httpVersion}</p>
    <h2>Headers:</h2>
    <pre>${JSON.stringify(req.headers, null, 2)}</pre>
  `;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(details);
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
