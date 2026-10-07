const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const M = require("../core");
function memory(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => (data[k] = v),
  };
}
function fixture() {
  const p = M.project("Romanzo", "Uno due tre");
  return { version: 2, active: p.id, projects: [p] };
}
const bytes = (source) => new TextEncoder().encode(source);
test("legacy migration preserves complete text, title, genre and target", () => {
  const db = M.load(
    null,
    JSON.stringify({
      title: "Legacy",
      text: "Uno\n\ndue tre",
      goal: 90000,
      genre: "Fantasy",
    }),
  );
  const p = db.projects[0];
  assert.equal(p.chapters[0].scenes[0].text, "Uno\n\ndue tre");
  assert.equal(p.goal, 90000);
  assert.equal(p.genre, "Fantasy");
  assert.equal(M.words(p.chapters[0].scenes[0].text), 3);
});
test("old v2 archives gain optional tools fields without changing manuscript or IDs", () => {
  const db = fixture(),
    s = db.projects[0].chapters[0].scenes[0],
    id = s.id;
  delete s.synopsis;
  delete s.notes;
  delete db.projects[0].checklist;
  M.normalize(db);
  assert.equal(s.id, id);
  assert.equal(s.text, "Uno due tre");
  assert.equal(s.synopsis, "");
  assert.deepEqual(db.projects[0].checklist, {});
});
test("projects remain isolated and persist across reload", () => {
  const storage = memory(),
    store = new M.Store(storage),
    db = store.read(),
    second = M.project("Secondo", "testo nuovo");
  db.projects.push(second);
  db.active = second.id;
  assert.equal(store.write(db), true);
  const fresh = new M.Store(storage).read();
  assert.equal(fresh.projects.length, 2);
  assert.equal(fresh.projects[1].title, "Secondo");
  assert.equal(fresh.active, second.id);
});
test("corrupt archives are preserved and writing remains blocked", () => {
  const storage = memory({ [M.KEY]: "{bad" }),
    store = new M.Store(storage),
    db = store.read();
  assert.equal(store.reason, "corrupt");
  assert.equal(store.write(db), false);
  assert.equal(storage.data[M.KEY], "{bad");
});
test("concurrent tab update cannot be overwritten, even before a storage event", () => {
  const storage = memory(),
    first = new M.Store(storage),
    db = first.read();
  first.write(db);
  const second = new M.Store(storage),
    changed = second.read();
  changed.projects[0].title = "Other tab";
  second.write(changed);
  db.projects[0].title = "Local changes";
  assert.equal(first.write(db), false);
  assert.equal(first.reason, "conflict");
  assert.equal(
    JSON.parse(storage.getItem(M.KEY)).projects[0].title,
    "Other tab",
  );
  assert.equal(first.recover().projects[0].title, "Other tab");
  assert.equal(first.reason, "");
});
test("quota failures preserve dirty state and can be retried", () => {
  const storage = memory(),
    store = new M.Store(storage),
    db = store.read(),
    set = storage.setItem;
  store.dirty = true;
  storage.setItem = () => {
    throw Error("quota");
  };
  assert.equal(store.write(db), false);
  assert.equal(store.dirty, true);
  storage.setItem = set;
  store.retry();
  assert.equal(store.write(db), true);
  assert.equal(store.dirty, false);
});
test("JSON import remaps every identity and preserves scene, beat and history links", () => {
  const db = fixture(),
    p = db.projects[0],
    s = p.chapters[0].scenes[0];
  p.beats = [
    { id: M.uid(), title: "Svolta", act: "I", notes: "", sceneId: s.id },
  ];
  M.snapshot(p, s);
  const imported = M.parseImport("backup.json", bytes(JSON.stringify(db)))[0];
  assert.notEqual(imported.id, p.id);
  assert.notEqual(imported.chapters[0].scenes[0].id, s.id);
  assert.equal(imported.beats[0].sceneId, imported.chapters[0].scenes[0].id);
  assert.equal(imported.history[0].sceneId, imported.chapters[0].scenes[0].id);
  assert.equal(imported.chapters[0].scenes[0].text, s.text);
});
test("import rejects invalid goals, empty scenes, duplicate IDs and malformed history", () => {
  for (const mutate of [
    (db) => (db.projects[0].goal = 0),
    (db) => (db.projects[0].chapters[0].scenes = []),
    (db) =>
      db.projects[0].chapters[0].scenes.push({
        ...db.projects[0].chapters[0].scenes[0],
      }),
    (db) => (db.projects[0].history = [{ id: "bad" }]),
  ]) {
    const db = fixture();
    mutate(db);
    assert.throws(() => M.parseImport("bad.json", bytes(JSON.stringify(db))));
  }
});
test("import rejects renamed binary, unsupported types, non UTF-8 and oversized files", () => {
  assert.throws(() =>
    M.parseImport("bad.txt", new Uint8Array([0x50, 0x4b, 3, 4])),
  );
  assert.throws(() => M.parseImport("bad.md", new Uint8Array([0xff, 0xff])));
  assert.throws(() => M.parseImport("bad.docx", bytes("Text")));
  assert.throws(() => M.parseImport("big.txt", new Uint8Array(10000001)));
});
test("Markdown import separates chapters and scenes without parsing fenced headings", () => {
  const p = M.parseImport(
    "novel.md",
    bytes(
      "# Uno\n## Scena A\nTesto A\n## Scena B\n```\n# non capitolo\n```\n# Due\nTesto B",
    ),
  )[0];
  assert.equal(p.chapters.length, 2);
  assert.equal(p.chapters[0].scenes.length, 2);
  assert.ok(p.chapters[0].scenes[1].text.includes("# non capitolo"));
  assert.equal(p.chapters[1].scenes[0].text, "Testo B");
});
test("versions retain 30 per scene, cap project archive, and preserve originals", () => {
  const p = M.project(),
    a = p.chapters[0].scenes[0],
    b = M.makeScene();
  p.chapters[0].scenes.push(b);
  for (let i = 0; i < 40; i++) {
    a.text = "Version " + i;
    M.snapshot(p, a);
  }
  M.snapshot(p, b);
  assert.equal(p.history.filter((h) => h.sceneId === a.id).length, 30);
  assert.equal(p.history.filter((h) => h.sceneId === b.id).length, 1);
  a.text = "Changed";
  assert.equal(p.history.find((h) => h.sceneId === a.id).text, "Version 39");
  for (let i = 0; i < 310; i++) M.snapshot(p, M.makeScene());
  assert.equal(p.history.length, 300);
});
test("net daily count includes negative edits and restores", () => {
  const p = M.project("Novel", "one two three"),
    s = p.chapters[0].scenes[0];
  M.setText(p, s, "one");
  assert.equal(p.sessions[M.day()], -2);
  M.setText(p, s, "one two three four");
  assert.equal(p.sessions[M.day()], 1);
});
test("dates reject impossible days and invalid hours", () => {
  assert.equal(M.validDate("2024-02-29T19:30"), true);
  for (const d of [
    "2025-02-29T12:00",
    "2026-04-31T12:00",
    "2026-10-07T25:00",
    "tomorrow",
  ])
    assert.equal(M.validDate(d), false);
});
test("text tools support Italian words and do not count common stop words as repetitions", () => {
  const a = M.analyze(
    "Marta guarda la lettera. Marta apre la lettera. Marta chiude la lettera.",
  );
  assert.ok(a.repetitions.some(([t, n]) => t === "lettera" && n === 3));
  assert.ok(!a.repetitions.some(([t]) => t === "la"));
  assert.equal(a.readingMinutes, 1);
  assert.equal(
    M.esc('<img src=x onerror="alert(1)">'),
    "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
  );
});
test("UUID fallback works when crypto.randomUUID is unavailable", () => {
  const context = vm.createContext({ Date, Math, globalThis: {} });
  vm.runInContext(fs.readFileSync("core.js", "utf8"), context);
  const a = context.globalThis.Muse.uid(),
    b = context.globalThis.Muse.uid();
  assert.notEqual(a, b);
});
// Boot all screens against a small DOM adapter; real browser checks supplement this.
function boot(initial = {}) {
  const storage = memory(initial),
    elements = new Map();
  const element = (id) => {
    if (!elements.has(id))
      elements.set(id, {
        textContent: "",
        innerHTML: "",
        hidden: false,
        dataset: {},
        addEventListener() {},
        querySelectorAll() {
          return [];
        },
      });
    return elements.get(id);
  };
  const context = vm.createContext({
    Muse: M,
    WriterPaths: require("../paths-data"),
    localStorage: storage,
    document: {
      querySelector: element,
      querySelectorAll: () => [],
      addEventListener() {},
      body: { classList: { toggle() {} } },
    },
    window: { addEventListener() {} },
    console,
    Date,
    setTimeout,
    clearTimeout,
  });
  vm.runInContext(fs.readFileSync("paths-ui.js", "utf8"), context);
  vm.runInContext(fs.readFileSync("app.js", "utf8"), context);
  return { context, storage, run: (code) => vm.runInContext(code, context) };
}
test("all active views render with escaping and no AI calls", () => {
  const db = fixture();
  db.projects[0].title = "<script>alert(1)</script>";
  const app = boot({ [M.KEY]: JSON.stringify(db) });
  for (const v of [
    "home",
    "studio",
    "board",
    "muse",
    "characters",
    "architecture",
    "editor",
    "continuity",
    "publisher",
    "tools",
    "paths",
  ]) {
    const html = app.run(`views.${v}()`);
    assert.equal(html.includes("data-ai="), false);
    assert.equal(html.includes("<script>alert"), false);
  }
  assert.equal(
    fs.readFileSync("app.js", "utf8").includes("fetch('/api/editor'"),
    false,
  );
});
const handler = require("../archive/ai/editor");
async function call(body = {}, authorization = "Bearer test") {
  let status = 200,
    result;
  const res = {
    setHeader() {},
    status(code) {
      status = code;
      return this;
    },
    json(value) {
      result = value;
    },
  };
  await handler({ method: "POST", headers: { authorization }, body }, res);
  return { status, result };
}
test("archived AI refuses unconfigured server, unauthorized clients and invalid input", async () => {
  const old = { ...process.env };
  try {
    delete process.env.OPENAI_API_KEY;
    delete process.env.EDITOR_ACCESS_TOKEN;
    assert.equal((await call()).status, 503);
    process.env.OPENAI_API_KEY = "server-secret";
    process.env.EDITOR_ACCESS_TOKEN = "test";
    assert.equal((await call({}, "Bearer bad")).status, 401);
    assert.equal((await call({ mode: "bad", text: "text" })).status, 400);
  } finally {
    process.env = old;
  }
});
test("archived AI uses server-only secret and prevents developmental replacement", async () => {
  const old = { ...process.env },
    original = global.fetch;
  try {
    process.env.OPENAI_API_KEY = "server-secret";
    process.env.EDITOR_ACCESS_TOKEN = "test";
    global.fetch = async (url, options) => {
      assert.equal(options.headers.Authorization, "Bearer server-secret");
      assert.equal(JSON.parse(options.body).store, false);
      return {
        ok: true,
        json: async () => ({
          status: "completed",
          output: [
            {
              content: [
                {
                  type: "output_text",
                  text: JSON.stringify({
                    analysis: "Diagnosi",
                    replacement: "No",
                  }),
                },
              ],
            },
          ],
        }),
      };
    };
    const result = await call({
      mode: "developmental",
      text: "manoscritto",
      context: {},
    });
    assert.equal(result.status, 200);
    assert.equal(result.result.replacement, null);
  } finally {
    global.fetch = original;
    process.env = old;
  }
});
test("Markdown exported spacing does not create extra blank scenes", () => {
  const p = M.parseMarkdown(
    "Novel",
    "# Capitolo\n\n## Scena\n\nTesto\n\n# Altro\n\n## Fine\n\nFinale",
  );
  assert.equal(p.chapters.length, 2);
  assert.equal(p.chapters[0].scenes.length, 1);
  assert.equal(p.chapters[1].scenes.length, 1);
});
test("versions preserve scene metadata for deleted-scene recovery", () => {
  const p = M.project(),
    s = p.chapters[0].scenes[0];
  s.notes = "Important";
  s.date = "2026-10-07T12:00";
  M.snapshot(p, s, "eliminata");
  s.notes = "Changed";
  assert.equal(p.history[0].scene.notes, "Important");
  assert.equal(p.history[0].scene.date, "2026-10-07T12:00");
});
