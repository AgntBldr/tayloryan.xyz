import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "DEPLOY_PUBLIC");
const port = Number(process.argv[3] ?? 4173);
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"]
]);

function resolveRequest(urlPath) {
  const decoded = decodeURIComponent(urlPath).replaceAll("\\", "/");
  const relative = decoded.endsWith("/") ? `${decoded}index.html` : decoded;
  const candidate = path.resolve(root, `.${relative}`);
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) return null;
  return candidate;
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "127.0.0.1"}`);
    let file = resolveRequest(url.pathname);
    if (!file) throw Object.assign(new Error("Invalid path"), { code: "ENOENT" });
    try {
      const stat = await fs.stat(file);
      if (stat.isDirectory()) file = path.join(file, "index.html");
    } catch {
      if (!path.extname(file)) file = path.join(file, "index.html");
    }
    const content = await fs.readFile(file);
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": mimeTypes.get(path.extname(file).toLowerCase()) ?? "application/octet-stream"
    });
    response.end(content);
  } catch {
    try {
      const fallback = await fs.readFile(path.join(root, "404.html"));
      response.writeHead(404, { "Cache-Control": "no-store", "Content-Type": "text/html; charset=utf-8" });
      response.end(fallback);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
    }
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}`);
});
