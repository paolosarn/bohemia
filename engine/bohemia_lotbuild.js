// BOHEMIA LOT BUILD — WHAT YOU CAN BUILD ON A LOT IN YOUR HOME BASE, AND WHAT IT DOES
// (9/29/26, LIFE + CITY lane. VAMILY row [build a lot] / BUILDING-IS-A-THING-YOU-DO-IN-YOUR-HOME-BASE.)
//
// HIS RULING, rule 40(b), Paolo 9/29: "a more deep rich interactable buildable world."
// BUILDING IS BACK, INSIDE THE SETTLEMENT SCREEN of a home base you own: tap a lot, build a thing
// from the assets we have, it costs batteries and time, it shows on the map, on the fight board cut
// from that block, and in the derived future. The separate builder screen stays CUT (rule 24).
// This lane owns WHAT can be built and WHAT IT DOES. RUN [settlement screen] owns the screen;
// WORLD owns the block. Rule 39(a): decide the defaults and build; this file is those defaults.
//
// ============================================================================
// WHY A NEW CATALOG AND NOT THE OLD ONE
// ============================================================================
// MEASURED before writing: the cut builder placed WHOLE DISTRICTS -- 59 kinds off the overmap enum
// (airbase, casino, stadium...) as plots on the city map. A lot inside a home base is not a district.
// So this catalog is SMALL BUILDINGS, and every one is a piece the game ALREADY DRAWS: each entry
// names the district kit and legend code its picture comes from, and the gate refuses an entry whose
// piece does not exist. Nothing here is a new asset.
//
// ============================================================================
// WHAT EACH ONE DOES, AND EVERY NUMBER IS A RULING SOMEBODY ALREADY MADE
// ============================================================================
// 7/26, LOCKED: "BUILDINGS: house people or produce one of the three." So each entry either houses a
// household or makes one currency -- one of each, so the list teaches the economy by being used:
//   materials (resources)  the shed, the pump house, the garden bed
//   batteries (electricity) the solar panel -- and its amount is WORLD's ruled power-building yield,
//                          read from engine/bohemia_powerbuild.js, never typed here
//   being known (clout)    the vendor stall
//   a household            the roof put back on a dead house
//   nothing but the fight  the wall: it makes nothing, and says so
// 8/15 EVERYTHING COSTS ONE + 9/4 BATTERIES ARE THE MONEY: each costs ONE BATTERY and ONE DAY. The
// amounts come from those two rulings and are carried on every row so a gate can see no hand-typed
// number entered. A solar panel paying back in a day is not a faucet: the game pays ONE day per day
// and owns no wall clock (bohemia_powerbuild's own measurement), so there is nothing to farm offline.
//
// ============================================================================
// WHERE A BUILT THING SHOWS UP -- the three places his ruling names
// ============================================================================
//   THE FUTURE  it is a `build` in the century ledger, so bohemia_future's derive counts it in act 2
//               and act 3 (and a raid that tears it down counts that too). This is how [three cities]
//               folds under this row: what you build is what the next act inherits.
//   THE FIGHT   fightTile() says what that house-tile is on a board cut from this block: a building,
//               a wall, open ground, or HIGH GROUND (37g: "high ground is a roof").
//   THE MAP     markerOf() hands the marker the piece's own kit and code; COOK draws it.
//
// NO SECOND LEDGER. Money moves through the purse (engine/bohemia_purse.js), deeds through the century
// ledger (engine/bohemia_century.js), output through the purse's PRODUCTION table and produce().
// This file keeps only the one thing none of them know: which lot is under construction, and when it
// is done.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  function DEP(file, global) {
    if (HASREQ) { try { return require('./' + file + '.js'); } catch (e) { return null; } }
    return root[global] || null;
  }
  function PURSE() { return DEP('bohemia_purse', 'BohemiaPurse'); }
  function CENTURY() { return DEP('bohemia_century', 'BohemiaCentury'); }
  function POWER() { return DEP('bohemia_powerbuild', 'BohemiaPowerBuild'); }
  function HOUSING() { return DEP('bohemia_housing', 'BohemiaHousing'); }

  var RULING = '7/26 BUILDINGS HOUSE OR PRODUCE ONE OF THE THREE + 8/15 EVERYTHING COSTS ONE + 9/4 BATTERIES ARE THE MONEY';
  var COST = { currency: 'electricity', amount: 1 };   /* one battery */
  var DAYS = 1;                                         /* one day */
  var DRAFT = true;                                     /* the list is his to knock down, in VOTE */

  function powerYield() { var W = POWER(); return (W && W.AMOUNT) || 0; }

  /* THE LIST. `piece` is where the picture comes from: a registered district kit and its legend
     code. `makes` is one currency a day, or nothing. `fight` is what the house-tile becomes.
     `century` is the type the ledger records -- the roof is a HOUSE again, so it is recorded as the
     house the piece comes from, which is how it reads the ruled household size instead of a number
     typed here. */
  var CATALOG = [
    { id: 'shed',   name: 'SHED',        piece: { kit: 'trailer',     code: 7 },
      makes: { resources: 1 }, fight: 'building', century: 'lot:shed',
      says: 'somewhere to keep what you drag home' },
    { id: 'pump',   name: 'PUMP HOUSE',  piece: { kit: 'pumpstation', code: 2 },
      makes: { resources: 1 }, fight: 'building', century: 'lot:pump',
      says: 'water, lifted, every day' },
    { id: 'garden', name: 'GARDEN BED',  piece: { kit: 'school',      code: 13 },
      makes: { resources: 1 }, fight: 'open', century: 'lot:garden',
      says: 'food, slowly' },
    { id: 'solar',  name: 'SOLAR PANEL', piece: { kit: 'solar',       code: 7 },
      makes: { electricity: 'POWER' }, fight: 'building', century: 'lot:solar',
      says: 'a battery a day, off the sun' },
    { id: 'stall',  name: 'VENDOR STALL', piece: { kit: 'swapmeet',   code: 6 },
      makes: { clout: 1 }, fight: 'building', century: 'lot:stall',
      says: 'people start to know your name' },
    { id: 'roof',   name: 'ROOF',        piece: { kit: 'suburb',      code: 2 },
      makes: null, houses: true, fight: 'high', century: 'suburb',
      says: 'a dead house with a roof on it is a home again' },
    { id: 'wall',   name: 'WALL',        piece: { kit: 'suburb',      code: 4 },
      makes: null, fight: 'wall', century: 'lot:wall',
      says: 'makes nothing; it is for the day they come' }
  ];
  var BY = {};
  for (var i = 0; i < CATALOG.length; i++) BY[CATALOG[i].id] = CATALOG[i];

  function makesOf(entry) {
    if (!entry || !entry.makes) return null;
    var out = {};
    for (var k in entry.makes) if (Object.prototype.hasOwnProperty.call(entry.makes, k))
      out[k] = entry.makes[k] === 'POWER' ? powerYield() : entry.makes[k];
    return out;
  }

  /* THE PURSE'S PRODUCTION TABLE, filled for these ids and never over a ruled row. */
  function install() {
    /* THE ROOF'S HOUSEHOLD IS READ AT THE MOMENT IT IS BUILT (the century ledger records it then),
       so the housing table must be filled first. The game does this at boot; doing it here as well
       means a build can never record a house with nobody in it because of load order. Idempotent,
       and it never overwrites a ruled row. */
    var H = HOUSING(); if (H && typeof H.installCap === 'function') { try { H.installCap(); } catch (e) {} }
    var P = PURSE(); if (!P || !P.PRODUCTION) return { installed: 0, kept: 0 };
    var added = 0, kept = 0;
    for (var i = 0; i < CATALOG.length; i++) {
      var e = CATALOG[i], m = makesOf(e); if (!m) continue;
      var key = 'lot:' + e.id;
      if (Object.prototype.hasOwnProperty.call(P.PRODUCTION, key)) { kept++; continue; }
      var row = { ruling: RULING, tuned: false };
      for (var c in m) row[c] = m[c];
      P.PRODUCTION[key] = row; added++;
    }
    return { installed: added, kept: kept };
  }

  /* A HOME BASE'S BUILD STATE. Only what nobody else holds: which lot is being built and when it is
     done. Everything that has happened is in the purse and the century ledger. */
  function site(opts) { opts = opts || {}; return { V: 1, base: opts.base || null, lots: {} }; }

  function list(s, purse) {
    var P = PURSE(), can = P ? P.balance(purse, COST.currency) >= COST.amount : false;
    return CATALOG.map(function (e) {
      return { id: e.id, name: e.name, says: e.says, cost: { currency: COST.currency, amount: COST.amount },
               days: DAYS, makes: makesOf(e), houses: !!e.houses, fight: e.fight, affordable: can,
               draft: DRAFT };
    });
  }

  /* START. Pays the battery now and puts the lot under construction; a lot already in use refuses.
     Refusals say why by name, never a silent false. */
  function start(s, purse, lot, id, day) {
    var e = BY[id], P = PURSE();
    if (!e) return { ok: false, why: 'NOT_BUILDABLE', id: id };
    if (!s || !lot || lot.x == null || lot.y == null) return { ok: false, why: 'NO_LOT' };
    var key = lot.x + ',' + lot.y;
    if (s.lots[key]) return { ok: false, why: 'LOT_TAKEN', by: s.lots[key].id };
    if (!P || P.balance(purse, COST.currency) < COST.amount)
      return { ok: false, why: 'CANNOT_AFFORD', need: COST.amount, currency: COST.currency };
    var paid = P.debit(purse, COST.currency, COST.amount, 'build:' + id, 'lot:' + id, day);
    if (!paid || !paid.applied) return { ok: false, why: 'PURSE_REFUSED', purse: paid };
    s.lots[key] = { id: id, x: lot.x | 0, y: lot.y | 0, w: lot.w || 1, h: lot.h || 1,
                    started: day | 0, ready: (day | 0) + DAYS, done: false };
    return { ok: true, lot: s.lots[key] };
  }

  /* THE DAY PASSES. Finishes what is due -- a `build` in the century ledger, so the future counts
     it -- and pays what stands through the purse's own produce().
     *** PAID-TODAY IS ASKED OF THE LEDGER, NEVER KEPT BESIDE IT. *** The first cut remembered "this
     lot was paid on day N" in a field on the purse object, and the purse's save() writes only its
     entries, so a reload on the same day forgot the mark and paid the lot again -- the exact
     double-pay bohemia_production.js was written to make impossible, one file over. So the count of
     produce entries already in the ledger for that building on that day is the truth: two solar
     panels standing on day 5 means exactly two payments on day 5, however many times the day ticks. */
  function paidCount(purse, key, day) {
    var n = 0, es = (purse && purse.entries) || [];
    for (var i = 0; i < es.length; i++)
      if (es[i].reason === 'produce:' + key && (es[i].day | 0) === (day | 0)) n++;
    return n;
  }
  function tick(s, purse, century, day) {
    var P = PURSE(), C = CENTURY(), finished = [], paid = [], standingBy = {};
    install();
    for (var k in s.lots) {
      if (!Object.prototype.hasOwnProperty.call(s.lots, k)) continue;
      var L = s.lots[k], e = BY[L.id];
      if (!L.done && (day | 0) >= L.ready) {
        L.done = true;
        if (C && century) C.note(century, 'build', { type: e.century, x: L.x, y: L.y, w: L.w, h: L.h }, day);
        finished.push(L.id);
      }
      if (L.done && makesOf(e)) standingBy[e.id] = (standingBy[e.id] || 0) + 1;
    }
    for (var id in standingBy) {
      if (!Object.prototype.hasOwnProperty.call(standingBy, id) || !P) continue;
      var key = 'lot:' + id, owed = standingBy[id] - paidCount(purse, key, day);
      for (var j = 0; j < owed; j++) {
        var r = P.produce(purse, key, day);
        if (r && r.applied) paid.push(id);
      }
    }
    return { finished: finished, paid: paid };
  }

  /* WHERE IT SHOWS UP */
  function fightTile(id) { var e = BY[id]; return e ? e.fight : null; }
  function markerOf(id) { var e = BY[id]; return e ? { kit: e.piece.kit, code: e.piece.code, name: e.name } : null; }
  function standing(s) { var n = 0; for (var k in s.lots) if (s.lots[k].done) n++; return n; }

  function save(s) { return JSON.stringify(s); }
  function load(str) { try { var o = JSON.parse(str); return (o && o.V === 1 && o.lots) ? o : null; } catch (e) { return null; } }

  var API = { RULING: RULING, COST: COST, DAYS: DAYS, CATALOG: CATALOG, draft: DRAFT,
              install: install, site: site, list: list, start: start, tick: tick,
              fightTile: fightTile, markerOf: markerOf, makesOf: function (id) { return makesOf(BY[id]); },
              standing: standing, save: save, load: load };
  if (HASREQ) module.exports = API;
  root.BohemiaLotBuild = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
