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
//   materials (resources)  the shed, the pump house, the garden bed, the water tank (round 2)
//   batteries (electricity) the solar panel -- and its amount is WORLD's ruled power-building yield,
//                          read from engine/bohemia_powerbuild.js, never typed here
//   being known (clout)    the vendor stall
//   a household            the roof put back on a dead house
//   nothing but the fight  the wall: it makes nothing, and says so (round 2: it guards the gardens)
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
// ============================================================================
// ROUND 2 (9/29, rule 43): WHERE YOU BUILD IS WHAT YOU HOLD, AND WHAT YOU HOLD GROWS
// ============================================================================
// Paolo 9/29: "can you only build on your base... is the base not a base anymore but a settlement
// that will be blocks and blocks of Las Vegas... or the Pocket City 2 route". Default A, ruled on the
// board: you build on the lots of the parts you HOLD; taking the next part makes it yours, losing it
// takes it back; by act 3 a base can be half the city. WHO HOLDS WHAT IS NOT THIS FILE'S: it is
// FACTIONS' ledger (engine/bohemia_homebases.js), READ here, never copied. So:
//   - every start and every tick is handed the hold ({rec, act}) and asks it; no hold, no build
//     (NO_HOLD), a part somebody else holds refuses by name (NOT_HELD, and who holds it);
//   - holdings() opens a site for every part you hold, so taking a part is what grows the base;
//   - LOSING IT, the two ways the ledger knows (37c, the future goes both ways):
//       TAKEN   what you built still stands, but it pays THEM, not you, and nothing finishes;
//               take it back and it pays you again, because it never fell.
//       RUINED  everything you built there falls: each one a `demolish` in the century ledger, so
//               the derive's next act has that many fewer standing; half-built lots are lost with
//               the battery. The lots are bare ground again, and a ruin is moved into a generation
//               later (FACTIONS' own rule), where you build from nothing.
//   - the rungs unlock KINDS, never places (rule 43, WORLD [rung unlocks] re-read): each entry
//     carries a `kind`, and a caller may hand the open kinds; with none handed, every kind is open,
//     because WORLD's kinds table is not cut yet and a list that refuses everything is a dead screen.
// THE FIRST TWO THINGS ON THE LIST ARE A WALL AND A LIDDED WATER TANK (the invasive round, 9/29:
// "invaders do not attack cities, they eat the margins": hogs take the gardens, pigeons foul the
// water). So the wall stops being "nothing": it GUARDS the gardens from hogs, and the tank's lid
// guards the water from pigeons. exposed() names which margins are open; the beasts read it
// when they land (rule 42), and until then it is said, never charged.
// RULE 47, THE SIX (batteries, food, meds, rounds, tape, water): each entry names which of the six it
// feeds. The purse still pays in the three it has (7/26, LOCKED) until ECONOMY [six resources] cuts
// the ledger; the name is the translation, carried so that cut is a lookup, not a redesign. Nothing
// here makes MEDS or ROUNDS, and that is on purpose: in Battle Brothers you buy those, and you do not
// grow bullets in a garden.
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
  function BASES() { return DEP('bohemia_homebases', 'BohemiaHomeBases'); }

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
    /* THE FIRST TWO (the invasive round): what a held part builds before anything else */
    { id: 'wall',   name: 'WALL',        piece: { kit: 'suburb',      code: 4 },  kind: 'wall', first: true,
      makes: null, six: null, guards: 'hogs', fight: 'wall', century: 'lot:wall',
      says: 'makes nothing; the hogs stay out of the gardens' },
    { id: 'tank',   name: 'WATER TANK',  piece: { kit: 'town',        code: 11 }, kind: 'water', first: true,
      makes: { resources: 1 }, six: 'water', guards: 'pigeons', fight: 'building', century: 'lot:tank',
      says: 'a lid on the water, so the pigeons cannot foul it' },
    { id: 'shed',   name: 'SHED',        piece: { kit: 'trailer',     code: 7 },  kind: 'stores',
      makes: { resources: 1 }, six: 'tape', fight: 'building', century: 'lot:shed',
      says: 'a bench and what you drag home' },
    { id: 'pump',   name: 'PUMP HOUSE',  piece: { kit: 'pumpstation', code: 2 },  kind: 'water',
      makes: { resources: 1 }, six: 'water', fight: 'building', century: 'lot:pump',
      says: 'water, lifted, every day' },
    { id: 'garden', name: 'GARDEN BED',  piece: { kit: 'school',      code: 13 }, kind: 'food',
      makes: { resources: 1 }, six: 'food', fight: 'open', century: 'lot:garden',
      says: 'food, slowly' },
    { id: 'solar',  name: 'SOLAR PANEL', piece: { kit: 'solar',       code: 7 },  kind: 'light',
      makes: { electricity: 'POWER' }, six: 'batteries', fight: 'building', century: 'lot:solar',
      says: 'a battery a day, off the sun' },
    { id: 'stall',  name: 'VENDOR STALL', piece: { kit: 'swapmeet',   code: 6 },  kind: 'market',
      makes: { clout: 1 }, six: null, fight: 'building', century: 'lot:stall',
      says: 'people start to know your name' },
    { id: 'roof',   name: 'ROOF',        piece: { kit: 'suburb',      code: 2 },  kind: 'shelter',
      makes: null, houses: true, six: null, fight: 'high', century: 'suburb',
      says: 'a dead house with a roof on it is a home again' }
  ];
  var SIX = ['batteries', 'food', 'meds', 'rounds', 'tape', 'water'];   /* rule 47a, his order */
  var KINDS = ['wall', 'water', 'stores', 'food', 'light', 'market', 'shelter'];
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
     done. Everything that has happened is in the purse and the century ledger. `base` is the home
     base's id in FACTIONS' ledger (its seat faction), because that ledger is what says it is yours. */
  function site(opts) { opts = opts || {}; return { V: 1, base: opts.base || null, lots: {}, fell: [] }; }

  /* WHO HOLDS THIS PART, asked of FACTIONS' ledger every time. `hold` is {rec, act}. */
  function holderOf(s, hold) {
    var B = BASES();
    if (!B || !hold || !hold.rec || !s || !s.base) return { state: 'unknown', holder: null };
    var act = hold.act == null ? hold.rec.act : hold.act;
    if (B.isRuin(hold.rec, s.base, act)) return { state: 'ruined', holder: null };
    var h = B.heldBy(hold.rec, s.base, act);
    return { state: h === B.YOU ? 'yours' : 'theirs', holder: h };
  }

  /* WHAT YOU HOLD GROWS: one site per part you hold, opened the moment the ledger says it is yours.
     A site you already have is kept as it is (its lots stand); nothing is ever closed here, because
     losing a part is what tick() answers, in the ledger's own two words. */
  function holdings(book, hold, seats) {
    var B = BASES(); book = book || {};
    if (!B || !hold || !hold.rec) return { held: [], book: book };
    var act = hold.act == null ? hold.rec.act : hold.act;
    var held = B.ownedBy(hold.rec, seats, B.YOU, act);
    for (var i = 0; i < held.length; i++) if (!book[held[i]]) book[held[i]] = site({ base: held[i] });
    return { held: held, book: book };
  }

  function kindOpen(e, hold) {
    var open = hold && hold.kinds;
    return !open || open.indexOf(e.kind) >= 0;
  }

  function list(s, purse, hold) {
    var P = PURSE(), can = P ? P.balance(purse, COST.currency) >= COST.amount : false;
    var h = holderOf(s, hold);
    return CATALOG.map(function (e) {
      return { id: e.id, name: e.name, says: e.says, cost: { currency: COST.currency, amount: COST.amount },
               days: DAYS, makes: makesOf(e), six: e.six, kind: e.kind, first: !!e.first, guards: e.guards || null,
               houses: !!e.houses, fight: e.fight, affordable: can, held: h.state === 'yours',
               open: kindOpen(e, hold), draft: DRAFT };
    });
  }

  /* START. Pays the battery now and puts the lot under construction; a lot already in use refuses.
     Refusals say why by name, never a silent false. The hold is asked FIRST: on a part you do not
     hold, nothing else about the lot matters. */
  function start(s, purse, lot, id, day, hold) {
    var e = BY[id], P = PURSE();
    if (!e) return { ok: false, why: 'NOT_BUILDABLE', id: id };
    if (!s || !lot || lot.x == null || lot.y == null) return { ok: false, why: 'NO_LOT' };
    var h = holderOf(s, hold);
    if (h.state === 'unknown') return { ok: false, why: 'NO_HOLD' };
    if (h.state === 'ruined') return { ok: false, why: 'RUIN', base: s.base };
    if (h.state !== 'yours') return { ok: false, why: 'NOT_HELD', base: s.base, holder: h.holder };
    if (!kindOpen(e, hold)) return { ok: false, why: 'KIND_LOCKED', kind: e.kind };
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
  function tick(s, purse, century, day, hold) {
    var P = PURSE(), C = CENTURY(), finished = [], paid = [], fell = [], standingBy = {};
    install();
    var h = holderOf(s, hold);
    /* RUINED: EVERYTHING YOU BUILT THERE FALLS, ONCE. Each standing thing is a `demolish` in the
       century ledger (the derive's next act counts it); a half-built lot is lost with its battery.
       The lots are bare ground again. */
    if (h.state === 'ruined') {
      for (var rk in s.lots) {
        if (!Object.prototype.hasOwnProperty.call(s.lots, rk)) continue;
        var R = s.lots[rk], re = BY[R.id];
        if (R.done && C && century) C.note(century, 'demolish', { type: re.century, x: R.x, y: R.y, w: R.w, h: R.h }, day);
        fell.push(R.id);
      }
      if (fell.length) s.fell.push({ day: day | 0, act: hold.act == null ? hold.rec.act : hold.act, ids: fell.slice() });
      s.lots = {};
      return { finished: finished, paid: paid, fell: fell, state: h.state };
    }
    /* TAKEN (or no hold handed at all): it stands, it pays them, nothing finishes. */
    if (h.state !== 'yours') return { finished: finished, paid: paid, fell: fell, state: h.state, holder: h.holder };
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
    return { finished: finished, paid: paid, fell: fell, state: h.state };
  }

  /* THE MARGINS THE BEASTS EAT (the invasive round). A garden with no wall standing on the same part
     is open to hogs; water lifted with no lidded tank on the same part is open to pigeons. Said, not
     charged: the beasts are rule 42's and read this when they land. */
  function exposed(s) {
    var up = {}, out = [];
    for (var k in s.lots) if (s.lots[k].done) up[s.lots[k].id] = (up[s.lots[k].id] || 0) + 1;
    if (up.garden && !up.wall) out.push({ what: 'garden', n: up.garden, to: 'hogs', fix: 'wall' });
    if (up.pump && !up.tank) out.push({ what: 'pump', n: up.pump, to: 'pigeons', fix: 'tank' });
    return out;
  }

  /* WHERE IT SHOWS UP */
  function fightTile(id) { var e = BY[id]; return e ? e.fight : null; }
  function markerOf(id) { var e = BY[id]; return e ? { kit: e.piece.kit, code: e.piece.code, name: e.name } : null; }
  function standing(s) { var n = 0; for (var k in s.lots) if (s.lots[k].done) n++; return n; }

  function save(s) { return JSON.stringify(s); }
  function load(str) {
    try { var o = JSON.parse(str); if (!(o && o.V === 1 && o.lots)) return null; if (!o.fell) o.fell = []; return o; }
    catch (e) { return null; }
  }

  var API = { RULING: RULING, COST: COST, DAYS: DAYS, CATALOG: CATALOG, SIX: SIX, KINDS: KINDS, draft: DRAFT,
              install: install, site: site, holderOf: holderOf, holdings: holdings,
              list: list, start: start, tick: tick, exposed: exposed,
              fightTile: fightTile, markerOf: markerOf, makesOf: function (id) { return makesOf(BY[id]); },
              standing: standing, save: save, load: load };
  if (HASREQ) module.exports = API;
  root.BohemiaLotBuild = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
