# The Master Editor & Muse

Studio editoriale per progettare, scrivere e revisionare un romanzo. La v2 conserva il design avorio e borgogna, i titoli serif e gli spazi di scrittura del progetto originale.

**Sito:** [master-editor-muse.vercel.app](https://master-editor-muse.vercel.app)  
**Repository:** [Alftakeaway/master-editor-muse](https://github.com/Alftakeaway/master-editor-muse)  
**Branch di produzione:** `main`

## Stato del progetto

L’applicazione funziona senza chiavi API o servizi AI. L’integrazione AI è conservata nel [ripostiglio del progetto](archive/ai/README.md) per una possibile riattivazione futura; non è attiva nell’interfaccia né pubblicata come funzione server-side.

## Funzionalità

| Area | Strumenti disponibili |
| --- | --- |
| Dashboard | Selezione e creazione di progetti, titolo, genere, obiettivo totale e giornaliero |
| Studio | Capitoli e scene, testo, POV, data/ora narrativa, luogo, stato, spostamento fra capitoli e taccuino di revisione |
| Muse | Premessa, tema, conflitto, posta in gioco, alternative e domanda editoriale |
| Story Bible | Schede modificabili per personaggi, luoghi, oggetti e regole |
| Architettura | Beat ordinabili, atto, conseguenze e collegamento alla scena |
| Editor | Guida ai quattro passaggi manuali: developmental edit, line edit, copy edit e proofreading |
| Continuità | Timeline dalle date delle scene, luoghi non documentati e collegamenti ai beat mancanti |
| Publisher | Genere, lettore, logline, sinossi, pitch, query, comp titles, percorso ed export del dossier |

Il salvataggio avviene sul dispositivo a ogni modifica. La dashboard mostra le parole del progetto, la percentuale dell’obiettivo e le parole nette aggiunte nella giornata. Lo Studio permette di conservare e ripristinare versioni del testo.

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

Sono conservate fino a **30 versioni per progetto**, condivise fra tutte le scene. Le versioni vengono create manualmente o prima dell’eliminazione di una scena. Non è una cronologia automatica di ogni battitura.

Esporta regolarmente **Backup di tutti i progetti**, soprattutto prima di cambiare dispositivo o cancellare i dati del browser. Un deploy del sito non trasferisce i manoscritti a GitHub o Vercel.

### Formati

| Operazione | Formato e comportamento |
| --- | --- |
| Esporta progetto | JSON v2 con il progetto attivo e i relativi dati |
| Backup completo | JSON v2 con tutti i progetti |
| Importa JSON | Aggiunge i progetti, senza sostituire quelli già presenti |
| Importa TXT / Markdown | Crea un progetto con il contenuto in una scena; non interpreta la formattazione |
| Esporta manoscritto | TXT o Markdown con capitoli, scene e testo |
| Esporta Publisher | Dossier editoriale in TXT |

Il limite di importazione è **10 MB**. DOCX e PDF non sono supportati.

## Struttura e architettura

```text
index.html          Struttura della pagina e navigazione
style.css           Design editoriale e adattamento agli schermi
app.js              Viste, progetti, salvataggio, versioni e import/export
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

Il sito usa il preset **Other**, la cartella radice del repository e l’output statico nella radice. Non richiede una build applicativa. La configurazione `.vercelignore` esclude il ripostiglio, i test, il server locale e i file di ambiente dal deploy.

Dopo la pubblicazione, verifica che il deployment sia **Ready** su Vercel e apri il sito di produzione. Per ripristinare una versione precedente puoi usare i deployment conservati nel pannello Vercel; questo non ripristina i manoscritti nel browser.

## Problemi comuni e limiti

- **Il progetto non compare su un altro dispositivo:** i dati sono locali; importa il backup JSON nello stesso sito sul nuovo dispositivo.
- **Salvataggio non riuscito:** il browser potrebbe aver esaurito lo spazio o negato l’accesso. Esporta subito il lavoro prima di intervenire sui dati del sito.
- **Archivio illeggibile:** l’app sospende la scrittura per non sovrascrivere il dato originale. Il recupero o reset dell’archivio va gestito dopo averne conservato una copia.
- **Modifica in un’altra scheda:** il salvataggio viene sospeso nella scheda che rileva il conflitto. Esporta il lavoro locale e ricarica prima di continuare.
- **Porta 8080 occupata:** arresta il server già aperto prima di avviarne un secondo.
- **Timeline incompleta:** compila le date delle scene; quelle senza data sono conteggiate separatamente.
- **Controllo di continuità:** segnala riferimenti documentali mancanti, non tutte le contraddizioni narrative. Serve anche una rilettura del manoscritto.
- **Sessione giornaliera:** misura parole nette aggiunte, non il tempo di lavoro o tutte le riscritture.

L’applicazione attuale è uno studio personale con archivi locali. Collaborazione in tempo reale, account, sincronizzazione cloud, import DOCX/PDF e analisi AI restano fuori dalle funzionalità attive.
