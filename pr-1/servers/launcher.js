/**
 * Launcher — unified entry point for all servers in the project.
 *
 * Reads .env and starts:
 *  - Express API (server.js)
 *  - HTTP basic servers
 */

require("dotenv").config();
const { spawn } = require("child_process");
const path = require("path");

const mode = process.env.SERVER_MODE || "express";

function run(script) {
  const fullPath = path.join(__dirname, script);
  console.log(`\n Starting: ${fullPath}\n`);

  const child = spawn("node", [fullPath], {
    stdio: "inherit",
    env: process.env,
  });

  child.on("close", (code) => {
    console.log(`Process exited with code ${code}`);
  });

  child.on("error", (err) => {
    console.error("Failed to start process", err);
  });
}

switch (mode) {
  case "express":
    run("express-api/server.js");
    break;

  case "http1":
    run("http-basics/http/server1-hello.js");
    break;

  case "http2":
    run("http-basics/http/server2-details.js");
    break;

  case "http3":
    run("http-basics/http/server3-static.js");
    break;

  default:
    console.error(`Unknown SERVER_MODE: ${mode}`);
}
