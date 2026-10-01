/* BUILD A LOT — the gate for rule 40(b) (9/29/26, LIFE + CITY, [build a lot])
 *
 * Paolo 9/29: "a more deep rich interactable buildable world." Building is back inside the settlement
 * screen of a home base you own: tap a lot, build from the assets we have, it costs batteries and
 * time, and it shows on the map, on the fight board and in the derived future. This lane owns WHAT
 * can be built and WHAT IT DOES (engine/bohemia_lotbuild.js); this gate holds that to his rulings.
 *
 *   A  EVERY PIECE IS REAL: each entry's picture is a legend code in a registered district kit.
 *   B  EVERY NUMBER IS A RULING: one battery, one day (8/15 + 9/4); the solar panel's yield is WORLD's
 *      ruled power-building amount, read, never typed.
 *   C  THE 7/26 LAW: each entry houses a household or makes exactly one currency -- except the wall,
 *      which makes nothing and says so.
 *   D  THE MONEY: a start costs exactly one battery; broke, taken lot and unknown thing are refused
 *      BY NAME.
 *   E  THE FUTURE: nothing finishes early; a finished build is a `build` in the century ledger, so
 *      the real derive's act 3 counts it, and a roof adds a household to the people ([three cities]
 *      folds under this row).
 *   F  THE PAY: once per standing building per day, derived from the purse's own ledger -- including
 *      across a save and a load, which the first cut got wrong.
 *   G  THE FIGHT AND THE MAP: a roof is high ground (37g), a wall is a wall, every marker names its piece.
 *   H  MUTATIONS: a made-up piece is caught; a lot that would pay twice is caught.
 *
 * ROUND 2 (9/29, rule 43: WHERE YOU BUILD IS WHAT YOU HOLD, AND WHAT YOU HOLD GROWS):
 *   I  THE HOLD IS FACTIONS' LEDGER, READ: no hold no build; a part somebody else holds refuses and
 *      names them; taking a part opens a site there (the base grows); the rungs lock KINDS, not places.
 *   J  TAKEN FROM YOU: it stands, pays you nothing, nothing finishes; take it back and it pays again.
 *   K  RUINED: everything you built there falls, as demolishes the real derive counts; the lots are
 *      bare; a ruin is moved into a generation later and built from nothing.
 *   L  THE FIRST TWO (the invasive round): a WALL and a lidded WATER TANK lead the list; a garden with
 *      no wall is open to hogs, water with no tank to pigeons, and building the guard closes it.
 *   M  THE SIX (rule 47): every entry feeds one of the six or none; nothing makes meds or rounds.
 *   N  MUTATION: the same part with the ledger's taking erased refuses, so the ledger is what is read.
 *
 * ROUND 3 (10/1): A LOT LIES IN A REAL BLOCK of the real valley (overmap 12345, FACTIONS' turf grid):
 *   O  take the Mob's part and the blocks you hold are exactly the Mob's blocks; a lot in one of them
 *      builds, a lot in a Cartel block on the Mob's screen is WRONG_PART, and taking more parts grows
 *      the count; a ruin takes its blocks with it.
 *
 * Run:  node gates/build_a_lot_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const ENGINE = path.join(ROOT, 'engine');

const realExit = process.exit, realLog = console.log;
process.exit = function () {}; console.log = function () {};
const K = require(path.join(ENGINE, 'bohemia_district_kit.js'));
for (const f of fs.readdirSync(ENGINE).filter(n => n.endsWith('.js'))) {
  try { require(path.join(ENGINE, f)); } catch (e) { /* not every engine file is a district */ }
}
process.exit = realExit; console.log = realLog;

const LB = require(path.join(ENGINE, 'bohemia_lotbuild.js'));
const P = require(path.join(ENGINE, 'bohemia_purse.js'));
const C = require(path.join(ENGINE, 'bohemia_century.js'));
const F = require(path.join(ENGINE, 'bohemia_future.js'));
const W = require(path.join(ENGINE, 'bohemia_powerbuild.js'));
const HB = require(path.join(ENGINE, 'bohemia_homebases.js'));
const TOWNS = require(path.join(ENGINE, 'bohemia_towns.js'));
const CE = require(path.join(ENGINE, 'bohemia_cityedit.js'));
const OM = require(path.join(ENGINE, 'bohemia_overmap.js'));
const GRAPH = require(path.join(ENGINE, 'BOHEMIA_faction_graph.json'));

let pass = 0, fail = 0;
const ok = (name, cond, detail) => {
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '  [' + detail + ']' : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '  [' + detail + ']' : '')); }
};
const LAYOUT = { cells: 9216, lit: 425, standing: 0, people: 215 };
function rich(n) { const p = P.create({}); P.credit(p, 'electricity', n, 'gate', 'seed', 0); return p; }
/* THE HOLD. Three seats off the same shape BohemiaTowns.derive() hands FACTIONS; the company has taken
   the Mob's part, so that one is yours and the other two are their own people's. */
const SEATS = [{ faction: 'mob' }, { faction: 'cartel' }, { faction: 'church' }];
function held() { const rec = HB.make({ act: 1 }); HB.took(rec, { base: 'mob', to: HB.YOU, day: 0 }); return { rec: rec, act: 1 }; }
function yours() { return LB.site({ base: 'mob' }); }

/* ---- A ---- */
function pieceOf(e) { const d = K.get(e.piece.kit); return d && d.legend && d.legend[e.piece.code]; }
const missing = LB.CATALOG.filter(e => !pieceOf(e)).map(e => e.id + '->' + e.piece.kit + ':' + e.piece.code);
ok('there is something to build', LB.CATALOG.length >= 5, LB.CATALOG.length + ' things');
ok('A every thing on the list is a piece the game already draws', missing.length === 0,
   missing.join(', ') || LB.CATALOG.map(e => e.id + '=' + e.piece.kit + ':' + pieceOf(e).name).join(', '));

/* ---- B ---- */
ok('B it costs ONE BATTERY', LB.COST.currency === 'electricity' && LB.COST.amount === 1);
ok('B and ONE DAY', LB.DAYS === 1);
ok('B the rulings travel with the numbers', /8\/15 EVERYTHING COSTS ONE/.test(LB.RULING) && /9\/4 BATTERIES/.test(LB.RULING));
ok('B the solar panel makes WORLD\'s ruled amount, read not typed',
   LB.makesOf('solar') && LB.makesOf('solar').electricity === W.AMOUNT,
   'makes ' + JSON.stringify(LB.makesOf('solar')) + ', ruled ' + W.AMOUNT);

/* ---- C ---- */
const bad = LB.CATALOG.filter(e => {
  if (e.id === 'wall') return !!e.makes || !!e.houses;
  const m = LB.makesOf(e.id), n = m ? Object.keys(m).length : 0;
  return !((e.houses && n === 0) || (!e.houses && n === 1));
}).map(e => e.id);
ok('C each one houses a household or makes exactly one currency; the wall makes nothing', bad.length === 0, bad.join(', ') || 'all');
const cur = new Set(); LB.CATALOG.forEach(e => { const m = LB.makesOf(e.id); if (m) Object.keys(m).forEach(k => cur.add(k)); });
ok('C all three currencies can be built for', ['resources', 'electricity', 'clout'].every(c => cur.has(c)), [...cur].join(', '));

/* ---- D ---- */
{
  const p = rich(2), s = yours(), h = held();
  const r = LB.start(s, p, { x: 1, y: 1 }, 'shed', 0, h);
  ok('D a start costs exactly one battery', r.ok && P.balance(p, 'electricity') === 1, 'left ' + P.balance(p, 'electricity'));
  ok('D a taken lot is refused by name', LB.start(s, p, { x: 1, y: 1 }, 'pump', 0, h).why === 'LOT_TAKEN');
  ok('D an unknown thing is refused by name', LB.start(s, p, { x: 2, y: 2 }, 'casino', 0, h).why === 'NOT_BUILDABLE');
  const broke = LB.start(yours(), P.create({}), { x: 1, y: 1 }, 'shed', 0, h);
  ok('D broke is refused by name, and nothing is built', broke.why === 'CANNOT_AFFORD');
}

/* ---- E ---- */
{
  const p = rich(5), s = yours(), cen = C.make({ act: 1 }), h = held();
  LB.start(s, p, { x: 1, y: 1 }, 'pump', 3, h); LB.start(s, p, { x: 2, y: 1 }, 'roof', 3, h);
  const early = LB.tick(s, p, cen, 3, h);
  ok('E nothing is finished before its day', early.finished.length === 0 && C.through(cen, 3).built === 0);
  const before = F.derive(LAYOUT, { century: C.make({ act: 1 }) }, 3).valley;
  const done = LB.tick(s, p, cen, 4, h);
  const after = F.derive(LAYOUT, { century: cen }, 3).valley;
  ok('E a finished build is a deed in the century ledger', done.finished.length === 2 && C.through(cen, 3).built === 2);
  ok('E *** AND THE REAL FUTURE COUNTS IT: act 3 has two more standing ***',
     after.standing === before.standing + 2, before.standing + ' -> ' + after.standing);
  ok('E a roof puts a household back: act 3 has more people', after.people > before.people,
     before.people + ' -> ' + after.people);
  ok('E and the lines of the map never move', after.cells === LAYOUT.cells);
}

/* ---- F ---- */
{
  const p = rich(3), s = yours(), cen = C.make({ act: 1 }), h = held();
  LB.start(s, p, { x: 1, y: 1 }, 'solar', 0, h); LB.start(s, p, { x: 2, y: 1 }, 'solar', 0, h);
  LB.tick(s, p, cen, 1, h);
  const b1 = P.balance(p, 'electricity');
  LB.tick(s, p, cen, 1, h);
  ok('F two panels standing pay two, and the same day twice pays nothing more', b1 === 3 && P.balance(p, 'electricity') === 3, 'after day 1: ' + b1);
  const re = P.load(P.save(p));
  LB.tick(s, re, cen, 1, h);
  ok('F *** A SAVE AND A LOAD ON THE SAME DAY PAYS NOTHING MORE ***', P.balance(re, 'electricity') === 3, 'after reload: ' + P.balance(re, 'electricity'));
  LB.tick(s, re, cen, 2, h);
  ok('F the next day pays again', P.balance(re, 'electricity') === 5);
  const w = yours(), pw = rich(1); LB.start(w, pw, { x: 1, y: 1 }, 'wall', 0, h); LB.tick(w, pw, C.make({ act: 1 }), 1, h);
  ok('F a wall pays nothing, ever', P.balance(pw, 'electricity') === 0 && P.balance(pw, 'resources') === 0);
}

/* ---- G ---- */
ok('G a roof is HIGH GROUND on the fight board (37g)', LB.fightTile('roof') === 'high');
ok('G a wall is a wall', LB.fightTile('wall') === 'wall');
ok('G every marker names its own piece', LB.CATALOG.every(e => { const m = LB.markerOf(e.id); return m && m.kit === e.piece.kit && m.code === e.piece.code; }));

/* ---- H ---- */
{
  const fake = { id: 'x', piece: { kit: 'suburb', code: 999 } };
  ok('H MUTATION: a made-up piece is caught', !pieceOf(fake));
  const p = rich(1), s = yours(), h = held(); LB.start(s, p, { x: 1, y: 1 }, 'shed', 0, h); LB.tick(s, p, C.make({ act: 1 }), 1, h);
  const res = P.balance(p, 'resources');
  p.entries = p.entries.filter(e => e.reason !== 'produce:lot:shed');   // the ledger "forgets" today
  LB.tick(s, p, C.make({ act: 1 }), 1, h);
  ok('H MUTATION: paid-today really is read from the ledger (erase the entry and it pays again)',
     res === 1 && P.balance(p, 'resources') === 1);
}

/* ---- I: THE HOLD ---- */
{
  const p = rich(5), h = held();
  ok('I no hold handed, no build', LB.start(yours(), p, { x: 1, y: 1 }, 'wall', 0).why === 'NO_HOLD');
  const r = LB.start(LB.site({ base: 'cartel' }), p, { x: 1, y: 1 }, 'wall', 0, h);
  ok('I a part somebody else holds refuses, and names who holds it', r.why === 'NOT_HELD' && r.holder === 'cartel', JSON.stringify(r));
  ok('I and the refusal cost nothing', P.balance(p, 'electricity') === 5);
  let g = LB.holdings({}, h, SEATS);
  ok('I holding one part opens one site', g.held.join() === 'mob' && Object.keys(g.book).join() === 'mob');
  HB.took(h.rec, { base: 'cartel', to: HB.YOU, day: 5 });
  g = LB.holdings(g.book, h, SEATS);
  ok('I *** WHAT YOU HOLD GROWS: take the next part and it opens a site there ***',
     g.held.join() === 'mob,cartel' && !!g.book.cartel, g.held.join(', '));
  ok('I and you can build there now', LB.start(g.book.cartel, p, { x: 1, y: 1 }, 'wall', 5, h).ok);
  ok('I the list says whether the part is yours', LB.list(g.book.cartel, p, h).every(x => x.held) &&
     LB.list(LB.site({ base: 'church' }), p, h).every(x => !x.held));
  const lock = Object.assign({}, h, { kinds: ['wall', 'water'] });
  ok('I the rungs lock KINDS, not places: a closed kind refuses by name', LB.start(g.book.mob, p, { x: 3, y: 3 }, 'solar', 5, lock).why === 'KIND_LOCKED');
  ok('I and an open kind on the same part builds', LB.start(g.book.mob, p, { x: 3, y: 3 }, 'tank', 5, lock).ok);
  ok('I the list marks which kinds are open', LB.list(g.book.mob, p, lock).filter(x => x.open).map(x => x.id).join() === 'wall,tank,pump');
}

/* ---- J: TAKEN FROM YOU ---- */
{
  const p = rich(3), s = yours(), cen = C.make({ act: 1 }), h = held();
  LB.start(s, p, { x: 1, y: 1 }, 'solar', 0, h); LB.tick(s, p, cen, 1, h);
  LB.start(s, p, { x: 2, y: 1 }, 'shed', 1, h);
  const before = P.balance(p, 'electricity');
  HB.took(h.rec, { base: 'mob', to: 'cartel', day: 2 });
  const t = LB.tick(s, p, cen, 2, h);
  ok('J taken: the panel stands and pays you nothing', t.state === 'theirs' && P.balance(p, 'electricity') === before && LB.standing(s) === 1,
     'state ' + t.state + ', batteries ' + before + ' -> ' + P.balance(p, 'electricity'));
  ok('J and the half-built shed does not finish on their ground', t.finished.length === 0 && C.through(cen, 1).built === 1);
  ok('J nothing fell: a part taken is not a part ruined', C.through(cen, 1).demolished === 0);
  HB.took(h.rec, { base: 'mob', to: HB.YOU, day: 3 });
  const back = LB.tick(s, p, cen, 3, h);
  ok('J take it back: it pays you again, and the shed finishes', back.state === 'yours' && back.paid.indexOf('solar') >= 0 && back.finished.indexOf('shed') >= 0);
}

/* ---- K: RUINED ---- */
{
  const p = rich(4), s = yours(), cen = C.make({ act: 1 }), h = held();
  LB.start(s, p, { x: 1, y: 1 }, 'wall', 0, h); LB.start(s, p, { x: 2, y: 1 }, 'roof', 0, h);
  LB.tick(s, p, cen, 1, h);
  LB.start(s, p, { x: 3, y: 1 }, 'tank', 1, h);
  const up = F.derive(LAYOUT, { century: cen }, 3).valley;
  HB.ruined(h.rec, { base: 'mob', day: 2, why: 'raid' });
  const k = LB.tick(s, p, cen, 2, h);
  const down = F.derive(LAYOUT, { century: cen }, 3).valley;
  ok('K ruined: everything you built there falls, the half-built one with it', k.fell.length === 3 && LB.standing(s) === 0 && Object.keys(s.lots).length === 0, k.fell.join(', '));
  ok('K *** AND THE REAL FUTURE COUNTS IT: act 3 has two fewer standing and the roof\'s family gone ***',
     down.standing === up.standing - 2 && down.people < up.people, 'standing ' + up.standing + ' -> ' + down.standing + ', people ' + up.people + ' -> ' + down.people);
  ok('K it falls once: the next day demolishes nothing more', LB.tick(s, p, cen, 3, h).fell.length === 0 && C.through(cen, 1).demolished === 2);
  ok('K nobody builds on a ruin in the act it fell', LB.start(s, p, { x: 1, y: 1 }, 'wall', 3, h).why === 'RUIN');
  HB.setAct(h.rec, 2); h.act = 2;
  const moved = HB.took(h.rec, { base: 'mob', to: HB.YOU, day: 40 });
  ok('K a generation later you move into the ruin and build from nothing', moved.applied && LB.start(s, p, { x: 1, y: 1 }, 'wall', 40, h).ok);
  const re = LB.load(LB.save(s));
  ok('K the fall is remembered across a save', re && re.fell.length === 1 && re.fell[0].ids.length === 3);
}

/* ---- L: THE FIRST TWO ---- */
ok('L the first two things on the list are a WALL and a lidded WATER TANK',
   LB.CATALOG[0].id === 'wall' && LB.CATALOG[1].id === 'tank' && LB.CATALOG.filter(e => e.first).length === 2);
ok('L the wall guards the gardens from hogs, the tank the water from pigeons',
   LB.CATALOG[0].guards === 'hogs' && LB.CATALOG[1].guards === 'pigeons');
{
  const p = rich(4), s = yours(), h = held(), cen = C.make({ act: 1 });
  LB.start(s, p, { x: 1, y: 1 }, 'garden', 0, h); LB.start(s, p, { x: 2, y: 1 }, 'pump', 0, h); LB.tick(s, p, cen, 1, h);
  const open = LB.exposed(s).map(x => x.what + '>' + x.to).join();
  ok('L a garden with no wall is open to hogs, water with no tank to pigeons', open === 'garden>hogs,pump>pigeons', open);
  LB.start(s, p, { x: 3, y: 1 }, 'wall', 1, h); LB.start(s, p, { x: 4, y: 1 }, 'tank', 1, h); LB.tick(s, p, cen, 2, h);
  ok('L build the wall and the tank and both margins close', LB.exposed(s).length === 0);
}

/* ---- M: THE SIX ---- */
ok('M the six are his six, in his order', LB.SIX.join() === 'batteries,food,meds,rounds,tape,water');
ok('M every entry feeds one of the six or none', LB.CATALOG.every(e => e.six === null || LB.SIX.indexOf(e.six) >= 0));
ok('M nothing you build makes meds or rounds (you buy those, Battle Brothers\' way)',
   LB.CATALOG.every(e => e.six !== 'meds' && e.six !== 'rounds'));
ok('M the solar panel feeds batteries and pays in batteries', LB.CATALOG.find(e => e.id === 'solar').six === 'batteries' && 'electricity' in LB.makesOf('solar'));
ok('M a thing that feeds one of the six makes something today', LB.CATALOG.every(e => !e.six || !!LB.makesOf(e.id)));

/* ---- N: MUTATION ---- */
{
  const h = held(), p = rich(2);
  const erased = { rec: HB.load(JSON.parse(JSON.stringify(HB.toJSON(h.rec)))), act: 1 };
  erased.rec.entries = [];
  ok('N MUTATION: erase the taking from the ledger and the same part refuses (the ledger is what is read)',
     LB.start(yours(), p, { x: 1, y: 1 }, 'wall', 0, h).ok && LB.start(yours(), p, { x: 1, y: 1 }, 'wall', 0, erased).why === 'NOT_HELD');
}

/* ---- O: A LOT LIES IN A REAL BLOCK ---- */
{
  const m = OM.buildOvermap(12345), seats = TOWNS.derive(GRAPH, TOWNS.districtsOf(m, CE.cat), 1);
  const grid = TOWNS.turf(m, CE.cat, seats), partAt = (x, y) => grid.at(x, y), N = m.n;
  const size = {}, first = {};
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const t = partAt(x, y); if (!t) continue;
    size[t.faction] = (size[t.faction] || 0) + 1; if (!first[t.faction]) first[t.faction] = { bx: x, by: y };
  }
  const parts = Object.keys(size).sort((a, b) => size[b] - size[a]);
  const A = parts[0], B2 = parts[1];
  const rec = HB.make({ act: 1 }), hold = { rec: rec, act: 1, partAt: partAt, n: N };
  ok('O nothing is yours before you take anything: 0 blocks', LB.holdings({}, hold, seats).blocks === 0);
  HB.took(rec, { base: A, to: HB.YOU, day: 1, by: 'contract' });
  let g = LB.holdings({}, hold, seats);
  ok('O take one part and the blocks you hold are exactly its blocks', g.blocks === size[A], A + ': ' + g.blocks + ' of ' + N * N);
  const p = rich(3);
  ok('O a lot in one of its blocks builds', LB.start(g.book[A], p, Object.assign({ x: 1, y: 1 }, first[A]), 'wall', 1, hold).ok);
  const wrong = LB.start(g.book[A], p, Object.assign({ x: 2, y: 1 }, first[B2]), 'wall', 1, hold);
  ok('O a lot in another part\'s block, on this part\'s screen, is WRONG_PART and costs nothing',
     wrong.why === 'WRONG_PART' && wrong.part === B2 && P.balance(p, 'electricity') === 2, JSON.stringify(wrong));
  HB.took(rec, { base: B2, to: HB.YOU, day: 2, by: 'raid' });
  g = LB.holdings(g.book, hold, seats);
  ok('O *** WHAT YOU HOLD GROWS, IN BLOCKS: take a second part and the count is both ***',
     g.blocks === size[A] + size[B2], size[A] + ' + ' + size[B2] + ' = ' + g.blocks + ' of ' + N * N + ' blocks');
  HB.ruined(rec, { base: A, day: 3, by: 'raid' });
  ok('O a ruin takes its blocks with it', LB.holdings(g.book, hold, seats).blocks === size[B2]);
}

console.log('\nBUILD A LOT GATE: ' + pass + ' ok, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
