// BOHEMIA — THE FOURTEEN HOME BASES
//
// FACTIONS lane, VAMILY rows [home bases] (the map's marker list) and
// [territory ledger] (RE-AIMED 9/28: the ledger records who holds which HOME BASE).
// 9/28/26. Paolo 9/27 in the tab, rule 37e, laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md s5:
//
//   "Territory colour on the ground is not a mechanic; nobody fights over lines.
//    What the factions ARE on the map: FOURTEEN HOME BASES ... and MANY ROAMING
//    PARTIES ... you meet, fight, raid, trade with or watch pass. A home base can
//    be attacked: taken or ruined; the hard ones late in an act."
//
// THIS IS NOT THE TERRITORY LEDGER COMING BACK UNDER A NEW NAME. That shape was
// 9,216 cells, painted, fought over one lot at a time (engine/bohemia_turfledger.js,
// marked SUPERSEDED 9/28). This is FOURTEEN ENTITIES that are each whole, and a
// base is taken or ruined as a whole. There is no cell here and nothing to paint.
//
// WHAT WAS MEASURED BEFORE THIS FILE, live on the alpha, 9/28:
//   - the 14 seats already carry a real district kind and a tier (Mob a resort,
//     Cartel storage, Church a chapel, Homeless a pump station), off
//     BohemiaTowns.derive(). The bases are those seats; nothing is placed here.
//   - 28 parties roam (14 patrol, 10 caravan, 4 crew), and they are a FIXED
//     ROSTER: bohemia_parties.all() runs once, every party walks to its
//     destination and back for ever, and nothing ever buys one, loses one or
//     replaces one. In Battle Brothers a location BUYS parties out of what it has,
//     sends them out, and is weaker until they return (dev blog #66, and players
//     report a camp sending a group every one to two days). So in ours a base that
//     falls would keep sending its patrols for ever. This module is the missing
//     link: a party exists because its home base still holds it.
//
// WHAT THIS FILE DECIDES, AND WHAT IT DOES NOT.
//   It decides ONE thing the rows name: a base that is not held by its own people
//   sends nobody. Everything else is handed in or read off a module that owns it:
//     the seats and tiers      BohemiaTowns.derive()   (WORLD's, his power column)
//     the parties              BohemiaParties.all()    (WORLD's [parties move])
//     the thirds a hard base   BohemiaTowns.DEPTH      (his own DEPTH thirds)
//     how far through an act   THE CALLER'S. The act's length is not this file's.
//   It does NOT decide who may attack, what an attack costs, or how a fight ends.
//   That is COMBAT's [bb fight] and a ruling of his. The moment the game has a
//   raid it calls took() or ruined(), and a base is a thing that persists per act,
//   which is what rule 31's derive reads.
//
// NO TEXT. A marker is ids and classes and numbers. "No text on screen he did not
// ask for" (37e) is enforced at the source: nothing here carries a sentence.
//
// AN OLDER SAVE IS A PLAYABLE SAVE. A blob written before this file existed has no
// ledger and reads as act 1 with every base held by its own faction, which is rule
// 32(b): the game starts in the ruin and act 1 is the floor.
//
// REUSE CHECK. The record shape is bohemia_century's ({V, act, entries[]}, a setAct
// that refuses to run backwards, an entry stamped with its act, day and sequence),
// taken once more, for the same reason it gives: four systems, one idea of a record.
//
// node: require('./bohemia_homebases.js')   Gate: gates/homebases_gate.js
(function (root) {
  'use strict';

  var V = 1;
  var ACT_MIN = 1, ACT_MAX = 3;                 /* three generations, always (37d) */
  var YOU = 'you';                              /* the company: not a faction, and not a node */

  function clampAct(a) {
    a = a | 0;
    if (a < ACT_MIN) return ACT_MIN;
    if (a > ACT_MAX) return ACT_MAX;
    return a;
  }

  function make(o) {
    o = o || {};
    return { V: V, act: clampAct(o.act == null ? 1 : o.act), entries: [] };
  }

  /* THE ACT NEVER RUNS BACKWARDS. Same refusal the century module makes. */
  function setAct(rec, act) {
    var a = clampAct(act);
    if (a > rec.act) rec.act = a;
    return rec.act;
  }

  /* ---- reading -------------------------------------------------------------
     The newest entry at or before `act` says who holds it now. With no entry the
     base is its own faction's, which is what the seed says. */
  function lastOf(rec, base, act) {
    var a = clampAct(act == null ? (rec && rec.act) : act), hit = null;
    var list = (rec && rec.entries) || [];
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.base === base && e.act <= a) hit = e;   /* entries are in the order they happened */
    }
    return hit;
  }

  /* who holds it: a faction id, 'you', or null when it is a ruin */
  function heldBy(rec, base, act) {
    var e = lastOf(rec, base, act);
    return e ? e.to : base;
  }

  function isRuin(rec, base, act) {
    var e = lastOf(rec, base, act);
    return !!e && e.how === 'ruined';
  }

  /* ---- writing --------------------------------------------------------------
     `from` is READ, never handed in: unlike a derived grid, the ledger IS the
     source of who holds a base, so a caller that says otherwise is wrong, not a
     second opinion. The one thing a caller must supply is WHICH base and WHO.
     Refused, and told why, never thrown: */
  function put(rec, how, r) {
    r = r || {};
    if (!rec || !r.base) return { applied: false, reason: 'NO_BASE' };
    var now = lastOf(rec, r.base, rec.act);
    var ruinAct = (now && now.how === 'ruined') ? now.act : 0;
    var holder = now ? now.to : r.base;
    if (how === 'taken') {
      if (!r.to) return { applied: false, reason: 'NO_TAKER' };
      /* a ruin can be moved into, but only a generation later: the future goes both
         ways (37c), and rebuilding is not something done in the act it fell in */
      if (ruinAct && rec.act <= ruinAct) return { applied: false, reason: 'RUIN_THIS_ACT' };
      if (holder === r.to) return { applied: false, reason: 'NOT_A_CHANGE' };
    } else {
      if (ruinAct) return { applied: false, reason: 'ALREADY_RUIN' };
    }
    var e = {
      n: rec.entries.length + 1,
      act: rec.act,
      day: (typeof r.day === 'number') ? r.day : null,
      base: r.base,
      how: how,
      from: holder,
      to: how === 'ruined' ? null : r.to,
      why: r.why || null
    };
    rec.entries.push(e);
    return { applied: true, entry: e };
  }
  function took(rec, r) { return put(rec, 'taken', r); }
  function ruined(rec, r) { return put(rec, 'ruined', r); }

  /* ---- what the future reads (rule 31, and 37c "raided falls") ---------------
     Per act, signed and in whole bases: a base you took is +1 to you and -1 to
     whoever held it; a base that fell is -1 to its holder and +1 nowhere. This is
     the arithmetic turfledger.netFor answered for cells, at fourteen. */
  function netFor(rec, act) {
    var out = {}, list = (rec && rec.entries) || [], a = clampAct(act);
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.act !== a) continue;
      if (e.to) out[e.to] = (out[e.to] || 0) + 1;
      if (e.from) out[e.from] = (out[e.from] || 0) - 1;
    }
    return out;
  }

  /* how many bases stand as ruins by the end of an act */
  function ruinsThrough(rec, act) {
    var seen = {}, n = 0, list = (rec && rec.entries) || [], a = clampAct(act);
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.act > a) continue;
      seen[e.base] = (e.how === 'ruined');
    }
    for (var k in seen) if (Object.prototype.hasOwnProperty.call(seen, k) && seen[k]) n++;
    return n;
  }

  /* ---- THE HARD ONES LATE IN AN ACT -------------------------------------------
     His sentence, as a threshold, off his own DEPTH thirds: a camp can be attacked
     from the start, a town a third of the way through, a fortress two thirds. The
     cut is DEPTH minus the camp's depth, so it moves with the table it comes from
     and nothing is typed here. `progress` is how far through the act the game is,
     0 to 1, and it is the CALLER'S: the length of an act is not this file's to
     invent. Without it the answer is null, never a guess. */
  function TOWNS() {
    if (typeof module !== 'undefined' && module.exports) {
      try { return require('./bohemia_towns.js'); } catch (_e) {}
    }
    return (typeof root !== 'undefined' && root.BohemiaTowns) || null;
  }
  function openAt(tier) {
    var T = TOWNS(); if (!T || !T.DEPTH) return null;
    var d = Object.prototype.hasOwnProperty.call(T.DEPTH, tier) ? T.DEPTH[tier] : T.DEPTH.camp;
    return d - T.DEPTH.camp;
  }
  function raidable(tier, progress, ruin) {
    if (ruin) return false;                      /* nobody raids a ruin, they move into it */
    if (typeof progress !== 'number') return null;
    var g = openAt(tier);
    return g == null ? null : progress >= g - 1e-9;
  }

  /* ---- THE FOURTEEN --------------------------------------------------------- */
  function stateOf(faction, holder, ruin) {
    if (ruin) return 'ruined';
    if (holder === faction) return 'held';
    if (holder === YOU) return 'yours';
    return 'taken';
  }

  /* seats: BohemiaTowns.derive() rows. One base per seat, in the seats' own order. */
  function bases(seats, rec, act, opts) {
    opts = opts || {};
    var a = clampAct(act == null ? (rec && rec.act) : act), out = [];
    for (var i = 0; i < (seats || []).length; i++) {
      var s = seats[i]; if (!s) continue;
      var ruin = isRuin(rec, s.faction, a);
      var holder = ruin ? null : heldBy(rec, s.faction, a);
      out.push({
        id: 'base:' + s.faction, faction: s.faction, x: s.x, y: s.y,
        kind: s.kind || null, tier: s.tier, power: s.power,
        holder: holder, state: stateOf(s.faction, holder, ruin),
        raidable: raidable(s.tier, opts.progress, ruin)
      });
    }
    return out;
  }

  /* A PARTY EXISTS BECAUSE ITS BASE STILL HOLDS IT. A base that is a ruin, or held
     by anybody but its own people, sends nobody; what it had out is gone from the
     map. Everything else is untouched, so with an empty ledger this returns the
     parties it was given, unchanged and in order. */
  function partiesLeft(parties, baseList) {
    var byFaction = {}, i;
    for (i = 0; i < (baseList || []).length; i++) byFaction[baseList[i].faction] = baseList[i];
    var kept = [], silenced = [];
    for (i = 0; i < (parties || []).length; i++) {
      var p = parties[i]; if (!p) continue;
      var b = p.from && byFaction[p.from.faction];
      if (b && b.state !== 'held') silenced.push(p); else kept.push(p);
    }
    return { kept: kept, silenced: silenced };
  }

  /* THE MAP'S MARKER LIST. Ids, classes and numbers, never a sentence.
       base   : where, whose, what kind of place, how big (tier), its state, and
                whether it can be attacked yet
       party  : where it is now, whose it is, what it is doing, how strong it looks
     Drawing is the map's (RUN [bb map], COOK [bb map art]); how big a tier draws is
     theirs. This says what is there. */
  function markers(seats, parties, rec, act, opts) {
    var bl = bases(seats, rec, act, opts), out = [], i;
    for (i = 0; i < bl.length; i++) {
      var b = bl[i];
      out.push({ kind: 'base', id: b.id, x: b.x, y: b.y, faction: b.faction, holder: b.holder,
                 state: b.state, tier: b.tier, glyph: b.kind, raidable: b.raidable });
    }
    var pl = partiesLeft(parties, bl);
    for (i = 0; i < pl.kept.length; i++) {
      var p = pl.kept[i];
      out.push({ kind: 'party', id: p.id, x: p.at.x, y: p.at.y, faction: p.from.faction,
                 agenda: p.agenda, strength: (typeof p.from.power === 'number') ? p.from.power : null });
    }
    return out;
  }

  /* ---- the save ---------------------------------------------------------------- */
  function toJSON(rec) {
    if (!rec) return null;
    return { V: V, act: clampAct(rec.act), entries: (rec.entries || []).slice() };
  }
  function load(blob) {
    if (!blob || typeof blob !== 'object') return make();
    var rec = make({ act: blob.act });
    var src = blob.entries;
    if (Object.prototype.toString.call(src) !== '[object Array]') return rec;
    for (var i = 0; i < src.length; i++) {
      var e = src[i];
      if (!e || !e.base || (e.how !== 'taken' && e.how !== 'ruined')) continue;
      rec.entries.push({ n: rec.entries.length + 1, act: clampAct(e.act), day: (typeof e.day === 'number') ? e.day : null,
                         base: e.base, how: e.how, from: e.from == null ? null : e.from,
                         to: e.how === 'ruined' ? null : (e.to == null ? null : e.to), why: e.why || null });
    }
    return rec;
  }

  var API = {
    V: V, YOU: YOU, ACT_MIN: ACT_MIN, ACT_MAX: ACT_MAX,
    clampAct: clampAct, make: make, setAct: setAct,
    heldBy: heldBy, isRuin: isRuin, took: took, ruined: ruined,
    netFor: netFor, ruinsThrough: ruinsThrough,
    openAt: openAt, raidable: raidable,
    bases: bases, partiesLeft: partiesLeft, markers: markers,
    toJSON: toJSON, load: load
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaHomeBases = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
