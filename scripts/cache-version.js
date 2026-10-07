const fs = require("node:fs"),
  crypto = require("node:crypto");
const worker = fs.readFileSync("sw.js", "utf8");
const assets = [
  ...worker
    .match(/const ASSETS\s*=\s*(\[[^;]+\])/)[1]
    .matchAll(/["']([^"']+)["']/g),
].map((match) => match[1]);
const hash = crypto.createHash("sha256");
hash.update(
  worker.replace(
    /const VERSION\s*=\s*['"][^'"]+['"]/,
    "const VERSION='placeholder'",
  ),
);
for (const url of assets) {
  const file = url === "/" ? "index.html" : url.slice(1);
  hash.update(file).update(fs.readFileSync(file));
}
const value = "muse-shell-" + hash.digest("hex").slice(0, 16);
fs.writeFileSync(
  "sw.js",
  worker.replace(
    /const VERSION\s*=\s*['"][^'"]+['"]/,
    `const VERSION='${value}'`,
  ),
);
console.log(value);
