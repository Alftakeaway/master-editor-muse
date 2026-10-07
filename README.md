# The Master Editor & Muse

Studio editoriale per progettare, scrivere e revisionare un romanzo. La v2 conserva il design avorio e borgogna, i titoli serif e gli spazi di scrittura del progetto originale.

**Sito:** [master-editor-muse.vercel.app](https://master-editor-muse.vercel.app)
**Repository:** [Alftakeaway/master-editor-muse](https://github.com/Alftakeaway/master-editor-muse)
**Branch di produzione:** `main`

## Stato del progetto

L’applicazione funziona senza chiavi API o servizi AI. L’integrazione AI è conservata nel [ripostiglio del progetto](archive/ai/README.md) per una possibile riattivazione futura; non è attiva nell’interfaccia né pubblicata come funzione server-side.

## Funzionalità

| Area | Percorsi | 36 alberi decisionali, piani salvabili, note, verifica dell’esito e collegamenti agli strumenti |
| Strumenti disponibili |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Dashboard | Selezione e creazione di progetti, titolo, genere, obiettivo totale e giornaliero |
| Studio | Capitoli e scene ordinabili, sinossi, note, metadati, annulla/ripeti, concentrazione, sprint e taccuino contestuale |
| Bacheca | Schede delle scene con sinossi e ordine collegato al manoscritto |
| Muse | Premessa, tema, conflitto, posta in gioco, alternative e domanda editoriale |
| Story Bible | Schede modificabili per personaggi, luoghi, oggetti e regole |
| Architettura | Beat ordinabili, atto, conseguenze e collegamento alla scena |
| Editor | Checklist salvata ed esportabile per developmental, line, copy edit e proofreading |
| Continuità | Timeline dalle date delle scene, luoghi non documentati e collegamenti ai beat mancanti |
| Publisher | Genere, lettore, logline, sinossi, pitch, query, comp titles, percorso, export TXT e stampa/PDF del dossier |
| Strumenti | Ricerca nelle scene, parole, caratteri, tempo di lettura, ripetizioni, frasi lunghe e statistiche degli ultimi sette giorni |

Il salvataggio locale accorpa le modifiche con una pausa di 350 ms e viene completato quando lasci un campo, cambi sezione o nascondi la pagina. Lo stato distingue modifiche in attesa, salvataggio riuscito e sospensione. La dashboard mostra le parole del progetto, la percentuale dell’obiettivo e le parole nette aggiunte nella giornata. Lo Studio permette di conservare e ripristinare versioni del testo.

## Tecnologie

- HTML, CSS e JavaScript senza framework o dipendenze applicative.
- `localStorage` per progetti e manoscritti.
- Node.js per il server di sviluppo e i test.
- Vercel per la pubblicazione statica, collegata a GitHub.
- Font DM Sans e Libre Caslon Display caricati da Google Fonts, con caratteri di riserva.

Non sono presenti database, account utente o sincronizzazione cloud.

## Avvio locale

Serve Node.js **22 o successivo**, con npm, e un browser aggiornato. Non occorrono credenziali né installazioni di modelli AI.

```sh
git clone https://github.com/Alftakeaway/master-editor-muse.git
cd master-editor-muse
npm run dev
```

Apri [http://localhost:8080](http://localhost:8080). Il server ascolta soltanto sul computer locale. Per arrestarlo usa `Ctrl+C` nel terminale che lo ha avviato.

Il progetto non richiede un passaggio di build né pacchetti esterni. È possibile aprire `index.html` direttamente, ma il server locale è la modalità consigliata per avere un’origine stabile del salvataggio.

## Uso quotidiano

1. Crea un progetto o selezionalo dal menu laterale.
2. Imposta titolo, genere e obiettivi nella Dashboard.
3. Aggiungi capitoli e scene nello Studio; compila date e luoghi per costruire la timeline.
4. Sviluppa premessa, Story Bible e beat nelle rispettive sezioni.
5. Prima di una riscrittura, usa **Salva versione**. Per recuperarla apri **Versioni precedenti** nella stessa scena.
6. Prepara i materiali nel Publisher ed esporta un backup dalla Dashboard.

## Salvataggio, versioni e backup

L’archivio corrente usa la chiave `museV2` nel `localStorage`. Al primo avvio, un manoscritto del vecchio formato `museState` viene migrato in un progetto v2; il dato precedente viene conservato.

I progetti restano nel browser e nell’origine in cui sono stati creati. Il sito pubblico e `localhost:8080` hanno archivi distinti. Anche browser, profili, dispositivi o indirizzi differenti possono avere archivi separati: usa export e import per trasferire il lavoro.

Sono conservate fino a **30 versioni per scena**, con un limite globale di **300 per progetto**. Le versioni automatiche conservano il testo precedente alla prima modifica e alle successive modifiche dopo almeno 30 secondi; non sono copie di ogni battitura. Versioni manuali, eliminazioni e ripristini conservano anche i metadati della scena. Le scene eliminate si recuperano da **Versioni precedenti** come nuove scene. I limiti possono rimuovere le copie più vecchie.

Annulla/ripeti mantiene fino a 50 gruppi di modifiche per scena durante la sessione del browser, anche quando cambi scena. Questo stack non persiste al ricaricamento; le versioni salvate sì.

### Formati

| Operazione          | Formato e comportamento                                                    |
| ------------------- | -------------------------------------------------------------------------- |
| Esporta progetto    | JSON v2 con il progetto attivo e i relativi dati                           |
| Backup completo     | JSON v2 con tutti i progetti                                               |
| Importa JSON        | Aggiunge i progetti, senza sostituire quelli già presenti                  |
| Importa TXT         | Crea un progetto con il testo in una scena                                 |
| Importa Markdown    | Titoli `#` → capitoli; `##` → scene; altri contenuti conservati come testo |
| Esporta manoscritto | TXT o Markdown con capitoli, scene e testo                                 |
| Esporta Publisher   | Dossier editoriale in TXT                                                  |

Gli import devono essere UTF-8; file binari, date impossibili, obiettivi non validi e identificativi duplicati sono respinti prima di cambiare i progetti. Gli identificativi dei progetti importati vengono rigenerati insieme ai riferimenti di scene, beat e versioni. Il limite di importazione è **10 MB**. Import DOCX, EPUB e PDF non incluso.

## Struttura e architettura

```text
index.html          Struttura della pagina e navigazione
style.css           Design editoriale e adattamento agli schermi
app.js              Interfaccia, navigazione e azioni
core.js             Modello, validazione, migrazione, import e strumenti del testo
paths-data.js       Catalogo editoriale, fonti e alberi decisionali
paths-ui.js         Percorsi interattivi e quaderno dei piani
icon.svg            Icona del sito
server.js           Server locale dei file attivi
package.json        Comandi di avvio e verifica
tests/app.test.js   Test di persistenza e integrazione archiviata
archive/ai/         Ripostiglio dell’integrazione AI
.vercelignore       Esclusioni dei file dal deploy
.gitignore          Esclusioni di credenziali e file locali da Git
```

Ogni archivio contiene una versione di schema, un progetto attivo e una lista di progetti. Ogni progetto raccoglie capitoli con scene, Muse, Story Bible, beat, Publisher, conteggi giornalieri e versioni del testo. Le modifiche aggiornano lo stato in memoria e poi l’archivio locale.

Il server locale serve la pagina e i file CSS/JavaScript tramite un elenco esplicito di percorsi. Il vecchio percorso AI restituisce una risposta di integrazione archiviata; la produzione non contiene una funzione AI attiva.

## Ripostiglio AI

[archive/ai/](archive/ai/README.md) conserva l’endpoint originale, una copia del frontend precedente alla sospensione, l’esempio delle variabili e la configurazione del timeout. Nessuna credenziale è inclusa.

L’integrazione originale distingue developmental edit, line edit, copy edit e proofreading; prevedeva selezione del testo, accettazione delle proposte e conservazione dell’originale. È materiale per sviluppi futuri, non una funzione disponibile oggi. Nessuna variabile d’ambiente è necessaria per l’applicazione attuale.

## Comandi e verifiche

```sh
npm run dev
npm test
```

I test verificano migrazione del manoscritto precedente, isolamento dei progetti, persistenza al riavvio, conservazione degli archivi illeggibili, versioni, escaping dei contenuti, contratto dell’endpoint archiviato e assenza di controlli o richieste AI nell’interfaccia attiva. Il provider nei test è simulato: non vengono effettuate chiamate a pagamento.

I test automatici non sostituiscono la verifica visiva e delle interazioni in un browser reale.

## Pubblicazione su Vercel

Il repository è collegato al progetto Vercel **master-editor-muse**. Il push sul branch `main` avvia il deploy di produzione.

```sh
npm test
git diff --check
git add README.md
git commit -m "docs: update project readme"
git push origin main
```

Il sito usa il preset **Other** e la radice del repository. Vercel esegue npm run vercel-build: prepara il fingerprint dell’offline e copia soltanto gli asset pubblici in public/. La cartella è generata ed esclusa da Git; vercel.json seleziona questo output. Archivi, test e script non vengono pubblicati come file del sito.

Dopo la pubblicazione, verifica che il deployment sia **Ready** su Vercel e apri il sito di produzione. Per ripristinare una versione precedente puoi usare i deployment conservati nel pannello Vercel; questo non ripristina i manoscritti nel browser.

## Problemi comuni e limiti

- **Il progetto non compare su un altro dispositivo:** i dati sono locali; importa il backup JSON nello stesso sito sul nuovo dispositivo.
- **Salvataggio non riuscito:** il browser potrebbe aver esaurito lo spazio o negato l’accesso. Esporta subito il lavoro prima di intervenire sui dati del sito.
- **Archivio illeggibile:** l’app sospende la scrittura per non sovrascrivere il dato originale. Il recupero o reset dell’archivio va gestito dopo averne conservato una copia.
- **Modifica in un’altra scheda:** il salvataggio viene sospeso nella scheda che rileva il conflitto. Usa **Esporta copie**, poi **Carica archivio aggiornato** per risolvere senza ricaricare la pagina.
- **Porta 8080 occupata:** arresta il server già aperto prima di avviarne un secondo.
- **Timeline incompleta:** compila le date delle scene; quelle senza data sono conteggiate separatamente.
- **Controllo di continuità:** segnala riferimenti documentali mancanti, non tutte le contraddizioni narrative. Serve anche una rilettura del manoscritto.
- **Sessione giornaliera:** misura la variazione netta del testo, inclusi tagli e ripristini; può essere negativa. Non misura il tempo di lavoro.

L’applicazione attuale è uno studio personale con archivi locali. Collaborazione in tempo reale, account, sincronizzazione cloud, import DOCX/PDF e analisi AI restano fuori dalle funzionalità attive.

## Strumenti gratuiti e ispirazioni

Le nuove funzioni sono eseguite sul dispositivo: nessun abbonamento, chiave API o servizio AI. Bacheca e sinossi prendono spunto dal [Corkboard di Scrivener](https://www.literatureandlatte.com/blog/organize-your-scrivener-project-with-the-corkboard); concentrazione, note e sprint dalla presentazione ufficiale di [Novlr](https://www.novlr.org/). È stata consultata anche [Reedsy Studio](https://reedsy.com/studio/) per il flusso di preparazione editoriale. Non vengono copiate interfacce, contenuti o servizi dei prodotti.

- **Ricerca**: testo, titolo e note delle scene, con un massimo di 100 risultati visualizzati.
- **Analisi**: frequenze letterali (non lemmatizzate), frasi oltre 35 parole e lettura stimata a 200 parole/minuto. Non sono giudizi editoriali o correzioni grammaticali automatiche.
- **Taccuino**: riconosce i nomi testuali della Story Bible e mostra i beat collegati; non comprende sinonimi o significato.
- **Sprint**: da 1 a 120 minuti, pausa e ripresa; termina al ricaricamento del browser.
- **Stampa/PDF**: usa la finestra di stampa del browser e la destinazione “Salva come PDF”, se disponibile.
- **Scorciatoie**: Ctrl/Cmd+S salva una versione, Ctrl/Cmd+E esporta il progetto, Esc chiude i dialoghi o la concentrazione.
- **Recupero**: un solo file muse-recupero.json conserva il lavoro locale e la stringa originale dell’archivio nel campo recoveryOriginalRaw. Importandolo normalmente vengono recuperati i progetti correnti; il dato originale rimane disponibile per un recupero tecnico.

I font possono richiedere rete al primo caricamento. Dopo lo stato Studio pronto offline gli strumenti possono riaprire senza rete; i siti esterni richiedono connessione.

## Percorsi decisionali per scrittori

La sezione **Percorsi** è accessibile dal menu, dalla Dashboard e dal pulsante **Un ostacolo?** nello Studio. Copre 36 difficoltà ricorrenti in sette aree: Ripartire, Ideare, Strutturare, Personaggi e mondo, Revisionare, Condividere, Gestire il lavoro. È un catalogo ampio, non una tassonomia esaustiva di ogni difficoltà possibile.

Ogni albero ha due domande specifiche e, dove pertinente, una terza per scegliere una prova breve o estesa. Si arriva a uno dei 293 esiti: 148 protocolli editoriali con varianti di durata (3 esiti di sostegno non richiedono un timer). Ogni risultato contiene motivazione, tre azioni, criterio di verifica, alternativa se non basta, percorsi correlati e fonti.

- Ricerca per testo e filtro per area.
- Indietro, ricomincia e ritorno a una scelta precedente attraverso il riepilogo.
- Collegamento alla sezione pertinente senza sostituire il manoscritto.
- **Salva piano nel progetto**: conserva fino a 30 piani, note e stato “Ho svolto la prova”. Salvataggi ripetuti dello stesso esito aggiornano le note senza duplicare il piano.
- Export TXT del piano. Backup JSON include il quaderno; importazione rigenera gli ID dei piani senza perdere contenuti.
- La navigazione e le risposte rimangono soltanto nella sessione, separatamente per progetto. Il quaderno salva il piano scelto e gli appunti espliciti, non il questionario.

Gli esercizi sono una sintesi editoriale originale. Lo studio di Ahmed e Güss informa la classificazione del blocco, ma non valida questo strumento come test diagnostico. I percorsi non attribuiscono condizioni cliniche dalla durata del blocco; quelli sul disagio generale indicano sostegno senza obiettivi di produzione. Non sono richiesti AI, account, API o servizi a pagamento.

Catalogo completo e criteri: [docs/PERCORSI.md](docs/PERCORSI.md).

## Comfort, guida e modelli

**Preferenze** offre carta avorio, modalità notte e tema del dispositivo, oltre a corpo del manoscritto (16–28 px), carattere e interlinea. Le preferenze sono in `musePreferences`, separate dai progetti, e non cambiano il formato degli export. Lo zoom del browser rimane disponibile.

**Guida** illustra Muse → Studio → Editor → Publisher e spiega archivio, trasferimento e backup. Le guide accanto ai campi sono apribili da tastiera con esempi inventati. La [pagina pubblica](https://master-editor-muse.vercel.app/come-funziona.html) descrive uso e funzionamento dei dati, senza testimonianze inventate o certificazioni di conformità.

Nuovo progetto offre sette punti di partenza: vuoto, romanzo, giallo, romance, fantasy, saggio e racconto. Creano nuove schede modificabili; non riscrivono i progetti esistenti.

## Biblioteca e quaderno di lettura

17 risorse per libri, archivi, cataloghi, ricerca, lingua e scrittura. Fra queste Liber Liber, Project Gutenberg, Wikisource, Gallica, Europeana, Internet Culturale, SBN, DOAB, DOAJ, Library of Congress, Commons e Crusca. [Catalogo e condizioni](docs/BIBLIOTECA.md).

Non tutti i cataloghi contengono testi completi; consultazione gratuita non equivale a una licenza generale di riuso. Ricerca, filtri e preferiti sono locali. Il quaderno permette fino a 100 schede create nell’interfaccia con titolo, autore, URL e appunti; export TXT e backup JSON disponibili. L’import valida gli URL e rigenera gli ID delle note. Nessun libro viene copiato nel sito.

## Export DOCX ed EPUB

Generati sul dispositivo senza librerie di rete. DOCX contiene titolo, autore facoltativo, capitoli, scene e paragrafi in un manoscritto modificabile. EPUB contiene metadati in italiano, indice dei capitoli e XHTML senza DRM. Sono formati di lavoro/lettura: niente copertine, immagini o impaginazione specifica per un editore. Non sostituiscono il backup JSON delle schede.

Verificati checksum ZIP, XML e riferimenti EPUB; DOCX letto con python-docx. Non sono stati eseguiti EPUBCheck o test su ogni lettore e versione di Word. Import DOCX ed EPUB non incluso.

## Offline e aggiornamenti

Il worker conserva soltanto gli asset pubblici della stessa origine. Non legge il localStorage, non memorizza manoscritti nella cache e non intercetta AI, POST o siti esterni. Il browser può rimuovere dati e cache: offline non sostituisce un backup esterno.

Dopo un aggiornamento compare **Aggiorna studio**. L’azione verifica il salvataggio e chiede un ricaricamento esplicito; con più schede aperte l’attivazione viene rinviata. Manifest e icona sono inclusi; installazione dipendente dal browser.

Per preparare una pubblicazione:

```sh
npm test
npm run vercel-build
git diff --check
```

La build aggiorna `sw.js` con il fingerprint degli asset: includilo nel commit. Su Vercel la preparazione è automatica. `public/` contiene solo l’output generato. Sviluppo locale: `npm run dev`; `PORT` può scegliere una porta alternativa.

Riferimenti: [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), [ECMA-376](https://ecma-international.org/publications-and-standards/standards/ecma-376/), [EPUB 3.3](https://www.w3.org/TR/epub-33/).
