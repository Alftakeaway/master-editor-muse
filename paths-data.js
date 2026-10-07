/* Original editorial pathways; sources inform principles, not a validated test. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.WriterPaths = api;
})(globalThis, function () {
  "use strict";
  const sources = {
    ahmed: {
      title: "Ahmed e Güss (2022) · An Analysis of Writer’s Block",
      url: "https://scholars.unf.edu/en/publications/an-analysis-of-writers-block-causes-and-solutions/",
      kind: "Ricerca",
      note: "Indagine online con 146 scrittori: quattro famiglie di cause riportate. Non dimostra che un singolo esercizio funzioni per tutti e non valida questi percorsi.",
    },
    rose: {
      title: "Mike Rose · Writer’s Block: The Cognitive Dimension",
      url: "https://www.bibliovault.org/BV.book.epl?ISBN=9780809386901",
      kind: "Ricerca sul processo",
      note: "Riferimento su regole rigide e strategie di composizione; non una valutazione del talento.",
    },
    hjortshoj: {
      title: "Keith Hjortshoj · From Student to Scholar",
      url: "https://www.routledge.com/From-Student-to-Scholar-A-Guide-to-Writing-Through-the-Dissertation-St/Hjortshoj/p/book/9780203704264",
      kind: "Processo di scrittura",
      note: "Il lavoro cambia secondo fase, pubblico e vincoli. Gli adattamenti qui sono editoriali.",
    },
    purdue: {
      title: "Purdue OWL · Symptoms and Cures for Writer’s Block",
      url: "https://owl.purdue.edu/owl/general_writing/the_writing_process/writers_block/",
      kind: "Didattica",
      note: "Strategie di avvio e composizione; esercizi adattati al lavoro sul progetto.",
    },
    structure: {
      title: "Reedsy · Story Structure",
      url: "https://blog.reedsy.com/guide/story-structure/",
      kind: "Guida editoriale",
      note: "Le strutture sono strumenti di lettura e progettazione, non formule obbligatorie.",
    },
    revision: {
      title: "Reedsy · How to Edit Your Own Book",
      url: "https://reedsy.com/blog/how-to-edit-a-book/",
      kind: "Guida editoriale",
      note: "Rilettura per livelli e aspetti del manoscritto; i protocolli sono originali.",
    },
    characters: {
      title: "Literature & Latte · Character Development Exercises",
      url: "https://www.literatureandlatte.com/blog/character-development-exercises",
      kind: "Guida editoriale",
      note: "Personaggi osservati attraverso decisioni, contraddizioni e azioni.",
    },
    drafts: {
      title: "Literature & Latte · Revising the First Draft",
      url: "https://www.literatureandlatte.com/blog/how-to-revise-the-first-draft-of-your-novel-in-scrivener",
      kind: "Guida editoriale",
      note: "Sinossi, note e struttura come strumenti di revisione.",
    },
    query: {
      title: "Reedsy · How to Write a Query Letter",
      url: "https://reedsy.com/blog/guide/how-to-write-a-query-letter/",
      kind: "Guida editoriale",
      note: "Indicazioni generali per una proposta. Le regole della destinazione vanno verificate direttamente.",
    },
    stress: {
      title: "NHS · Stress: support and coping",
      url: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/",
      kind: "Benessere",
      note: "Se lo stress interferisce con la vita quotidiana o è difficile affrontarlo, chiedere supporto. Il percorso non formula diagnosi.",
    },
  };
  const groups = [
    "Ripartire",
    "Ideare",
    "Strutturare",
    "Personaggi e mondo",
    "Revisionare",
    "Condividere",
    "Gestire il lavoro",
  ];
  const plan = (
    title,
    why,
    steps,
    check,
    fallback,
    tool,
    related = [],
    care = false,
  ) => ({ title, why, steps, check, fallback, tool, related, care });
  const choice = (label, result) => ({ label, plan: result });
  const branch = (label, question, choices) => ({ label, question, choices });
  const issues = [];
  const add = (id, group, title, summary, question, branches, refs) =>
    issues.push({
      id,
      group,
      title,
      summary,
      question,
      branches,
      sources: refs,
    });
  add(
    "blocco",
    "Ripartire",
    "Blocco dello scrittore",
    "Individua il punto del processo e scegli una prova sostenibile.",
    "In quale momento si interrompe il lavoro?",
    [
      branch(
        "Prima di cominciare",
        "Che cosa ti impedisce di mettere la prima frase?",
        [
          choice(
            "Non ho ancora un punto di ingresso",
            plan(
              "Una porta laterale",
              "L’apertura può essere trovata dopo aver scritto un frammento.",
              [
                "Scegli un gesto concreto del protagonista, non il primo capitolo.",
                "Scrivi cinque righe di azione e cinque di percezione, senza correggere.",
                "Segna una domanda che il frammento lascia aperta.",
              ],
              "Hai un frammento e una domanda a cui tornare.",
              "Se manca ancora una situazione, passa a Idee e spunti.",
              "studio",
              ["idee"],
            ),
          ),
          choice(
            "Scarto subito ogni frase",
            plan(
              "Una bozza con permesso di essere incompleta",
              "Stai chiedendo alla stesura il risultato della revisione.",
              [
                "Conserva una versione del testo e scrivi “bozza di esplorazione” nelle note.",
                "Racconta l’evento con parole comuni; usa [DA TROVARE] per i passaggi difficili.",
                "Non correggere: evidenzia soltanto il punto da rivedere domani.",
              ],
              "Esiste una sequenza comprensibile, anche se grezza.",
              "Se la valutazione continua a interromperti, usa Perfezionismo.",
              "studio",
              ["perfezionismo"],
            ),
          ),
        ],
      ),
      branch(
        "A metà della stesura",
        "Sai quale cambiamento deve produrre la prossima scena?",
        [
          choice(
            "No, vedo soltanto eventi possibili",
            plan(
              "Dalla possibilità alla conseguenza",
              "L’accumulo di opzioni non produce ancora una direzione.",
              [
                "Riassumi l’ultima scelta del protagonista.",
                "Elenca tre conseguenze plausibili di quella scelta.",
                "Scegli quella che cambia un rapporto o restringe una possibilità e crea un beat.",
              ],
              "La prossima scena nasce da una scelta precedente.",
              "Se nessuna conseguenza modifica la storia, verifica la Trama.",
              "architecture",
              ["trama"],
            ),
          ),
          choice(
            "Sì, ma non riesco a scriverla",
            plan(
              "Un ponte provvisorio",
              "La difficoltà può stare nella messa in scena, non nell’intreccio.",
              [
                "Scrivi scopo, ostacolo e risultato in tre righe.",
                "Stendi solo il punto di svolta in dialogo o azioni.",
                "Lascia descrizioni e raccordi in segnaposto.",
              ],
              "Il cambiamento è leggibile nella bozza.",
              "Se lo scopo resta vago, apri Scene senza funzione.",
              "studio",
              ["scene"],
            ),
          ),
        ],
      ),
      branch(
        "Durante la revisione",
        "Stai cercando di intervenire su più livelli insieme?",
        [
          choice(
            "Sì, cambio trama e frasi nello stesso passaggio",
            plan(
              "Un livello per volta",
              "Problemi diversi richiedono prove diverse.",
              [
                "Scrivi la domanda strutturale più importante.",
                "Leggi le sinossi senza correggere la prosa.",
                "Scegli una modifica strutturale e rinvia i refusi a una lista separata.",
              ],
              "Hai una priorità e un intervento delimitato.",
              "Se non riesci a stabilire priorità, usa Revisione ingestibile.",
              "editor",
              ["revisione"],
            ),
          ),
          choice(
            "No, ma torno sempre sulle stesse pagine",
            plan(
              "Un criterio di arresto",
              "La revisione non ha ancora una condizione di conclusione.",
              [
                "Definisci che cosa deve migliorare in questa scena.",
                "Conserva la versione attuale e cambia solo quel punto.",
                "Confronta le due versioni rispetto al criterio, non alla perfezione.",
              ],
              "Puoi motivare quale versione serve meglio la scena.",
              "Se il criterio si sposta continuamente, passa a Perfezionismo.",
              "studio",
              ["perfezionismo"],
            ),
          ),
        ],
      ),
      branch(
        "Anche lontano dal progetto",
        "La difficoltà riguarda soprattutto il testo o anche le attività quotidiane?",
        [
          choice(
            "Soprattutto questo progetto",
            plan(
              "Rientrare da una misura più piccola",
              "Un’interruzione non richiede subito il recupero di tutta la produttività.",
              [
                "Scegli una scena che ti interessa ancora.",
                "Annota un solo cambiamento che vorresti vedere.",
                "Fissa un incontro breve con il progetto e fermati dopo quel compito.",
              ],
              "Sai che cosa fare nel prossimo incontro.",
              "Se non trovi un motivo per tornare, esplora Motivazione.",
              "studio",
              ["motivazione"],
            ),
          ),
          choice(
            "Anche il riposo, la concentrazione o la vita quotidiana",
            plan(
              "Prima il sostegno, poi la pagina",
              "Un percorso editoriale non può stabilire la causa di un disagio generale.",
              [
                "Sospendi l’obiettivo di parole se aggiunge pressione.",
                "Parla con una persona fidata di ciò che stai vivendo.",
                "Se la difficoltà persiste, interferisce con la vita o è difficile affrontarla, valuta un professionista sanitario.",
              ],
              "Hai individuato una persona o un servizio a cui rivolgerti.",
              "Non usare lo sprint come sostituto del supporto; puoi lasciare il progetto in pausa.",
              "home",
              ["energia"],
              true,
            ),
          ),
        ],
      ),
    ],
    ["ahmed", "rose", "purdue", "stress"],
  );
  add(
    "perfezionismo",
    "Ripartire",
    "Perfezionismo e riscrittura infinita",
    "Separa l’esplorazione dalla valutazione.",
    "Quando entra in azione il giudizio?",
    [
      branch(
        "Prima che esista una bozza",
        "Quale standard stai cercando di raggiungere?",
        [
          choice(
            "Una voce già pronta per la pubblicazione",
            plan(
              "Un contratto di stesura",
              "La bozza ha bisogno di un compito diverso dal testo finale.",
              [
                "Definisci una scena e un solo evento da rendere comprensibile.",
                "Scrivi senza cercare la frase distintiva; lascia segnaposto.",
                "Sposta i dubbi stilistici nelle note, fuori dal testo.",
              ],
              "La scena arriva a una conseguenza.",
              "Se non c’è un evento da raccontare, torna alla Premessa.",
              "studio",
              ["premessa"],
            ),
          ),
          choice(
            "Una regola di scrittura che non riesco a rispettare",
            plan(
              "Mettere alla prova la regola",
              "Una regola utile in una fase può bloccare un’altra.",
              [
                "Trascrivi la regola: “devo sempre…” o “non posso mai…”.",
                "Crea un frammento che la segue e uno che la sospende.",
                "Valuta chiarezza ed effetto sul lettore, non obbedienza.",
              ],
              "Sai in quali condizioni la regola è utile.",
              "Se manca un criterio di confronto, definisci l’effetto della scena.",
              "editor",
              ["scene"],
            ),
          ),
        ],
      ),
      branch(
        "Dopo una versione funzionante",
        "Le nuove modifiche risolvono un problema identificabile?",
        [
          choice(
            "No, sostituisco una preferenza con un’altra",
            plan(
              "Una finestra di revisione",
              "Le variazioni equivalenti possono consumare tempo senza avanzamento.",
              [
                "Conserva la versione più leggibile.",
                "Scrivi due criteri: comprensibilità e funzione della scena.",
                "Fissa un passaggio dedicato e poi passa alla scena successiva.",
              ],
              "Puoi indicare un miglioramento o scegliere di non intervenire.",
              "Chiedi un riscontro mirato invece di rivedere ancora tutto.",
              "studio",
              ["feedback"],
            ),
          ),
          choice(
            "Sì, ma ogni soluzione apre un altro problema",
            plan(
              "Una mappa delle dipendenze",
              "Il problema potrebbe essere a monte della singola frase.",
              [
                "Elenca tre difetti e il loro possibile legame.",
                "Scegli quello che genera gli altri.",
                "Intervieni sulla causa e rileggi solo le scene coinvolte.",
              ],
              "Un intervento riduce almeno un problema dipendente.",
              "Se i difetti non sono collegati, gestiscili in passaggi distinti.",
              "editor",
              ["revisione"],
            ),
          ),
        ],
      ),
    ],
    ["rose", "purdue", "revision"],
  );
  add(
    "procrastinazione",
    "Ripartire",
    "Procrastinazione e distrazioni",
    "Riduci l’attrito di avvio e rendi visibile il compito.",
    "Che cosa fai al posto di scrivere?",
    [
      branch(
        "Apro continuamente altre attività",
        "Il passo successivo è già definito?",
        [
          choice(
            "No, apro il progetto e devo decidere tutto",
            plan(
              "Una consegna per il prossimo te",
              "Una sessione vaga richiede decisioni prima ancora di scrivere.",
              [
                "Scegli una scena e annota il suo prossimo evento.",
                "Prepara una frase di avvio o una domanda.",
                "Alla prossima sessione apri direttamente quella scena.",
              ],
              "L’avvio non richiede di ripianificare il romanzo.",
              "Se non sai scegliere la scena, usa Metà del romanzo.",
              "studio",
              ["mezzo"],
            ),
          ),
          choice(
            "Sì, ma notifiche e schede mi portano altrove",
            plan(
              "Un recinto di attenzione",
              "Interrompere gli stimoli può rendere più facile restare nel compito.",
              [
                "Chiudi le schede non necessarie e silenzia le notifiche che puoi controllare.",
                "Attiva Concentrazione e scegli uno sprint breve.",
                "Annota su una riga le distrazioni da gestire dopo.",
              ],
              "Completi un’unità delimitata senza cambiare attività.",
              "Se il contesto non è controllabile, cerca una sessione più piccola o un altro spazio.",
              "studio",
              ["tempo"],
            ),
          ),
        ],
      ),
      branch(
        "Faccio ricerca o sistemo note senza stendere",
        "Quello che stai cercando è necessario alla scena di oggi?",
        [
          choice(
            "No, potrebbe servire in futuro",
            plan(
              "Un parcheggio per la preparazione",
              "Preparare può diventare un modo di rinviare il testo.",
              [
                "Scrivi il dubbio in una lista “dopo”.",
                "Imposta un limite alla preparazione e passa a un frammento.",
                "Usa [VERIFICARE] quando incontri il dettaglio mancante.",
              ],
              "Compare testo nuovo prima di aggiungere altra ricerca.",
              "Se il dubbio cambia la logica dell’azione, apri Ricerca senza fine.",
              "studio",
              ["ricerca"],
            ),
          ),
          choice(
            "Sì, ma non trovo una risposta definitiva",
            plan(
              "Una domanda verificabile",
              "Una ricerca troppo ampia non ha un punto di arresto.",
              [
                "Riduci il dubbio a una domanda concreta.",
                "Identifica una fonte pertinente e il livello di precisione richiesto.",
                "Decidi se la scena può procedere con una scelta provvisoria.",
              ],
              "Sai che cosa manca e che cosa può aspettare.",
              "Se il dato è essenziale e resta incerto, sospendi solo quella scena.",
              "characters",
              ["ricerca"],
            ),
          ),
        ],
      ),
    ],
    ["purdue", "rose"],
  );
  add(
    "tempo",
    "Ripartire",
    "Poco tempo e scadenze",
    "Adatta il lavoro al margine reale, non a quello ideale.",
    "Il vincolo principale è una scadenza o una routine frammentata?",
    [
      branch("Ho una scadenza vicina", "La consegna minima è esplicita?", [
        choice(
          "No, il progetto continua ad allargarsi",
          plan(
            "Un perimetro di consegna",
            "Senza un confine ogni miglioramento sembra obbligatorio.",
            [
              "Definisci contenuto richiesto, destinatario e data reale.",
              "Separa indispensabile, utile e rinviabile.",
              "Scegli il prossimo intervento tra gli indispensabili.",
            ],
            "Hai una lista finita per la consegna.",
            "Se il perimetro dipende da altri, chiariscilo prima di aggiungere lavoro.",
            "editor",
            ["revisione"],
          ),
        ),
        choice(
          "Sì, ma il tempo stimato non basta",
          plan(
            "Rinegoziare il carico",
            "Un piano impossibile non migliora aumentando la pressione.",
            [
              "Stima con una sessione campione, non con la velocità ideale.",
              "Riduci il perimetro o valuta una nuova data con chi riceve il testo.",
              "Proteggi una sola priorità per sessione.",
            ],
            "Il carico e il tempo disponibile diventano compatibili.",
            "Se non lo sono, esplicita il rischio e scegli cosa consegnare.",
            "home",
            ["energia"],
          ),
        ),
      ]),
      branch(
        "Ho solo finestre brevi",
        "L’attività richiede sempre una lunga immersione?",
        [
          choice(
            "Sì, ogni volta devo ricostruire il contesto",
            plan(
              "Una scheda di rientro",
              "Il costo di ricordare può consumare tutta la sessione.",
              [
                "Alla fine di ogni sessione annota dove sei e il prossimo gesto.",
                "Tieni sinossi e beat collegati accanto al testo.",
                "Alla ripresa rileggi solo la scheda di rientro.",
              ],
              "Dedichi il margine disponibile alla scena e non al riassunto.",
              "Se la scena resta troppo ampia, dividila in unità di azione.",
              "studio",
              ["scene"],
            ),
          ),
          choice(
            "No, ma provo a fare troppe cose insieme",
            plan(
              "Una sessione, un prodotto",
              "Scrittura, ricerca e revisione competono per il medesimo tempo.",
              [
                "Scegli un prodotto piccolo: un beat, un paragrafo o una verifica.",
                "Assegna una finestra realistica e un criterio di fine.",
                "Registra il risultato e prepara il compito successivo.",
              ],
              "Il prodotto scelto esiste alla fine della sessione.",
              "Se salti spesso il compito, riducilo ancora o rivedi la priorità.",
              "home",
              ["progetti"],
            ),
          ),
        ],
      ),
    ],
    ["purdue", "hjortshoj"],
  );
  add(
    "energia",
    "Ripartire",
    "Stanchezza, stress e sovraccarico",
    "Distingui il carico del testo da una difficoltà più generale.",
    "La fatica cambia quando ti allontani dalla scrittura?",
    [
      branch(
        "Si attenua fuori dal progetto",
        "Che cosa rende la sessione pesante?",
        [
          choice(
            "Troppi problemi editoriali da tenere insieme",
            plan(
              "Ridurre il carico cognitivo",
              "Una sola domanda può rendere il lavoro affrontabile.",
              [
                "Scegli il problema prioritario, non la pagina perfetta.",
                "Lavora su un frammento e lascia fuori gli altri livelli.",
                "Chiudi annotando il prossimo passo.",
              ],
              "La sessione ha un inizio e una fine riconoscibili.",
              "Se la fatica non diminuisce, interrompi e rivaluta il carico.",
              "editor",
              ["revisione"],
            ),
          ),
          choice(
            "Obiettivi e confronti mi mettono pressione",
            plan(
              "Una misura di lavoro sostenibile",
              "Il conteggio di parole non descrive tutto il lavoro di revisione.",
              [
                "Sostituisci per questa sessione il numero di parole con un compito qualitativo.",
                "Scegli un limite di tempo che non sacrifica il riposo.",
                "Annota cosa hai chiarito, anche senza testo nuovo.",
              ],
              "Puoi riconoscere un risultato senza forzare la produzione.",
              "Se gli obiettivi continuano a pesare, metti il progetto in pausa.",
              "home",
              ["motivazione"],
            ),
          ),
        ],
      ),
      branch(
        "Riguarda anche la vita quotidiana",
        "Hai già un sostegno con cui parlarne?",
        [
          choice(
            "No, sto cercando di gestire tutto da solo",
            plan(
              "Aprire uno spazio di sostegno",
              "Non occorre ottenere un risultato di scrittura per meritare supporto.",
              [
                "Riduci o sospendi il carico editoriale.",
                "Individua una persona fidata con cui descrivere la difficoltà.",
                "Se il disagio persiste o interferisce con la vita, considera un professionista sanitario.",
              ],
              "Hai scelto un primo contatto, senza un obiettivo di parole.",
              "Il percorso non identifica diagnosi né sostituisce assistenza.",
              "home",
              [],
              true,
            ),
          ),
          choice(
            "Sì, ma sto ancora imponendomi di scrivere",
            plan(
              "Una pausa concordata con te stesso",
              "Proteggere il riposo può essere il passo pertinente.",
              [
                "Conserva un backup e una breve nota di rientro.",
                "Lascia il progetto in pausa senza una quota obbligatoria.",
                "Valuta la ripresa in base al tuo benessere e al supporto che ricevi.",
              ],
              "Il progetto resta recuperabile senza imporre una prestazione.",
              "Se la difficoltà aumenta o è difficile affrontarla, chiedi ulteriore aiuto.",
              "home",
              [],
              true,
            ),
          ),
        ],
      ),
    ],
    ["ahmed", "stress"],
  );
  add(
    "motivazione",
    "Ripartire",
    "Perdita di interesse e motivazione",
    "Scopri se serve una nuova direzione, un traguardo o una pausa.",
    "Che cosa si è spento?",
    [
      branch(
        "L’interesse per la storia",
        "C’è ancora una domanda che ti incuriosisce?",
        [
          choice(
            "Sì, ma non è al centro del testo",
            plan(
              "Rimettere al centro la domanda viva",
              "Il progetto può essersi allontanato dal suo nucleo.",
              [
                "Scrivi la domanda che oggi vorresti esplorare.",
                "Individua la scena in cui potrebbe diventare una scelta concreta.",
                "Stendi un frammento alternativo senza cambiare ancora l’intero progetto.",
              ],
              "Il frammento ti offre una direzione verificabile.",
              "Se non cambia nulla, valuta una pausa o un progetto diverso.",
              "muse",
              ["tema"],
            ),
          ),
          choice(
            "No, sto continuando soltanto per dovere",
            plan(
              "Verificare il motivo del progetto",
              "Il tempo investito non obbliga a continuare nella stessa forma.",
              [
                "Annota perché hai iniziato e perché dovresti continuare oggi.",
                "Distingui desiderio personale, impegno esterno e inerzia.",
                "Scegli consapevolmente: pausa, nuova forma o conclusione ridotta.",
              ],
              "Puoi motivare la decisione senza basarti solo sul tempo già speso.",
              "Se esiste una consegna esterna, chiarisci i vincoli prima di cambiare direzione.",
              "muse",
              ["progetti"],
            ),
          ),
        ],
      ),
      branch(
        "La sensazione di avanzare",
        "I progressi sono invisibili o il compito è troppo grande?",
        [
          choice(
            "Revisiono molto ma conto solo le parole",
            plan(
              "Rendere visibile il lavoro invisibile",
              "La revisione può ridurre il testo e migliorare il libro.",
              [
                "Scegli un criterio di revisione.",
                "Annota prima e dopo: che cosa è diventato più chiaro?",
                "Registra il risultato nella checklist.",
              ],
              "Hai una prova di miglioramento diversa dal volume prodotto.",
              "Se non osservi un cambiamento, restringi il criterio.",
              "editor",
              ["revisione"],
            ),
          ),
          choice(
            "Vedo solo il romanzo intero da finire",
            plan(
              "Un traguardo intermedio",
              "Un’opera lunga ha bisogno di unità finite.",
              [
                "Scegli una scena o un arco delimitato.",
                "Definisci che cosa significa completarlo in questa fase.",
                "Chiudi quell’unità prima di rinegoziare il traguardo.",
              ],
              "Hai una piccola unità finita secondo un criterio esplicito.",
              "Se l’unità è ancora troppo ampia, lavora su un solo cambiamento.",
              "board",
              ["scene"],
            ),
          ),
        ],
      ),
    ],
    ["ahmed", "purdue"],
  );
  add(
    "idee",
    "Ideare",
    "Poche idee o idee troppo vaghe",
    "Trasforma uno stimolo in una situazione scrivibile.",
    "Hai pochi spunti o troppi spunti senza direzione?",
    [
      branch(
        "Non trovo materiale che mi accenda",
        "Hai un dettaglio concreto che ti interessa?",
        [
          choice(
            "Sì: un’immagine, un luogo o una domanda",
            plan(
              "Dal dettaglio al problema",
              "Uno stimolo diventa narrativa quando qualcuno deve agire.",
              [
                "Scegli una persona che desidera qualcosa in quel luogo.",
                "Introduci un vincolo che rende il desiderio costoso.",
                "Scrivi tre possibilità di scelta e una conseguenza per ciascuna.",
              ],
              "Hai una situazione con desiderio, vincolo e decisione.",
              "Se resta soltanto atmosfera, aggiungi una scelta irreversibile.",
              "muse",
              ["premessa"],
            ),
          ),
          choice(
            "No, tutto mi sembra già visto",
            plan(
              "Cambiare una variabile",
              "La familiarità di un tema non impedisce una prospettiva specifica.",
              [
                "Elenca tre esperienze, domande o ambienti che conosci.",
                "Accostane due e cambia ruolo, epoca o punto di vista.",
                "Scegli l’accostamento che genera un conflitto, non quello più bizzarro.",
              ],
              "Puoi formulare una domanda che vorresti esplorare.",
              "Se cerchi solo originalità assoluta, passa a Voce e originalità.",
              "muse",
              ["voce"],
            ),
          ),
        ],
      ),
      branch(
        "Ho molti spunti ma nessuna storia",
        "Quale elemento manca agli spunti?",
        [
          choice(
            "Una persona che debba scegliere",
            plan(
              "Un agente per l’idea",
              "Un concetto da solo non produce azione.",
              [
                "Assegna lo spunto a una persona vulnerabile a quel problema.",
                "Definisci cosa vuole e cosa non è disposta a perdere.",
                "Scrivi un primo gesto che peggiora la situazione.",
              ],
              "L’idea provoca un’azione di qualcuno.",
              "Se il protagonista resta passivo, usa Personaggi poco vivi.",
              "characters",
              ["personaggi"],
            ),
          ),
          choice(
            "Un criterio per scegliere lo spunto",
            plan(
              "Una prova comparativa",
              "Puoi scegliere attraverso piccoli esperimenti, non una previsione perfetta.",
              [
                "Scegli due spunti e dedica a ciascuno un frammento.",
                "Confronta interesse, possibilità di conflitto e ricerca necessaria.",
                "Tieni uno spunto attivo e parcheggia l’altro.",
              ],
              "Sai perché vale la pena provare una direzione.",
              "Se continui a cambiare progetto, apri Troppi progetti.",
              "muse",
              ["progetti"],
            ),
          ),
        ],
      ),
    ],
    ["purdue", "structure"],
  );
  add(
    "premessa",
    "Ideare",
    "Premessa debole o dispersiva",
    "Chiarisci il motore narrativo e la promessa al lettore.",
    "La premessa è vaga oppure contiene troppe storie?",
    [
      branch(
        "Non riesco a dirla con chiarezza",
        "Manca il desiderio o il costo del fallimento?",
        [
          choice(
            "Non so che cosa il protagonista cerca",
            plan(
              "Un obiettivo osservabile",
              "Il desiderio deve poter essere messo alla prova sulla pagina.",
              [
                "Sostituisci “vuole essere felice” con un risultato concreto.",
                "Scrivi chi o che cosa ostacola quel risultato.",
                "Immagina un primo tentativo fallito.",
              ],
              "Sai riconoscere un tentativo e il suo esito.",
              "Se il risultato è troppo semplice, aggiungi un costo personale.",
              "muse",
              ["personaggi"],
            ),
          ),
          choice(
            "Non so perché il lettore dovrebbe interessarsi",
            plan(
              "Rendere concreto il prezzo",
              "La posta in gioco è specifica prima di essere enorme.",
              [
                "Scrivi che cosa perderà questa persona se non agisce.",
                "Collega la perdita a un rapporto, un valore o una responsabilità.",
                "Mostra un segno anticipato di quel prezzo nella prima sequenza.",
              ],
              "Il conflitto ha una conseguenza riconoscibile.",
              "Se il prezzo è solo dichiarato, cerca un evento che lo renda visibile.",
              "muse",
              ["trama"],
            ),
          ),
        ],
      ),
      branch(
        "La premessa contiene troppe linee",
        "Le linee dipendono dalla stessa scelta?",
        [
          choice(
            "No, ogni linea potrebbe essere un altro libro",
            plan(
              "Una gerarchia di storie",
              "L’ampiezza richiede un centro, non solo più materiale.",
              [
                "Individua la domanda narrativa dominante.",
                "Distingui le linee che la complicano da quelle indipendenti.",
                "Parcheggia una linea indipendente senza eliminarne gli appunti.",
              ],
              "Puoi spiegare quale linea governa l’opera.",
              "Se vuoi mantenere più centri, progetta esplicitamente un’opera corale.",
              "architecture",
              ["sottotrame"],
            ),
          ),
          choice(
            "Sì, ma non riesco a mostrarne il legame",
            plan(
              "Una frase causale",
              "Il legame diventa chiaro quando è un costo o una conseguenza.",
              [
                "Formula la scelta centrale.",
                "Per ogni linea scrivi “questa scelta provoca…”.",
                "Togli dal riassunto ciò che non modifica scelta o conseguenza.",
              ],
              "Il riassunto espone un motore e le sue complicazioni.",
              "Se il legame è soltanto tematico, torna a Sottotrame.",
              "muse",
              ["sottotrame"],
            ),
          ),
        ],
      ),
    ],
    ["structure"],
  );
  add(
    "tema",
    "Ideare",
    "Tema confuso o troppo predicato",
    "Porta una domanda di valore dentro le scelte.",
    "Il tema è assente oppure invade la storia?",
    [
      branch(
        "Non so di che cosa parla davvero",
        "Riconosci un conflitto di valori ricorrente?",
        [
          choice(
            "Sì, ma cambia forma da una scena all’altra",
            plan(
              "Una domanda, più prove",
              "Un tema può essere esplorato senza una risposta unica.",
              [
                "Nomina i due valori che entrano in conflitto.",
                "Trova tre scelte che li mettono alla prova in modi diversi.",
                "Scrivi una domanda tematica aperta che le accomuna.",
              ],
              "Puoi collegare le scelte senza riassumerle con uno slogan.",
              "Se il collegamento è forzato, lascia che emerga dalla revisione.",
              "muse",
              ["trama"],
            ),
          ),
          choice(
            "No, vedo soltanto una serie di eventi",
            plan(
              "Il valore sacrificato",
              "Una scelta rivela il significato attraverso ciò che costa.",
              [
                "Scegli un evento decisivo.",
                "Chiedi cosa il personaggio protegge e cosa sacrifica.",
                "Confronta quel sacrificio con un’altra scelta importante.",
              ],
              "Hai individuato una tensione di valore da esplorare.",
              "Se nessuno sacrifica qualcosa, verifica conflitto e posta in gioco.",
              "muse",
              ["premessa"],
            ),
          ),
        ],
      ),
      branch(
        "Il testo spiega troppo il messaggio",
        "Il messaggio è espresso in discorsi o nelle conseguenze?",
        [
          choice(
            "Soprattutto nei discorsi dei personaggi",
            plan(
              "Una scelta al posto del sermone",
              "La posizione può emergere senza essere proclamata.",
              [
                "Scegli un discorso esplicativo.",
                "Trova un’azione che metta il personaggio in contraddizione con quel discorso.",
                "Prova una versione con meno spiegazione e più conseguenza.",
              ],
              "Il lettore può intuire il valore in gioco dalla scena.",
              "Se il dialogo perde senso, conserva la parte necessaria al conflitto.",
              "studio",
              ["dialoghi"],
            ),
          ),
          choice(
            "Le conseguenze sembrano sempre premiare una sola posizione",
            plan(
              "Mettere il tema sotto pressione",
              "Una risposta troppo facile riduce la complessità.",
              [
                "Dai alla posizione opposta un argomento plausibile.",
                "Introduci un costo reale anche per la scelta preferita.",
                "Rileggi se il personaggio deve decidere, non soltanto dimostrare.",
              ],
              "La scelta resta necessaria anche senza un verdetto dell’autore.",
              "Se il costo è artificiale, rivedi il conflitto centrale.",
              "architecture",
              ["antagonista"],
            ),
          ),
        ],
      ),
    ],
    ["structure", "characters"],
  );
  add(
    "ricerca",
    "Ideare",
    "Ricerca senza fine o documentazione fragile",
    "Distingui i fatti indispensabili da quelli decorativi.",
    "Il problema è trovare dati o smettere di cercarli?",
    [
      branch(
        "Non trovo un’informazione affidabile",
        "Il fatto cambia l’azione o solo un dettaglio?",
        [
          choice(
            "Cambia la logica della scena",
            plan(
              "Una scheda di verifica",
              "Un fatto essenziale richiede una domanda circoscritta.",
              [
                "Scrivi il fatto da verificare e perché cambia l’azione.",
                "Annota fonte, data e limiti di ciò che puoi confermare.",
                "Rinvia quella scena o costruisci una variante che non dipenda dal dato incerto.",
              ],
              "La scena non presenta una supposizione come certezza.",
              "Se restano fonti in conflitto, conserva l’incertezza e chiedi un riscontro competente.",
              "characters",
              ["continuita"],
            ),
          ),
          choice(
            "È un dettaglio descrittivo",
            plan(
              "Un segnaposto documentato",
              "Il dettaglio può aspettare senza bloccare l’intera stesura.",
              [
                "Inserisci [VERIFICARE: domanda precisa].",
                "Continua la scena evitando di fondare il conflitto su quel dettaglio.",
                "Raccogli i segnaposto per una sessione di controllo separata.",
              ],
              "Il testo avanza e la verifica resta rintracciabile.",
              "Se il dettaglio diventa centrale, trasformalo in scheda di verifica.",
              "studio",
              ["organizzazione"],
            ),
          ),
        ],
      ),
      branch(
        "Continuo ad accumulare materiale",
        "Hai già una soglia di sufficienza?",
        [
          choice(
            "No, temo sempre che manchi qualcosa",
            plan(
              "Una ricerca con criterio di fine",
              "La completezza assoluta non è un requisito per una prima stesura.",
              [
                "Definisci tre domande necessarie al prossimo capitolo.",
                "Cerca risposte soltanto a quelle domande.",
                "Chiudi la ricerca quando sai scrivere l’azione senza inventare fatti essenziali.",
              ],
              "Puoi nominare ciò che basta e ciò che resta incerto.",
              "Se la ricerca evita la bozza, apri Procrastinazione.",
              "characters",
              ["procrastinazione"],
            ),
          ),
          choice(
            "Sì, ma le note non diventano testo",
            plan(
              "Dalla fonte alla funzione",
              "Informazione pertinente non significa informazione da includere.",
              [
                "Per ogni nota indica l’azione o la scelta che sostiene.",
                "Scarta dal capitolo le note senza funzione narrativa.",
                "Usa un solo dettaglio verificato per rendere concreta una scena.",
              ],
              "Il dettaglio serve una funzione, non mostra soltanto la ricerca.",
              "Se il capitolo resta una lezione, usa Esposizione e descrizioni.",
              "studio",
              ["esposizione"],
            ),
          ),
        ],
      ),
    ],
    ["purdue", "drafts"],
  );
  add(
    "progetti",
    "Ideare",
    "Troppi progetti e cambi di direzione",
    "Scegli una priorità senza perdere le altre idee.",
    "Passi a un’altra idea per interesse o per evitare una difficoltà?",
    [
      branch(
        "L’idea nuova sembra sempre migliore",
        "Hai confrontato frammenti reali o solo promesse?",
        [
          choice(
            "Solo promesse",
            plan(
              "La prova dello stesso formato",
              "Una bozza faticosa e un’idea ideale non sono confronti equivalenti.",
              [
                "Scrivi per due progetti lo stesso tipo di scena breve.",
                "Valuta desiderio di continuare, conflitto e fattibilità.",
                "Scegli un progetto per un traguardo delimitato e parcheggia gli altri.",
              ],
              "La priorità nasce da una prova comparabile.",
              "Se tutte le idee sembrano uguali, scegli il progetto più sostenibile oggi.",
              "studio",
              ["motivazione"],
            ),
          ),
          choice(
            "Ho frammenti, ma non un criterio di scelta",
            plan(
              "Una scheda di priorità",
              "La scelta dipende dal tuo obiettivo, non da una graduatoria assoluta.",
              [
                "Definisci il risultato che cerchi: apprendere, finire o proporre.",
                "Confronta tempo, ricerca e interesse dei progetti rispetto a quel risultato.",
                "Scrivi una decisione con una data di rivalutazione.",
              ],
              "Sai perché un progetto è attivo e gli altri sono in attesa.",
              "Se esistono obblighi esterni, inseriscili nel criterio.",
              "home",
              ["tempo"],
            ),
          ),
        ],
      ),
      branch(
        "Cambio quando una scena diventa difficile",
        "Sai nominare la difficoltà del progetto attivo?",
        [
          choice(
            "Sì, è un ostacolo specifico",
            plan(
              "Un esperimento prima di cambiare libro",
              "Una prova piccola distingue il problema risolvibile dalla direzione sbagliata.",
              [
                "Descrivi l’ostacolo in una frase.",
                "Crea una variante minima della scena.",
                "Valuta la variante prima di aprire un nuovo progetto.",
              ],
              "Puoi decidere sulla base di un tentativo, non solo del fastidio.",
              "Se la variante non incide, cerca il problema a monte nell’Architettura.",
              "studio",
              ["scene"],
            ),
          ),
          choice(
            "No, sento soltanto che non funziona",
            plan(
              "Localizzare l’attrito",
              "Una sensazione generale può essere scomposta in aspetti osservabili.",
              [
                "Scegli una pagina e annota dove smetti di interessarti.",
                "Distingui problema di scelta, chiarezza o ritmo.",
                "Usa il percorso corrispondente per una prova delimitata.",
              ],
              "La difficoltà ha un nome operativo.",
              "Se non riesci a localizzarla, chiedi un riscontro mirato.",
              "editor",
              ["feedback"],
            ),
          ),
        ],
      ),
    ],
    ["purdue", "hjortshoj"],
  );
  add(
    "trama",
    "Strutturare",
    "Trama incoerente o priva di causalità",
    "Collega eventi, decisioni e conseguenze.",
    "Gli eventi sembrano casuali oppure troppo prevedibili?",
    [
      branch(
        "Potrei cambiarne l’ordine senza conseguenze",
        "Le scene nascono dalle decisioni precedenti?",
        [
          choice(
            "No, sono episodi indipendenti",
            plan(
              "Una catena di scelte",
              "La sequenza richiede dipendenze oltre alla cronologia.",
              [
                "Riassumi cinque scene in una frase ciascuna.",
                "Tra le frasi scrivi una decisione che provoca la scena successiva.",
                "Riscrivi il raccordo che oggi dipende solo da “e poi”.",
              ],
              "Spostare una scena modifica ciò che viene dopo.",
              "Se gli episodi restano autonomi, valuta se stai scrivendo una forma episodica consapevole.",
              "board",
              ["scene"],
            ),
          ),
          choice(
            "Sì, ma le conseguenze spariscono",
            plan(
              "Far durare il costo",
              "Una scelta senza tracce non accumula pressione.",
              [
                "Scegli una conseguenza dimenticata.",
                "Individua chi la subisce e per quanto tempo.",
                "Portala nella scena successiva come limite o responsabilità.",
              ],
              "Il costo cambia un’opzione disponibile al protagonista.",
              "Se nessuna opzione cambia, rendi più concreta la posta in gioco.",
              "architecture",
              ["premessa"],
            ),
          ),
        ],
      ),
      branch(
        "Tutto segue una formula senza sorpresa",
        "La sorpresa prevista è coerente con ciò che hai preparato?",
        [
          choice(
            "No, dipende da una coincidenza",
            plan(
              "Una sorpresa guadagnata",
              "Il ribaltamento deve nascere da elementi già disponibili.",
              [
                "Elenca gli indizi o le scelte che renderebbero plausibile il ribaltamento.",
                "Inserisci una preparazione discreta prima della svolta.",
                "Verifica che il lettore possa ricostruire la causa dopo la rivelazione.",
              ],
              "La sorpresa è inattesa ma retrospettivamente plausibile.",
              "Se serve inventare una regola nuova all’ultimo momento, usa Regole del mondo.",
              "architecture",
              ["mondo"],
            ),
          ),
          choice(
            "Sì, ma il protagonista non decide mai",
            plan(
              "Restituire l’iniziativa",
              "Una struttura non sostituisce la volontà dei personaggi.",
              [
                "Individua una svolta subita.",
                "Prova a farla derivare da una decisione rischiosa del protagonista.",
                "Mantieni il costo anche se il tentativo fallisce.",
              ],
              "Il protagonista cambia la traiettoria, non solo la percorre.",
              "Se non sai che cosa sceglierebbe, approfondisci il suo desiderio.",
              "characters",
              ["personaggi"],
            ),
          ),
        ],
      ),
    ],
    ["structure", "revision"],
  );
  add(
    "mezzo",
    "Strutturare",
    "Il centro del romanzo si affloscia",
    "Distingui ripetizione, mancata escalation e promessa smarrita.",
    "Nel centro si ripetono gli ostacoli o si perde la direzione?",
    [
      branch(
        "Gli ostacoli sembrano equivalenti",
        "Ogni tentativo cambia il costo della scelta?",
        [
          choice(
            "No, il personaggio torna sempre al punto di partenza",
            plan(
              "Un tentativo che lascia tracce",
              "La pressione cresce se qualcosa non torna come prima.",
              [
                "Scegli due tentativi consecutivi.",
                "Fai perdere o acquisire al protagonista una possibilità dopo il primo.",
                "Costruisci il secondo tentativo a partire da quel cambiamento.",
              ],
              "Il secondo tentativo non potrebbe avvenire nello stesso modo prima del primo.",
              "Se il costo resta astratto, rendilo visibile in un rapporto.",
              "architecture",
              ["trama"],
            ),
          ),
          choice(
            "Sì, ma non cambia la strategia",
            plan(
              "Un adattamento necessario",
              "Una conseguenza importante dovrebbe modificare il modo di agire.",
              [
                "Descrivi la strategia iniziale del protagonista.",
                "Trova l’evento che la rende insufficiente.",
                "Scrivi la nuova strategia e il rischio che introduce.",
              ],
              "Il centro contiene un cambio di approccio.",
              "Se il personaggio ignora la conseguenza senza motivo, verifica motivazione e arco.",
              "characters",
              ["personaggi"],
            ),
          ),
        ],
      ),
      branch(
        "Non ricordo più la promessa dell’inizio",
        "Il centro rimanda la risposta o cambia domanda?",
        [
          choice(
            "Rimanda senza offrire nuove informazioni",
            plan(
              "Un avanzamento della domanda",
              "Un’attesa narrativa ha bisogno di trasformazioni.",
              [
                "Trascrivi la domanda posta all’inizio.",
                "Indica cosa il lettore sa in più a metà.",
                "Inserisci una scoperta che restringe o complica le risposte possibili.",
              ],
              "La domanda è più precisa o più costosa da risolvere.",
              "Se la scoperta non cambia nulla, prova una conseguenza invece di un’informazione.",
              "architecture",
              ["premessa"],
            ),
          ),
          choice(
            "Cambia domanda senza preparazione",
            plan(
              "Un ponte fra promesse",
              "Una nuova direzione richiede un legame con ciò che il lettore seguiva.",
              [
                "Nomina domanda iniziale e domanda nuova.",
                "Trova la scelta o scoperta che collega le due.",
                "Prepara quel collegamento in una scena precedente.",
              ],
              "Il lettore può spiegare perché la storia ha cambiato direzione.",
              "Se le domande non sono collegate, riduci una linea o separa i progetti.",
              "board",
              ["sottotrame"],
            ),
          ),
        ],
      ),
    ],
    ["structure", "drafts"],
  );
  add(
    "finale",
    "Strutturare",
    "Finale debole, forzato o incompleto",
    "Controlla promessa, scelta decisiva e conseguenze.",
    "Il finale non convince oppure non riesci a sceglierlo?",
    [
      branch(
        "Ho un finale, ma non sembra guadagnato",
        "La debolezza è nella soluzione o nella sua preparazione?",
        [
          choice(
            "La soluzione arriva dall’esterno",
            plan(
              "La scelta che risolve il conflitto",
              "Il climax deve coinvolgere ciò che il personaggio ha imparato o rifiutato.",
              [
                "Definisci la scelta decisiva e il suo prezzo.",
                "Riduci gli aiuti esterni che annullano quella scelta.",
                "Mostra una conseguenza che dipende dalla decisione del protagonista.",
              ],
              "La conclusione non può verificarsi senza la sua scelta.",
              "Se la scelta non è credibile, prepara l’arco nelle scene precedenti.",
              "architecture",
              ["personaggi"],
            ),
          ),
          choice(
            "La soluzione è plausibile ma non preparata",
            plan(
              "Preparare senza anticipare",
              "Il finale deve usare risorse e regole già presenti.",
              [
                "Elenca gli elementi indispensabili alla conclusione.",
                "Trova dove il lettore li incontra prima.",
                "Inserisci preparazioni con una funzione autonoma nella scena.",
              ],
              "Il finale può essere ricostruito senza informazioni introdotte solo nel climax.",
              "Se stai aggiungendo molte preparazioni, semplifica la soluzione.",
              "board",
              ["continuita"],
            ),
          ),
        ],
      ),
      branch(
        "Ho più conclusioni possibili",
        "Che cosa deve trovare risposta?",
        [
          choice(
            "La domanda narrativa principale",
            plan(
              "Una matrice dei finali",
              "I finali possono essere confrontati rispetto alla promessa dell’opera.",
              [
                "Scrivi la domanda dominante.",
                "Per ogni finale annota risposta, prezzo e trasformazione.",
                "Scegli quello che risponde senza cancellare le conseguenze.",
              ],
              "Puoi motivare il finale attraverso la promessa iniziale.",
              "Se nessuno risponde alla domanda, rivedi la premessa.",
              "muse",
              ["premessa"],
            ),
          ),
          choice(
            "La vita di ogni personaggio e ogni dettaglio",
            plan(
              "Chiudere il necessario",
              "Conclusione non significa esaurire tutte le possibilità del mondo.",
              [
                "Separa conflitto principale, archi essenziali e dettagli aperti.",
                "Chiudi gli elementi che la storia ha promesso di risolvere.",
                "Lascia aperto ciò che produce un senso intenzionale, non una dimenticanza.",
              ],
              "Sai distinguere apertura deliberata da filo perso.",
              "Se non riesci a fare la distinzione, controlla le sottotrame.",
              "architecture",
              ["sottotrame"],
            ),
          ),
        ],
      ),
    ],
    ["structure", "revision"],
  );
  add(
    "sottotrame",
    "Strutturare",
    "Sottotrame che disperdono il libro",
    "Dai a ogni linea una funzione e un punto di incrocio.",
    "Le linee secondarie sono troppe oppure scompaiono?",
    [
      branch(
        "Sono troppe",
        "Cambiano la scelta centrale o soltanto l’atmosfera?",
        [
          choice(
            "Quasi tutte aggiungono solo atmosfera",
            plan(
              "Una gerarchia di linee",
              "Una linea secondaria può servire, ma deve giustificare lo spazio.",
              [
                "Assegna a ogni linea una funzione: ostacolare, rivelare, contrastare o trasformare.",
                "Segna quelle che non modificano nessuna scelta.",
                "Prova a condensarne una in un dettaglio o una sola scena.",
              ],
              "L’opera mantiene profondità con meno dispersione.",
              "Se la perdita è importante, rendi la linea causalmente necessaria.",
              "board",
              ["tagli"],
            ),
          ),
          choice(
            "Cambiano la scelta, ma tutte allo stesso modo",
            plan(
              "Differenziare la pressione",
              "Due linee identiche possono duplicare lo stesso lavoro.",
              [
                "Identifica il tipo di costo introdotto da ciascuna.",
                "Scegli una differenza di valore, rapporto o informazione.",
                "Fai incontrare due linee nel momento in cui complicano la decisione.",
              ],
              "Le linee pongono pressioni diverse.",
              "Se restano equivalenti, valuta di unirle.",
              "architecture",
              ["trama"],
            ),
          ),
        ],
      ),
      branch(
        "Una linea sparisce per molti capitoli",
        "Il suo esito è ancora necessario?",
        [
          choice(
            "Sì, serve per il finale",
            plan(
              "Mantenere vivo il filo",
              "Una linea necessaria ha bisogno di cambiamenti rintracciabili.",
              [
                "Segna apertura, svolta e chiusura della linea.",
                "Trova la lacuna in cui nulla ricorda il suo avanzamento.",
                "Inserisci una conseguenza breve, non un riepilogo generico.",
              ],
              "Il lettore può seguire l’evoluzione della linea.",
              "Se i richiami rallentano il libro, integra la linea nelle scene principali.",
              "board",
              ["ritmo"],
            ),
          ),
          choice(
            "No, è rimasta dalla prima idea",
            plan(
              "Un taglio reversibile",
              "Un’origine interessante non garantisce una funzione attuale.",
              [
                "Esporta un backup e conserva versioni delle scene.",
                "Prova una sequenza senza la linea residua.",
                "Controlla riferimenti, conseguenze e finale dopo il taglio.",
              ],
              "La storia regge senza vuoti causali.",
              "Se emerge un vuoto, recupera solo la funzione necessaria.",
              "board",
              ["continuita"],
            ),
          ),
        ],
      ),
    ],
    ["structure", "drafts"],
  );
  add(
    "scene",
    "Strutturare",
    "Scene piatte o senza funzione",
    "Progetta il cambiamento prima della decorazione.",
    "La scena non produce un cambiamento o il cambiamento non si sente?",
    [
      branch(
        "Potrei eliminarla senza effetti",
        "Cosa tenta di ottenere il personaggio?",
        [
          choice(
            "Non lo so",
            plan(
              "Un obiettivo locale",
              "La scena richiede una pressione leggibile nel momento presente.",
              [
                "Definisci un risultato che il personaggio cerca ora.",
                "Dai a un’altra forza un interesse incompatibile.",
                "Chiudi con una scelta, una perdita o una scoperta che cambia il seguito.",
              ],
              "La scena ha un prima e un dopo differenti.",
              "Se il risultato è solo informare il lettore, usa Esposizione.",
              "studio",
              ["esposizione"],
            ),
          ),
          choice(
            "Lo so, ma nulla lo ostacola",
            plan(
              "Una resistenza pertinente",
              "L’ostacolo deve mettere alla prova la scelta, non allungare la pagina.",
              [
                "Indica cosa rende il tentativo difficile per questa persona.",
                "Scegli una resistenza esterna o interna concreta.",
                "Fai pagare un costo anche al tentativo riuscito.",
              ],
              "Il risultato non è automatico.",
              "Se l’ostacolo è arbitrario, collegalo alle conseguenze precedenti.",
              "studio",
              ["trama"],
            ),
          ),
        ],
      ),
      branch(
        "La scena cambia la storia, ma resta piatta",
        "Il cambiamento è spiegato oppure vissuto?",
        [
          choice(
            "Spiegato in un riassunto astratto",
            plan(
              "Dare corpo al momento",
              "Il passaggio cruciale merita azioni e percezioni specifiche.",
              [
                "Scegli il momento della decisione.",
                "Scrivi gesto, risposta dell’ambiente e reazione del personaggio.",
                "Conserva il riassunto solo per i passaggi che non richiedono presenza.",
              ],
              "Il lettore può indicare dove avviene la svolta.",
              "Se aggiungi dettagli senza tensione, torna all’obiettivo locale.",
              "studio",
              ["esposizione"],
            ),
          ),
          choice(
            "Vissuto, ma senza reazione o conseguenze",
            plan(
              "Far sentire lo scarto",
              "Una svolta non termina nell’evento che la produce.",
              [
                "Confronta aspettativa del personaggio ed esito reale.",
                "Mostra la reazione che rivela quel divario.",
                "Chiudi con una nuova intenzione o impossibilità.",
              ],
              "Il seguito nasce dal cambiamento della scena.",
              "Se la reazione ripete solo un’emozione, falla diventare decisione.",
              "studio",
              ["personaggi"],
            ),
          ),
        ],
      ),
    ],
    ["structure", "revision"],
  );
  add(
    "personaggi",
    "Personaggi e mondo",
    "Personaggi poco vivi o passivi",
    "Metti desiderio, contraddizione e iniziativa sulla pagina.",
    "Il personaggio sembra generico oppure non guida la storia?",
    [
      branch(
        "Ha una scheda ricca ma sembra generico",
        "Le caratteristiche influenzano le sue decisioni?",
        [
          choice(
            "No, restano informazioni biografiche",
            plan(
              "Dalla scheda alla scelta",
              "La profondità emerge quando un tratto cambia l’azione.",
              [
                "Scegli desiderio e paura, non l’elenco completo dei tratti.",
                "Mettili in conflitto in una situazione concreta.",
                "Scrivi una scelta che non sarebbe la stessa per un altro personaggio.",
              ],
              "Il personaggio è riconoscibile attraverso ciò che fa.",
              "Se potrebbe scegliere chiunque allo stesso modo, rendi specifico il costo.",
              "characters",
              ["scene"],
            ),
          ),
          choice(
            "Sì, ma il comportamento è sempre uniforme",
            plan(
              "Una contraddizione credibile",
              "Una persona può proteggere valori incompatibili senza essere incoerente.",
              [
                "Individua un valore dichiarato e un bisogno che lo contraddice.",
                "Scrivi quando prevale uno e quando prevale l’altro.",
                "Mostra un gesto che rivela la tensione senza spiegarla.",
              ],
              "La contraddizione ha condizioni riconoscibili.",
              "Se il comportamento cambia senza condizioni, usa Continuità.",
              "characters",
              ["continuita"],
            ),
          ),
        ],
      ),
      branch(
        "La trama lo trascina",
        "Il desiderio è debole o i tentativi sono assenti?",
        [
          choice(
            "Non vuole nulla di abbastanza preciso",
            plan(
              "Un desiderio messo alla prova",
              "Il desiderio concreto offre al lettore una direzione da seguire.",
              [
                "Definisci cosa vuole ottenere o evitare in questa fase.",
                "Collega il risultato a un rapporto o un valore.",
                "Crea un primo tentativo con un rischio.",
              ],
              "Il lettore può descrivere il suo intento.",
              "Se il desiderio è imposto dall’esterno, cerca la ragione personale per accettarlo.",
              "characters",
              ["premessa"],
            ),
          ),
          choice(
            "Vuole qualcosa, ma reagisce soltanto",
            plan(
              "Una scelta che devia la storia",
              "L’iniziativa non richiede successo, richiede conseguenze.",
              [
                "Scegli una svolta oggi provocata da altri.",
                "Prova a farla derivare da una sua decisione.",
                "Conserva la possibilità che quella decisione peggiori tutto.",
              ],
              "La sequenza dipende da un tentativo del personaggio.",
              "Se il tentativo contraddice la sua natura, prepara il cambiamento.",
              "architecture",
              ["trama"],
            ),
          ),
        ],
      ),
    ],
    ["characters", "revision"],
  );
  add(
    "antagonista",
    "Personaggi e mondo",
    "Antagonista debole o conflitto artificiale",
    "Costruisci una resistenza con logica propria.",
    "Il problema è la motivazione dell’opposizione o la sua efficacia?",
    [
      branch(
        "L’opposizione sembra esistere solo per ostacolare",
        "È una persona oppure una forza non personale?",
        [
          choice(
            "Una persona",
            plan(
              "Un obiettivo incompatibile",
              "Un antagonista può avere ragioni comprensibili senza avere ragione.",
              [
                "Definisci cosa cerca l’altra persona.",
                "Trova perché il successo del protagonista le impedisce di ottenerlo.",
                "Scrivi una sua scelta coerente quando il protagonista non è presente.",
              ],
              "L’opposizione ha una traiettoria autonoma.",
              "Se le due traiettorie non si scontrano, rivedi il conflitto.",
              "characters",
              ["premessa"],
            ),
          ),
          choice(
            "Un sistema, ambiente o limite interno",
            plan(
              "Una resistenza con regole",
              "Una forza non personale deve avere effetti prevedibili.",
              [
                "Definisci come funziona la resistenza.",
                "Mostra un limite concreto prima della crisi.",
                "Fai derivare l’ostacolo da quel funzionamento, non da una convenienza della trama.",
              ],
              "Il lettore comprende cosa rende difficile l’azione.",
              "Se le regole cambiano per facilitare il finale, usa Regole del mondo.",
              "characters",
              ["mondo"],
            ),
          ),
        ],
      ),
      branch(
        "L’opposizione non mette davvero alla prova",
        "Il protagonista può evitare il conflitto senza perdere nulla?",
        [
          choice(
            "Sì",
            plan(
              "Rendere costoso il ritiro",
              "Una pressione narrativa ha bisogno di una ragione per restare.",
              [
                "Scrivi cosa accade se il protagonista non agisce.",
                "Collega il mancato intervento a ciò che vuole proteggere.",
                "Mostra quel prezzo prima di aumentare la minaccia.",
              ],
              "Ritirarsi è una scelta con conseguenze.",
              "Se il prezzo non gli importa, approfondisci il desiderio.",
              "muse",
              ["personaggi"],
            ),
          ),
          choice(
            "No, ma vince sempre nello stesso modo",
            plan(
              "Una strategia che trova il suo limite",
              "La resistenza dovrebbe esporre un punto cieco.",
              [
                "Nomina la strategia abituale del protagonista.",
                "Dai all’opposizione un modo plausibile per neutralizzarla.",
                "Richiedi una scelta diversa con un costo personale.",
              ],
              "Il conflitto produce adattamento, non solo intensità.",
              "Se la nuova scelta è casuale, prepara un apprendimento o una rinuncia.",
              "architecture",
              ["mezzo"],
            ),
          ),
        ],
      ),
    ],
    ["structure", "characters"],
  );
  add(
    "dialoghi",
    "Personaggi e mondo",
    "Dialoghi artificiali o voci indistinte",
    "Lavora su intento, sottotesto e risposta.",
    "Il dialogo informa troppo oppure suona uguale per tutti?",
    [
      branch(
        "Serve soprattutto a spiegare",
        "Gli interlocutori hanno obiettivi differenti?",
        [
          choice(
            "No, si scambiano informazioni per il lettore",
            plan(
              "Uno scambio con interessi",
              "L’informazione acquista tensione se qualcuno la vuole o la trattiene.",
              [
                "Assegna a ciascun interlocutore un risultato desiderato.",
                "Scegli l’informazione che uno non vuole dare subito.",
                "Riscrivi lo scambio come tentativo e resistenza.",
              ],
              "Ogni battuta cambia le possibilità dello scambio.",
              "Se il dato può stare fuori dal dialogo, usa una sintesi narrativa.",
              "studio",
              ["esposizione"],
            ),
          ),
          choice(
            "Sì, ma dicono tutto ciò che pensano",
            plan(
              "Una distanza fra parole e intento",
              "Il sottotesto nasce da ciò che conviene non dichiarare.",
              [
                "Annota l’intento privato di ciascuno.",
                "Scrivi una battuta che tenta di ottenerlo indirettamente.",
                "Fai rispondere l’altro all’intento percepito, non solo alle parole.",
              ],
              "Il lettore può intuire qualcosa oltre la dichiarazione.",
              "Se lo scambio diventa oscuro, aggiungi un gesto o una posta concreta.",
              "studio",
              ["scene"],
            ),
          ),
        ],
      ),
      branch(
        "Tutti hanno la stessa voce",
        "La differenza manca nelle parole o nel modo di agire?",
        [
          choice(
            "Nelle parole e nel ritmo",
            plan(
              "Tre differenze linguistiche",
              "La voce non richiede un tic caricaturale.",
              [
                "Scegli per ogni personaggio grado di formalità, lunghezza delle frasi e tipo di immagini.",
                "Riscrivi lo stesso piccolo conflitto con due voci.",
                "Rileggi senza etichette e verifica se distingui chi parla.",
              ],
              "Le voci differiscono senza dipendere solo da un intercalare.",
              "Se sembrano maschere, collega il registro al rapporto e alla situazione.",
              "studio",
              ["voce"],
            ),
          ),
          choice(
            "Nel modo di reagire",
            plan(
              "Tattiche differenti",
              "Due voci possono usare parole simili e strategie diverse.",
              [
                "Definisci chi persuade, chi evita, chi provoca e perché.",
                "Cambia una tattica quando cresce la pressione.",
                "Segna il punto in cui il rapporto modifica lo scambio.",
              ],
              "Le risposte appartengono a intenzioni differenti.",
              "Se le intenzioni restano equivalenti, approfondisci i personaggi.",
              "characters",
              ["personaggi"],
            ),
          ),
        ],
      ),
    ],
    ["revision", "characters"],
  );
  add(
    "pov",
    "Personaggi e mondo",
    "POV confuso e distanza narrativa",
    "Stabilisci chi percepisce e quanto sa il narratore.",
    "Il problema è scegliere il POV oppure mantenerlo?",
    [
      branch(
        "Non so a chi affidare la scena",
        "Cerchi accesso all’emozione o a informazioni più ampie?",
        [
          choice(
            "Accesso all’emozione di una persona",
            plan(
              "Il test della percezione",
              "La focalizzazione può essere scelta per l’esperienza che rende possibile.",
              [
                "Scrivi il momento decisivo da due personaggi candidati.",
                "Confronta cosa ciascuno percepisce, ignora e rischia.",
                "Scegli il punto che rende più significativa la scelta.",
              ],
              "Il POV aggiunge un’esperienza, non solo una posizione nella stanza.",
              "Se scegli soltanto chi sa di più, verifica la tensione informativa.",
              "studio",
              ["scene"],
            ),
          ),
          choice(
            "Una visione più ampia degli eventi",
            plan(
              "Un patto di narrazione",
              "Un narratore ampio richiede coerenza di accesso e tono.",
              [
                "Definisci che cosa il narratore può sapere e commentare.",
                "Scrivi una breve regola di distanza per questa opera.",
                "Controlla due scene rispetto a quel patto.",
              ],
              "L’ampiezza appare intenzionale e riconoscibile.",
              "Se il cambio è soltanto una scorciatoia per spiegare, valuta una scena separata.",
              "characters",
              ["esposizione"],
            ),
          ),
        ],
      ),
      branch(
        "Cambio testa senza volerlo",
        "L’informazione estranea è necessaria in quel momento?",
        [
          choice(
            "No",
            plan(
              "Una verifica dell’accesso",
              "La persona focalizzata non può osservare direttamente ogni pensiero.",
              [
                "Segna percezioni, interpretazioni e informazioni non accessibili.",
                "Trasforma il pensiero altrui in un indizio osservabile quando serve.",
                "Togli ciò che non cambia la scena.",
              ],
              "Ogni informazione ha un accesso riconoscibile.",
              "Se restano buchi di chiarezza, aggiungi una reazione visibile.",
              "editor",
              ["continuita"],
            ),
          ),
          choice(
            "Sì",
            plan(
              "Un cambio segnato e motivato",
              "Un nuovo accesso può richiedere una nuova unità narrativa.",
              [
                "Definisci perché il lettore deve sapere proprio ora.",
                "Valuta una nuova scena con un cambio di POV esplicito.",
                "Controlla che il cambio non cancelli una suspense utile.",
              ],
              "Il passaggio è leggibile e produce un vantaggio narrativo.",
              "Se non aggiunge un vantaggio, lascia l’informazione fuori.",
              "studio",
              ["ritmo"],
            ),
          ),
        ],
      ),
    ],
    ["revision"],
  );
  add(
    "mondo",
    "Personaggi e mondo",
    "Worldbuilding e regole instabili",
    "Definisci vincoli utili alla storia, non un’enciclopedia.",
    "Il mondo è troppo poco definito oppure troppo dettagliato?",
    [
      branch(
        "Le regole cambiano quando la trama ne ha bisogno",
        "Il problema riguarda capacità o conseguenze?",
        [
          choice(
            "Non so cosa è possibile fare",
            plan(
              "Una regola e il suo limite",
              "Le possibilità diventano credibili quando hanno confini.",
              [
                "Scrivi una regola operativa: cosa consente e cosa vieta.",
                "Aggiungi un costo o un limite osservabile.",
                "Controlla una scena in cui il limite produce conflitto.",
              ],
              "La regola può essere usata senza inventare un’eccezione ad hoc.",
              "Se il finale richiede un’eccezione, preparala o cambia la soluzione.",
              "characters",
              ["finale"],
            ),
          ),
          choice(
            "So cosa è possibile, ma non cosa costa",
            plan(
              "Le conseguenze del sistema",
              "Una capacità senza costo può cancellare la pressione.",
              [
                "Segui una capacità fino alle sue conseguenze sociali o personali.",
                "Identifica chi paga e chi beneficia.",
                "Mostra il costo in una scelta del protagonista.",
              ],
              "Il mondo modifica le decisioni, non solo lo scenario.",
              "Se il costo è decorativo, legalo a un valore del personaggio.",
              "characters",
              ["antagonista"],
            ),
          ),
        ],
      ),
      branch(
        "Le schede crescono ma la storia non avanza",
        "I dettagli cambiano azioni o sono solo interessanti?",
        [
          choice(
            "Sono soprattutto interessanti",
            plan(
              "Una bible al servizio della scena",
              "La quantità di informazioni non misura l’utilità narrativa.",
              [
                "Scegli il prossimo conflitto.",
                "Seleziona due dettagli del mondo che lo rendono specifico.",
                "Parcheggia le altre informazioni senza inserirle nella scena.",
              ],
              "Il testo usa il mondo senza spiegarlo tutto.",
              "Se la scena resta una visita guidata, usa Esposizione.",
              "studio",
              ["esposizione"],
            ),
          ),
          choice(
            "Cambiano azioni, ma non so presentarli",
            plan(
              "Mostrare una regola in funzione",
              "Il lettore può imparare un vincolo mentre qualcuno lo affronta.",
              [
                "Scegli una regola necessaria alla scena.",
                "Mostra un tentativo, il limite e una conseguenza.",
                "Aggiungi solo la spiegazione indispensabile a capire il tentativo.",
              ],
              "La regola è comprensibile attraverso l’azione.",
              "Se il lettore non può dedurla, usa una breve spiegazione mirata.",
              "studio",
              ["scene"],
            ),
          ),
        ],
      ),
    ],
    ["structure", "revision"],
  );
  add(
    "ritmo",
    "Revisionare",
    "Ritmo lento, frettoloso o uniforme",
    "Distingui durata, densità e alternanza delle pressioni.",
    "Il lettore aspetta troppo oppure non ha tempo di sentire gli eventi?",
    [
      branch(
        "La storia sembra lenta",
        "La lentezza nasce da ripetizione o assenza di pressione?",
        [
          choice(
            "Ripeto informazioni o passaggi equivalenti",
            plan(
              "Una scena, un avanzamento",
              "Il ritmo si ferma quando il lettore non riceve un cambiamento.",
              [
                "Riassumi la funzione delle ultime tre scene.",
                "Segna informazioni e tentativi duplicati.",
                "Prova a unire due passaggi mantenendo la conseguenza necessaria.",
              ],
              "Ogni scena aggiunge un elemento distinto.",
              "Se il passaggio non è duplicato, verifica l’obiettivo locale.",
              "board",
              ["scene"],
            ),
          ),
          choice(
            "Non è chiaro cosa possa andare perso",
            plan(
              "La pressione prima della velocità",
              "Frasi brevi non sostituiscono una domanda urgente per il lettore.",
              [
                "Nomina risultato desiderato e possibile perdita.",
                "Rendi visibile un limite di tempo, opportunità o rapporto se pertinente.",
                "Confronta la scena prima e dopo l’introduzione della pressione.",
              ],
              "La lettura ha una domanda da seguire.",
              "Se la pressione è artificiale, torna alla premessa.",
              "studio",
              ["premessa"],
            ),
          ),
        ],
      ),
      branch(
        "La storia corre senza lasciare tracce",
        "Manca la presenza nell’evento o il suo dopo?",
        [
          choice(
            "La presenza nell’evento decisivo",
            plan(
              "Rallentare il punto che conta",
              "Un momento irreversibile può richiedere più spazio percettivo.",
              [
                "Scegli una decisione oggi riassunta.",
                "Dai spazio a percezione, esitazione e scelta.",
                "Mantieni rapide le transizioni non decisive.",
              ],
              "Il lettore vive il cambiamento, non soltanto lo apprende.",
              "Se i dettagli non incidono, seleziona solo quelli legati alla scelta.",
              "studio",
              ["esposizione"],
            ),
          ),
          choice(
            "La reazione dopo l’evento",
            plan(
              "Una conseguenza sentita",
              "L’azione ha bisogno di trasformarsi in una nuova situazione.",
              [
                "Indica l’aspettativa distrutta dall’evento.",
                "Scrivi una reazione specifica e la nuova intenzione.",
                "Apri il seguito con quella intenzione o il suo ostacolo.",
              ],
              "Il dopo cambia il comportamento del personaggio.",
              "Se la reazione è generica, lavora sul suo bisogno.",
              "studio",
              ["personaggi"],
            ),
          ),
        ],
      ),
    ],
    ["revision", "drafts"],
  );
  add(
    "voce",
    "Revisionare",
    "Voce incerta e paura di essere derivativi",
    "Trova scelte linguistiche coerenti con l’esperienza narrata.",
    "Il testo suona generico oppure cambia registro senza motivo?",
    [
      branch(
        "Sembra scritto da chiunque",
        "Stai imitando una superficie o cercando precisione?",
        [
          choice(
            "Imito il tono di un autore che ammiro",
            plan(
              "Dall’imitazione alla funzione",
              "Una scelta stilistica conta per l’effetto che produce.",
              [
                "Identifica la funzione del modello: intimità, distanza, ironia o tensione.",
                "Prova a ottenere la stessa funzione con immagini del tuo personaggio.",
                "Togli i tratti che riconosci come imitazione senza necessità.",
              ],
              "La pagina serve l’esperienza del tuo testo.",
              "Se resta una maschera, prova una versione in linguaggio semplice.",
              "studio",
              ["pov"],
            ),
          ),
          choice(
            "Uso parole astratte perché non trovo il dettaglio",
            plan(
              "Una precisione personale",
              "La voce può nascere da ciò che viene notato e nominato.",
              [
                "Scegli tre dettagli che questa persona noterebbe.",
                "Sostituisci un’astrazione con un’immagine o un’azione pertinente.",
                "Leggi a voce alta e valuta ritmo e chiarezza.",
              ],
              "La frase è specifica senza diventare ornamentale.",
              "Se il dettaglio è solo decorazione, collegalo al conflitto.",
              "studio",
              ["esposizione"],
            ),
          ),
        ],
      ),
      branch(
        "I registri non sembrano appartenere allo stesso libro",
        "Il cambio segue POV e situazione?",
        [
          choice(
            "Sì, ma il lettore non percepisce il passaggio",
            plan(
              "Segnare un cambio intenzionale",
              "La varietà richiede un patto riconoscibile.",
              [
                "Definisci la ragione del cambio di registro.",
                "Segna la nuova unità narrativa o il nuovo focalizzatore.",
                "Confronta due passaggi per verificare che la differenza sia deliberata.",
              ],
              "Il cambio ha una causa e un confine leggibili.",
              "Se non c’è un vantaggio, uniforma il registro.",
              "editor",
              ["pov"],
            ),
          ),
          choice(
            "No, deriva da sessioni o revisioni diverse",
            plan(
              "Un campione di voce",
              "Una pagina di riferimento può guidare l’uniformità senza irrigidire il testo.",
              [
                "Scegli un passaggio che rappresenta la voce desiderata.",
                "Annota distanza, ritmo e tipo di lessico.",
                "Rivedi una scena discordante con quei criteri.",
              ],
              "La scena mantiene la funzione con una voce più coerente.",
              "Se la voce campione non serve tutta l’opera, definisci varianti per POV.",
              "editor",
              ["dialoghi"],
            ),
          ),
        ],
      ),
    ],
    ["revision"],
  );
  add(
    "esposizione",
    "Revisionare",
    "Troppa spiegazione o troppo poca chiarezza",
    "Scegli cosa mettere in scena, sintetizzare o spiegare.",
    "Il testo spiega troppo oppure lascia il lettore disorientato?",
    [
      branch(
        "Spiega emozioni, passato e mondo prima che servano",
        "L’informazione è necessaria alla scelta presente?",
        [
          choice(
            "No, potrebbe arrivare più avanti",
            plan(
              "Rinviare il contesto non necessario",
              "L’ordine delle informazioni può seguire il bisogno del lettore.",
              [
                "Segna il dettaglio che non cambia la comprensione dell’azione attuale.",
                "Spostalo nelle note o nel punto in cui diventa necessario.",
                "Rileggi la scena verificando che il conflitto sia ancora chiaro.",
              ],
              "La scena mantiene chiarezza con meno anticipo.",
              "Se il lettore perde un nesso, ripristina il minimo necessario.",
              "studio",
              ["ritmo"],
            ),
          ),
          choice(
            "Sì, ma la spiegazione arresta l’azione",
            plan(
              "Informazione dentro una pressione",
              "La spiegazione può essere breve e situata, senza un divieto assoluto di raccontare.",
              [
                "Identifica il dato indispensabile.",
                "Inseriscilo nel tentativo, nel limite o nella risposta di qualcuno.",
                "Sintetizza il contesto secondario in una frase mirata.",
              ],
              "Il lettore capisce il dato mentre segue la scena.",
              "Se l’azione diventa artificiale, usa una spiegazione diretta più breve.",
              "studio",
              ["mondo"],
            ),
          ),
        ],
      ),
      branch(
        "Il lettore non capisce cosa accade",
        "Manca orientamento o un nesso causale?",
        [
          choice(
            "Orientamento: chi, dove, quando",
            plan(
              "Tre coordinate leggibili",
              "L’ambiguità di significato non richiede ambiguità di situazione.",
              [
                "Individua la prima frase che colloca persona, luogo e momento.",
                "Anticipa solo le coordinate necessarie.",
                "Mantieni misteriosi i motivi, se è intenzionale, non la meccanica dell’evento.",
              ],
              "Il lettore può descrivere la situazione senza conoscere tutti i segreti.",
              "Se le coordinate sono già chiare, verifica la causa delle azioni.",
              "studio",
              ["pov"],
            ),
          ),
          choice(
            "Il motivo per cui un’azione segue l’altra",
            plan(
              "Un ponte causale",
              "Una scena può essere concreta ma non comprensibile.",
              [
                "Nomina stimolo, interpretazione e risposta.",
                "Trova quale dei tre passaggi manca.",
                "Aggiungi il minimo che rende plausibile la risposta.",
              ],
              "L’azione appare motivata, non arbitraria.",
              "Se la motivazione resta debole, torna ai Personaggi.",
              "studio",
              ["personaggi"],
            ),
          ),
        ],
      ),
    ],
    ["revision"],
  );
  add(
    "continuita",
    "Revisionare",
    "Contraddizioni e fili dimenticati",
    "Separa errore documentale e cambiamento intenzionale.",
    "La contraddizione riguarda un fatto o una promessa narrativa?",
    [
      branch(
        "Fatti, date, oggetti o conoscenze",
        "Le due versioni possono convivere?",
        [
          choice(
            "No, una delle due è un errore",
            plan(
              "Una fonte interna del fatto",
              "La correzione richiede un riferimento e le sue dipendenze.",
              [
                "Scegli il fatto canonico e annotalo nella Story Bible.",
                "Cerca tutte le occorrenze nel manoscritto.",
                "Correggi il fatto e controlla le azioni che dipendono da esso.",
              ],
              "Non restano occorrenze incompatibili con il riferimento scelto.",
              "Se la correzione cambia la trama, affronta prima la dipendenza strutturale.",
              "continuity",
              ["trama"],
            ),
          ),
          choice(
            "Sì, ma manca la transizione",
            plan(
              "Rendere visibile il cambiamento",
              "Età, conoscenze e oggetti possono cambiare, se il passaggio è motivato.",
              [
                "Individua quando avviene il cambiamento.",
                "Mostra o segnala la causa nel punto pertinente.",
                "Controlla ciò che i personaggi sanno prima e dopo.",
              ],
              "Le due versioni appartengono a momenti distinguibili.",
              "Se non puoi collocare il passaggio, scegli una sola versione.",
              "continuity",
              ["pov"],
            ),
          ),
        ],
      ),
      branch(
        "Promesse, indizi o archi non risolti",
        "Il filo è ancora necessario all’opera?",
        [
          choice(
            "Sì",
            plan(
              "Una chiusura rintracciabile",
              "Una promessa rilevante richiede un esito o un’apertura intenzionale.",
              [
                "Segna dove il filo è aperto.",
                "Definisci quale risposta o trasformazione serve al lettore.",
                "Colloca il beat di chiusura senza aggiungere una soluzione estranea.",
              ],
              "Puoi collegare apertura ed esito.",
              "Se la chiusura appesantisce il finale, anticipala o integra le linee.",
              "architecture",
              ["finale"],
            ),
          ),
          choice(
            "No, è un residuo di una versione precedente",
            plan(
              "Togliere la promessa residua",
              "Non tutte le promesse devono sopravvivere a una nuova struttura.",
              [
                "Conserva una versione delle scene coinvolte.",
                "Elimina o ridimensiona i richiami alla linea abbandonata.",
                "Rileggi l’inizio per verificare che non prometta ancora quell’esito.",
              ],
              "Il lettore non viene invitato ad aspettare una risposta che non arriverà.",
              "Se il filo resta utile al tema, ridagli una funzione chiara.",
              "tools",
              ["sottotrame"],
            ),
          ),
        ],
      ),
    ],
    ["drafts", "revision"],
  );
  add(
    "revisione",
    "Revisionare",
    "Revisione ingestibile",
    "Scegli il livello e il problema che genera gli altri.",
    "Hai troppi interventi oppure non sai riconoscere quelli necessari?",
    [
      branch(
        "Ho una lista enorme di difetti",
        "Ci sono problemi strutturali che rendono premature le correzioni di frase?",
        [
          choice(
            "Sì",
            plan(
              "La priorità a monte",
              "Una scena destinata a cambiare non richiede subito una rifinitura completa.",
              [
                "Separa la lista in struttura, frase, correttezza e refusi.",
                "Scegli la modifica strutturale con più dipendenze.",
                "Rivedi soltanto le scene coinvolte e conserva le altre note.",
              ],
              "Una scelta strutturale riduce lavoro di rifinitura inutile.",
              "Se la modifica è troppo ampia, scomponila per arco o sequenza.",
              "editor",
              ["trama"],
            ),
          ),
          choice(
            "No, la struttura regge ma i dettagli sono molti",
            plan(
              "Passaggi omogenei",
              "Un controllo mirato riduce il cambio continuo di attenzione.",
              [
                "Scegli una classe di problemi: POV, tempi, nomi o dialoghi.",
                "Applica il controllo a una scena campione.",
                "Estendi il criterio alle scene pertinenti, poi cambia passaggio.",
              ],
              "Il controllo ha un risultato verificabile e un limite.",
              "Se il criterio non è chiaro, crea una piccola scheda di stile.",
              "editor",
              ["coerenza-stile"],
            ),
          ),
        ],
      ),
      branch(
        "So che il testo non funziona ma non dove",
        "Hai raccolto esempi specifici?",
        [
          choice(
            "No, ho solo una valutazione generale",
            plan(
              "Dal giudizio al punto di attrito",
              "Un’impressione va tradotta in osservazioni per essere utile.",
              [
                "Leggi una scena senza modificarla.",
                "Segna dove perdi orientamento, interesse o credibilità.",
                "Scegli un solo punto e formula una domanda verificabile.",
              ],
              "La revisione parte da un esempio, non da “è tutto sbagliato”.",
              "Se non trovi il punto, chiedi un riscontro su una scena delimitata.",
              "editor",
              ["feedback"],
            ),
          ),
          choice(
            "Sì, ma non capisco la causa",
            plan(
              "Due varianti, una domanda",
              "Un esperimento può distinguere cause concorrenti.",
              [
                "Formula due ipotesi sul difetto.",
                "Crea due piccole varianti, una per ipotesi.",
                "Confrontale rispetto all’effetto desiderato sul lettore.",
              ],
              "Sai quale leva modifica davvero il problema.",
              "Se entrambe falliscono, cerca la causa nella scena o nell’arco precedente.",
              "studio",
              ["scene"],
            ),
          ),
        ],
      ),
    ],
    ["revision", "drafts"],
  );
  add(
    "tagli",
    "Revisionare",
    "Testo troppo lungo o paura di tagliare",
    "Proteggi le funzioni narrative, non ogni formulazione.",
    "Il volume viene da scene ridondanti o da prosa dilatata?",
    [
      branch(
        "Scene o linee ripetute",
        "La scena ripete una funzione o contiene una funzione unica?",
        [
          choice(
            "Ripete una funzione",
            plan(
              "Un taglio con prova di tenuta",
              "La ridondanza può essere testata senza perdere il materiale.",
              [
                "Conserva backup e versioni.",
                "Prova la sequenza senza la scena o unisci i passaggi equivalenti.",
                "Controlla nessi causali, orientamento e payoff.",
              ],
              "La storia regge con meno ripetizione.",
              "Se emerge un vuoto, recupera la funzione mancante e non tutta la scena.",
              "board",
              ["sottotrame"],
            ),
          ),
          choice(
            "Contiene una funzione unica, ma molto materiale accessorio",
            plan(
              "Salvare la funzione, ridurre il percorso",
              "Non serve scegliere tra tenere tutto ed eliminare tutto.",
              [
                "Nomina la funzione indispensabile.",
                "Segna i passaggi che la preparano davvero.",
                "Condensa o sposta il resto nelle note.",
              ],
              "La funzione rimane leggibile in meno spazio.",
              "Se la funzione richiede ancora troppo, controlla la sua posizione nell’opera.",
              "studio",
              ["ritmo"],
            ),
          ),
        ],
      ),
      branch(
        "Frasi e paragrafi troppo dilatati",
        "La dilatazione aggiunge effetto o ripete il senso?",
        [
          choice(
            "Ripete il senso",
            plan(
              "Un controllo delle equivalenze",
              "Due formulazioni possono competere per la stessa informazione.",
              [
                "Scegli un paragrafo e sottolinea l’informazione nuova.",
                "Togli parafrasi, anticipazioni e spiegazioni già implicite.",
                "Rileggi per ritmo e precisione, non solo per numero di parole.",
              ],
              "Ogni frase aggiunge informazione o un effetto intenzionale.",
              "Se il testo diventa secco, ripristina il dettaglio che sosteneva l’esperienza.",
              "studio",
              ["voce"],
            ),
          ),
          choice(
            "Aggiunge atmosfera, ma ne ho ovunque",
            plan(
              "Distribuire la densità",
              "La densità funziona meglio se è una scelta, non l’impostazione unica.",
              [
                "Individua il momento emotivo decisivo.",
                "Conserva lì la densità più significativa.",
                "Sintetizza i passaggi di transizione e confronta il ritmo.",
              ],
              "La prosa distingue momenti cruciali e raccordi.",
              "Se l’atmosfera scompare, verifica quali immagini sostengono davvero il tono.",
              "studio",
              ["ritmo"],
            ),
          ),
        ],
      ),
    ],
    ["revision", "drafts"],
  );
  add(
    "feedback",
    "Condividere",
    "Feedback vago o contraddittorio",
    "Trasforma i pareri in ipotesi da verificare.",
    "Il riscontro è poco specifico oppure i lettori non concordano?",
    [
      branch("Ricevo giudizi generali", "Il lettore indica un punto preciso?", [
        choice(
          "No",
          plan(
            "Tre domande per il lettore",
            "Una richiesta delimitata produce osservazioni più utilizzabili.",
            [
              "Scegli una scena e spiega l’effetto che stai cercando.",
              "Chiedi dove si perde orientamento, interesse o credibilità.",
              "Richiedi un esempio dal testo invece di un voto globale.",
            ],
            "Il riscontro contiene almeno un punto rintracciabile.",
            "Se il lettore resta generico, cerca un’altra persona adatta al tipo di testo.",
            "editor",
            ["revisione"],
          ),
        ),
        choice(
          "Sì, ma mi propone soltanto una riscrittura",
          plan(
            "Separare sintomo e soluzione",
            "Puoi accogliere l’osservazione senza adottare la proposta.",
            [
              "Chiedi quale problema risolve la riscrittura suggerita.",
              "Formula quel problema con parole tue.",
              "Prova una soluzione coerente con l’intenzione dell’opera.",
            ],
            "Sai che cosa correggere e perché.",
            "Se non condividi il sintomo, conserva la nota e cerca un secondo riscontro.",
            "studio",
            ["voce"],
          ),
        ),
      ]),
      branch(
        "I consigli si contraddicono",
        "I lettori stanno cercando la stessa esperienza?",
        [
          choice(
            "No, hanno aspettative diverse",
            plan(
              "Il lettore pertinente",
              "Un parere è utile rispetto a un pubblico e a una promessa.",
              [
                "Definisci lettore e genere del progetto.",
                "Distingui incompatibilità di gusto da difficoltà di comprensione.",
                "Valuta i consigli in rapporto all’esperienza che vuoi offrire.",
              ],
              "La scelta non dipende dal numero di preferenze ma dalla loro pertinenza.",
              "Se il pubblico resta vago, torna al Publisher.",
              "publisher",
              ["pubblicazione"],
            ),
          ),
          choice(
            "Sì, ma leggono diversamente lo stesso punto",
            plan(
              "Una prova controllata",
              "Il disaccordo può segnalare un’ambiguità o una variazione legittima.",
              [
                "Isola il punto contestato.",
                "Chiedi a ciascuno quale elemento del testo sostiene la lettura.",
                "Prova una variante che chiarisca solo l’ambiguità involontaria.",
              ],
              "Puoi distinguere l’apertura voluta dalla confusione.",
              "Se la variante impoverisce il testo, conserva la complessità intenzionale.",
              "studio",
              ["pov"],
            ),
          ),
        ],
      ),
    ],
    ["revision", "drafts"],
  );
  add(
    "giudizio",
    "Condividere",
    "Paura del giudizio e confronto con altri",
    "Scegli uno spazio di prova e una richiesta proporzionata.",
    "La paura blocca la stesura privata o la condivisione?",
    [
      branch(
        "Scrivo come se qualcuno mi valutasse subito",
        "Ti confronti con opere finite o con un criterio concreto?",
        [
          choice(
            "Con opere finite e autori esperti",
            plan(
              "Un confronto fra fasi equivalenti",
              "Una bozza non ha ricevuto gli stessi passaggi di un libro pubblicato.",
              [
                "Definisci il compito della versione attuale.",
                "Confronta il testo con quel compito, non con la carriera di un altro.",
                "Rinvia il confronto stilistico a una sessione di studio separata.",
              ],
              "La valutazione non interrompe ogni tentativo.",
              "Se resta un problema specifico di voce, usa il percorso dedicato.",
              "studio",
              ["perfezionismo"],
            ),
          ),
          choice(
            "Con un criterio che continua a cambiare",
            plan(
              "Un criterio dichiarato prima della prova",
              "La prova non può riuscire se il traguardo si sposta ogni volta.",
              [
                "Scrivi un criterio osservabile prima di stendere.",
                "Finisci un frammento senza rinegoziarlo.",
                "Valuta il risultato solo dopo, lasciando gli altri criteri per una revisione.",
              ],
              "Puoi dire se il frammento ha svolto il suo compito.",
              "Se il criterio è irrealistico, riduci il compito.",
              "editor",
              ["perfezionismo"],
            ),
          ),
        ],
      ),
      branch(
        "Ho un testo ma non riesco a mostrarlo",
        "Manca fiducia nel destinatario o chiarezza nella richiesta?",
        [
          choice(
            "Fiducia nel destinatario",
            plan(
              "Una condivisione a rischio limitato",
              "Puoi scegliere persona, dimensione e tipo di riscontro.",
              [
                "Scegli una persona rispettosa del tuo obiettivo.",
                "Condividi un frammento, non l’intero progetto.",
                "Concorda una domanda specifica e il livello di revisione attuale.",
              ],
              "Hai creato una prova delimitata, senza dover difendere tutto il libro.",
              "Se il riscontro è svalutante, cerca un contesto più adatto.",
              "editor",
              ["feedback"],
            ),
          ),
          choice(
            "Chiarezza nella richiesta",
            plan(
              "Un mandato per il lettore",
              "Sapere cosa osservare aiuta chi legge e chi riceve il parere.",
              [
                "Descrivi pubblico e intento della scena.",
                "Chiedi due osservazioni su comprensione ed effetto.",
                "Dichiara quali livelli non vuoi ancora valutare.",
              ],
              "Il riscontro risponde al compito concordato.",
              "Se arrivano consigli su tutto, riporta la conversazione alla domanda.",
              "editor",
              ["feedback"],
            ),
          ),
        ],
      ),
    ],
    ["rose", "purdue"],
  );
  add(
    "pitch",
    "Condividere",
    "Logline, sinossi o query inefficaci",
    "Scegli il documento prima di cercare la formulazione.",
    "Stai preparando una sintesi narrativa o una proposta a un destinatario?",
    [
      branch(
        "Una sintesi narrativa",
        "Serve una logline o una sinossi completa?",
        [
          choice(
            "Una logline",
            plan(
              "Il motore in poche righe",
              "La logline mette a fuoco conflitto e posta senza elencare tutte le scene.",
              [
                "Scrivi protagonista, obiettivo, opposizione e costo.",
                "Togli nomi secondari e passaggi che non cambiano il motore.",
                "Controlla che il lettore intuisca il tipo di storia.",
              ],
              "La sintesi chiarisce che cosa mette in moto il libro.",
              "Se la sintesi non regge, può esserci un problema di premessa.",
              "publisher",
              ["premessa"],
            ),
          ),
          choice(
            "Una sinossi",
            plan(
              "Una catena fino all’esito",
              "Una sinossi editoriale normalmente espone svolte e finale, secondo le istruzioni ricevute.",
              [
                "Verifica lunghezza e formato richiesti dal destinatario.",
                "Riassumi scelte e conseguenze fino alla conclusione.",
                "Riduci le linee che non servono a capire l’arco principale.",
              ],
              "La sinossi rende leggibile la storia senza dipendere da suspense promozionale.",
              "Se mancano nessi fra svolte, torna alla Trama.",
              "publisher",
              ["trama"],
            ),
          ),
        ],
      ),
      branch(
        "Una proposta editoriale",
        "È chiaro il destinatario e il suo formato?",
        [
          choice(
            "No, sto preparando un testo generico",
            plan(
              "Una proposta con un destinatario",
              "La proposta deve rispettare requisiti reali, non un modello universale.",
              [
                "Individua un destinatario pertinente al genere.",
                "Leggi le istruzioni aggiornate sul suo sito.",
                "Prepara una base modulare con presentazione, libro e informazioni veritiere sull’autore.",
              ],
              "Sai quale documento inviare e in quale forma.",
              "Se il destinatario non accetta proposte, scegli un’altra strada.",
              "publisher",
              ["pubblicazione"],
            ),
          ),
          choice(
            "Sì, ma il testo è pieno di elogi e promesse",
            plan(
              "Fatti e promessa narrativa",
              "L’efficacia non richiede dichiarare che il libro sarà un successo.",
              [
                "Sostituisci gli elogi con genere, dimensione e conflitto.",
                "Inserisci soltanto credenziali reali e pertinenti.",
                "Verifica che la proposta risponda alle istruzioni del destinatario.",
              ],
              "La proposta offre informazioni utilizzabili senza superlativi o garanzie.",
              "Se manca il cuore del libro, riscrivi prima la logline.",
              "publisher",
              ["premessa"],
            ),
          ),
        ],
      ),
    ],
    ["query"],
  );
  add(
    "pubblicazione",
    "Condividere",
    "Percorso di pubblicazione confuso",
    "Distingui preparazione del testo, pubblico e canale.",
    "Non sai se il testo è pronto oppure quale canale scegliere?",
    [
      branch(
        "Non so se è pronto per essere proposto",
        "Manca una revisione interna o un riscontro esterno?",
        [
          choice(
            "Una revisione interna conclusa",
            plan(
              "Una soglia di proposta",
              "Proporre il libro richiede un criterio di prontezza, non la perfezione.",
              [
                "Verifica struttura e chiusura degli archi principali.",
                "Completa i controlli di correttezza pertinenti alla versione da inviare.",
                "Prepara una lista dei requisiti richiesti per la proposta.",
              ],
              "Il testo e i materiali rispettano una soglia dichiarata.",
              "Se resta una debolezza strutturale, rinvia la proposta e delimita l’intervento.",
              "editor",
              ["revisione"],
            ),
          ),
          choice(
            "Un riscontro da lettori adatti",
            plan(
              "Una lettura orientata alla promessa",
              "Un lettore pertinente può mostrare dove l’esperienza si interrompe.",
              [
                "Scegli persone che conoscano il tipo di testo.",
                "Chiedi osservazioni su arco, chiarezza e aspettativa.",
                "Valuta i problemi ricorrenti prima della proposta.",
              ],
              "Hai esempi concreti da integrare o motivatamente lasciare.",
              "Se i pareri sono generici, usa Feedback.",
              "editor",
              ["feedback"],
            ),
          ),
        ],
      ),
      branch(
        "Non so quale canale scegliere",
        "Il tuo obiettivo principale è un confronto editoriale o il controllo della pubblicazione?",
        [
          choice(
            "Un confronto editoriale e una selezione esterna",
            plan(
              "Una lista ragionata di destinatari",
              "La pertinenza richiede ricerca specifica, non invii indiscriminati.",
              [
                "Definisci genere, lettore e stato del manoscritto.",
                "Esamina cataloghi e modalità di proposta ufficiali.",
                "Crea una lista con requisiti, materiali e date degli invii.",
              ],
              "Ogni destinatario ha una motivazione verificabile.",
              "Se non trovi pertinenza, rivedi il posizionamento prima di cambiare testo.",
              "publisher",
              ["pitch"],
            ),
          ),
          choice(
            "Il controllo delle scelte e della distribuzione",
            plan(
              "Una mappa delle responsabilità",
              "Scegliere autonomia significa rendere visibili i compiti della pubblicazione.",
              [
                "Elenca revisione, impaginazione, copertina, distribuzione e comunicazione.",
                "Distingui ciò che puoi fare da ciò che richiede competenze ulteriori.",
                "Confronta canali e requisiti aggiornati prima di prendere impegni.",
              ],
              "Hai una mappa di compiti e decisioni, senza promesse di successo.",
              "Per dubbi su contratti o obblighi, chiedi un parere competente: questo percorso è editoriale.",
              "publisher",
              ["formato"],
            ),
          ),
        ],
      ),
    ],
    ["query"],
  );
  add(
    "rifiuti",
    "Condividere",
    "Rifiuti editoriali e mancata risposta",
    "Distingui il segnale disponibile dal giudizio che immagini.",
    "Hai ricevuto un riscontro specifico oppure soltanto un esito?",
    [
      branch(
        "Un esito senza spiegazioni",
        "Il destinatario era pertinente e l’invio conforme?",
        [
          choice(
            "Non l’ho verificato",
            plan(
              "Un controllo dell’invio",
              "Un rifiuto non identifica da solo un difetto del manoscritto.",
              [
                "Controlla catalogo, stato delle proposte e formato richiesto.",
                "Verifica materiali, destinatario e data dell’invio.",
                "Correggi il processo per il prossimo invio senza riscrivere automaticamente il libro.",
              ],
              "Hai distinto pertinenza e procedura dalla qualità del testo.",
              "Se l’invio era corretto, non dedurre una causa che non è stata indicata.",
              "publisher",
              ["pitch"],
            ),
          ),
          choice(
            "Sì, era pertinente e conforme",
            plan(
              "Non inventare il motivo del rifiuto",
              "Un esito singolo offre informazioni limitate.",
              [
                "Registra l’esito senza trasformarlo in una diagnosi del testo.",
                "Rivedi la lista dei destinatari e il prossimo passo sostenibile.",
                "Se desideri un’analisi del libro, chiedi un riscontro mirato separato.",
              ],
              "La decisione successiva si basa su ciò che sai davvero.",
              "Se la sequenza di invii ti sovraccarica, riduci il ritmo o prenditi una pausa.",
              "publisher",
              ["feedback"],
            ),
          ),
        ],
      ),
      branch(
        "Un riscontro su problemi del libro",
        "Il problema è ripetuto da lettori indipendenti?",
        [
          choice(
            "Sì, con esempi simili",
            plan(
              "Un’ipotesi di revisione corroborata",
              "La ricorrenza può meritare una prova, non una riscrittura totale.",
              [
                "Raccogli i punti del testo citati.",
                "Formula una causa comune.",
                "Prova una modifica delimitata e valuta l’effetto.",
              ],
              "La revisione risponde agli esempi, non al timore generale di fallire.",
              "Se l’intervento peggiora altri aspetti, cerca una causa a monte.",
              "editor",
              ["revisione"],
            ),
          ),
          choice(
            "No, è una preferenza o un parere isolato",
            plan(
              "Un confronto con l’intenzione",
              "Una preferenza non diventa automaticamente un obbligo.",
              [
                "Definisci l’effetto che desideri ottenere.",
                "Confronta il consiglio con il pubblico e il progetto.",
                "Decidi se testarlo, conservarlo come nota o non adottarlo.",
              ],
              "Puoi motivare la decisione senza svalutare chi legge o il tuo lavoro.",
              "Se l’intenzione non è chiara, torna a Tema e Premessa.",
              "muse",
              ["tema"],
            ),
          ),
        ],
      ),
    ],
    ["query", "revision"],
  );
  add(
    "organizzazione",
    "Gestire il lavoro",
    "Appunti dispersi e versioni confuse",
    "Dai a ogni informazione un posto e a ogni versione un’identità.",
    "Perdi le informazioni oppure non sai quale testo usare?",
    [
      branch(
        "Le informazioni sono sparse",
        "Si tratta di fatti canonici o idee ancora aperte?",
        [
          choice(
            "Fatti già stabiliti",
            plan(
              "Una bible come riferimento",
              "Un fatto condiviso deve avere un luogo di consultazione.",
              [
                "Raccogli nomi, luoghi, oggetti e regole nella Story Bible.",
                "Per ogni fatto annota dove viene stabilito nel manoscritto.",
                "Cerca i duplicati e scegli una formulazione di riferimento.",
              ],
              "Puoi ritrovare il fatto senza aprire tutte le note.",
              "Se due versioni non concordano, apri Continuità.",
              "characters",
              ["continuita"],
            ),
          ),
          choice(
            "Idee, domande e possibilità",
            plan(
              "Separare deciso e possibile",
              "Un’idea aperta non deve essere scambiata per una regola del progetto.",
              [
                "Marca gli appunti come deciso, da verificare o possibilità.",
                "Collega le domande alla scena o al beat pertinente.",
                "Scegli una sola domanda da risolvere nella prossima sessione.",
              ],
              "Sai quali informazioni puoi usare e quali richiedono una decisione.",
              "Se tutte restano aperte, scegli una prova concreta.",
              "studio",
              ["ricerca"],
            ),
          ),
        ],
      ),
      branch(
        "Le versioni si sovrappongono",
        "Sono dentro lo stesso progetto o in copie separate?",
        [
          choice(
            "Dentro lo stesso progetto",
            plan(
              "Una versione prima del cambiamento",
              "La cronologia serve se distingue lo stato corrente dalle prove.",
              [
                "Salva una versione prima di un intervento importante.",
                "Annota nelle note lo scopo della prova.",
                "Confronta il risultato con lo scopo e conserva lo stato scelto.",
              ],
              "Puoi spiegare perché la versione attiva è quella pertinente.",
              "Se il limite di versioni non basta, esporta un backup esterno.",
              "studio",
              ["revisione"],
            ),
          ),
          choice(
            "In copie su browser o dispositivi diversi",
            plan(
              "Un archivio attivo dichiarato",
              "Gli archivi locali non si sincronizzano automaticamente.",
              [
                "Scegli il dispositivo e il progetto che contengono il lavoro attivo.",
                "Esporta backup delle altre copie prima di confrontarle.",
                "Importa le copie come progetti separati e trasferisci solo il materiale desiderato.",
              ],
              "Hai un archivio attivo e copie conservate, senza sovrascritture alla cieca.",
              "Se un archivio è illeggibile, usa i controlli di recupero prima di reimpostare.",
              "home",
              [],
            ),
          ),
        ],
      ),
    ],
    ["drafts"],
  );
  add(
    "saggistico",
    "Gestire il lavoro",
    "Saggio o testo argomentativo senza struttura",
    "Collega domanda, tesi, prove e lettore.",
    "Manca una direzione argomentativa oppure la documentazione non sostiene il testo?",
    [
      branch(
        "Le sezioni sono una raccolta di informazioni",
        "È chiara la domanda del lettore?",
        [
          choice(
            "No",
            plan(
              "Una domanda e una tesi provvisoria",
              "Una struttura argomentativa ha bisogno di un problema circoscritto.",
              [
                "Definisci chi legge e quale domanda deve trovare risposta.",
                "Scrivi una tesi provvisoria, anche da modificare.",
                "Assegna a ogni sezione una funzione rispetto a quella tesi.",
              ],
              "Puoi spiegare perché ogni sezione serve alla risposta.",
              "Se il tema è troppo ampio, riduci pubblico o campo della domanda.",
              "muse",
              ["premessa"],
            ),
          ),
          choice(
            "Sì, ma le sezioni non formano un ragionamento",
            plan(
              "Un ordine di dipendenze",
              "Il lettore deve avere le premesse prima delle conclusioni.",
              [
                "Riassumi l’affermazione centrale di ogni sezione.",
                "Segna quali affermazioni dipendono da altre.",
                "Riordina le sezioni per rendere leggibile il percorso del ragionamento.",
              ],
              "Le conclusioni possono essere seguite senza salti impliciti.",
              "Se manca una premessa, non sostituirla con una transizione retorica.",
              "board",
              ["esposizione"],
            ),
          ),
        ],
      ),
      branch(
        "Le affermazioni non sembrano solide",
        "Mancano prove o manca il legame fra prove e affermazioni?",
        [
          choice(
            "Mancano prove pertinenti",
            plan(
              "Una matrice delle affermazioni",
              "Le fonti devono sostenere il punto specifico, non solo trattare lo stesso tema.",
              [
                "Elenca affermazione, prova richiesta e fonte disponibile.",
                "Segna i punti non verificati senza presentarli come fatti.",
                "Restringi l’affermazione o cerca una fonte adeguata prima di finalizzarla.",
              ],
              "Il testo distingue dati, interpretazioni e ipotesi.",
              "Per temi specialistici chiedi un riscontro competente, non una conferma generica.",
              "characters",
              ["ricerca"],
            ),
          ),
          choice(
            "Le prove ci sono, ma il lettore non vede il nesso",
            plan(
              "Esplicitare il passaggio inferenziale",
              "Una fonte non argomenta al posto dell’autore.",
              [
                "Accanto a ogni prova scrivi quale parte della tesi sostiene.",
                "Spiega il limite o l’obiezione più rilevante.",
                "Riscrivi il paragrafo come affermazione, prova e ragionamento.",
              ],
              "Il lettore può valutare il nesso e i suoi limiti.",
              "Se il nesso resta debole, rivedi la tesi anziché aggiungere citazioni.",
              "studio",
              ["revisione"],
            ),
          ),
        ],
      ),
    ],
    ["purdue", "hjortshoj"],
  );
  add(
    "coerenza-stile",
    "Revisionare",
    "Correttezza e convenzioni incoerenti",
    "Crea criteri di uniformità senza confonderli con la voce.",
    "Il dubbio riguarda una regola linguistica oppure una scelta editoriale?",
    [
      branch(
        "Una regola linguistica o una formulazione incerta",
        "Il problema cambia il significato?",
        [
          choice(
            "Sì, non è chiaro chi fa cosa",
            plan(
              "Prima la chiarezza sintattica",
              "La correttezza serve anche a rendere leggibile l’azione.",
              [
                "Identifica soggetto, azione e riferimento di ogni pronome.",
                "Prova una formulazione diretta che conservi il senso.",
                "Rileggi il periodo nel contesto per evitare un chiarimento fuorviante.",
              ],
              "Il referente e l’azione non sono ambigui involontariamente.",
              "Se l’ambiguità riguarda ciò che sa il narratore, apri POV.",
              "editor",
              ["pov"],
            ),
          ),
          choice(
            "No, ma non so quale forma sia corretta",
            plan(
              "Una verifica puntuale",
              "Un dubbio specifico si risolve meglio di un controllo indistinto.",
              [
                "Isola la forma dubbia e il suo contesto.",
                "Consulta un riferimento linguistico affidabile e pertinente.",
                "Annota la soluzione e applicala alle occorrenze equivalenti.",
              ],
              "La soluzione ha un riferimento e non dipende da una supposizione.",
              "Se sono ammesse più forme, scegli una convenzione coerente.",
              "tools",
              ["organizzazione"],
            ),
          ),
        ],
      ),
      branch(
        "Virgolette, nomi, maiuscole o tempi non uniformi",
        "Esiste già una convenzione richiesta?",
        [
          choice(
            "Sì, dal progetto o dal destinatario",
            plan(
              "Una scheda di stile applicabile",
              "La convenzione deve poter essere controllata sul testo.",
              [
                "Raccogli poche regole esplicite in una scheda della bible.",
                "Cerca le occorrenze discordanti.",
                "Correggi una classe di problemi per passaggio.",
              ],
              "Le occorrenze pertinenti rispettano il criterio scelto.",
              "Se una variante è intenzionale, annota la sua condizione.",
              "editor",
              ["continuita"],
            ),
          ),
          choice(
            "No",
            plan(
              "Scegliere senza riscrivere la voce",
              "L’uniformità non richiede rendere tutti i periodi uguali.",
              [
                "Scegli convenzioni per dialoghi, nomi e riferimenti.",
                "Provale su una scena campione.",
                "Estendi solo le scelte che migliorano leggibilità e coerenza.",
              ],
              "La scheda di stile distingue regole da preferenze di frase.",
              "Se cambiano le istruzioni della destinazione, aggiorna la scheda prima dell’ultima revisione.",
              "characters",
              ["formato"],
            ),
          ),
        ],
      ),
    ],
    ["revision"],
  );
  add(
    "formato",
    "Gestire il lavoro",
    "Formato, esportazione e consegna",
    "Scegli l’output in base all’uso e verifica il file reale.",
    "Il file deve essere ancora modificabile o pronto per lettura e invio?",
    [
      branch(
        "Deve restare modificabile",
        "Serve conservare il progetto o trasferire il testo?",
        [
          choice(
            "Conservare progetto, schede e versioni",
            plan(
              "Un backup completo verificato",
              "Un export del manoscritto non conserva tutte le informazioni del progetto.",
              [
                "Usa Backup completo o Esporta progetto in JSON.",
                "Conserva il file fuori dai dati del browser.",
                "Verifica il recupero importandolo come progetto separato prima di cancellare una copia.",
              ],
              "Il file permette di ritrovare testo e schede.",
              "Se l’import fallisce, conserva il file originale e controlla il formato.",
              "home",
              ["organizzazione"],
            ),
          ),
          choice(
            "Trasferire soltanto il manoscritto",
            plan(
              "Un formato di lavoro leggibile",
              "TXT e Markdown servono a trasferire il contenuto, non tutta l’impaginazione.",
              [
                "Esporta TXT o Markdown in base al programma di destinazione.",
                "Apri il file esportato e controlla capitoli, scene e caratteri.",
                "Conserva anche un JSON del progetto prima di proseguire altrove.",
              ],
              "Il testo è completo e leggibile nel programma scelto.",
              "Se serve DOCX o EPUB, usa un programma adatto dopo l’export: non sono formati nativi dello studio.",
              "home",
              [],
            ),
          ),
        ],
      ),
      branch(
        "Deve essere letto, stampato o inviato",
        "Hai verificato le istruzioni della destinazione?",
        [
          choice(
            "Sì",
            plan(
              "Una consegna controllata",
              "Il formato corretto si verifica sul file, non solo sulla schermata.",
              [
                "Prepara i materiali richiesti.",
                "Per un PDF usa la stampa del browser e controlla anteprima, margini e pagine.",
                "Apri il file risultante e verifica titolo, ordine e completezza prima dell’invio.",
              ],
              "Il file reale rispetta i requisiti disponibili.",
              "Se il destinatario chiede un formato non supportato, prepara l’output con un altro strumento.",
              "publisher",
              ["pitch"],
            ),
          ),
          choice(
            "No",
            plan(
              "Prima i requisiti, poi l’impaginazione",
              "Un PDF elegante può essere inutile se non è il formato richiesto.",
              [
                "Leggi le istruzioni ufficiali aggiornate.",
                "Annota formato, lunghezza e materiali da allegare.",
                "Scegli l’export o lo strumento di conversione in base a quei requisiti.",
              ],
              "Sai cosa preparare e cosa controllare.",
              "Se i requisiti non sono chiari, chiedi chiarimento al destinatario prima di inviare.",
              "publisher",
              ["pubblicazione"],
            ),
          ),
        ],
      ),
    ],
    ["query", "drafts"],
  );
  function buildTree(issue) {
    const nodes = {};
    nodes.start = {
      id: "start",
      question: issue.question,
      options: issue.branches.map((b, i) => ({
        label: b.label,
        next: "branch-" + i,
      })),
    };
    issue.branches.forEach((b, i) => {
      nodes["branch-" + i] = {
        id: "branch-" + i,
        question: b.question,
        options: b.choices.map((c, j) => ({
          label: c.label,
          next: "scope-" + i + "-" + j,
        })),
      };
      b.choices.forEach((c, j) => {
        const base = "scope-" + i + "-" + j;
        if (c.plan.care) {
          nodes[base] = {
            id: base,
            kind: "result",
            plan: { ...c.plan, mode: "sostegno", duration: null },
          };
          return;
        }
        nodes[base] = {
          id: base,
          question: "Quale prova puoi delimitare per questo incontro?",
          options: [
            {
              label: "Una prova breve: circa 10 minuti",
              next: base + "-short",
            },
            {
              label: "Un passaggio esteso: circa 25 minuti",
              next: base + "-full",
            },
          ],
        };
        nodes[base + "-short"] = {
          id: base + "-short",
          kind: "result",
          plan: {
            ...c.plan,
            mode: "breve",
            duration: 10,
            scope:
              "Un frammento, una scena o una sola voce della scheda. Il tempo è orientativo: puoi fermarti prima.",
          },
        };
        nodes[base + "-full"] = {
          id: base + "-full",
          kind: "result",
          plan: {
            ...c.plan,
            mode: "esteso",
            duration: 25,
            scope:
              "Completa il protocollo su un’unità delimitata e confronta il risultato con la versione iniziale. Il tempo è orientativo.",
          },
        };
      });
    });
    return { root: "start", nodes };
  }
  const trees = Object.fromEntries(
    issues.map((issue) => [issue.id, buildTree(issue)]),
  );
  function start(issueId) {
    if (!trees[issueId]) throw Error("Percorso inesistente.");
    return { issueId, current: "start", trail: [] };
  }
  function advance(state, index) {
    const node = trees[state.issueId]?.nodes[state.current],
      option = node?.options?.[index];
    if (!option) throw Error("Scelta non valida.");
    return {
      ...state,
      current: option.next,
      trail: [
        ...state.trail,
        { node: state.current, label: option.label, index },
      ],
    };
  }
  function back(state) {
    if (!state.trail.length) return state;
    const previous = state.trail.at(-1);
    return {
      ...state,
      current: previous.node,
      trail: state.trail.slice(0, -1),
    };
  }
  function getResult(state) {
    return trees[state.issueId]?.nodes[state.current]?.plan || null;
  }
  function list(query = "", group = "") {
    const q = query.toLocaleLowerCase("it").trim();
    return issues.filter(
      (i) =>
        (!group || i.group === group) &&
        (!q ||
          (
            i.title +
            " " +
            i.summary +
            " " +
            i.group +
            " " +
            i.branches
              .map(
                (b) =>
                  b.label +
                  " " +
                  b.question +
                  " " +
                  b.choices.map((c) => c.label).join(" "),
              )
              .join(" ")
          )
            .toLocaleLowerCase("it")
            .includes(q)),
    );
  }
  function validate() {
    const known = new Set(issues.map((i) => i.id));
    if (known.size !== issues.length) throw Error("ID problemi duplicati.");
    for (const issue of issues) {
      if (
        !groups.includes(issue.group) ||
        !issue.sources.every((s) => sources[s])
      )
        throw Error("Categoria o fonti non valide.");
      const tree = trees[issue.id],
        visited = new Set();
      function walk(id, depth, ancestors) {
        const node = tree.nodes[id];
        if (!node || ancestors.has(id)) throw Error("Nodo mancante o ciclo.");
        visited.add(id);
        if (node.kind === "result") {
          const p = node.plan;
          if (
            depth > 4 ||
            !p.title ||
            !p.why ||
            p.steps.length !== 3 ||
            !p.check ||
            !p.fallback ||
            ![
              "studio",
              "home",
              "muse",
              "characters",
              "architecture",
              "editor",
              "continuity",
              "publisher",
              "tools",
              "board",
            ].includes(p.tool) ||
            !p.related.every((r) => known.has(r))
          )
            throw Error("Piano non valido: " + issue.id);
          return;
        }
        if (
          !node.question ||
          node.options.length < 2 ||
          node.options.length > 4
        )
          throw Error("Domanda non valida.");
        const next = new Set([...ancestors, id]);
        node.options.forEach((o) => walk(o.next, depth + 1, next));
      }
      walk(tree.root, 0, new Set());
      if (visited.size !== Object.keys(tree.nodes).length)
        throw Error("Nodi non raggiungibili.");
    }
    return true;
  }
  validate();
  return {
    sources,
    groups,
    issues,
    trees,
    start,
    advance,
    back,
    getResult,
    list,
    validate,
  };
});
