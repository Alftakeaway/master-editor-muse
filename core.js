/* Shared, dependency-free model. Usable in a browser and by Node tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Muse = api;
})(globalThis, function () {
  "use strict";
  const KEY = "museV2";
  const uid = () =>
    globalThis.crypto?.randomUUID?.() ||
    "m-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  const words = (text) => (String(text).match(/\S+/gu) || []).length;
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const day = () => new Date().toLocaleDateString("sv-SE");
  const makeScene = (title = "Nuova scena", text = "") => ({
    id: uid(),
    title,
    text,
    pov: "",
    date: "",
    location: "",
    status: "Prima stesura",
    synopsis: "",
    notes: "",
  });
  function project(title = "Nuovo romanzo", text = "") {
    return {
      id: uid(),
      title,
      genre: "Narrativa contemporanea",
      goal: 80000,
      dailyGoal: 500,
      chapters: [
        {
          id: uid(),
          title: "Capitolo 1",
          scenes: [makeScene("Scena 1", text)],
        },
      ],
      muse: {
        Premessa: "",
        Tema: "",
        Conflitto: "",
        "Posta in gioco": "",
        "E se…?": "",
        "Domanda editoriale": "",
      },
      bible: [],
      beats: [],
      publisher: {
        Genere: "",
        Lettore: "",
        Logline: "",
        Sinossi: "",
        Pitch: "",
        Query: "",
        "Comp titles": "",
        Percorso: "",
      },
      sessions: {},
      history: [],
      checklist: {},
      lastBackup: "",
    };
  }
  const record = (x) => x && typeof x === "object" && !Array.isArray(x);
  const text = (x) => typeof x === "string";
  const id = (x) =>
    text(x) && x.length > 0 && x.length < 200 && !/[\x00-\x1f]/.test(x);
  const textMap = (x) =>
    record(x) &&
    Object.entries(x).every(
      ([k, v]) =>
        !["__proto__", "prototype", "constructor"].includes(k) && text(v),
    );
  const goal = (x) => Number.isInteger(x) && x >= 1 && x <= 10000000;
  function validDate(value) {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value)) return false;
    const [date, time] = value.split("T"),
      [y, m, d] = date.split("-").map(Number),
      [h, min, sec = 0] = time.split(":").map(Number);
    const parsed = new Date(0);
    parsed.setUTCFullYear(y, m - 1, d);
    return (
      m >= 1 &&
      m <= 12 &&
      d >= 1 &&
      parsed.getUTCMonth() === m - 1 &&
      parsed.getUTCDate() === d &&
      h < 24 &&
      min < 60 &&
      sec < 60
    );
  }
  function validScene(s) {
    return (
      record(s) &&
      id(s.id) &&
      text(s.title) &&
      text(s.text) &&
      ["pov", "location", "status", "synopsis", "notes"].every(
        (k) => s[k] === undefined || text(s[k]),
      ) &&
      (s.date === undefined || (text(s.date) && validDate(s.date)))
    );
  }
  function validate(db) {
    if (!record(db) || db.version !== 2)
      throw Error("Versione del backup non supportata (richiesta v2).");
    if (
      !Array.isArray(db.projects) ||
      !db.projects.length ||
      db.projects.length > 500
    )
      throw Error("Elenco progetti non valido.");
    const projectIds = new Set();
    for (const p of db.projects) {
      if (
        !record(p) ||
        !id(p.id) ||
        projectIds.has(p.id) ||
        !text(p.title) ||
        !text(p.genre) ||
        !goal(p.goal) ||
        !goal(p.dailyGoal)
      )
        throw Error("Identità, titolo o obiettivi del progetto non validi.");
      projectIds.add(p.id);
      const ids = new Set();
      const take = (value) => {
        if (!id(value) || ids.has(value))
          throw Error("Identificativi duplicati o non validi nel progetto.");
        ids.add(value);
      };
      if (!Array.isArray(p.chapters) || !p.chapters.length)
        throw Error("Il progetto deve contenere almeno un capitolo.");
      for (const c of p.chapters) {
        if (
          !record(c) ||
          !text(c.title) ||
          !Array.isArray(c.scenes) ||
          !c.scenes.length
        )
          throw Error("Capitolo senza scene o non valido.");
        take(c.id);
        for (const s of c.scenes) {
          if (!validScene(s)) throw Error("Scena o data narrativa non valida.");
          take(s.id);
        }
      }
      if (!textMap(p.muse) || !textMap(p.publisher))
        throw Error("Schede Muse o Publisher non valide.");
      if (
        !Array.isArray(p.bible) ||
        !Array.isArray(p.beats) ||
        !Array.isArray(p.history)
      )
        throw Error("Story Bible, beat o versioni non validi.");
      for (const e of p.bible) {
        if (
          !record(e) ||
          !["Personaggio", "Luogo", "Oggetto", "Regola"].includes(e.type) ||
          !text(e.name) ||
          !text(e.notes)
        )
          throw Error("Scheda Story Bible non valida.");
        take(e.id);
      }
      for (const b of p.beats) {
        if (
          !record(b) ||
          !text(b.title) ||
          !text(b.notes) ||
          (b.act !== undefined && !text(b.act)) ||
          (b.sceneId !== undefined && !text(b.sceneId))
        )
          throw Error("Beat non valido.");
        take(b.id);
      }
      const historyIds = new Set();
      for (const h of p.history) {
        if (
          !record(h) ||
          !id(h.id) ||
          historyIds.has(h.id) ||
          !id(h.sceneId) ||
          !text(h.title) ||
          !text(h.text) ||
          !text(h.date) ||
          Number.isNaN(Date.parse(h.date))
        )
          throw Error("Versione del testo non valida.");
        if (
          h.scene !== undefined &&
          (!record(h.scene) || !validScene({ ...h.scene, text: h.text }))
        )
          throw Error("Metadati della versione non validi.");
        historyIds.add(h.id);
      }
      if (
        !record(p.sessions) ||
        !Object.entries(p.sessions).every(
          ([k, v]) => /^\d{4}-\d{2}-\d{2}$/.test(k) && Number.isFinite(v),
        )
      )
        throw Error("Statistiche giornaliere non valide.");
      if (
        p.checklist !== undefined &&
        (!record(p.checklist) ||
          !Object.entries(p.checklist).every(
            ([k, v]) =>
              !["__proto__", "constructor", "prototype"].includes(k) &&
              typeof v === "boolean",
          ))
      )
        throw Error("Checklist non valida.");
      if (p.lastBackup !== undefined && !text(p.lastBackup))
        throw Error("Data backup non valida.");
    }
    if (!projectIds.has(db.active))
      throw Error("Progetto attivo non presente nel backup.");
    return db;
  }
  function normalize(db) {
    validate(db);
    for (const p of db.projects) {
      p.checklist ??= {};
      p.lastBackup ??= "";
      for (const c of p.chapters)
        for (const s of c.scenes)
          for (const k of [
            "pov",
            "date",
            "location",
            "status",
            "synopsis",
            "notes",
          ])
            s[k] ??= "";
      for (const b of p.beats) {
        b.act ??= "Atto I";
        b.sceneId ??= "";
      }
    }
    return db;
  }
  function load(raw, legacy) {
    if (raw !== null) return normalize(JSON.parse(raw));
    const old = legacy ? JSON.parse(legacy) : null;
    if (old && (!text(old.text) || !text(old.title)))
      throw Error("Manoscritto precedente non valido.");
    const p = project(old?.title || "Il mio romanzo", old?.text || "");
    if (old) {
      p.genre = text(old.genre) ? old.genre : p.genre;
      p.goal = goal(Number(old.goal)) ? Number(old.goal) : p.goal;
    }
    return { version: 2, active: p.id, projects: [p] };
  }
  function cloneProject(p) {
    const copy = JSON.parse(JSON.stringify(p)),
      mapping = new Map();
    const remap = (old) => {
      if (!mapping.has(old)) mapping.set(old, uid());
      return mapping.get(old);
    };
    copy.id = uid();
    for (const c of copy.chapters) {
      c.id = remap(c.id);
      for (const s of c.scenes) s.id = remap(s.id);
    }
    for (const e of copy.bible) e.id = remap(e.id);
    for (const b of copy.beats) {
      b.id = remap(b.id);
      if (b.sceneId) b.sceneId = remap(b.sceneId);
    }
    for (const h of copy.history) {
      h.id = uid();
      h.sceneId = remap(h.sceneId);
      if (h.scene) h.scene.id = h.sceneId;
    }
    return copy;
  }
  function parseMarkdown(title, source) {
    const p = project(title);
    p.chapters = [];
    let chapter = null,
      s = null,
      fenced = false;
    const ensure = () => {
      if (!chapter) {
        chapter = { id: uid(), title: "Capitolo 1", scenes: [] };
        p.chapters.push(chapter);
      }
      if (!s) {
        s = makeScene("Scena 1");
        chapter.scenes.push(s);
      }
    };
    for (const line of source.replace(/^\uFEFF/, "").split(/\r?\n/)) {
      if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
      if (!fenced && /^# /.test(line)) {
        chapter = {
          id: uid(),
          title: line.slice(2).trim() || "Capitolo",
          scenes: [],
        };
        p.chapters.push(chapter);
        s = null;
      } else if (!fenced && /^## /.test(line)) {
        if (!chapter) {
          chapter = { id: uid(), title: "Capitolo 1", scenes: [] };
          p.chapters.push(chapter);
        }
        s = makeScene(line.slice(3).trim() || "Scena");
        chapter.scenes.push(s);
      } else {
        if (!s && !line.trim()) continue;
        ensure();
        s.text += (s.text ? "\n" : "") + line;
      }
    }
    for (const c of p.chapters) {
      if (!c.scenes.length) c.scenes.push(makeScene());
      for (const s of c.scenes) s.text = s.text.trim();
    }
    if (!p.chapters.length) p.chapters = project().chapters;
    return p;
  }
  function parseImport(name, bytes) {
    if (bytes.byteLength > 10000000)
      throw Error("File troppo grande: massimo 10 MB.");
    const ext = name.toLowerCase().match(/\.(json|txt|md)$/)?.[1];
    if (!ext) throw Error("Sono supportati solo JSON, TXT e Markdown.");
    const arr = new Uint8Array(bytes);
    if ((arr[0] === 0x50 && arr[1] === 0x4b) || arr.some((b) => b === 0))
      throw Error("Il file contiene dati binari, non testo UTF-8.");
    let source;
    try {
      source = new TextDecoder("utf-8", { fatal: true }).decode(arr);
    } catch {
      throw Error("Il file deve essere testo UTF-8.");
    }
    if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(source))
      throw Error("Il file contiene caratteri binari.");
    if (ext === "json")
      return normalize(JSON.parse(source)).projects.map(cloneProject);
    const title = name.replace(/\.(txt|md)$/i, "");
    return [
      ext === "md" ? parseMarkdown(title, source) : project(title, source),
    ];
  }
  function snapshot(p, s, kind = "manuale") {
    const { text: originalText, ...metadata } = s;
    p.history.unshift({
      id: uid(),
      sceneId: s.id,
      title: s.title,
      text: originalText,
      date: new Date().toISOString(),
      kind,
      scene: metadata,
    });
    const counts = new Map();
    p.history = p.history
      .filter((h) => {
        const n = (counts.get(h.sceneId) || 0) + 1;
        counts.set(h.sceneId, n);
        return n <= 30;
      })
      .slice(0, 300);
  }
  function setText(p, s, value) {
    p.sessions[day()] = (p.sessions[day()] || 0) + words(value) - words(s.text);
    s.text = value;
  }
  const STOP = new Set(
    "a ad al alla alle allo ai agli anche che chi ci come con da dal dalla dei del della delle di e è ed era gli ha hai hanno ho i il in io la le lo ma mi ne nel nella non o per più quale quando se si sono su sul tra tu un una uno vi".split(
      " ",
    ),
  );
  function analyze(source) {
    const tokens =
      source
        .toLocaleLowerCase("it")
        .match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)?/gu) || [];
    const sentences = source
      .split(/[.!?]+(?:[”"»])?(?:\s|$)/)
      .map((x) => x.trim())
      .filter(Boolean);
    const frequencies = new Map();
    for (const t of tokens)
      if (t.length > 2 && !STOP.has(t))
        frequencies.set(t, (frequencies.get(t) || 0) + 1);
    return {
      words: words(source),
      characters: source.length,
      paragraphs: source.split(/\n\s*\n/).filter((x) => x.trim()).length,
      readingMinutes: Math.ceil(words(source) / 200),
      longSentences: sentences.filter((x) => words(x) > 35),
      repetitions: [...frequencies]
        .filter(([, n]) => n >= 3)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12),
    };
  }
  class Store {
    constructor(storage) {
      this.storage = storage;
      this.baseline = storage.getItem(KEY);
      this.reason = "";
      this.dirty = false;
    }
    read() {
      try {
        return load(this.baseline, this.storage.getItem("museState"));
      } catch (error) {
        this.reason = "corrupt";
        this.error = error.message;
        const p = project();
        return { version: 2, active: p.id, projects: [p] };
      }
    }
    write(db) {
      if (this.reason) return false;
      try {
        if (this.storage.getItem(KEY) !== this.baseline) {
          this.reason = "conflict";
          return false;
        }
        validate(db);
        const serialized = JSON.stringify(db);
        this.storage.setItem(KEY, serialized);
        this.baseline = serialized;
        this.dirty = false;
        return true;
      } catch (error) {
        this.error = error.message;
        this.reason = "write";
        return false;
      }
    }
    retry() {
      if (this.reason === "write") this.reason = "";
    }
    recover() {
      const raw = this.storage.getItem(KEY);
      const db = load(raw, null);
      this.baseline = raw;
      this.reason = "";
      this.dirty = false;
      return db;
    }
  }
  return {
    KEY,
    uid,
    words,
    esc,
    day,
    makeScene,
    project,
    validate,
    normalize,
    load,
    cloneProject,
    parseMarkdown,
    parseImport,
    snapshot,
    setText,
    analyze,
    Store,
    validDate,
  };
});
