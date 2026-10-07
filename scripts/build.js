const fs = require("node:fs"),
  path = require("node:path");
require("./cache-version");
const worker = fs.readFileSync("sw.js", "utf8");
const assets = [
  ...worker
    .match(/const ASSETS\s*=\s*(\[[^;]+\])/)[1]
    .matchAll(/["']([^"']+)["']/g),
].map((match) => match[1]);
const files = new Set([
  ...assets.map((url) => (url === "/" ? "index.html" : url.slice(1))),
  "sw.js",
  "robots.txt",
  "sitemap.xml",
]);
fs.mkdirSync("public", { recursive: true });
for (const file of files) {
  if (path.basename(file) !== file)
    throw Error("Only explicit root assets are allowed.");
  fs.copyFileSync(file, path.join("public", file));
}
console.log("Static studio built: " + files.size + " files.");
