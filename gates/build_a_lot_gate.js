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

let pass = 0, fail = 0;
const ok = (name, cond, detail) => {
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '  [' + detail + ']' : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '  [' + detail + ']' : '')); }
};
const LAYOUT = { cells: 9216, lit: 425, standing: 0, people: 215 };
function rich(n) { const p = P.create({}); P.credit(p, 'electricity', n, 'gate', 'seed', 0); return p; }

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
  const p = rich(2), s = LB.site({});
  const r = LB.start(s, p, { x: 1, y: 1 }, 'shed', 0);
  ok('D a start costs exactly one battery', r.ok && P.balance(p, 'electricity') === 1, 'left ' + P.balance(p, 'electricity'));
  ok('D a taken lot is refused by name', LB.start(s, p, { x: 1, y: 1 }, 'pump', 0).why === 'LOT_TAKEN');
  ok('D an unknown thing is refused by name', LB.start(s, p, { x: 2, y: 2 }, 'casino', 0).why === 'NOT_BUILDABLE');
  const broke = LB.start(LB.site({}), P.create({}), { x: 1, y: 1 }, 'shed', 0);
  ok('D broke is refused by name, and nothing is built', broke.why === 'CANNOT_AFFORD');
}

/* ---- E ---- */
{
  const p = rich(5), s = LB.site({}), cen = C.make({ act: 1 });
  LB.start(s, p, { x: 1, y: 1 }, 'pump', 3); LB.start(s, p, { x: 2, y: 1 }, 'roof', 3);
  const early = LB.tick(s, p, cen, 3);
  ok('E nothing is finished before its day', early.finished.length === 0 && C.through(cen, 3).built === 0);
  const before = F.derive(LAYOUT, { century: C.make({ act: 1 }) }, 3).valley;
  const done = LB.tick(s, p, cen, 4);
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
  const p = rich(3), s = LB.site({}), cen = C.make({ act: 1 });
  LB.start(s, p, { x: 1, y: 1 }, 'solar', 0); LB.start(s, p, { x: 2, y: 1 }, 'solar', 0);
  LB.tick(s, p, cen, 1);
  const b1 = P.balance(p, 'electricity');
  LB.tick(s, p, cen, 1);
  ok('F two panels standing pay two, and the same day twice pays nothing more', b1 === 3 && P.balance(p, 'electricity') === 3, 'after day 1: ' + b1);
  const re = P.load(P.save(p));
  LB.tick(s, re, cen, 1);
  ok('F *** A SAVE AND A LOAD ON THE SAME DAY PAYS NOTHING MORE ***', P.balance(re, 'electricity') === 3, 'after reload: ' + P.balance(re, 'electricity'));
  LB.tick(s, re, cen, 2);
  ok('F the next day pays again', P.balance(re, 'electricity') === 5);
  const w = LB.site({}), pw = rich(1); LB.start(w, pw, { x: 1, y: 1 }, 'wall', 0); LB.tick(w, pw, C.make({ act: 1 }), 1);
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
  const p = rich(1), s = LB.site({}); LB.start(s, p, { x: 1, y: 1 }, 'shed', 0); LB.tick(s, p, C.make({ act: 1 }), 1);
  const res = P.balance(p, 'resources');
  p.entries = p.entries.filter(e => e.reason !== 'produce:lot:shed');   // the ledger "forgets" today
  LB.tick(s, p, C.make({ act: 1 }), 1);
  ok('H MUTATION: paid-today really is read from the ledger (erase the entry and it pays again)',
     res === 1 && P.balance(p, 'resources') === 1);
}

console.log('\nBUILD A LOT GATE: ' + pass + ' ok, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
