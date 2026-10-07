/* No automatic reload on updates; flush work and require an explicit action. */
(function () {
  if (!globalThis.navigator?.serviceWorker || !globalThis.isSecureContext) {
    const status = document.querySelector("#offlineStatus");
    if (status)
      status.textContent = "Offline non disponibile in questo contesto";
    return;
  }
  const status = document.querySelector("#offlineStatus"),
    button = document.querySelector("#applyUpdate");
  let registration,
    reloadRequested = false;
  const refresh = () => {
    if (!navigator.onLine) {
      status.textContent = registration?.active
        ? "Senza rete · studio locale"
        : "Senza rete · offline non ancora pronto";
      return;
    }
    status.textContent = registration?.active
      ? "Studio pronto offline"
      : "Preparazione offline…";
  };
  function waiting() {
    button.hidden = !registration?.waiting;
    if (registration?.waiting) {
      status.textContent = "Nuova versione disponibile";
    }
  }
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    refresh();
    waiting();
    if (reloadRequested) location.reload();
  });
  navigator.serviceWorker.addEventListener("message", (e) => {
    if (e.data?.type === "OTHER_TABS") {
      reloadRequested = false;
      notice(
        "Chiudi le altre schede dello studio prima di applicare l’aggiornamento.",
      );
    }
  });
  button.onclick = async () => {
    if (!registration?.waiting) return;
    if (!flush()) {
      notice(
        "Esporta o recupera il lavoro prima di aggiornare: il salvataggio è sospeso.",
      );
      return;
    }
    if (
      !(await ask({
        title: "Aggiornare lo studio?",
        message:
          "Il lavoro è stato salvato sul dispositivo. La pagina verrà ricaricata; chiudi le altre schede dello studio prima di procedere.",
        confirmLabel: "Aggiorna e riapri",
      }))
    )
      return;
    if (!flush()) return;
    reloadRequested = true;
    registration.waiting.postMessage({ type: "ACTIVATE_IF_ALONE" });
  };
  navigator.serviceWorker
    .register("/sw.js", { updateViaCache: "none" })
    .then((reg) => {
      registration = reg;
      refresh();
      waiting();
      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed") {
            refresh();
            waiting();
          }
        });
      });
      return navigator.serviceWorker.ready;
    })
    .then((reg) => {
      registration = reg;
      refresh();
      waiting();
    })
    .catch(() => {
      status.textContent = "Offline non pronto: riprova con connessione";
    });
  window.addEventListener("online", () => {
    refresh();
    waiting();
  });
  window.addEventListener("offline", refresh);
})();
