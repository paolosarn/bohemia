#!/usr/bin/env node
/* ============================================================================
   WHAT EACH GROUND DOES TO A FIGHT   (WORLD lane, row [ground effects], rule 59)

   Paolo 10/1: "every floor tile from Battle Brothers needs a proper translation
   for our game... how it impacts your accuracy or your defence or the
   positioning, how many action points it costs to move through."

   THIS GATE REFUSES FIVE THINGS, and every refusal re-measures rather than
   trusting a constant in the module:

   A. A SECOND LIST OF GROUNDS. The grounds come from bohemia_boardterrain.js.
   B. A COVER NUMBER THAT IS NOT WHAT THE KITS DRAW. Every value in DRAWN is
      re-measured here off the real generated blocks, five seeds a kit, and must
      match within a hair. This is the whole finding of the row: the LEGEND count
      the travel-speed row uses says every ground is 43-57% blocked, and the
      drawn board says 1.5% to 95.8%.
   C. THE [bb places] DEFECT OF 9/25, BY NAME: thirteen grounds that all come out
      the same place. The drawn spread must stay wide.
   D. AN EFFECT THAT TRACES TO NEITHER A RULING NOR A MEASUREMENT. Every ruled row
      must cite the school page and name only tile kinds the kits really draw;
      every unruled kind the valley draws must be named in UNRULED.
   E. A HOLE FILLED WITH A ZERO. Height answers UNREAD, not 0. Water is 0 by
      MEASUREMENT and the gate re-counts it, so the day somebody draws a wet cell
      this goes red instead of the module quietly lying.

   Every refusal below ends at a process.exit through the failure count, never at
   a comment: this lane shipped a check once that went green because its own
   replacement comment still contained the words it was grepping for.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const P = p => path.join(__dirname, '..', p);
const read = p => fs.readFileSync(P(p), 'utf8');

let GE = require('../engine/bohemia_groundeffects.js'); GE = GE.BOH_GROUNDEFFECTS || GE;
let BT = require('../engine/bohemia_boardterrain.js'); BT = BT.BOH_BOARDTERRAIN || BT;
let TK = require('../engine/bohemia_tilekinds.js');   TK = TK.BOH_TILEKINDS || TK;
let VG = require('../engine/bohemia_valleyground.js'); VG = VG.BOH_VALLEYGROUND || VG;

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? '  (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  (' + note + ')' : ''))); };
const section = (t, f) => { console.log('\n--- ' + t + ' ---'); f(); };

/* ========================================================================
   THE MEASUREMENT. Load every district kit of every live ground and count the
   cells it really draws. Five seeds a kit. The kit modules print on load and on
   generate, so stdout is held while they run.
   ====================================================================== */
const SEEDS = [1337, 7, 19, 23, 91];
const realLog = console.log, hush = () => {};
const kitOf = {};
(() => {
  const want = new Set();
  Object.keys(BT.FROM).forEach(g => { if (!BT.NOT_ON_THE_MAP[g]) (BT.FROM[g] || []).forEach(d => want.add(d)); });
  want.forEach(n => {
    const f = P('engine/bohemia_' + n + '.js');
    if (!fs.existsSync(f)) return;
    console.log = hush; let M = null; try { M = require(f); } catch (e) { M = null; } console.log = realLog;
    if (M && typeof M.generate === 'function' && M.legend) kitOf[n] = M;
  });
})();

const MEAS = {};            /* ground -> {cover, room, door, cells, kinds:Set} */
let WET = 0, TOTAL = 0;
const KINDS_DRAWN = new Set();
GE.grounds().forEach(g => {
  const ds = (BT.FROM[g] || []).filter(d => kitOf[d]);
  if (!ds.length) return;
  let cover = 0, room = 0, door = 0, n = 0;
  const kinds = new Set();
  ds.forEach(d => {
    const M = kitOf[d];
    const leg = typeof M.legend === 'function' ? M.legend() : M.legend;
    SEEDS.forEach(s => {
      console.log = hush; let b = null; try { b = M.generate(s); } catch (e) {} console.log = realLog;
      const grid = b && b.g; if (!grid) return;
      for (const row of grid) { if (!row) continue;
        for (const c of row) {
          const e = leg[c]; if (!e || !e.kind) continue;
          n++; TOTAL++; kinds.add(e.kind); KINDS_DRAWN.add(e.kind);
          if (e.kind === 'water') WET++;
          const K = TK.classOf(e.kind); if (!K.known) continue;
          if (K.klass === 'TILE') { (e.kind === 'building' || e.kind === 'structure') ? cover++ : room++; }
          else if (K.klass === 'BLOCKER') cover++;
          else if (K.klass === 'EDGE') door++;
        } }
    });
  });
  if (n) MEAS[g] = { cover: cover / n, room: room / n, door: door / n, cells: n, kinds: [...kinds] };
});

console.log('=== GROUND EFFECTS GATE ===');
console.log('    [measured] ' + Object.keys(kitOf).length + ' district kits can draw; '
  + Object.keys(MEAS).length + ' of ' + GE.grounds().length + ' grounds measured over '
  + TOTAL.toLocaleString() + ' drawn cells, ' + SEEDS.length + ' seeds a kit');

/* ---- A. ONE LIST OF GROUNDS --------------------------------------------- */
section('A one list of grounds, and it is the terrain module\'s', () => {
  const live = BT.KINDS.filter(k => !BT.NOT_ON_THE_MAP[k]);
  ok('the grounds come from bohemia_boardterrain.js, live',
     GE.grounds().join('|') === live.join('|'), GE.grounds().length + ' grounds');
  const src = read('engine/bohemia_groundeffects.js');
  /* a literal array of ground names would be a second list; DRAWN is keyed by
     them, which is data, so the refusal is on an ARRAY literal of them. */
  ok('*** AND IT DOES NOT KEEP ITS OWN ARRAY OF GROUND NAMES ***',
     !/\[\s*'(suburb_block|the_strip|open_desert|hills)'\s*,/.test(src));
  ok('a thing that is not a ground is refused by name, not improvised',
     GE.effectOf('mars').why === GE.NOT_A_GROUND
     && GE.costOf('mars').why === GE.NOT_A_GROUND
     && GE.heightOf('mars').why === GE.NOT_A_GROUND);
  ok('a ground off the map (a condition, an interior) is not a ground here',
     GE.grounds().indexOf('ruin') < 0 && GE.grounds().indexOf('casino_floor') < 0);
});

/* ---- B. EVERY NUMBER IS WHAT THE KITS DRAW ------------------------------ */
section('B every number is re-measured off the drawn boards', () => {
  let worst = 0, worstG = '';
  let missing = [];
  Object.keys(MEAS).forEach(g => {
    const e = GE.effectOf(g);
    if (!e.known) { missing.push(g); return; }
    [['cover', 'cover'], ['room', 'room'], ['door', 'door']].forEach(([k]) => {
      const d = Math.abs(e[k] - MEAS[g][k]);
      if (d > worst) { worst = d; worstG = g + '.' + k; }
    });
  });
  ok('every measured ground reached the module', missing.length === 0, missing.join(', '));
  console.log('    [measured] worst drift between the module and the kits: '
    + worst.toFixed(4) + (worstG ? ' on ' + worstG : ''));
  ok('*** THE COVER, ROOM AND DOOR SHARES STILL MATCH WHAT THE KITS DRAW ***',
     worst < 0.0011, 'worst ' + worst.toFixed(4) + ' on ' + worstG);
  ok('every ground with no drawable kit answers NO_KIT rather than a number',
     GE.grounds().filter(g => !MEAS[g]).every(g => GE.effectOf(g).why === GE.NO_KIT));
  ok('*** AND EVERY VALUE CARRIES tuned:false, because every felt number is TUNING\'S ***',
     Object.keys(MEAS).every(g => GE.effectOf(g).tuned === false)
     && GE.costOf('hills').tuned === false);
});

/* ---- C. THIRTEEN GROUNDS ARE NOT ONE GROUND ----------------------------- */
section('C the thirteen are really different places (the 9/25 [bb places] defect)', () => {
  const cv = Object.keys(MEAS).map(g => MEAS[g].cover);
  const lo = Math.min(...cv), hi = Math.max(...cv);
  console.log('    [measured] drawn cover runs ' + (lo * 100).toFixed(1) + '% to '
    + (hi * 100).toFixed(1) + '%, a ' + (hi / lo).toFixed(1) + 'x spread');
  ok('*** THE GROUNDS ARE NOT ALL THE SAME PLACE: the cover spread is over 10x ***',
     hi / lo > 10, (hi / lo).toFixed(1) + 'x');
  const distinct = new Set(cv.map(x => x.toFixed(2))).size;
  ok('and at least ten of the thirteen have their own cover number',
     distinct >= 10, distinct + ' distinct of ' + cv.length);
  ok('the desert is the open fight and the mountain is the walled one',
     MEAS.open_desert && MEAS.hills && MEAS.open_desert.cover < 0.05 && MEAS.hills.cover > 0.8,
     'desert ' + (MEAS.open_desert ? (MEAS.open_desert.cover * 100).toFixed(1) : '?')
     + '%, mountain ' + (MEAS.hills ? (MEAS.hills.cover * 100).toFixed(1) : '?') + '%');

  /* *** AND THE FINDING ITSELF IS HELD: the legend disagrees with the board. ***
     If somebody ever fixes the legend counts, this goes red and the record is
     wrong rather than the code being quietly right. */
  let legWorst = 0, legG = '';
  Object.keys(MEAS).forEach(g => {
    if (VG.OPEN_SHARE[g] === undefined) return;
    const d = Math.abs((1 - VG.OPEN_SHARE[g]) - MEAS[g].cover);
    if (d > legWorst) { legWorst = d; legG = g; }
  });
  console.log('    [measured] the LEGEND count and the DRAWN board disagree by up to '
    + (legWorst * 100).toFixed(0) + ' points, worst on ' + legG);
  ok('*** THE ROW\'S FINDING IS STILL TRUE: a legend count is not a board ***',
     legWorst > 0.3, (legWorst * 100).toFixed(0) + ' points on ' + legG);
});

/* ---- D. EVERY EFFECT TRACES TO A RULING OR A MEASUREMENT ---------------- */
section('D nothing has an effect nobody can trace', () => {
  const rows = Object.keys(GE.ROWS);
  ok('every ruled row cites the school page by name',
     rows.every(r => /SCHOOL_EVERY_FLOOR_TILE/.test(GE.ROWS[r].ruling)));
  ok('and every ruled row carries tuned:false',
     rows.every(r => GE.ROWS[r].tuned === false));
  const invented = [];
  rows.forEach(r => GE.ROWS[r].ours.forEach(k => { if (!KINDS_DRAWN.has(k)) invented.push(r + ':' + k); }));
  ok('*** NO RULED ROW CLAIMS A TILE KIND THE KITS DO NOT DRAW ***',
     invented.length === 0, invented.join(', '));
  /* the other direction: a kind the valley draws with no ruled row must be named */
  const covered = new Set();
  rows.forEach(r => GE.ROWS[r].ours.forEach(k => covered.add(k)));
  const orphan = [...KINDS_DRAWN].filter(k => !covered.has(k) && !GE.UNRULED[k]);
  ok('*** AND EVERY KIND THE VALLEY DRAWS IS EITHER RULED OR NAMED AS UNRULED ***',
     orphan.length === 0, orphan.join(', '));
  ok('the unruled list says what each one is and why it has no number',
     Object.keys(GE.UNRULED).every(k => GE.UNRULED[k].length > 60));

  /* the rows that fire are measured per ground, not asserted */
  const desert = GE.rowsOn('open_desert', MEAS.open_desert.kinds);
  ok('on a ground that is measured, the rows that fire are the measured ones',
     desert.known && desert.measured && desert.fires.indexOf('obstacles') >= 0
     && desert.fires.indexOf('flat') >= 0);
  ok('and a door never fires on a ground with no door drawn',
     desert.fires.indexOf('door') < 0, 'desert door share ' + MEAS.open_desert.door);
  const strip = GE.rowsOn('the_strip', MEAS.the_strip.kinds);
  ok('while a ground with doors drawn does fire the door row',
     strip.fires.indexOf('door') >= 0);
});

/* ---- E. A HOLE IS A HOLE, NOT A ZERO ------------------------------------ */
section('E the holes answer by name, and the dry valley is a measurement', () => {
  const h = GE.heightOf('hills');
  ok('*** HEIGHT ANSWERS UNREAD, NOT 0 ***', h.known === false && h.why === GE.UNREAD);
  ok('and it says why a zero would be worse than no answer',
     /flat/.test(h.because) && /cliff/.test(h.because));
  ok('and it names whose it is', /COMBAT/.test(h.whose));
  ok('the rough row and the swamp row are kept in the table saying they cannot fire',
     GE.ROWS.rough.ours.length === 0 && GE.ROWS.swamp.ours.length === 0
     && /NOTHING HERE/.test(GE.ROWS.rough.does) && /NOTHING HERE/.test(GE.ROWS.swamp.does));

  console.log('    [measured] wet cells drawn on any live ground: ' + WET + ' of ' + TOTAL.toLocaleString());
  ok('*** THE VALLEY IS DRY, RE-COUNTED HERE, NOT TAKEN ON TRUST ***',
     WET === GE.wet().wetCellsOnAnyGround, WET + ' drawn, module says ' + GE.wet().wetCellsOnAnyGround);
  ok('and the module says which Battle Brothers row that kills',
     GE.wet().killsRow === 'swamp');

  ok('the step cost is his ruling and says so, not a measurement dressed up',
     GE.costOf('the_strip').steps === 1 && /EVERYTHING COSTS ONE/.test(GE.costOf('the_strip').ruling));

  /* NO SECOND COPY OF A NUMBER */
  const src = read('engine/bohemia_groundeffects.js');
  ok('*** AND NO TRAVEL SPEED IS RESTATED HERE: it is looked up live ***',
     !/speed\s*:\s*(0\.75|1\.00|0\.50|0\.25)\b/.test(src)
     && GE.effectOf('open_desert').travel.speed === VG.speedOf('open_desert').speed);
});

console.log('\n' + '='.repeat(74));
console.log('GROUND EFFECTS GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (the ground changes a fight by how much of it you cannot stand on, and that '
  + 'runs 1.5% to 95.8% -- the legend said 43% to 57%)');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
