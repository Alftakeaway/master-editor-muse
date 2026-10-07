# The Master Editor & Muse
Prototype front-end statico, responsive, senza dipendenze di build.

## Avvio
Apri `index.html` direttamente oppure avvia un server locale:
`python -m http.server 8080`

## Incluso
Dashboard, Studio a tre pannelli, Muse, Personaggi, Architettura, Editor, Continuità, Publisher, salvataggio manoscritto via localStorage e simulazioni del Master Editor.

## Per collegare un LLM reale
Non mettere una API key nel browser. Crea un endpoint server-side `/api/editor` che riceva: testo selezionato, modalità, contesto del progetto e story bible. L'endpoint costruisce il system prompt editoriale e chiama il provider AI; il frontend mostra la risposta come proposta accettabile/rifiutabile.
