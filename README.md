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
- Timeline cronologica, riferimenti ai luoghi mancanti.
- Parole, avanzamento sul totale e obiettivo giornaliero netto.
- Publisher: genere, lettore, logline, sinossi, pitch, query, comp titles e percorso.
- Import JSON v2 (aggiunge progetti), TXT/Markdown (come nuova scena), export JSON, TXT/Markdown, dossier Publisher e backup completo.
- 30 versioni manuali o antecedenti alle modifiche AI/eliminazioni; ripristino nello Studio.

## AI conservata per il futuro
L’integrazione è archiviata in archive/ai/ e non è attiva sul sito. Non servono chiavi, abbonamenti o modelli locali. Lo Studio offre un taccuino; l’Editor descrive quattro passaggi di rilettura manuale. La continuità usa controlli documentali locali. Il ripostiglio è escluso dai deploy Vercel.

## Persistenza e limiti
I dati restano nel browser/dispositivo: nessuna sincronizzazione cloud o account. Esporta backup regolari prima di cambiare browser o cancellare i dati del sito. Il controllo documentale locale non verifica tutte le contraddizioni narrative.
Import TXT/Markdown conserva il contenuto come testo e non interpreta la formattazione. DOCX/PDF non supportati. Un archivio danneggiato non viene sovrascritto automaticamente.

## Verifica
`npm test`: migrazione, isolamento progetti, persistenza, archivio danneggiato, versioni, escaping e endpoint AI con provider simulato. Nessuna chiamata a pagamento nei test.
