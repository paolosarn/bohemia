/* PITS GATE (8/11/26, WORLD lane) — DIRT AND SAND ARE A GENERATIVE SURFACE.
 *
 * Paolo 8/11, LOCKED:
 *   "maybe we should have more open pits where a bunch of the shit lives as
 *    well. i know we have grids and shit but part of the procedureal generation
 *    especially if its dirt/sand is that we can proceduraly generate elements on
 *    the dirt/sand and this may be part of it."
 *
 * BohemiaDead.pits() digs into bare ground and leaves what a real dig leaves:
 * subsidence (fill), a cracked cut edge (rim), the earth that never went back
 * (spoil), a machine ramp, and nitrogen-fed growth over the fill (green). Every
 * one of those is a cited forensic surface indicator, not a look.
 *
 *   node gates/pits_gate.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'engine', 'bohemia_dead.js'));

let pass = 0, fail = 0;
const ok = (l, c, x) => { if (c) { pass++; console.log('  ok   ' + l); }
                          else { fail++; console.log('  FAIL ' + l + (x ? '\n         ' + x : '')); } };

console.log('PITS GATE — somebody dug here, and the ground still shows it');

const W = 128, H = 128;
const dirt = { 0: { name: 'desert dirt', kind: 'ground' } };
const paved = { 0: { name: 'parking apron', kind: 'ground' } };
const flat = new Array(W * H).fill(0);
const dig = (type, legend, act) => D.pits({ type, kit: flat, W, H, legend,
  seed: 2691674296, cellX: 40, cellY: 17, act: act || 1 });

/* ---- 1. IT ONLY DIGS WHAT CAN BE DUG ------------------------------------- */
ok('bare dirt is diggable', D.isDiggable(dirt[0]));
ok('a paved apron is NOT diggable (you do not hand-dig a parking lot)',
   !D.isDiggable(paved[0]));
ok('a wall is not diggable', !D.isDiggable({ name: 'stucco wall', kind: 'building' }));
ok('no pit is ever dug on paved ground', dig('cemetery', paved).length === 0,
   'a pit on asphalt is the feature reading as a decal instead of an excavation');

/* ---- 2. IT ACTUALLY DIGS -------------------------------------------------- */
const cem = dig('cemetery', dirt);
ok('a cemetery cell of bare dirt gets dug (' + cem.length + ' tiles)', cem.length > 50);
const parts = {}; cem.forEach(p => { parts[p.part] = (parts[p.part] || 0) + 1; });
for (const need of ['fill', 'rim', 'spoil', 'ramp', 'green']) {
  ok('the dig leaves its ' + need + ' (' + (parts[need] || 0) + ' tiles)', (parts[need] || 0) > 0,
     need === 'spoil' ? 'the earth taken out never all goes back — archaeology calls the heap SPOIL'
     : need === 'green' ? 'decomposition dumps nitrogen into the fill and growth over a grave is abnormally strong; in a desert that is the loudest tell there is'
     : need === 'ramp' ? 'a pit dug by machine has a ramp: it is how the loader got in'
     : '');
}

/* ---- 3+4. THE SHAPE, MEASURED PER PIT ------------------------------------
   MEASURE ONE DIG AT A TIME. The first cut of this gate pooled every tile in
   the cell and asked whether "the" pit was elliptical and whether "the" spoil
   sat on one side -- but a cemetery cell digs FIVE separate pits, each with its
   own throw direction, so the pooled answer was a bounding box spanning all
   five and a spoil ring made of five different sides. The code was right and
   the ruler was wrong. Group by p.pit and ask each dig its own question. */
{
  const byPit = {};
  cem.forEach(p => { (byPit[p.pit] = byPit[p.pit] || []).push(p); });
  const ids = Object.keys(byPit);
  ok('the cell digs discrete pits, not one smear (' + ids.length + ' pit(s))', ids.length >= 1);

  let square = 0, boxy = 0, ringed = 0;
  for (const id of ids) {
    const pit = byPit[id];
    const f = pit.filter(p => p.part === 'fill' || p.part === 'green');
    if (!f.length) continue;
    const xs = f.map(p => p.x), ys = f.map(p => p.y);
    const bw = Math.max(...xs) - Math.min(...xs) + 1, bh = Math.max(...ys) - Math.min(...ys) + 1;
    if (bw === bh) square++;
    if (f.length > bw * bh * 0.88) boxy++;                 // filled its own box = a rectangle
    const sp = pit.filter(p => p.part === 'spoil');
    if (sp.length) {
      const cxm = xs.reduce((a, b) => a + b, 0) / xs.length;
      const cym = ys.reduce((a, b) => a + b, 0) / ys.length;
      const rx = sp.filter(p => p.x > cxm).length / sp.length;
      const ry = sp.filter(p => p.y > cym).length / sp.length;
      if (!(rx > 0.8 || rx < 0.2 || ry > 0.8 || ry < 0.2)) ringed++;
    }
  }
  ok('no dig is a rectangle — every cut is an ellipse (' + boxy + ' boxy of ' + ids.length + ')', boxy === 0);
  ok('every spoil heap sits on ONE side of its own pit (' + ringed + ' ringed of ' + ids.length + ')',
     ringed === 0,
     'spoil ringing a pit evenly is a halo effect, not earth a machine threw');
}

/* ---- 5. THE STORY TABLE IS GROUNDED, AND NAMES NOBODY ------------------- */
ok('the cemetery digs harder than a back yard',
   D.pitStoryFor('cemetery').rate > D.pitStoryFor('suburb').rate);
ok('the cemetery pit holds more than a back-yard grave',
   D.pitStoryFor('cemetery').hold > D.pitStoryFor('suburb').hold);
ok('an unruled district still gets the default, so no surface is silently exempt',
   D.pitStoryFor('nonesuch-district') === D.PIT_DEFAULT);
{
  /* MECHANISM-MINE / CONTENTS-PAOLO'S. This decides where the ground was dug.
     It must never decide WHO dug it — that is his to rule, and the same line
     the dead system already holds. */
  const all = Object.keys(D.PIT_STORY).map(k => D.PIT_STORY[k].story).join(' ') + ' ' + D.PIT_DEFAULT.story;
  const FACTIONS = /\b(amalgamation|cartel|syndicate|family|mob|church|army|militia|company|guild)\b/i;
  ok('no pit story names a faction', !FACTIONS.test(all),
     'who ran the pits is Paolo\'s to rule; this only says the ground was dug');
}

/* ---- 6. ACT 1 IS WHEN THE DIGGING HAPPENED ------------------------------- */
ok('act 3 digs less than act 1 (the digging was ten years ago)',
   dig('desert', dirt, 3).length <= dig('desert', dirt, 1).length);

/* ---- 7. DETERMINISM ------------------------------------------------------ */
{
  const a = JSON.stringify(dig('landfill', dirt));
  const b = JSON.stringify(dig('landfill', dirt));
  ok('the same seed and cell dig the same pit, forever (ONE SEED law)', a === b);
}

/* ---- 8. IT IS ON THE SURFACE HE TAPS ------------------------------------- */
/* VERIFY ON THE REAL SURFACE: the engine being right proves nothing about the
   page. This lane has already been burned by exactly that, twice. */
{
  const world = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  const code = world.replace(/\/\*[\s\S]*?\*\//g, '');
  ok('the shipped world page draws pits', /function pitDraw\(/.test(code) && /pitDraw\(ox,oy\)/.test(code));
  ok('the pits draw UNDER the dead, because bodies lie IN a pit and not beneath it',
     code.indexOf('pitDraw(ox,oy)') < code.indexOf('deadDraw(ox,oy)'));
  ok('pits resolve their legend the same way the dead do, not by a second ruler',
     /deadLegendFor\(m\)/.test(code.slice(code.indexOf('function pitsForCell'),
                                          code.indexOf('function pitsForCell') + 1400)),
     'the first cut asked tileMeta().legend directly, got an EMPTY legend for every district in the running app, and returned zero pits valley-wide while reporting ok');
  ok('the pit pass never generates a district the renderer has not asked for',
     /metaCache/.test(code.slice(code.indexOf('function pitsForCell'),
                                 code.indexOf('function pitsForCell') + 700)));
}

/* ---- 8b. THE EDGE IS A CUT, NOT A STAIRCASE OF BLOCKS (8/11) ------------- */
/* Paolo saw the first pit and the honest note on it was that the tile edges read
   as blocky squares: the tone was flooded per whole cell, so at walking zoom the
   boundary was a staircase of 44 px steps. The module now ships the ellipse
   maths each tile was judged by, and the renderer masks boundary tiles at
   quarter-tile resolution against it. Held here so it cannot quietly regress. */
{
  const geo = cem.filter(p => p.ecc !== undefined);
  ok('every pit tile ships the geometry it was judged by (d/u/v/ecc)',
     geo.length === cem.length && geo.every(p => typeof p.d === 'number' && typeof p.u === 'number'),
     'without it the renderer can only flood whole cells, which is the blocky edge coming back');
  const onEdge = cem.filter(p => p.ecc > 0.5).length;
  ok('boundary tiles know they are on the boundary (' + onEdge + ' of ' + cem.length + ')',
     onEdge > 0 && onEdge < cem.length,
     'if every tile or no tile is an edge, ecc is not measuring anything');

  const world = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  const code = world.replace(/\/\*[\s\S]*?\*\//g, '');
  const draw = code.slice(code.indexOf('function pitDraw'), code.indexOf('function pitDraw') + 2600);
  ok('the shipped page masks the pit edge inside the tile, not just per cell',
     /p\.ecc/.test(draw) && /p\.u/.test(draw) && /p\.v/.test(draw),
     'the renderer is flooding whole cells again');
  ok('a tile deep inside the hole still floods (the mask is for edges only)',
     /p\.ecc\s*<\s*0?\.\d+/.test(draw),
     'masking every tile would cost 16x the fills for no visible gain');
  ok('sub-tile quarters share exact pixel boundaries, so no seam grid shows through',
     /Math\.round\(sx\s*\+\s*\(i2\s*\+\s*1\)\s*\*\s*q\)/.test(draw),
     'rounding the origin and ceil-ing the width leaves gaps, and the ground shows through them as a fine grid over the hole -- the blocky look wearing a finer grid');
}

/* ---- 8c. IT READS AS A HOLE, NOT A STAIN (8/11) -------------------------- */
/* Tone alone said "something happened to this ground" and never said HOLE,
   because nothing in the picture was lit. Two cues, and the ORDER matters:
   ambient occlusion first (a hole sees less sky, so it is dark even at noon),
   the sun's directional cast second. Driving it off the sun alone was tried and
   measured: it read at dawn and vanished at midday, because noon is the
   shortest shadow of the day. */
{
  const world = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  const code = world.replace(/\/\*[\s\S]*?\*\//g, '');
  const i = code.indexOf('function pitShade');
  ok('the shipped page gives a pit depth, not just tone', i > 0);
  const shade = i > 0 ? code.slice(i, i + 1200) : '';
  ok('depth uses the WORLD sun, never a private light of its own',
     /sunVec\(\)/.test(shade),
     'one sun: every cast shadow in this app reads T.min, and a pit must swing with the day like everything else');
  ok('a pit floor is dark even with the sun overhead (ambient occlusion, not just a cast)',
     /ao/.test(shade) && /d\s*<=\s*0\)\s*return\s+ao/.test(shade),
     'sun-only depth reads at dawn and vanishes at noon — measured, then fixed');
  ok('at night a pit casts nothing rather than faking depth',
     /if\(!s\)\s*return\s*0/.test(shade));
  ok('the spoil heap catches light instead of shadow — it is a mound, not a hole',
     /spoil.*return\s*-/.test(shade));
}

/* ---- 9. THE PICTURE EXISTS ----------------------------------------------- */
const shot = path.join(ROOT, 'slices', 'look', 'the-pit-dug.png');
ok('there is a picture of a real dug pit in the LOOK tab', fs.existsSync(shot));
if (fs.existsSync(shot)) {
  ok('and it is a real frame, not a stub (' + (fs.statSync(shot).size / 1024).toFixed(0) + ' KB)',
     fs.statSync(shot).size > 40 * 1024);
}

console.log('\nPITS GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
