(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.WriterDesk = api;
})(globalThis, function () {
  "use strict";
  const resources = [
    {
      id: "liberliber",
      name: "Liber Liber",
      category: "Libri",
      language: "Italiano",
      access: "Testi e audiolibri gratuiti",
      url: "https://liberliber.it/",
      about: "Classici, testi e audiolibri del progetto Manuzio.",
      use: "Studiare una scena, un registro o un periodo storico.",
      note: "I singoli libri sono consultabili; i pacchetti dello shop sono separati. Controlla la licenza dell’opera.",
    },
    {
      id: "gutenberg",
      name: "Project Gutenberg",
      category: "Libri",
      language: "Multilingue",
      access: "Ebook gratuiti",
      url: "https://www.gutenberg.org/",
      about: "Letteratura in formati leggibili e scaricabili.",
      use: "Confrontare aperture, dialoghi e costruzione dei capitoli.",
      note: "Lo stato dei diritti è valutato negli Stati Uniti: verifica le condizioni pertinenti al tuo paese.",
    },
    {
      id: "wikisource",
      name: "Wikisource italiana",
      category: "Libri",
      language: "Italiano",
      access: "Testi consultabili",
      url: "https://it.wikisource.org/wiki/Pagina_principale",
      about: "Testi, trascrizioni e collegamenti alle scansioni.",
      use: "Verificare una formulazione sull’edizione di riferimento.",
      note: "Controlla edizione, stato della trascrizione e indicazioni sui diritti.",
    },
    {
      id: "gallica",
      name: "Gallica · Bibliothèque nationale de France",
      category: "Archivi",
      language: "Francese",
      access: "Collezioni digitali",
      url: "https://gallica.bnf.fr/",
      about: "Libri, stampa storica, immagini e documenti.",
      use: "Ricercare ambientazioni, oggetti e fonti d’epoca.",
      note: "Le condizioni variano secondo documento e uso; la consultazione non equivale a una licenza generale.",
    },
    {
      id: "europeana",
      name: "Europeana",
      category: "Archivi",
      language: "Multilingue",
      access: "Ricerca nelle collezioni",
      url: "https://www.europeana.eu/",
      about: "Patrimonio culturale di istituzioni europee.",
      use: "Trovare fotografie, mappe e materiali per la ricerca.",
      note: "Il materiale può essere sul sito dell’istituzione; leggi la dichiarazione dei diritti della singola scheda.",
    },
    {
      id: "internetculturale",
      name: "Internet Culturale · ICCU",
      category: "Archivi",
      language: "Italiano",
      access: "Collezioni e cataloghi",
      url: "https://www.internetculturale.it/",
      about: "Collezioni digitali e patrimonio delle biblioteche italiane.",
      use: "Ricerca documentale e bibliografica per un progetto.",
      note: "Non ogni scheda corrisponde a un libro interamente scaricabile.",
    },
    {
      id: "sbn",
      name: "OPAC SBN",
      category: "Cataloghi",
      language: "Italiano",
      access: "Catalogo gratuito",
      url: "https://opac.sbn.it/",
      about: "Catalogo collettivo del Servizio Bibliotecario Nazionale.",
      use: "Identificare edizioni e biblioteche che conservano un volume.",
      note: "È un catalogo: disponibilità e prestito dipendono dalla biblioteca.",
    },
    {
      id: "doab",
      name: "Directory of Open Access Books",
      category: "Ricerca",
      language: "Multilingue",
      access: "Libri accademici open access",
      url: "https://www.doabooks.org/",
      about: "Indice di libri accademici ad accesso aperto.",
      use: "Documentare contesto, temi e argomenti di un saggio.",
      note: "Apri il testo presso l’editore o l’archivio e controlla la licenza specifica.",
    },
    {
      id: "doaj",
      name: "Directory of Open Access Journals",
      category: "Ricerca",
      language: "Multilingue",
      access: "Riviste open access",
      url: "https://doaj.org/",
      about: "Indice di riviste e articoli di ricerca ad accesso aperto.",
      use: "Trovare studi e fonti, distinguendo risultati e opinioni.",
      note: "Il full text può trovarsi sul sito della rivista; valuta metodo e pertinenza.",
    },
    {
      id: "loc",
      name: "Library of Congress · Free to Use and Reuse",
      category: "Archivi",
      language: "Inglese",
      access: "Selezioni consultabili",
      url: "https://www.loc.gov/free-to-use/",
      about: "Selezioni tematiche di fotografie, mappe e altri materiali.",
      use: "Ricerca visiva e dettagli di ambientazione.",
      note: "Leggi le indicazioni della singola raccolta e del documento.",
    },
    {
      id: "commons",
      name: "Wikimedia Commons",
      category: "Archivi",
      language: "Multilingue",
      access: "Media con condizioni di riuso",
      url: "https://commons.wikimedia.org/wiki/Main_Page",
      about: "Immagini e altri materiali con schede e licenze.",
      use: "Studiare luoghi, oggetti e iconografia.",
      note: "Prima del riuso verifica licenza, attribuzione e condizioni di ogni file.",
    },
    {
      id: "crusca",
      name: "Accademia della Crusca",
      category: "Lingua",
      language: "Italiano",
      access: "Consulenze consultabili",
      url: "https://accademiadellacrusca.it/it/contenuti/consulenza-linguistica/6945",
      about: "Risposte a dubbi grammaticali e lessicali.",
      use: "Risolvere un dubbio puntuale e annotare il criterio scelto.",
      note: "Consulta il contesto della risposta: non ogni scelta di stile è una regola universale.",
    },
    {
      id: "treccani",
      name: "Treccani · Vocabolario",
      category: "Lingua",
      language: "Italiano",
      access: "Consultazione sul sito",
      url: "https://www.treccani.it/vocabolario/",
      about: "Vocabolario e collegamenti alle risorse linguistiche.",
      use: "Controllare significato, registro e uso di una parola.",
      note: "La scheda porta al vocabolario, non ai servizi editoriali o archivi riservati.",
    },
    {
      id: "purdue",
      name: "Purdue OWL",
      category: "Scrittura",
      language: "Inglese",
      access: "Guide consultabili",
      url: "https://owl.purdue.edu/",
      about: "Materiali didattici sul processo di scrittura.",
      use: "Ragionare su struttura, revisione e testi argomentativi.",
      note: "Le convenzioni accademiche vanno adattate al destinatario.",
    },
    {
      id: "reedsy",
      name: "Reedsy · Guide di scrittura",
      category: "Scrittura",
      language: "Inglese",
      access: "Guide sul blog",
      url: "https://reedsy.com/blog/guide/",
      about: "Guide su narrativa, revisione e proposta editoriale.",
      use: "Confrontare tecniche e costruire un criterio di lavoro.",
      note: "Le guide sono distinte dai servizi professionali a pagamento.",
    },
    {
      id: "latte",
      name: "Literature & Latte · Blog",
      category: "Scrittura",
      language: "Inglese",
      access: "Articoli consultabili",
      url: "https://www.literatureandlatte.com/blog",
      about:
        "Articoli sul lavoro dello scrittore e l’organizzazione del testo.",
      use: "Studiare strumenti e pratiche senza dover acquistare il software.",
      note: "Il blog è distinto dai prodotti commerciali.",
    },
    {
      id: "novlr",
      name: "Novlr · The Reading Room",
      category: "Scrittura",
      language: "Inglese",
      access: "Articoli consultabili",
      url: "https://www.novlr.org/the-reading-room",
      about: "Articoli su pratica, abitudini e tecniche di scrittura.",
      use: "Cercare una strategia da provare nel proprio progetto.",
      note: "Gli articoli sono distinti dai piani della piattaforma.",
    },
  ];
  const templates = [
    {
      id: "blank",
      title: "Progetto vuoto",
      genre: "Da definire",
      summary: "Una scena vuota, nessuna struttura imposta.",
      chapters: ["Capitolo 1"],
      beats: [],
    },
    {
      id: "novel",
      title: "Romanzo",
      genre: "Narrativa",
      summary: "Promessa, pressione e scelta finale come punti di lavoro.",
      chapters: ["Apertura", "Sviluppo", "Conclusione"],
      beats: [
        "Evento che rompe l’equilibrio",
        "Scelta che aumenta il costo",
        "Decisione conclusiva",
      ],
    },
    {
      id: "mystery",
      title: "Giallo / mistero",
      genre: "Giallo",
      summary: "Domanda investigativa, indizi, ipotesi ed esito.",
      chapters: ["Il problema", "Indagine e ipotesi", "Verifica e soluzione"],
      beats: [
        "Domanda investigativa",
        "Indizio interpretabile",
        "Ipotesi smentita",
        "Rivelazione preparata",
      ],
      notes:
        "Per ogni indizio annota fatto, interpretazione e quando il lettore può conoscerlo.",
    },
    {
      id: "romance",
      title: "Romance",
      genre: "Romance",
      summary:
        "Due desideri, un conflitto di relazione e una scelta reciproca.",
      chapters: [
        "Incontro",
        "Avvicinamento e conflitto",
        "Scelta della relazione",
      ],
      beats: [
        "Desideri incompatibili",
        "Vulnerabilità e avvicinamento",
        "Crisi della relazione",
        "Scelta reciproca",
      ],
      notes:
        "Distingui conflitto esterno, bisogni individuali e ciò che cambia nel rapporto.",
    },
    {
      id: "fantasy",
      title: "Fantasy",
      genre: "Fantasy",
      summary: "Una storia sostenuta da regole e costi del mondo.",
      chapters: [
        "Promessa del mondo",
        "Prova e conseguenze",
        "Scelta e trasformazione",
      ],
      beats: [
        "Regola del mondo in azione",
        "Limite o costo",
        "Conseguenza della scelta",
        "Esito coerente con le regole",
      ],
      notes: "Annota cosa è possibile, cosa non lo è e chi paga il costo.",
    },
    {
      id: "essay",
      title: "Saggio",
      genre: "Saggistica",
      summary: "Domanda, tesi, prove, obiezioni e conclusione.",
      chapters: [
        "Domanda e tesi",
        "Prove e argomenti",
        "Obiezioni e limiti",
        "Conclusione",
      ],
      beats: [
        "Domanda del lettore",
        "Tesi provvisoria",
        "Prova pertinente",
        "Obiezione rilevante",
        "Risposta e limiti",
      ],
      notes:
        "Separa fonti, interpretazioni e ipotesi. Registra i riferimenti nel quaderno di lettura.",
    },
    {
      id: "short",
      title: "Racconto",
      genre: "Racconto",
      summary: "Una situazione, una pressione e un cambiamento delimitato.",
      chapters: ["Il racconto"],
      beats: [
        "Situazione iniziale",
        "Pressione",
        "Scelta o scoperta",
        "Conseguenza",
      ],
    },
  ];
  function fromTemplate(id, title, M) {
    const t = templates.find((t) => t.id === id);
    if (!t) throw Error("Modello non valido.");
    const p = M.project(title);
    p.genre = t.genre;
    p.publisher.Genere = t.genre;
    p.chapters = t.chapters.map((title) => ({
      id: M.uid(),
      title,
      scenes: [M.makeScene("Scena da sviluppare")],
    }));
    p.beats = t.beats.map((title) => ({
      id: M.uid(),
      title,
      act: "Da collocare",
      notes: "Quale scelta o conseguenza rende necessario questo beat?",
      sceneId: "",
    }));
    if (t.notes) p.chapters[0].scenes[0].notes = t.notes;
    if (id === "fantasy")
      p.bible = [
        {
          id: M.uid(),
          type: "Regola",
          name: "Una regola del mondo",
          notes:
            "Possibilità, limite, costo e prima scena in cui viene mostrata.",
        },
      ];
    return p;
  }
  const help = {
    Premessa: [
      "Il motore della storia: chi vuole cosa, quale forza si oppone e cosa può andare perso.",
      "Una restauratrice deve consegnare una lettera, ma rivelarne il contenuto potrebbe rompere un legame familiare.",
    ],
    Tema: [
      "Una domanda di valore che le scelte mettono alla prova, non una morale da dimostrare.",
      "Conoscere la verità rende sempre più liberi?",
    ],
    Conflitto: [
      "Interessi o valori incompatibili che obbligano qualcuno a scegliere.",
      "Vuole sapere, ma vuole anche proteggere una persona.",
    ],
    "Posta in gioco": [
      "Il costo concreto del successo, del fallimento o del non agire.",
      "Perdere un rapporto, una possibilità o una convinzione.",
    ],
    "E se…?": [
      "Cambia una variabile per aprire possibilità, poi valuta le conseguenze.",
      "E se il destinatario della lettera non fosse chi tutti credono?",
    ],
    "Domanda editoriale": [
      "La domanda più importante da verificare nella prossima revisione.",
      "La decisione finale è preparata dalle scelte precedenti?",
    ],
    POV: [
      "Chi percepisce la scena e a quali informazioni può accedere.",
      "Indica il nome del focalizzatore; controlla i pensieri che non potrebbe conoscere.",
    ],
    "Sinossi della scena": [
      "Una breve sintesi del cambiamento, utile nella bacheca.",
      "Tenta di ottenere una risposta, scopre un limite e decide di agire diversamente.",
    ],
    "Svolta / conseguenza / tensione": [
      "Un beat è un cambiamento narrativo: tentativo, decisione, scoperta o conseguenza.",
      "Il personaggio cambia strategia dopo aver perso una possibilità.",
    ],
    Logline: [
      "Il conflitto centrale in poche righe; evita l’elenco dei capitoli.",
      "Protagonista + obiettivo + opposizione + costo.",
    ],
    Sinossi: [
      "Racconta la catena di scelte fino all’esito, secondo le istruzioni del destinatario.",
      "Distingui una sinossi editoriale da una presentazione promozionale senza finale.",
    ],
    Pitch: [
      "Una presentazione breve del libro e della sua promessa.",
      "Genere, esperienza di lettura e conflitto specifico.",
    ],
    Query: [
      "Una proposta adattata a un destinatario reale e alle sue istruzioni aggiornate.",
      "Presentazione del libro, informazioni pertinenti e credenziali veritiere.",
    ],
    "Comp titles": [
      "Titoli comparabili per lettore, tono o promessa; da verificare con dati reali.",
      "Annota perché il confronto è pertinente, senza promettere lo stesso successo.",
    ],
  };
  function filterResources(
    query = "",
    category = "",
    onlyFavorites = false,
    favorites = [],
  ) {
    const q = query.toLocaleLowerCase("it").trim();
    return resources.filter(
      (r) =>
        (!category || r.category === category) &&
        (!onlyFavorites || favorites.includes(r.id)) &&
        (!q ||
          (
            r.name +
            " " +
            r.about +
            " " +
            r.use +
            " " +
            r.language +
            " " +
            r.category
          )
            .toLocaleLowerCase("it")
            .includes(q)),
    );
  }
  function safeURL(value) {
    if (!value) return "";
    try {
      const u = new URL(value);
      return ["https:", "http:"].includes(u.protocol) &&
        !u.username &&
        !u.password
        ? u.href
        : "";
    } catch {
      return "";
    }
  }
  return { resources, templates, fromTemplate, help, filterResources, safeURL };
});
