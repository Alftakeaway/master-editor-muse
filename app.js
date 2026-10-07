"use strict";
const { KEY, uid, words, esc, day, project, makeScene, analyze, parseImport } =
  Muse;
let store;
try {
  store = new Muse.Store(localStorage);
} catch (error) {
  store = new Muse.Store({
    getItem: () => null,
    setItem: () => {
      throw error;
    },
  });
  store.reason = "write";
}
let db = store.read(),
  view = "home",
  sceneId = null,
  focusMode = false,
  fieldSequence = 0;
let saveTimer,
  noteTimer,
  sprintTimer,
  sprintEnd = 0,
  sprintRemaining = 0,
  sprintStartWords = 0,
  sprintProjectId = null;
const undoStacks = new Map(),
  editGroups = new Map(),
  main = document.querySelector("#main");
const current = () =>
  db.projects.find((p) => p.id === db.active) || db.projects[0];
const scenes = () => current().chapters.flatMap((c) => c.scenes);
const scene = () => scenes().find((s) => s.id === sceneId) || scenes()[0];
const total = () => scenes().reduce((n, s) => n + words(s.text), 0);
const notice = (message) =>
  (document.querySelector("#notice").textContent = message);
const status = (message) =>
  (document.querySelector("#saveStatus").textContent = message);
const recoveryControls = () =>
  (document.querySelector("#recoveryControls").hidden = !store.reason);
function flush() {
  clearTimeout(saveTimer);
  if (!store.dirty && !store.reason) return true;
  const ok = store.write(db);
  status(
    ok
      ? "✓ Salvato sul dispositivo · " + new Date().toLocaleTimeString("it-IT")
      : "⚠ Salvataggio sospeso",
  );
  if (!ok)
    notice(
      {
        corrupt:
          "Archivio non leggibile: conserva una copia prima di ripristinare.",
        conflict:
          "Un’altra scheda ha modificato i progetti. Esporta il lavoro locale e carica i dati aggiornati.",
        write:
          "Spazio o accesso al salvataggio insufficiente. Esporta subito un backup e riprova.",
      }[store.reason],
    );
  recoveryControls();
  return ok;
}
function save(immediate = false) {
  store.dirty = true;
  status("● Modifiche da salvare…");
  clearTimeout(saveTimer);
  if (immediate) return flush();
  saveTimer = setTimeout(flush, 350);
}
const snapshot = (s, kind = "manuale") => Muse.snapshot(current(), s, kind);
function download(name, text, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type })),
    a = document.createElement("a");
  a.href = url;
  a.download = name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "-");
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const button = (label, action, extra = "") =>
  `<button class="btn" data-action="${esc(action)}" ${extra}>${label}</button>`;
const head = (k, t, s) =>
  `<div class="hero"><div><div class="eyebrow">${esc(k)}</div><h1>${esc(t)}</h1><div class="sub">${s}</div></div>${button("Esporta progetto", "export")}</div>`;
function field(label, key, value, type = "text", scope = "project") {
  const id = "field-" + ++fieldSequence,
    attrs = `id="${id}" data-scope="${esc(scope)}" data-key="${esc(key)}"`;
  const control =
    type === "textarea"
      ? `<textarea ${attrs}>${esc(value)}</textarea>`
      : `<input ${attrs} type="${type}" value="${esc(value)}" ${type === "number" ? 'min="1" max="10000000" step="1" required' : ""}>`;
  return `<div class="field"><label for="${id}">${esc(label)}</label>${control}</div>`;
}
const fields = (obj, scope) =>
  `<div class="section-grid">${Object.entries(obj)
    .map(
      ([k, v]) =>
        `<div class="card">${field(k, k, v, "textarea", scope)}</div>`,
    )
    .join("")}</div>`;
function ask({ title, message = "", value, confirmLabel = "Conferma" }) {
  const d = document.querySelector("#actionDialog"),
    previous = document.activeElement;
  d.innerHTML = `<form id="actionForm"><h2 id="actionTitle">${esc(title)}</h2><p>${esc(message)}</p>${value !== undefined ? '<label for="dialogValue">Titolo</label><input id="dialogValue" maxlength="200" required value="' + esc(value) + '">' : ""}<div class="dialog-actions"><button type="button" class="btn" id="dialogCancel">Annulla</button><button type="submit" class="btn primary">${esc(confirmLabel)}</button></div></form>`;
  return new Promise((resolve) => {
    const finish = (result) => {
      d.close();
      d.oncancel = null;
      if (previous?.isConnected) previous.focus();
      resolve(result);
    };
    d.querySelector("#dialogCancel").onclick = () => finish(null);
    d.oncancel = (e) => {
      e.preventDefault();
      finish(null);
    };
    d.querySelector("#actionForm").onsubmit = (e) => {
      e.preventDefault();
      const result =
        value !== undefined
          ? d.querySelector("#dialogValue").value.trim()
          : true;
      if (result) finish(result);
    };
    d.showModal();
    d.querySelector(value !== undefined ? "input" : "#dialogCancel").focus();
  });
}
const views = {
  home() {
    const p = current(),
      n = total(),
      pct = Math.min(100, Math.round((n / p.goal) * 100));
    const checks = [
      ["Imposta la direzione della storia", !!p.muse.Premessa, "muse"],
      ["Scrivi la prima scena", n > 0, "studio"],
      ["Costruisci la Story Bible", p.bible.length > 0, "characters"],
      ["Conserva un backup", !!p.lastBackup, "backup"],
    ];
    return `${head("IL TUO STUDIO", "Scrivi con coraggio.", "Riscrivi con precisione.")}<div class="project"><div class="card"><div class="eyebrow">PROGETTO ATTIVO</div><h2>${esc(p.title)}</h2><p>${esc(p.genre)} · ${scenes().length} scene</p><div class="progress" role="progressbar" aria-label="Obiettivo romanzo" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div><div class="metrics"><div><strong>${n.toLocaleString("it")}</strong><span>PAROLE</span></div><div><strong>${pct}%</strong><span>OBIETTIVO</span></div><div><strong>${p.chapters.length}</strong><span>CAPITOLI</span></div></div></div><div class="card"><div class="eyebrow">LA SESSIONE DI OGGI</div><h3>${p.sessions[day()] || 0} / ${p.dailyGoal} parole</h3><p>Variazione netta del testo: può essere negativa quando tagli. Anche la revisione è lavoro.</p>${button("Apri Studio →", "studio")}</div></div><div class="grid4">${[
      ["muse", "Muse", "Premessa, tema e conflitto."],
      ["studio", "Studio", "Capitoli, scene e scrittura."],
      ["editor", "Editor", "Rilettura e strumenti del testo."],
      ["publisher", "Publisher", "Dal manoscritto alla proposta."],
    ]
      .map(
        ([v, t, d]) =>
          `<button class="card mode" data-action="${v}"><b>${t}</b><p>${d}</p></button>`,
      )
      .join(
        "",
      )}</div><div class="card settings">${field("Titolo", "title", p.title)}${field("Genere", "genre", p.genre)}${field("Obiettivo romanzo", "goal", p.goal, "number")}${field("Obiettivo giornaliero", "dailyGoal", p.dailyGoal, "number")}</div><div class="project"><div class="card"><div class="eyebrow">IL PROSSIMO PASSO</div><ol class="onboarding">${checks.map(([t, done, a]) => `<li><span>${done ? "✓" : "○"} ${t}</span>${button(done ? "Rivedi" : "Apri", a)}</li>`).join("")}</ol></div><div class="card"><div class="eyebrow">PORTA CON TE IL LAVORO</div><h3>Una copia fuori dal browser.</h3><p>${p.lastBackup ? "Ultima esportazione: " + esc(new Date(p.lastBackup).toLocaleString("it-IT")) : "Nessun backup esportato per questo progetto."}</p>${button("Backup completo", "backup")} ${button("Importa JSON / TXT / Markdown", "import")}<p>I dati locali non si sincronizzano fra browser.</p></div></div><div class="actions">${button("Esporta manoscritto .txt", "text")} ${button("Esporta manoscritto .md", "markdown")} ${button("Stampa manoscritto / PDF", "printManuscript")} ${button("Elimina progetto", "deleteProject")}</div><div class="quote">La tua voce viene prima. <small>Uno studio per scrivere, ricordare e riscrivere.</small></div>`;
  },
  studio() {
    const s = scene();
    return `<div class="studio-top"><div><div class="eyebrow">STUDIO</div><h2>${esc(current().title)}</h2></div><div>${button("Bacheca scene", "board")} ${button("Concentrazione", "focus", `aria-pressed="${focusMode}"`)}<span id="sprintClock" role="timer"></span></div></div><div class="workspace"><div class="tree"><div class="eyebrow">MANOSCRITTO</div>${current()
      .chapters.map(
        (c) =>
          `<section><input aria-label="Titolo capitolo" data-chapter="${esc(c.id)}" value="${esc(c.title)}"><div class="order-actions">${button("↑", "chapterUp", `data-id="${esc(c.id)}" aria-label="Sposta capitolo prima"`)} ${button("↓", "chapterDown", `data-id="${esc(c.id)}" aria-label="Sposta capitolo dopo"`)} ${button("Elimina", "deleteChapter", `data-id="${esc(c.id)}"`)}</div>${c.scenes.map((x) => `<button class="${x.id === s.id ? "sel" : ""}" data-scene="${esc(x.id)}" ${x.id === s.id ? 'aria-current="true"' : ""}>${esc(x.title)} <small>${words(x.text)}</small></button>`).join("")}${button("＋ Scena", "addScene", `data-id="${esc(c.id)}"`)}</section>`,
      )
      .join(
        "",
      )}${button("＋ Capitolo", "addChapter")}</div><div class="writing"><div class="toolbar"><span>${esc(s.title)}</span><span id="wc">${words(s.text)} parole</span></div><div class="scene-meta">${field("Titolo scena", "title", s.title, "text", "scene")}${field("POV", "pov", s.pov, "text", "scene")}${field("Data / ora", "date", s.date, "datetime-local", "scene")}${field("Luogo", "location", s.location, "text", "scene")}${field("Stato", "status", s.status, "text", "scene")}<div><label for="moveScene">Sposta in capitolo</label><select id="moveScene">${current()
      .chapters.map(
        (c) =>
          `<option value="${esc(c.id)}" ${c.scenes.includes(s) ? "selected" : ""}>${esc(c.title)}</option>`,
      )
      .join(
        "",
      )}</select></div></div><textarea id="manuscript" aria-label="Testo della scena" aria-describedby="wc saveStatus" spellcheck="true">${esc(s.text)}</textarea><div class="toolbar">${button("Annulla", "undo")} ${button("Ripeti", "redo")} ${button("Salva versione", "snapshot")} ${button("Versioni precedenti", "history")} ${button("Elimina scena", "deleteScene")}</div></div><aside class="ai">${field("Sinossi della scena", "synopsis", s.synopsis, "textarea", "scene")}${field("Note di revisione", "notes", s.notes, "textarea", "scene")}<div id="contextNotes">${contextNotes()}</div><div class="sprint"><h3>Sprint di scrittura</h3><label for="sprintMinutes">Durata in minuti</label><input id="sprintMinutes" type="number" min="1" max="120" value="25"><div>${button("Inizia", "sprintStart")} ${button("Pausa / riprendi", "sprintPause")} ${button("Termina", "sprintStop")}</div></div></aside></div>`;
  },
  board() {
    return `${head("BACHECA", "Vedi il romanzo dall’alto.", "Sinossi e ordine delle scene, collegati al manoscritto.")} ${button("Apri Studio", "studio")} ${current()
      .chapters.map(
        (c) =>
          `<section class="chapter-board"><h2>${esc(c.title)}</h2><div class="section-grid">${c.scenes.map((s, i) => `<article class="card"><div class="eyebrow">SCENA ${i + 1} · ${esc(s.status)}</div><h3>${esc(s.title)}</h3>${field("Sinossi", "synopsis", s.synopsis, "textarea", s.id)}<p>${esc(s.pov || "POV da definire")} · ${words(s.text)} parole</p>${button("Apri", "openScene", `data-id="${esc(s.id)}"`)} ${button("↑", "sceneUp", `data-id="${esc(s.id)}" aria-label="Sposta scena prima"`)} ${button("↓", "sceneDown", `data-id="${esc(s.id)}" aria-label="Sposta scena dopo"`)}</article>`).join("")}</div></section>`,
      )
      .join("")}`;
  },
  muse() {
    return (
      head(
        "MUSE",
        "Trova il cuore della storia.",
        "La domanda che vale un romanzo.",
      ) + fields(current().muse, "muse")
    );
  },
  characters() {
    return `${head("STORY BIBLE", "La memoria del romanzo.", "Personaggi, luoghi, oggetti e regole modificabili.")}<div class="actions">${["Personaggio", "Luogo", "Oggetto", "Regola"].map((t) => button("＋ " + t, "addEntity", `data-type="${t}"`)).join(" ")}</div><div class="section-grid">${
      current()
        .bible.map(
          (e) =>
            `<div class="card"><div class="eyebrow">${esc(e.type)}</div>${field("Nome", "name", e.name, "text", e.id)}${field("Desideri, ferite, segreti / fatti e vincoli", "notes", e.notes, "textarea", e.id)}${button("Elimina", "deleteEntity", `data-id="${esc(e.id)}"`)}</div>`,
        )
        .join("") ||
      "<p>Aggiungi una scheda per costruire la memoria della storia.</p>"
    }</div>`;
  },
  architecture() {
    return `${head("ARCHITETTURA", "La forma della storia.", "Ogni beat contiene una svolta, una scelta o una conseguenza.")} ${button("＋ Beat", "addBeat")}<div class="section-grid">${
      current()
        .beats.map(
          (b, i) =>
            `<div class="card"><div class="eyebrow">BEAT ${i + 1}</div>${field("Titolo", "title", b.title, "text", b.id)}${field("Atto", "act", b.act, "text", b.id)}${field("Svolta / conseguenza / tensione", "notes", b.notes, "textarea", b.id)}<label for="beat-${esc(b.id)}">Scena collegata</label><select id="beat-${esc(b.id)}" data-beat="${esc(b.id)}"><option value="">Non collegata</option>${scenes()
              .map(
                (s) =>
                  `<option value="${esc(s.id)}" ${b.sceneId === s.id ? "selected" : ""}>${esc(s.title)}</option>`,
              )
              .join(
                "",
              )}</select>${button("↑", "beatUp", `data-id="${esc(b.id)}" aria-label="Sposta beat prima"`)} ${button("↓", "beatDown", `data-id="${esc(b.id)}" aria-label="Sposta beat dopo"`)} ${button("Elimina", "deleteBeat", `data-id="${esc(b.id)}"`)}</div>`,
        )
        .join("") || "<p>Aggiungi i beat della tua architettura narrativa.</p>"
    }</div>`;
  },
  editor() {
    const checks = {
      developmental: [
        "La scena ha uno scopo e una conseguenza",
        "Il conflitto cambia qualcosa",
        "Desiderio e posta in gioco sono chiari",
      ],
      line: [
        "Il ritmo serve la scena",
        "Le immagini sono precise",
        "Le ripetizioni sono intenzionali",
      ],
      copy: [
        "Tempi verbali e POV sono coerenti",
        "Nomi e convenzioni sono uniformi",
        "Grammatica e sintassi sono corrette",
      ],
      proof: [
        "Refusi e punteggiatura verificati",
        "Spazi e virgolette uniformi",
        "Ultima lettura a voce alta completata",
      ],
    };
    return `${head("MASTER EDITOR", "Diagnosi prima della cura.", "Quattro passaggi di revisione, senza sostituire la tua voce.")}<div class="card"><h3>Scena attiva: ${esc(scene().title)}</h3><p>La checklist è condivisa nel progetto. Rivedila dopo modifiche importanti.</p>${button("Apri scena", "studio")} ${button("Salva versione prima di riscrivere", "snapshot")}</div><div class="section-grid">${Object.entries(
      checks,
    )
      .map(
        ([mode, items]) =>
          `<div class="card"><div class="eyebrow">${mode === "proof" ? "PROOFREADING" : mode.toUpperCase() + " EDIT"}</div>${items
            .map((t, i) => {
              const key = mode + "-" + i;
              return `<label class="check-item"><input type="checkbox" data-check="${key}" ${current().checklist[key] ? "checked" : ""}> ${t}</label>`;
            })
            .join("")}</div>`,
      )
      .join(
        "",
      )}</div><div class="actions">${button("Esporta checklist", "checklistExport")} ${button("Analizza testo e ripetizioni", "tools")}</div>`;
  },
  continuity() {
    const dated = scenes()
        .filter((s) => s.date)
        .sort((a, b) => a.date.localeCompare(b.date)),
      issues = [];
    for (const b of current().beats)
      if (b.sceneId && !scenes().some((s) => s.id === b.sceneId))
        issues.push("Beat senza scena: " + b.title);
    for (const s of scenes())
      for (const [key, type, label] of [
        ["location", "Luogo", "Luogo"],
        ["pov", "Personaggio", "POV"],
      ])
        if (
          s[key] &&
          !current().bible.some(
            (e) =>
              e.type === type &&
              e.name.toLocaleLowerCase("it") === s[key].toLocaleLowerCase("it"),
          )
        )
          issues.push(
            label + " non documentato: " + s[key] + " (" + s.title + ")",
          );
    return `${head("CONTINUITÀ", "Ricorda ciò che il romanzo promette.", "Timeline e controlli documentali della Story Bible.")}<div class="project"><div class="card"><h3>Timeline</h3>${dated.map((s) => `<p><b>${esc(s.date.replace("T", " · "))}</b> — <button class="text-link" data-scene="${esc(s.id)}">${esc(s.title)}</button> · ${esc(s.pov)} · ${esc(s.location)}</p>`).join("") || "<p>Imposta le date delle scene nello Studio.</p>"}<p>${scenes().filter((s) => !s.date).length} scene senza data.</p></div><div class="card"><h3>Controlli documentali</h3>${issues.map((x) => `<p>${esc(x)}</p>`).join("") || "<p>Nessun riferimento mancante rilevato.</p>"}<p>Questo controllo non interpreta la trama: verifica anche il manoscritto con una rilettura.</p></div></div>`;
  },
  publisher() {
    return (
      head(
        "PUBLISHER",
        "Porta il libro al lettore giusto.",
        "Logline, sinossi, pitch e query pronti per la revisione.",
      ) +
      fields(current().publisher, "publisher") +
      `<div class="actions">${button("Esporta dossier .txt", "publisherExport")} ${button("Stampa dossier / PDF", "printPublisher")}</div>`
    );
  },
  tools() {
    return `${head("STRUMENTI", "Una lente sulla tua scrittura.", "Strumenti locali: il manoscritto resta sul dispositivo.")}<div class="project"><div class="card"><h3>Trova nel romanzo</h3><label for="searchText">Parola o frase</label><input id="searchText" type="search" placeholder="Un nome, un oggetto, una promessa…"><div id="searchResults" aria-live="polite"></div></div><div class="card"><h3>Osserva il testo</h3><label for="analysisScope">Testo da osservare</label><select id="analysisScope"><option value="scene">Scena attiva: ${esc(scene().title)}</option><option value="project">Intero manoscritto</option></select><div id="textAnalysis">${analysisMarkup(scene().text)}</div></div></div><div class="card"><h3>Il ritmo del lavoro</h3><p>Variazioni nette negli ultimi sette giorni. I valori negativi indicano tagli, non giornate perse.</p><div class="week-stats">${Array.from(
      { length: 7 },
      (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - 6 + i);
        const key = d.toLocaleDateString("sv-SE");
        return `<div><span>${esc(d.toLocaleDateString("it-IT", { weekday: "short", day: "numeric" }))}</span><strong>${current().sessions[key] || 0}</strong></div>`;
      },
    ).join(
      "",
    )}</div></div><div class="card"><h3>Una scrivania senza distrazioni</h3><p>Usa Concentrazione nello Studio e uno sprint da 1 a 120 minuti. Il timer resta attivo quando cambi sezione.</p><p><kbd>Ctrl / Cmd + S</kbd> salva una versione · <kbd>Ctrl / Cmd + E</kbd> esporta il progetto · <kbd>Esc</kbd> esce dalla concentrazione.</p>${button("Vai allo Studio", "studio")}</div>`;
  },
};
function contextNotes() {
  const s = scene(),
    source = (s.text + " " + s.pov + " " + s.location).toLocaleLowerCase("it");
  const mentioned = current().bible.filter(
      (e) => e.name.trim() && source.includes(e.name.toLocaleLowerCase("it")),
    ),
    beats = current().beats.filter((b) => b.sceneId === s.id);
  return `<div class="eyebrow">NELLA SCENA</div>${mentioned.map((e) => `<details><summary>${esc(e.type)} · ${esc(e.name)}</summary><p>${esc(e.notes)}</p></details>`).join("") || "<p>Nessuna scheda citata. Aggiungi nomi e luoghi alla Story Bible.</p>"}<h3>Beat collegati</h3>${beats.map((b) => `<p><b>${esc(b.title)}</b><br>${esc(b.notes)}</p>`).join("") || "<p>Collega un beat dall’Architettura.</p>"}<p>Le citazioni vengono riconosciute per nome testuale, non per significato.</p>`;
}
function analysisMarkup(source) {
  const a = analyze(source);
  return `<div class="metrics"><div><strong>${a.words}</strong><span>PAROLE</span></div><div><strong>${a.characters}</strong><span>CARATTERI</span></div><div><strong>${a.readingMinutes} min</strong><span>LETTURA STIMATA</span></div></div><p>${a.paragraphs} paragrafi · stima a 200 parole/minuto.</p><h3>Ripetizioni da valutare</h3>${a.repetitions.map(([t, n]) => `<span class="tag">${esc(t)} · ${n}</span>`).join(" ") || "<p>Nessuna parola significativa ripetuta almeno tre volte.</p>"}<h3>Frasi oltre 35 parole</h3>${
    a.longSentences
      .slice(0, 12)
      .map((t) => `<p class="sample">${esc(t)}</p>`)
      .join("") || "<p>Nessuna frase lunga rilevata.</p>"
  }<p>Indicatori meccanici, non giudizi di qualità. Il rilevamento delle frasi è approssimativo e può dividere abbreviazioni.</p>`;
}
function render(next = view) {
  const changedView = next !== view;
  flush();
  view = next;
  fieldSequence = 0;
  if (view !== "studio") focusMode = false;
  document.body.classList.toggle("focus-mode", focusMode);
  main.innerHTML = views[view]();
  document.querySelectorAll("#nav button").forEach((b) => {
    const active = b.dataset.view === view;
    b.classList.toggle("active", active);
    if (active) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  document.querySelector("#projectSelect").innerHTML = db.projects
    .map(
      (p) =>
        `<option value="${esc(p.id)}" ${p.id === current().id ? "selected" : ""}>${esc(p.title)}</option>`,
    )
    .join("");
  document.title =
    (view === "studio"
      ? scene().title
      : { home: "Dashboard", board: "Bacheca", tools: "Strumenti" }[view] ||
        document.querySelector("#nav [aria-current]")?.textContent.trim() ||
        "Studio") + " · The Master Editor & Muse";
  recoveryControls();
  updateSprint();
  if (changedView) window.scrollTo?.(0, 0);
}
function rememberEdit(s) {
  const key = current().id + ":" + s.id,
    now = Date.now();
  let stack = undoStacks.get(key);
  if (!stack) {
    stack = { undo: [], redo: [] };
    undoStacks.set(key, stack);
  }
  if (!editGroups.has(key) || now - editGroups.get(key) > 1200) {
    stack.undo.push(s.text);
    stack.undo = stack.undo.slice(-50);
  }
  const lastAuto = current().history.find(
    (h) => h.sceneId === s.id && h.kind === "automatica",
  );
  if (!lastAuto || now - Date.parse(lastAuto.date) >= 30000) {
    snapshot(s, "automatica");
  }
  stack.redo = [];
  editGroups.set(key, now);
}
function undo(redo = false) {
  const s = scene(),
    key = current().id + ":" + s.id,
    stack = undoStacks.get(key),
    from = stack?.[redo ? "redo" : "undo"];
  if (!from?.length) {
    notice("Nessuna modifica da " + (redo ? "ripetere." : "annullare."));
    return;
  }
  const next = from.pop();
  stack[redo ? "undo" : "redo"].push(s.text);
  editGroups.delete(key);
  Muse.setText(current(), s, next);
  save(true);
  render();
  const editor = document.querySelector("#manuscript");
  editor?.focus();
  if (editor)
    editor.setSelectionRange(editor.value.length, editor.value.length);
}
function updateSearch() {
  const input = document.querySelector("#searchText"),
    result = document.querySelector("#searchResults");
  if (!input || !result) return;
  const query = input.value.trim().toLocaleLowerCase("it");
  if (!query) {
    result.textContent = "";
    return;
  }
  const found = scenes().filter((s) =>
    (s.title + " " + s.text + " " + s.notes)
      .toLocaleLowerCase("it")
      .includes(query),
  );
  result.innerHTML =
    found
      .slice(0, 100)
      .map((s) => {
        const i = s.text.toLocaleLowerCase("it").indexOf(query);
        return `<p><button class="text-link" data-scene="${esc(s.id)}">${esc(s.title)}</button><br>${esc(i < 0 ? s.notes.slice(0, 130) : s.text.slice(Math.max(0, i - 45), i + 100))}</p>`;
      })
      .join("") || "<p>Nessun risultato.</p>";
}
main.addEventListener("input", (e) => {
  const el = e.target,
    p = current();
  if (el.id === "searchText") {
    updateSearch();
    return;
  }
  if (el.id === "manuscript") {
    const s = scene();
    rememberEdit(s);
    Muse.setText(p, s, el.value);
    document.querySelector("#wc").textContent = words(s.text) + " parole";
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => {
      const notes = document.querySelector("#contextNotes");
      if (notes) notes.innerHTML = contextNotes();
    }, 700);
  } else if (el.dataset.chapter) {
    p.chapters.find((c) => c.id === el.dataset.chapter).title = el.value;
  } else if (el.dataset.scope) {
    const scope = el.dataset.scope,
      target =
        scope === "project"
          ? p
          : scope === "scene"
            ? scene()
            : ["muse", "publisher"].includes(scope)
              ? p[scope]
              : [...p.bible, ...p.beats, ...scenes()].find(
                  (x) => x.id === scope,
                );
    if (
      !target ||
      ["__proto__", "prototype", "constructor"].includes(el.dataset.key)
    )
      return;
    if (el.type === "number" && (!el.validity.valid || !el.value)) {
      el.setAttribute("aria-invalid", "true");
      notice(
        "Inserisci un obiettivo intero fra 1 e 10.000.000. Il valore precedente resta conservato.",
      );
      return;
    }
    if (el.type === "datetime-local" && !Muse.validDate(el.value)) {
      el.setAttribute("aria-invalid", "true");
      notice("Inserisci una data e un’ora valide.");
      return;
    }
    el.removeAttribute("aria-invalid");
    target[el.dataset.key] = el.type === "number" ? Number(el.value) : el.value;
  } else return;
  save();
});
main.addEventListener("focusout", (e) => {
  const el = e.target;
  if (
    el.matches("input[type=number][data-scope]") &&
    (!el.value || !el.validity.valid)
  ) {
    el.value = current()[el.dataset.key];
    el.removeAttribute("aria-invalid");
  }
  flush();
});
main.addEventListener("change", (e) => {
  const el = e.target;
  if (el.dataset.check) {
    current().checklist[el.dataset.check] = el.checked;
    save();
  }
  if (el.dataset.beat) {
    current().beats.find((b) => b.id === el.dataset.beat).sceneId = el.value;
    save();
  }
  if (el.id === "analysisScope")
    document.querySelector("#textAnalysis").innerHTML = analysisMarkup(
      el.value === "scene"
        ? scene().text
        : scenes()
            .map((s) => s.text)
            .join("\n\n"),
    );
  if (el.id === "moveScene") {
    const s = scene(),
      from = current().chapters.find((c) => c.scenes.includes(s)),
      to = current().chapters.find((c) => c.id === el.value);
    if (from !== to && to) {
      from.scenes = from.scenes.filter((x) => x !== s);
      if (!from.scenes.length) from.scenes = [makeScene()];
      to.scenes.push(s);
      save(true);
      render();
    }
  }
});
function reorder(array, id, direction) {
  const i = array.findIndex((x) => x.id === id),
    j = i + direction;
  if (i >= 0 && j >= 0 && j < array.length)
    [array[i], array[j]] = [array[j], array[i]];
}
function exportProject(all = false) {
  const p = current();
  for (const item of all ? db.projects : [p])
    item.lastBackup = new Date().toISOString();
  save(true);
  download(
    all ? "muse-backup.json" : p.title + ".json",
    JSON.stringify(
      all ? db : { version: 2, active: p.id, projects: [p] },
      null,
      2,
    ),
  );
  if (view === "home") render();
  notice("Backup preparato: conserva il file scaricato fuori dal browser.");
}
function showVersions() {
  const d = document.querySelector("#versions"),
    p = current(),
    s = scene(),
    history = p.history.filter((h) => h.sceneId === s.id),
    orphans = p.history.filter(
      (h) => !scenes().some((s) => s.id === h.sceneId),
    );
  const list = (items, recover) =>
    items
      .map(
        (h) =>
          `<article class="card"><h3>${esc(h.title)}</h3><p>${esc(new Date(h.date).toLocaleString("it-IT"))} · ${esc(h.kind || "manuale")}</p><details><summary>Leggi versione</summary><pre>${esc(h.text)}</pre></details><button class="btn" data-${recover ? "recover-scene" : "restore"}="${esc(h.id)}">${recover ? "Recupera come nuova scena" : "Ripristina"}</button></article>`,
      )
      .join("");
  d.innerHTML = `<h2 id="versionsTitle">Versioni della scena</h2><p>30 versioni per scena, fino a 300 nel progetto. Le versioni automatiche conservano il testo prima di un gruppo di modifiche.</p>${list(history, false) || "<p>Nessuna versione per questa scena.</p>"}${orphans.length ? "<h3>Scene eliminate recuperabili</h3>" + list(orphans, true) : ""}<form method="dialog"><button class="btn">Chiudi</button></form>`;
  d.showModal();
  d.querySelector("button").focus();
}
function printDocument(publisher = false) {
  const p = current(),
    area = document.querySelector("#printArea");
  area.innerHTML = publisher
    ? `<h1>${esc(p.title)}</h1><h2>Dossier editoriale</h2>${Object.entries(
        p.publisher,
      )
        .map(
          ([k, v]) => `<section><h2>${esc(k)}</h2><p>${esc(v)}</p></section>`,
        )
        .join("")}`
    : `<h1>${esc(p.title)}</h1>${p.chapters.map((c) => `<section class="print-chapter"><h2>${esc(c.title)}</h2>${c.scenes.map((s) => `<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>`).join("")}</section>`).join("")}`;
  window.print();
}
function updateSprint() {
  if (sprintEnd) {
    sprintRemaining = Math.max(0, Math.ceil((sprintEnd - Date.now()) / 1000));
    if (!sprintRemaining) {
      stopSprint();
      return;
    }
  }
  const label = sprintRemaining
    ? `${Math.floor(sprintRemaining / 60)}:${String(sprintRemaining % 60).padStart(2, "0")}${sprintEnd ? " · sprint" : " · pausa"}`
    : "";
  const clock = document.querySelector("#sprintClock");
  if (clock) clock.textContent = label;
  document.querySelector("#globalSprint").textContent = label;
}
function stopSprint() {
  clearInterval(sprintTimer);
  sprintEnd = 0;
  sprintRemaining = 0;
  const p = db.projects.find((p) => p.id === sprintProjectId),
    n = p
      ? p.chapters
          .flatMap((c) => c.scenes)
          .reduce((a, s) => a + words(s.text), 0) - sprintStartWords
      : 0;
  if (sprintProjectId)
    notice("Sprint concluso: " + (n >= 0 ? "+" : "") + n + " parole nette.");
  sprintProjectId = null;
  updateSprint();
}
main.addEventListener("click", async (e) => {
  const el = e.target.closest("button");
  if (!el) return;
  if (el.dataset.scene) {
    sceneId = el.dataset.scene;
    render("studio");
    return;
  }
  const a = el.dataset.action,
    p = current(),
    id = el.dataset.id;
  if (views[a]) {
    render(a);
    return;
  }
  switch (a) {
    case "export":
      exportProject();
      return;
    case "backup":
      exportProject(true);
      return;
    case "import":
      document.querySelector("#importFile").click();
      return;
    case "text":
    case "markdown":
      download(
        p.title + (a === "text" ? ".txt" : ".md"),
        p.chapters
          .map(
            (c) =>
              (a === "markdown" ? "# " : "") +
              c.title +
              "\n\n" +
              c.scenes
                .map(
                  (s) =>
                    (a === "markdown" ? "## " : "") + s.title + "\n\n" + s.text,
                )
                .join("\n\n"),
          )
          .join("\n\n"),
        "text/plain",
      );
      return;
    case "publisherExport":
      download(
        "publisher.txt",
        Object.entries(p.publisher)
          .map(([k, v]) => k + "\n" + v)
          .join("\n\n"),
        "text/plain",
      );
      return;
    case "printPublisher":
      printDocument(true);
      return;
    case "printManuscript":
      printDocument();
      return;
    case "checklistExport":
      download(
        "checklist-revisione.txt",
        [...main.querySelectorAll(".check-item")]
          .map(
            (label) =>
              (label.querySelector("input").checked ? "[x] " : "[ ] ") +
              label.textContent.trim(),
          )
          .join("\n"),
        "text/plain",
      );
      return;
    case "focus":
      focusMode = !focusMode;
      document.body.classList.toggle("focus-mode", focusMode);
      el.setAttribute("aria-pressed", String(focusMode));
      return;
    case "undo":
      undo();
      return;
    case "redo":
      undo(true);
      return;
    case "snapshot":
      snapshot(scene());
      if (save(true)) notice("Versione conservata sul dispositivo.");
      else
        notice(
          "Versione nel lavoro locale: esporta una copia, il salvataggio è sospeso.",
        );
      return;
    case "history":
      showVersions();
      return;
    case "openScene":
      sceneId = id;
      render("studio");
      return;
    case "sprintStart": {
      const minutes = Number(document.querySelector("#sprintMinutes").value);
      if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120) {
        notice("Scegli una durata fra 1 e 120 minuti.");
        return;
      }
      if (sprintProjectId) {
        notice("Termina lo sprint corrente prima di iniziarne un altro.");
        return;
      }
      sprintProjectId = p.id;
      sprintStartWords = total();
      sprintRemaining = minutes * 60;
      sprintEnd = Date.now() + sprintRemaining * 1000;
      sprintTimer = setInterval(updateSprint, 1000);
      updateSprint();
      return;
    }
    case "sprintPause":
      if (!sprintProjectId) return;
      if (sprintEnd) {
        sprintRemaining = Math.max(
          0,
          Math.ceil((sprintEnd - Date.now()) / 1000),
        );
        sprintEnd = 0;
      } else sprintEnd = Date.now() + sprintRemaining * 1000;
      updateSprint();
      return;
    case "sprintStop":
      stopSprint();
      return;
    case "addChapter": {
      const c = {
        id: uid(),
        title: "Capitolo " + (p.chapters.length + 1),
        scenes: [makeScene()],
      };
      p.chapters.push(c);
      sceneId = c.scenes[0].id;
      break;
    }
    case "addScene": {
      const s = makeScene();
      p.chapters.find((c) => c.id === id).scenes.push(s);
      sceneId = s.id;
      break;
    }
    case "addEntity":
      p.bible.push({
        id: uid(),
        type: el.dataset.type,
        name: "Nuovo " + el.dataset.type.toLowerCase(),
        notes: "",
      });
      break;
    case "addBeat":
      p.beats.push({
        id: uid(),
        title: "Nuova svolta",
        act: "Atto I",
        notes: "",
        sceneId: "",
      });
      break;
    case "deleteEntity":
    case "deleteBeat":
      if (
        !(await ask({
          title: "Eliminare questa scheda?",
          message: "La scheda sarà rimossa dal progetto.",
          confirmLabel: "Elimina",
        }))
      )
        return;
      p[a === "deleteEntity" ? "bible" : "beats"] = p[
        a === "deleteEntity" ? "bible" : "beats"
      ].filter((x) => x.id !== id);
      break;
    case "beatUp":
    case "beatDown":
      reorder(p.beats, id, a === "beatUp" ? -1 : 1);
      break;
    case "chapterUp":
    case "chapterDown":
      reorder(p.chapters, id, a === "chapterUp" ? -1 : 1);
      break;
    case "sceneUp":
    case "sceneDown":
      reorder(
        p.chapters.find((c) => c.scenes.some((s) => s.id === id)).scenes,
        id,
        a === "sceneUp" ? -1 : 1,
      );
      break;
    case "deleteScene": {
      const s = scene(),
        c = p.chapters.find((c) => c.scenes.includes(s)),
        i = c.scenes.indexOf(s);
      if (
        !(await ask({
          title: "Eliminare la scena?",
          message: "Una versione del testo sarà conservata e recuperabile.",
          confirmLabel: "Elimina",
        }))
      )
        return;
      snapshot(s, "eliminata");
      Muse.setText(p, s, "");
      c.scenes.splice(i, 1);
      if (!c.scenes.length) c.scenes.push(makeScene());
      sceneId = c.scenes[Math.min(i, c.scenes.length - 1)].id;
      break;
    }
    case "deleteChapter": {
      const c = p.chapters.find((c) => c.id === id);
      if (
        !(await ask({
          title: "Eliminare " + c.title + "?",
          message: "Le scene saranno conservate nelle versioni recuperabili.",
          confirmLabel: "Elimina capitolo",
        }))
      )
        return;
      for (const s of c.scenes) {
        Muse.snapshot(p, s, "eliminata");
        Muse.setText(p, s, "");
      }
      p.chapters = p.chapters.filter((x) => x !== c);
      if (!p.chapters.length) p.chapters = project().chapters;
      sceneId = null;
      break;
    }
    case "deleteProject": {
      if (
        !(await ask({
          title: "Eliminare il progetto?",
          message:
            "Prima verrà scaricata una copia JSON del progetto. Conserva il file per poterlo recuperare.",
          confirmLabel: "Esporta ed elimina",
        }))
      )
        return;
      exportProject();
      db.projects = db.projects.filter((x) => x.id !== p.id);
      if (!db.projects.length) db.projects = [project()];
      db.active = db.projects[0].id;
      sceneId = null;
      break;
    }
    default:
      return;
  }
  save(true);
  render();
});
document.querySelector("#versions").addEventListener("click", async (e) => {
  const restore = e.target.dataset.restore,
    recover = e.target.dataset.recoverScene;
  if (!restore && !recover) return;
  const h = current().history.find((h) => h.id === (restore || recover));
  if (!h) return;
  if (recover) {
    const s = h.scene
      ? { ...h.scene, text: h.text, id: uid() }
      : makeScene(h.title, h.text);
    const restoredText = s.text;
    s.text = "";
    Muse.setText(current(), s, restoredText);
    current().chapters[0].scenes.push(s);
    sceneId = s.id;
    save(true);
    document.querySelector("#versions").close();
    render("studio");
    notice("Scena recuperata nel primo capitolo.");
    return;
  }
  document.querySelector("#versions").close();
  if (
    !(await ask({
      title: "Ripristinare questa versione?",
      message: "Il testo corrente sarà conservato nelle versioni.",
      confirmLabel: "Ripristina",
    }))
  )
    return;
  snapshot(scene(), "prima del ripristino");
  Muse.setText(current(), scene(), h.text);
  undoStacks.delete(current().id + ":" + scene().id);
  editGroups.delete(current().id + ":" + scene().id);
  save(true);
  render();
});
document
  .querySelectorAll("#nav button")
  .forEach((b) => (b.onclick = () => render(b.dataset.view)));
document.querySelector("#projectSelect").onchange = (e) => {
  flush();
  db.active = e.target.value;
  sceneId = null;
  save(true);
  render();
};
document.querySelector("#newProject").onclick = async () => {
  const title = await ask({
    title: "Un nuovo progetto",
    message:
      "Inizia con una scena vuota. I progetti esistenti restano conservati.",
    value: "",
    confirmLabel: "Crea progetto",
  });
  if (!title) return;
  const p = project(title);
  db.projects.push(p);
  db.active = p.id;
  sceneId = null;
  save(true);
  render("home");
};
document.querySelector("#importFile").onchange = async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  try {
    if (file.size > 10000000) throw Error("File troppo grande: massimo 10 MB.");
    const imported = parseImport(file.name, await file.arrayBuffer()),
      next = {
        ...db,
        projects: [...db.projects, ...imported],
        active: imported.at(-1).id,
      };
    Muse.validate(next);
    db = next;
    sceneId = null;
    save(true);
    render("home");
    notice(
      "Importazione completata: " +
        imported.length +
        " progetti aggiunti senza sostituire quelli esistenti.",
    );
  } catch (error) {
    notice("Importazione non eseguita: " + error.message);
  }
};
document.querySelector("#exportRecovery").onclick = () => {
  download(
    "muse-recupero.json",
    JSON.stringify({ ...db, recoveryOriginalRaw: store.baseline }, null, 2),
  );
  notice(
    "Copia preparata: contiene il lavoro corrente e l’archivio originale. Conserva il file prima di recuperare.",
  );
};
document.querySelector("#reloadProjects").onclick = async () => {
  if (
    !(await ask({
      title: "Caricare l’archivio del browser?",
      message:
        "Le modifiche locali non salvate saranno sostituite. Usa prima “Esporta copie”.",
      confirmLabel: "Carica archivio",
    }))
  )
    return;
  try {
    db = store.recover();
    sceneId = null;
    undoStacks.clear();
    editGroups.clear();
    render("home");
    notice("Archivio aggiornato caricato.");
    status("✓ Archivio caricato dal dispositivo.");
  } catch (error) {
    notice("Recupero non riuscito: " + error.message);
  }
};
document.querySelector("#retrySave").onclick = () => {
  store.retry();
  store.dirty = true;
  flush();
};
document.querySelector("#resetArchive").onclick = async () => {
  if (
    !(await ask({
      title: "Reimpostare l’archivio locale?",
      message:
        "Verrà scaricata una copia del lavoro e dell’archivio precedente. Conservala. Il lavoro corrente diventerà il nuovo archivio.",
      confirmLabel: "Esporta e reimposta",
    }))
  )
    return;
  document.querySelector("#exportRecovery").click();
  try {
    store.baseline = localStorage.getItem(KEY);
    store.reason = "";
    save(true);
  } catch (error) {
    notice(error.message);
  }
};
window.addEventListener("storage", (e) => {
  if (e.key === KEY && e.newValue !== store.baseline) {
    clearTimeout(saveTimer);
    store.reason = "conflict";
    status("⚠ Conflitto fra schede");
    notice(
      "Un’altra scheda ha modificato i dati. Esporta le modifiche locali prima di caricare l’archivio aggiornato.",
    );
    recoveryControls();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flush();
});
window.addEventListener("pagehide", flush);
window.addEventListener("beforeunload", (e) => {
  if (store.dirty) {
    flush();
    if (store.dirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  }
});
document.addEventListener("keydown", (e) => {
  if (e.target.closest?.("dialog")) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    snapshot(scene());
    if (save(true)) notice("Versione conservata sul dispositivo.");
    else
      notice(
        "Versione nel lavoro locale: esporta una copia, il salvataggio è sospeso.",
      );
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
    e.preventDefault();
    exportProject();
  }
  if (e.key === "Escape" && focusMode) {
    focusMode = false;
    document.body.classList.remove("focus-mode");
    main
      .querySelector('[data-action="focus"]')
      ?.setAttribute("aria-pressed", "false");
  }
});
render();
if (store.reason) {
  status("⚠ Archivio da recuperare");
  notice(store.error || "Il salvataggio è sospeso.");
  recoveryControls();
} else {
  store.dirty = true;
  flush();
}
