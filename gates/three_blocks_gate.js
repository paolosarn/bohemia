#!/usr/bin/env node
/* ============================================================================
   THE THREE BLOCKS THE VALLEY NEEDS  (WORLD, row [the apron, the compound and
   the civic interior], rule 46 and rule 59)

   THE ROW SAID THREE BLOCKS ARE MISSING. Measured: TWO are missing and the
   valley already has the material for both, and THE THIRD IS BUILT AND WIRED TO
   NOTHING -- `casino`, 294 flat cells and 201 pillars, slot banks and tables,
   the only interior in the game, in no family and unreachable from nfKind.

   IT REFUSES SIX THINGS, every one of them by re-measuring rather than trusting
   a constant:

   A. A NUMBER THAT IS NOT MEASURED OFF THE REAL KITS. Every floor, cover and
      door share in the module is re-counted here off the district kits of that
      family that really draw, five seeds each.
   B. A PIECE THE VALLEY DOES NOT DRAW. Every named piece the module quotes must
      be a real legend entry of one of that family's own kits.
   C. THE CIVIC INTERIOR BEING GIVEN MATERIAL IT DOES NOT HAVE. It must answer
      NO_MATERIAL, and the whole-city count behind it (of 256 standable pieces,
      none is the floor of a room) is re-counted here.
   D. THE UNREACHABLE LIST BEING WRONG OR GROWING. The block library is rebuilt
      from slices/fight_ground/fight_ground.json the way the fight builds it, and
      crossed against board_mix and nfKind. A ratchet: it may only shrink, so the
      day somebody wires the casino in, this goes red and the record is stale
      rather than the code being quietly right.
   E. THE CASINO BEING DESCRIBED FROM MEMORY. Its cell counts and cover pieces
      are read out of the library.
   F. WHO HOLDS IT BEING TYPED HERE. heldBy must hand the question to the ground
      module, never answer it.

   Every refusal ends at the failure count and a process.exit, never at a comment.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const P = p => path.join(__dirname, '..', p);
const read = p => fs.readFileSync(P(p), 'utf8');

let TB = require('../engine/bohemia_threeblocks.js'); TB = TB.BOH_THREEBLOCKS || TB;
let BK = require('../engine/bohemia_boardkinds.js'); BK = BK.BOH_BOARDKINDS || BK;
let TK = require('../engine/bohemia_tilekinds.js');  TK = TK.BOH_TILEKINDS || TK;
let VG = require('../engine/bohemia_valleyground.js'); VG = VG.BOH_VALLEYGROUND || VG;

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? '  (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  (' + note + ')' : ''))); };
const section = (t, f) => { console.log('\n--- ' + t + ' ---'); f(); };

/* ---- THE MEASUREMENT: every family's own kits, five seeds each ----------- */
const SEEDS = [1337, 7, 19, 23, 91];
const realLog = console.log, hush = () => {};
function loadKit(d) {
  const f = P('engine/bohemia_' + d + '.js');
  if (!fs.existsSync(f)) return null;
  console.log = hush; let M = null; try { M = require(f); } catch (e) { M = null; } console.log = realLog;
  return (M && typeof M.generate === 'function' && M.legend) ? M : null;
}
function toneOf(kind) {
  const c = TK.classOf(kind);
  if (!c.known) return 'floor';
  if (c.klass === 'TILE') return (kind === 'building' || kind === 'structure') ? 'cover' : 'floor';
  if (c.klass === 'BLOCKER') return 'cover';
  if (c.klass === 'EDGE') return 'door';
  if (c.klass === 'OVERHEAD') return 'over';
  return 'dress';
}
const MEAS = {}, PIECES = {};
TB.families().forEach(fam => {
  const ds = (BK.FAMILIES[fam] || {}).districts || [];
  let cov = 0, flo = 0, dor = 0, n = 0; const kits = [], names = new Set();
  ds.forEach(d => {
    const M = loadKit(d); if (!M) return;
    kits.push(d);
    const leg = typeof M.legend === 'function' ? M.legend() : M.legend;
    Object.keys(leg).forEach(c => { const e = leg[c]; if (e && e.name) names.add(e.name); });
    SEEDS.forEach(s => {
      console.log = hush; let b = null; try { b = M.generate(s); } catch (e) {} console.log = realLog;
      const g = b && b.g; if (!g) return;
      for (const row of g) { if (!row) continue;
        for (const x of row) { const e = leg[x]; if (!e || !e.kind) continue; n++;
          const t = toneOf(e.kind);
          if (t === 'cover') cov++; else if (t === 'floor') flo++; else if (t === 'door') dor++; } }
    });
  });
  if (n) MEAS[fam] = { floor: flo / n, cover: cov / n, door: dor / n, cells: n, kits };
  PIECES[fam] = names;
});

/* ---- THE WHOLE-CITY INTERIOR COUNT -------------------------------------- */
const INSIDE = /corridor|hallway|counter|lobby|cell |cells|office|ward|reception|interior|room|stair|desk|cubicle|vestibule|foyer|atrium|\bhall\b|concourse|aisle/i;
let namedAll = 0, standAll = 0; const standInside = [];
Object.keys(BK.districts()).forEach(d => {
  const M = loadKit(d); if (!M) return;
  const leg = typeof M.legend === 'function' ? M.legend() : M.legend;
  Object.keys(leg).forEach(c => {
    const e = leg[c]; if (!e || !e.name || !e.kind) return; namedAll++;
    if (toneOf(e.kind) === 'floor') { standAll++; if (INSIDE.test(e.name)) standInside.push(d + ': ' + e.name); }
  });
});

/* ---- THE FIGHT'S OWN BLOCK LIBRARY -------------------------------------- */
const GROUND = JSON.parse(read('slices/fight_ground/fight_ground.json'));
const OURS = JSON.parse(read('records/target/bb/ours.json'));
const MIX = (OURS.board_mix && (OURS.board_mix.value || OURS.board_mix)) || {};
const libKinds = new Set();
Object.keys(GROUND.boards || {}).forEach(bn => {
  (GROUND.boards[bn].blocks || []).forEach(row => row.forEach(nm => libKinds.add(String(nm).split('.')[0])));
});
const famNames = new Set();
Object.keys(MIX.families || {}).forEach(f => (MIX.families[f] || []).forEach(k => famNames.add(k)));
const NFK = ['strip', 'freeway', 'shore', 'landfill', 'wash', 'scrub', 'culdesac', 'suburb_stem', 'suburb', 'ruin'];
const reach = new Set();
NFK.forEach(k => ((MIX.aliases || {})[k] || [k]).forEach(t => reach.add(t)));
const neverAtAll = [...libKinds].filter(k => !famNames.has(k) && !reach.has(k)).sort();
const neverLead = [...libKinds].filter(k => famNames.has(k) && !reach.has(k)).sort();

console.log('=== THREE BLOCKS GATE ===');
console.log('    [measured] ' + Object.keys(MEAS).length + ' families over '
  + Object.values(MEAS).reduce((t, m) => t + m.cells, 0).toLocaleString() + ' drawn cells; '
  + libKinds.size + ' block kinds in the fight\'s library, ' + famNames.size + ' in a family, '
  + reach.size + ' reachable from nfKind');

/* ---- A. EVERY NUMBER IS RE-MEASURED ------------------------------------- */
section('A every share is re-counted off the family\'s own kits', () => {
  let worst = 0, worstAt = '';
  Object.keys(MEAS).forEach(f => {
    const m = TB.MADE_OF[f]; if (!m) return;
    [['floor'], ['cover'], ['door']].forEach(([k]) => {
      const d = Math.abs(m[k] - MEAS[f][k]); if (d > worst) { worst = d; worstAt = f + '.' + k; }
    });
  });
  console.log('    [measured] worst drift between the module and the kits: '
    + worst.toFixed(5) + (worstAt ? ' on ' + worstAt : ''));
  ok('*** THE FLOOR, COVER AND DOOR SHARES STILL MATCH THE KITS ***',
     worst < 0.0011, 'worst ' + worst.toFixed(5) + ' on ' + worstAt);
  ok('and every family names the kits it was measured on, and they all really draw',
     Object.keys(MEAS).every(f => TB.MADE_OF[f].kits.join('|') === MEAS[f].kits.join('|')),
     Object.keys(MEAS).map(f => f + ':' + MEAS[f].kits.length).join(' '));
  ok('*** AND EVERY FAMILY CARRIES tuned:false ***',
     Object.keys(TB.MADE_OF).every(f => TB.MADE_OF[f].tuned === false));
  ok('a thing that is not a family is refused by name',
     TB.madeOf('mars').why === TB.NOT_A_FAMILY);
});

/* ---- B. EVERY PIECE IS A PIECE THE VALLEY DRAWS ------------------------- */
section('B every piece quoted is a real legend entry of that family\'s kits', () => {
  const invented = [];
  Object.keys(TB.MADE_OF).forEach(f => {
    (TB.MADE_OF[f].pieces || []).forEach(p => { if (!PIECES[f] || !PIECES[f].has(p)) invented.push(f + ': ' + p); });
  });
  ok('*** NO FAMILY QUOTES A PIECE THE VALLEY DOES NOT DRAW ***',
     invented.length === 0, invented.slice(0, 5).join('; '));
  ok('and every family quotes enough of them to be a description',
     Object.keys(TB.MADE_OF).every(f => (TB.MADE_OF[f].pieces || []).length >= 10));
  ok('the apron really is the open one and the compound really is the walled one',
     MEAS.infrastructure.floor > MEAS.plant.floor && MEAS.plant.door < MEAS.infrastructure.door,
     'apron floor ' + (MEAS.infrastructure.floor * 100).toFixed(1) + '%, compound door '
     + (MEAS.plant.door * 100).toFixed(3) + '%');
});

/* ---- C. THE CIVIC INTERIOR HAS NO MATERIAL, AND THAT IS COUNTED --------- */
section('C the civic interior answers NO_MATERIAL, and the count is re-made', () => {
  const c = TB.madeOf('civic');
  ok('*** IT ANSWERS NO_MATERIAL, not a number ***',
     c.known === false && c.why === TB.NO_MATERIAL);
  ok('and it says the civic kits are not thin, which is the point',
     c.floor > 0.5 && /OUTSIDE/.test(c.reads));
  console.log('    [measured] the whole city: ' + namedAll + ' named pieces, ' + standAll
    + ' you can stand on, ' + standInside.length + ' of those named like an inside');
  ok('the whole-city counts still match what the module carries',
     TB.NO_INSIDE.namedPieces === namedAll && TB.NO_INSIDE.standable === standAll,
     namedAll + '/' + standAll + ' now, ' + TB.NO_INSIDE.namedPieces + '/' + TB.NO_INSIDE.standable + ' then');
  /* the only standable "inside" names are the two stadium concourses; anything
     else appearing means somebody drew a room and the record is out of date */
  const rooms = standInside.filter(s => !/concourse|aisle/i.test(s));
  console.log('    [measured] standable pieces named like a room: ' + rooms.length
    + (rooms.length ? ' -- ' + rooms.join('; ') : '') + '; the closest are '
    + standInside.filter(s => /concourse/i.test(s)).join(' and '));
  ok('*** NOT ONE STANDABLE CELL IN THE VALLEY IS THE FLOOR OF A ROOM ***',
     rooms.length === TB.NO_INSIDE.insideRooms, rooms.join('; '));
  ok('and the nearest thing to one is still the stadium concourse',
     standInside.filter(s => /concourse/i.test(s)).length === TB.NO_INSIDE.closest.length);
});

/* ---- D + E. THE BLOCKS THAT EXIST AND CANNOT BE REACHED ----------------- */
section('D the unreachable blocks, rebuilt from the fight\'s own library', () => {
  console.log('    [measured] never at all: ' + (neverAtAll.join(', ') || 'none')
    + ' | never the lead: ' + (neverLead.join(', ') || 'none'));
  ok('*** THE NEVER-AT-ALL LIST MATCHES, AND MAY ONLY SHRINK ***',
     neverAtAll.length <= TB.UNREACHABLE.neverAtAll.length
     && neverAtAll.every(k => TB.UNREACHABLE.neverAtAll.indexOf(k) >= 0),
     neverAtAll.join(', ') + ' vs ' + TB.UNREACHABLE.neverAtAll.join(', '));
  ok('and the never-the-lead list matches, and may only shrink',
     neverLead.length <= TB.UNREACHABLE.neverTheLead.length
     && neverLead.every(k => TB.UNREACHABLE.neverTheLead.indexOf(k) >= 0),
     neverLead.join(', '));
  ok('*** THE CASINO IS ONE OF THEM: THE ONLY INTERIOR IN THE GAME, UNREACHABLE ***',
     neverAtAll.indexOf('casino') >= 0);
  ok('and nothing a family names is missing from the library',
     [...famNames].every(k => libKinds.has(k)),
     [...famNames].filter(k => !libKinds.has(k)).join(', '));

  /* E: the casino described from the library, not from memory */
  const B = (GROUND.boards || {}).casino;
  ok('the casino board is really in the library', !!B);
  if (B) {
    const flat = B.terrain.reduce((t, r) => t + r.filter(x => x === 'flat').length, 0);
    const high = B.terrain.reduce((t, r) => t + r.filter(x => x === 'height').length, 0);
    const cov = (B.cover || []).length;
    const kinds = [...new Set((B.cover || []).map(c => c.piece))].sort();
    console.log('    [measured] casino: ' + flat + ' flat, ' + high + ' height, ' + cov
      + ' cover pieces (' + kinds.join(', ') + ')');
    ok('*** AND IT IS DESCRIBED FROM THE LIBRARY, NOT FROM MEMORY ***',
       TB.UNREACHABLE.casino.flatCells === flat && TB.UNREACHABLE.casino.heightCells === high
       && TB.UNREACHABLE.casino.coverPieces === cov,
       flat + '/' + high + '/' + cov);
    ok('and it really is an interior: pillars, slot banks and tables',
       kinds.join(',') === TB.UNREACHABLE.casino.coverKinds.join(','), kinds.join(', '));
  }
});

/* ---- F. WHO HOLDS IT IS NOT ANSWERED HERE ------------------------------ */
section('F who holds it is handed to the ground module, never typed here', () => {
  const h = TB.heldBy('plant', null);
  ok('asking with no map answers NO_MAP and names whose question it is',
     h.known === false && /valleyground/.test(h.whose || ''));
  const src = read('engine/bohemia_threeblocks.js');
  ok('*** AND NO FACTION NAME IS WRITTEN IN THIS FILE AT ALL ***',
     !/faction\s*:\s*'/.test(src) && !/'(ANARCHISTS|brigands|cartel)'/i.test(src));
  ok('and no travel speed is restated here either',
     !/speed\s*:\s*0\.\d/.test(src));
});

console.log('\n' + '='.repeat(74));
console.log('THREE BLOCKS GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (two blocks are missing and the valley has the material for both; the third '
  + 'is BUILT and wired to nothing -- the casino, the only interior in the game)');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
