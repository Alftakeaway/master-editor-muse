# Ripostiglio AI

Integrazione conservata per il futuro, senza endpoint attivo.

- editor.js: endpoint server-side originale, quattro modalità di editing e controlli di accesso.
- frontend.js: copia della v2 prima della sospensione, con selezione e accettazione delle proposte.
- .env.example: nomi delle variabili, nessuna credenziale.
- vercel.json: precedente configurazione del timeout.

Per riattivarla: riportare editor.js in api/editor.js, reintegrare i controlli AI e runAI nel frontend corrente senza sovrascrivere gli sviluppi successivi, ripristinare il collegamento nel server locale e configurare il provider scelto. Il provider originale richiede credito API; nessuna richiesta viene eseguita mentre il modulo è archiviato.
I test del contratto usano risposte simulate, senza rete né costi.
