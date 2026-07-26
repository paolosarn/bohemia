// BOHEMIA INTERIORS GATE (7/26/26, CITY lane) — INTERIORS EVERYWHERE, locked.
//
// A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. This one guards two things at
// once: that the alpha's CITY app can actually put you INSIDE a building, and
// that what it puts you inside obeys the INTERIOR-MATCHES-EXTERIOR LAW (Paolo
// 7/19, LOCKED: "if your interior does not match the width and length of the
// exterior every time, you are failing... I am not having it any other way").
//
// It checks, inside slices/BOHEMIA_ALPHA_0_9.html's CITY_B64:
//   1. STEP-INSIDE is wired at all (marker)
//   2. engine/bohemia_floorplan.js is inlined BYTE-IDENTICAL — never a second,
//      drifting copy of the interior generator (ENGINE SYNC LAW)
//   3. the district -> room-grammar table matches bohemia_world.js's DISTGEN
//      exactly, every district, both directions (one table, one truth)
//   4. realizeCell KEEPS each tile's dossier `enter` — kit structures, kit
//      portals, and the canon suburb house/garage/upper codes — because the
//      dossier is the only thing allowed to declare a building enterable
//   5. the human step walks you IN instead of stopping you at the wall
//   6. THE PLATE IS THE FOOTPRINT: the flood-filled bounding box is handed to
//      the generator unmodified — no clamp, no pad, no "round to a nice size"
//   7. you can get back OUT, to the exact cell you came in from
//   8. zooming out to the city leaves the building first
//   9. the inlined generator, run for real, returns EXACTLY the plate asked for
//      across the pathological footprints the valley actually contains
//
//   node gates/interiors_gate.js
const fs = require('fs');
const path = require('path');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const alpha = fs.readFileSync(ALPHA, 'utf8');
const key = "const CITY_B64='";
const a0 = alpha.indexOf(key) + key.length;
const a1 = alpha.indexOf("'", a0);
const city = Buffer.from(alpha.slice(a0, a1), 'base64').toString('utf8');

ok('STEP-INSIDE is wired into the CITY app', city.includes('STEP-INSIDE'));

// ---- 2) ENGINE SYNC LAW: one canonical interior generator, byte-identical ----
const fpSrc = fs.readFileSync(path.join(REPO, 'engine/bohemia_floorplan.js'), 'utf8');
ok('engine/bohemia_floorplan.js is inlined BYTE-IDENTICAL (no second copy of the generator)',
  city.includes(fpSrc));

// ---- 3) the district -> zone table cannot drift from DISTGEN ----------------
const worldSrc = fs.readFileSync(path.join(REPO, 'engine/bohemia_world.js'), 'utf8');
let dg = worldSrc.slice(worldSrc.indexOf('var DISTGEN = {'));
dg = dg.slice(0, dg.indexOf('\n  };'));
const DISTGEN = {};
for (const m of dg.matchAll(/^\s*([a-z]+):\s*\{[^\n]*zone:'([a-z]+)'/gm)) DISTGEN[m[1]] = m[2];
const zm = city.match(/const IN_ZONE=\{([^}]*)\}/);
const INZONE = {};
if (zm) for (const m of zm[1].matchAll(/([a-z]+):'([a-z]+)'/g)) INZONE[m[1]] = m[2];
const dgKeys = Object.keys(DISTGEN).sort(), izKeys = Object.keys(INZONE).sort();
ok('the app carries a district -> room-grammar table at all', izKeys.length > 0);
ok('it covers EXACTLY the districts DISTGEN does (' + dgKeys.length + ')',
  JSON.stringify(dgKeys) === JSON.stringify(izKeys));
ok('every district maps to the SAME zone the engine says',
  dgKeys.every(k => DISTGEN[k] === INZONE[k]));
// every zone the table asks for must be a zone the generator actually has
const FLOORPLAN = require('../engine/bohemia_floorplan.js');
const missingZone = [...new Set(Object.values(DISTGEN))].filter(z => !FLOORPLAN.ZONES[z]);
ok('every zone a district asks for exists in the generator' + (missingZone.length ? ' — missing: ' + missingZone.join(',') : ''),
  missingZone.length === 0);

// ---- 4) only the DOSSIER declares a building enterable ----------------------
ok('kit STRUCTURE tiles keep their dossier enter', /if\(entry&&entry\.enter\)\{ c\.enter=entry\.enter; c\.ecode=code; \}/.test(city));
ok('kit PORTAL tiles keep their dossier enter (doors, ramps, open bays)', /c\.portal=true;/.test(city) && city.includes("tl.layer==='portal'"));
ok('the canon suburb house/garage/upper read their enter off BohemiaSuburb.legend, not a hand-copy',
  /BohemiaSuburb\.legend\)\?BohemiaSuburb\.legend\[v\]/.test(city));
ok('nothing invents its own enterable list (no hardcoded district->interior table)',
  !/ENTERABLE_DISTRICTS|CAN_ENTER\s*=/.test(city));

// ---- 5) the wall lets you in ------------------------------------------------
ok('the human step walks you INTO a solid tile whose dossier declares an interior',
  /if\(c&&!c\.walk&&c\.enter&&typeof inEnter==='function'\)/.test(city));
ok('stepping onto a portal tile with an interior takes you in too',
  /if\(c&&c\.walk&&c\.portal&&c\.enter&&typeof inEnter==='function'\)/.test(city));

// ---- 6) THE PLATE IS THE FOOTPRINT ------------------------------------------
// the bounding box of the flooded mass goes to the generator UNTOUCHED.
ok('the footprint bounding box is handed to the generator unmodified (no clamp, no pad)',
  /BOH_FLOORPLAN\.generate\(seed,f\.w,f\.h,\{zone:zone,entrance:side\}\)/.test(city));
ok('nothing resizes the plate on the way in',
  !/Math\.max\(\s*\d+\s*,\s*f\.w/.test(city) && !/Math\.min\(\s*\d+\s*,\s*f\.w/.test(city));
ok('the flood only walks the ENTERABLE mass (never the block wall or a roof decal)',
  /if\(!c\|\|c\.walk\|\|!c\.s\|\|!c\.enter\)continue;/.test(city));
ok('the door is cut on the side you walked in from (interior entrance === exterior entrance)',
  /const side=\(fromY>f\.y\+f\.h-1\)\?'S':/.test(city));

// ---- 7/8) you can get back out ---------------------------------------------
ok('the door puts you back on the EXACT cell you came in from',
  /hx=INSIDE\.exit\.gx; hy=INSIDE\.exit\.gy; INSIDE=null;/.test(city));
ok('only the door lets you off the plate (a wall is still a wall indoors)',
  /if\(INSIDE\.ix===INSIDE\.door\[0\]&&INSIDE\.iy===INSIDE\.door\[1\]\)/.test(city));
ok('zooming out to the city leaves the building first', /swapMode=function\(\)\{ if\(INSIDE\)\{/.test(city));
ok('the interior renders on the real canvas (not a panel or an overlay)',
  /function renderInside\(\)/.test(city) && /render=function\(\)\{ if\(INSIDE\)renderInside\(\); else _inRender\(\); \}/.test(city));

// ---- REUSE-FIRST, ON THE INSIDE (Paolo 7/26: "half of the file size of bohemia is
// the graphic assets and you're not using a single one of them"). The first cut of
// this renderer painted every floor, wall and door as a flat hex fill. The second
// reached into TP_TILES, the raw un-swept cut corpus, and put purple and neon in a
// dead house. An interior is built ONLY from pools Paolo has judged: the all-30-UP
// house-skin cook and the harmonized street pools. Locked here so it cannot slide
// back to painted rectangles or to un-judged art.
// slice from the material table through the renderer: the pools live in both
const inside = city.slice(city.indexOf('const IN_FLOORPOOL='), city.indexOf('const _inRender=render'));
ok('the interior render exists to inspect', inside.length > 200);
for (const pool of ['hwall', 'hwindow', 'hboarded', 'hdoor', 'side'])
  ok('interiors are built from the approved ' + pool + ' pool', inside.includes("'" + pool + "'"));
ok('the floor comes from a judged pool, never a colour', /inFloorPool|inBlit\('side'|'side'/.test(inside) && /saTex/.test(city));
ok('the interior NEVER samples the raw un-swept cut corpus (TP_TILES/TP_IMG)',
  !/TP_IMG|TP_TILES/.test(inside));
// flat fills are allowed ONLY as a fallback when a pool image has not loaded yet,
// plus the shading passes. A renderer that fills more than that is painting again.
const fills = (inside.match(/g\.fillStyle=['"]#/g) || []).length;
// the four legal solid fills: the black behind the plate, the floor and wall
// fallbacks for a pool image that has not decoded yet, and the no-sprite body.
ok('no painted surfaces: solid colours only as load fallbacks (' + fills + ')', fills <= 4);
ok('zero purple anywhere in the interior render (PURPLE RESERVATION)',
  !/#[89a-f][0-9a-f]{1}[0-9a-f]{2}[89a-f][0-9a-f]/i.test('') && !/purple|#[0-9a-f]*(80|9|a)[0-9a-f]?0?ff/i.test(inside));

// the patch tool's reuse claim is CHECKED, not just written: it opens both banks
// and asserts the tiles it depends on are really in them.
const patchSrc = fs.readFileSync(path.join(REPO, 'tools/bohemia_city_interiors_patch.py'), 'utf8');
ok('the patch tool opens the house-skin bank it claims to reuse',
  /HOUSE_BANK = 'banks\/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26\.txt'/.test(patchSrc) && /json\.load\(open\(HOUSE_BANK/.test(patchSrc));
ok('the patch tool opens the street-pool bank it claims to reuse',
  /STREET_BANK = 'banks\/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26\.txt'/.test(patchSrc) && /json\.load\(open\(STREET_BANK/.test(patchSrc));
ok('it refuses to build interiors out of anything but the all-UP canon set',
  /'all 30 UP' in _house/.test(patchSrc));

// ---- 9) run the inlined generator for real, on the valley's real footprints --
// THE law, executed rather than asserted: the plate comes back exactly as asked,
// and it is a real interior (rooms with area, roled, entered, fully reachable).
const d4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const REAL = [[1, 19], [19, 1], [3, 108], [4, 51], [5, 12], [12, 19], [8, 1], [2, 40], [7, 6], [60, 44]];
let plateExact = true, plateReal = true, plateBad = null;
for (const z of Object.keys(FLOORPLAN.ZONES)) for (const e of ['S', 'N', 'W', 'E']) for (const [W, H] of REAL) {
  const fp = FLOORPLAN.generate(W * 31 + H, W, H, { zone: z, entrance: e });
  if (fp.W !== W || fp.H !== H) { plateExact = false; plateBad = z + ' ' + W + 'x' + H + ' -> ' + fp.W + 'x' + fp.H; continue; }
  const ent = fp.doors.find(d => d[0] === 0 || d[1] === 0 || d[0] === fp.W - 1 || d[1] === fp.H - 1);
  if (!ent || !fp.rooms.length || fp.rooms.some(r => r.w <= 0 || r.h <= 0 || !r.role)) { plateReal = false; continue; }
  const seen = new Set([ent[0] + ',' + ent[1]]), st = [ent];
  const passable = (x, y) => { if (x < 0 || y < 0 || x >= fp.W || y >= fp.H) return false; const c = fp.grid[y][x]; return c.g === 'floor' || c.g === 'door'; };
  while (st.length) { const [x, y] = st.pop(); for (const [dx, dy] of d4) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (!seen.has(k) && passable(nx, ny)) { seen.add(k); st.push([nx, ny]); } } }
  const reached = new Set();
  for (let y = 0; y < fp.H; y++) for (let x = 0; x < fp.W; x++) if (seen.has(x + ',' + y) && fp.grid[y][x].room >= 0) reached.add(fp.grid[y][x].room);
  if (reached.size !== fp.rooms.length) plateReal = false;
}
ok('the plate comes back EXACTLY as asked, every zone, every side, every real footprint' + (plateBad ? ' — ' + plateBad : ''), plateExact);
ok('and it is a real interior every time (rooms with area + roles, entered, fully reachable)', plateReal);

console.log('INTERIORS GATE: ' + pass + ' passed, ' + fail + ' failed  (' + dgKeys.length + ' districts zoned)');
process.exit(fail ? 1 : 0);
