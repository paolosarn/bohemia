// BOHEMIA PEOPLE — the identity layer (7/31/26, PEOPLE lane)
//
// THE HOLE THIS FILLS, in Paolo's coordinator's words (records/BOHEMIA_THE_BIG_
// MISSING_7_29_26.md, item 6): "28 scheduled bodies walk the block; none has a
// name, a face bound to a schedule, a memory, or anything to say."
//
// THE ONE DISTINCTION THE WHOLE MODULE HANGS OFF:
//   an AGENT is a BODY.     Where it is standing, what it is doing this minute.
//   a  PERSON is an IDENTITY. Who that is, forever.
// bohemia_agents.js owns the body. Nothing owned the identity, so there was
// nobody to remember. And the body is DISPOSABLE by design: the run's own
// applyBlob() throws every agent away on load and rebuilds them from the seed
// (`agentsForBlock(SEED,feet,[],fpOf)` then re-steps to the saved turn). So an
// identity STORED on an agent dies every time the player loads a save.
//   THEREFORE: identity is DERIVED, never stored. Same three numbers the body
//   is derived from — (blockSeed, house, slot) — resolve to the same person on
//   any device, on any load, forever. Persistence with nothing persisted.
//
// YOU HAVE TO ASK (Paolo 7/31, LOCKED — laws/BOHEMIA_ADDENDUM_YOU_HAVE_TO_ASK_
// 7_31_26.md). "Nobody will have a name unless you talk to them and ask them for
// their name... I hate how in other games you know everyone's name off the bat
// and I think it's complete bullshit... once you ask their name, if you see them
// again, then they would be named."
//   THIS SUPERSEDED THIS FILE'S OWN FIRST DESIGN, which shipped hours earlier
//   asserting the opposite: no names anywhere, ever, and a gate that swept this
//   module for a name bank. That was the correct read of the standing rule at the
//   time (bohemia_agents.js:24, "character names are Paolo's") and it is simply
//   not the law any more. A GATE MUST NEVER OUTRANK A RULING, so the gate was
//   rewritten in the same turn rather than the ruling being worked around.
//
// LAWS THIS OBEYS:
//   MECHANISM-MINE / CONTENTS-PAOLO'S — what the machine may do is GENERATE the
//     name a stranger gives you when asked. What it may never do is decide who
//     the STORY people are: KNOWN_AT_START ships EMPTY, LINES ships EMPTY, and
//     people_gate.js fails if either gains a row. The realistic way that breaks
//     is not malice — it is a future session adding "a couple of placeholder
//     names so it can be tested" and the placeholder becoming canon by shipping.
//   A NAME IS EARNED, NEVER GIVEN — nameOf() returns null for a stranger no
//     matter what pool exists, and headingOf() falls back to the engine's OWN
//     four role words until the player has actually asked.
//   THE RIG IS LAW / SHADOWS ARE SEPARATE — no body is defined here. A person
//     carries a lookSeed, and the lookSeed IS the agent's own seed, so the
//     walking body is byte-for-byte unchanged and the PORTRAIT moves onto the
//     body rather than the body moving onto the portrait. (See LOOK ALIGNMENT.)
//   120 BPM / I-MOVE-YOU-MOVE — no clock is read here. A card is rendered FOR a
//     turn the caller passes in; this module never asks what time it is.
//
// LOOK ALIGNMENT, and the honest version of it:
//   The alpha bakes the run's cast so that portraits.looks[i] is the face of the
//   body looks[i] — same index, one person (alpha 5731-5737). The QUEST speaker
//   was already correct: the run draws its body AND its portrait off the same
//   NPC_LOOK_SEED, so that face has always matched that body. The hole is the
//   other 28: every scheduled body already carries its own look
//   (looks[agent.seed % n], run slice 1638) and there was no portrait path to
//   them at all, because there was no way to talk to one. person.lookSeed IS
//   agent.seed, so a scheduled person's portrait lands on the body you actually
//   walked up to — the same way the quest speaker's already did.
//   AND THE BODY ITSELF WAS BROKEN, which the gate found on its first run: only
//   three of the six baked townsfolk looks could ever appear. See mix32 below —
//   that is the measurement, the root cause, and why the fix is here and not in
//   bohemia_agents.js.
//
// No render, no DOM. Runs in node (gate) and in the browser (the run).
(function (root) {
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  // ---- DETERMINISM ---------------------------------------------------------
  // The SAME mixer bohemia_agents.js uses, deliberately: a person's key must be
  // reproducible by anything holding the three numbers, including a gate that
  // never builds a sim at all.
  function hash(a, b, c) {
    var h = (a * 73856093) ^ (b * 19349663) ^ ((c || 0) * 83492791);
    h = (h ^ (h >>> 13)) >>> 0;
    return (h * 2654435761) >>> 0;
  }

  // ---- MIX32, AND THE BUG IT EXISTS TO FIX --------------------------------
  // MEASURED 7/31 ACROSS 528 BODIES ON 40 GENERATED BLOCKS: the run draws every
  // scheduled body with looks[agent.seed % 6] (RUN_LOOKS = 6 townsfolk bodies,
  // baked by the alpha) and `agent.seed % 6` COMES OUT 0, 2 OR 4. NEVER 1, 3 OR
  // 5. Half the bodies Paolo's cast bakes have never once been on screen.
  //   ROOT CAUSE, and it is a JavaScript trap rather than a typo: the agents
  //   module's hash finishes with `(h * 2654435761) >>> 0`. That multiply is
  //   float64 — h up to 4.3e9 times 2.65e9 is ~1.1e19, past the 9.0e15 where a
  //   double stops being exact — so the low ~11 bits are ROUNDED AWAY and every
  //   seed lands on a multiple of 512. Low bits dead means `% smallNumber` dead.
  //   WHAT THIS FILE DOES NOT DO: fix bohemia_agents.hash. That hash also decides
  //   which houses are occupied, how big each household is, and every schedule in
  //   the valley. Changing it reshuffles the entire population and breaks "the
  //   same cell is the same people" for every save that exists. Its low bits are
  //   never used for anything small — this was the only consumer. So the fix
  //   belongs where the small modulus is taken: HERE.
  //   Math.imul is exact 32-bit integer multiply, which is the whole point.
  function mix32(v) {
    v = v >>> 0;
    v ^= v >>> 16; v = Math.imul(v, 0x7feb352d);
    v ^= v >>> 15; v = Math.imul(v, 0x846ca68b);
    v ^= v >>> 16;
    return v >>> 0;
  }

  // ---- KNOWN AT START — EMPTY (CONTENTS-PAOLO'S) ---------------------------
  // key -> {name}. THE ONE EXCEPTION to you-have-to-ask: main-quest people and
  // backstory people, the ones "you're personally assigned to know story wise".
  // You have known them your whole life, so they are named from the first frame
  // and nobody asks their neighbour of twenty years what he is called.
  // WHO THEY ARE IS HIS. The lineman is the obvious first candidate (the run's
  // own words: "he is your neighbour, one door down, nothing closer is
  // possible") and he is NOT in here, because naming him is a ruling and not an
  // inference. people_gate fails if this table gains a row.
  var KNOWN_AT_START = {};
  var NAMED_CAST = KNOWN_AT_START;      // the old name, kept so nothing breaks

  // ---- WHAT LANGUAGE SOMEBODY SPEAKS (8/25/26, LANG-1) ---------------------
  // THEY SPEAK SPANGLISH (Paolo 8/25, LOCKED): "make them speak spanglish for
  // our game i like that. have it very poor english ro spanglish to give it
  // that flavor." laws/BOHEMIA_ADDENDUM_THEY_SPEAK_SPANGLISH_8_25_26.md.
  //
  // THE HOLE THIS FILLS: this file's own comment has said since 7/31 that Clark
  // County is "roughly 30% Hispanic or Latino" and that an all-Anglo name pool
  // "would be a lie about Las Vegas" -- and that finding reached exactly ONE
  // system, the surname pool. The proof character this lane shipped is RUBEN
  // NGUYEN, and Ruben Nguyen spoke flawless monolingual English, because every
  // single person in this build did.
  //
  // THREE REGISTERS, AND KEEPING THEM APART IS THE WHOLE CRAFT. Register 2 is a
  // SKILL and register 3 is a GAP: intra-sentential code-switching is what
  // PROFICIENT bilinguals do, and the syntactic "violations" in the literature
  // "were not due to limited bilingual competence." Writing everybody as
  // register 3 would be bad linguistics AND an insult to a third of the county.
  var LANG = {
    en:        { key: 'en',        card: 'ENGLISH',               short: 'EN' },
    spanglish: { key: 'spanglish', card: 'ENGLISH AND SPANISH',   short: 'EN/ES' },
    es:        { key: 'es',        card: 'SPANISH, SOME ENGLISH', short: 'ES' }
  };
  var LANG_ORDER = ['en', 'spanglish', 'es'];

  /* THE VALLEY'S REAL NUMBERS, AND THE ARITHMETIC IN THE OPEN so the next
     session can check it instead of trusting it. Per 1000 people.
       418,475   Clark County residents 5+ who speak Spanish at home (ACS)
       2,265,461 Clark County population (2020 census)
       -> 18.5% of the valley speaks Spanish at home
       45%       of those speak English less than "very well" (ACS 2009-2013)
       The ACS scale is very well / well / not well / not at all. Register 3 is
       the "not well / not at all" end, roughly half of that 45% in published
       breakdowns. THAT HALF IS MY ESTIMATE AND IS SAID OUT LOUD RATHER THAN
       BURIED: 45% x ~50% = ~22% of Spanish speakers.
       -> es 18.5 x 0.22 = 4.1%   spanglish 18.5 - 4.1 = 14.4%   en 81.5% */
  /* *** DIALLED DOWN 8/26 ON HIS RULING (LOCKED). *** "it will be proportional
     to vegas demographics and maybe slightly less but yeah man."
     What shipped 8/25 was proportional ON THE NOSE: 18.5%, the county's real
     share. He capped it. 15.0% is 81% of the real number, which is this build's
     reading of "maybe slightly less", and the reading is written down in the law
     so the next session corrects THAT rather than guessing at this constant.
     PROPORTIONAL IS THE CEILING NOW, NOT THE TARGET, and language_gate holds it.
     Law: laws/BOHEMIA_ADDENDUM_ENOUGH_IS_ENOUGH_ON_THE_SPANISH_8_26_26.md */
  var COUNTY_SPANISH = 185;        // per 1000, measured: 418,475 of 2,265,461
  var VALLEY_MIX = { en: 850, spanglish: 118, es: 32 };

  /* AND IT CLUSTERS, WHICH IS THE PART THAT MAKES IT A MECHANIC INSTEAD OF A
     SPRINKLE. 139 CENSUS TRACTS in Clark County are places where more than 10%
     of households contain nobody over 14 who speaks English only or speaks it
     "very well" (Clark County Elections' own minority-language page, which
     exists because federal law forces bilingual ballots here). Clark County has
     roughly 500 tracts, so about 28% of this valley is that kind of ground.
     Our valley is built out of cells. A correct Las Vegas has WHOLE BLOCKS
     where the language on the street is not the language on the phone.
       A tract that clears a 10%-of-HOUSEHOLDS limited-English bar is not 10%
       Spanish-speaking, it is typically half to two thirds. 53% here.
     THE TWO MIXES AVERAGE BACK TO THE COUNTY. 0.278 x BARRIO + 0.722 x REST
     lands on VALLEY_MIX to the nearest tenth of a percent, which is what
     language_gate claim B measures -- so the clustering costs the valley
     nothing in accuracy and buys it every neighbourhood. */
  var BARRIO_SHARE = 278;                                 // per 1000 blocks
  var BARRIO_MIX = { en: 565, spanglish: 330, es: 105 };
  var REST_MIX   = { en: 960, spanglish:  36, es:   4 };

  /* WHICH KIND OF BLOCK THIS IS. Derived from the block seed alone, so every
     person on a street agrees about the street without anybody storing it. */
  function blockMixOf(blockSeed) {
    return (mix32((blockSeed >>> 0) ^ 0x27d4eb2f) % 1000) < BARRIO_SHARE ? BARRIO_MIX : REST_MIX;
  }

  /* WHAT THEY SPEAK. A THIRD INDEPENDENT STREAM off the identity key, exactly
     like the two the name uses, so language does not travel with a first name
     and every Marisol is not the same person. Derived, never stored: the same
     three numbers resolve to the same register on any device, forever. */
  function langOf(blockSeed, key) {
    var h = 0, i;
    for (i = 0; i < String(key || '').length; i++) h = (Math.imul(h, 31) + String(key).charCodeAt(i)) >>> 0;
    var mix = blockMixOf(blockSeed);
    var r = mix32(h ^ 0x5bf03635) % 1000, acc = 0;
    for (i = 0; i < LANG_ORDER.length; i++) {
      acc += mix[LANG_ORDER[i]] || 0;
      if (r < acc) return LANG_ORDER[i];
    }
    return 'en';
  }

  /* ---- THE CLOSED SET OF SPANISH WORDS THIS GAME MAY SAY -------------------
     Word -> what it means in English. GENERATED, not hand-kept:
     tools/bohemia_bark_factory.py writes exactly the words that appear in the
     lines it ships, so the lexicon can never drift from the mouth.
     IT IS THE HARD RULE MADE MACHINE-CHECKABLE. "LANGUAGE NEVER GATES REQUIRED
     INFORMATION" is not a promise you can keep by being careful; it is a claim
     something has to be able to fail. Because the set is closed and declared,
     gates/language_gate.js can sweep every objective, every resolution button
     and every job offer in the build and prove not one of them contains a word
     from it. Sleeping Dogs is the precedent in both directions, and the
     localisation research names the real cost: a player who is not sure what to
     do next. That bug cannot reach this build without turning a claim red.
     DO NOT HAND-EDIT: re-run the factory. */
  var ES_LEX = {
  "abuela": "grandmother",
  "acordaste": "you remembered",
  "acuerdo": "I remember, in \"me acuerdo\"",
  "agua": "water",
  "ahorita": "right now, or soon, or never",
  "ahí": "there",
  "al": "to the",
  "alguien": "somebody",
  "alguna": "some",
  "allí": "there",
  "ambos": "both",
  "amá": "mom",
  "antes": "before",
  "apaga": "turn it off",
  "aprendo": "I learn",
  "apurado": "in a hurry",
  "aquí": "here",
  "así": "like that",
  "ay": "oh",
  "ayúdame": "help me",
  "bendito": "blessed",
  "bien": "fine, well",
  "bloque": "block",
  "bueno": "well, or good",
  "buscas": "are you looking for",
  "cabrón": "bastard",
  "calle": "street",
  "calor": "heat",
  "camino": "the road",
  "carnal": "brother, close friend",
  "casi": "almost",
  "cena": "dinner",
  "cerrado": "closed",
  "chamba": "work, a job",
  "chingado": "damn",
  "ciento": "a hundred",
  "cierra": "close",
  "cinco": "five",
  "claro": "of course",
  "cobre": "copper",
  "comadre": "a close woman friend, godmother to your kids",
  "comer": "to eat",
  "comida": "the food",
  "comiste": "did you eat",
  "compa": "buddy",
  "compraron": "they bought",
  "con": "with",
  "conozco": "I know",
  "contando": "counting",
  "cosa": "thing",
  "cree": "thinks",
  "creo": "I think",
  "cualquier": "any",
  "cuando": "when",
  "cuarenta": "forty",
  "cuenta": "count",
  "cuidado": "careful",
  "cuándo": "when",
  "cómo": "how",
  "da": "gives, in \"me da igual\"",
  "de": "of",
  "decidido": "decided",
  "decir": "to say",
  "deja": "stop, quit",
  "delante": "in front of",
  "demás": "the rest",
  "después": "after, afterwards",
  "di": "I gave, in \"me di cuenta\"",
  "diciendo": "saying",
  "diez": "ten",
  "digas": "tell, in \"no me digas\"",
  "digo": "I say",
  "dijeron": "they said",
  "dinero": "money",
  "dios": "god",
  "dos": "two",
  "doy": "I give",
  "día": "day",
  "el": "the",
  "ella": "she",
  "empiezo": "I start",
  "en": "in, on",
  "entero": "whole",
  "entonces": "then",
  "entres": "go in",
  "equal": "even, square",
  "equivoco": "get it wrong",
  "era": "it was",
  "es": "is",
  "esa": "that",
  "escondiste": "you hid it",
  "eso": "that",
  "espérate": "hold on",
  "esquina": "the corner",
  "esta": "this",
  "estaba": "I was",
  "estado": "been",
  "estamos": "we are",
  "esto": "this",
  "estoy": "I am",
  "está": "is",
  "están": "they are",
  "estás": "you are",
  "familia": "family",
  "feo": "ugly, bad",
  "flojo": "loose, slack",
  "foto": "a photo",
  "frío": "cold",
  "fue": "it was",
  "funciona": "it works",
  "gente": "people",
  "gracias": "thank you",
  "gusta": "like, in \"no me gusta\"",
  "güey": "dude",
  "ha": "has",
  "hace": "makes",
  "hambre": "hunger",
  "hasta": "until",
  "hay": "there is",
  "hermano": "brother",
  "hija": "daughter",
  "hijo": "son",
  "hombre": "man",
  "hora": "the hour",
  "igual": "the same",
  "invierno": "winter",
  "ironía": "irony",
  "la": "the",
  "las": "the",
  "llave": "the tap, the faucet",
  "llegamos": "we arrived",
  "llegó": "it arrived",
  "lluvia": "rain",
  "lo": "the, it",
  "los": "the",
  "luz": "the light, the power",
  "madre": "mother",
  "mamá": "mom",
  "mano": "brother, short for hermano",
  "martes": "Tuesday",
  "mayoría": "most of them",
  "mañana": "tomorrow, or the morning",
  "me": "me",
  "medidor": "the meter",
  "medio": "half",
  "mi": "my",
  "mientas": "lie to me, in \"no me mientas\"",
  "mija": "my daughter, said to anyone younger",
  "mijo": "my son, said to anyone younger",
  "mira": "look",
  "mires": "look, in \"no me mires\"",
  "misma": "same",
  "mismas": "same",
  "mismo": "same, right",
  "mucho": "a lot",
  "mundo": "world, in \"todo el mundo\", everybody",
  "más": "more",
  "mí": "me",
  "nada": "nothing",
  "nadie": "nobody",
  "niños": "the kids",
  "no": "no",
  "noche": "night",
  "nomás": "just, only",
  "nos": "us",
  "nosotros": "us",
  "nuevo": "new, in \"de nuevo\", again",
  "nunca": "never",
  "o": "or",
  "ocho": "eight",
  "ofender": "to offend",
  "oigo": "I hear",
  "ojalá": "God willing, hopefully",
  "olvida": "forget",
  "oscuridad": "the dark",
  "otra": "other, another",
  "oye": "hey, listen",
  "oí": "I heard",
  "oído": "heard",
  "paga": "pays",
  "palabra": "a word",
  "para": "for",
  "pares": "stop, in \"no te pares\"",
  "pasada": "last, past",
  "pensé": "I thought",
  "peor": "the worst",
  "perdió": "it lost",
  "perdón": "sorry",
  "pero": "but",
  "persona": "person",
  "poco": "a little",
  "por": "for",
  "porque": "because",
  "precio": "a price",
  "pregunta": "ask",
  "preguntas": "you ask",
  "preguntes": "ask, in \"no preguntes\"",
  "pregúntame": "ask me",
  "primero": "first",
  "primo": "cousin",
  "probaste": "you proved it",
  "puedas": "you can",
  "puede": "can",
  "puedo": "I can",
  "puerta": "the door",
  "puertas": "the doors",
  "pues": "well",
  "puse": "I put",
  "puso": "it turned",
  "pájaro": "a bird",
  "que": "that",
  "quedarse": "to stay",
  "quién": "who",
  "qué": "what",
  "raro": "rare, odd",
  "rato": "a while",
  "regla": "a rule",
  "revés": "backwards, in \"al revés\"",
  "sabes": "you know",
  "sabrás": "you will know",
  "saca": "put out, take out",
  "se": "itself, in \"no se me olvida\"",
  "sea": "whatever it is, in \"lo que sea\"",
  "segunda": "second",
  "seguramente": "probably",
  "seis": "six",
  "semana": "the week",
  "serio": "serious, in \"en serio\"",
  "si": "if",
  "siempre": "always",
  "sigue": "keep going",
  "sin": "without",
  "siéntate": "sit down",
  "sol": "the sun",
  "son": "they are",
  "suerte": "luck",
  "sé": "I know",
  "sí": "yes",
  "también": "also",
  "tampoco": "either, neither",
  "tarde": "late, or the afternoon",
  "te": "you",
  "tengo": "I have",
  "tenía": "I had",
  "tenías": "you had",
  "ti": "you",
  "tienes": "you have",
  "toca": "is my turn, in \"me toca\"",
  "todavía": "still",
  "todo": "everything",
  "todos": "everybody",
  "trabajo": "I work, or work",
  "traes": "you bring, you carry",
  "traigo": "I bring",
  "tu": "your",
  "turno": "the shift",
  "tuyo": "yours",
  "tía": "aunt",
  "tío": "uncle",
  "tú": "you",
  "una": "a, one",
  "vamos": "we go, let us go",
  "ven": "come",
  "vendo": "I sell",
  "veo": "I see",
  "verdad": "true, the truth",
  "vez": "a time, once",
  "viaja": "it travels",
  "viejo": "old man",
  "voy": "I am going",
  "vuelves": "you come back",
  "vuelvo": "I come back",
  "y": "and",
  "ya": "already, or enough",
  "yo": "I",
  "ándale": "go on",
  "único": "the only one"
};
  /* THE HALF OF THE LEXICON THAT CANNOT BE MISTAKEN FOR ENGLISH.
     Derived by the factory against this game's own English corpus, never
     hand-picked: "no", "son", "me" and "ya" are words in both languages, and a
     sweep that flagged them would go red on every English objective in the
     build. THIS is the list language_gate claim C sweeps the required-
     information surfaces with. DO NOT HAND-EDIT: re-run the factory. */
  var ES_ONLY = ["abuela", "acordaste", "acuerdo", "agua", "ahorita", "ahí", "al", "alguien", "alguna", "allí", "ambos", "amá", "antes", "apaga", "aprendo", "apurado", "aquí", "así", "ay", "ayúdame", "bendito", "bien", "bloque", "bueno", "buscas", "cabrón", "calle", "calor", "camino", "carnal", "casi", "cena", "cerrado", "chamba", "chingado", "ciento", "cierra", "cinco", "claro", "cobre", "comadre", "comer", "comida", "comiste", "compa", "compraron", "con", "conozco", "contando", "cosa", "cree", "creo", "cualquier", "cuando", "cuarenta", "cuenta", "cuidado", "cuándo", "cómo", "da", "de", "decidido", "decir", "deja", "delante", "demás", "después", "di", "diciendo", "diez", "digas", "digo", "dijeron", "dinero", "dios", "dos", "doy", "día", "el", "ella", "empiezo", "en", "entero", "entonces", "entres", "equal", "equivoco", "era", "es", "esa", "escondiste", "eso", "espérate", "esquina", "esta", "estaba", "estado", "estamos", "esto", "estoy", "está", "están", "estás", "familia", "feo", "flojo", "foto", "frío", "fue", "funciona", "gente", "gracias", "gusta", "güey", "ha", "hace", "hambre", "hasta", "hay", "hermano", "hija", "hijo", "hombre", "hora", "igual", "invierno", "ironía", "la", "las", "llave", "llegamos", "llegó", "lluvia", "lo", "los", "luz", "madre", "mamá", "mano", "martes", "mayoría", "mañana", "medidor", "medio", "mi", "mientas", "mija", "mijo", "mira", "mires", "misma", "mismas", "mismo", "mucho", "mundo", "más", "mí", "nada", "nadie", "niños", "noche", "nomás", "nos", "nosotros", "nuevo", "nunca", "o", "ocho", "ofender", "oigo", "ojalá", "olvida", "oscuridad", "otra", "oye", "oí", "oído", "paga", "palabra", "para", "pares", "pasada", "pensé", "peor", "perdió", "perdón", "pero", "persona", "poco", "por", "porque", "precio", "pregunta", "preguntas", "preguntes", "pregúntame", "primero", "primo", "probaste", "puedas", "puede", "puedo", "puerta", "puertas", "pues", "puse", "puso", "pájaro", "que", "quedarse", "quién", "qué", "raro", "rato", "regla", "revés", "sabes", "sabrás", "saca", "se", "sea", "segunda", "seguramente", "seis", "semana", "serio", "si", "siempre", "sigue", "sin", "siéntate", "sol", "suerte", "sé", "sí", "también", "tampoco", "tarde", "te", "tengo", "tenía", "tenías", "ti", "tienes", "toca", "todavía", "todo", "todos", "trabajo", "traes", "traigo", "tu", "turno", "tuyo", "tía", "tío", "tú", "una", "vamos", "ven", "vendo", "veo", "verdad", "vez", "viaja", "viejo", "voy", "vuelves", "vuelvo", "y", "ya", "yo", "ándale", "único"];
  /* WHAT MAY FOLLOW AN APOSTROPHE AND STILL LEAVE A WORD BEHIND. ONE LIST,
     shipped from the factory, read by esWordsIn below and by the gate through
     it -- never re-typed into a second regex somewhere. */
  var ES_CLITIC = ["s", "t", "re", "ve", "ll", "d", "m"];
  /* ONE TOKEN, EVERY FORM WORTH LOOKING UP -- and this is the THIRD time this
     lane has paid for two copies of one rule. The Python side learned that a
     LEADING apostrophe is a quote mark and not a clitic ("'He turn." opens a
     spoken line), fixed it there, and the gate's own tokenizer went red on the
     very same two lines because the rule had not travelled. It lives HERE now
     and everything that needs it calls it: esWordsIn below, and the gate. */
  function esStems(word) {
    var w = String(word == null ? "" : word).toLowerCase();
    while (w.charAt(0) === "'") w = w.slice(1);
    if (!w) return [];
    var out = [w], ap = w.indexOf("'");
    if (ap > 0 && ES_CLITIC.indexOf(w.slice(ap + 1)) >= 0) out.push(w.slice(0, ap));
    return out;
  }
  /* ONE TOKEN, EVERY FORM WORTH LOOKING UP -- and this is the THIRD time this
     lane has paid for two copies of one rule. The Python side learned that a
     LEADING apostrophe is a quote mark and not a clitic ("'He turn." opens a
     spoken line), fixed it there, and the gate's own tokenizer went red on the
     very same two lines because the rule had not travelled. It lives HERE now
     and everything that needs it calls it: esWordsIn below, and the gate. */
  function esStems(word) {
    var w = String(word == null ? "" : word).toLowerCase();
    while (w.charAt(0) === "'") w = w.slice(1);
    if (!w) return [];
    var out = [w], ap = w.indexOf("'");
    if (ap > 0 && ES_CLITIC.indexOf(w.slice(ap + 1)) >= 0) out.push(w.slice(0, ap));
    return out;
  }
  /* ONE TOKEN, EVERY FORM WORTH LOOKING UP -- and this is the THIRD time this
     lane has paid for two copies of one rule. The Python side learned that a
     LEADING apostrophe is a quote mark and not a clitic ("'He turn." opens a
     spoken line), fixed it there, and the gate's own tokenizer went red on the
     very same two lines because the rule had not travelled. It lives HERE now
     and everything that needs it calls it: esWordsIn below, and the gate. */
  function esStems(word) {
    var w = String(word == null ? "" : word).toLowerCase();
    while (w.charAt(0) === "'") w = w.slice(1);
    if (!w) return [];
    var out = [w], ap = w.indexOf("'");
    if (ap > 0 && ES_CLITIC.indexOf(w.slice(ap + 1)) >= 0) out.push(w.slice(0, ap));
    return out;
  }

  /* WHICH SPANISH WORDS A STRING CONTAINS -- ONE IMPLEMENTATION, FOR EVERYBODY.
     gates/language_gate.js calls THIS to sweep the objectives, the resolution
     buttons and the phone's job offers rather than carrying its own regex, and
     that is deliberate: this lane has now twice shipped a bug whose whole cause
     was two copies of one rule quietly disagreeing (two tab switchers with one
     routing rule; a generator and its output). A checker that re-types the rule
     it is checking is the same shape.
     Returns the words as written, so a failure names what it found. */
  function esWordsIn(text) {
    var only = {}, i, out = [];
    for (i = 0; i < ES_ONLY.length; i++) only[ES_ONLY[i]] = 1;
    var m, re = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ']+/g, s = String(text == null ? '' : text);
    while ((m = re.exec(s))) {
      var forms = esStems(m[0]);
      for (var f = 0; f < forms.length; f++) {
        if (only[forms[f]]) { out.push(m[0]); break; }
      }
    }
    return out;
  }

  // ---- THE POOL A STRANGER ANSWERS FROM ------------------------------------
  // MECHANISM-MINE: the machine may generate the name somebody TELLS you when you
  // ask. It may never decide who the story people are (that is KNOWN_AT_START,
  // above, and it is empty).
  //
  // GROUNDED IN THE REAL, because everything in Bohemia is. This valley is the
  // corpse of Clark County, Nevada, and Clark County is roughly 30% Hispanic or
  // Latino, ~12% Black, ~10% Asian and Pacific Islander. A name pool that is all
  // Anglo would be a lie about the city the game is set in, and the die-off was
  // not selective. So: real US given-name and surname frequency, weighted the way
  // the county actually is, spread across the cohorts alive ten years after the
  // crash (TEN YEARS COLD, 7/31) rather than one fashionable year.
  // NO CALENDAR YEAR IS ASSUMED — the game has never locked one, and a
  // cohort-by-birth-year generator would be inventing canon to do arithmetic on.
  //
  // THE POOL IS REPLACEABLE. Paolo can swap either list wholesale and nothing
  // else changes; the MECHANIC is his ruling, the strings are just strings.
  var GIVEN = [
    'Marisol', 'Dante', 'Rosa', 'Terrence', 'Imelda', 'Kwame', 'Lupe', 'Silas',
    'Nayeli', 'Ambrose', 'Thuy', 'Odell', 'Consuelo', 'Bishop', 'Priya', 'Ezekiel',
    'Araceli', 'Booker', 'Guadalupe', 'Casimir', 'Linh', 'Delroy', 'Paloma', 'Otis',
    'Xiomara', 'Ignacio', 'Yolanda', 'Amaury', 'Perla', 'Rashad', 'Estella', 'Hoang',
    'Juniper', 'Malachi', 'Socorro', 'Everett', 'Anahi', 'Tobias', 'Renata', 'Cyrus',
    'Marisela', 'Jonah', 'Adaeze', 'Wendell', 'Citlali', 'Amos', 'Nadia', 'Ruben',
    'Ofelia', 'Kai', 'Belen', 'Horace', 'Sunny', 'Idalia', 'Emmett', 'Reyna',
    'Abel', 'Lourdes', 'Milo', 'Trinh', 'Esperanza', 'Roman', 'Clemencia', 'Jarvis'
  ];
  var SURNAME = [
    'Rivera', 'Okonkwo', 'Vasquez', 'Whitfield', 'Nguyen', 'Delgado', 'Boone', 'Salcedo',
    'Pham', 'Ellison', 'Carrasco', 'Mayfield', 'Ibarra', 'Prieto', 'Salazar', 'Dorsey',
    'Munoz', 'Kimura', 'Escobar', 'Hollis', 'Trejo', 'Amadi', 'Zamora', 'Kirkland',
    'Barajas', 'Whitaker', 'Cordova', 'Reyes', 'Ocampo', 'Sandoval', 'Fontenot', 'Duong',
    'Aguirre', 'Beaumont', 'Mercado', 'Chavarria', 'Adeyemi', 'Portillo', 'Vue', 'Serrano',
    'Quintero', 'Rutledge', 'Galvan', 'Osei', 'Villalobos', 'Sepulveda', 'Marchetti', 'Tran',
    'Arroyo', 'Bramble', 'Cisneros', 'Nakamura', 'Peralta', 'Wexler', 'Bonilla', 'Aguilar',
    'Castellanos', 'Odom', 'Lozano', 'Truong', 'Betancourt', 'Grady', 'Mireles', 'Achebe'
  ];

  // ---- THE LINES TABLE -- FILLED 8/12 (tools/bohemia_bark_factory.py)
  // Paolo 8/12: "generate text for now with our quest catalog we have."
  // It shipped EMPTY with a comment saying nothing may fill it but him. That
  // comment predates ALWAYS MAKE AN ATTEMPT (8/11), which overturned exactly
  // that reading for WORDS -- his own diagnosis of the empty field was "THATS
  // WHY I HAVENT DONE QUESTS YET". Every one of these is a draft he can retype
  // in the WORDS tab, and every bucket cites the questbook findings it was
  // written off (Q043.W4 names ambient banter as the best return a solo dev
  // has). STILL HIS AND STILL EMPTY: KNOWN_AT_START and NAMED_CAST -- who
  // anybody IS remains a decision, and none is made here.
  // DO NOT HAND-EDIT: re-run the factory.
  var LINES = {
  "faction:Anarchists": [
    "Nobody's in charge here and that's on purpose.",
    "You need a permit? From who? Say the name out loud.",
    "We fixed it ourselves and we'll fix it again.",
    "We're not disorganised. We're just not YOURS."
  ],
  "faction:Blues": [
    "We voted. You weren't there, and it still counts.",
    "The well is everybody's or it's nobody's, pick.",
    "Slow's not the same as wrong.",
    "Plant it now and somebody eats in ninety days. That's the whole argument.",
    "Nobody starves on my watch and nobody eats twice either."
  ],
  "faction:Caravans": [
    "Six days out, six days back, and the road changes both times.",
    "Prices are what the road says they are.",
    "There's a town north that still has a working sign. A SIGN.",
    "Two weeks of road and the best thing I saw was a bird."
  ],
  "faction:Caravans@es": [
    "Six day go. Six day come. The road change two time.",
    "The road say the price. Not me.",
    "Two week on the road. Best thing I see is a bird."
  ],
  "faction:Caravans@spanglish": [
    "Six days out, six days back, y the road changes both times.",
    "Prices are what el camino says they are.",
    "Two weeks of road and the best thing I saw was un pájaro."
  ],
  "faction:Cartel": [
    "You want it, there's a price. You don't want it, walk on.",
    "Nobody made you come down here.",
    "Everything's available. Availability isn't the expensive part."
  ],
  "faction:Cartel@es": [
    "You want, is a price. You not want, you walk.",
    "Nobody make you come here."
  ],
  "faction:Cartel@spanglish": [
    "You want it, hay un precio. You don't want it, walk on.",
    "Nadie made you come down here."
  ],
  "faction:Church": [
    "Doors are open. They're always open, that's the point.",
    "Come eat. Sit through the words first if you can stand them.",
    "Nobody's turned away. Nobody's turned away twice, either.",
    "Bring who you like. Bring who you don't like, especially."
  ],
  "faction:Church@es": [
    "The door is open. Always open. Is the point.",
    "Come eat. First the words. If you can.",
    "Nobody go away. Nobody go away two time also."
  ],
  "faction:Church@spanglish": [
    "Las puertas are open. They're always open, that's the point.",
    "Ven a comer. Sit through the words first if you can stand them.",
    "Nobody's turned away. Nobody's turned away twice, tampoco."
  ],
  "faction:Colorful": [
    "You should have seen this place at night. You still should."
  ],
  "faction:Homeless": [
    "Got a spot out of the sun if you need one. Costs nothing.",
    "Everybody here's from somewhere. Ask sometime.",
    "I've slept in better and I've slept in worse and I'm still here."
  ],
  "faction:Homeless@es": [
    "I have a place out of the sun. Cost nothing.",
    "Everybody here is from some place. Ask one day."
  ],
  "faction:Homeless@spanglish": [
    "Got a spot out of el sol if you need one. Costs nothing.",
    "Everybody here's from somewhere. Pregunta sometime."
  ],
  "faction:La Familia": [
    "Family eats first. Everybody's family somewhere."
  ],
  "faction:La Familia@es": [
    "Family eat first. Everybody is family from some place.",
    "You sit at the table. Now you are ours."
  ],
  "faction:La Familia@spanglish": [
    "La familia eats first. Everybody's family somewhere.",
    "You sat at the table, so you're ours now. Así de simple."
  ],
  "faction:Mob": [
    "The house always has a floor and you're standing on it.",
    "Talk to me like I'm the last friendly face and you'll do fine.",
    "I've known this block since before it was worth knowing."
  ],
  "faction:Network": [
    "It's already handled. It was handled before you asked.",
    "Everything works here. You noticed that.",
    "We don't disagree about it. There's nothing to disagree about.",
    "The lights stay on. That's all anybody actually wants.",
    "You'll find it's simpler than you were expecting.",
    "Nobody complains here. Ask around."
  ],
  "faction:Panthers": [
    "This block looks after this block."
  ],
  "faction:Pures": [
    "We keep to what we know. It's kept us this long."
  ],
  "faction:Reds": [
    "Everything's a loan. The only question is who's holding it.",
    "I'll front you. You'll pay it back with interest and a smile.",
    "Ten percent isn't greed, it's the reason there's anything to lend.",
    "We keep the books because somebody has to keep the books.",
    "Everybody says they hate the ledger till they need the ledger."
  ],
  "faction:Remnants": [
    "This was a real city. I don't mean big. I mean real.",
    "We kept the records. Somebody's going to want them.",
    "Somebody has to remember what the street names were."
  ],
  "faction:Trades": [
    "I can fix it. I can't fix it for free.",
    "Bring the part or bring the hours, either way it's the same to me.",
    "Whoever built this knew what they were doing. Whoever touched it after didn't.",
    "Everything in this valley was built by somebody who's still alive."
  ],
  "faction:Trades@es": [
    "I fix it. Not for free.",
    "Bring the part, or bring the hour. Same to me.",
    "The one who build this, he know. The one who touch after, no."
  ],
  "faction:Trades@spanglish": [
    "I can fix it. No puedo fix it for free.",
    "Bring the part or bring the hours, me da igual.",
    "Whoever built this knew what they were doing. Whoever touched it after, no."
  ],
  "faction:Triads": [
    "Terms first. Then the handshake."
  ],
  "faction:Volunteers": [
    "You're bleeding. Sit down, we'll argue about it after.",
    "We don't ask who you run with. We ask where it hurts.",
    "We're out of almost everything except being here."
  ],
  "keeper:errand": [
    "Two blocks, three promises, one of them's real.",
    "If I'm not back by dark, the list is on the table.",
    "I'm collecting, not visiting. Don't put the kettle on."
  ],
  "keeper:errand@es": [
    "One hour close. Everybody see it.",
    "I go, I come back. Touch nothing."
  ],
  "keeper:errand@spanglish": [
    "I close for one hour y everybody notices.",
    "Voy y vuelvo. Don't touch anything."
  ],
  "keeper:free": [
    "Sit. You look like a man about to ask me for something.",
    "It ran better when fewer people knew it existed.",
    "Everybody's a good neighbour on a full stomach.",
    "Ask me tomorrow when I'm not counting.",
    "I've buried people who were owed more than you."
  ],
  "keeper:free@es": [
    "I hear all. I repeat almost nothing.",
    "Here everybody owe everybody. Is how it work.",
    "You want know who is short? Look what they buy.",
    "Twenty year, same corner. You learn."
  ],
  "keeper:free@spanglish": [
    "I hear everything and I repeat casi nothing.",
    "Everybody on this block owes everybody. Así funciona.",
    "You want to know who's short this week? Ask me qué compraron.",
    "I'm not gossiping, I'm keeping track.",
    "Twenty years en la misma esquina. You learn things."
  ],
  "keeper:home": [
    "Wipe your feet, this is somebody's house.",
    "I keep a list. Everybody on this block is on the list.",
    "You eat here you help here, that's it, that's the whole rule.",
    "If it leaks, tell me. Don't fix it, tell me.",
    "There's water till Thursday. After Thursday there's a conversation.",
    "I know who's short and I know who's lying about being short.",
    "You're welcome here. You're not welcome to everything here.",
    "Take your shoes off and take your side of it off too."
  ],
  "keeper:home@es": [
    "I feed the block today. Now I feed you.",
    "Sit. The food not go anywhere.",
    "In this house nobody sleep hungry. Is the rule.",
    "My mother do it this way. She is right."
  ],
  "keeper:home@spanglish": [
    "I fed half the block today y I still have to feed you.",
    "Sit down. La comida's not going anywhere.",
    "Nobody in this house goes to sleep con hambre, that's it, that's the rule.",
    "Your abuela did it this way and she was right."
  ],
  "keeper:scav": [
    "I don't like doing this. I like eating."
  ],
  "keeper:scav@es": [
    "Even me, I look. Is no other way."
  ],
  "keeper:scav@spanglish": [
    "Even I go looking. No hay de otra."
  ],
  "keeper:sleep": [
    "...",
    "It'll keep till morning. Everything keeps till morning."
  ],
  "keeper:sleep@es": [
    "...",
    "Close. Come back six."
  ],
  "keeper:sleep@spanglish": [
    "...",
    "Cerrado. Come back at six."
  ],
  "keeper:watch": [
    "I'd rather be the one awake than the one wondering.",
    "Nothing gets past this porch without saying hello."
  ],
  "keeper:watch@es": [
    "I know every face here. You, not yet.",
    "Nothing move out there. I see it two time."
  ],
  "keeper:watch@spanglish": [
    "I know every face on this street. Tú I don't know yet.",
    "Nothing moves out there that I don't see twice."
  ],
  "keeper:work": [
    "Count it in front of me, not after.",
    "One family, one share. I don't care how loud you are.",
    "The book says what the book says.",
    "You want more, bring more. That's not cruelty, that's arithmetic.",
    "I'll hear it, but I'll hear it after.",
    "I'll write you down for Thursday. Don't make me chase you Thursday.",
    "Everybody thinks they're the exception. Nobody's the exception.",
    "It's not mine. I just hold the key to it."
  ],
  "keeper:work@es": [
    "Everything have price. And a story. Only one is free.",
    "Now, or cheap. Not both.",
    "I open when I open. Ask anybody.",
    "Count in front of me. Please.",
    "Is the last one. Until road open."
  ],
  "keeper:work@spanglish": [
    "Everything on this shelf has a price y a story, and only one is free.",
    "You want it now or you want it cheap? No los dos.",
    "I open when I open. Ask the block, todos know.",
    "Count it in front of me. Por favor.",
    "That's the last one till the road opens.",
    "Traigo lo que puedo. What I can't, somebody else brings."
  ],
  "scav:errand": [
    "Dropping this off then I'm done, I mean it.",
    "They asked for glass. I brought glass.",
    "Two more streets and then I'm somebody's problem, not mine."
  ],
  "scav:errand@es": [
    "Two more door. Then we go.",
    "He say he come. He say.",
    "I not carry this. You carry."
  ],
  "scav:errand@spanglish": [
    "Two more doors y nos vamos.",
    "He said he'd be here. Pues, he said.",
    "I'm not carrying that. Tú carry that."
  ],
  "scav:free": [
    "I got two batteries and a story.",
    "Trade you. Don't ask what for.",
    "I found a whole box of forks. FORKS.",
    "Everything out there's either bolted down or already somebody's.",
    "I'd trade the whole bag for a working fridge and I mean it.",
    "You want to know what's out there? Sand and other people's kitchens."
  ],
  "scav:free@es": [
    "Best thing I find? A photo. I keep it.",
    "You go where nobody go yet. Is all.",
    "My uncle do this before. He call it a job.",
    "Everything good is behind something heavy."
  ],
  "scav:free@spanglish": [
    "Best thing I ever pulled out of a house? Una foto. Kept it.",
    "You go where nobody's hungry enough to have gone yet.",
    "My tío did this before the crash and called it a job.",
    "Everything worth having is behind something heavy.",
    "Ask me in a year if it's still worth it. Pregúntame in a year."
  ],
  "scav:home": [
    "It's not much. It's what there was.",
    "Don't tell your mother where I got it.",
    "I'll go further out tomorrow. It's fine.",
    "I'll clean it. It works, it's just ugly.",
    "Nothing today. There's always tomorrow, there's just not always today."
  ],
  "scav:home@es": [
    "No ask where. Only eat.",
    "Today nothing. I tell you first.",
    "Wash the hand. Really wash.",
    "Put under bed, with the other."
  ],
  "scav:home@spanglish": [
    "Don't ask where it came from, mijo. Eat.",
    "I brought back nada today and I'm telling you first.",
    "Wash your hands. En serio, wash them.",
    "Put it under the bed con lo demás."
  ],
  "scav:scav": [
    "Anything with a serial number on it, somebody wants.",
    "Don't go in past the second room. Floor's a suggestion.",
    "Whole street's picked. We're late by a decade.",
    "Wire, glass, anything that holds water. That's the list.",
    "You smell that? Then we're not going in.",
    "Third house today with the beds still made.",
    "Take the small stuff first. Small stuff walks.",
    "If it was worth taking it's already taken. So look for what nobody wanted yet.",
    "Anything that used to plug into something, bring it.",
    "That's a load-bearing nothing. Don't lean.",
    "Been in here before. Somebody moved the chairs.",
    "Leave the photos. I know, I know. Just leave them."
  ],
  "scav:scav@es": [
    "Serial number, somebody want it. Always.",
    "Not go past second room. The floor is bad.",
    "Street is empty already. We come ten year late.",
    "Wire. Glass. Thing that hold water. Is all.",
    "You smell? Then no. We not go in.",
    "Three house today, the bed still made."
  ],
  "scav:scav@spanglish": [
    "Anything with a serial number on it, somebody wants.",
    "No entres past the second room. Floor's a suggestion.",
    "Whole street's picked. Llegamos late by a decade.",
    "Wire, glass, anything that holds agua. That's the list.",
    "You smell that? Then we're not going in.",
    "Third house today with the beds still made. No me gusta.",
    "Take the small stuff first. Small stuff walks."
  ],
  "scav:sleep": [
    "...",
    "Wake me if the dogs start."
  ],
  "scav:sleep@es": [
    "...",
    "Enough. Tomorrow."
  ],
  "scav:sleep@spanglish": [
    "...",
    "Ya. Mañana."
  ],
  "scav:watch": [
    "I'm better at finding than watching.",
    "Anything moves out there, it's a bag in the wind."
  ],
  "scav:watch@es": [
    "I watch. Nobody else watch.",
    "Two people. I know both."
  ],
  "scav:watch@spanglish": [
    "I watch the street porque nobody else does.",
    "Two people out. Ambos I know."
  ],
  "scav:work": [
    "Sorting's the job. Anybody can pick things up.",
    "That pile's mine, that pile's the block's. Don't mix them.",
    "Anything shiny goes in the middle pile, I'll look at it after."
  ],
  "scav:work@es": [
    "If they pay, is work. If no, is Tuesday.",
    "Only hand. No machine. Machine not work here."
  ],
  "scav:work@spanglish": [
    "It's work if somebody pays. Si no, it's Tuesday.",
    "Hands, not machines. Nothing here runs anyway."
  ],
  "watch:errand": [
    "Fast in, fast out. I'm expected somewhere."
  ],
  "watch:errand@es": [
    "Fast. Before dark. I work at dark."
  ],
  "watch:errand@spanglish": [
    "Quick, before it's dark. Yo trabajo at dark."
  ],
  "watch:free": [
    "Third night in a row somebody's been on that roof.",
    "One of these years it'll be safe enough to be bored.",
    "You want the shift? Take the shift. I'm not proud.",
    "I sleep with the window open. Habit."
  ],
  "watch:free@es": [
    "I sleep when everybody wake. Always backward.",
    "Ask me how the street look at four. Nobody ask.",
    "Somebody must stand there. Is me."
  ],
  "watch:free@spanglish": [
    "I sleep when everybody's awake. Al revés, always.",
    "Ask me what the street looks like at four. Nadie asks.",
    "Somebody has to stand out there y me toca."
  ],
  "watch:home": [
    "I sleep days. Try to remember that.",
    "Nothing happened, which is the best sentence I know.",
    "Don't ask. It was fine. It's always fine until it isn't."
  ],
  "watch:home@es": [
    "Wake me nine. Not before.",
    "I see the sun come up. Again.",
    "Close the door. I know you know. I say it."
  ],
  "watch:home@spanglish": [
    "Wake me at nine, no antes.",
    "I saw the sun come up. Otra vez.",
    "Cierra la puerta. Yes I know. I still say it."
  ],
  "watch:scav": [
    "Off shift I take what everybody takes."
  ],
  "watch:scav@es": [
    "I take what nobody watch. Is funny, I know."
  ],
  "watch:scav@spanglish": [
    "I take what nobody's watching. Ironía, I know."
  ],
  "watch:sleep": [
    "...",
    "I hear everything, so it had better be worth it."
  ],
  "watch:sleep@es": [
    "...",
    "Is day. Let me sleep."
  ],
  "watch:sleep@spanglish": [
    "...",
    "Es de día. Let me sleep."
  ],
  "watch:watch": [
    "State your business or state nothing and keep walking.",
    "It's quiet. Quiet's got a sound and this isn't it.",
    "Two hours to go and then it's somebody else's dark.",
    "You see a light where there wasn't one, you say so.",
    "Nobody comes up this street who doesn't live on it.",
    "Cold out. Been colder.",
    "I'm not stopping you. I'm looking at you.",
    "Whistle if you're one of ours. Everybody knows the whistle.",
    "Every hour I don't see anything is an hour that worked.",
    "Somebody's been standing at that corner for twenty minutes.",
    "Go home. I'm not asking twice and I'm not asking rudely.",
    "You get used to the dark. You never get used to the waiting."
  ],
  "watch:watch@es": [
    "Nothing. Is good.",
    "You learn the hour. Two to four is the bad one.",
    "I not look for trouble. I look for when it start.",
    "Same dog. Same nothing. Every night.",
    "Eight hour. The best part is when is boring."
  ],
  "watch:watch@spanglish": [
    "Nothing. Y eso es bueno.",
    "You learn the hours. Two to four es lo peor.",
    "I'm not looking for trouble, estoy looking for the hour it starts.",
    "Same dog barks at the same nothing every night.",
    "Light moves out there? Mira first, say nothing.",
    "Ocho hours and the best part is when it's boring."
  ],
  "watch:work": [
    "Same post, same window, same six lights.",
    "I write it down. Somebody eventually reads it."
  ],
  "watch:work@es": [
    "Stand. Is the work. All the shift.",
    "If something happen, you know it."
  ],
  "watch:work@spanglish": [
    "Standing is the work. Todo el turno.",
    "You'll know if something happens. Ya lo sabrás."
  ],
  "when:after_trouble": [
    "Everybody's accounted for. Everybody on this block.",
    "Board it tonight, fix it properly when it's light.",
    "Nobody's saying anything and everybody's saying it loud.",
    "Count the doors. Then count the people.",
    "Whatever you saw, you saw it with us."
  ],
  "when:after_trouble@es": [
    "Everybody is here. All this block.",
    "Board it tonight. Fix it good in the light.",
    "Nobody say nothing. Everybody say it loud.",
    "Count the door. Then count the people.",
    "What you see, you see it with us."
  ],
  "when:after_trouble@spanglish": [
    "Everybody's accounted for. Todos on this block.",
    "Board it tonight, fix it bien when it's light.",
    "Nobody's saying nada and everybody's saying it loud.",
    "Cuenta las puertas. Then count the people.",
    "Whatever you saw, you saw it con nosotros."
  ],
  "when:brownout": [
    "There it goes. Same hour as always.",
    "Half light's worse than none. Makes you think it's coming back.",
    "Somebody upstream is drinking before we do.",
    "Half the block, same as Tuesday.",
    "It's not broken. Somebody's just using more of it than us."
  ],
  "when:brownout@es": [
    "There. Same hour. Always.",
    "Half light is worse than no light. You think it come back.",
    "Somebody up there drink before us.",
    "Half the block. Same like Tuesday.",
    "Is not broken. Somebody use more."
  ],
  "when:brownout@spanglish": [
    "There it goes. La misma hora as always.",
    "Half light's worse than none. Te hace think it's coming back.",
    "Somebody upstream is drinking before nosotros.",
    "Half the block, igual que el martes.",
    "It's not broken. Somebody's just using more of it than us."
  ],
  "when:favour": [
    "I'll not forget it. That's worth more here than it used to be.",
    "You did right by me. Say the word sometime."
  ],
  "when:favour@es": [
    "I not forget this. Here that is worth much.",
    "You do right with me. Say the word one day."
  ],
  "when:favour@spanglish": [
    "No se me olvida. That's worth more here than it used to be.",
    "You did right by me. Say the word alguna vez."
  ],
  "when:heat": [
    "Hundred and ten in the shade and there is no shade.",
    "Don't move till four. Nothing's worth it till four.",
    "Drink before you're thirsty. After's too late out here.",
    "You can hear the road ticking.",
    "This used to be the fun kind of hot."
  ],
  "when:heat@es": [
    "Hundred ten. And no shade.",
    "Not move until four. Nothing is worth it.",
    "Drink now. Not when thirsty. Too late then.",
    "Listen. The road is ticking."
  ],
  "when:heat@spanglish": [
    "Ciento diez in the shade and there is no shade.",
    "Don't move till four. Nada's worth it till four.",
    "Drink before you're thirsty. Después is too late out here.",
    "You can hear the road ticking.",
    "This used to be the fun kind of calor."
  ],
  "when:hungry": [
    "I'm fine. I ate yesterday.",
    "Half now, half tomorrow. That's how you make it two days.",
    "I'm saving it. Don't look at me like that."
  ],
  "when:hungry@es": [
    "I am fine. Yesterday I eat.",
    "Half now. Half tomorrow. Is two day.",
    "I save it. Not look at me like this."
  ],
  "when:hungry@spanglish": [
    "Estoy bien. I ate yesterday.",
    "Half now, half tomorrow. Así it's two days.",
    "I'm saving it. No me mires así."
  ],
  "when:market": [
    "Say a number. Any number. We'll meet somewhere sad in the middle.",
    "That's not what it was worth last week.",
    "Cash, work, or water. Pick one.",
    "You touch it, you've bought it, that's the rule.",
    "For that? For THAT?",
    "Everybody's an honest trader till the second offer.",
    "I'll take it for what it's worth to me, not what it's worth to you."
  ],
  "when:market@es": [
    "Say a number. Any number. We meet in the middle. Sad middle.",
    "Last week is not this price.",
    "Money, work, or water. One.",
    "You touch, you buy. Is the rule.",
    "For that? For THAT?"
  ],
  "when:market@spanglish": [
    "Say a number. Cualquier number. We'll meet somewhere sad in the middle.",
    "That's not what it was worth la semana pasada.",
    "Cash, work, or agua. Pick one.",
    "You touch it, you bought it. Esa es la regla.",
    "For that? Por ESO?",
    "Everybody's an honest trader hasta la segunda offer."
  ],
  "when:met_before": [
    "You again. That's not a complaint.",
    "Still walking, then.",
    "I remember you. That's rarer than it sounds."
  ],
  "when:met_before@es": [
    "You again. Is not a complaint.",
    "Still walking. Good.",
    "I remember you. Is not common."
  ],
  "when:met_before@spanglish": [
    "Tú otra vez. That's not a complaint.",
    "Still walking, then.",
    "Me acuerdo de ti. That's rarer than it sounds."
  ],
  "when:night": [
    "Twelve blocks and you can count the lit ones.",
    "Whatever's out there tonight can stay out there.",
    "Dark's the only thing that's free.",
    "You can hear the freeway when it's this quiet. Nothing on it, but you can hear it.",
    "Nobody patrols the dark. That's not a rule, it's just true.",
    "See a light move where nothing should be? Say nothing and walk faster."
  ],
  "when:night@es": [
    "Twelve block. Count the light. Is quick.",
    "What is out there tonight, it can stay out there.",
    "The dark is the only free thing.",
    "So quiet you hear the freeway. Nothing on it. You hear it.",
    "Nobody go in the dark. Is not a rule. Is true."
  ],
  "when:night@spanglish": [
    "Twelve blocks y you can count the lit ones.",
    "Whatever's out there tonight puede quedarse out there.",
    "La oscuridad's the only thing that's free.",
    "You can hear the freeway when it's this quiet. Nothing on it, pero you hear it.",
    "Nobody patrols the dark. No es una regla, it's just true.",
    "See a light move where nothing should be? Say nada and walk faster."
  ],
  "when:owed": [
    "You know what you owe me.",
    "I'm not going to bring it up. I'm just going to look at you."
  ],
  "when:owed@es": [
    "You know what you owe.",
    "I not say it. I only look at you."
  ],
  "when:owed@spanglish": [
    "Ya sabes what you owe me.",
    "I'm not going to bring it up. Nomás voy a look at you."
  ],
  "when:rain": [
    "Put out everything that holds water. Everything.",
    "First rain since spring and half of it's on the roof, not in the barrel.",
    "Kids are out in it. Let them be out in it."
  ],
  "when:rain@es": [
    "Put out all thing that hold water. All.",
    "First rain since spring. Half go on the roof.",
    "The kids are in it. Let them."
  ],
  "when:rain@spanglish": [
    "Saca everything that holds water. Everything.",
    "First rain since spring y half of it's on the roof, not in the barrel.",
    "Los niños are out in it. Let them be out in it."
  ],
  "when:seen": [
    "Don't know you.",
    "You're the one from the other block.",
    "Long as you're not taking anything.",
    "Morning. Or whatever it is.",
    "Keep walking, no offence.",
    "You looking for somebody?",
    "New face. Huh.",
    "Whatever you're selling, walk slower.",
    "You're not from three blocks up, are you."
  ],
  "when:seen@es": [
    "I not know you.",
    "You are from other block. The one.",
    "Is fine. If you take nothing.",
    "Morning. Or whatever is.",
    "Keep walk. No offence.",
    "You look for somebody?"
  ],
  "when:seen@spanglish": [
    "No te conozco.",
    "You're the one from the other block.",
    "Long as you're not taking anything.",
    "Morning. O lo que sea.",
    "Keep walking, sin ofender.",
    "Buscas a alguien?",
    "New face. Huh."
  ],
  "when:stranger_block": [
    "This isn't your street.",
    "Ask before you take anything on this block. Ask ME."
  ],
  "when:stranger_block@es": [
    "Is not your street.",
    "Ask before you take. Ask me."
  ],
  "when:stranger_block@spanglish": [
    "Esta no es tu calle.",
    "Ask before you take anything on this block. Ask ME."
  ],
  "when:work_short": [
    "We're two short today and nobody's saying why.",
    "If they don't show tomorrow I'm putting somebody else on it."
  ],
  "when:work_short@es": [
    "Two people missing. Nobody say why.",
    "Tomorrow they not come, I put other people."
  ],
  "when:work_short@spanglish": [
    "We're two short today y nobody's saying why.",
    "If they don't show mañana I'm putting somebody else on it."
  ],
  "worker:errand": [
    "Four stops and I've done one.",
    "If they're closed I'm not coming back tomorrow.",
    "She said noon. It has been noon for a while.",
    "I'll pay in work. I always pay in work.",
    "Half of getting anything here is knowing which door.",
    "Tell her I came by. Tell her I came by TWICE.",
    "I'm not arguing, I'm explaining loudly."
  ],
  "worker:errand@es": [
    "Four stop. I do one.",
    "If close, I not come back tomorrow.",
    "She say noon. Is long time noon.",
    "I pay with work. Always work."
  ],
  "worker:errand@spanglish": [
    "Four stops y I've done one.",
    "If they're closed no vuelvo mañana.",
    "She said noon. It has been noon por un rato.",
    "I'll pay in work. Siempre pay in work.",
    "Half of getting anything here is knowing which door. La otra half is knowing who."
  ],
  "worker:free": [
    "Give it two years. Somebody'll turn the rest of the lights back on.",
    "You remember when this block had two working streetlights? Two.",
    "I'm not saying he stole it. I'm saying he has it.",
    "Sit down, you're making me tired.",
    "That's not a rumour, that's my cousin.",
    "Whole valley's held together with hose clamps and stubbornness.",
    "Somebody's kid is on the roof again.",
    "You hear they've got a generator two streets over? Allegedly.",
    "I'd move if there was anywhere that isn't this.",
    "Twelve years I've walked this street and it's never been this quiet at noon."
  ],
  "worker:free@es": [
    "Two years maybe. Then lights come back. Maybe.",
    "Before, this block have two lights. Two.",
    "I not say he steal it. I say he have it.",
    "Sit down. You make me tired.",
    "Is not rumour. Is my cousin."
  ],
  "worker:free@spanglish": [
    "Give it two years. Somebody'll turn the rest of the lights back on. Ojalá.",
    "You remember when this block had two working streetlights? Dos.",
    "I'm not saying he stole it. Estoy diciendo he has it.",
    "Siéntate, you're making me tired.",
    "That's not a rumour, that's mi primo.",
    "Whole valley's held together con hose clamps and stubbornness."
  ],
  "worker:home": [
    "Shoes off. I just swept.",
    "We're one bad week from asking my brother for help and I'd rather not.",
    "Did you eat? Don't lie to me.",
    "Leave the door. It's cooler with it open and nobody's coming down here.",
    "I'm not going back tomorrow if they're short again.",
    "Save that. It's still good if you cut the ends off.",
    "The tap's brown again. Let it run, it clears.",
    "I'm not asking them for anything. I'd rather be cold.",
    "Sit with me a minute. Just a minute."
  ],
  "worker:home@es": [
    "Shoes. I sweep already.",
    "You eat today? Say true.",
    "Leave door open. Is cooler.",
    "Save this one. Cut the end, is still good.",
    "Sit. You work since morning."
  ],
  "worker:home@spanglish": [
    "Shoes off, mija, I just swept.",
    "We're one bad week from asking mi hermano for help and I'd rather not.",
    "Did you eat? Y no me mientas.",
    "Leave the door. It's cooler open y nobody's coming down here.",
    "Save that. Still good if you cut the ends off.",
    "Siéntate. You've been on your feet since six."
  ],
  "worker:scav": [
    "Copper's gone. Everything's gone but the heavy stuff.",
    "Somebody beat us here by about a year.",
    "Take the hinges. People always forget hinges.",
    "Everything decent's behind a door somebody welded.",
    "One good find pays a week. One."
  ],
  "worker:scav@es": [
    "Copper is gone. Only heavy thing stay.",
    "Somebody come here before. One year before.",
    "Take the hinge. Everybody forget the hinge."
  ],
  "worker:scav@spanglish": [
    "El cobre's gone. Everything's gone but the heavy stuff.",
    "Somebody beat us here by about a year, güey.",
    "Take the hinges. People always forget hinges."
  ],
  "worker:sleep": [
    "...",
    "Turn that off.",
    "Five more minutes and I mean it.",
    "Let me sleep or let me work, not both."
  ],
  "worker:sleep@es": [
    "...",
    "Off. Please.",
    "Five minute. No more."
  ],
  "worker:sleep@spanglish": [
    "...",
    "Apaga eso.",
    "Five more minutes y ya."
  ],
  "worker:watch": [
    "Nothing yet. Which is the job.",
    "I count six lit windows from here. Same six as last night.",
    "Anything happens, I'm the one who yells. That's the plan.",
    "Two of us and eleven houses. You do the maths."
  ],
  "worker:watch@es": [
    "Nothing. Is the job.",
    "Six window with light. Same six like last night."
  ],
  "worker:watch@spanglish": [
    "Nothing yet. Which is the job.",
    "Six lit windows from here. Las mismas seis as last night."
  ],
  "worker:work": [
    "Third shift this week and the meter still reads the same.",
    "If it runs, it runs. Nobody's paying me to make it pretty.",
    "Hold that. No, HOLD it.",
    "They want it done by dark. Dark's in an hour.",
    "Whoever wired this was in a hurry or a mood.",
    "I'll trade you an hour. I'm not trading two.",
    "Every job in this valley is somebody's old job done worse.",
    "Careful. That's live and it lies about it.",
    "Two of us doing four people's day and they call that lean.",
    "Don't help. Seriously. You'll help it into the ground.",
    "It held all winter. It'll hold.",
    "Tell them it's done when it's done."
  ],
  "worker:work@es": [
    "Meter say the same. Every week the same.",
    "It works. Is not pretty. Nobody pay me for pretty.",
    "Hold. No. Hold.",
    "They want by dark. Dark is one hour.",
    "Careful. Is live. It lie about it.",
    "I give you one hour. Not two."
  ],
  "worker:work@spanglish": [
    "Third shift this week y el medidor still reads the same.",
    "If it runs, it runs. Nadie me paga to make it pretty.",
    "Hold that. No. HOLD it, hombre.",
    "They want it done by dark, y ya son las cinco.",
    "Whoever wired this was apurado or in a mood.",
    "I'll trade you an hour. Two, no.",
    "Cuidado, that's live and it lies about it.",
    "Every job in this valley is somebody's old job done worse. Pero it pays."
  ]
};

  // ---- REACTIONS -- WHAT THEY SAY BECAUSE OF WHAT YOU DID -------------
  // Generated by tools/bohemia_reaction_factory.py. DO NOT HAND-EDIT.
  // Depth is reactivity. Three shipped systems already know exactly what a
  // person thinks of you and why -- standing RUNGS, deeds witness() (who
  // actually SAW it, and how far its loudness carried), and the ledger (how
  // many times you have met, whether you asked, whether you were honest) --
  // and all three fed a mouth that said the same ambient line to everybody.
  // Every key here is a value one of those modules already produces; the
  // factory reads the rung names and clout tags OFF those modules rather
  // than retyping them, because a retyped key is a line that never fires.
  var REACTIONS = {
  "heard:notable": [
    "You're the one from the thing.",
    "It got to me third-hand and it still had your name on it.",
    "I've heard two different stories about you this week."
  ],
  "heard:notable@es": [
    "You are the one from that thing.",
    "It come to me third hand. Still with your name.",
    "This week I hear two stories about you."
  ],
  "heard:notable@spanglish": [
    "You're the one from la cosa esa.",
    "It got to me third-hand y todavía had your name on it.",
    "He oído two different stories about you this week."
  ],
  "heard:quiet": [
    "Somebody mentioned you. Only somebody.",
    "I heard a version of it. Probably the wrong version."
  ],
  "heard:quiet@es": [
    "Somebody say your name. Only somebody.",
    "I hear one version. Probably the wrong one."
  ],
  "heard:quiet@spanglish": [
    "Alguien mentioned you. Only somebody.",
    "I heard a version of it. Seguramente the wrong version."
  ],
  "heard:reckless": [
    "Everybody's heard. That's the whole point of what you did, isn't it.",
    "Two blocks and a caravan and it still got here before you.",
    "I'd never met you and I already had an opinion."
  ],
  "heard:reckless@es": [
    "Everybody hear it. Is the point of what you do, no?",
    "Two block and a caravan, and it arrive before you.",
    "I never meet you and already I have opinion."
  ],
  "heard:reckless@spanglish": [
    "Todo el mundo's heard. That's the whole point of what you did, no?",
    "Two blocks and a caravan y llegó here before you.",
    "I'd never met you y ya tenía an opinion."
  ],
  "heard:risky": [
    "Word came up this way about you. It didn't lose anything on the trip.",
    "I heard, and I heard who was standing near you when it happened."
  ],
  "heard:risky@es": [
    "The word come up here about you. It lose nothing on the road.",
    "I hear it. And I hear who stand near you."
  ],
  "heard:risky@spanglish": [
    "Word came up this way about you. No perdió nada on the trip.",
    "I heard, y oí who was standing near you when it happened."
  ],
  "met:again": [
    "You. Again.",
    "That's twice. Three times and I'll learn your name.",
    "Still walking around, I see."
  ],
  "met:again@es": [
    "You. Otra vez.",
    "Is two times. Three times, I learn the name.",
    "Still you walk. I see."
  ],
  "met:again@spanglish": [
    "Tú. Otra vez.",
    "That's twice. Three times y aprendo your name.",
    "Still walking around, ya veo."
  ],
  "met:asked": [
    "You asked. Most people don't ask.",
    "You remembered. That's not nothing here."
  ],
  "met:asked@es": [
    "You ask me. Most people not ask.",
    "You remember. Here that is something."
  ],
  "met:asked@spanglish": [
    "You asked. La mayoría don't ask.",
    "Te acordaste. That's not nothing here."
  ],
  "met:first": [
    "Don't think we've done this.",
    "New. Alright.",
    "I'll get your name eventually or I won't."
  ],
  "met:first@es": [
    "I think we not do this before.",
    "New. Okay.",
    "Maybe I learn your name. Maybe no."
  ],
  "met:first@spanglish": [
    "No creo que we've done this.",
    "New. Bueno.",
    "I'll get your name eventually o no."
  ],
  "met:honest": [
    "You told me straight when you didn't have to.",
    "I've been lied to by better dressed people than you. You didn't."
  ],
  "met:honest@es": [
    "You tell me true. You not have to.",
    "Better dressed people lie to me. You, no."
  ],
  "met:honest@spanglish": [
    "You told me straight cuando no tenías que.",
    "I've been lied to by better dressed people than you. Tú no."
  ],
  "met:known": [
    "There you are.",
    "I was wondering when you'd come back around.",
    "Same as always? Course it is."
  ],
  "met:known@es": [
    "Ah. Here you are.",
    "I think, when he come back. And here you are.",
    "The same? Of course the same."
  ],
  "met:known@spanglish": [
    "Ahí estás.",
    "I was wondering cuándo you'd come back around.",
    "Same as always? Claro que sí."
  ],
  "met:lied": [
    "You told me a thing that wasn't true and I found out on my own.",
    "I'm not angry. I'm just done taking your word."
  ],
  "met:lied@es": [
    "You say a thing. Is not true. I find out alone.",
    "I am not angry. But your word, no more."
  ],
  "met:lied@spanglish": [
    "You told me a thing que no era verdad and I found out on my own.",
    "No estoy angry. I'm just done taking your word."
  ],
  "rung:COLD": [
    "I'm not going to be rude about it. I'm just not going to help.",
    "We're square. Let's keep it that way.",
    "I heard. I'm not going to say what I heard.",
    "You'll want to talk to somebody else.",
    "It's not personal. It's just recent."
  ],
  "rung:COLD@es": [
    "I am not rude. But I not help.",
    "We are equal. Let it stay like this.",
    "I hear it. I not say what I hear.",
    "Better you talk to other person.",
    "Is not personal. Is only recent."
  ],
  "rung:COLD@spanglish": [
    "No voy a be rude about it. I'm just not going to help.",
    "Estamos a mano. Let's keep it that way.",
    "I heard. No voy a decir what I heard.",
    "You'll want to talk a otra persona.",
    "It's not personal. Es que it's recent."
  ],
  "rung:FWU": [
    "Anything I have. I mean that and I'd rather you didn't test it.",
    "You're not a guest here. Stop knocking.",
    "Half this block would stand up for you and the other half doesn't know you yet.",
    "Whatever happens, you've got a door here."
  ],
  "rung:FWU@es": [
    "What I have, is yours. I say it true. Not test me.",
    "You are not a guest. Not knock.",
    "Half this block stand for you. The other half not know you yet.",
    "What happen, here is a door for you."
  ],
  "rung:FWU@spanglish": [
    "Anything I have. Lo digo en serio y I'd rather you didn't test it.",
    "You're not a guest here. Deja de knocking.",
    "Half this block would stand up for you y la otra half doesn't know you yet.",
    "Whatever happens, aquí tienes una puerta."
  ],
  "rung:HOSTILE": [
    "No. Whatever it is, no.",
    "You've got a lot of road to be walking down this one.",
    "I know what you did. Everybody on this street knows what you did.",
    "Don't stand where I can see you.",
    "There's nothing here for you. There's nothing here for you tomorrow either.",
    "You come back with the whole block behind you or you don't come back."
  ],
  "rung:HOSTILE@es": [
    "No. What it is, no.",
    "You walk long road for this one.",
    "I know what you do. All this street know it.",
    "Not stand where I see you.",
    "Here is nothing for you. Tomorrow also nothing.",
    "Come back with all the block, or not come back."
  ],
  "rung:HOSTILE@spanglish": [
    "No. Sea lo que sea, no.",
    "Traes mucho camino to be walking down this one.",
    "Ya sé what you did. Everybody on this street knows what you did.",
    "No te pares where I can see you.",
    "There's nothing here for you. Mañana tampoco.",
    "You come back with the whole block behind you o no vuelves."
  ],
  "rung:NEUTRAL": [
    "You're the one who's been around.",
    "I don't know you well enough to have an opinion and that's fine by me.",
    "Ask. I might answer.",
    "Haven't decided about you yet."
  ],
  "rung:NEUTRAL@es": [
    "You are the one who is here sometimes.",
    "I not know you enough for an opinion. Is fine.",
    "Ask. Maybe I answer.",
    "About you I not decide yet."
  ],
  "rung:NEUTRAL@spanglish": [
    "You're the one que ha estado around.",
    "I don't know you well enough to have an opinion y así está bien.",
    "Pregunta. I might answer.",
    "No he decidido about you yet."
  ],
  "rung:WARM": [
    "There's a chair. Sit in it.",
    "You've been decent to people I like. That travels.",
    "Take it. Pay me back whenever, or don't.",
    "I put a word in for you. Didn't have to. Did anyway.",
    "You need something, you ask me before you ask a stranger."
  ],
  "rung:WARM@es": [
    "Here is a chair. Sit.",
    "You are good with people I like. That travel.",
    "Take it. Pay me after. Or no.",
    "I say a word for you. I not have to. I do it.",
    "You need something, ask me. Not a stranger."
  ],
  "rung:WARM@spanglish": [
    "There's a chair. Siéntate.",
    "You've been decent to people I like. Eso viaja.",
    "Take it. Pay me back cuando puedas, or don't.",
    "Puse una palabra for you. Didn't have to. Did anyway.",
    "You need something, me preguntas before you ask a stranger."
  ],
  "saw:notable": [
    "I was standing right there.",
    "Half the block watched you do that.",
    "People are going to be talking about that at dinner.",
    "You didn't hide it. I don't know yet if that was brave or stupid."
  ],
  "saw:notable@es": [
    "I stand right there.",
    "Half the block see you do it.",
    "At dinner they talk about this.",
    "You not hide it. Brave or stupid, I not know yet."
  ],
  "saw:notable@spanglish": [
    "I was standing ahí mismo.",
    "Medio bloque watched you do that.",
    "People are going to be talking about that en la cena.",
    "No lo escondiste. I don't know yet if that was brave or stupid."
  ],
  "saw:quiet": [
    "I saw. I don't think anybody else did.",
    "You handled that without a crowd. I noticed.",
    "Nobody's going to hear it from me.",
    "Quiet work. Rarer than you'd think."
  ],
  "saw:quiet@es": [
    "I see it. I think nobody else see.",
    "You do it with no crowd. I notice.",
    "From me, nobody hear it.",
    "Quiet work. Is not common."
  ],
  "saw:quiet@spanglish": [
    "I saw. No creo que anybody else did.",
    "You handled that without a crowd. Me di cuenta.",
    "Nobody's going to hear it de mí.",
    "Quiet work. Más raro than you'd think."
  ],
  "saw:reckless": [
    "I was there. I'll be answering questions about it for a month.",
    "Whatever you were trying to prove, you proved it.",
    "You did that in front of children.",
    "I can't unsee it and neither can anybody else on that corner.",
    "There's no walking that back. You know that, right?"
  ],
  "saw:reckless@es": [
    "I am there. One month I answer questions for this.",
    "What you want to prove, you prove it.",
    "You do this in front of the children.",
    "I not forget it. The corner not forget it also.",
    "This you not take back. You know."
  ],
  "saw:reckless@spanglish": [
    "Yo estaba ahí. I'll be answering questions about it for a month.",
    "Whatever you were trying to prove, lo probaste.",
    "You did that delante de los niños.",
    "No puedo unsee it and neither can anybody else on that corner.",
    "No hay walking that back. You know that, right?"
  ],
  "saw:risky": [
    "You could have got somebody killed doing that.",
    "I saw it and I've been thinking about it since.",
    "That was a lot. That was a LOT.",
    "I'm not saying you were wrong. I'm saying my hands were shaking."
  ],
  "saw:risky@es": [
    "I see where you put the hand. Is not luck.",
    "You go more close than people think.",
    "I see people do this. Most of them, one time."
  ],
  "saw:risky@spanglish": [
    "I saw where you put your hands. Eso no fue suerte.",
    "You cut that closer que la gente cree.",
    "I've seen people do that. Most of them una vez."
  ]
};

  // ---- THE FOUR WORDS THE WORLD ALREADY USES -------------------------------
  // NOT new vocabulary. bohemia_agents.js:makeAgent already sorts every person
  // into exactly these four, and scheduleFor gives each one a different day.
  // Displaying them is surfacing mechanism, not inventing character.
  var ROLE_WORDS = { worker: 'WORKER', scav: 'SCAVENGER', keeper: 'KEEPER', watch: 'WATCH' };
  // What a scheduled block MEANS, in the words the schedule itself uses
  // (bohemia_agents.js:scheduleFor acts: sleep/home/work/free/scav/errand/watch).
  var ACT_WORDS = {
    sleep: 'ASLEEP AT HOME', home: 'AT HOME', work: 'AT WORK',
    free: 'OUT ON THE BLOCK', scav: 'SCAVENGING', errand: 'ON AN ERRAND',
    watch: 'ON WATCH'
  };
  var ORDINALS = ['FIRST', 'SECOND', 'THIRD', 'FOURTH'];
  var COUNTWORDS = ['', 'ONE', 'TWO', 'THREE', 'FOUR'];

  function two(n) { return (n < 10 ? '0' : '') + n; }
  function clock(t) { t = ((t % 1440) + 1440) % 1440; return two(Math.floor(t / 60)) + ':' + two(t % 60); }

  // ---- THE KEY -------------------------------------------------------------
  // Stable across saves, devices and sim rebuilds. The block seed is in it
  // because two blocks may both have an H3-2 and they are not the same person.
  function keyOf(blockSeed, agent) {
    if (!agent) return null;
    return 'P:' + (blockSeed >>> 0) + ':' + agent.id;
  }
  // house/slot back out of the mechanical designation the agents module writes
  // ('H<house>-<n>', 1-based). Parsed rather than re-derived so the two files
  // can never disagree about which house somebody is from.
  function seatOf(agent) {
    var m = /^H(\d+)-(\d+)$/.exec(String(agent && agent.id || ''));
    return m ? { house: parseInt(m[1], 10) - 1, slot: parseInt(m[2], 10) - 1 } : { house: -1, slot: -1 };
  }

  // ---- THE PERSON ----------------------------------------------------------
  // Derived. Pure. No state. Feed it the same agent tomorrow and it is the same
  // person, which is the entire point of the module.
  function personOf(blockSeed, agent, opts) {
    if (!agent) return null;
    opts = opts || {};
    var seat = seatOf(agent);
    var key = keyOf(blockSeed, agent);
    var canon = KNOWN_AT_START[key] || null;
    /* THE THREE WAYS YOU CAN KNOW SOMEBODY (Paolo 7/31, YOU HAVE TO ASK):
         known    - story people. You have known them your whole life. His table.
         asked    - you walked up and asked, and the game remembered.
         stranger - everyone else, forever, until you ask.
       `asked` is the only one the player can move somebody into, and moving them
       is the mechanic. opts.asked comes from the meeting ledger, which is the
       only thing in this system that is genuinely persisted. */
    var asked = !canon && !!opts.asked;
    return {
      key: key,
      tier: canon ? 'known' : (asked ? 'asked' : 'stranger'),
      name: canon ? canon.name : (asked ? generatedName(key) : null),
      role: agent.role || null,
      // WHICH BODY THEY WEAR, AND WHICH FACE GOES WITH IT — one number for both,
      // which is what makes the portrait the person you walked up to. Mixed, not
      // raw: see mix32 above for the half-the-cast-never-drawn measurement.
      lookSeed: mix32(agent.seed),
      // a separate stream for anything that must vary INDEPENDENTLY of the look
      idSeed: hash(blockSeed, seat.house + 1, seat.slot + 101),
      /* WHAT THEY SPEAK (8/25, LANG-1). Derived like everything else here, so a
         neighbour sounds the same on any device and nothing is persisted. It
         sits OUTSIDE the three tiers on purpose: you do not have to ask
         somebody their name to hear what language they are speaking in. */
      lang: langOf(blockSeed, key),
      household: {
        house: seat.house,
        slot: seat.slot,
        size: opts.householdSize != null ? opts.householdSize : null
      },
      home: agent.home || null,
      work: agent.job || null,
      faction: agent.faction || null   // still null everywhere: FACTION_ASSIGN is empty
    };
  }

  // Everyone on a block, with household sizes filled in from the roster itself
  // (the roster is the only thing that knows how many people share a house).
  function peopleOf(blockSeed, agents, ledger) {
    var sizes = {};
    (agents || []).forEach(function (a) {
      var h = seatOf(a).house; sizes[h] = (sizes[h] || 0) + 1;
    });
    return (agents || []).map(function (a) {
      return personOf(blockSeed, a, {
        householdSize: sizes[seatOf(a).house],
        asked: ledger ? ledger.asked(keyOf(blockSeed, a)) : false
      });
    });
  }

  // ---- WHAT YOU CALL THEM --------------------------------------------------
  // A name if he has ruled one, otherwise the engine's own role word. NEVER an
  // invention. If a role ever arrives that this file does not know, it says
  // SOMEBODY rather than guessing at them.
  /* THE NAME THEY WOULD GIVE YOU IF YOU ASKED. Deterministic from the identity
     key, so a person answers the same way forever, on any device, and so the
     ledger only ever has to remember the single bit "you asked" — the name
     itself is derived, exactly like everything else in this module. Two
     independent streams so a common first name and a common surname do not
     travel together across the valley. */
  function generatedName(key) {
    var h = 0;
    for (var i = 0; i < key.length; i++) h = (Math.imul(h, 31) + key.charCodeAt(i)) >>> 0;
    var a = mix32(h), b = mix32(h ^ 0x9e3779b9);
    return GIVEN[a % GIVEN.length] + ' ' + SURNAME[b % SURNAME.length];
  }
  /* NEVER returns a name for a stranger, whatever pool exists. This is the
     ruling in one function: a name is earned, not given. */
  function nameOf(person) {
    if (!person || person.tier === 'stranger') return null;
    return person.name || null;
  }
  /* THE WHOLE PHRASE THE ONE BUTTON SAYS, so the grammar lives in ONE place. A
     trade takes an article and a person does not: "TALK TO THE SCAVENGER" but
     "TALK TO RUBEN". The run built this string itself for half a day and shipped
     "TALK TO THE RUBEN" the moment names existed; the gate caught it, and the
     fix is that the run stops doing grammar.
     THIS STRING IS ENGLISH FOREVER, WHATEVER THE PERSON SPEAKS (8/25, THEY
     SPEAK SPANGLISH, the hard rule). It is the one button, it is how the player
     knows an action exists at all, and a button you cannot read is not flavour,
     it is a broken button. person.lang is deliberately not consulted here and
     language_gate claim C fails if that ever changes. */
  function addressOf(person, verb) {
    verb = verb || 'TALK TO';
    return nameOf(person) ? verb + ' ' + headingOf(person)
                          : verb + ' THE ' + headingOf(person);
  }
  /* WHAT THE GAME CALLS THEM TO YOUR FACE. A stranger is their trade; somebody
     you asked is their first name, because that is how you would actually think
     of a neighbour once you had it. */
  /* *** WHAT SOMEBODY DOES, AND IT HAS NEVER ONCE REACHED A PLAYER. ***
     MEASURED 9/5 on the real surface: 52 of 52 people within six cells of the
     spawn have `role` UNDEFINED, so every reader of ROLE_WORDS[person.role] has
     been answering SOMEBODY for every stranger in the valley since the day it
     was written. The four trades are real and they are on every person -- the
     population module calls the field `archetype` (worker / scav / keeper /
     watch), which is the SAME four keys ROLE_WORDS holds. One field, two names,
     and nobody noticed because 'SOMEBODY' is a perfectly good-looking answer.

     THE SAME SHAPE AS THE SEAT BUG THIS LANE FOUND LAST ROUND: a finished organ
     reaching nobody because the question was asked in the wrong words.

     ONE PLACE OWNS THE TRADE WORD NOW. `role` is read FIRST so a caller that
     really carries one (a quest cast member does) keeps working exactly as it
     did; `archetype` is the fallback, which is every actual person in the city.
     Five call sites used to each do this lookup themselves; a sixth would have
     been a sixth chance to get it wrong. */
  function tradeOf(person) {
    if (!person) return null;
    return ROLE_WORDS[person.role] || ROLE_WORDS[person.archetype] || null;
  }
  function headingOf(person) {
    if (!person) return 'SOMEBODY';
    var n = nameOf(person);
    if (n) return String(n).split(' ')[0].toUpperCase();
    return tradeOf(person) || 'SOMEBODY';
  }
  /* ---- CASTING: A QUEST ROLE BECOMES A REAL PERSON -----------------------
     Paolo 8/25, THE PLAYTEST DISPATCH item 2:
       "THE QUESTS ARE SO BAD AND NOT WIRED TO ANY LOCATIONS OR PEOPLE IN THE
        CITY."
     His dispatch makes it demand-side, not [PENDING]: "A QUEST THAT IS NOT
     ATTACHED TO A PLACE AND A PERSON IS NOT A QUEST."

     THE PLACE HALF ALREADY EXISTS. bohemia_loop.js castTarget() picks a real
     district cell out of the quest's own faction demand, and it has since 7/26.
     THE PERSON HALF DOES NOT: castTarget returns `speaker: "lineman"` -- a ROLE
     WORD, not a human. Nobody in the valley has ever been the lineman.

     WHAT A ROLE ACTUALLY ASKS FOR, COUNTED ACROSS ALL NINE CANON QUESTS:
       faction=X            53 uses   THE WORLD CAN ANSWER THIS
       ~60 other predicates  1 use each: keeps_the_tunnel, reads_the_sky,
                             found_the_stairwell, speaks_for_the_crew...
     That split is the whole design. The faction is a REAL DEMAND and is matched
     against people who really run with that outfit. The one-off predicates are
     the quest DESCRIBING THE PERSON IT NEEDS, and nothing in the sim computes
     them or ever will, because each is bespoke to one quest. So they are
     CONFERRED, NOT MATCHED: the quest does not hunt for somebody who already
     keeps the tunnel, it makes the person it cast INTO the one who keeps it.
     That is how casting works everywhere, and it is the only reading that does
     not require inventing sixty new simulation facts.

     MEASURED ON THE WALKED CITY BEFORE ANY OF THIS WAS WRITTEN: 2,661 people,
     204 affiliated (7.7%), and ELEVEN of the thirteen outfits have real people
     standing on real ground. Only REDS and BLUES came up empty in the sweep.
     So the faction demand is answerable for nine of the eleven the quests ask
     for, and NULL is the honest answer for the other two rather than a fake.

     DETERMINISTIC, and it has to be: the same quest, on the same block, with the
     same people, casts the same person forever, on any device, across saves.
     Nothing is stored -- this is derived exactly like the name and the language,
     off the identity keys that are already stable. */
  function roleFaction(role) {
    var m = /(?:^|\s)faction=([A-Za-z_]+)/.exec((role && role.cond) || '');
    if (!m) return null;
    var f = m[1].toUpperCase();
    return (f === 'ANY') ? null : f;
  }
  /* THE CONFERRED HALF: everything the role asks for that is not a faction.
     Returned so a surface can SAY it -- "the one who keeps the tunnel" is the
     most interesting sentence a quest ever writes about a stranger, and it would
     be a waste to match on it silently and never show it. */
  function roleTraits(role) {
    var out = [], re = /(?:^|\s)([a-z_]+)(?:=([A-Za-z_]+))?/g, m;
    var cond = (role && role.cond) || '';
    while ((m = re.exec(cond))) {
      if (m[1] === 'faction' || m[1] === 'faction_any') continue;
      out.push(m[2] ? (m[1] + '=' + m[2]) : m[1]);
    }
    return out;
  }
  /* WHO PLAYS THIS PART. `people` is whatever the surface already has; each
     needs a `key` and a faction, and the faction accessor is passed IN rather
     than assumed, because the walked city derives it through its own bridge and
     a second derivation here would be two answers to one question.
     Returns null when nobody qualifies, and null is a REAL ANSWER: most of the
     valley runs with nobody, and a quest whose outfit holds no ground near you
     genuinely has nobody to cast. Faking one would put a stranger in a role the
     story says belongs to an insider. */
  function castRole(role, people, opts) {
    if (!role || !people || !people.length) return null;
    var facOf = (opts && opts.factionOf) || function (p) { return p && p.faction; };
    var want = roleFaction(role);
    var pool = [];
    for (var i = 0; i < people.length; i++) {
      var p = people[i];
      if (!p) continue;
      if (want) {
        var f = facOf(p);
        if (!f || String(f).toUpperCase() !== want) continue;
      }
      pool.push(p);
    }
    if (!pool.length) return null;
    /* SORTED BY KEY FIRST, so the answer cannot depend on the order the caller
       happened to iterate the block in -- the same trap the quirk spread names.
       Then a stable hash of the quest id and the role name picks one. */
    pool.sort(function (a, b) {
      return String(keyFor(a)) < String(keyFor(b)) ? -1 : (String(keyFor(a)) > String(keyFor(b)) ? 1 : 0);
    });
    var tag = String((opts && opts.questId) || '') + '/' + String(role.name || '');
    var h = 0;
    for (var c = 0; c < tag.length; c++) h = (Math.imul(h, 31) + tag.charCodeAt(c)) >>> 0;
    var who = pool[mix32(h ^ 0x1b873593) % pool.length];
    return { person: who, key: keyFor(who), role: role.name || null,
             faction: want, traits: roleTraits(role), req: !!role.req };
  }
  function keyFor(p) { return (p && (p.key || p.id)) || ''; }
  /* *** castQuest IS GONE, AND ITS RULES LIVE IN castAddresses. ***
     It cast every role against ONE roster: the right shape while a cast meant
     "who on the block under your feet", and the wrong shape the moment a quest
     got an address per role. Keeping it would have meant the REQ-FIRST ordering
     and the ONE-PERSON-ONE-PART dedupe written down in two places, which is the
     bug this lane has now paid for four times in a week -- and organ_reach put a
     number on it the same run: nothing on the walked surface called it any more.
     A FUNCTION WHOSE JOB WAS ABSORBED IS NOT A SPARE, IT IS AN ORPHAN.
     Every claim that was written against it still runs, against castAddresses
     with a one-block world, so the hard-won ones (a block of ONE person proves
     the dedupe; one body proves REQ beats OPT) now exercise the code the game
     actually runs. */

  /* ---- THE DAY'S JOB HAS AN ADDRESS -------------------------------------
     MEASURED ON THE WALKED CITY BEFORE THIS WAS WRITTEN, from the block the
     player actually wakes up on:
       within 3 blocks   23 people, ZERO of them running with anybody
       nearest TRADES    5 blocks  (~1.9 km; a block is 384 m)
       nearest NETWORK   6 blocks  (~2.3 km)
       the TRADES BASE   7 blocks  (~2.7 km)
     Day one's quest demands `faction=TRADES` for its one REQUIRED role. So the
     person that quest is about was a two-kilometre walk from the front door, in
     an unnamed direction, with nothing anywhere on screen saying so. That is
     Paolo's dispatch item 2 in one number: A QUEST THAT IS NOT ATTACHED TO A
     PLACE IS NOT A QUEST.

     AND THE FIRST CUT OF CASTING MADE IT WORSE WITHOUT LOOKING WRONG. It cast
     against whatever block you were standing on, so "the fixer" was a different
     person on every block, and the row honestly said "on this block". A quest
     whose cast changes when you cross the street is not a quest, it is a mood.

     SO THE CAST GETS AN ADDRESS, FOUND ONCE. Deterministic: rings in order,
     blocks inside a ring sorted, first win kept. Nothing is relaxed to make a
     hit -- no candidate in range means NULL, and null still means the outfit is
     not here rather than a stranger being handed an insider's part.

     `peopleAt(bx, by)` is the caller's: the walked city knows who stands where
     and which outfit they run with, and this module must not learn a second
     idea of either.

     *** AND THE FIRST VERSION OF THIS WAS WRONG, AND THE VALLEY SAID SO. ***
     It looked for ONE block that could fill EVERY required role, which works for
     a quest with one outfit in it and fails for every other kind. Measured
     across the five demo days the moment it was built:
         day 1  lineman=TRADES                              cast, 5 blocks out
         day 2  neighbor (no outfit)                        cast, right here
         day 3  red_boss=REDS + blue_boss=BLUES             NOTHING
         day 4  VOLUNTEERS + TRADES + NETWORK               NOTHING
         day 5  VOLUNTEERS + TRADES + BLUES                 NOTHING
     Three of the five demo days could not be cast at all, and the world was
     right: THREE OUTFITS NEVER SHARE A BLOCK -- that is what holding territory
     MEANS. A quest that demands three of them is not a quest with an address, it
     is a quest that spans the city. So a quest does not have AN address, IT HAS
     ONE PER ROLE, and going from one to the other IS the job.

     AND EACH ROLE IS LOOKED FOR WHERE ITS PEOPLE ACTUALLY ARE. Ringing outward
     from the player finds nobody, because affiliation clusters on faction
     ground: measured, 11 of the valley's 14 outfits have a real member within
     TWO BLOCKS of their own base, and the three that do not (two of them on
     ground holding 2 and 8 people across 81 blocks) get a null rather than a
     stand-in. The caller says where to start looking; this decides who. */
  function castAddresses(roles, opts) {
    opts = opts || {};
    var peopleAt = opts.peopleAt, originFor = opts.originFor;
    if (!roles || !roles.length || !peopleAt || !originFor) return null;
    var R = (opts.radius == null) ? 3 : Math.max(0, opts.radius | 0);
    /* REQ FIRST, so a required part is never left holding nobody because an
       optional one took the only candidate. */
    var ordered = roles.slice().sort(function (a, b) {
      return (b.req ? 1 : 0) - (a.req ? 1 : 0);
    });
    var out = {}, taken = {};
    for (var i = 0; i < ordered.length; i++) {
      var role = ordered[i];
      var origin = originFor(role);
      if (!origin) continue;
      var got = null;
      for (var r = 0; r <= R && !got; r++) {
        var ring = [];
        for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          ring.push([(origin[0] | 0) + dx, (origin[1] | 0) + dy]);
        }
        /* SORTED, so the answer cannot depend on the order this loop happened to
           walk the ring in. Same trap the caster itself names. */
        ring.sort(function (a, b) { return (a[0] - b[0]) || (a[1] - b[1]); });
        for (var j = 0; j < ring.length && !got; j++) {
          var here = peopleAt(ring[j][0], ring[j][1]);
          if (!here || !here.length) continue;
          var free = here.filter(function (p) { return !taken[keyFor(p)]; });
          var c = castRole(role, free, opts);
          if (!c) continue;
          taken[c.key] = 1;
          c.block = [ring[j][0], ring[j][1]];
          c.rings = r;
          got = c;
        }
      }
      if (got) out[role.name] = got;
    }
    return out;
  }

  /* WHAT THE QUEST SAYS THIS PERSON IS, IN ENGLISH.
     The conferred half of a role has been computed since casting shipped and
     shown NOWHERE: roleTraits() returns the predicates that are not a faction,
     and they are the most interesting sentence a quest ever writes about a
     stranger. MEASURED ACROSS THE CORPUS: 69 conferred predicates on 64 roles,
     and 58 of them are `some_words_here=true`, which is already a phrase --
     "keeps the tunnel", "wronged the dying", "named on the board", "near the
     end". The other 11 are bare flags (`block=browned`, `met_before=false`) that
     read as machine, so they are DROPPED rather than mangled into prose. A row
     that is absent when there is nothing good to say beats a row that is always
     there and usually gibberish. */
  function traitWords(traits) {
    var out = [];
    (traits || []).forEach(function (t) {
      var m = /^([a-z_]+)=(\w+)$/.exec(String(t));
      if (!m) return;
      if (m[2] !== 'true') return;                 /* a flag, not a description */
      if (m[1].indexOf('_') < 0) return;           /* one word is a switch, not a phrase */
      out.push(m[1].replace(/_/g, ' '));
    });
    return out;
  }

  /* WHICH WAY, IN THE WORDS THE GAME ALREADY SPEAKS. The card's WORKS row has
     said NORTH / SOUTH / EAST / WEST since the 7/31 address book, so a direction
     is not new vocabulary here, it is the same vocabulary pointed at a job. */
  var BEARINGS = [['NORTH', 'NORTH EAST', 'EAST', 'SOUTH EAST'],
                  ['SOUTH', 'SOUTH WEST', 'WEST', 'NORTH WEST']];
  function bearingOf(from, to) {
    var dx = (to[0] | 0) - (from[0] | 0), dy = (to[1] | 0) - (from[1] | 0);
    if (!dx && !dy) return null;
    var ax = Math.abs(dx), ay = Math.abs(dy);
    /* diagonal only when both legs are real, so "north east" means it, and one
       stray block sideways does not turn a straight walk into a diagonal. */
    var diag = ax && ay && Math.min(ax, ay) * 2 >= Math.max(ax, ay);
    if (diag) return (dy < 0 ? 'NORTH ' : 'SOUTH ') + (dx > 0 ? 'EAST' : 'WEST');
    if (ax > ay) return dx > 0 ? 'EAST' : 'WEST';
    return dy > 0 ? 'SOUTH' : 'NORTH';
  }
  /* THE SENTENCE HE READS. draft:true -- these are my words until he retypes
     them, and they carry no arrow on purpose: the research is unanimous that a
     marker deletes the place it points at, and Bohemia is a city with no working
     phones, so a compass that always knows would be the strangest object in it.
     A direction, a rough distance, and what the ground is. */
  /* WHAT TO CALL THE GROUND OUT LOUD. The overmap's district words are types
     ('industrial', 'arterial', 'railyard'), and a type is not a thing a person
     says. These are the same places in a mouth. Every one is draft:true and his
     to retype; anything not listed falls through to its own word rather than
     going silent, because a missing entry must never cost him the direction. */
  var GROUND_WORDS = {
    suburb: 'the houses', gated: 'the walled-off houses', estate: 'the big houses',
    downtown: 'the towers', commercial: 'the shopfronts', mall: 'the mall',
    industrial: 'the workshops', railyard: 'the rail yard', rail: 'the tracks',
    arterial: 'the big road', freeway: 'the freeway', beltway: 'the ring road',
    interchange: 'the overpass', wash: 'the wash', water: 'the water',
    park: 'the park', golf: 'the old fairways', desert: 'the open desert',
    mountain: 'the hills', strip: 'the Strip', resort: 'the resorts',
    casino: 'the casino', stadium: 'the stadium', speedway: 'the speedway',
    convention: 'the convention halls', waterpark: 'the waterpark',
    airport: 'the airport', airbase: 'the airbase', campus: 'the campus',
    school: 'the school', medical: 'the hospital', solar: 'the solar farm',
    dam: 'the dam', town: 'the old town', minigp: 'the go-kart track'
  };
  function addressLine(from, to, ground) {
    if (!from || !to) return null;
    var b = bearingOf(from, to);
    var n = Math.max(Math.abs(to[0] - from[0]), Math.abs(to[1] - from[1]));
    var g = ground ? (GROUND_WORDS[String(ground).toLowerCase()]
                      || ('the ' + String(ground).replace(/_/g, ' '))) : null;
    if (!b || !n) return g ? ('right here, by ' + g) : 'right here';
    var far = (n === 1) ? 'a block' : (n + ' blocks');
    var s = far + ' ' + b.toLowerCase();
    if (g) s += ', out by ' + g;
    return s;                                                   /* draft:true */
  }

  /* THE CARD WORDS FOR A REGISTER. Plain English on purpose: this row is the
     game telling the player a fact about somebody, which is required
     information, and required information is English. */
  function speaksLineOf(person) {
    var l = person && person.lang;
    return (LANG[l] || LANG.en).card;
  }
  // the small line under the heading: pure mechanism, no character in it
  function seatLineOf(person) {
    if (!person || person.household.house < 0) return '';
    var s = 'HOUSE ' + (person.household.house + 1);
    var n = person.household.size;
    if (n) {
      s += ' · ' + (ORDINALS[person.household.slot] || (person.household.slot + 1) + 'TH');
      s += ' OF ' + (COUNTWORDS[n] || n);
    }
    return s;
  }

  // ---- THE DAY IS NOT FOR READING (Paolo 7/31, LOCKED) ---------------------
  // There WAS a day-line helper here, and a THEIR DAY row on the card that read
  // "OUT 06:25 · HOME 16:58". It shipped about an hour before he ruled:
  //   "it will all be invisible information."
  // laws/BOHEMIA_ADDENDUM_NOBODY_HAS_A_NAME_UNTIL_YOU_ASK_7_31_26.md, ruling 1:
  // the game NEVER displays a person's schedule, routine, day shape or working
  // hours. The system exists to be FELT — the street is busy at eleven and dead
  // at two — and never to be READ. You learn a neighbour's hours by being on the
  // street at different hours, which is the only way anybody has ever learned a
  // neighbour's hours in real life.
  //   IT IS DELETED RATHER THAN HIDDEN, and this note is here so the next
  //   session does not helpfully put it back. THE LINE IS TENSE: present tense
  //   is eyesight and stays legal (nowLineOf, below). Future or habitual tense
  //   is a timetable and is banned.
  //   Gate: gates/invisible_schedule_gate.js, which carried a dated waiver for
  //   this exact row until this turn removed the row and the waiver together.

  // ---- WHERE THEY ARE, RIGHT NOW -------------------------------------------
  function nowLineOf(agent, turn) {
    var b = whereAt(agent, turn || 0);
    if (!b) return null;
    return ACT_WORDS[b.act] || String(b.act || '').toUpperCase();
  }
  // local copy of the agents module's lookup so a gate can test this file alone
  function whereAt(agent, turn) {
    var s = (agent && agent.sched) || []; if (!s.length) return null;
    var t = ((turn % 1440) + 1440) % 1440;
    for (var i = 0; i < s.length; i++) if (t >= s[i].t0 && t < s[i].t1) return s[i];
    return s[s.length - 1];
  }

  // ---- WHAT THEY DO FOR A LIVING -------------------------------------------
  var COMPASS = { N: 'NORTH', S: 'SOUTH', E: 'EAST', W: 'WEST' };
  function workLineOf(person) {
    var j = person && person.work;
    if (!j) return 'UNKNOWN';
    if (j.kind !== 'site' || !j.district) return 'SCAVENGES THIS BLOCK';
    var s = String(j.district).replace(/_/g, ' ').toUpperCase();
    if (j.dir) s += ', ' + (COMPASS[j.dir] || String(j.dir).toUpperCase());
    return s;
  }

  // ---- THE CARD ------------------------------------------------------------
  // Every row is a FACT THE SIM ALREADY KNOWS, rendered. Nothing here is
  // authored character: no opinions, no history, no voice. That is the line
  // this lane may not cross without him, and it is why the NAME row says what
  // it says instead of quietly hiding an empty table.
  function cardFor(person, agent, turn, met) {
    var rows = [];
    /* THE ROW THE WHOLE RULING LANDS ON. A stranger's name is not blank and not
       hidden — it says you have not asked, because the missing thing IS the
       mechanic and hiding it would make the card look finished when it is not. */
    rows.push({ label: 'NAME',
                value: nameOf(person) || 'YOU HAVE NOT ASKED' });
    if (person && person.household.house >= 0) {
      rows.push({ label: 'LIVES', value: 'HOUSE ' + (person.household.house + 1) + ' ON THIS BLOCK' });
    }
    /* WHAT YOU CAN HEAR WITHOUT ASKING ANYTHING (8/25, LANG-1). This row is the
       exact opposite of the NAME row above and that is why it belongs next to
       it: a name is a thing you have to be GIVEN, and a language is a thing you
       already have. You have been standing in front of them while they talk.
       It is present-tense eyesight, not a timetable, so THE DAY IS NOT FOR
       READING (7/31) is satisfied the same way RIGHT NOW is. */
    rows.push({ label: 'SPEAKS', value: speaksLineOf(person) });
    rows.push({ label: 'WORKS', value: workLineOf(person) });
    /* EYESIGHT, NOT A TIMETABLE. Where somebody is RIGHT NOW, while you are
       standing in front of them, is the only tense the ruling allows. */
    var now = nowLineOf(agent, turn);
    if (now) rows.push({ label: 'RIGHT NOW', value: now });
    rows.push({ label: 'YOU HAVE MET', value: metWords(met) });
    return rows;
  }
  function metWords(met) {
    var n = (met && met.times) || 0;
    if (n <= 1) return 'FIRST TIME';
    if (n === 2) return 'ONCE BEFORE';
    return (n - 1) + ' TIMES BEFORE';
  }

  // ---- THE MEETING LEDGER --------------------------------------------------
  // The smallest honest memory: has this person met you, how many times, and on
  // which world-day first and last. Keyed by the derived key, so it survives the
  // sim being thrown away and rebuilt. Serialises to a plain object because it
  // rides inside the run's existing save blob and a save has to load on another
  // device (no Maps, no class instances, no undefined).
  function makeLedger(data) {
    var m = {};
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(function (k) {
        var v = data[k];
        if (!v || typeof v !== 'object') return;
        m[k] = { times: v.times | 0, first: v.first | 0, last: v.last | 0,
               asked: v.asked ? 1 : 0, honest: v.honest ? 1 : 0,
               answered: v.answered ? 1 : 0 };
      });
    }
    return {
      get: function (key) { return m[key] || null; },
      times: function (key) { return (m[key] && m[key].times) || 0; },
      // returns the record AS IT NOW STANDS, so a caller can render "first time"
      // on the very meeting that made it no longer the first time.
      meet: function (key, day) {
        if (!key) return null;
        day = day | 0;
        var r = m[key];
        if (!r) { r = m[key] = { times: 0, first: day, last: day, asked: 0, honest: 0, answered: 0 }; }
        r.times++; r.last = day;
        return r;
      },
      /* YOU ASKED, AND THE GAME REMEMBERS — the half of the ruling he called
         "really cool". One bit, because the name is derived from it. */
      ask: function (key, day) {
        if (!key) return null;
        var r = m[key] || (m[key] = { times: 1, first: day | 0, last: day | 0, asked: 0, honest: 0, answered: 0 });
        r.asked = 1; r.last = day | 0;
        return r;
      },
      asked: function (key) { return !!(m[key] && m[key].asked); },
      /* THE SECOND BIT, and it exists because the Homeless do not want your name,
         they want to know where you sleep (records/factions/BOHEMIA_FACTION_
         HOMELESS.md, canon 8/2). Answering honestly is what earns THEIR name, so
         the honest answer has to survive a save exactly the way asking does, or
         the mechanic resets every time he reloads. Still one bit: what you told
         them is derived, only THAT you told them the truth is stored.

         SECOND BIT ADDED 8/13, and it is the difference between "has not answered"
         and "answered and lied". honest:0 meant both, so a person you had lied to
         was indistinguishable from a person you had never spoken to -- and the
         REACTIONS table has a `met:lied` bucket that could therefore NEVER FIRE.
         A key the sim never emits is a line that can never fire; the fix is on
         the emitting side, never a line quietly deleted from the table. The
         boolean was already arriving here and being thrown away. */
      answer: function (key, day, honest) {
        if (!key) return null;
        var r = m[key] || (m[key] = { times: 1, first: day | 0, last: day | 0, asked: 0, honest: 0, answered: 0 });
        r.answered = 1; r.honest = honest ? 1 : 0; r.last = day | 0;
        return r;
      },
      honest: function (key) { return !!(m[key] && m[key].honest); },
      answered: function (key) { return !!(m[key] && m[key].answered); },
      lied: function (key) { return !!(m[key] && m[key].answered && !m[key].honest); },
      namesKnown: function () {
        var n = 0; for (var k in m) if (m[k].asked) n++; return n;
      },
      known: function () { return Object.keys(m).length; },
      serialize: function () { return JSON.parse(JSON.stringify(m)); },
      /* THE ONE PLACE THE met: BUCKETS ARE CHOSEN, and it lives with the ledger
         that owns the bits rather than in whichever surface happens to be
         drawing a card. A caller that has to re-derive "have we met" invents its
         own answer sooner or later, and then two screens disagree about the same
         person. Most specific first, and every branch reads a bit that is
         actually stored and actually saved. */
      metState: function (key) {
        var r = m[key];
        if (!r) return 'first';
        if (r.answered && !r.honest) return 'lied';
        if (r.answered && r.honest) return 'honest';
        if (r.asked) return 'asked';
        if (r.times >= 4) return 'known';
        if (r.times >= 2) return 'again';
        return 'first';
      }
    };
  }

  var API = {
    VERSION: '7.31.26',
    KNOWN_AT_START: KNOWN_AT_START, NAMED_CAST: NAMED_CAST, LINES: LINES,
    GIVEN: GIVEN, SURNAME: SURNAME, generatedName: generatedName,
    ROLE_WORDS: ROLE_WORDS, ACT_WORDS: ACT_WORDS,
    hash: hash, keyOf: keyOf, seatOf: seatOf,
    // LANG-1 (8/25): what somebody speaks, derived exactly like their name.
    LANG: LANG, LANG_ORDER: LANG_ORDER,
    ES_LEX: ES_LEX, ES_ONLY: ES_ONLY, ES_CLITIC: ES_CLITIC,
    esWordsIn: esWordsIn, esStems: esStems,
    VALLEY_MIX: VALLEY_MIX, BARRIO_MIX: BARRIO_MIX, REST_MIX: REST_MIX,
    BARRIO_SHARE: BARRIO_SHARE, blockMixOf: blockMixOf, COUNTY_SPANISH: COUNTY_SPANISH,
    langOf: langOf, speaksLineOf: speaksLineOf,
    // CASTING (8/26): a quest role becomes a real person on real ground.
    roleFaction: roleFaction, roleTraits: roleTraits,
    castRole: castRole,
    // THE ADDRESS (8/26): one block PER ROLE, found once, and which way it is.
    castAddresses: castAddresses, bearingOf: bearingOf, addressLine: addressLine,
    traitWords: traitWords,
    personOf: personOf, peopleOf: peopleOf,
    nameOf: nameOf, headingOf: headingOf, addressOf: addressOf, seatLineOf: seatLineOf,
    tradeOf: tradeOf,
    nowLineOf: nowLineOf, workLineOf: workLineOf,
    whereAt: whereAt, cardFor: cardFor, metWords: metWords,
    makeLedger: makeLedger, clock: clock, REACTIONS: REACTIONS, REACTIONS: REACTIONS, REACTIONS: REACTIONS, REACTIONS: REACTIONS,
    // what a person says when no quest is talking. FILLED 8/12 by
    // tools/bohemia_bark_factory.py, every line a draft he can retype in WORDS.
    linesFor: function (person, opts) {
      if (!person) return [];
      /* MOST SPECIFIC FIRST. A person's KEY beats their role-and-what-they-are-
         doing, which beats their role, which beats their faction, which beats
         the situation. `at` is the schedule's own act word (sleep/home/work/
         free/scav/errand/watch) so the world's existing mechanism picks the
         line and this module still invents nothing. */
      var at = (opts && opts.at) || person.act || null;
      var fac = (opts && opts.faction) || person.faction || null;
      var when = (opts && opts.when) || null;
      /* *** A REACTION BEATS AN AMBIENT LINE, ALWAYS. *** Somebody who watched
         you do something reckless yesterday does not open with the weather.
         Most specific first: what they SAW, then what they HEARD, then where
         you STAND with them, then what they remember of you, and only then
         the ambient buckets. Every one of these is a value a shipped module
         already computes -- nothing here invents a fact about the player. */
      var saw = (opts && opts.saw) || null;      // deeds.witness(), by clout
      var heard = (opts && opts.heard) || null;  // same, reached by gossip
      var rung = (opts && opts.rung) || null;    // standing.js RUNGS
      var met = (opts && opts.met) || null;      // people.js makeLedger
      /* *** AND IT COMES OUT IN THE LANGUAGE THEY SPEAK (8/25, LANG-1). ***
         Every bucket below is tried in the person's REGISTER first and in plain
         English second, so a Spanglish neighbour says the Spanglish version of
         the line their role and their hour would have given them anyway, and a
         bucket nobody has written a register for still speaks. THE FALLBACK IS
         THE HARD RULE IN ONE LINE: the failure mode of a missing translation is
         ENGLISH, never silence, so no bucket can ever go mute by gaining a
         register. Ambient barks carry no required information by construction
         (Q056.W8: nobody here explains the collapse), which is what makes this
         the safe place for language to live and the objective line the unsafe
         one. */
      var reg = (opts && opts.lang) || (person && person.lang) || 'en';
      function bucket(k) { return k ? (LINES[k + '@' + reg] || LINES[k]) : null; }
      /* AND A REACTION IS IN THEIR MOUTH TOO. This is the half that would have
         made the register QUIETLY WEAKEN THE MORE YOU PLAY: a reaction outranks
         every ambient bucket below, so the moment a Spanglish neighbour knows
         who you are, an English-only reaction table would have taken their voice
         away again. Same shape as bucket(), same English fallback, same reason. */
      function react(k) { return k ? (REACTIONS[k + '@' + reg] || REACTIONS[k]) : null; }
      var pick = (saw && react('saw:' + saw))
        || (heard && react('heard:' + heard))
        || (rung && react('rung:' + rung))
        || (met && react('met:' + met))
        || bucket(person.key)
        || (at && bucket(person.role + ':' + at))
        || bucket(person.role)
        || (fac && bucket('faction:' + fac))
        || (when && bucket('when:' + when))
        || [];
      return pick.slice();
    }
  };
  if (HASREQ) module.exports = API;
  root.BohemiaPeople = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
