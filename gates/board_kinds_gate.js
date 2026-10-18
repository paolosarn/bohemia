#!/usr/bin/env node
/* ============================================================================
   WHICH BOARD A MAP CELL FIGHTS ON  (WORLD lane, row [the cells with no board])

   THE ROW'S PREMISE WAS WRONG AND THIS GATE HOLDS THE CORRECTED ONE. The row
   said 28 districts have no kit so a fight cut from them has nothing to build a
   board out of. The fight never cuts a board from a district kit: it asks
   nfKind(district) for one of nine board kinds and COMBAT's generator deals from
   its block library. What is really wrong is that TWENTY-FOUR OF THE SEVENTY-
   EIGHT districts fall through to the catch-all `ruin` -- more than any real kind
   gets -- including the airport, every civic building, and three of the six
   legendary gear places.

   IT REFUSES SIX THINGS, and the first is the one that matters, because it is the
   only one that cannot be satisfied by editing this lane's own files:

   A. THE MIRROR DRIFTING FROM THE LIVE FIGHT. nfKind() is PARSED OUT OF THE SLICE
      on every run and every district in the valley is pushed through both. One
      name different anywhere and this is red. Nothing else here is worth
      anything if the mirror is stale.
   B. A SECOND LIST OF DISTRICTS. They come from bohemia_boardterrain.js, live.
   C. A GUESSED STAND-IN. standInFor() on a fall-through must answer NO_RULING and
      name COMBAT. A courthouse matched to a cul-de-sac because both are about 30%
      blocked is the 9/25 [bb places] defect and the god-gear round's own mistake.
   D. THE FALL-THROUGH LIST GROWING. A ratchet: 24 today, and it may only shrink.
      This is what stops the next district WORLD adds becoming a ruin in silence.
   E. A FALL-THROUGH WITH NO FAMILY AND NO BLOCK NAMED. Reporting 24 names is not
      a finding; saying which block the library is missing is.
   F. A CLAIM ABOUT THE MAP TAKEN ON TRUST. How many cells a valley really land on
      the catch-all is re-rolled here over twenty valleys, never carried.

   Every refusal ends at the failure count and a process.exit, never at a comment.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const P = p => path.join(__dirname, '..', p);
const read = p => fs.readFileSync(P(p), 'utf8');

let BK = require('../engine/bohemia_boardkinds.js'); BK = BK.BOH_BOARDKINDS || BK;
let BT = require('../engine/bohemia_boardterrain.js'); BT = BT.BOH_BOARDTERRAIN || BT;
const OM = require('../engine/bohemia_overmap.js');

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? '  (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  (' + note + ')' : ''))); };
const section = (t, f) => { console.log('\n--- ' + t + ' ---'); f(); };

/* ========================================================================
   PARSE nfKind OUT OF THE LIVE SLICE AND BUILD A REAL FUNCTION FROM IT.
   Not a grep for a word: the actual regex lines, in their actual order, run
   against every district. If COMBAT edits one name, this gate knows.
   ====================================================================== */
const SLICE = 'slices/BOHEMIA_ALPHA_0_9.html';
function liveKindFn() {
  const src = read(SLICE);
  const i = src.indexOf('function nfKind(');
  if (i < 0) return null;
  const body = src.slice(i, src.indexOf('\n}', i));
  const rules = [];
  const re = /if \(\/\^\(([^)]*)\)\$\/\.test\(d\)\) return '([a-z_]+)'/g;
  let m;
  while ((m = re.exec(body))) rules.push({ names: m[1].split('|'), kind: m[2] });
  const eq = /if \(d === '([a-z_]+)'\) return '([a-z_]+)'/g;
  const singles = [];
  while ((m = eq.exec(body))) singles.push({ names: [m[1]], kind: m[2] });
  /* THE CATCH-ALL IS THE BARE RETURN, the one that is not the tail of an `if`.
     The first cut of this took the first line ENDING in a return and came back
     with `strip`, which is the first rule rather than the fall-through -- and the
     gate caught it by disagreeing with the mirror on nine districts. A parser
     that reads the wrong line is the same class of defect as a legend count read
     as a board, so it is anchored on the line's SHAPE: no `if`, no `)`. */
  const bare = [...body.matchAll(/^[ \t]*return '([a-z_]+)';[ \t]*(\/\*[^\n]*)?$/gm)];
  const tail = bare.length ? bare[bare.length - 1] : null;
  if (!rules.length || !tail) return null;
  /* keep source order: walk the body and emit whichever matcher appears next */
  const ordered = [];
  const all = rules.concat(singles);
  all.forEach(r => { ordered.push({ r, at: body.indexOf("return '" + r.kind + "'") }); });
  ordered.sort((a, b) => a.at - b.at);
  const seq = ordered.map(o => o.r);
  return { fn: d => { for (const r of seq) if (r.names.indexOf(String(d)) >= 0) return r.kind; return tail[1]; },
           rules: seq, catchAll: tail[1] };
}
const LIVE = liveKindFn();

console.log('=== BOARD KINDS GATE ===');

/* ---- A. THE MIRROR IS THE LIVE FIGHT'S ---------------------------------- */
section('A the mirror is parsed out of the live fight, not copied by hand', () => {
  ok('*** nfKind() WAS FOUND AND READ OUT OF THE SLICE ***', !!LIVE,
     LIVE ? LIVE.rules.length + ' rules + catch-all `' + LIVE.catchAll + '`' : 'not found in ' + SLICE);
  if (!LIVE) return;
  ok('the catch-all is the one this module names', LIVE.catchAll === BK.CATCH_ALL,
     LIVE.catchAll + ' vs ' + BK.CATCH_ALL);
  const ds = Object.keys(BK.districts());
  const diff = ds.filter(d => LIVE.fn(d) !== BK.kindOf(d).kind);
  ok('*** EVERY LIVE DISTRICT GETS THE SAME BOARD KIND FROM BOTH ***',
     diff.length === 0, diff.length ? diff.slice(0, 6).map(d => d + ': slice=' + LIVE.fn(d)
       + ' mirror=' + BK.kindOf(d).kind).join('; ') : ds.length + ' districts agree');
  /* and the other way: a name the slice knows that the mirror does not */
  const sliceNames = new Set(); LIVE.rules.forEach(r => r.names.forEach(n => sliceNames.add(n)));
  const mineNames = new Set(); BK.RULES.forEach(r => r.names.forEach(n => mineNames.add(n)));
  const onlySlice = [...sliceNames].filter(n => !mineNames.has(n));
  const onlyMine = [...mineNames].filter(n => !sliceNames.has(n));
  ok('and neither list carries a name the other has never heard of',
     onlySlice.length === 0 && onlyMine.length === 0,
     (onlySlice.length ? 'slice only: ' + onlySlice.join(', ') + ' ' : '')
     + (onlyMine.length ? 'mirror only: ' + onlyMine.join(', ') : ''));
});

/* ---- B. ONE LIST OF DISTRICTS ------------------------------------------- */
section('B one list of districts, and it is the terrain module\'s', () => {
  const live = BT.KINDS.filter(k => !BT.NOT_ON_THE_MAP[k]);
  const ds = BK.districts();
  const fromBT = new Set(); live.forEach(g => (BT.FROM[g] || []).forEach(d => fromBT.add(d)));
  ok('the districts come from bohemia_boardterrain.js, live',
     Object.keys(ds).length === fromBT.size, Object.keys(ds).length + ' districts');
  ok('every one of them carries the ground it sits on',
     Object.keys(ds).every(d => live.indexOf(ds[d]) >= 0));
  ok('a thing that is not a district is refused by name',
     BK.standInFor('mars').why === BK.NOT_A_DISTRICT);
});

/* ---- C. IT DOES NOT GUESS ----------------------------------------------- */
section('C it refuses to guess a stand-in (the 9/25 [bb places] defect)', () => {
  const ft = BK.fallThrough();
  ok('every fall-through answers NO_RULING rather than a kind',
     ft.every(r => BK.standInFor(r.district).why === BK.NO_RULING));
  ok('and every one of them names whose ruling it is',
     ft.every(r => /COMBAT/.test(BK.standInFor(r.district).whose || '')));
  ok('and says why matching by how blocked it is would be worse',
     /confidently wrong/.test(BK.standInFor('courthouse').because || ''));
  ok('a district that already has a kind is answered, not refused',
     BK.standInFor('estate').known === true && BK.standInFor('estate').kind === 'culdesac');
  /* the grouping is a reading and must say so */
  ok('*** AND THE GROUPING IS STATED AS MINE, not dressed up as arithmetic ***',
     Object.keys(BK.FAMILIES).every(f => BK.FAMILIES[f].mine === true && BK.FAMILIES[f].tuned === false));
});

/* ---- D. THE RATCHET ------------------------------------------------------ */
section('D the fall-through list may only shrink', () => {
  const ft = BK.fallThrough();
  console.log('    [measured] ' + ft.length + ' of ' + Object.keys(BK.districts()).length
    + ' districts fall through to `' + BK.CATCH_ALL + '`');
  /* 24 measured 10/10. A district added without the fight learning it lands here. */
  ok('*** NO MORE THAN THE 24 MEASURED ON 10/10 FALL THROUGH ***', ft.length <= 24,
     ft.length + ' now, 24 then');
  ok('and the catch-all is still the biggest bucket, which is the finding',
     (() => {
       const by = {}; Object.keys(BK.districts()).forEach(d => {
         const k = BK.kindOf(d).kind; by[k] = (by[k] || 0) + 1; });
       const top = Object.entries(by).sort((a, b) => b[1] - a[1])[0];
       console.log('    [measured] biggest bucket: ' + top[0] + ' with ' + top[1]
         + ' districts; next: ' + Object.entries(by).sort((a, b) => b[1] - a[1])[1].join(' '));
       return top[0] === BK.CATCH_ALL;
     })());
  const gh = BK.ghosts();
  console.log('    [measured] names the fight knows that no live ground uses: '
    + (gh.join(', ') || 'none'));
  ok('the drift the other way is reported rather than hidden', Array.isArray(gh));
});

/* ---- E. A NAME IS NOT A FINDING; A MISSING BLOCK IS --------------------- */
section('E every fall-through is in a family, and every family names its block', () => {
  const ft = BK.fallThrough();
  const orphan = ft.filter(r => !r.family);
  ok('*** EVERY ONE OF THE FALL-THROUGHS IS IN A FAMILY ***', orphan.length === 0,
     orphan.map(r => r.district).join(', '));
  ok('and every family says what it is and which block the library lacks',
     Object.keys(BK.FAMILIES).every(f => BK.FAMILIES[f].is.length > 60
       && /^[A-Z ]+:/.test(BK.FAMILIES[f].wantsABlock)));
  const inFam = new Set();
  Object.keys(BK.FAMILIES).forEach(f => BK.FAMILIES[f].districts.forEach(d => inFam.add(d)));
  const ghostFam = [...inFam].filter(d => !BK.districts()[d]);
  ok('and no family claims a district the valley does not have',
     ghostFam.length === 0, ghostFam.join(', '));
  const wrongFam = [...inFam].filter(d => !BK.kindOf(d).catchAll);
  ok('and no family claims a district that already has its own board kind',
     wrongFam.length === 0, wrongFam.join(', '));
  /* THE THREE PLACES THAT MATTER MOST, BY NAME */
  ok('*** THE AIRPORT, THE CIVIC BUILDINGS AND THREE OF THE SIX GEAR PLACES ARE IN IT ***',
     ['airport', 'airbase', 'cityhall', 'courthouse', 'jail', 'arsenal', 'datafort', 'granary']
       .every(d => BK.kindOf(d).catchAll));
});

/* ---- F. THE MAP CLAIM IS RE-ROLLED -------------------------------------- */
section('F how much of a valley lands on the catch-all, re-rolled here', () => {
  let tot = 0, cat = 0, seeds = 0;
  const byFam = { civic: 0, infrastructure: 0, plant: 0 };
  for (let s = 1; s <= 20; s++) {
    const m = OM.buildOvermap((s * 7919) % 1000003); seeds++;
    for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
      const c = m.at ? m.at(x, y) : null; if (!c || !c.district) continue;
      tot++;
      if (BK.kindOf(c.district).catchAll) { cat++; const f = BK.familyOf(c.district); if (f) byFam[f]++; }
    }
  }
  console.log('    [measured] ' + seeds + ' valleys: ' + (cat / seeds).toFixed(1) + ' cells a valley of '
    + (tot / seeds).toFixed(0) + ' = ' + (cat / tot * 100).toFixed(2) + '% open the same fight');
  console.log('    [measured] by family a valley: civic ' + (byFam.civic / seeds).toFixed(1)
    + ', infrastructure ' + (byFam.infrastructure / seeds).toFixed(1)
    + ', plant ' + (byFam.plant / seeds).toFixed(1));
  ok('the catch-all really is reached on a rolled valley, not just in the list', cat > 0);
  ok('*** AND IT IS NOT A ROUNDING ERROR: over a hundred cells a valley ***',
     cat / seeds > 100, (cat / seeds).toFixed(1) + ' cells a valley');
  ok('the airfield is the biggest of them, which is why it is first',
     byFam.infrastructure > byFam.civic && byFam.infrastructure > byFam.plant);
  ok('and every family really appears on a rolled valley',
     byFam.civic > 0 && byFam.infrastructure > 0 && byFam.plant > 0);
});

console.log('\n' + '='.repeat(74));
console.log('BOARD KINDS GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (the row\'s premise was wrong: a district with no kit still gets a board. '
  + '24 of 78 districts open the SAME board, and the airport, every civic building '
  + 'and three of the six gear places are in them)');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
