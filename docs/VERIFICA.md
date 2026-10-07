# Verifica dell’aggiornamento — 7 ottobre 2026

## Test automatici

Eseguire npm test: 20 casi su migrazione, persistenza, dati danneggiati, conflitti prima dell’evento storage, errori di spazio, remapping degli identificativi, file binari, Markdown con titoli e blocchi di codice, limiti delle versioni, metadati recuperabili, date impossibili, conteggi netti, strumenti del testo, fallback degli ID, escaping e AI archiviata con provider simulato.

## Flussi provati nel browser Chromium

- Creazione di un progetto vuoto con dialogo.
- Scrittura, annulla/ripeti e persistenza dopo il ricaricamento.
- Sinossi sincronizzata fra Studio e Bacheca.
- Concentrazione ed uscita con Escape.
- Eliminazione e recupero del testo di una scena.
- Ricerca nel manoscritto.
- Import Markdown con due capitoli e scene.
- Avvio, pausa e fine sprint.
- Checklist mantenuta dopo il ricaricamento.
- Conflitto reale fra due schede e caricamento dell’archivio aggiornato.
- Layout Studio e Strumenti a 390 px senza scorrimento orizzontale.

Verifica visiva desktop a 1440 px e mobile a 390 px. Screenshot di controllo esclusi da Git.

Non sono verificati automaticamente tutti i browser, ogni combinazione di file o l’accessibilità con uno screen reader reale.

- Export JSON e reimportazione del file scaricato, con progetti aggiunti.
- Rifiuto di file binario rinominato TXT, senza modifiche al progetto.
- Ripristino del valore precedente dopo un obiettivo numerico lasciato vuoto.
- Preparazione della stampa del dossier con i contenuti Publisher.
- Archivio danneggiato in un browser isolato: export del dato originale e reimpostazione con copia.

## Percorsi decisionali — aggiornamento

28 test automatici complessivi. Aggiunte prove di copertura di tutti i rami (36 alberi e 293 esiti), massimo tre domande, ritorno a una scelta precedente, filtri, risultati di sostegno e import/export dei piani.

Nel browser: percorso del blocco fino al risultato, salvataggio con note, aggiornamento senza duplicati, stato completato, ricaricamento, apertura Studio, ricerca e filtro, ramo di sostegno senza timer, navigazione indietro, nuovo progetto con quaderno separato, export TXT e layout a 390 px senza scorrimento orizzontale.

- Verificato roundtrip reale del backup JSON con piano, note e stato completato.
- Verificati annullamento e conferma della rimozione dal quaderno.

## Comfort, biblioteca ed offline

36 test complessivi. Template validi e indipendenti, risorse e filtri, URL, note e preferiti in import/export, ZIP/CRC, DOCX e struttura EPUB. Worker testato per escludere API, POST e siti esterni e rinviare l’attivazione con altre schede.

Prove browser: creazione fantasy, testo regolabile e notte persistenti, preferiti e note dopo reload, quaderno incluso nel roundtrip JSON, download DOCX/EPUB, layout biblioteca/preferenze a 390 px. Offline reale: reload, modifica del testo, salvataggio, nuovo reload e catalogo locale. Aggiornamento con due schede rinviato; dopo la chiusura della seconda aggiornamento e riapertura senza perdita del testo.

DOCX letto con python-docx; EPUB controllato con zipfile e parser XML, riferimenti del manifest risolti. Verifica visiva notte desktop/mobile. Nessuna certificazione generale WCAG o EPUBCheck dichiarata.
