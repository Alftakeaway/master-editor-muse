# The Master Editor & Muse — v2

Studio editoriale con lo stesso design avorio/borgogna e tipografia del prototipo. Nessuna dipendenza di build.

## Avvio locale
Node.js 22 o successivo: `npm run dev`, poi http://localhost:8080.
Il sito statico funziona anche senza AI; l’AI richiede il server locale o Vercel.

## Funzionalità
- Multi-progetto con migrazione automatica del vecchio `museState`, conservato come copia.
- Capitoli e scene modificabili, POV, data/ora narrativa, luogo, stato e spostamento tra capitoli.
- Salvataggio locale a ogni modifica, segnalazione degli errori di spazio e conflitti fra schede.
- Muse, Story Bible con personaggi/luoghi/oggetti/regole, beat ordinabili collegati alle scene.
- Timeline cronologica, riferimenti ai luoghi mancanti e controllo semantico tramite AI.
- Parole, avanzamento sul totale e obiettivo giornaliero netto.
- Publisher: genere, lettore, logline, sinossi, pitch, query, comp titles e percorso.
- Import JSON v2 (aggiunge progetti), TXT/Markdown (come nuova scena), export JSON, TXT/Markdown, dossier Publisher e backup completo.
- 30 versioni manuali o antecedenti alle modifiche AI/eliminazioni; ripristino nello Studio.

## AI reale e Vercel
`api/editor.js` è una funzione server-side per Vercel, con OpenAI Responses API.
Configura nelle variabili d’ambiente Vercel:
- `OPENAI_API_KEY`: chiave provider, esclusivamente sul server.
- `OPENAI_MODEL`: opzionale, predefinito `gpt-4.1-mini`.
- `EDITOR_ACCESS_TOKEN`: codice privato dello studio, obbligatorio per abilitare le richieste. Inseriscilo nel campo AI del sito; non viene salvato nel browser.
Per lo sviluppo copia `.env.example` in `.env.local` e compila i valori. I file `.env` sono esclusi da Git.

Developmental edit, line edit, copy edit e proofreading hanno istruzioni distinte. Solo le ultime tre restituiscono una riscrittura accettabile/rifiutabile. L’accettazione verifica che la scena non sia stata modificata nel frattempo e conserva l’originale. Supportate selezioni del testo nello Studio. Muse, continuità e Publisher restituiscono analisi.
Il testo scelto e il contesto (bible, beat, timeline e premessa) vengono inviati al provider. `store:false`; nessuna chiave provider o log di manoscritti nel frontend. Nessuna risposta dimostrativa spacciata per AI.

## Persistenza e limiti
I dati restano nel browser/dispositivo: nessuna sincronizzazione cloud o account. Esporta backup regolari prima di cambiare browser o cancellare i dati del sito. Il codice di accesso protegge uno studio privato, non sostituisce autenticazione individuale e rate limiting per un servizio pubblico multiutente. Le analisi AI richiedono credenziali e budget sul provider; massimo 60.000 caratteri per testo e contesto. Il controllo documentale locale non verifica tutte le contraddizioni narrative.
Import TXT/Markdown conserva il contenuto come testo e non interpreta la formattazione. DOCX/PDF non supportati. Un archivio danneggiato non viene sovrascritto automaticamente.

## Verifica
`npm test`: migrazione, isolamento progetti, persistenza, archivio danneggiato, versioni, escaping e endpoint AI con provider simulato. Nessuna chiamata a pagamento nei test.
