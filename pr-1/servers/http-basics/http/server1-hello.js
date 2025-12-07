/**
 * Task 1: Simple HTTP Server
 *
 * Requirements:
 *  - Use built-in `http` module
 *  - Listen on port 3000
 *  - For GET http://localhost:3000/ return:
 *      <h1>Hello World</h1>
 */

const http = require("http");
require("dotenv").config();

const PORT = process.env.HTTP1_PORT || 3101;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end("<h1>Hello World</h1>");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
