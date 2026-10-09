// BOHEMIA LIVING MAP — THE PARTIES WALK WITHOUT STANDING ON EACH OTHER, LEAVE PRINTS THAT FADE BY THE
// HOUR, AND A TOWN'S GATE FILLS ON MARKET DAY
// (10/9/26, LIFE + CITY lane. VAMILY row [the living map] / PARTIES-ROAM-CARAVANS-TRAVEL-TRACKS-STAY.)
//
// THE ROW: THE OVERWORLD IS BATTLE BROTHERS (9/24) and rule 68 (you see the party and can flee). "the map's
// parties move with purpose on the clock (a raiding party toward a camp or a town, a caravan between two
// towns, a patrol along the freeway), leave tracks that fade by the hour, and stop where the clock stops
// (68a); crowds at a settlement's gate thicken on market day (RUN TWO's traits); a gate: over one in-game
// day every party moved and no two stand on one cell (NOBODY STANDS ON ANYBODY)."
//
// ============================================================================
// WHAT WAS MEASURED BEFORE A LINE OF THIS WAS WRITTEN (the real valley, overmap 12345)
// ============================================================================
//   - WORLD's parties (engine/bohemia_parties.js) already have purpose: 28 out, 14 patrols, 10 caravans,
//     4 crews, each sent by a seat with an agenda, and ALL 28 MOVE over a day. That half is done.
//   - *** BUT IN 58 OF THE DAY'S 90 STEPS TWO OR MORE PARTIES STOOD ON ONE CELL, 99 STACKS, UP TO THREE
//     DEEP. *** A caravan out of A and a caravan out of B walk the same line toward each other; two patrols
//     of one seat share a border. NOBODY STANDS ON ANYBODY (first votes, 9/21) is broken on the map.
//   - The tracks ([tracks read], 9/12) are DERIVED from the leg a party is on and never fade: the moment a
//     party turns round its prints vanish, and while it walks they never age. His row: "fade by the hour".
//   - Market day is RUN TWO's trait (records/target/settlement_traits.json), rolled per place by name and
//     week on the settlement screen. The map did not know a market was on.
//
// ============================================================================
// WHAT THIS FILE DOES, AND WHAT IT DOES NOT
// ============================================================================
//   WHERE A PARTY GOES and WHY is WORLD's. This file calls BohemiaParties.advance() one step at a time
//   and only then settles who stands where: a party whose cell is already taken waits where it was, or
//   steps to the free neighbour that keeps it closest to where it is going. A party that just ARRIVED
//   keeps the cell it arrived on (it was sent there). TOWNS ARE EXEMPT: a seat and the blocks round it
//   are the town, and a town holds everybody it sends and everybody who comes to trade.
//   THE PRINTS are kept here, TRANSIENT and BOUNDED, never saved: each step a party takes off a town
//   leaves one print with the hour it was made, and a print is gone PRINT_HOURS later. Bounded because
//   28 parties at about 90 cells a day is about 2,500 prints a day; never saved because footprints after
//   a reload are a nicety, and a save that grows with every step is the trap [tracks read] avoided.
//   THE CROWD at a gate reads the SAME roll the settlement screen makes (the same hash, the same
//   generator, the same file), so the map and the place it opens can never disagree about market day;
//   and it reads the SAME multiplier that fills the stalls (stock_mult): who is at the gate is what is
//   on the shelves. The gate holds the two rolls equal by running the settlement screen's own code.
//
// THE NUMBERS, AND WHOSE THEY ARE
//   PRINT_HOURS = 24      MINE, draft, tuned:false -> TUNING. Battle Brothers says prints fade "with time"
//                         (reference/library/battle_brothers/01_WORLDMAP.md) and gives no number; a day is
//                         the smallest span in which the map's whole clock turns once, so a print you see
//                         at dawn is a party that went by since yesterday's dawn.
//   the crowd's base      BohemiaTowns.REACH by tier (camp 1, town 2, fortress 3): the table that already
//                         says how much business a place has abroad; the gate is the same business at home.
//   the market's swell    the trait's own stock_mult (market day 1.5, raided 0.6, sickness 0.8).
//
// node: require('./bohemia_livingmap.js')   Gate: gates/the_living_map_gate.js
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  function DEP(file, global) {
    if (HASREQ) { try { return require('./' + file + '.js'); } catch (e) { return null; } }
    return root[global] || null;
  }
  function PARTIES() { return DEP('bohemia_parties', 'BohemiaParties'); }
  function TOWNS() { return DEP('bohemia_towns', 'BohemiaTowns'); }

  var PRINT_HOURS = 24;
  var TUNED = false, DRAFT = true;
  var TOWN_R = 1;                       /* a seat and the blocks round it are the town */
  var DIRS = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

  function make() { return { V: 1, prints: [], carry: 0 }; }

  function cheb(ax, ay, bx, by) { return Math.max(Math.abs(ax - bx), Math.abs(ay - by)); }
  function isTown(seats, x, y) {
    for (var i = 0; i < (seats || []).length; i++)
      if (seats[i] && cheb(seats[i].x | 0, seats[i].y | 0, x, y) <= TOWN_R) return true;
    return false;
  }
  function targetOf(p) { return p.arrived ? p.from : p.to; }
  function key(x, y) { return x + ',' + y; }

  /* WHO STANDS WHERE, AFTER WORLD'S STEP. `before` is where everybody stood a step ago (all distinct off
     town). Arrivals first (they were sent to that cell), then everybody else in id order, so the same
     valley settles the same way every load. */
  function settle(parties, seats, before) {
    var taken = {}, order = [], i;
    for (i = 0; i < parties.length; i++) if (parties[i] && parties[i].at) order.push(i);
    order.sort(function (a, b) {
      var pa = parties[a], pb = parties[b];
      var ja = (pa.at.x === targetOf(pa).x && pa.at.y === targetOf(pa).y) ? 0 : 1;
      var jb = (pb.at.x === targetOf(pb).x && pb.at.y === targetOf(pb).y) ? 0 : 1;
      if (ja !== jb) return ja - jb;
      return pa.id < pb.id ? -1 : (pa.id > pb.id ? 1 : 0);
    });
    var moved = 0;
    for (var o = 0; o < order.length; o++) {
      var p = parties[order[o]], x = p.at.x, y = p.at.y;
      if (isTown(seats, x, y) || !taken[key(x, y)]) { if (!isTown(seats, x, y)) taken[key(x, y)] = true; continue; }
      /* TAKEN: wait where it was, or the free neighbour of where it was that keeps it nearest its goal */
      var b = before[order[o]], t = targetOf(p), best = null, bestD = 1e9;
      for (var d = 0; d < DIRS.length; d++) {
        var nx = b.x + DIRS[d][0], ny = b.y + DIRS[d][1];
        if (!isTown(seats, nx, ny) && taken[key(nx, ny)]) continue;
        var dd = cheb(nx, ny, t.x, t.y) * 10 + (d === 0 ? 1 : 0);   /* a tie goes to moving, not waiting */
        if (dd < bestD) { bestD = dd; best = [nx, ny]; }
      }
      if (best) { p.at.x = best[0]; p.at.y = best[1]; moved++; }
      if (!isTown(seats, p.at.x, p.at.y)) taken[key(p.at.x, p.at.y)] = true;
    }
    return moved;
  }

  /* ONE STEP OF THE VALLEY'S BUSINESS, at `hour` (whole hours since the start of the game). */
  function step(parties, seats, st, hour) {
    var PP = PARTIES(); if (!PP || !parties) return { settled: 0 };
    var before = parties.map(function (p) { return p && p.at ? { x: p.at.x, y: p.at.y } : null; });
    PP.advance(parties, 1, 1);
    var settled = settle(parties, seats, before);
    for (var i = 0; i < parties.length; i++) {
      var p = parties[i], b = before[i];
      if (!p || !b || (p.at.x === b.x && p.at.y === b.y)) continue;
      if (isTown(seats, b.x, b.y)) continue;              /* nobody reads prints inside a town */
      st.prints.push({ x: b.x, y: b.y, f: p.from.faction, a: p.agenda, id: p.id,
                       dx: p.at.x - b.x, dy: p.at.y - b.y, h: hour });
    }
    return { settled: settled };
  }

  /* THE CLOCK MOVES THE VALLEY, AND ONLY THE CLOCK. `hours` passed at `cellsPerHour`; the fraction is
     carried, never thrown away (RUN's 9/29 lesson: floored every call, nobody ever left home). With
     hours 0 -- the clock stopped -- nothing moves and nothing fades (68a). */
  function advanceHours(parties, seats, st, hours, cellsPerHour, hourNow) {
    if (!(hours > 0) || !(cellsPerHour > 0)) return { steps: 0 };
    st.carry += hours * cellsPerHour;
    var whole = Math.floor(st.carry + 1e-9), start = (hourNow || 0) - hours;
    st.carry -= whole;
    for (var s = 0; s < whole; s++) step(parties, seats, st, start + hours * (s + 1) / whole);
    prune(st, hourNow || 0);
    return { steps: whole };
  }

  function prune(st, hourNow) {
    var keep = [];
    for (var i = 0; i < st.prints.length; i++) if (hourNow - st.prints[i].h < PRINT_HOURS) keep.push(st.prints[i]);
    st.prints = keep;
    return keep.length;
  }
  /* HOW STRONG A PRINT STILL READS: 1 the hour it was made, 0 a day later, a straight fade by the hour. */
  function fadeOf(pr, hourNow) {
    var age = hourNow - pr.h;
    if (age < 0) return 1;
    return Math.max(0, 1 - age / PRINT_HOURS);
  }

  /* NOBODY STANDS ON ANYBODY, as a count: cells off a town with two or more parties on them. */
  function stacks(parties, seats) {
    var c = {}, out = [];
    for (var i = 0; i < (parties || []).length; i++) {
      var p = parties[i]; if (!p || !p.at || isTown(seats, p.at.x, p.at.y)) continue;
      var k = key(p.at.x, p.at.y); (c[k] = c[k] || []).push(p.id);
    }
    for (var k2 in c) if (c[k2].length > 1) out.push({ cell: k2, ids: c[k2] });
    return out;
  }

  /* ---- THE GATE ON MARKET DAY ------------------------------------------------------------------
     THE SETTLEMENT SCREEN'S OWN ROLL, line for line (slices/BOHEMIA_SETTLEMENT_SCREEN.html: seedOf,
     rng, rollTraits). The gate runs that page's functions beside these over hundreds of names and days
     and refuses if one answer differs. */
  function seedOf(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var x = seed >>> 0 || 1; return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; }
  function traitsFor(file, name, day) {
    if (!file || !file.traits) return [];
    var per = (file.roll && file.roll.period_days) || 7, R1 = rng(seedOf(name + ':traits:' + Math.floor((day || 0) / per)));
    var out = [];
    if (R1() < ((file.roll && file.roll.chance_any) || 0.7)) {
      var pool = file.traits.slice(), n = 1 + (R1() < 0.3 ? 1 : 0);
      for (var i = 0; i < n && pool.length; i++) out.push(pool.splice(Math.floor(R1() * pool.length), 1)[0]);
    }
    return out;
  }
  /* HOW MANY STAND AT THE GATE: the tier's business (REACH), swelled or thinned by the same multiplier
     that fills or empties the stalls. Market day adds the swell on top of the ordinary crowd. */
  function crowdAt(file, place, day) {
    var T = TOWNS(), reach = (T && T.REACH) || { camp: 1, town: 2, fortress: 3 };
    var base = Object.prototype.hasOwnProperty.call(reach, place.tier) ? reach[place.tier] : reach.camp;
    var tr = traitsFor(file, place.name, day), c = crowdOf(base, tr);
    return { count: c.count, base: base, market: c.market, traits: tr.map(function (t) { return t.id; }) };
  }
  /* the arithmetic alone: the swell first, then the thinning, so the order the traits were rolled in
     never changes the count */
  function crowdOf(base, tr) {
    var n = base, thin = 1, market = false;
    for (var i = 0; i < (tr || []).length; i++) {
      var m = tr[i].stock_mult || 1;
      if (m > 1) { n += Math.ceil(base * m); market = true; } else thin *= m;
    }
    return { count: Math.max(0, Math.round(n * thin)), market: market };

  }

  var API = { PRINT_HOURS: PRINT_HOURS, TUNED: TUNED, draft: DRAFT, TOWN_R: TOWN_R,
              make: make, step: step, advanceHours: advanceHours, prune: prune, fadeOf: fadeOf,
              stacks: stacks, isTown: isTown, seedOf: seedOf, rng: rng, traitsFor: traitsFor, crowdAt: crowdAt, crowdOf: crowdOf };
  if (HASREQ) module.exports = API;
  root.BohemiaLivingMap = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
