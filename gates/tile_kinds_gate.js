#!/usr/bin/env node
/* BOHEMIA — TILE KINDS GATE (10/1/26, WORLD lane)
 *
 * ROW [tile options], the surviving half (coordinator 9/28): "the list of tile
 * KINDS at house size is yours: every kind the city has, from the block's own
 * layout; the board must still read as the city." COOK owns what a tile LOOKS
 * like; this owns WHAT A TILE CAN BE.
 *
 *  A  *** HARVESTED, NOT INVENTED, AND RE-HARVESTED EVERY RUN. *** Fifty-two
 *     district kits each carry a legend whose every entry names a kind. The gate
 *     reads them off disk and refuses if a kit ever declares a kind the table has
 *     not heard of, so the list cannot quietly fall behind the city it describes.
 *     This is the same shape as [board terrains]' own leg, for the same reason.
 *
 *  B  *** MOST OF WHAT THE CITY DRAWS IS NOT A TILE AT HOUSE SIZE. *** The kits
 *     were drawn for THE WALK at 0.75 m a cell. At house size 40% of their entries
 *     stop being a square you stand on: a painted lane line is paint, a sidewalk
 *     is not a tile (his words, 9/28, "never a fight where one tile is one
 *     sidewalk"), a parked car is cover ON a tile. Ten kinds are tiles, nine are
 *     not. Nothing is thrown away (rule 38e), it changes job.
 *
 *  C  THE SIZE IS MEASURED, NOT CHOSEN. "A combat tile is a house" is a ruling in
 *     houses, so the metres come off our own suburb every run: the house footprint
 *     and the LOT PITCH, which is what actually tiles a city.
 *
 *  D  A SIDEWALK NEVER BECOMES A TILE, held on the real cut of a real block.
 *
 *  E  WHAT A TILE LOOKS LIKE IS NOT THIS LANE'S: LOOKS ships empty, asking answers
 *     NO_RULING by name, and the module carries no colour, no pixel and no damage.
 *
 *  F  THE PICTURE AGREES WITH THE MODULE, AND THE DOOR IS REALLY ON IT — a leg
 *     that exists because the first cut's own file claimed the doors were marked
 *     while not one door pixel was drawn in either panel.
 *
 *   node gates/tile_kinds_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const P = (...a) => path.join(ROOT, ...a);
const R = (p) => require(P(p));
const read = (p) => fs.readFileSync(P(p), 'utf8');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

const TK = R('engine/bohemia_tilekinds.js');
const SUB = R('engine/bohemia_suburb.js');
const DOC = JSON.parse(read('banks/BOHEMIA_WHAT_A_TILE_IS_10_1_26.txt'));

/* ---- A. HARVEST THE CITY, EVERY RUN ------------------------------------- */
const entries = [];
let kits = 0;
fs.readdirSync(P('engine')).filter(f => f.startsWith('bohemia_') && f.endsWith('.js'))
  .forEach(f => {
    const src = read('engine/' + f);
    const ms = [...src.matchAll(/\b\d+\s*:\s*\{\s*name\s*:\s*'[^']*'\s*,\s*kind\s*:\s*'([a-z0-9_-]+)'/g)]
      .map(m => m[1]);
    if (!ms.length) return;
    kits++; entries.push(...ms);
  });
const census = TK.census(entries);

section('A the vocabulary is the city\'s, re-harvested every run', () => {
  console.log('    [measured] ' + kits + ' district kits, ' + census.entries
    + ' legend entries, ' + census.distinct + ' distinct kinds');
  ok('the harvest really found the kits, so it is measuring something',
     kits >= 40, kits + ' kits — the harvest is broken');
  ok('and it found a real pile of entries', census.entries > 500);
  ok('*** NOT ONE KIT DECLARES A KIND THE TABLE HAS NEVER HEARD OF ***',
     Object.keys(census.unknown).length === 0,
     'unknown: ' + Object.keys(census.unknown).join(', '));
  ok('and the table claims no kind the city does not declare',
     Object.keys(TK.CLASS).every(k => census.byKind[k] > 0),
     'claimed but never placed: ' + Object.keys(TK.CLASS).filter(k => !census.byKind[k]).join(', '));
  ok('every kind is classified into one of the five', Object.keys(TK.CLASS)
     .every(k => TK.CLASSES.indexOf(TK.CLASS[k]) >= 0));
});

/* ---- B. *** MOST OF IT IS NOT A TILE *** -------------------------------- */
section('B what the walk drew is mostly not a tile at house size', () => {
  console.log('    [measured] by class: ' + JSON.stringify(census.byClass));
  const notTile = census.entries - census.byClass.TILE;
  const pct = 100 * notTile / census.entries;
  console.log('    [measured] ' + TK.tiles().length + ' of ' + Object.keys(TK.CLASS).length
    + ' kinds are tiles; ' + pct.toFixed(1) + '% of entries are not a tile at house size');
  ok('*** A LOT OF WHAT THE CITY DRAWS IS NOT A TILE ***', pct > 20, pct.toFixed(1) + '%');
  ok('and tiles are still the biggest class, or the board would have no floor',
     census.byClass.TILE > notTile);
  ok('*** THE SIDEWALK IS DRESSING, NOT A TILE (his words, 9/28) ***',
     TK.classOf('walk').klass === 'DRESSING');
  ok('a painted line is dressing too', TK.classOf('marking').klass === 'DRESSING');
  ok('a parked car is a blocker, which is what makes it cover',
     TK.classOf('vehicle').klass === 'BLOCKER');
  ok('a door is an EDGE, not a square you stand on',
     TK.classOf('portal').klass === 'EDGE' && TK.classOf('gate').klass === 'EDGE');
  ok('a building is a tile', TK.classOf('building').klass === 'TILE');
  ok('the kits\' hyphen spellings resolve rather than falling through',
     TK.classOf('water-dead').known && TK.classOf('tree-dead').known
     && TK.classOf('turf-dead').known);
  ok('and an unknown kind answers by name instead of guessing TILE',
     TK.classOf('lava').why === TK.NOT_A_KIND
     && /guessing TILE/.test(TK.classOf('lava').because));
});

/* ---- C. THE SIZE IS MEASURED, EVERY RUN --------------------------------- */
section('C a combat tile is a house, in metres taken off our own suburb', () => {
  const o = SUB.generate(1337), L = SUB.legend, W = o.W, H = o.H;
  const isB = new Set(Object.keys(L).filter(k => L[k].kind === 'building').map(Number));
  const seen = new Set(), centres = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!isB.has(o.g[y][x]) || seen.has(y * 1000 + x)) continue;
    const q = [[x, y]]; let sx = 0, sy = 0, n = 0; seen.add(y * 1000 + x);
    while (q.length) {
      const [cx, cy] = q.pop(); sx += cx; sy += cy; n++;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        if (isB.has(o.g[ny][nx]) && !seen.has(ny * 1000 + nx)) { seen.add(ny * 1000 + nx); q.push([nx, ny]); }
      }
    }
    centres.push([sx / n, sy / n]);
  }
  const nn = centres.map((a, i) => {
    let best = 1e9;
    centres.forEach((b, j) => { if (i !== j) best = Math.min(best, Math.hypot(a[0] - b[0], a[1] - b[1])); });
    return best;
  }).sort((a, b) => a - b);
  const pitch = Math.round(nn[Math.floor(nn.length / 2)]);
  const pitch_m = +(pitch * SUB.TILE).toFixed(1);
  console.log('    [measured] ' + centres.length + ' houses in a ' + W + '-cell block of '
    + SUB.TILE + ' m cells; LOT PITCH ' + pitch + ' cells = ' + pitch_m + ' m');
  ok('the block really is a block of houses', centres.length >= 8);
  ok('*** THE LOT PITCH IS A SUBURBAN LOT, NOT A NUMBER SOMEBODY PICKED ***',
     pitch_m >= 12 && pitch_m <= 30, pitch_m + ' m');
  ok('and the module records the pitch the suburb really has',
     TK.MEASURED.lotPitch_cells === pitch, TK.MEASURED.lotPitch_cells + ' against ' + pitch);
  ok('the world unit is his 0.75 m', TK.MEASURED.kitCell_m === SUB.TILE);
  ok('the module says where its numbers came from', /bohemia_suburb/.test(TK.MEASURED.source));
});

/* ---- D. A SIDEWALK NEVER BECOMES A TILE, ON A REAL CUT ------------------ */
section('D the cut never turns a non-tile into a tile', () => {
  const m = DOC.measured;
  console.log('    [measured] the block cuts into ' + m.tilesAcross + ' x ' + m.tilesAcross
    + ' house tiles of ' + m.leftPanelCellsPerTile + ' kit cells; '
    + m.housesSurvivingTheCut + ' came out a building');
  ok('the cut really is house-sized, not block-sized or cell-sized',
     m.tilesAcross >= 3 && m.tilesAcross <= 12);
  ok('*** THE BOARD STILL READS AS THE CITY: houses survived the cut ***',
     m.housesSurvivingTheCut > 0);
  ok('and they are not the whole board either', m.housesSurvivingTheCut < m.tilesAcross * m.tilesAcross);
  ok('the tool refuses a tile that is not a tile kind, as a live statement',
     /Never a fight where one tile is one sidewalk[\s\S]{0,60}process\.exit\(1\)/
       .test(read('tools/bohemia_house_size_cook_10_1_26.js').replace(/\/\*[\s\S]*?\*\//g, ' ')));
});

/* ---- E. WHAT A TILE LOOKS LIKE IS NOT THIS LANE'S ----------------------- */
section('E the module decides no art and no damage', () => {
  ok('*** LOOKS SHIPS EMPTY ***', Object.keys(TK.LOOKS).length === 0);
  ok('asking answers NO_RULING and says whose it is',
     TK.looksOf('building').why === TK.NO_RULING
     && /COOK/.test(TK.looksOf('building').because));
  ok('a kind that is not one of the city\'s is refused, not improvised',
     TK.looksOf('lava').why === TK.NOT_A_KIND);
  const live = read('engine/bohemia_tilekinds.js').replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('and the module carries no colour, no pixel and no damage',
     !/#[0-9a-f]{6}|canvas|fillRect|damage|\bhp\b/i.test(live));
});

/* ---- F. THE PICTURE AGREES, AND THE DOOR IS REALLY ON IT ---------------- */
section('F the picture is read out of the city, not drawn to illustrate it', () => {
  const m = DOC.measured;
  ok('the picture read the same kits the gate did', m.kits === kits, m.kits + ' against ' + kits);
  ok('and counted the same entries', m.legendEntries === census.entries);
  ok('and the same classes', JSON.stringify(m.byClass) === JSON.stringify(census.byClass));
  ok('it is a draft and nothing on a play surface',
     DOC.draft === true && /rule 18/.test(DOC.not_shipped));
  ok('the picture exists where he can reach it',
     fs.existsSync(P('slices/vote/WORLD_WHAT_A_TILE_IS.png')));
  /* *** THE DOOR. The first cut's own file said the doors were marked and not one
     door pixel existed in either panel, because the kit places its gate in a
     `gates` list and never in its cells. *** */
  console.log('    [measured] ' + m.gatesOnTheBlock + ' gate(s) on the block, '
    + m.doorPixels + ' door pixels drawn');
  ok('*** THE BLOCK HAS A WAY IN AND IT IS ON THE PICTURE ***',
     m.gatesOnTheBlock > 0 && m.doorPixels > 0);
  ok('and the file says why the door is not in the cell grid',
     /gates list/.test(DOC.the_door_is_not_in_the_grid || ''));
  const tool = read('tools/bohemia_house_size_cook_10_1_26.js').replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('the no-door refusal is a live statement, not a comment',
     /not one door pixel[\s\S]{0,80}process\.exit\(1\)/.test(tool));
  ok('the unknown-kind refusal is live',
     /never heard of it[\s\S]{0,120}process\.exit\(1\)/.test(tool));
  ok('and the harvest refuses to run on too few kits',
     /the harvest is broken[\s\S]{0,40}process\.exit\(1\)/.test(tool));
});

console.log('TILE KINDS GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (' + census.distinct + ' kinds harvested from ' + kits + ' district kits, '
  + TK.tiles().length + ' of them tiles at house size, the lot pitch measured at '
  + TK.MEASURED.lotPitch_m + ' m, and a sidewalk never becomes a square you stand on)');
process.exit(fail ? 1 : 0);
