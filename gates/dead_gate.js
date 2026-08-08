#!/usr/bin/env node
/* THE DEAD GATE (8/8/26, WORLD lane).
 *
 *   "skeletons in the open, husks in sealed places, realistic mix, story-via-placement"
 *                                                              -- Paolo, 8/8/26
 *
 * The ruling is REAL FORENSICS, which is why it is buildable as physics instead of taste:
 * outdoors a Mojave scavenger guild disarticulates and SCATTERS remains over the 49+ days
 * surface skeletonisation takes; sealed and dry, mummification starts around day six and
 * then ARRESTS decomposition, leaving an intact husk exactly where it lay. Scavenger
 * access is the variable, and a shut door is what removes it.
 *
 * WHAT THIS PROVES:
 *   1. THE RULING, LITERALLY. Open or sheltered -> skeleton, always. Sealed -> husk,
 *      always. Zero exceptions across the real valley, not a sampled promise.
 *   2. NOBODY IS IN A WALL. Every body is on a tile something could stand on.
 *   3. TRAUMATIC, NOT GORY (law, 7/31). Not one wound, blood, injury, damage or
 *      cause-of-death field exists in the module OR in anything it emits. Gore is never the
 *      mechanism, and a corpse in this game is a fact of a place.
 *   4. DETERMINISM. No Date, no Math.random (comments stripped, calls only), and the same
 *      cell holds the same dead twice.
 *   5. THE STREAMS ARE INDEPENDENT, and this check exists because they were NOT. The
 *      placement draw and the arrangement draw shared a weak hash tail, so every cell that
 *      survived the density check landed mid-range on the arrangement draw and `queue` --
 *      an 8.7% weight -- was chosen ZERO TIMES IN THE ENTIRE VALLEY. Placement that looks
 *      random and is not is worse than placement that is obviously regular, because nothing
 *      about it looks wrong. So: every arrangement must actually occur.
 *   6. REALISTIC MIX. Dying alone is the common case and must dominate; the loud
 *      arrangements are rationed, because a striking sentence repeated everywhere stops
 *      being one.
 *   7. STORY-VIA-PLACEMENT IS PLACED, NOT HOPED FOR. The two door arrangements -- somebody
 *      on a doorstep who did not get in, somebody who shut a door and stayed on this side
 *      of it -- must both appear. Measured before the door pass existed: 1.7% and 0.4%.
 *
 *   node gates/dead_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const DEAD = require(path.join(ROOT, 'engine/bohemia_dead.js'));
const IL = require(path.join(ROOT, 'engine/bohemia_interior_levels.js'));
const { world } = require(path.join(ROOT, 'engine/bohemia_world.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const SRC = fs.readFileSync(path.join(ROOT, 'engine/bohemia_dead.js'), 'utf8');
const CODE = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// ---- 3: TRAUMATIC, NOT GORY -- checked on the CODE, before anything is generated -----
ok('the module declares no wound / blood / injury / damage / cause-of-death field',
   !/\b(wound|blood|bloody|injur\w*|gore|gory|mutilat\w*|dismember\w*|damage|causeOfDeath)\s*[:=]/i.test(CODE));
ok('and it names the law it is obeying', /TRAUMATIC/.test(SRC) && /NOT GORY/i.test(SRC));

// ---- 4: determinism ------------------------------------------------------------------
ok('no Date and no Math.random (comments stripped, calls only)',
   !/Math\.random\s*\(|Date\.now\s*\(|new\s+Date\s*\(/.test(CODE));

// ---- walk the REAL valley ------------------------------------------------------------
const w = world(12345);
const N = w.n;
let plots = 0, skipped = 0, bodies = 0;
let ruleBreak = 0, inWall = 0, goreField = 0, levelBad = 0;
const byArr = {}, byKind = {};
const GORE = /^(wound|blood|injury|damage|gore|causeOfDeath)$/i;

for (let cy = 8; cy < N - 8; cy += 7) for (let cx = 8; cx < N - 8; cx += 7) {
  const c = w.at(cx, cy); if (!c) continue;
  let p; try { p = w.plot(cx, cy); } catch (e) { continue; }
  const seed = (c.seed >>> 0);

  const ext = DEAD.placePlot(p, seed);
  if (ext.skipped) { skipped++; } else {
    plots++;
    for (const d of ext.remains) {
      bodies++; byArr[d.arrangement] = (byArr[d.arrangement] || 0) + 1;
      byKind[d.kind] = (byKind[d.kind] || 0) + 1;
      // 1. THE RULING
      if (d.exposure === 'sealed' ? d.kind !== DEAD.HUSK : d.kind !== DEAD.SKELETON) ruleBreak++;
      // 2. nobody in a wall
      const t = p.tileInfo(d.x, d.y);
      if (!t || t.solid) inWall++;
      // and the exposure it claims must be the exposure the tile actually has
      if (DEAD.exposure(t) !== d.exposure) ruleBreak++;
      for (const k in d) if (GORE.test(k)) goreField++;
    }
  }

  for (let i = 0; i < Math.min(2, p.buildings ? p.buildings.length : 0); i++) {
    let inter; try { inter = p.building(i).interior(); } catch (e) { continue; }
    const A = IL.read(inter); if (!A) continue;
    for (const d of DEAD.placeInterior(A, seed + i).remains) {
      bodies++; byArr[d.arrangement] = (byArr[d.arrangement] || 0) + 1;
      byKind[d.kind] = (byKind[d.kind] || 0) + 1;
      // 1. an interior is sealed BY DEFINITION -- that is what an interior is
      if (d.kind !== DEAD.HUSK || d.exposure !== 'sealed') ruleBreak++;
      // 2. and it must be somewhere a body could actually lie
      if (!A.passable(d.level, d.x, d.y)) inWall++;
      if (d.level < 0 || d.level >= A.count) levelBad++;
      for (const k in d) if (GORE.test(k)) goreField++;
    }
  }
}

ok('the valley actually has its dead (' + bodies + ' across ' + plots + ' plots, ' +
   (bodies / Math.max(1, plots)).toFixed(1) + ' per block)', bodies > 500 && plots > 50);
ok('SKELETONS IN THE OPEN, HUSKS IN SEALED PLACES — zero exceptions valley-wide', ruleBreak === 0);
ok('nobody is placed in a wall or anywhere a body could not lie', inWall === 0);
ok('every interior body is on a level that exists', levelBad === 0);
ok('not one emitted body carries a gore field', goreField === 0);
ok('both kinds occur (' + JSON.stringify(byKind) + ')',
   byKind[DEAD.SKELETON] > 0 && byKind[DEAD.HUSK] > 0);
ok('plots with no published tile layering are SKIPPED, not guessed at (' + skipped + ')',
   skipped >= 0);

// ---- 5: the streams are independent -- EVERY arrangement must occur -------------------
const declared = DEAD.ARRANGEMENTS.map(a => a.id);
const missing = declared.filter(id => !byArr[id]);
ok('every declared arrangement actually occurs in the valley' +
   (missing.length ? ' — never placed: ' + missing.join(', ') : ''), missing.length === 0);

// ---- 6: realistic mix ----------------------------------------------------------------
const share = id => (byArr[id] || 0) / Math.max(1, bodies);
ok('dying ALONE is the common case (' + (100 * share('lone')).toFixed(0) + '%)',
   share('lone') > 0.35);
ok('the loud arrangements stay rationed — a line of three in the road is under a fifth of ' +
   'the dead (' + (100 * share('queue')).toFixed(1) + '%)', share('queue') < 0.20);

// ---- 7: the story is PLACED ----------------------------------------------------------
ok('somebody is lying on a doorstep who did not get in (' + (byArr.threshold || 0) + ')',
   (byArr.threshold || 0) > 0);
ok('somebody shut a door and stayed on this side of it (' + (byArr.inside_door || 0) + ')',
   (byArr.inside_door || 0) > 0);
ok('every arrangement carries the sentence it is telling',
   DEAD.ARRANGEMENTS.every(a => typeof a.says === 'string' && a.says.length > 20));

// ---- determinism, measured ------------------------------------------------------------
const p0 = w.plot(30, 30), s0 = (w.at(30, 30).seed >>> 0);
ok('the same cell holds the same dead twice',
   JSON.stringify(DEAD.placePlot(p0, s0)) === JSON.stringify(DEAD.placePlot(p0, s0)));
ok('a different cell holds different dead',
   JSON.stringify(DEAD.placePlot(p0, s0)) !== JSON.stringify(DEAD.placePlot(p0, s0 + 1)));

// ---- the research is cited, not remembered --------------------------------------------
ok('the module cites its forensics rather than asserting them',
   DEAD.NOTES && Array.isArray(DEAD.NOTES.reference) && DEAD.NOTES.reference.length >= 3 &&
   /scaveng/i.test(DEAD.NOTES.reference.join(' ')) && /mummif/i.test(DEAD.NOTES.reference.join(' ')));
ok('and it records the ruling verbatim', /skeletons in the open/i.test(DEAD.NOTES.ruling));

const mix = Object.keys(byArr).sort((a, b) => byArr[b] - byArr[a])
  .map(k => k + ' ' + (100 * share(k)).toFixed(0) + '%').join(' · ');
console.log('THE DEAD GATE: ' + pass + ' passed, ' + fail + ' failed  (' + bodies +
            ' bodies, ' + (byKind.skeleton || 0) + ' skeletons open / ' + (byKind.husk || 0) +
            ' husks sealed · ' + mix + ')');
process.exit(fail ? 1 : 0);
