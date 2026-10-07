const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

try {
  process.loadEnvFile(".env.local");
} catch {}
const files = {
  "/": "index.html",
  "/index.html": "index.html",
  "/app.js": "app.js",
  "/core.js": "core.js",
  "/style.css": "style.css",
  "/icon.svg": "icon.svg",
};
http
  .createServer(async (req, res) => {
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (value) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(value));
    };
    if (req.url === "/api/editor") {
      let body = "";
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 300000)
          return res.status(413).json({ error: "Richiesta troppo grande" });
      }
      return res.status(410).json({ error: "Integrazione AI archiviata." });
    }
    const file = files[req.url?.split("?")[0]];
    if (!file) {
      res.statusCode = 404;
      return res.end("Not found");
    }
    res.setHeader(
      "Content-Type",
      file.endsWith(".svg")
        ? "image/svg+xml"
        : file.endsWith(".js")
          ? "text/javascript"
          : file.endsWith(".css")
            ? "text/css"
            : "text/html",
    );
    fs.createReadStream(path.join(__dirname, file)).pipe(res);
  })
  .listen(Number(process.env.PORT) || 8080, "127.0.0.1", () =>
    console.log(
      "Studio: http://localhost:" + (Number(process.env.PORT) || 8080),
    ),
  );
