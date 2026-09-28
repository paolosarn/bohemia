// BOHEMIA ORIGINS -- WHO YOU WERE THE DAY THE MONEY DIED
// (9/27/26, PEOPLE lane. VAMILY [origins], row WHO-YOU-WERE-THE-DAY-THE-MONEY-DIED.)
//
// PAOLO 9/27: "origins at different difficulties."
// Rule 36c, laws/BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md s3:
//   "ORIGINS: the company's starting story sets rules, not just the start
//    (Battle Brothers: the Peasant Militia, the Lone Wolf, the Cultists...).
//    Ours: who you were the day the money died (the lineman's crew, the casino
//    floor, the ex-cons, the nurse's ward), each at a stated DIFFICULTY.
//    PEOPLE writes the origins (the people), TUNING the difficulties."
//
// ============================================================================
// THE SCHOOL: WHAT A BATTLE BROTHERS ORIGIN CHANGES BEYOND THE START
// ============================================================================
// An origin in that game is not a difficulty setting with a story on it. The
// ones players remember change a RULE THAT IS TRUE FOR THE WHOLE RUN:
//
//   WHO YOU CAN EVER HIRE   the Peasant Militia cannot take professionals, ever;
//                           the Cultists are closed to whole backgrounds. That is
//                           a permanent shape on your roster, not a poor start.
//   WHAT WORK YOU CAN TAKE  the Beast Hunters are paid differently for beasts and
//                           for men; the Manhunters lose contracts outright.
//   WHO WILL DEAL WITH YOU  the Northern Raiders begin at war with people other
//                           companies trade with.
//   A RULE ONLY YOU HAVE    the Cultists sacrifice their own and are paid in a
//                           way nobody else is; the Lone Wolf is ONE man, so the
//                           whole risk of the game is a different shape.
//
// *** AND THE LESSON IS THE SHARPEST THING IN THE WHOLE SUBJECT: ***
//
//      AN ORIGIN THAT ONLY CHANGES A NUMBER IS A DIFFICULTY SETTING.
//      AN ORIGIN THAT CHANGES A RULE IS A DIFFERENT GAME.
//
// The weak Battle Brothers origins are the ones that hand you less money and the
// same game. The remembered ones take something away for ever and give you a way
// to live without it. A stated difficulty is the CONSEQUENCE of that rule, not
// the point of it, and this module therefore MEASURES the difficulty instead of
// labelling it -- see below, and see what that measurement found.
//
// ============================================================================
// *** MEASURED BEFORE A LINE OF THIS WAS WRITTEN: THREE OF HIS FOUR ORIGINS
// ARE ALREADY WRITTEN INTO THIS GAME'S DATA, AND THE FOURTH IS THE ONLY ONE
// THAT NEEDED ANYTHING NEW. ***
// ============================================================================
// bohemia_people.js has carried WAS_WORDS since 9/6: fifteen former trades, each
// with what somebody WAS, what they still KEEP, and a line they say. Laid beside
// the four names he spoke, on the alpha, 61 of 61 people carrying one:
//
//   THE CASINO FLOOR   is the table's entire `front` house -- dealer, valet, pit
//                      boss, floor man -- AND ALL FOUR OF THEM CARRY keeps:null.
//                      Somebody wrote that on 9/6 for a different reason ("the
//                      trade died and the empty half has to be visible or the
//                      joke is not there") and it is this origin's whole rule,
//                      sitting in the data, a fortnight early.
//   THE LINEMAN'S CREW is the machine half -- high voltage, the boilers, the
//                      water plant, engines -- and every one of them keeps
//                      something that still works.
//   THE NURSE'S WARD   is the people half -- the ward, a kitchen that feeds a
//                      crowd off nothing, a laundry, a teacher.
//   THE EX-CONS        IS NOT IN THE TABLE AT ALL. Fifteen trades and not one
//                      convict, because the table was written as a list of JOBS
//                      and being inside is not a job. It is the only one of the
//                      four that needs a rule written rather than read.
//
// SO THE DIFFICULTY IS NOT A LABEL I PICKED. It is counted: what share of your
// starting crew still keeps something the valley can use. The casino floor scores
// ZERO by the table's own hand, which makes it the hard one, and it is hard for a
// reason the player can hear in his own crew's mouths rather than read off a menu.
//
// ============================================================================
// WHAT IS DELIBERATELY NOT HERE
// ============================================================================
// - NO DIFFICULTY NUMBERS. The law says TUNING owns those. This publishes the
//   MEASUREMENT they need (keepShare, crew size, what is missing) and picks none.
// - NO NAMES OF PEOPLE. The name bank is 90 given by 98 surnames and it already
//   works; an origin asks for a crew and the caller names them the way the rest
//   of this game names anybody. Names are his.
// - NO STARTING MONEY, NO WAGE, NO GEAR. Batteries are the money and the price of
//   keeping somebody is ruled and is FACTIONS' row [take them on].
// - NO NEW TRADE except the one the measurement proved missing, and it is marked.
// - NO ROSTER. An origin is a QUESTION you ask the trade table, every call, the
//   same rule bohemia_company.js paid for.
//
// REUSE CHECK: cooks no pixels, opens no bank, writes no save, moves nobody, adds
// no verb, owns no list, and reads the trade table it does not own.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* ==================================================================== */
  /*  THE FOUR, IN HIS WORDS. draft:true on every line of prose.          */
  /* ==================================================================== */
  /* `trades` names rows of WAS_WORDS by id. THE SELECTION IS AN ATTEMPT and is
     tagged as one; WHICH TRADES belong to which origin is the kind of thing he
     corrects by playing. What is NOT an attempt is the casino floor's rule --
     that one is read straight off the table's own keeps:null. */
  var ORIGINS = [
    {
      id: 'lineman',
      name: 'THE LINEMAN\'S CREW',                              /* his words */
      was: 'You kept the power on.',                             /* draft:true */
      trades: ['sparks', 'plant', 'water', 'wrench'],
      rule: 'Every one of you can still make something work.',   /* draft:true */
      costs: 'Nobody taught you how to talk to people who are not on your crew.'
    },
    {
      id: 'casino',
      name: 'THE CASINO FLOOR',                                  /* his words */
      was: 'You worked the Strip.',                              /* draft:true */
      trades: ['dealer', 'valet', 'pit', 'floor'],
      /* *** NOT AN ATTEMPT. The table says these four keep nothing and it said
         so before this origin existed. *** */
      rule: 'Your whole trade died with the city. You keep nothing it can use.',
      costs: 'You read a room better than anybody alive, and nobody is paying.'
    },
    {
      id: 'ward',
      name: 'THE NURSE\'S WARD',                                 /* his words */
      was: 'You kept people alive.',                             /* draft:true */
      trades: ['nurse', 'kitchen', 'laundry', 'teacher'],
      rule: 'You can keep somebody going that nobody else could.',
      costs: 'You have never once been the one who starts it.'
    },
    {
      id: 'excons',
      name: 'THE EX-CONS',                                       /* his words */
      was: 'You were inside when it happened.',                  /* draft:true */
      /* *** THE MEASUREMENT'S OWN FINDING: THE TABLE HAS NO CONVICT. *** Fifteen
         trades and not one, because it is a list of JOBS and being inside is not
         a job. So this origin's crew is drawn from whatever those men WERE BEFORE
         they went in, which is the honest answer and is also the better story:
         a yard is the one place in the valley that already mixes every trade. */
      trades: null,                                  /* ANY trade: see crewOf */
      rule: 'Nobody outside owes you anything, and you all already know each other.',
      costs: 'The valley remembers what you were in for.'
    }
  ];

  function arr(x) { return Object.prototype.toString.call(x) === '[object Array]' ? x : []; }
  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i];
    return null;
  }

  /* ==================================================================== */
  /*  THE CREW, READ OUT OF THE TRADE TABLE THE CALLER HANDS IN           */
  /* ==================================================================== */
  /* crewOf(origin, WAS_WORDS) -- the trades this origin is made of, as the rows
     themselves. The table is NOT imported: the caller passes it, so this module
     cannot drift from whatever bohemia_people is actually carrying and a gate can
     hand it a doctored table to prove the reading is real. */
  function crewOf(o, table) {
    var t = arr(table);
    if (!o) return [];
    if (o.trades == null) return t.slice();        /* the yard takes everybody */
    var out = [];
    for (var i = 0; i < o.trades.length; i++) {
      var row = byId(t, o.trades[i]);
      if (row) out.push(row);                      /* a trade that is gone is gone */
    }
    return out;
  }

  /* ==================================================================== */
  /*  THE DIFFICULTY, COUNTED RATHER THAN LABELLED                        */
  /* ==================================================================== */
  /* *** THIS IS THE SCHOOL'S LESSON IN CODE. *** An origin that changes a number
     is a difficulty setting; an origin that changes a rule is a different game.
     So nothing here assigns a difficulty. It COUNTS what the origin's own rule
     does to you -- how much of your crew still keeps something the valley can
     use -- and hands TUNING a fact to set their sliders against.
       keeps     how many of your crew kept their trade's use
       crew      how many you start with
       keepShare keeps/crew, 0 to 1
     A HIGHER SHARE IS AN EASIER START. The casino floor reads 0 and does so off
     the table's own hand, not off a judgement of mine. */
  function weightOf(o, table) {
    var crew = crewOf(o, table);
    var keeps = 0, house = {};
    for (var i = 0; i < crew.length; i++) {
      if (!crew[i]) continue;
      if (crew[i].keeps) keeps++;
      var h = crew[i].house || 'unknown';
      house[h] = (house[h] || 0) + 1;
    }
    return {
      id: o ? o.id : null,
      /* *** FOR THE EX-CONS THIS IS A POOL AND NOT A CREW, AND SAYING SO IS THE
         WHOLE REASON THE FIELD IS NAMED. *** A yard mixes every trade, so their
         crew is DRAWN FROM all fifteen; reading 15 as "you start with fifteen
         men" would be a number nobody ruled, arriving by accident. */
      crew: crew.length,
      isPool: (o && o.trades == null),
      keeps: keeps,
      keepShare: crew.length ? (keeps / crew.length) : null,
      /* *** AND THE SECOND AXIS, BECAUSE THE FIRST ONE HONESTLY CANNOT SEPARATE
         TWO OF THE FOUR. *** The lineman's crew and the nurse's ward both read
         1.00: every one of their people kept something. That is not the
         measurement failing, it is the measurement saying those two are alike in
         how much they kept and different in WHAT. The table already knows which:
         `house` is back (kept a machine running), front (served the money, which
         is gone) or off (the city that served the people who worked it). It is
         read, never invented, and TUNING gets both numbers rather than one number
         I padded until it separated things. */
      house: house,
      measured: true,
      /* AND THE THING TUNING IS ASKED NOT TO DO: no number is set here, so a
         slider cannot silently become the design. */
      difficulty: null,
      whoSetsIt: 'TUNING (rule 36c)'
    };
  }

  /* ORDERED HARDEST FIRST, BY THE MEASUREMENT AND NOT BY MY OPINION. Ties keep
     the order they were written in, so this is stable and has no clock in it. */
  function ladder(table) {
    var rows = ORIGINS.map(function (o) { return weightOf(o, table); });
    return rows.slice().sort(function (a, b) {
      var A = (a.keepShare == null) ? 1 : a.keepShare;
      var B = (b.keepShare == null) ? 1 : b.keepShare;
      if (A !== B) return A - B;
      return 0;
    });
  }

  /* ==================================================================== */
  /*  WHAT AN ORIGIN IS, ALL OF IT, FOR A SURFACE                         */
  /* ==================================================================== */
  function read(id, table) {
    var o = byId(ORIGINS, id);
    if (!o) return null;
    var crew = crewOf(o, table);
    return {
      id: o.id, name: o.name, was: o.was,
      rule: o.rule, costs: o.costs,
      crew: crew.map(function (c) {
        return { id: c.id, was: c.was, keeps: c.keeps || null, says: c.says || null };
      }),
      weight: weightOf(o, table),
      /* WHAT IT SOUNDS LIKE, and every word of it is already written into the
         trade table by WORDS on 9/23. An origin does not need new dialogue: it
         needs the right four people standing together. */
      draft: true
    };
  }

  function all(table) {
    return ORIGINS.map(function (o) { return read(o.id, table); });
  }

  /* ids() -- just the four, for a caller that only needs to offer a choice. */
  function ids() { return ORIGINS.map(function (o) { return o.id; }); }

  var API = {
    ORIGINS: ORIGINS,
    ids: ids, read: read, all: all,
    crewOf: crewOf, weightOf: weightOf, ladder: ladder
  };
  if (HASREQ) module.exports = API;
  root.BohemiaOrigins = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
