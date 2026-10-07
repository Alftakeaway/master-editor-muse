const test = require("node:test"),
  assert = require("node:assert/strict");
const M = require("../core"),
  D = require("../desk-data"),
  X = require("../exports");
const fs = require("node:fs"),
  vm = require("node:vm");
function unpack(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength),
    files = new Map();
  let i = 0;
  while (view.getUint32(i, true) === 0x04034b50) {
    const size = view.getUint32(i + 18, true),
      nameSize = view.getUint16(i + 26, true),
      extra = view.getUint16(i + 28, true),
      name = new TextDecoder().decode(bytes.slice(i + 30, i + 30 + nameSize)),
      start = i + 30 + nameSize + extra,
      data = bytes.slice(start, start + size);
    assert.equal(X.crc32(data), view.getUint32(i + 14, true));
    assert.equal(view.getUint16(i + 8, true), 0);
    files.set(name, new TextDecoder().decode(data));
    i = start + size;
  }
  assert.equal(view.getUint32(i, true), 0x02014b50);
  return files;
}
test("all seven project templates are valid, editable and independent", () => {
  assert.equal(D.templates.length, 7);
  for (const t of D.templates) {
    const a = D.fromTemplate(t.id, "Prova", M),
      b = D.fromTemplate(t.id, "Altra", M);
    M.validate({ version: 2, active: a.id, projects: [a] });
    assert.notEqual(a.id, b.id);
    assert.notEqual(a.chapters[0].scenes[0].id, b.chapters[0].scenes[0].id);
    assert.equal(a.chapters[0].scenes[0].text, "");
  }
  assert.throws(() => D.fromTemplate("wrong", "Test", M));
});
test("resource catalog is unique, HTTPS and filterable without network", () => {
  assert.equal(D.resources.length, 17);
  assert.equal(new Set(D.resources.map((r) => r.id)).size, 17);
  for (const r of D.resources) assert.ok(r.url.startsWith("https://"));
  assert.ok(D.filterResources("italiano").length > 0);
  assert.equal(D.filterResources("", "", true, ["gutenberg"]).length, 1);
});
test("reference URLs reject scripts, credentials and malformed input", () => {
  for (const url of [
    "javascript:alert(1)",
    "file:///secret",
    "https://user:pass@example.com",
    "not url",
  ])
    assert.equal(D.safeURL(url), "");
  assert.equal(
    D.safeURL("https://example.com/book"),
    "https://example.com/book",
  );
});
test("reading notes and bookmarks roundtrip with new note identities", () => {
  const p = M.project("Novel");
  p.bookmarks = ["gutenberg"];
  p.readingNotes = [
    {
      id: M.uid(),
      resourceId: "gutenberg",
      title: "Opera",
      author: "Autore",
      url: "https://example.com/book",
      notes: "Scena da studiare",
      createdAt: new Date().toISOString(),
    },
  ];
  const db = { version: 2, active: p.id, projects: [p] };
  M.validate(db);
  const copy = M.parseImport(
    "backup.json",
    new TextEncoder().encode(JSON.stringify(db)),
  )[0];
  assert.notEqual(copy.readingNotes[0].id, p.readingNotes[0].id);
  assert.equal(copy.readingNotes[0].notes, p.readingNotes[0].notes);
  assert.deepEqual(copy.bookmarks, ["gutenberg"]);
  p.readingNotes[0].url = "javascript:alert(1)";
  assert.throws(() => M.validate(db));
});
test("DOCX is a CRC-valid package with escaped Unicode manuscript and headings", () => {
  const p = M.project("Titolo & storia", "Marta dice: <vero> & già.\n\nÈ qui.");
  p.author = "Autore";
  const files = unpack(X.docx(p));
  assert.ok(files.has("[Content_Types].xml"));
  assert.ok(files.get("word/document.xml").includes("&lt;vero&gt; &amp; già."));
  assert.ok(files.get("word/document.xml").includes("È qui."));
  assert.ok(files.get("word/styles.xml").includes("Heading1"));
  assert.ok(!files.get("word/document.xml").includes("<vero>"));
});
test("EPUB starts with uncompressed mimetype and has matching nav, spine and chapter files", () => {
  const p = M.project("Libro", "Caffè & pioggia");
  p.chapters.push({
    id: M.uid(),
    title: "Secondo",
    scenes: [M.makeScene("Fine", "Un esito.")],
  });
  const files = unpack(X.epub(p));
  assert.equal([...files.keys()][0], "mimetype");
  assert.equal(files.get("mimetype"), "application/epub+zip");
  assert.ok(files.get("EPUB/nav.xhtml").includes("chapter-2.xhtml"));
  assert.ok(files.get("EPUB/package.opf").includes('idref="c2"'));
  assert.ok(files.get("EPUB/chapter-1.xhtml").includes("Caffè &amp; pioggia"));
  assert.ok(files.get("META-INF/container.xml").includes("EPUB/package.opf"));
});
test("ZIP rejects traversal and checksum matches known vector", () => {
  assert.throws(() => X.zip([["../file", "bad"]]));
  assert.equal(X.crc32(new TextEncoder().encode("123456789")), 0xcbf43926);
});
test("service worker caches only app shell, never external resources, archives or API responses", async () => {
  const events = {},
    calls = [],
    context = vm.createContext({
      URL,
      Request: class {
        constructor(url) {
          this.url = url;
        }
      },
      self: {
        location: { origin: "https://studio.test" },
        addEventListener: (name, fn) => (events[name] = fn),
        clients: {
          claim: async () => {},
          matchAll: async () => [{ id: 1 }, { id: 2 }],
        },
        skipWaiting: async () => calls.push("activate"),
      },
      caches: {
        open: async () => ({
          addAll: async (requests) => calls.push(requests.map((r) => r.url)),
          match: async () => ({ cached: true }),
        }),
        keys: async () => [],
        delete: async () => {},
      },
      fetch: async () => ({ network: true }),
    });
  vm.runInContext(fs.readFileSync("sw.js", "utf8"), context);
  await new Promise((resolve, reject) =>
    events.install({ waitUntil: (p) => p.then(resolve, reject) }),
  );
  assert.ok(calls[0].includes("/index.html"));
  assert.ok(
    !calls[0].some(
      (x) => x.includes("archive") || x.includes("http") || x.includes("api"),
    ),
  );
  let handled = false;
  events.fetch({
    request: { method: "POST", url: "https://studio.test/api/editor" },
    respondWith() {
      handled = true;
    },
  });
  events.fetch({
    request: { method: "GET", url: "https://external.test/book" },
    respondWith() {
      handled = true;
    },
  });
  assert.equal(handled, false);
  let message;
  await new Promise((resolve, reject) =>
    events.message({
      data: { type: "ACTIVATE_IF_ALONE" },
      source: { postMessage: (m) => (message = m) },
      waitUntil: (p) => p.then(resolve, reject),
    }),
  );
  assert.equal(message.type, "OTHER_TABS");
  assert.ok(!calls.includes("activate"));
});
