(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.WriterDeskUI = api;
})(globalThis, function () {
  "use strict";
  function create({ data, M, current, save, notice, download, open, ask }) {
    const E = M.esc,
      states = new Map();
    let prefs = { theme: "light", size: 18, spacing: 1.8, font: "serif" };
    try {
      const stored = JSON.parse(
        localStorage.getItem("musePreferences") || "null",
      );
      if (stored) {
        if (["light", "dark", "system"].includes(stored.theme))
          prefs.theme = stored.theme;
        if (
          Number.isInteger(stored.size) &&
          stored.size >= 16 &&
          stored.size <= 28
        )
          prefs.size = stored.size;
        if (stored.spacing >= 1.5 && stored.spacing <= 2.2)
          prefs.spacing = stored.spacing;
        if (["serif", "sans", "mono"].includes(stored.font))
          prefs.font = stored.font;
      }
    } catch {}
    function applyPrefs() {
      if (!document.documentElement) return;
      const dark =
        prefs.theme === "dark" ||
        (prefs.theme === "system" &&
          window.matchMedia?.("(prefers-color-scheme: dark)").matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      document.documentElement.style.setProperty(
        "--editor-size",
        prefs.size + "px",
      );
      document.documentElement.style.setProperty(
        "--editor-spacing",
        prefs.spacing,
      );
      document.documentElement.style.setProperty(
        "--editor-font",
        {
          serif: "Georgia, serif",
          sans: '"DM Sans", sans-serif',
          mono: "monospace",
        }[prefs.font],
      );
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", dark ? "#221f20" : "#6d2637");
    }
    function storePrefs() {
      applyPrefs();
      try {
        localStorage.setItem("musePreferences", JSON.stringify(prefs));
      } catch {
        notice(
          "Preferenze applicate per questa sessione; il browser non le ha salvate.",
        );
      }
    }
    function state() {
      const p = current();
      if (!states.has(p.id))
        states.set(p.id, { query: "", category: "", favorites: false });
      return states.get(p.id);
    }
    function cards() {
      const s = state(),
        items = data.filterResources(
          s.query,
          s.category,
          s.favorites,
          current().bookmarks || [],
        );
      return `<p role="status">${items.length} ${items.length === 1 ? "risorsa" : "risorse"} · collegamenti ai siti originali</p><div class="resource-grid">${
        items
          .map((r) => {
            const favorite = (current().bookmarks || []).includes(r.id);
            return `<article class="card resource-card"><div class="eyebrow">${E(r.category)} · ${E(r.language)}</div><h2>${E(r.name)}</h2><span class="tag">${E(r.access)}</span><p>${E(r.about)}</p><p><b>Per lo scrittore:</b> ${E(r.use)}</p><details><summary>Accesso e condizioni</summary><p>${E(r.note)}</p></details><div class="actions"><a class="btn" href="${E(r.url)}" target="_blank" rel="noopener noreferrer">Apri risorsa ↗</a><button class="btn" data-resource-favorite="${r.id}" aria-pressed="${favorite}">${favorite ? "★ Preferita" : "☆ Preferita"}</button><button class="btn" data-resource-note="${r.id}">Scheda di lettura</button></div></article>`;
          })
          .join("") ||
        "<p>Nessun risultato. Prova un’altra parola o togli il filtro.</p>"
      }</div>`;
    }
    function notes() {
      return `<section class="reading-notes"><div class="studio-top"><div><div class="eyebrow">QUADERNO DI LETTURA</div><h2>Leggi come uno scrittore.</h2></div><div><button class="btn" data-desk-action="addReading">Nuova scheda</button><button class="btn" data-desk-action="exportReading">Esporta quaderno .txt</button></div></div><p>Appunti e riferimenti restano nel progetto e nel backup. Non vengono scaricati libri o inviati testi alle biblioteche.</p>${(current().readingNotes || []).map((n) => `<article class="card"><label for="reading-title-${E(n.id)}">Titolo della lettura / ricerca</label><input id="reading-title-${E(n.id)}" data-reading-id="${E(n.id)}" data-reading-key="title" value="${E(n.title)}"><label for="reading-author-${E(n.id)}">Autore / istituzione</label><input id="reading-author-${E(n.id)}" data-reading-id="${E(n.id)}" data-reading-key="author" value="${E(n.author)}"><label for="reading-url-${E(n.id)}">Riferimento (URL)</label><input id="reading-url-${E(n.id)}" type="url" data-reading-id="${E(n.id)}" data-reading-key="url" value="${E(n.url)}"><label for="reading-note-${E(n.id)}">Osservazioni, tecnica da studiare e prova da fare</label><textarea id="reading-note-${E(n.id)}" data-reading-id="${E(n.id)}" data-reading-key="notes" maxlength="20000">${E(n.notes)}</textarea><div class="actions">${n.url ? `<a class="btn" href="${E(n.url)}" target="_blank" rel="noopener noreferrer">Apri riferimento ↗</a>` : ""}<button class="btn" data-reading-delete="${E(n.id)}">Rimuovi scheda</button></div></article>`).join("") || '<div class="card"><h3>Una lettura con una domanda.</h3><p>Scegli un testo e osserva un solo aspetto: apertura, dialogo, focalizzazione o ritmo. Registra ciò che noti e provalo in un frammento tuo.</p></div>'}</section>`;
    }
    function library() {
      return `<div class="hero"><div><div class="eyebrow">BIBLIOTECA DELLO SCRITTORE</div><h1>Leggere. Ricercare. Annotare.</h1><div class="sub">17 risorse di lettura, ricerca e scrittura selezionate da fonti ufficiali.</div></div></div><p class="path-intro">Libri, archivi, cataloghi e guide hanno usi diversi. Le schede distinguono consultazione, testi e ricerca; verifica sempre le condizioni dell’opera prima del riuso. I siti esterni richiedono connessione.</p><div class="path-filters card"><div><label for="resourceSearch">Cerca una risorsa</label><input id="resourceSearch" type="search" value="${E(state().query)}" placeholder="Italiano, mappe, classici, lingua…"></div><div><label for="resourceCategory">Tipo di risorsa</label><select id="resourceCategory"><option value="">Tutte le risorse</option>${[...new Set(data.resources.map((r) => r.category))].map((c) => `<option ${c === state().category ? "selected" : ""}>${E(c)}</option>`).join("")}</select><label class="check-item"><input id="resourceFavorites" type="checkbox" ${state().favorites ? "checked" : ""}> Solo preferite del progetto</label></div></div><div id="resourceCards">${cards()}</div>${notes()}`;
    }
    function comfort() {
      return `<div class="hero"><div><div class="eyebrow">LA TUA SCRIVANIA</div><h1>Il comfort della pagina.</h1><div class="sub">Preferenze del dispositivo, separate dal manoscritto.</div></div></div><div class="project"><div class="card"><h3>Aspetto</h3><label for="deskTheme">Tema</label><select id="deskTheme"><option value="light" ${prefs.theme === "light" ? "selected" : ""}>Carta avorio</option><option value="dark" ${prefs.theme === "dark" ? "selected" : ""}>Modalità notte</option><option value="system" ${prefs.theme === "system" ? "selected" : ""}>Segui il dispositivo</option></select><label for="deskSize">Dimensione del testo nello Studio: <output id="deskSizeValue">${prefs.size}</output> px</label><input id="deskSize" type="range" min="16" max="28" value="${prefs.size}"><label for="deskSpacing">Interlinea del testo</label><input id="deskSpacing" type="range" min="1.5" max="2.2" step="0.1" value="${prefs.spacing}"><label for="deskFont">Carattere del manoscritto</label><select id="deskFont"><option value="serif" ${prefs.font === "serif" ? "selected" : ""}>Serif · Georgia</option><option value="sans" ${prefs.font === "sans" ? "selected" : ""}>Sans-serif</option><option value="mono" ${prefs.font === "mono" ? "selected" : ""}>Monospaziato</option></select><button class="btn" data-desk-action="resetPrefs">Ripristina preferenze</button></div><div class="card"><div class="eyebrow">ANTEPRIMA</div><p class="desk-preview">La pagina è uno spazio di lavoro. Un gesto, una scelta, una conseguenza: la storia può ripartire da qui.</p><p>Queste scelte cambiano la lettura nello Studio, non il formato degli export. Puoi anche usare lo zoom del browser.</p><button class="btn" data-action="studio">Apri Studio</button></div></div><div class="card"><h3>Uso offline</h3><p>Attendi lo stato “Studio pronto offline” dopo il primo caricamento online. Da quel momento gli strumenti locali possono riaprirsi senza rete. Font remoti e biblioteche esterne possono non essere disponibili.</p><p>Un aggiornamento non cancella i progetti, ma il browser può rimuovere dati e cache: conserva backup esterni.</p><button class="btn" data-desk-action="checkUpdate">Controlla aggiornamenti</button><p id="updateCheckStatus" role="status"></p></div>`;
    }
    function guide() {
      return `<div class="hero"><div><div class="eyebrow">COME FUNZIONA</div><h1>Uno studio, quattro passaggi.</h1><div class="sub">La tua voce viene prima. Nessun account o servizio AI necessario.</div></div></div><div class="section-grid">${[
        [
          "muse",
          "1 · Muse",
          "Definisci la domanda, il desiderio e il conflitto.",
        ],
        [
          "studio",
          "2 · Studio",
          "Scrivi scene, collega note e struttura; conserva versioni.",
        ],
        [
          "editor",
          "3 · Editor",
          "Rivedi struttura, frase, correttezza e refusi in passaggi distinti.",
        ],
        [
          "publisher",
          "4 · Publisher",
          "Prepara logline, sinossi e proposta per un destinatario reale.",
        ],
      ]
        .map(
          ([v, t, desc]) =>
            `<div class="card"><h3>${t}</h3><p>${desc}</p><button class="btn" data-action="${v}">Apri ${t.slice(4)}</button></div>`,
        )
        .join(
          "",
        )}</div><div class="card"><h3>Una prima sessione</h3><ol><li>Crea un progetto vuoto o scegli un modello facoltativo.</li><li>Scrivi una premessa provvisoria, poi una scena con un cambiamento.</li><li>Annota i fatti stabili nella Story Bible.</li><li>Esporta un backup JSON e conserva il file fuori dal browser.</li></ol><p>I modelli sono appunti di partenza modificabili, non formule obbligatorie.</p><button class="btn" data-desk-action="newTemplate">Crea da un modello</button></div><div class="project"><div class="card"><h3>Dove restano i dati</h3><p>I progetti, i piani e il quaderno di lettura sono nel browser, sul dispositivo e sull’indirizzo usato. Il programma non invia il manoscritto a un server.</p><p>localhost e il sito pubblico hanno archivi distinti. Per trasferire il lavoro usa export e import JSON.</p><p>Il sito è servito da Vercel; i font remoti sono forniti da Google Fonts. Questi servizi possono gestire dati tecnici delle connessioni. Non sono inclusi analytics, account, pagamenti o invii AI.</p><a class="btn" href="come-funziona.html" target="_blank" rel="noopener">Guida pubblica e dati ↗</a></div><div class="card"><h3>Scegli il file giusto</h3><p><b>JSON:</b> tutto il progetto. <b>TXT / Markdown:</b> testo. <b>DOCX:</b> manoscritto modificabile. <b>EPUB:</b> lettura con indice. <b>PDF:</b> stampa del browser.</p><p>DOCX ed EPUB sono esportazioni del manoscritto: non sostituiscono il backup delle schede. Import DOCX/EPUB non incluso.</p><p>Ctrl/Cmd+S salva una versione; Ctrl/Cmd+E esporta il progetto. I 36 Percorsi aiutano a scegliere una prova quando incontri un ostacolo.</p><button class="btn" data-action="paths">Apri Percorsi</button></div></div>`;
    }
    async function newProject() {
      const d = document.querySelector("#actionDialog"),
        previous = document.activeElement;
      d.innerHTML = `<form id="templateForm"><h2 id="actionTitle">Inizia un nuovo progetto</h2><label for="templateTitle">Titolo</label><input id="templateTitle" required maxlength="200"><label for="projectTemplate">Punto di partenza</label><select id="projectTemplate">${data.templates.map((t) => `<option value="${t.id}">${E(t.title)}</option>`).join("")}</select><p id="templatePreview" role="status">${E(data.templates[0].summary)}</p><p>Il modello crea un nuovo progetto e non sostituisce quelli esistenti.</p><div class="dialog-actions"><button type="button" id="templateCancel" class="btn">Annulla</button><button type="submit" class="btn primary">Crea progetto</button></div></form>`;
      return new Promise((resolve) => {
        const finish = (p) => {
          d.close();
          d.oncancel = null;
          if (previous?.isConnected) previous.focus();
          resolve(p);
        };
        d.querySelector("#projectTemplate").onchange = (e) =>
          (d.querySelector("#templatePreview").textContent =
            data.templates.find((t) => t.id === e.target.value).summary);
        d.querySelector("#templateCancel").onclick = () => finish(null);
        d.oncancel = (e) => {
          e.preventDefault();
          finish(null);
        };
        d.querySelector("#templateForm").onsubmit = (e) => {
          e.preventDefault();
          const title = d.querySelector("#templateTitle").value.trim();
          if (title)
            finish(
              data.fromTemplate(
                d.querySelector("#projectTemplate").value,
                title,
                M,
              ),
            );
        };
        d.showModal();
        d.querySelector("#templateTitle").focus();
      });
    }
    function attach(main) {
      main.addEventListener("input", (e) => {
        const el = e.target;
        if (el.id === "resourceSearch") {
          state().query = el.value;
          document.querySelector("#resourceCards").innerHTML = cards();
        }
        if (el.dataset.readingId) {
          const n = current().readingNotes.find(
              (n) => n.id === el.dataset.readingId,
            ),
            key = el.dataset.readingKey;
          if (!n || !["title", "author", "url", "notes"].includes(key)) return;
          if (key === "url" && el.value && !data.safeURL(el.value)) {
            el.setAttribute("aria-invalid", "true");
            notice("Usa un URL http o https senza credenziali.");
            return;
          }
          el.removeAttribute("aria-invalid");
          n[key] = el.value;
          save();
        }
        if (el.id === "deskSize") {
          prefs.size = Number(el.value);
          document.querySelector("#deskSizeValue").textContent = prefs.size;
          storePrefs();
        }
        if (el.id === "deskSpacing") {
          prefs.spacing = Number(el.value);
          storePrefs();
        }
      });
      main.addEventListener("focusout", (e) => {
        if (
          e.target.dataset.readingKey === "url" &&
          e.target.hasAttribute("aria-invalid")
        ) {
          e.target.value = current().readingNotes.find(
            (n) => n.id === e.target.dataset.readingId,
          ).url;
          e.target.removeAttribute("aria-invalid");
        }
      });
      main.addEventListener("change", (e) => {
        const el = e.target;
        if (el.dataset.readingKey === "url") {
          const article = el.closest("article");
          const link = article?.querySelector("a");
          if (link) {
            const url = data.safeURL(el.value);
            link.hidden = !url;
            if (url) link.href = url;
          }
        }
        if (el.id === "resourceCategory") {
          state().category = el.value;
          document.querySelector("#resourceCards").innerHTML = cards();
        }
        if (el.id === "resourceFavorites") {
          state().favorites = el.checked;
          document.querySelector("#resourceCards").innerHTML = cards();
        }
        if (el.id === "deskTheme") {
          prefs.theme = el.value;
          storePrefs();
        }
        if (el.id === "deskFont") {
          prefs.font = el.value;
          storePrefs();
        }
      });
      main.addEventListener("click", async (e) => {
        const el = e.target.closest("button");
        if (!el) return;
        const p = current();
        if (el.dataset.resourceFavorite) {
          const id = el.dataset.resourceFavorite;
          p.bookmarks = p.bookmarks.includes(id)
            ? p.bookmarks.filter((x) => x !== id)
            : [...p.bookmarks, id];
          save(true);
          open("library");
          return;
        }
        if (el.dataset.resourceNote || el.dataset.deskAction === "addReading") {
          if (p.readingNotes.length >= 100) {
            notice(
              "Il quaderno contiene 100 schede. Esporta e archivia prima di aggiungerne altre.",
            );
            return;
          }
          const r = data.resources.find(
            (r) => r.id === el.dataset.resourceNote,
          );
          p.readingNotes.unshift({
            id: M.uid(),
            resourceId: r?.id || "",
            title: "Lettura da annotare",
            author: "",
            url: r?.url || "",
            notes:
              "Domanda di lettura:\n\nChe cosa osservo nel testo:\n\nUna tecnica da provare:\n\nRiferimento e pagina:",
            createdAt: new Date().toISOString(),
          });
          save(true);
          open("library");
          document.querySelector(".reading-notes input")?.focus();
          return;
        }
        if (el.dataset.readingDelete) {
          if (
            !(await ask({
              title: "Rimuovere la scheda di lettura?",
              message:
                "La scheda e i suoi appunti saranno rimossi. Esporta il quaderno se vuoi conservarli.",
              confirmLabel: "Rimuovi scheda",
            }))
          )
            return;
          p.readingNotes = p.readingNotes.filter(
            (n) => n.id !== el.dataset.readingDelete,
          );
          save(true);
          open("library");
          return;
        }
        if (el.dataset.deskAction === "exportReading")
          download(
            "quaderno-lettura.txt",
            p.readingNotes
              .map((n) => [n.title, n.author, n.url, n.notes].join("\n"))
              .join("\n\n—\n\n"),
            "text/plain",
          );
        if (el.dataset.deskAction === "newTemplate")
          document.querySelector("#newProject").click();
        if (el.dataset.deskAction === "resetPrefs") {
          prefs = { theme: "light", size: 18, spacing: 1.8, font: "serif" };
          storePrefs();
          open("comfort");
        }
        if (el.dataset.deskAction === "checkUpdate") {
          const status = document.querySelector("#updateCheckStatus");
          status.textContent = "Controllo in corso…";
          try {
            const reg = await navigator.serviceWorker?.getRegistration();
            if (!reg) {
              status.textContent = "Offline non attivo in questo browser.";
              return;
            }
            await reg.update();
            status.textContent = reg.waiting
              ? "Nuova versione pronta: usa Aggiorna studio."
              : "Controllo completato. Eventuali aggiornamenti compariranno nella barra dello studio.";
          } catch {
            status.textContent =
              "Controllo non disponibile: verifica la connessione.";
          }
        }
      });
    }
    function init() {
      applyPrefs();
      window
        .matchMedia?.("(prefers-color-scheme: dark)")
        .addEventListener?.("change", applyPrefs);
    }
    return { library, comfort, guide, newProject, attach, init };
  }
  return { create };
});
