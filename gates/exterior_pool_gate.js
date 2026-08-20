/* ============================================================================
   EXTERIOR POOL GATE (8/5/26) — HIS 8,674 BOUGHT TILES, AND THE ZERO

   THE FINDING, measured with a probe validated against a bank the gates already
   prove ships (control: 33 of 456 ground tiles found live, exactly the known
   curated subset -- so the probe works):

     banks/BOHEMIA_HD_TILE_REPO_part1..4   8,674 purchased HD tiles, 294 packs
     ZERO had ever drawn a pixel in the game.

   And they were not unjudged. banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26 is Paolo's
   Great Sweep -- "every act-1 asset individually judged in context ... THE act-1
   art authority" -- 2,604 judged, 1,927 UP. One lane crossed that sweep with the
   masters and harvested the 465 that belong INDOORS, wired them into rooms, and
   stopped at the front door. NOBODY EVER HARVESTED THE ONES THAT GO OUTSIDE, so
   the entire valley had zero objects standing in it while 812 approved outdoor
   objects sat in banks/.

   That is why the world read empty. It was never a texture problem, and I spent a
   week making texture denser.

   HIS THUMB ALREADY WROTE THE VOCABULARY, and reading the UP/DOWN split IS the
   art direction:
     rocks and stones ......... 100 UP,  0 DOWN   the desert, unanimous
     dead trees and plants ..... 47 UP,  1 DOWN
     trees and nature ........... 0 UP, 23 DOWN   NO LIVING TREES. a dead valley.
     abandoned cars ............ 55 UP,  0 DOWN
     market and outdoor props ... 0 UP, 23 DOWN   a whole pack he killed

   THE BLOCKER THAT KEPT THIS DARK WAS IMAGINARY. The masters are ~96px and the
   art cell is 44, and the no-resample law was read as "art must be cell-sized".
   IT DOES NOT SAY THAT. It says an art pixel is a whole number of screen pixels.
   A 96px prop at the run's own integer zoom step is legal; it just spans about
   two cells, which is what an object that size SHOULD do.

   FOUR FAILURES THIS GATE HOLDS, and three of them already happened:

   1. A DOWN TILE ON HIS SCREEN. He rejected 677 of these by hand. Shipping one
      back is worse than shipping nothing.
   2. AN UNJUDGED TILE TREATED AS UP. Only 2,604 of 8,674 were ever swept.
      Silence is not approval; the other 6,070 stay out.
   3. LOOT RENDERED AS SCENERY. The first cut took 'jars, bottles and items' and
      'survival props' because they were UP 47 and UP 49 -- and put a CAR-SIZED
      GLOWING POTION JAR and a two-metre backpack on a suburban lawn. His verdict
      was not wrong, MY READING OF IT WAS: the sweep says every asset was judged
      IN CONTEXT, and the context for a jar is a shelf. A verdict on an object is
      not a licence to render it at any size.
   4. A PROP THAT BLOCKS. Nothing here may touch passability or occupancy. A
      decorative object that quietly made a cell impassable would break pathing
      across the whole valley and read as a world bug, not an art one.

   AND IT LOOKS AT THE REAL SURFACE (7/18). Two cuts of the placement map matched
   NOTHING because I invented the world's vocabulary twice -- first tile ids
   ('yard_0'), then a prefix ('yard') -- when the dossier actually calls that
   ground "dead-ground (yard)". Source checks passed happily both times. So this
   walks out the front door and counts objects that actually reached the canvas.

     node gates/exterior_pool_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POOL = path.join(ROOT, 'banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt');
const SWEEP = path.join(ROOT, 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt');
const DEV = path.join(ROOT, 'slices/BOHEMIA_RUN_SLICE_7_26_26.html');
const RUN = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

ok('the exterior pool exists', fs.existsSync(POOL));
if (!fs.existsSync(POOL)) { console.log('FAIL: exterior pool gate 0/1'); process.exit(1); }

const pool = JSON.parse(fs.readFileSync(POOL, 'utf8'));
const sweep = JSON.parse(fs.readFileSync(SWEEP, 'utf8'));
const dev = fs.readFileSync(DEV, 'utf8');
const run = fs.readFileSync(RUN, 'utf8');

/* ==== 1. IT IS HIS, AND IT IS UP-ONLY ==================================== */
ok('the pool declares itself UP-ONLY', /UP-ONLY/.test(pool.law || ''));
ok('it names his Great Sweep as the authority',
   /ACT1_CONFIRMED_SET/.test(JSON.stringify(pool.source || {})));
ok('it names his purchased HD masters as the art',
   /HD_TILE_REPO/.test(JSON.stringify(pool.source || {})));

const norm = p => String(p).replace(/^\d+\.\s*/, '').trim().toLowerCase();
const verdict = new Map();
for (const e of sweep.verdicts) verdict.set(norm(e.pack) + '#' + e.idx, e.v);

const all = [];
for (const b of Object.keys(pool.buckets || {})) for (const e of pool.buckets[b]) all.push([b, e]);
ok('the pool actually has tiles in it (' + all.length + ')', all.length >= 60);

const notUp = all.filter(([, e]) => verdict.get(norm(e.pack) + '#' + e.idx) !== 'UP');
ok('EVERY tile carries his UP verdict' +
   (notUp.length ? ' (' + notUp.length + ' do not)' : ''), notUp.length === 0);
const unjudged = all.filter(([, e]) => !verdict.has(norm(e.pack) + '#' + e.idx));
ok('no tile snuck in that he never judged' +
   (unjudged.length ? ' (' + unjudged.length + ')' : ''), unjudged.length === 0);

/* ==== 2. SCENERY, NOT LOOT, NOT FURNITURE, NOT A BODY ==================== */
const packs = [...new Set(all.map(([, e]) => norm(e.pack)))];
const LOOT = /jar|bottle|potion|survival props|loot|weapon|treasure|food|drink|winter/;
const bad = packs.filter(p => LOOT.test(p));
ok('no HAND-SCALE LOOT in the scenery pool' + (bad.length ? ' (' + bad.join(', ') + ')' : ''),
   bad.length === 0);
const INDOOR = /furniture|interior|floor tile|wall tile|roof tile|cobblestone|marble/;
ok('no INDOOR packs (the interior pool owns those)', !packs.some(p => INDOOR.test(p)));
const STORY = /zombie|blood|gore|skeleton|bone|corpse|bodies/;
ok('no BODIES (a body is a story he places, never decoration)',
   !packs.some(p => STORY.test(p)));
/* the ruling that is easiest to lose and most characteristic of this world */
ok('NO LIVING TREES -- he voted that pack down 0 UP / 23 DOWN',
   !packs.some(p => /^trees and nature$/.test(p)));
ok('but the DEAD ones are here, which is the same ruling read correctly',
   packs.some(p => /dead trees/.test(p)));

/* ==== 2b. PURPLE RESERVATION, AND A VERDICT CANNOT LICENCE A LAW ========== */
/* An adversarial render review on 8/7 found PURPLE-AND-WHITE STRIPED MARKET
   AWNINGS standing on railyard ballast IN THE SHIPPED BUILD. Measured: "port
   market" idx 5 and idx 20 are 19.6% and 12%+ purple by opaque pixel, and both
   carry a real Paolo UP verdict. THAT IS NOT A DEFENCE. Purple belongs to the
   Amalgamation alone; purity is a law about the WORLD, not a matter of taste, and
   an UP on an object cannot licence a law breach any more than it licences a
   car-sized potion jar. The cook now measures every tile and drops any that
   carries meaningful purple; this re-derives it so the cook cannot quietly stop. */
ok('the cook enforces PURPLE RESERVATION by measuring pixels, not by trusting a verdict',
   /PURPLE_MAX/.test(fs.readFileSync(path.join(ROOT, 'tools/bohemia_exterior_pool_cook.py'), 'utf8')) &&
   /purple_share/.test(fs.readFileSync(path.join(ROOT, 'tools/bohemia_exterior_pool_cook.py'), 'utf8')));
ok('the two purple market awnings are OUT of the shipped pool',
   !all.some(([, e]) => /port market/.test(norm(e.pack)) && (e.idx === 5 || e.idx === 20)));

/* ==== 3. IT IS CONSUMED, NOT MERELY PRESENT ============================== */
ok('the builder loads the pool', /BOHEMIA_EXTERIOR_POOL/.test(fs.readFileSync(
   path.join(ROOT, 'tools/build_run_slice.js'), 'utf8')));
ok('the builder REFUSES a pool that is not UP-only',
   /is not the UP-only pool/.test(fs.readFileSync(path.join(ROOT, 'tools/build_run_slice.js'), 'utf8')));
ok('EXT_POOL ships in the built run', /var EXT_POOL = \{/.test(run));
const shipped = all.filter(([, e]) => e.b64 && e.b64.length > 200 && run.indexOf(e.b64.slice(40, 160)) >= 0);
ok('his art is really in the run he plays (' + shipped.length + '/' + all.length + ')',
   shipped.length >= all.length * 0.9);

/* ==== 4. INTEGER SCALE, AND A CEILING =================================== */
ok('the blit scale is a whole number', /var z=Math\.max\(1, Math\.round\(CELL\/ART_PX\)\)/.test(run));
ok('it steps DOWN in whole numbers to fit, never to a fraction',
   /while\(z>1 && im\.naturalWidth\*z>lim\) z--/.test(run));
ok('there is a ceiling on how much ground one object may cover',
   /maxCells:\s*[\d.]+/.test(run));

/* ==== 5. IT DECORATES, IT NEVER BLOCKS ================================== */
const propBlock = run.slice(run.indexOf('function propOutside'), run.indexOf('function propOutside') + 1400);
ok('placement never writes to the passability grid', !/passExt\s*=|SOLIDG\[[^\]]+\]\s*=/.test(propBlock));
ok('a prop is never under his own feet', /gx===px&&gy===py/.test(propBlock));
ok('a prop is never inside a building', /sunSolid\(gx,gy\)/.test(propBlock));
ok('a prop is never in a doorway', /doorOf\[gx\+','\+gy\]/.test(propBlock));

/* ==== 6. THE PLACEMENT MAP READS THE WORLD'S REAL NAMES ================= */
/* the bug that cost two cuts: I invented the vocabulary twice and both times the
   source checks passed while nothing drew */
ok('placement matches the dossier name the world actually uses',
   /n\.indexOf\('dead-ground'\)>=0/.test(run));
ok('the driveway is left clear on purpose (a car has to get up it)',
   !/driveway/.test(propBlock) || /driveway/.test(run.slice(run.indexOf('function propSurface'),
     run.indexOf('function propSurface') + 900)) === false);
ok('an unlisted surface gets NOTHING (silence, never a guess)',
   /return null;\s*\}\s*function propOutside/.test(run.replace(/\n/g, '')) ||
   /if\(n\.indexOf\('lot'\)>=0[^)]*\) return 'lot';\s*return null;/.test(run));

/* ========================================================================== */
/* ==== 7. AND OBJECTS ACTUALLY REACH THE CANVAS =========================== */
function bfs(passable, from, to) {
  const H = passable.length, W = passable[0].length, key = (x, y) => x + ',' + y;
  const prev = new Map([[key(from[0], from[1]), null]]);
  const q = [from], D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const [x, y] = q.shift();
    if (x === to[0] && y === to[1]) break;
    for (const [dx, dy] of D) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || !passable[ny][nx]) continue;
      const k = key(nx, ny);
      if (prev.has(k)) continue;
      prev.set(k, [x, y]); q.push([nx, ny]);
    }
  }
  const out = []; let cur = key(to[0], to[1]);
  if (!prev.has(cur)) return out;
  let node = to;
  while (prev.get(cur)) { const p = prev.get(cur); out.unshift([node[0] - p[0], node[1] - p[1]]); node = p; cur = key(p[0], p[1]); }
  return out;
}

(async () => {
  const { chromium } = playwright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + RUN);
  await p.waitForFunction(() => window.__RUN && window.__RUN.state, null, { timeout: 90000 });
  await SETTLE(p, 5000);
  for (let i = 0; i < 3; i++) { await p.mouse.click(195, 620); await SETTLE(p, 700); }
  const home = await p.evaluate(() => {
    const i = window.__RUN.interior(), s = window.__RUN.state();
    if (!i) return null;
    const d = i.door;
    return { pass: i.pass, at: [s.px, s.py], door: d ? (d.x !== undefined ? [d.x, d.y] : [d[0], d[1]]) : null };
  });
  const KEY = { '1,0': 'ArrowRight', '-1,0': 'ArrowLeft', '0,1': 'ArrowDown', '0,-1': 'ArrowUp' };
  if (home && home.door) {
    for (const s of bfs(home.pass, home.at, home.door)) {
      await p.keyboard.press(KEY[s[0] + ',' + s[1]]); await SETTLE(p, 45);
      if ((await p.evaluate(() => window.__RUN.state().mode)) !== 'int') break;
    }
    for (let i = 0; i < 8; i++) {
      const c = await p.evaluate(() => window.__RUN.state());
      if (c.mode !== 'int') break;
      const dx = Math.sign(home.door[0] - c.px), dy = Math.sign(home.door[1] - c.py);
      await p.keyboard.press(dx ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft')
                                : (dy > 0 ? 'ArrowDown' : dy < 0 ? 'ArrowUp' : 'ArrowDown'));
      await SETTLE(p, 520);
    }
  }
  for (let i = 0; i < 9; i++) { await p.keyboard.press('ArrowDown'); await SETTLE(p, 140); }
  await SETTLE(p, 2000);

  const st = await p.evaluate(() => window.__RUN.state());
  ok('the check is OUTSIDE, where the objects are', st.mode !== 'int');

  const loaded = await p.evaluate(() => XP_LOADED);
  ok('his objects decoded in the browser (' + loaded + ')', loaded >= 60);

  const seen = await p.evaluate(() => {
    const s = window.__RUN.state(); let n = 0; const packs = {};
    for (let y = s.py - 9; y <= s.py + 9; y++) for (let x = s.px - 5; x <= s.px + 5; x++) {
      const e = propOutside(x, y);
      if (e) { n++; packs[e.p] = (packs[e.p] || 0) + 1; }
    }
    return { n: n, packs: Object.keys(packs).length };
  });
  ok('objects are standing on the block (' + seen.n + ' in frame, ' + seen.packs + ' packs)',
     seen.n > 0);

  /* THE ONE THAT CANNOT BE FAKED: turning them on has to change the picture */
  const changed = await p.evaluate(() => {
    const c = document.getElementById('cv'), g = c.getContext('2d');
    function shot() {
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let h = 0;
      for (let i = 0; i < d.length; i += 401) h = (h * 31 + d[i]) >>> 0;
      return h;
    }
    PROPS.on = false; draw(); const a = shot();
    PROPS.on = true;  draw(); const b = shot();
    return a !== b;
  });
  ok('turning the objects on CHANGES THE REAL CANVAS', changed);

  /* and nothing became impassable because of a prop */
  const blocked = await p.evaluate(() => {
    const g = window.__RUN.grid(); const s = window.__RUN.state(); let bad = 0;
    for (let y = Math.max(0, s.py - 8); y < Math.min(g.H, s.py + 8); y++)
      for (let x = Math.max(0, s.px - 5); x < Math.min(g.W, s.px + 5); x++)
        if (propOutside(x, y) && !g.pass[y][x] && !sunSolid(x, y)) bad++;
    return bad;
  });
  ok('no prop made a walkable cell impassable (' + blocked + ')', blocked === 0);

  /* ==== 8. EVERY BUILT DISTRICT, NOT JUST THE ONE I STOOD IN =============
     The suburb is the only district a shot can reach (the run always opens at his
     house and gotoCell moves the grids without bringing the renderer up), so this
     asks the game's own propOutside() district by district instead. It is a DATA
     check and it is labelled as one -- see the record for what is measured versus
     what is actually seen.
     IT ALSO HOLDS THE FOUR DELIBERATE BLANKS. crop rows, irrigation, rail track
     and driveways are left bare ON PURPOSE: a crop is the farm's whole point, a
     track has to read as a track, and a car has to get up a driveway. A later
     session "fixing the gap" would be undoing a decision. */
  const byDistrict = await p.evaluate(async () => {
    const out = {};
    for (let cx = 0; cx < 96; cx += 3) for (let cy = 0; cy < 96; cy += 3) {
      try { window.__RUN.gotoCell(cx, cy); } catch (_e) { continue; }
      if (typeof CELLNAME !== 'string' || out[CELLNAME] !== undefined) continue;
      let n = 0, built = 0, never = 0;
      const H = Math.min(SOLIDG.length, 80), W = Math.min(SOLIDG[0].length, 80);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const nm = (NAMEG[y] && NAMEG[y][x]) || '';
        if (nm && nm.indexOf('reserved') < 0) built++;
        if (/crop|irrigation|rail track|driveway/.test(nm.toLowerCase())) {
          never++;
          if (propOutside(x, y)) n = -1e6;      /* poisons the count if ever dressed */
        }
        if (propOutside(x, y)) n++;
      }
      out[CELLNAME] = { props: n, built: built, never: never };
    }
    return out;
  });
  const districts = Object.keys(byDistrict);
  const builtOnes = districts.filter(d => byDistrict[d].built > 200);
  const dressed = builtOnes.filter(d => byDistrict[d].props > 0);
  ok('the audit reached the districts (' + districts.length + ')', districts.length >= 20);
  ok('EVERY BUILT district gets objects (' + dressed.length + '/' + builtOnes.length + ')',
     builtOnes.length > 0 && dressed.length === builtOnes.length);
  const poisoned = builtOnes.filter(d => byDistrict[d].props < 0);
  ok('nothing was placed on a crop row, an irrigation line, a rail track or a driveway' +
     (poisoned.length ? ' (' + poisoned.join(', ') + ')' : ''), poisoned.length === 0);
  console.log('  built districts dressed: ' +
    builtOnes.map(d => d + ':' + byDistrict[d].props).sort().join('  '));
  const bare = districts.filter(d => byDistrict[d].built <= 200);
  if (bare.length) console.log('  NOT BUILT AT ALL (world lane, not art): ' + bare.length +
    ' district types are reserved-landmark ground -- ' + bare.slice(0, 8).join(', '));

  await b.close();
  ok('the run threw nothing with his objects in it' +
     (errs.length ? ' (' + errs.slice(0, 2).join(' | ') + ')' : ''), errs.length === 0);

  console.log((fail ? 'FAIL' : 'PASS') + ': exterior pool gate ' + pass + '/' + (pass + fail));
  process.exit(fail ? 1 : 0);
})();
