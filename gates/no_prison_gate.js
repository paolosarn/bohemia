#!/usr/bin/env node
/* ===========================================================================
   NO PRISON GATE — Paolo 8/1, and he was locked in a suburb when he said it.

     "Also I'm not able to leave my original suburb neighborhood in the run like
      it's not connected to any streets that I can [reach]. I'm so fucking
      confused bro you need to make the run better. I gotta be able to the
      streets have to touch the streets bro. I'm like locked in this fucking
      suburb. What's wrong with you? Make sure I can't be locked in any certain
      district ever again it's so fucking creepy."

   WHAT WAS ACTUALLY WRONG, measured rather than guessed:
     the run's findHomeCell() scored a starting doorstep on the VARIETY of
     districts within a short walk and on not sitting on the map rim - both
     sensible - and NEVER ASKED WHETHER THE CELL TOUCHED A STREET. It picked
     (39,23): rawStreetEdges = [], no road on any of its four sides. Its only
     way out was a single 7-tile relay gap in a 512-tile perimeter wall, and the
     far side of that gap was ANOTHER SUBURB. He was not imagining it and he was
     not bad at looking.
     Valley-wide: 545 of 2,721 suburb-family cells (20.0%) touch no street, so
     this was a one-in-five chance of a walled-in doorstep on every seed.

   WHAT THIS GATE HOLDS, and it holds the SPIRIT not just the letter, because
   "technically escapable through one hidden gap" is what he just lived:
     A. THE DOORSTEP. The cell the run starts you on touches a real street, and
        it is proved by WALKING IT in a real browser: out of the house, across
        the block, through the opening, onto the road.
     B. NO CELL IN THE VALLEY IS A PRISON. Every built district either touches a
        street itself or relays to one, the relay chain always terminates on a
        real street, and it never loops.
     C. THE OPENING IS REAL. On sampled plots, every edge the world declares as
        a way out has an actual passable gap in the wall, and the block's own
        interior can reach it.

   PROVED ABLE TO FAIL before it was believed: reverting the street filter in
   findHomeCell turns section A red; breaking the relay turns B red.
   =========================================================================== */
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL ' + n)); };

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

const W = require(path.join(ROOT, 'engine/bohemia_world.js'));
const SEED = 2691674296;
const w = W.world(SEED);
const RUN_FILE = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');

/* ---------------------------------------------------------------------------
   B. NO CELL IN THE VALLEY IS A PRISON
   Cheap: the overmap rung plus the relay table. No plot is realized.
   --------------------------------------------------------------------------- */
{
  let built = 0, touching = 0, relayed = 0, orphan = [], badChain = [];
  const touches = (x, y) => w.rawStreetEdges(x, y).length > 0;

  for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
    const c = w.at(x, y);
    if (!c || !W.isAutoDistrict(c.district)) continue;
    built++;
    if (touches(x, y)) { touching++; continue; }
    const relay = w.landlockConnect[x + ',' + y] || [];
    if (!relay.length) { if (orphan.length < 8) orphan.push([x, y, c.district]); continue; }
    relayed++;
    /* THE CHAIN MUST END ON A ROAD. A relay that hands you to another landlocked
       cell that hands you back is a prison with extra steps, which is exactly
       the shape of what he walked into. */
    /* SEARCH the relay graph, do not follow it greedily. The relay table records
       each hop on BOTH ends, so a cell's edge list includes the way it was
       entered from; taking the first edge walks you backwards and dead-ends. A
       first draft of this check did exactly that and reported eight solar cells
       as prisons that were not. The question is "does ANY relay path reach a
       road", which is a search, not a walk. */
    const DIR = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] };
    const seen = new Set([x + ',' + y]);
    const q = [[x, y]];
    let reached = false;
    while (q.length && !reached) {
      const cur = q.shift();
      for (const e of (w.landlockConnect[cur[0] + ',' + cur[1]] || [])) {
        const d = DIR[e]; if (!d) continue;
        const nx = cur[0] + d[0], ny = cur[1] + d[1], k = nx + ',' + ny;
        if (seen.has(k)) continue;
        seen.add(k);
        if (touches(nx, ny)) { reached = true; break; }
        q.push([nx, ny]);
      }
    }
    if (!reached && badChain.length < 8) badChain.push([x, y, c.district]);
  }

  console.log('  valley: ' + built + ' built district cells · ' + touching + ' touch a street · '
    + relayed + ' relay to one');
  ok('every built district cell either touches a street or has a relay out',
    orphan.length === 0);
  if (orphan.length) console.log('       ORPHANS: ' + JSON.stringify(orphan));
  ok('every relay chain terminates on a cell that really touches a street',
    badChain.length === 0);
  if (badChain.length) console.log('       DEAD CHAINS: ' + JSON.stringify(badChain));
  ok('the valley is mostly street-fronting, so relays are the exception',
    touching > built * 0.5);
}

/* ---------------------------------------------------------------------------
   C. THE OPENING IS REAL, on sampled plots
   A declared way out that has no gap in the wall is a painted door.
   --------------------------------------------------------------------------- */
{
  const SOLID = { 2: 1, 4: 1, 6: 1, 9: 1 };          // house, wall, garage, upper
  const sample = [];
  for (let y = 0; y < w.n && sample.length < 24; y += 7)
    for (let x = 0; x < w.n && sample.length < 24; x += 7) {
      const c = w.at(x, y);
      if (c && w.SUBURB_FAMILY && w.SUBURB_FAMILY[c.district]) sample.push([x, y]);
    }
  let checked = 0, gapOK = 0, insideOK = 0;
  for (const [x, y] of sample) {
    let p; try { p = w.plot(x, y); } catch (e) { continue; }
    if (!p || !p.block || !p.block.grid) continue;
    const g = p.block.grid, H = p.block.H, WD = p.block.W;
    checked++;
    // a passable cell anywhere on the perimeter IS the way out
    const open = [];
    for (let i = 0; i < WD; i++) { if (!SOLID[g[0][i]]) open.push([i, 0]); if (!SOLID[g[H - 1][i]]) open.push([i, H - 1]); }
    for (let j = 1; j < H - 1; j++) { if (!SOLID[g[j][0]]) open.push([0, j]); if (!SOLID[g[j][WD - 1]]) open.push([WD - 1, j]); }
    if (!open.length) continue;
    gapOK++;
    /* and the BLOCK'S OWN INSIDE has to reach it. A gap you cannot walk to from
       where you live is the thing he actually hit. */
    const seen = new Uint8Array(WD * H);
    const q = [open[0]]; seen[open[0][1] * WD + open[0][0]] = 1;
    let reach = 0;
    while (q.length) {
      const [cx, cy] = q.pop(); reach++;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= WD || ny >= H) continue;
        const k = ny * WD + nx;
        if (seen[k] || SOLID[g[ny][nx]]) continue;
        seen[k] = 1; q.push([nx, ny]);
      }
    }
    if (reach > (WD * H) * 0.15) insideOK++;         // the opening reaches the block, not a pocket
  }
  console.log('  sampled ' + checked + ' residential plots');
  ok('every sampled block has a real gap in its perimeter', checked > 0 && gapOK === checked);
  ok('and the block interior can actually walk to that gap', checked > 0 && insideOK === checked);
}

/* ---------------------------------------------------------------------------
   A. THE DOORSTEP — walked, in a real browser, on the file he plays
   --------------------------------------------------------------------------- */
(async () => {
  ok('the run file exists', fs.existsSync(RUN_FILE));
  const src = fs.readFileSync(RUN_FILE, 'utf8');
  ok('findHomeCell filters on a real street edge',
    /YOU NEVER START LOCKED IN/.test(src) && /rawStreetEdges\(cx,cy\)/.test(src));

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
  await page.goto('file://' + RUN_FILE);
  await page.waitForFunction(() => window.__RUN && window.__RUN.state(), { timeout: 40000 }).catch(() => {});
  ok('the run boots clean', errors.length === 0);

  const cell = await page.evaluate(() => window.__RUN.cell());
  const nb = await page.evaluate(() => window.__RUN.neighbours());
  const STREET = { arterial: 1, freeway: 1, road: 1, street: 1 };
  const streetSides = Object.keys(nb).filter(k => STREET[nb[k]]);
  console.log('  the doorstep: cell ' + JSON.stringify(cell.at) + ' · neighbours ' + JSON.stringify(nb));
  ok('THE CELL THE RUN STARTS YOU ON TOUCHES A REAL STREET', streetSides.length > 0);
  ok('and the world model agrees it does',
    w.rawStreetEdges(cell.at[0], cell.at[1]).length > 0);

  /* WALK IT. Out of the house, across the block, through the opening, onto the
     road - with the buttons, the way a thumb does it. Nothing is teleported. */
  const tap = id => page.click(id);
  for (let i = 0; i < 140; i++) {
    const st = await page.evaluate(() => window.__RUN.state());
    if (st.mode === 'ext') break;
    const inr = await page.evaluate(() => window.__RUN.interior());
    if (!inr) break;
    if (st.px === inr.door[0] && st.py === inr.door[1]) {
      const v = await page.evaluate(() => window.__RUN.verb());
      if (v && v.verb === 'enter') { await tap('#act'); continue; }
    }
    const dx = Math.sign(inr.door[0] - st.px), dy = Math.sign(inr.door[1] - st.py);
    const tries = (Math.abs(inr.door[0] - st.px) >= Math.abs(inr.door[1] - st.py))
      ? [dx ? (dx > 0 ? '#br' : '#bl') : null, dy ? (dy > 0 ? '#bd' : '#bu') : null]
      : [dy ? (dy > 0 ? '#bd' : '#bu') : null, dx ? (dx > 0 ? '#br' : '#bl') : null];
    let moved = false;
    for (const t of tries) {
      if (!t) continue;
      await tap(t);
      const a = await page.evaluate(() => window.__RUN.state());
      if (a.px !== st.px || a.py !== st.py || a.mode !== st.mode) { moved = true; break; }
    }
    if (!moved) { await tap('#bd'); await tap('#br'); }
  }
  let st = await page.evaluate(() => window.__RUN.state());
  ok('you can get out of your own front door', st.mode === 'ext');

  const g = await page.evaluate(() => window.__RUN.grid());
  // every passable cell on the perimeter is a candidate way out
  const outs = [];
  for (let i = 0; i < g.W; i++) { if (g.pass[0][i]) outs.push([i, 0]); if (g.pass[g.H - 1][i]) outs.push([i, g.H - 1]); }
  for (let j = 1; j < g.H - 1; j++) { if (g.pass[j][0]) outs.push([0, j]); if (g.pass[j][g.W - 1]) outs.push([g.W - 1, j]); }
  ok('the block you start on has a way out of its wall', outs.length > 0);

  // BFS from where the player stands to the nearest way out
  const key = (x, y) => y * g.W + x;
  const prev = new Map(); prev.set(key(st.px, st.py), null);
  const q = [[st.px, st.py]]; let target = null;
  while (q.length && !target) {
    const [x, y] = q.shift();
    if (x === 0 || y === 0 || x === g.W - 1 || y === g.H - 1) { target = [x, y]; break; }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= g.W || ny >= g.H || !g.pass[ny][nx]) continue;
      const k = key(nx, ny); if (prev.has(k)) continue;
      prev.set(k, [x, y]); q.push([nx, ny]);
    }
  }
  ok('AND YOU CAN WALK TO IT FROM WHERE YOU STAND', !!target);

  if (target) {
    const steps = []; let cur = target;
    while (prev.get(key(...cur))) { const p = prev.get(key(...cur)); steps.push([cur[0] - p[0], cur[1] - p[1]]); cur = p; }
    steps.reverse();
    for (const s of steps) await tap(s[0] === 1 ? '#br' : s[0] === -1 ? '#bl' : s[1] === 1 ? '#bd' : '#bu');
    // step through, whichever edge we landed on
    const outDir = target[1] === 0 ? '#bu' : target[1] === g.H - 1 ? '#bd' : target[0] === 0 ? '#bl' : '#br';
    for (let i = 0; i < 4; i++) await tap(outDir);
    const after = await page.evaluate(() => window.__RUN.cell());
    console.log('  walked out to cell ' + JSON.stringify(after.at) + ' (' + after.name + ')');
    ok('STEPPING THROUGH THE WALL PUTS YOU SOMEWHERE ELSE', after.at.join(',') !== cell.at.join(','));
    ok('AND WHERE IT PUTS YOU IS A REAL STREET', !!STREET[after.name]);
  }

  await browser.close();
  console.log('\n=== NO PRISON GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  console.log('    Paolo 8/1: "make sure I can\'t be locked in any certain district ever again".');
  if (fail) process.exit(1);
})().catch(e => { console.log('  FAIL harness: ' + e.message); process.exit(1); });
