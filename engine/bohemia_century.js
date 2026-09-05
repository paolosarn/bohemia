// BOHEMIA CENTURY — the city is the game's long memory, so it needs one.
// (9/5/26, LIFE + CITY lane. VAMILY job [century memory] / CENTURY-RECORD:
//  "persist per-act build totals so act 3's city can differ; mechanism ours, every
//   number his".)
//
// THE LAW THIS SERVES IS LOCKED AND ITS LAST SENTENCE IS THE BRIEF.
// laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md, clause 4:
//   "THE CENTURY RULE: dynasty building choices COMPOUND across the three acts
//    (~100 years). Neglect production/power/clout and act three's city is visibly
//    poorer; invest and it's visibly rebuilt. The city is the game's long memory.
//    MECHANISM TO BE DESIGNED; NUMBERS ARE PAOLO'S WHEN THE MECHANISM IS RULED."
// So this file is the mechanism and NOTHING ELSE. It stores what each generation
// did. What counts as poor, what counts as rebuilt, and what act 3 does about it
// are his, and TIERS below is empty and says so.
//
// WHY A LEDGER AND NOT THREE COUNTERS, WHICH IS THE SAME ARGUMENT THE PURSE MAKES
// AND IT IS RIGHT AGAIN HERE. The delta (bohemia_cityedit.js) is the city AS IT
// STANDS. It cannot answer the century question, because a generation that built
// forty homes and a generation that built none look identical the moment a later
// generation knocks them down -- and "the dynasty that built and lost it" is
// exactly the story the century rule exists to tell. THE DELTA IS THE CITY; THIS
// IS WHAT THE FAMILY DID. Entries are the truth and totals are their fold, so no
// number here can drift from the events behind it.
//
// EVERY ENTRY CARRIES ITS ACT, and the act is not invented here either. The walked
// city carries no act today (measured 9/5: its save has no such field; `act: 1..3`
// lives in bohemia_engine.js's save, which the walked surface does not load), and
// THE FOLD FROM ONE GENERATION TO THE NEXT IS ANOTHER LINE'S JOB -- the quests
// queue's [generation handoff] THE-FOLD-IN-THE-RUNTIME, which is PARKED. So this
// defaults to act 1 and offers ONE setter for the fold to call when it exists.
// Inventing a generation handoff to make my own record look finished would be
// building somebody else's job badly.
//
// REUSE CHECK: cooks NO pixels, invents NO district, and does not decide what a
// building is -- a caller hands it the same {type,x,y,w,h} shape
// BohemiaProduction.placed() already returns, which is the unit demolish, produce()
// and housing all count with. Four systems, one idea of a building.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  function HOUSE() {
    if (HASREQ) { try { return require('./bohemia_housing.js'); } catch (e) { return null; } }
    return root.BohemiaHousing || (typeof BohemiaHousing !== 'undefined' ? BohemiaHousing : null);
  }

  var NO_RULING = 'NO_RULING';
  var ACT_MIN = 1, ACT_MAX = 3;              /* three generations, his 7/26 law */

  /* WHAT COUNTS AS A POOR CITY OR A REBUILT ONE IS HIS, AND THIS SHIPS EMPTY.
     Each row would be {act, need:{built:N, housed:N}, look:'...'} and the moment he
     rules one, tierOf() starts answering. A sensible default here would be canon
     nobody wrote, which is the one thing the mechanism/contents split exists to
     stop -- and the law itself says the numbers are his WHEN THE MECHANISM IS
     RULED, which is now, not before. */
  var TIERS = {};

  function make(opts) {
    opts = opts || {};
    return { V: 1, act: clampAct(opts.act || ACT_MIN), entries: [] };
  }

  function clampAct(a) {
    a = a | 0;
    if (a < ACT_MIN) return ACT_MIN;
    if (a > ACT_MAX) return ACT_MAX;
    return a;
  }

  /* THE ONE SETTER, FOR THE FOLD THAT DOES NOT EXIST YET. It refuses to go
     BACKWARDS, because a century that can run in reverse is not a memory. */
  function setAct(rec, a) {
    if (!rec) return ACT_MIN;
    var want = clampAct(a);
    if (want > rec.act) rec.act = want;
    return rec.act;
  }

  /* ---------------------------------------------------------------------------
     THE LEDGER. One entry per thing the family did to the city.
     --------------------------------------------------------------------------- */
  function note(rec, kind, building, day) {
    if (!rec || !rec.entries) return { applied: false, reason: 'NO_RECORD' };
    if (kind !== 'build' && kind !== 'demolish')
      return { applied: false, reason: 'NOT_A_DEED', kind: kind };
    if (!building || !building.type) return { applied: false, reason: 'NOT_A_BUILDING' };
    var H = HOUSE();
    var e = {
      act: rec.act, kind: kind, type: building.type,
      x: building.x | 0, y: building.y | 0,
      w: building.w || 1, h: building.h || 1,
      /* THE HOUSEHOLD IS RECORDED AT THE TIME IT HAPPENED, not looked up later.
         If he ever rules that an apartment holds more than a trailer, the past
         does not silently rewrite itself -- what the family built is what it built
         under the rules of the day, which is what a memory means. */
      people: H ? H.capacityOf(building.type) : 0,
      day: day == null ? 0 : (day | 0),
      seq: rec.entries.length
    };
    rec.entries.push(e);
    return { applied: true, entry: e };
  }

  /* ---------------------------------------------------------------------------
     THE FOLD. Totals are derived, never stored, so they cannot drift.
     --------------------------------------------------------------------------- */
  /* ONE MEANING PER FIELD, AND THE FIRST CUT HAD TWO IN ONE OBJECT.
       built / demolished  what this generation put up and took down
       net                 how much MORE city there is than when the act began
       housing             the NET change in household capacity this generation made,
                           and it is allowed to be NEGATIVE. A generation that tore
                           down housing really did reduce it, and clamping that to
                           zero would hide exactly the story the century rule is for.
       byType              WHAT THIS GENERATION BUILT, by kind. BUILDS ONLY: it never
                           decrements. The first cut had it going down on a demolish,
                           which made "the dynasty built one suburb" and "there is one
                           suburb standing" the same field wearing one name -- and they
                           are different questions with different answers. What is
                           STANDING is the delta's job (bohemia_cityedit.js); this file
                           only ever answers what the family DID. */
  function blank() {
    return { built: 0, demolished: 0, net: 0, housing: 0, byType: {} };
  }

  function totals(rec, act) {
    var t = blank();
    if (!rec || !rec.entries) return t;
    for (var i = 0; i < rec.entries.length; i++) {
      var e = rec.entries[i];
      if (act != null && e.act !== act) continue;
      if (e.kind === 'build') {
        t.built++; t.net++; t.housing += e.people || 0;
        t.byType[e.type] = (t.byType[e.type] || 0) + 1;
      } else {
        t.demolished++; t.net--; t.housing -= e.people || 0;
      }
    }
    return t;
  }

  /* WHAT THE DYNASTY HAS DONE UP TO AND INCLUDING AN ACT -- the number the century
     rule actually asks for, because the law says choices COMPOUND. */
  function through(rec, act) {
    var t = blank();
    if (!rec) return t;
    var upto = act == null ? rec.act : clampAct(act);
    for (var a = ACT_MIN; a <= upto; a++) {
      var p = totals(rec, a);
      t.built += p.built; t.demolished += p.demolished;
      t.net += p.net; t.housing += p.housing;
      for (var k in p.byType) if (Object.prototype.hasOwnProperty.call(p.byType, k))
        t.byType[k] = (t.byType[k] || 0) + p.byType[k];
    }
    return t;
  }

  /* ONE ROW PER ACT, for a surface that wants to show the whole century. */
  function acts(rec) {
    var out = [];
    for (var a = ACT_MIN; a <= ACT_MAX; a++) {
      var t = totals(rec, a);
      t.act = a; t.lived = (rec ? a <= rec.act : a === ACT_MIN);
      out.push(t);
    }
    return out;
  }

  /* ---------------------------------------------------------------------------
     THE VALVE THAT IS HIS. Asked what act 3's city should LOOK like given what the
     dynasty built, this answers NO_RULING by name until he fills TIERS. The pipe
     is finished and connected and it carries nothing.
     --------------------------------------------------------------------------- */
  function tierOf(rec, act) {
    var t = through(rec, act);
    var key = String(act == null ? (rec ? rec.act : ACT_MIN) : clampAct(act));
    if (!Object.prototype.hasOwnProperty.call(TIERS, key))
      return { reason: NO_RULING, table: 'TIERS', key: key, totals: t,
               about: 'what a poor city and a rebuilt city are is Paolo\'s ruling' };
    return { tier: TIERS[key], totals: t };
  }

  /* SAVE IS THE ENTRIES, because the entries are the truth. */
  function save(rec) {
    if (!rec) return null;
    return { V: 1, act: rec.act, entries: rec.entries.slice() };
  }
  function load(blob) {
    var r = make({ act: (blob && blob.act) || ACT_MIN });
    /* AN OLDER OR BROKEN BLOB IS AN EMPTY MEMORY, NEVER A CRASH. The century is the
       one thing in the game that must survive every migration it will ever meet. */
    if (blob && Array.isArray(blob.entries)) {
      for (var i = 0; i < blob.entries.length; i++) {
        var e = blob.entries[i];
        if (!e || !e.type || (e.kind !== 'build' && e.kind !== 'demolish')) continue;
        r.entries.push({ act: clampAct(e.act || ACT_MIN), kind: e.kind, type: e.type,
                         x: e.x | 0, y: e.y | 0, w: e.w || 1, h: e.h || 1,
                         people: typeof e.people === 'number' ? e.people : 0,
                         day: e.day | 0, seq: r.entries.length });
      }
    }
    return r;
  }

  var API = { NO_RULING: NO_RULING, ACT_MIN: ACT_MIN, ACT_MAX: ACT_MAX, TIERS: TIERS,
              make: make, setAct: setAct, note: note,
              totals: totals, through: through, acts: acts, tierOf: tierOf,
              save: save, load: load };
  if (HASREQ) module.exports = API;
  root.BohemiaCentury = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
