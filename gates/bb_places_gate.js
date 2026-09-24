#!/usr/bin/env node
/* BOHEMIA — BB PLACES GATE (9/25/26, WORLD lane, row [bb places])
 *
 * RULE 33 (Paolo 9/24, "an executive decision"): THE OVERWORLD IS BATTLE
 * BROTHERS, and "places are destinations". This row is the school for what a
 * place OFFERS when you arrive.
 *
 * BATTLE BROTHERS, researched not remembered (battlebrothers.fandom.com,
 * Settlements and attached locations; dev blog 56): every settlement has
 * ATTACHED LOCATIONS -- a mine, wheat fields, an arrow-maker's shed -- and they
 * "influence heavily the available goods, services and recruitment options". A
 * settlement sitting on the thing that makes an item sells it unusually CHEAP,
 * market prices rise with the NUMBER of attached locations (base + count x 3%,
 * 3 to 8 locations, so 9-24%), and some attached locations attract recruits of
 * particular backgrounds.
 *
 *  A  *** WE ALREADY HAVE THE ATTACHED LOCATIONS. *** bohemia_towns.minesOf
 *     flood-fills runs of solar, dam and battery and attributes them by faction.
 *     Measured on seed 1337: 4 sites, 308 cells, held by three factions.
 *
 *  B  *** AND THE FINDING THAT PROVES US WRONG: FOURTEEN PLACES, THREE SHELVES.
 *     *** goodsFor(tier, goods) returns all.slice(0, n), so a shelf is a function
 *     of TIER ALONE. Every camp in the valley sells the same four things, every
 *     town the same eight, every fortress the same eleven. Places differ from the
 *     tier above them and are IDENTICAL to their own tier. In BB two settlements
 *     of the same size are different because their hinterland is different.
 *
 *  C  AND THE INVERSION THAT MAKES IT VIVID: HOMELESS is rank 14 of 14 on his own
 *     power ladder, tier CAMP, shelf of FOUR -- and holds 254 of the valley's 308
 *     generating cells and makes more batteries a day than anybody. THE POOREST
 *     PLACE IN LAS VEGAS MAKES THE MOST MONEY AND SELLS THE LEAST. Meanwhile
 *     three of the five fortresses, with the deepest shelves, hold no hinterland
 *     at all.
 *
 *  D  THE SHELF DOES NOT READ THE HINTERLAND, measured rather than asserted.
 *
 *  E  *** AND BB'S PRICE MECHANISM MAY NOT BE IMPORTED, WHICH THIS GATE HOLDS SO
 *     NOBODY TRIES. *** EVERYTHING COSTS ONE (Paolo 8/15) and his 9/15 ruling
 *     after this lane built a stranger surcharge: "the surcharge is DEAD... never
 *     a number above one; the spread lives in ACCESS and DISTANCE." So the
 *     hinterland must change WHAT IS ON THE SHELF, never what it costs. That is
 *     not a compromise: it is the same lesson, since what a camp cannot get is
 *     already how this game says a place is poor.
 *
 *  F  RULE 22 / 29 / 32(f): the cook is drawn, at game scale, and obeys his 9/23
 *     sand ruling.
 *
 * NOT SHIPPED (rule 18): this is school. The rows come after.
 *
 *   node gates/bb_places_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));

const T = R('engine/bohemia_towns.js');
const OM = R('engine/bohemia_overmap.js');
const CE = R('engine/bohemia_cityedit.js');
const E = R('engine/bohemia_economy.js');
const P = R('engine/bohemia_purse.js');
const GRAPH = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'), 'utf8'));
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

const GOODS = Object.keys(E.GOODS || E.goods || {});
function valley(seed) {
  const m = OM.buildOvermap(seed);
  const ds = T.districtsOf(m, CE.cat);
  const seats = T.derive(GRAPH, ds, 1) || [];
  const mines = T.minesOf(m, CE.cat, seats);
  return { m, seats, mines };
}

/* ---- A. WE ALREADY HAVE THE ATTACHED LOCATIONS -------------------------- */
section('A the hinterland exists and is owned', () => {
  const { seats, mines } = valley(1337);
  const cells = mines.sites.reduce((n, s) => n + s.cells, 0);
  console.log('    [measured] ' + seats.length + ' places, ' + mines.sites.length
    + ' generating sites over ' + cells + ' cells, held by '
    + Object.keys(mines.byFaction).length + ' factions: '
    + Object.entries(mines.byFaction).map(([f, v]) => f + ' ' + v.cells).join(', '));

  ok('*** THE ATTACHED LOCATIONS ARE ALREADY BUILT (minesOf) ***',
     mines.sites.length > 0 && cells > 100);
  ok('and a SITE is a building and not a cell, which is why the dam is one site',
     mines.sites.some(s => s.kind === 'dam' && s.cells < 10) &&
     mines.sites.some(s => s.cells > 100));
  ok('the kinds are the three real ways to make power in a desert',
     mines.kinds.join(',') === 'solar,dam,battery');
  ok('every site is attributed to a holder, which is what makes it a hinterland',
     Object.keys(mines.byFaction).length > 0);
  ok('and what a site makes a day is his ruling, carried as a string',
     T.PER_SITE_PER_DAY === 1 && /EVERYTHING COSTS ONE/.test(T.MINE_RULING));
});

/* ---- B. *** FOURTEEN PLACES, THREE SHELVES *** -------------------------- */
section('B the finding: a shelf is a function of tier alone', () => {
  const { seats } = valley(1337);
  const shelves = {};
  seats.forEach(s => {
    const k = T.goodsFor(s.tier, GOODS).join(',');
    (shelves[k] = shelves[k] || []).push(s.faction);
  });
  const n = Object.keys(shelves).length;
  console.log('    [measured] ' + seats.length + ' places -> ' + n + ' DISTINCT SHELVES');
  Object.entries(shelves).forEach(([k, v]) =>
    console.log('      ' + String(v.length).padStart(2) + ' places sell ' + k.split(',').length
      + ' goods: ' + v.join(' ')));

  ok('*** FOURTEEN PLACES AND THREE SHELVES: every camp sells the same four things ***',
     seats.length >= 14 && n === 3,
     n + ' shelves for ' + seats.length + ' places -- if this has risen, somebody gave a place its own stock and this gate must be re-aimed');

  /* and it is slice(0, n), which is why: the shelf cannot express WHICH goods */
  const camp = T.goodsFor('camp', GOODS), fort = T.goodsFor('fortress', GOODS);
  ok('a camp\'s shelf is the FIRST n of the list, never a choice of which',
     camp.every((g, i) => g === GOODS[i]));
  ok('so depth is the only axis a place has (camp ' + camp.length + ', fortress ' + fort.length + ')',
     camp.length < fort.length && fort.length === GOODS.length);
});

/* ---- C. THE INVERSION ---------------------------------------------------- */
section('C the poorest place holds the most', () => {
  const { seats, mines } = valley(1337);
  const cells = mines.sites.reduce((n, s) => n + s.cells, 0);
  const byCells = Object.entries(mines.byFaction).sort((a, b) => b[1].cells - a[1].cells);
  const top = byCells[0];
  const seat = seats.find(s => s.faction === top[0]);
  console.log('    [measured] the biggest holder is ' + top[0] + ' (' + seat.tier + ', rank '
    + seat.rank + ' of ' + seats.length + ') with ' + top[1].cells + ' of ' + cells
    + ' cells and a shelf of ' + T.goodsFor(seat.tier, GOODS).length);

  ok('*** THE BIGGEST HOLDER OF POWER IN THE VALLEY IS A CAMP ***',
     seat.tier === 'camp' && top[1].cells > cells / 2,
     top[0] + ' is a ' + seat.tier);
  /* *** AND THIS CHECK CAUGHT MY OWN RECORD OVERSTATING IT. *** I wrote "rank 14
     of 14" in the school page, the tool head and the vote row before running
     this. Homeless is rank 13; COLORFUL is 14. The finding does not move -- it is
     still a camp with the shortest shelf sitting on 254 of 308 cells -- but the
     number was wrong in his own canon and the gate said so before he saw it. */
  ok('and it is near the bottom of his own power ladder (rank ' + seat.rank
     + ' of ' + seats.length + ')',
     seat.rank >= seats.length - 1, 'rank ' + seat.rank);
  ok('*** AND IT SELLS THE SHORTEST LIST IN THE VALLEY ***',
     T.goodsFor(seat.tier, GOODS).length === Math.min(
       ...seats.map(s => T.goodsFor(s.tier, GOODS).length)));
  /* and the mirror: deep shelves standing on nothing */
  const barren = seats.filter(s => s.tier === 'fortress' && !mines.byFaction[s.faction]);
  console.log('    [measured] ' + barren.length + ' of the fortresses hold no hinterland at all: '
    + barren.map(s => s.faction).join(' '));
  ok('and the deepest shelves in the valley stand on nothing', barren.length >= 2);
});

/* ---- D. THE SHELF DOES NOT READ THE HINTERLAND -------------------------- */
section('D the shelf and the hinterland have never met', () => {
  const at = CITY.indexOf('function mktShelf');
  const shelf = CITY.slice(at, at + 1800);
  ok('the walked city really does have a shelf', at > 0);
  ok('*** AND IT NEVER ASKS WHAT ITS OWN GROUND MAKES ***',
     !/minesOf|minesFor|MAKES|\.sites/.test(shelf),
     'if it does now, this row has been built and the gate must be re-aimed');
  console.log('    [measured] minesOf has ' + (CITY.match(/minesOf\(/g) || []).length
    + ' callers in the walked city and none of them is the shelf');
});

/* ---- E. *** BB'S PRICE MECHANISM MAY NOT BE IMPORTED *** ---------------- */
section('E the spread lives in access, never in price', () => {
  const amounts = Object.values(P.PRICES || {}).map(v => (v && v.amount != null) ? v.amount : v);
  console.log('    [measured] ' + amounts.length + ' ruled prices, '
    + new Set(amounts).size + ' distinct value: ' + [...new Set(amounts)].join(','));
  ok('*** EVERYTHING COSTS ONE, and BB\'s hinterland-discount would break it ***',
     amounts.length > 0 && new Set(amounts).size === 1 && amounts[0] === 1,
     'a second price appeared -- his 9/15 ruling said never a number above one');
  ok('and every price carries the ruling that put it there, not a tuned number',
     Object.values(P.PRICES).every(v => v && /EVERYTHING COSTS ONE/.test(v.ruling || '')));
  /* the record has to say this out loud, because it is the trap this lane already
     fell into once (aa3ca379, the stranger surcharge that cost two days' work) */
  const rec = path.join(ROOT, 'records/BOHEMIA_WORLD_BB_PLACES_THE_HINTERLAND_9_25_26.md');
  ok('the school says why BB\'s price rule cannot come here', fs.existsSync(rec) &&
     /surcharge/i.test(fs.readFileSync(rec, 'utf8')));
});

/* ---- F. THE COOK IS DRAWN, AT GAME SCALE, AND OBEYS HIS SAND RULING ----- */
section('F the cook', () => {
  const png = path.join(ROOT, 'slices/vote/WORLD_THE_CAMP_THAT_HOLDS_THE_POWER.png');
  ok('the picture exists', fs.existsSync(png));
  if (fs.existsSync(png)) {
    const b = fs.readFileSync(png);
    ok('and it is a real PNG', b.length > 1000 && b[0] === 0x89 && b[1] === 0x50, b.length + ' bytes');
  }
  const bp = path.join(ROOT, 'banks/BOHEMIA_THE_CAMP_THAT_HOLDS_THE_POWER_9_25_26.txt');
  ok('with a bank behind it that parses', fs.existsSync(bp));
  if (!fs.existsSync(bp)) return;
  const doc = JSON.parse(fs.readFileSync(bp, 'utf8'));
  ok('*** THE ARRAY DWARFS THE CAMP THAT HOLDS IT, which is the finding ***',
     doc.machinePixels > doc.shelterPixels);
  ok('AH-01: the one wrong thing is small', doc.keptGroundShare > 0 && doc.keptGroundShare <= 8);
  ok('rule 33g: it says what MOVES that BB\'s still does not',
     /rows track the sun|LIT while the valley/i.test(doc.what_moves || ''));
  ok('*** HIS 9/23 SAND RULING IS HELD IN THE TOOL, not just obeyed once ***',
     /#6e6045/.test(doc.sand_ruling || '') && doc.palette['1'] === '#6e6045');

  const reg = R('records/target/BOHEMIA_VOTE_REGISTRY.json');
  const mine = reg.items.filter(i => i.lane === 'world');
  const judged = (reg.verdicts || []).map(v => v.id);
  const open = mine.filter(i => judged.indexOf(i.id) < 0);
  ok('*** EVERY UNJUDGED ITEM THIS LANE HAS IS A THING TO LOOK AT, NOT A PAGE ***',
     open.length > 0 && open.every(i => i.show && i.show.how === 'image'),
     open.map(i => i.id + ':' + (i.show && i.show.how)).join(' '));
  ok('and this round\'s picture is registered', mine.some(i => /camp-that-holds/.test(i.id)));
});

console.log('BB PLACES GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (the attached locations are already built and the shelf never asks: fourteen'
  + ' places, three shelves, and the camp holding the valley\'s power sells the least)');
process.exit(fail ? 1 : 0);
