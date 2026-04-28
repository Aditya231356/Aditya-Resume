import http from "node:http";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const host = "127.0.0.1";
const outputFile = path.join(__dirname, "Aditya-Kumar-Ojha-Resume.pdf");

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".pdf", "application/pdf"]
]);

function getEdgePath() {
  const candidates = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
  ];

  return candidates.find((candidate) => existsSync(candidate));
}

function createServer(rootDir) {
  return http.createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url ?? "/", `http://${host}`);
      const pathname = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
      const filePath = path.resolve(rootDir, `.${pathname}`);

      if (!filePath.startsWith(rootDir)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }

      const extension = path.extname(filePath).toLowerCase();
      const file = await fs.readFile(filePath);
      res.writeHead(200, {
        "Content-Type": mimeTypes.get(extension) ?? "application/octet-stream",
        "Cache-Control": "no-store"
      });
      res.end(file);
    } catch (error) {
      const statusCode = error && "code" in error && error.code === "ENOENT" ? 404 : 500;
      res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(statusCode === 404 ? "Not found" : "Server error");
    }
  });
}

async function main() {
  const edgePath = getEdgePath();

  if (!edgePath) {
    throw new Error("Microsoft Edge was not found.");
  }

  const server = createServer(__dirname);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, host, resolve);
  });
  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Could not determine the local export server port.");
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      executablePath: edgePath,
      headless: true,
      args: ["--allow-file-access-from-files"]
    });

    const page = await browser.newPage();
    await page.goto(`http://${host}:${address.port}/index.html`, {
      waitUntil: "load"
    });
    await page.emulateMediaType("print");
    await page.pdf({
      path: outputFile,
      printBackground: true,
      format: "A4",
      landscape: false,
      preferCSSPageSize: true
    });

    console.log(`PDF exported to ${outputFile}`);
  } finally {
    await browser?.close();
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
