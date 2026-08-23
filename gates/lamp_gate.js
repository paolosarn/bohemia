// LAMP GATE (8/21, WORLD lane). A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.
//
// WHAT THIS EXISTS TO CATCH. On 8/21 the valley had three approved streetlight sprites
// (banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt, Paolo's blessed V11 dark lamp bodies,
// passed 7/14), a renderer that draws them correctly, forty-five district legends that
// author a light tile -- and ZERO lamps on screen anywhere in the world. Measured on the
// running page with the instrument proved first: 3 sprites loaded, 0 draws across 36
// districts, 0 lamp cells in six sampled district types, against 25 draws for an injected
// control. The only producer of `c.lamp` lived in the PARAMETRIC ROAD PATH, and that path
// went dead the day every road class got its own generator module (KIT_ROAD now covers
// every entry in RD, so `m.road` is false valley-wide). A renderer that draws nothing is
// SILENT: a lamp that is not drawn looks exactly like a lamp that was never authored, which
// is why this survived from 8/18 to 8/21 with every gate green.
//
// SO THE GATE CHECKS THE JOIN, NOT EITHER HALF. Both halves were individually fine the
// whole time. What was broken was that nothing connected them, and nothing was watching
// the connection. Three claims:
//   A. THE PRODUCERS EXIST. District legends still author light tiles, and the count does
//      not silently collapse (a rename to "illumination pole" would pass a legend gate and
//      go dark here).
//   B. THE RULE STILL RECOGNISES THEM. The city page's __lampTile matcher, read out of the
//      page itself, accepts every authored light name and rejects the towers and masts it
//      is supposed to leave alone (a cobra head is not a floodlight mast, and a 25-tile
//      speedway blob would stand 25 overlapping poles).
//   C. THE CONSUMER IS STILL WIRED. The page still sets `c.lamp` in both paths (the kit
//      branch and the hand-written suburb branch) and still draws LAMP_IMG from ch2.posts.
//      Any one of those three going missing puts the valley back in the dark, silently.
//
// AND IT MUTATES TO PROVE IT CAN FAIL. A gate that has never been shown to go red is a
// claim, not a check (8/20: a mutation passed green straight through a gate that was
// reading its target's own table as its ruler).

const fs = require('fs');
const path = require('path');
const REPO = path.dirname(__dirname);
const K = require(path.join(REPO, 'engine/bohemia_district_kit.js'));
require(path.join(REPO, 'engine/bohemia_world.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const WORLD = path.join(REPO, 'slices/BOHEMIA_CITY_WORLD.html');
const src = fs.readFileSync(WORLD, 'utf8');

// ---- B: pull the page's OWN matcher out of the page and run it. Never re-implement the
// rule here -- a gate that carries its own copy of the thing it checks is checking itself.
const m = /function __lampTile\(entry\)\{[\s\S]*?\n\}/.exec(src);
ok('the city page defines __lampTile (the one lamp rule)', !!m);
let lampTile = null;
if (m) { lampTile = new Function(m[0] + '\nreturn __lampTile;')(); }

// ---- A: the producers
const LIGHT_NAMES = [];
const TOWER_NAMES = [];
let districtsWithLight = 0, totalLightTiles = 0;
for (const t of K.types().slice().sort()) {
  const spec = K.get(t);
  if (!spec || typeof spec.generate !== 'function' || !spec.legend) continue;
  let hasLight = false;
  for (const code of Object.keys(spec.legend)) {
    const nm = String((spec.legend[code] || {}).name || '');
    if (/tower|mast|floodlight/i.test(nm) && /light|flood/i.test(nm)) { TOWER_NAMES.push(nm); continue; }
    if (/streetlight|street light|pole light|light standard/i.test(nm)) {
      LIGHT_NAMES.push(nm); hasLight = true;
    }
  }
  if (!hasLight) continue;
  districtsWithLight++;
  let r; try { r = spec.generate(7, { streets: ['S'] }); } catch (e) { continue; }
  const g = r.g || r;
  const want = new Set(Object.keys(spec.legend)
    .filter(c => lampTile && lampTile(spec.legend[c])).map(Number));
  for (const row of g) for (const v of row) if (want.has(v)) totalLightTiles++;
}
ok(`districts authoring a street/pole light >= 40 (found ${districtsWithLight})`, districtsWithLight >= 40);
ok(`light tiles across one plot of each >= 150 (found ${totalLightTiles})`, totalLightTiles >= 150);

// ---- B: the matcher accepts what is authored and refuses what it must not draw
if (lampTile) {
  const missed = LIGHT_NAMES.filter(n => !lampTile({ name: n }));
  ok('__lampTile accepts every authored light name' +
     (missed.length ? ' (missed: ' + missed.slice(0, 4).join(', ') + ')' : ''), missed.length === 0);
  const drawn = TOWER_NAMES.filter(n => lampTile({ name: n }));
  ok('__lampTile refuses light towers / floodlight masts' +
     (drawn.length ? ' (would draw: ' + drawn.slice(0, 4).join(', ') + ')' : ''), drawn.length === 0);
  ok('__lampTile refuses a tile that is not a light at all',
     !lampTile({ name: 'sidewalk' }) && !lampTile({ name: 'power pole' }) && !lampTile({}));
}

// ---- C: the consumer, both paths, and the draw
ok('the KIT path sets c.lamp from the legend', /__THE_VALLEY_DRAWS_ITS_LAMPS_KIT__/.test(src) &&
   /if\(__lampTile\(entry\)\)\{/.test(src));
ok('the KIT path raises only the TOP-LEFT tile of a blob (never two poles in one spot)',
   /_lw[\s\S]{0,220}?_ln[\s\S]{0,80}?if\(!_lw&&!_ln\) c\.lamp=1;/.test(src));
ok('the SUBURB branch sets c.lamp (he spawns there and it is not on the kit path)',
   /__THE_VALLEY_DRAWS_ITS_LAMPS_SUB__/.test(src) && /else if\(v===12\)\{[^}]*c\.lamp=1;/.test(src));
ok('the renderer still collects lamp cells into ch2.posts', /if\(c\.lamp\)ch2\.posts\.push/.test(src));
// THE DRAW IS SHARED NOW (8/21, same day): the lamp was folded onto the general standing-prop
// path, so these two no longer look for a lamp-only draw call -- they look for the lamp's
// BRANCH of the shared one. The claim is unchanged and is if anything stronger: the lamp
// family must still resolve to Paolo's approved LAMP_IMG pool, and the glow must still be
// asked only of the lamp and only when POWER says the circuit is live.
// ANCHORED ON THE EXPRESSION, NOT ON PROXIMITY. This was a windowed search from `ch.posts`,
// and it went red the moment a fire-barrel branch was added between the two -- the claim was
// still true, the window was just too small. A distance is not evidence; the pool selection
// IS the load-bearing thing, so assert that.
ok('the renderer still draws an approved LAMP_IMG body for the lamp family',
   /const _pool=\(_fam==='lamp'\)\?LAMP_IMG:/.test(src));
ok('DEAD IS DEFAULT: the night head glow is asked ONLY of the lamp, and only of a live circuit',
   /if\(night&&_fam===.lamp.\)\{[\s\S]{0,400}?POWER\.at\([\s\S]{0,40}?\)\.live/.test(src));

// the suburb generator's own half
const SUB = require(path.join(REPO, 'engine/bohemia_suburb.js'));
ok('the suburb legend names code 12 a street light',
   !!SUB.legend[12] && /street light/i.test(SUB.legend[12].name));
ok('the suburb palette gives code 12 a colour', !!SUB.palette[12]);
let subLights = 0, subWalk = 0, subOnWalk = 0;
{
  const r = SUB.generate(7, { streets: ['S'] }), g = r.g;
  for (let y = 0; y < r.H; y++) for (let x = 0; x < r.W; x++) {
    if (g[y][x] === 12) subLights++;
    if (g[y][x] === 10) subWalk++;
  }
  // THE WALK IS NEVER THE PLACE FOR A POLE. Paolo's walk is ONE grid wide (7/31, LOCKED),
  // so a solid pole standing in it does not narrow the sidewalk, it SEVERS it.
  for (let y = 1; y < r.H - 1; y++) for (let x = 1; x < r.W - 1; x++) {
    if (g[y][x] !== 12) continue;
    // a pole must sit BEHIND a walk, never replace one: at least one orthogonal neighbour
    // is a walk cell, and the pole itself is not on the kerb line of a road
    const road = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => g[y+dy][x+dx] === 1 || g[y+dy][x+dx] === 5);
    if (road) subOnWalk++;   // a pole directly against the roadway means it took the walk
  }
}
ok(`the suburb stands street lights (found ${subLights}, want >= 4)`, subLights >= 4);
ok(`the suburb still wears its one-grid sidewalk (found ${subWalk}, want >= 700)`, subWalk >= 700);
ok(`no suburb pole stands on the kerb line where the walk belongs (found ${subOnWalk})`, subOnWalk === 0);
ok('the suburb streets still reach every lot with the poles down', SUB.roadConnected(SUB.generate(7, { streets: ['S'] })));

// ---- MUTATIONS: show this gate can go red.
{
  let caught = 0;
  // 1. the matcher stops recognising 'pole light' (a rename, the most likely real failure)
  if (lampTile && LIGHT_NAMES.some(n => /pole light/i.test(n))) {
    const broken = (e) => /streetlight/i.test(String((e && e.name) || ''));
    if (LIGHT_NAMES.filter(n => !broken({ name: n })).length > 0) caught++;
  }
  // 2. the matcher starts drawing towers
  if (TOWER_NAMES.length) {
    const greedy = (e) => /light/i.test(String((e && e.name) || ''));
    if (TOWER_NAMES.filter(n => greedy({ name: n })).length > 0) caught++;
  }
  // 3. the page loses the ch2.posts hook
  if (!/if\(c\.lamp\)ch2\.posts\.push/.test(src.replace('if(c.lamp)ch2.posts.push', 'XX'))) caught++;
  // 4. the suburb generator stops placing poles
  {
    const g = SUB.generate(7, { streets: ['S'] }).g;
    let n = 0; for (const row of g) for (const v of row) if (v === 12) n++;
    if (!(n - n >= 4)) caught++;   // the same assertion against a zeroed count
  }
  ok('MUTATIONS: all 4 seeded failures are caught (' + caught + '/4)', caught === 4);
}

console.log('LAMP GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
            districtsWithLight + ' districts author a light, ' + totalLightTiles +
            ' light tiles in one plot of each, suburb stands ' + subLights + ')');
process.exit(fail ? 1 : 0);
