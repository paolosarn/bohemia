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

  // ---- THE LINES TABLE — EMPTY (CONTENTS-PAOLO'S) --------------------------
  // key (or role) -> [what they say]. This lane builds the MOUTH, not the words
  // (doctrine §6). Quest dialogue already has a home: the .bq corpus, played by
  // bohemia_quest_runtime.js. This table is for what a person says when NO quest
  // is talking, and nothing may fill it but him.
  var LINES = {};

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
     fix is that the run stops doing grammar. */
  function addressOf(person, verb) {
    verb = verb || 'TALK TO';
    return nameOf(person) ? verb + ' ' + headingOf(person)
                          : verb + ' THE ' + headingOf(person);
  }
  /* WHAT THE GAME CALLS THEM TO YOUR FACE. A stranger is their trade; somebody
     you asked is their first name, because that is how you would actually think
     of a neighbour once you had it. */
  function headingOf(person) {
    if (!person) return 'SOMEBODY';
    var n = nameOf(person);
    if (n) return String(n).split(' ')[0].toUpperCase();
    return ROLE_WORDS[person.role] || 'SOMEBODY';
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
               asked: v.asked ? 1 : 0, honest: v.honest ? 1 : 0 };
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
        if (!r) { r = m[key] = { times: 0, first: day, last: day, asked: 0, honest: 0 }; }
        r.times++; r.last = day;
        return r;
      },
      /* YOU ASKED, AND THE GAME REMEMBERS — the half of the ruling he called
         "really cool". One bit, because the name is derived from it. */
      ask: function (key, day) {
        if (!key) return null;
        var r = m[key] || (m[key] = { times: 1, first: day | 0, last: day | 0, asked: 0, honest: 0 });
        r.asked = 1; r.last = day | 0;
        return r;
      },
      asked: function (key) { return !!(m[key] && m[key].asked); },
      /* THE SECOND BIT, and it exists because the Homeless do not want your name,
         they want to know where you sleep (records/factions/BOHEMIA_FACTION_
         HOMELESS.md, canon 8/2). Answering honestly is what earns THEIR name, so
         the honest answer has to survive a save exactly the way asking does, or
         the mechanic resets every time he reloads. Still one bit: what you told
         them is derived, only THAT you told them the truth is stored. */
      answer: function (key, day, honest) {
        if (!key) return null;
        var r = m[key] || (m[key] = { times: 1, first: day | 0, last: day | 0, asked: 0, honest: 0 });
        r.honest = honest ? 1 : 0; r.last = day | 0;
        return r;
      },
      honest: function (key) { return !!(m[key] && m[key].honest); },
      namesKnown: function () {
        var n = 0; for (var k in m) if (m[k].asked) n++; return n;
      },
      known: function () { return Object.keys(m).length; },
      serialize: function () { return JSON.parse(JSON.stringify(m)); }
    };
  }

  var API = {
    VERSION: '7.31.26',
    KNOWN_AT_START: KNOWN_AT_START, NAMED_CAST: NAMED_CAST, LINES: LINES,
    GIVEN: GIVEN, SURNAME: SURNAME, generatedName: generatedName,
    ROLE_WORDS: ROLE_WORDS, ACT_WORDS: ACT_WORDS,
    hash: hash, keyOf: keyOf, seatOf: seatOf,
    personOf: personOf, peopleOf: peopleOf,
    nameOf: nameOf, headingOf: headingOf, addressOf: addressOf, seatLineOf: seatLineOf,
    nowLineOf: nowLineOf, workLineOf: workLineOf,
    whereAt: whereAt, cardFor: cardFor, metWords: metWords,
    makeLedger: makeLedger, clock: clock,
    // what a person says when no quest is talking. EMPTY until he writes them:
    // an empty list is honest, and a placeholder line becomes canon by shipping.
    linesFor: function (person) {
      if (!person) return [];
      return (LINES[person.key] || LINES[person.role] || []).slice();
    }
  };
  if (HASREQ) module.exports = API;
  root.BohemiaPeople = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
