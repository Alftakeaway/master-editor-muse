/* UI isolated from manuscript editing. Navigation is kept per project in memory. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.WriterPathsUI = api;
})(globalThis, function () {
  "use strict";
  function create({
    catalog = WriterPaths,
    current,
    save,
    notice,
    download,
    open,
    esc,
    uid,
    ask,
  }) {
    const sessions = new Map();
    const labels = {
      studio: "Studio",
      home: "Dashboard",
      muse: "Muse",
      characters: "Story Bible",
      architecture: "Architettura",
      editor: "Editor",
      continuity: "Continuità",
      publisher: "Publisher",
      tools: "Strumenti",
      board: "Bacheca",
    };
    function session() {
      const p = current();
      if (!sessions.has(p.id))
        sessions.set(p.id, { path: null, query: "", group: "", note: "" });
      return sessions.get(p.id);
    }
    function saved() {
      return current().guidancePlans || [];
    }
    const card = (issue) =>
      `<button class="card path-card" data-path-start="${esc(issue.id)}"><span class="eyebrow">${esc(issue.group)}</span><h3>${esc(issue.title)}</h3><p>${esc(issue.summary)}</p><span class="path-cta">Trova il prossimo passo →</span></button>`;
    function catalogCards() {
      const s = session(),
        items = catalog.list(s.query, s.group);
      return `<p class="path-count" role="status">${items.length} percorsi disponibili${s.group ? " · " + esc(s.group) : ""}</p><div class="path-catalog">${items.map(card).join("") || "<p>Nessun percorso trovato. Prova un’altra parola o rimuovi il filtro.</p>"}</div>`;
    }
    function sourceMarkup(ids) {
      return `<details class="path-sources"><summary>Fonti e criterio editoriale</summary><p>Gli esercizi e gli alberi sono proposte originali di lavoro. Le fonti informano i principi; non certificano questo strumento o un risultato individuale.</p>${ids
        .map((id) => {
          const s = catalog.sources[id];
          return s
            ? `<p><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a><br><small>${esc(s.kind)} · ${esc(s.note)}</small></p>`
            : "";
        })
        .join("")}</details>`;
    }
    function journal() {
      if (!saved().length)
        return '<div class="card path-journal-empty"><h3>Il tuo quaderno dei percorsi</h3><p>Quando trovi un piano utile, salvalo qui. Sarà incluso nel backup del progetto.</p></div>';
      return `<section class="path-journal"><h2>Piani nel progetto</h2><p>Fino a 30 piani, con note ed esito. Le risposte alle domande non vengono salvate nel quaderno.</p>${saved()
        .map(
          (p) =>
            `<article class="card"><div class="eyebrow">${esc(catalog.issues.find((i) => i.id === p.issueId)?.title || "Percorso conservato")} · ${esc(p.mode || "piano")}</div><h3>${esc(p.title)}</h3><p>${esc(new Date(p.createdAt).toLocaleString("it-IT"))}</p><details><summary>Rivedi il piano</summary><p>${esc(p.why)}</p><ol>${p.steps.map((t) => `<li>${esc(t)}</li>`).join("")}</ol><p><b>Verifica:</b> ${esc(p.check)}</p><p><b>Se non basta:</b> ${esc(p.fallback)}</p></details><label for="plan-note-${esc(p.id)}">Note e risultato della prova</label><textarea id="plan-note-${esc(p.id)}" data-path-saved-note="${esc(p.id)}" maxlength="20000">${esc(p.notes || "")}</textarea><label class="check-item"><input type="checkbox" data-path-done="${esc(p.id)}" ${p.done ? "checked" : ""}> Ho svolto la prova</label><div class="actions"><button class="btn" data-path-tool="${esc(p.tool)}">Apri ${esc(labels[p.tool] || "Studio")}</button><button class="btn" data-path-export-saved="${esc(p.id)}">Esporta piano</button><button class="btn" data-path-delete="${esc(p.id)}">Rimuovi dal quaderno</button></div></article>`,
        )
        .join("")}</section>`;
    }
    function stage() {
      const s = session(),
        path = s.path,
        issue = catalog.issues.find((i) => i.id === path.issueId),
        tree = catalog.trees[path.issueId],
        node = tree.nodes[path.current];
      const p = node.plan,
        existing = p
          ? saved().find((x) => x.issueId === issue.id && x.nodeId === node.id)
          : null;
      const trail = `<ol class="path-trail" aria-label="Scelte del percorso">${path.trail.map((t, i) => `<li><button class="text-link" data-path-rewind="${i}">${esc(t.label)}</button></li>`).join("")}</ol>`;
      const navigation = `<div class="actions"><button class="btn" data-path-op="catalog">Tutti i percorsi</button>${path.trail.length ? '<button class="btn" data-path-op="back">← Indietro</button>' : ""}<button class="btn" data-path-op="restart">Ricomincia questo percorso</button></div>`;
      if (!p)
        return `<section id="pathStage" class="path-stage card" aria-labelledby="pathQuestion">${navigation}<div class="eyebrow">${esc(issue.title)} · DOMANDA ${path.trail.length + 1}</div>${trail}<h2 id="pathQuestion" tabindex="-1">${esc(node.question)}</h2><p>Scegli l’ostacolo più vicino alla situazione di oggi. Puoi tornare indietro; non c’è un punteggio.</p><div class="path-options">${node.options.map((o, i) => `<button class="path-option" data-path-choice="${i}"><span>${String.fromCharCode(65 + i)}</span>${esc(o.label)}<b aria-hidden="true">→</b></button>`).join("")}</div><p class="path-footnote">Un percorso richiede al massimo tre domande. Le risposte restano in questa sessione del browser.</p>${sourceMarkup(issue.sources)}</section>`;
      return `<section id="pathStage" class="path-stage card" aria-labelledby="pathQuestion">${navigation}<div class="eyebrow">${esc(issue.title)} · ${p.care ? "SOSTEGNO" : "PIANO " + esc(p.mode.toUpperCase())}</div>${trail}<h2 id="pathQuestion" tabindex="-1">${esc(p.title)}</h2><p class="path-why">${esc(p.why)}</p>${p.care ? '<div class="path-care"><p>Questo è uno spazio di orientamento alla scrittura, non un test clinico. La durata del blocco da sola non identifica una causa o una diagnosi.</p></div>' : `<p>${esc(p.scope)} · Indicativamente ${p.duration} minuti.</p>`}<div class="path-protocol"><h3>La prova concreta</h3><ol>${p.steps.map((t) => `<li>${esc(t)}</li>`).join("")}</ol></div><div class="project"><div class="path-check"><div class="eyebrow">COME VALUTARE L’ESITO</div><p>${esc(p.check)}</p></div><div class="path-next"><div class="eyebrow">SE NON BASTA</div><p>${esc(p.fallback)}</p></div></div>${p.related.length ? `<div class="actions"><span>Approfondisci:</span>${p.related.map((id) => `<button class="text-link" data-path-start="${esc(id)}">${esc(catalog.issues.find((i) => i.id === id)?.title || id)}</button>`).join("")}</div>` : ""}<label for="pathDraftNote">Appunti per la prova (salvati solo quando salvi il piano)</label><textarea id="pathDraftNote" maxlength="20000">${esc(s.note || existing?.notes || "")}</textarea><div class="actions"><button class="btn primary" data-path-op="save">${existing ? "Aggiorna piano nel progetto" : "Salva piano nel progetto"}</button><button class="btn" data-path-tool="${esc(p.tool)}">Apri ${esc(labels[p.tool])}</button><button class="btn" data-path-op="export">Esporta piano .txt</button></div>${existing ? '<p class="path-saved">✓ Piano presente nel quaderno del progetto.</p>' : ""}${sourceMarkup(issue.sources)}</section>`;
    }
    function render() {
      const s = session();
      return `<div class="hero"><div><div class="eyebrow">PERCORSI PER SCRITTORI</div><h1>Un ostacolo alla volta.</h1><div class="sub">36 difficoltà ricorrenti. Domande mirate, una prova concreta, un prossimo passo.</div></div></div><p class="path-intro">Progetto: <b>${esc(current().title)}</b>. Percorsi editoriali gratuiti per individuare il lavoro di oggi, senza valutare il talento. È un catalogo ampio e ampliabile, non un elenco di ogni possibile difficoltà.</p>${s.path ? stage() : `<div class="path-filters card"><div><label for="pathSearch">Cerca un problema</label><input id="pathSearch" type="search" value="${esc(s.query)}" placeholder="Dialoghi, finale, paura, tempo…"></div><div><label for="pathGroup">Area di lavoro</label><select id="pathGroup"><option value="">Tutte le aree</option>${catalog.groups.map((g) => `<option ${s.group === g ? "selected" : ""}>${esc(g)}</option>`).join("")}</select></div></div><div id="pathCatalogResults">${catalogCards()}</div>${sourceMarkup(Object.keys(catalog.sources))}`}${journal()}`;
    }
    function refresh(focus = true) {
      open("paths");
      if (focus) document.querySelector("#pathQuestion")?.focus();
    }
    function launch(id) {
      session().path = catalog.start(id);
      session().note = "";
      refresh();
    }
    function asText(issue, p, note = "") {
      return [
        issue.title,
        p.title,
        "",
        p.why,
        p.scope || "",
        ...p.steps.map((t, i) => i + 1 + ". " + t),
        "",
        "VERIFICA: " + p.check,
        "SE NON BASTA: " + p.fallback,
        "",
        note ? "APPUNTI: " + note : "",
        "FONTI DI RIFERIMENTO:",
        ...issue.sources.map(
          (id) => catalog.sources[id].title + " — " + catalog.sources[id].url,
        ),
        "Gli esercizi sono proposte editoriali originali, non un test diagnostico.",
      ].join("\n");
    }
    function attach(main) {
      main.addEventListener("input", (e) => {
        const el = e.target,
          s = session();
        if (el.id === "pathSearch") {
          s.query = el.value;
          document.querySelector("#pathCatalogResults").innerHTML =
            catalogCards();
        }
        if (el.id === "pathDraftNote") s.note = el.value;
        if (el.dataset.pathSavedNote) {
          const p = saved().find((p) => p.id === el.dataset.pathSavedNote);
          if (p) {
            p.notes = el.value;
            save();
          }
        }
      });
      main.addEventListener("change", (e) => {
        if (e.target.id === "pathGroup") {
          session().group = e.target.value;
          document.querySelector("#pathCatalogResults").innerHTML =
            catalogCards();
        }
        if (e.target.dataset.pathDone) {
          const p = saved().find((p) => p.id === e.target.dataset.pathDone);
          if (p) {
            p.done = e.target.checked;
            save();
          }
        }
      });
      main.addEventListener("click", async (e) => {
        const el = e.target.closest("button");
        if (!el) return;
        const s = session();
        if (el.dataset.pathStart) {
          launch(el.dataset.pathStart);
          return;
        }
        if (el.dataset.pathChoice !== undefined) {
          s.path = catalog.advance(s.path, Number(el.dataset.pathChoice));
          s.note = "";
          refresh();
          return;
        }
        if (el.dataset.pathRewind !== undefined) {
          while (s.path.trail.length > Number(el.dataset.pathRewind))
            s.path = catalog.back(s.path);
          s.note = "";
          refresh();
          return;
        }
        if (el.dataset.pathTool) {
          save(true);
          open(labels[el.dataset.pathTool] ? el.dataset.pathTool : "studio");
          return;
        }
        if (el.dataset.pathDelete) {
          if (
            !(await ask({
              title: "Rimuovere il piano dal quaderno?",
              message:
                "Verranno rimosse anche le sue note. Puoi esportarlo prima di proseguire.",
              confirmLabel: "Rimuovi piano",
            }))
          )
            return;
          current().guidancePlans = saved().filter(
            (p) => p.id !== el.dataset.pathDelete,
          );
          save(true);
          notice(
            "Piano rimosso dal quaderno; il testo del manoscritto non cambia.",
          );
          refresh(false);
          return;
        }
        if (el.dataset.pathExportSaved) {
          const p = saved().find((p) => p.id === el.dataset.pathExportSaved);
          if (p) {
            const issue = catalog.issues.find((i) => i.id === p.issueId) || {
              title: "Percorso conservato",
              sources: [],
            };
            download(
              "percorso-" + p.issueId + ".txt",
              asText(issue, p, p.notes),
              "text/plain",
            );
          }
          return;
        }
        switch (el.dataset.pathOp) {
          case "catalog":
            s.path = null;
            s.note = "";
            refresh(false);
            break;
          case "back":
            s.path = catalog.back(s.path);
            s.note = "";
            refresh();
            break;
          case "restart":
            s.path = catalog.start(s.path.issueId);
            s.note = "";
            refresh();
            break;
          case "export": {
            const p = catalog.getResult(s.path),
              issue = catalog.issues.find((i) => i.id === s.path.issueId);
            download(
              "percorso-" + issue.id + ".txt",
              asText(issue, p, document.querySelector("#pathDraftNote").value),
              "text/plain",
            );
            break;
          }
          case "save": {
            const p = catalog.getResult(s.path);
            if (!p) return;
            const issue = catalog.issues.find((i) => i.id === s.path.issueId),
              existing = saved().find(
                (x) => x.issueId === issue.id && x.nodeId === s.path.current,
              );
            const notes = document.querySelector("#pathDraftNote").value;
            if (existing) {
              existing.notes = notes;
              s.note = notes;
            } else {
              current().guidancePlans = [
                {
                  id: uid(),
                  issueId: issue.id,
                  nodeId: s.path.current,
                  ...JSON.parse(JSON.stringify(p)),
                  sourceIds: [...issue.sources],
                  createdAt: new Date().toISOString(),
                  done: false,
                  notes,
                },
                ...saved(),
              ].slice(0, 30);
            }
            const ok = save(true);
            refresh(false);
            notice(
              ok
                ? "Piano salvato nel progetto e incluso nei backup."
                : "Piano nel lavoro locale: esporta una copia, il salvataggio è sospeso.",
            );
            break;
          }
        }
      });
    }
    return { render, attach, launch };
  }
  return { create };
});
