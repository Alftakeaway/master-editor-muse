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
