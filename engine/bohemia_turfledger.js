// BOHEMIA — THE TERRITORY LEDGER
// FACTIONS lane, VAMILY row [territory ledger] WHAT-THE-PLAYER-TOOK-IS-WRITTEN-DOWN
// (coordinator 9/24, from WORLD caaaa26). 9/24/26.
//
// WHAT IS SET AGAINST, MEASURED BEFORE A LINE WAS WRITTEN.
//
//   1. turfGrid() is keyed on `seed + ':' + om.n` AND NOTHING ELSE, and is
//      recomputed identically on every boot. Territory is a pure function of the
//      seed and the act's power column in his faction graph.
//   2. The walked city's save never mentions turf. Grepped: zero hits.
//   3. bohemia_towns.js carries HOLDS, the manual override map, and its own
//      comment says "empty, and it stays empty". IT IS EMPTY.
//
// SO THE ROW'S SENTENCE IS TRUE AND THERE IS A HARDER ONE UNDER IT: it is not
// only that what the player took is written nowhere. NOTHING IN THIS GAME CAN
// CHANGE WHO HOLDS A BLOCK. There is no taking mechanic, so a ledger built today
// records zero rows, and rule 31's derive has nothing to read because nothing
// has anything to say.
//
// THIS FILE IS THE PLACE FOR IT TO BE SAID, AND NOTHING ELSE. It decides nothing
// about who may take ground, what it costs, or how. Those are rulings and they
// are his (MECHANISM-MINE / CONTENTS-PAOLO'S). The moment any lane ships a taking
// mechanic it calls took() and territory becomes a thing that persists, per act,
// which is exactly what rule 31 derives from.
//
// REUSE CHECK. This invents NO second idea of a ledger. bohemia_century.js already
// keeps one -- {V, act, entries[]}, clampAct, a setAct that refuses to run
// backwards, and an entry stamped with its act, its day and its sequence -- and
// this is that same shape one module over, TAKEN rather than reinvented, for the
// same reason the century gives: four systems, one idea of a record.
//
// WHY `from` IS HANDED IN AND NEVER LOOKED UP. The century records the household
// size on a build entry at the time it happened, so that a later ruling about what
// an apartment holds does not silently rewrite the past. Same here: who held the
// cell BEFORE is recorded when it changes, because the derived grid underneath can
// move (a different act column, a re-seeded valley) and a ledger that recomputes
// its own history is not a memory.
//
// AN OLDER SAVE IS A PLAYABLE SAVE. A blob written before this file existed has no
// ledger at all and reads as act 1 with zero entries. That is not a fudge, it is
// HIS OWN RULE 32(b): the game starts in the ruin and act 1 is the floor, so ground
// that predates the count was held by whoever the seed says held it.
(function (root) {
  'use strict';

  var V = 1;
  var ACT_MIN = 1, ACT_MAX = 3;            /* three generations, his 7/26 law */

  function clampAct(a) {
    a = a | 0;
    if (a < ACT_MIN) return ACT_MIN;
    if (a > ACT_MAX) return ACT_MAX;
    return a;
  }

  function make(opts) {
    opts = opts || {};
    return { V: V, act: clampAct(opts.act || ACT_MIN), entries: [] };
  }

  /* THE ONE SETTER, and it refuses to go BACKWARDS, which is bohemia_century's
     own rule and its own words: a century that can run in reverse is not a
     memory. He flips between acts (rule 31) but the RECORD only ever grows. */
  function setAct(rec, a) {
    if (!rec) return ACT_MIN;
    var want = clampAct(a);
    if (want > rec.act) rec.act = want;
    return rec.act;
  }

  function key(x, y) { return (x | 0) + ',' + (y | 0); }

  /* ---------------------------------------------------------------------------
     ONE ENTRY PER TIME A CELL CHANGES HANDS.
     The caller says who held it and who holds it now; this file never guesses
     either, and it refuses an entry that does not actually move the ground.
     --------------------------------------------------------------------------- */
  function took(rec, o) {
    if (!rec || !rec.entries) return { applied: false, reason: 'NO_RECORD' };
    o = o || {};
    if (o.x == null || o.y == null) return { applied: false, reason: 'NO_CELL' };
    if (!o.to) return { applied: false, reason: 'NO_TAKER' };
    /* A CHANGE THAT CHANGES NOTHING IS NOT A CHANGE. Without this the ledger
       fills with rows saying the Mob still hold Mob ground, and every reader
       downstream has to learn to ignore them. */
    if (o.from === o.to) return { applied: false, reason: 'NOT_A_CHANGE', who: o.to };
    var e = {
      act: rec.act,
      x: o.x | 0, y: o.y | 0,
      to: o.to,
      /* null is a real answer and means "nobody the map could name", which is
         what the derived grid returns off the edge. It is not the same as
         "unknown", so it is kept rather than defaulted to a name. */
      from: (o.from == null) ? null : o.from,
      day: (o.day == null) ? 0 : (o.day | 0),
      why: o.why || null,
      seq: rec.entries.length
    };
    rec.entries.push(e);
    return { applied: true, entry: e };
  }

  /* WHO HOLDS THIS CELL ACCORDING TO THE RECORD, at or below a given act.
     Returns null when the record has nothing to say, and null MEANS "ask the
     derived grid" -- it is not an answer about the ground. */
  function heldBy(rec, x, y, act) {
    if (!rec || !rec.entries || !rec.entries.length) return null;
    var a = (act == null) ? rec.act : clampAct(act);
    var k = key(x, y), best = null;
    for (var i = 0; i < rec.entries.length; i++) {
      var e = rec.entries[i];
      if (e.act > a) continue;                  /* the future has not happened yet */
      if (key(e.x, e.y) !== k) continue;
      /* newest wins, and act comes before seq because seq only orders within a
         record that may have been written across several acts */
      if (!best || e.act > best.act || (e.act === best.act && e.seq > best.seq)) best = e;
    }
    return best ? best.to : null;
  }

  /* ---------------------------------------------------------------------------
     THE READ-THROUGH, WHICH IS THE WHOLE POINT OF THE FILE.
     A caller hands in the derived grid it already has. On an EMPTY ledger this
     returns byte-for-byte what that grid returns, which is the property the gate
     holds: wiring this in changes nothing at all until somebody takes ground.
     --------------------------------------------------------------------------- */
  function holderThrough(rec, grid, x, y, act) {
    var said = heldBy(rec, x, y, act);
    var base = (grid && typeof grid.at === 'function') ? grid.at(x, y) : null;
    if (said == null) return base;
    if (!base) return { faction: said, tier: null, ruled: true, draft: false };
    /* THE TIER STAYS THE GROUND'S, NOT THE TAKER'S. What a fortress charges is a
       property of the place (his towns law, 9/4); taking a block does not turn it
       into your fortress, and deciding it did would be authoring his canon. */
    return { faction: said, tier: base.tier, ruled: true,
             block: base.block, draft: false };
  }

  /* WHAT CHANGED, for rule 31's derive. One row per cell: who has it NOW, and
     who had it BEFORE THE RECORD TOUCHED IT AT ALL. Derived every call; nothing
     is cached, for the same reason bohemia_company.js refuses to keep a roster.

     *** `from` IS THE OLDEST ENTRY'S, NOT THE NEWEST'S, AND THE GATE CAUGHT ME
     TAKING THE NEWEST. *** A cell that goes Mob -> Reds -> Blues has a newest
     entry whose `from` is Reds, and Reds is a MIDDLEMAN: they held it for a
     while and ended with nothing. Netting off the newest `from` credits Reds a
     cell they do not have and leaves the Mob short one they really lost. The
     only `from` that means anything against the derived ground underneath is the
     first one, because that is who the seed had. */
  function changedIn(rec, act) {
    var out = [];
    if (!rec || !rec.entries) return out;
    var a = (act == null) ? rec.act : clampAct(act), byCell = {}, order = [], i;
    for (i = 0; i < rec.entries.length; i++) {
      var e = rec.entries[i];
      if (e.act > a) continue;
      var k = key(e.x, e.y);
      if (!byCell[k]) {
        byCell[k] = { x: e.x, y: e.y, to: e.to, from: e.from, act: e.act, day: e.day };
        order.push(k);
      } else {
        /* newest wins for WHO HAS IT NOW; the first `from` is never overwritten */
        byCell[k].to = e.to; byCell[k].act = e.act; byCell[k].day = e.day;
      }
    }
    for (i = 0; i < order.length; i++) {
      var c = byCell[order[i]];
      /* A CELL HANDED BACK TO WHOEVER STARTED WITH IT DID NOT CHANGE HANDS. Three
         entries can net to nothing and the record still holds all three, which is
         right -- the history happened -- but it is not a change to report. */
      if (c.from === c.to) continue;
      out.push(c);
    }
    out.sort(function (p, q) { return (p.y - q.y) || (p.x - q.x); });
    return out;
  }

  /* NET CELLS PER FACTION at or below an act: what the record says each crew is
     up or down by. A count, never a score. */
  function netFor(rec, act) {
    var out = {}, list = changedIn(rec, act), i;
    for (i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.to) out[c.to] = (out[c.to] || 0) + 1;
      if (c.from) out[c.from] = (out[c.from] || 0) - 1;
    }
    return out;
  }

  /* ---- the save, which is the half WORLD found missing in the treasuries ---- */
  function toJSON(rec) {
    if (!rec) return null;
    return { V: V, act: clampAct(rec.act), entries: (rec.entries || []).slice() };
  }

  /* A BLOB THAT PREDATES THIS FILE LOADS AS ACT 1 WITH NOTHING IN IT, which is
     rule 32(b) rather than a convenience: act 1 is the floor and the ruin is
     where the game starts, so unrecorded ground was always the seed's. */
  function load(blob) {
    if (!blob || typeof blob !== 'object') return make();
    var rec = make({ act: blob.act });
    var src = blob.entries;
    if (Object.prototype.toString.call(src) !== '[object Array]') return rec;
    for (var i = 0; i < src.length; i++) {
      var e = src[i];
      if (!e || e.x == null || e.y == null || !e.to) continue;   /* skip debris, keep the rest */
      rec.entries.push({
        act: clampAct(e.act), x: e.x | 0, y: e.y | 0, to: e.to,
        from: (e.from == null) ? null : e.from,
        day: (e.day == null) ? 0 : (e.day | 0),
        why: e.why || null,
        seq: rec.entries.length
      });
    }
    return rec;
  }

  var API = {
    V: V, ACT_MIN: ACT_MIN, ACT_MAX: ACT_MAX,
    make: make, clampAct: clampAct, setAct: setAct,
    took: took, heldBy: heldBy, holderThrough: holderThrough,
    changedIn: changedIn, netFor: netFor,
    toJSON: toJSON, load: load
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaTurfLedger = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
