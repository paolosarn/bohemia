#!/usr/bin/env node
/* BOHEMIA — THREE ACTS GATE (9/27/26, WORLD lane, row [future city])
 *
 * RULE 31 (Paolo 9/23, LOCKED): act 2 and act 3 are DERIVED from the earlier
 * acts' ledgers on every flip, never hand-placed.
 * RULE 32(b) (Paolo 9/23, on his DOWN vote of THE SAME CORNER): "the future gets
 * better. The right side is what the BEGINNING of the game is supposed to look
 * like, and it gets better." ACT 1 IS THE FLOOR. NOTHING DECAYS BELOW THE START.
 *
 * *** THE EIGHT LEGS ARE NOT MINE. *** DYNASTY's school round two named this gate
 * and its legs before a line of it existed (records/BOHEMIA_DYNASTY_SCHOOL_THE_
 * DERIVE_ROUND_TWO_9_24_26.md section 6), which is the bar existing before the
 * work instead of after it. SIX OF THE EIGHT ARE THE DERIVE AND ARE BUILT HERE.
 * LEGS 7 AND 8 ARE THE FLIP -- a flip may not rebake the body catalogue, and a
 * flip lands inside a beat end to end -- and NOBODY HAS BUILT A FLIP YET
 * (DYNASTY [the flip] is CLAIMED, not shipped). They are named OWED at the
 * bottom rather than quietly dropped, because a gate that silently carries six
 * of eight legs is how a bar gets lowered without anybody deciding to.
 *
 * THE FLOOR IS THE REAL VALLEY, NOT A NUMBER I CHOSE. Every run measures seed
 * 1337 off the real generator and the real grid and feeds THAT in, so leg 1 is a
 * statement about the game and not about my test fixture.
 *
 *   node gates/three_acts_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));

const F = R('engine/bohemia_future.js');
const C = R('engine/bohemia_century.js');
const P = R('engine/bohemia_purse.js');
const TL = R('engine/bohemia_turfledger.js');
const OM = R('engine/bohemia_overmap.js');
const PG = R('engine/bohemia_powergrid.js');
const HO = R('engine/bohemia_housing.js');
const CE = R('engine/bohemia_cityedit.js');
const CUR = P.CURRENCIES[0];

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

/* THE REAL VALLEY, measured every run */
function realLayout(seed) {
  const m = OM.buildOvermap(seed);
  const grid = PG.powerMap(m, seed);
  let lit = 0, street = 0, standing = 0;
  for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
    const s = grid.at(x, y);
    if (s && s.id >= 0) { street++; if (s.live) lit++; }
  }
  try { standing = HO.homes ? (HO.homes(m, CE.cat) || []).length : 0; } catch (e) { standing = 0; }
  const people = HO.valleyPeople(m, CE.cat) | 0;
  return { cells: 96 * 96, lit: lit, standing: standing, people: people, street: street };
}
const LAYOUT = realLayout(1337);
console.log('    [measured] the real valley, seed 1337: ' + LAYOUT.cells + ' cells, '
  + LAYOUT.street + ' street cells, ' + LAYOUT.lit + ' lit, ' + LAYOUT.people + ' people');

/* ---- LEG 1. THE FLOOR IS PLAYABLE ---------------------------------------- */
section('1 the floor is playable on an empty ledger', () => {
  const d = F.derive(LAYOUT, {}, 3);
  ok('a do-nothing past still derives', d.ok === true, JSON.stringify(d));
  if (!d.ok) return;
  console.log('    [measured] act 3 off an EMPTY act-1 ledger: ' + JSON.stringify(d.valley));
  ok('*** IT HAS STREETS, PEOPLE AND LIT CELLS: A WORSE PLACE, NEVER AN EMPTY ONE ***',
     d.valley.cells > 0 && d.valley.people > 0 && d.valley.lit > 0);
  /* DYNASTY's own wording: "more than zero and fewer than today", not a tuned number */
  ok('and it lights fewer cells than the whole valley, so it is not a full city',
     d.valley.lit < LAYOUT.cells);
  ok('and it is never a punishment screen: the floor IS the act-1 valley',
     d.valley.cells === LAYOUT.cells && d.valley.people === LAYOUT.people);
});

/* ---- LEG 2. ONE ROW CHANGES THE FUTURE ----------------------------------- */
section('2 one act-1 row changes a NAMED act-3 fact', () => {
  const before = F.derive(LAYOUT, {}, 3);
  const cen = C.make({ act: 1 });
  C.note(cen, 'build', { type: 'home', x: 4, y: 4, w: 2, h: 2 }, 3);
  C.note(cen, 'build', { type: 'shop', x: 8, y: 4, w: 2, h: 2 }, 4);
  const after = F.derive(LAYOUT, { century: cen }, 3);
  console.log('    [measured] act 3 standing: ' + before.valley.standing + ' -> ' + after.valley.standing
    + ' after two act-1 builds');
  /* THE LEG NAMES THE FACT so it cannot pass on noise */
  ok('*** THE NAMED FACT IS `standing`, AND TWO ACT-1 BUILDS MOVE IT BY TWO ***',
     after.valley.standing === before.valley.standing + 2);
  ok('and nothing else moved, so it is not a general wobble',
     after.valley.cells === before.valley.cells && after.valley.people === before.valley.people);
  /* and an act-1 row must reach act 3, not only act 1 */
  ok('an act-1 row reaches act 3, which is what COMPOUND means',
     F.derive(LAYOUT, { century: cen }, 1).valley.standing === after.valley.standing);
});

/* ---- LEG 3. THE HANDS SURVIVE -------------------------------------------- */
section('3 the hands survive a re-derive', () => {
  const cen = C.make({ act: 1 });
  C.note(cen, 'build', { type: 'home', x: 4, y: 4, w: 2, h: 2 }, 3);
  C.setAct(cen, 3);
  const N = 4;
  for (let i = 0; i < N; i++) C.note(cen, 'build', { type: 'shed', x: 20 + i, y: 30, w: 1, h: 1 }, 90 + i);
  const before = F.derive(LAYOUT, { century: cen }, 3).valley.standing;

  /* now change the PAST and re-derive */
  C.note(cen, 'build', { type: 'home', x: 40, y: 40, w: 2, h: 2 }, 95);
  const after = F.derive(LAYOUT, { century: cen }, 3).valley.standing;

  const act3 = C.totals(cen, 3);
  console.log('    [measured] act 3 carries ' + act3.built + ' of its own builds; standing '
    + before + ' -> ' + after);
  ok('*** THE ACT-3 DEEDS ARE STILL THERE AND STILL HIS ***', act3.built >= N);
  ok('and the future grew rather than being rebuilt from scratch', after > before);
});

/* ---- LEG 4. THE LINES DO NOT MOVE ---------------------------------------- */
section('4 the lines do not move', () => {
  const cen = C.make({ act: 1 });
  C.note(cen, 'build', { type: 'home', x: 4, y: 4, w: 2, h: 2 }, 3);
  const a = F.acts(LAYOUT, { century: cen });
  console.log('    [measured] cells per act: ' + a.map(r => r.valley ? r.valley.cells : '?').join(' / '));
  ok('*** THE CELL COUNT IS IDENTICAL IN ALL THREE ACTS ***',
     a.every(r => r.valley && r.valley.cells === LAYOUT.cells));
  /* and it is the SAME OBJECT, not a copy that happens to match */
  const d1 = F.derive(LAYOUT, { century: cen }, 1), d3 = F.derive(LAYOUT, { century: cen }, 3);
  ok('*** AND IT IS THE SAME OBJECT BY REFERENCE, so no act can own a different map ***',
     d1.layout === LAYOUT && d3.layout === LAYOUT);
  /* and the derive refuses rather than returning a moved line */
  const moved = F.derive({ cells: 10, lit: 1, standing: 0, people: 1 }, {}, 3);
  ok('a layout is never written to: the floor comes back untouched',
     moved.ok && moved.valley.cells === 10);
});

/* ---- LEG 5. THE SAME LEDGERS GIVE THE SAME FUTURE ------------------------ */
section('5 the same ledgers give the same future', () => {
  const cen = C.make({ act: 1 });
  C.note(cen, 'build', { type: 'home', x: 4, y: 4, w: 2, h: 2 }, 3);
  const p = P.create({ id: 'player' });
  P.credit(p, CUR, 7, 'a day on a live wire');
  const one = F.derive(LAYOUT, { century: cen, purse: p }, 3);
  const two = F.derive(LAYOUT, { century: cen, purse: p }, 3);
  ok('*** DERIVE TWICE, BYTE FOR BYTE THE SAME ***',
     JSON.stringify(one.valley) === JSON.stringify(two.valley) &&
     JSON.stringify(one.unread) === JSON.stringify(two.unread));
  ok('a future that wobbles on its own is not a report card', one.ok && two.ok);
});

/* ---- LEG 6. A SILENT FIELD IS NAMED, NOT ZEROED -------------------------- */
section('6 a silent field is named, not zeroed', () => {
  const d = F.derive(LAYOUT, {}, 3);
  console.log('    [measured] UNREAD with nothing handed in: ' + d.unread.join(', '));
  ok('*** NOTHING IS QUIETLY ZERO: every field with no source is NAMED ***',
     d.unread.length > 0 && d.card.fields.filter(f => f.why === F.UNREAD).length === d.unread.length);
  ok('and each one says WHY', d.card.fields.filter(f => f.why === F.UNREAD)
     .every(f => typeof f.because === 'string' && f.because.length > 8));

  /* *** THE ONE THAT MATTERS: `lived` is silent because NOTHING IN THE GAME
     stamps who lived with an act, which this lane measured on 9/23. Hand in
     everything you can and it is STILL named. *** */
  const cen = C.make({ act: 1 }), p = P.create({ id: 'player' }), tl = TL.make({ act: 1 });
  const full = F.derive(LAYOUT, { century: cen, purse: p, turf: tl }, 3);
  console.log('    [measured] UNREAD with all three live ledgers handed in: '
    + (full.unread.join(', ') || '(none)'));
  ok('*** WITH EVERY LIVE LEDGER IN, `lived` IS STILL UNREAD AND SAYS SO ***',
     full.unread.indexOf('lived') >= 0,
     'if lived has a source now, this row has moved and the gate must be re-aimed');
  ok('and the three that ARE act-aware stopped being unread',
     full.unread.indexOf('built') < 0 && full.unread.indexOf('batteries') < 0 &&
     full.unread.indexOf('territory') < 0);
});

/* ---- *** THE RULE THE ROW TURNS ON WAS OVERTURNED, AND THIS SECTION WAS
   GREEN FOR THE WRONG REASON. *** ----------------------------------------------
   Rule 37(c) (Paolo 9/27, on his DOWN vote of THE SAME VALLEY, THREE ACTS): "the
   future could get worse... a reflection of your past actions". The derive is
   SIGNED and rule 32(b)'s "nothing decays below the start" is DEAD.

   AND WHEN I REMOVED THE FLOOR REFUSAL, THIS GATE STAYED GREEN. Its check was
   /WOULD_DECAY_BELOW_THE_FLOOR/.test(src) -- and the replacement COMMENT says
   "this used to return WOULD_DECAY_BELOW_THE_FLOOR", so the regex still matched
   a constant that no longer exists. That is green over nothing, in my own gate,
   of exactly the kind this lane keeps naming in other people's. The section now
   proves the thing he ruled instead. --------------------------------------- */
section('* the future goes BOTH ways (rule 37c)', () => {
  /* *** AND MY FIRST TEST HERE WAS UNREAL AND THE NUMBERS SAID SO. *** It
     demolished six buildings in a ledger that had built none, and act 3 came back
     with standing -6 -- fewer than no buildings. The module was right and the
     FIXTURE was nonsense: bohemia_century counts what the family put up and took
     down, so a demolition needs something to have stood. A raiding past now
     builds ten and tears six of them down, which is a thing that can happen. */
  function past(built, razed) {
    const c = C.make({ act: 1 });
    for (let i = 0; i < built; i++) C.note(c, 'build', { type: 'home', x: i * 3, y: 1, w: 2, h: 2 }, i);
    for (let i = 0; i < razed; i++) C.note(c, 'demolish', { type: 'home', x: i * 3, y: 1, w: 2, h: 2 }, 50 + i);
    return c;
  }
  const raid = F.derive(LAYOUT, { century: past(10, 6) }, 3);
  const idle = F.derive(LAYOUT, { century: past(10, 0) }, 3);
  const build = F.derive(LAYOUT, { century: past(16, 0) }, 3);
  console.log('    [measured] act 3 standing -- raiding past ' + raid.valley.standing
    + ', doing nothing ' + idle.valley.standing + ', building past ' + build.valley.standing);

  ok('*** A RAIDING PAST LEAVES A WORSE ACT 3 ***',
     raid.valley.standing < idle.valley.standing, 'went ' + raid.went.standing);
  ok('*** A BUILDING PAST LEAVES A BETTER ONE ***',
     build.valley.standing > idle.valley.standing, 'went +' + build.went.standing);
  ok('and the derive SAYS which way it went, so a caller can tell a ruin it caused'
   + ' from a ruin it inherited',
     raid.went.standing < idle.went.standing && build.went.standing > idle.went.standing);

  /* *** AND THE HALF OF HIS RULING NOBODY CAN COUNT YET, NAMED NOT FAKED. *** */
  ok('*** RAZING THE CITY THAT WAS ALREADY THERE IS UNREAD, BY NAME ***',
     raid.unread.indexOf('razed') >= 0,
     'his ruling names "the buildings that you destroyed"; homes() returns [] on a fresh valley');

  /* THE OLD CLAMP IS GONE, and it was mine: the century ledger has always
     returned `net` (built minus demolished) and a housing figure its own comment
     says must be allowed to go negative, and this file read `.built` and clamped
     housing to zero. */
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_future.js'), 'utf8');
  ok('*** THE FLOOR REFUSAL IS REALLY GONE, not just renamed ***',
     !/return \{ ok: false, why: 'WOULD_DECAY_BELOW_THE_FLOOR'/.test(src),
     'a comment mentioning it is fine; a live refusal is not');
  ok('and the derive reads the SIGNED field, not the positive half',
     /standing: \(by\.net \| 0\)/.test(src));
  ok('and housing is carried whole, negative and all',
     !/by\.housing > 0 \?/.test(src));

  /* KEPT: the lines still do not move. His ruling is about what STANDS. */
  ok('*** THE LINES STILL DO NOT MOVE, which his ruling did not touch ***',
     /THE_LINES_MOVED/.test(src) && raid.valley.cells === LAYOUT.cells
       && build.valley.cells === LAYOUT.cells);

  /* the content valve is still his and still ships empty */
  ok('LOOKS ships EMPTY -- what a poor valley and a rebuilt one look like is his',
     Object.keys(F.LOOKS).length === 0);
  ok('and asking answers NO_RULING by name while still handing back the numbers',
     (() => { const l = F.looksOf(LAYOUT, {}, 3);
       return l.reason === 'NO_RULING' && l.table === 'LOOKS' && !!l.valley; })());
});

/* ---- LEGS 7 AND 8 ARE OWED, AND SAID OUT LOUD --------------------------- */
console.log('    [OWED] leg 7 (a flip does not rebake the catalogue) and leg 8 (a flip lands');
console.log('           inside a beat) are NOT built here: nobody has built a flip yet.');
console.log('           DYNASTY [the flip] is CLAIMED, not shipped. Six of eight legs.');

console.log('THREE ACTS GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (the floor is the real valley and it is playable empty; one act-1 row moves a named'
  + ' act-3 fact; the lines are the same object in all three acts; a silent field is named)');
process.exit(fail ? 1 : 0);
