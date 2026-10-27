import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendDirectory = path.resolve(scriptDirectory, "..");
const backendDirectory = path.resolve(frontendDirectory, "../backend");
const viteCli = path.join(frontendDirectory, "node_modules/vite/bin/vite.js");
const children = new Set();
let closing = false;

function portIsOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port });
    socket.setTimeout(500);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => resolve(false));
  });
}

function start(label, args, cwd) {
  const child = spawn(process.execPath, args, {
    cwd,
    stdio: "inherit",
  });

  children.add(child);
  child.once("exit", (code, signal) => {
    children.delete(child);
    if (closing) return;

    if (code !== 0) {
      console.error(`${label} stopped unexpectedly (${signal || code}).`);
      shutdown(code || 1);
    }
  });

  return child;
}

function shutdown(exitCode = 0) {
  if (closing) return;
  closing = true;
  children.forEach((child) => child.kill("SIGTERM"));
  setTimeout(() => process.exit(exitCode), 100).unref();
}

if (!(await portIsOpen(5050))) {
  start("Backend", ["--watch", "src/server.js"], backendDirectory);
} else {
  console.log("Backend already running on http://127.0.0.1:5050");
}

start("Frontend", [viteCli], frontendDirectory);

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
