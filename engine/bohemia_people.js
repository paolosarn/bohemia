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
// LAWS THIS OBEYS (none new):
//   MECHANISM-MINE / CONTENTS-PAOLO'S — the two content tables ship EMPTY and
//     people_gate.js fails if either gains a row. NAMED_CAST is who the valley's
//     named people ARE; LINES is what anybody SAYS. Both are his, and the
//     realistic way they get violated is not malice, it is a future session
//     adding "a couple of placeholder names so it can be tested" and the
//     placeholder becoming canon by shipping. (Same failure the WORLD lane
//     gated the purse's PAYOUT table against on 7/31.)
//   NO NAMES (bohemia_agents.js:24, unrepealed) — "character names are Paolo's.
//     Agents carry mechanical designations until he names the world." So this
//     module does NOT generate names. nameOf() returns null for every person
//     alive today, and headingOf() falls back to the engine's OWN four role
//     words. There is no name bank in this file and the gate sweeps for one.
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

  // ---- THE NAMED CAST — EMPTY (CONTENTS-PAOLO'S) ---------------------------
  // key -> {name, ...}. When Paolo says who the valley's named people are, rows
  // land here and nameOf() starts returning them. There is no procedural name
  // generator below this table and there must never be one without his ruling:
  // a generated name is indistinguishable from canon three sessions later.
  var NAMED_CAST = {};

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
    var canon = NAMED_CAST[key] || null;
    return {
      key: key,
      // NAMED is the tier Paolo fills. PROCEDURAL is everyone else, and
      // "procedural" here means their FACTS are generated — never their name.
      tier: canon ? 'named' : 'procedural',
      name: canon ? canon.name : null,
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
  function peopleOf(blockSeed, agents) {
    var sizes = {};
    (agents || []).forEach(function (a) {
      var h = seatOf(a).house; sizes[h] = (sizes[h] || 0) + 1;
    });
    return (agents || []).map(function (a) {
      return personOf(blockSeed, a, { householdSize: sizes[seatOf(a).house] });
    });
  }

  // ---- WHAT YOU CALL THEM --------------------------------------------------
  // A name if he has ruled one, otherwise the engine's own role word. NEVER an
  // invention. If a role ever arrives that this file does not know, it says
  // SOMEBODY rather than guessing at them.
  function nameOf(person) { return (person && person.name) || null; }
  function headingOf(person) {
    if (!person) return 'SOMEBODY';
    if (person.name) return String(person.name).toUpperCase();
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

  // ---- THE DAY, IN ONE LINE ------------------------------------------------
  // Straight off the agent's own schedule blocks. This is the single most
  // person-making fact available: two bodies with the same look are two
  // different people the moment one of them leaves at 06:10 and the other at
  // 08:45. (The 7/29 archetype work made 296 of 297 days distinct; nothing has
  // ever SHOWN one to the player.)
  function dayLineOf(agent) {
    var s = (agent && agent.sched) || [];
    var out = null, back = null;
    for (var i = 0; i < s.length; i++) {
      if (s[i].where === 'home') continue;
      if (out === null) out = s[i].t0;
      back = s[i].t1;
    }
    if (out === null) return 'HOME ALL DAY';
    return 'OUT ' + clock(out) + ' · HOME ' + clock(back);
  }

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
    rows.push({ label: 'NAME', value: person && person.name ? person.name : 'NOT NAMED YET' });
    if (person && person.household.house >= 0) {
      rows.push({ label: 'LIVES', value: 'HOUSE ' + (person.household.house + 1) + ' ON THIS BLOCK' });
    }
    rows.push({ label: 'WORKS', value: workLineOf(person) });
    var now = nowLineOf(agent, turn);
    if (now) rows.push({ label: 'RIGHT NOW', value: now });
    rows.push({ label: 'THEIR DAY', value: dayLineOf(agent) });
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
        m[k] = { times: v.times | 0, first: v.first | 0, last: v.last | 0 };
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
        if (!r) { r = m[key] = { times: 0, first: day, last: day }; }
        r.times++; r.last = day;
        return r;
      },
      known: function () { return Object.keys(m).length; },
      serialize: function () { return JSON.parse(JSON.stringify(m)); }
    };
  }

  var API = {
    VERSION: '7.31.26',
    NAMED_CAST: NAMED_CAST, LINES: LINES,
    ROLE_WORDS: ROLE_WORDS, ACT_WORDS: ACT_WORDS,
    hash: hash, keyOf: keyOf, seatOf: seatOf,
    personOf: personOf, peopleOf: peopleOf,
    nameOf: nameOf, headingOf: headingOf, seatLineOf: seatLineOf,
    dayLineOf: dayLineOf, nowLineOf: nowLineOf, workLineOf: workLineOf,
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
