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

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end("<h1>Hello World</h1>");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
