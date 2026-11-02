#!/usr/bin/env node
/* ============================================================================
   THE MAP WALK GLIDES, AND GOES STRAIGHT THROUGH A CROSSING (WORLD 11/2, ask lines 250 and 272).

   PAOLO 10/27: 'if they're coming up to a four-way intersection for them to go all the way to the right they'll go to the north
   street and then go to the east street... they won't go through the intersection when they walk' (250), and 'it feels like nothing
   on the map is gliding... when you're reversing [traversing] on the map it moves block by block at a time... I want things to look
   less choppy' (272).

   MEASURED BEFORE on the demo (records/BOHEMIA_WORLD_ONE_ZOOM_THE_MAP_GLIDES_STRAIGHT_THROUGH_11_2_26.md): of 904 straight-across
   trips at the valley's 226 four-way crossings, 678 went up a side street and over; at the default 1.22x the clock's extra block
   landed 73 to 118 ms after the beat's own and was crossed in that time (a frame speed of 39.6 blocks a second, 75 frames standing
   still mid-journey). Loads the city file itself (no demo boot), so it is quick:
     C1  EVERY STRAIGHT-ACROSS TRIP AT A FOUR-WAY GOES THROUGH THE MIDDLE: three blocks, the middle one the crossing
     C2  EVERY TURN AT A FOUR-WAY GOES THROUGH THE MIDDLE TOO: no diagonal round the corner building
     C3  NO ROUTE CUTS A CORNER, AND NONE WAS LOST: 400 trips across the valley, a tap's route and PLAY's: no corner-cutting step;
         every trip an eight-way search could make, the route makes
     C4  MUTATION: the old search (DIRS order, corners cut) brings the side-street hop back
     G1  THE 1.22x CLOCK, ITS OWN STEP TIMES: a 30-block journey on the real pattern (a block a beat, the extra block 87 ms after
         one): the picture's speed never more than 1.6 times its median, never standing still between the first block and the last,
         no frame (60 a second) past a tenth of a block
     G2  CONTROL: on the same clock the old glide (a block in the gap since the last) lurches past 3 times its median
     G3  TURNED BACK MID-BLOCK, IT TURNS WHERE IT IS: never on toward the old block first, no frame past a tenth of a block
     G4  IT EASES: the first tenth of a second under 60% of its pace, the last under 50%, and it lands on his block
     G5  A FAR JUMP IS A CUT: twelve blocks away, the picture is there on the next frame
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CITY = path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + CITY, { waitUntil: 'load' });
  for (let i = 0; i < 60; i++) { if (await pg.evaluate(() => !!(window.om && om.n && typeof cityRoute === 'function' && typeof glideStep === 'function'))) break; await pg.waitForTimeout(500); }
  const C = await pg.evaluate(() => {
    const n = om.n, W = cityWalkable, out = { n, fourWays: 0, across: 0, acrossMid: 0, turns: 0, turnsMid: 0, ex: null };
    const cut = p => { for (let i = 1; i < p.length; i++) { const dx = p[i][0] - p[i - 1][0], dy = p[i][1] - p[i - 1][1]; if (dx && dy && (!W(p[i - 1][0] + dx, p[i - 1][1]) !== !W(p[i - 1][0], p[i - 1][1] + dy))) return true; } return false; };
    const crossings = [];
    for (let y = 2; y < n - 2; y++) for (let x = 2; x < n - 2; x++) {
      if (!(W(x, y) && W(x - 1, y) && W(x + 1, y) && W(x, y - 1) && W(x, y + 1))) continue;
      if (W(x - 1, y - 1) || W(x + 1, y - 1) || W(x - 1, y + 1) || W(x + 1, y + 1)) continue;
      crossings.push([x, y]);
    }
    out.fourWays = crossings.length;
    const arms = (x, y) => [[x - 1, y], [x, y - 1], [x + 1, y], [x, y + 1]];
    const run = () => { let a = 0, am = 0, t = 0, tm = 0, ex = null;
      for (const [x, y] of crossings) { const A = arms(x, y);
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { if (i === j) continue;
          const p = cityRoute(A[i][0], A[i][1], A[j][0], A[j][1]); if (!p) continue;
          const mid = p.length === 3 && p[1][0] === x && p[1][1] === y;
          if ((i + 2) % 4 === j) { a++; if (mid) am++; else if (!ex) ex = JSON.stringify(p); } else { t++; if (mid) tm++; } } }
      return { a, am, t, tm, ex }; };
    const now = run(); Object.assign(out, { across: now.a, acrossMid: now.am, turns: now.t, turnsMid: now.tm, ex: now.ex });
    /* C3: trips across the valley, seeded */
    let s = 12345; const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const cells = []; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (W(x, y)) cells.push([x, y]);
    const bfs8 = (a, b) => { const seen = new Uint8Array(n * n), q = [a]; seen[a[1] * n + a[0]] = 1;
      for (let h = 0; h < q.length; h++) { const c = q[h]; if (c[0] === b[0] && c[1] === b[1]) return true;
        for (const d of DIRS) { const x = c[0] + d[0], y = c[1] + d[1]; if (x < 0 || y < 0 || x >= n || y >= n || seen[y * n + x] || !W(x, y)) continue; seen[y * n + x] = 1; q.push([x, y]); } } return false; };
    let trips = 0, cuts = 0, lost = 0, playCuts = 0, playTrips = 0;
    for (let k = 0; k < 400; k++) { const a = cells[(rnd() * cells.length) | 0], b = cells[(rnd() * cells.length) | 0]; if (a === b) continue;
      const p = cityRoute(a[0], a[1], b[0], b[1]), can = bfs8(a, b); trips++;
      if (can && !p) lost++; if (p && cut(p)) cuts++;
      if (k % 4 === 0) { try { const r = mapBestRoute(a[0], a[1], { x: b[0], y: b[1] }); if (r && r.path) { playTrips++; if (cut(r.path)) playCuts++; } } catch (e) {} } }
    Object.assign(out, { trips, cuts, lost, playTrips, playCuts });
    /* C4: the old search */
    const ro = ROUTE_ORDER, rc = window.routeCutsCorner;
    window.ROUTE_ORDER = [0, 1, 2, 3, 4, 5, 6, 7]; window.routeCutsCorner = () => false;
    const old = run(); window.ROUTE_ORDER = ro; window.routeCutsCorner = rc;
    out.oldAcross = old.a; out.oldAcrossMid = old.am;
    return out;
  });
  ok('C1 EVERY STRAIGHT-ACROSS TRIP AT A FOUR-WAY GOES THROUGH THE MIDDLE', C.fourWays >= 50 && C.across >= C.fourWays * 4 && C.acrossMid === C.across,
     C.fourWays + ' crossings, ' + C.acrossMid + ' of ' + C.across + ' through the middle' + (C.ex ? ', e.g. ' + C.ex : ''));
  ok('C2 EVERY TURN AT A FOUR-WAY GOES THROUGH THE MIDDLE TOO', C.turns >= C.fourWays * 8 && C.turnsMid === C.turns, C.turnsMid + ' of ' + C.turns + ' turns');
  ok('C3 NO ROUTE CUTS A CORNER, AND NONE WAS LOST', C.trips >= 390 && C.cuts === 0 && C.lost === 0 && C.playTrips >= 50 && C.playCuts === 0,
     C.trips + ' taps, ' + C.cuts + ' cut a corner, ' + C.lost + ' lost; ' + C.playTrips + ' PLAY routes, ' + C.playCuts + ' cut a corner');
  ok('C4 MUTATION: the old search brings the side-street hop back', C.oldAcross > 0 && C.oldAcrossMid < C.oldAcross * 0.75, C.oldAcrossMid + ' of ' + C.oldAcross + ' through the middle with it');

  const Gl = await pg.evaluate(() => {
    const mk = (x, y, t) => ({ tx: x, ty: y, px: x, py: y, q: [], sx: x, sy: y, v: 0, cr: 0, E: BEAT, tl: t, last: -1e9, gap: 0, n: 0, u: 1, jumps: 0, steps: 0 });
    const FR = 1000 / 60;
    /* the clock's own steps at 1.22x: one each beat, and the carried fraction's extra block 87 ms after it (measured on the demo) */
    const sched = []; { let acc = 0, t = 1000; for (let b = 0; b < 26 && sched.length < 30; b++) { sched.push(t); acc += 0.22; if (acc >= 1) { acc -= 1; sched.push(t + 87); } t += 500; } }
    const drive = (law) => { const G = mk(0, 0, 0), E = BEAT / 1.22, pos = []; let k = 0, x = 0, gs = 0, gl = -1e9;
      const old = { fx: 0, tx: 0, t0: 0, dur: BEAT };
      for (let t = 1000; t < sched[sched.length - 1] + 1500; t += FR) {
        while (k < sched.length && sched[k] <= t) { x++; k++;
          if (law === 'new') glideStep(G, x, 0, t, E, 3, k < sched.length);
          else { const u = Math.min(1, (t - old.t0) / old.dur), cur = old.fx + (old.tx - old.fx) * u; old.fx = cur; old.tx = x; old.dur = Math.max(50, Math.min(BEAT, t - gl)); old.t0 = t; gl = t; } }
        let p; if (law === 'new') { glideAdvance(G, t); p = G.px; } else { const u = Math.min(1, (t - old.t0) / old.dur); p = old.fx + (old.tx - old.fx) * u; }
        pos.push([t, p]); }
      const first = sched[0], lastS = sched[sched.length - 1], sp = [], mv = []; let still = 0;
      for (let i = 1; i < pos.length; i++) { const d = pos[i][1] - pos[i - 1][1]; mv.push(Math.abs(d)); if (pos[i][0] > first + 100 && pos[i][0] < lastS) { sp.push(d / FR * 1000); if (Math.abs(d) < 1e-4) still++; } }
      const s = sp.slice().sort((a, b) => a - b), med = s[s.length >> 1];
      return { med, max: s[s.length - 1], ratio: s[s.length - 1] / med, still, maxMove: Math.max.apply(null, mv), end: pos[pos.length - 1][1], blocks: x, pos }; };
    const nw = drive('new'), od = drive('old');
    /* G4: the ease, from the same journey */
    const P = nw.pos, cruise = nw.med, s0 = sched[0], sL = sched[sched.length - 1];
    let firstSp = 0, n1 = 0; for (let i = 1; i < P.length; i++) if (P[i][0] > s0 && P[i][0] <= s0 + 100) { firstSp += (P[i][1] - P[i - 1][1]) / FR * 1000; n1++; }
    let lastI = -1; for (let i = P.length - 1; i > 0; i--) if (P[i][1] - P[i - 1][1] > 1e-4) { lastI = i; break; }
    let lastSp = 0, n2 = 0; for (let i = Math.max(1, lastI - 5); i <= lastI; i++) { lastSp += (P[i][1] - P[i - 1][1]) / FR * 1000; n2++; }
    /* G3: turned back mid-block */
    const G = mk(0, 0, 0); let t = 1000, back = true, maxMv = 0, prev = 0;
    glideStep(G, 1, 0, t, BEAT, 3, true); for (let i = 0; i < 18; i++) { t += FR; glideAdvance(G, t); }
    const mid = G.px; glideStep(G, 0, 0, t, BEAT, 3, true); prev = G.px;
    for (let i = 0; i < 60; i++) { t += FR; glideAdvance(G, t); if (G.px > prev + 1e-9) back = false; maxMv = Math.max(maxMv, Math.abs(G.px - prev)); prev = G.px; }
    /* G5: a far jump */
    const H = mk(5, 5, 0); glideStep(H, 17, 5, 2000, BEAT, 3, false); glideAdvance(H, 2000 + FR);
    return { nw: { med: nw.med, max: nw.max, ratio: nw.ratio, still: nw.still, maxMove: nw.maxMove, end: nw.end, blocks: nw.blocks }, od: { ratio: od.ratio, max: od.max, still: od.still },
      firstFrac: firstSp / n1 / cruise, lastFrac: lastSp / n2 / cruise, mid, back, maxMv, endX: G.px, far: [H.px, H.py], steps: sched.length };
  });
  ok('G1 THE 1.22x CLOCK, ITS OWN STEP TIMES: one steady speed, never standing still, no frame past a tenth of a block',
     Gl.nw.ratio <= 1.6 && Gl.nw.still === 0 && Gl.nw.maxMove <= 0.1 && Math.abs(Gl.nw.end - Gl.nw.blocks) < 1e-6,
     Gl.steps + ' blocks; speed median ' + Gl.nw.med.toFixed(2) + ' blocks/s, top ' + Gl.nw.max.toFixed(2) + ' (x' + Gl.nw.ratio.toFixed(2) + '), ' + Gl.nw.still + ' frames still, largest frame move ' + Gl.nw.maxMove.toFixed(3) + ' block');
  ok('G2 CONTROL: on the same clock the old glide lurches', Gl.od.ratio >= 3, 'top x' + Gl.od.ratio.toFixed(2) + ' its median, ' + Gl.od.still + ' frames still');
  ok('G3 TURNED BACK MID-BLOCK, IT TURNS WHERE IT IS', Gl.mid > 0.2 && Gl.mid < 0.9 && Gl.back && Gl.maxMv <= 0.1 && Math.abs(Gl.endX) < 1e-6,
     'turned at ' + Gl.mid.toFixed(2) + ' of the block, never forward after: ' + Gl.back + ', largest frame move ' + Gl.maxMv.toFixed(3) + ', home at ' + Gl.endX.toFixed(3));
  ok('G4 IT EASES IN AND OUT, AND LANDS ON HIS BLOCK', Gl.firstFrac < 0.6 && Gl.lastFrac < 0.5 && Math.abs(Gl.nw.end - Gl.nw.blocks) < 1e-6,
     'first tenth of a second at ' + Math.round(Gl.firstFrac * 100) + '% of its pace, the last at ' + Math.round(Gl.lastFrac * 100) + '%');
  ok('G5 A FAR JUMP IS A CUT', Gl.far[0] === 17 && Gl.far[1] === 5, 'the picture at ' + Gl.far.join(','));
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | ') || 'none');
  await br.close();
  console.log('\nTHE MAP WALK GLIDES, AND GOES STRAIGHT: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate ran [' + String(e && e.stack || e).slice(0, 300) + ']'); process.exit(1); });
