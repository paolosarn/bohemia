#!/usr/bin/env node
/* ============================================================================
   THE MAP'S STREETS JOIN GATE (WORLD 11/2 round 3, ask line 285, rule 300)

   PAOLO 11/2: 'I want the map graphic city shit to be cleaned up, the freeways look like freeways, the streets transitioning to
   each other properly, better zoomed in.'

   It reads THE PAINTER'S OWN TEXELS, not a list of rules: on the demo, through the one driver, it paints every tile of the valley
   that holds a street (vbCityCore, the same painter the map draws with, asked for its parts) and looks at every edge of every
   street block, in the middle of the edge where the lanes are:
     - a side that JOINS something (another street, the Strip, the freeway it continues, a pass over or under the freeway) must be
       OPEN there: lanes, not a kerb across the mouth;
     - a side that meets ground, a building, water or a freeway with no pass must be CLOSED: a kerb and a sidewalk, never the lanes
       running into it.
   A side that disagrees is a BAD JOIN. And every pass (an arterial on both sides of the freeway) must paint the street in the
   freeway's block (the bridge it goes under, or the deck it goes over); a pass with none is a bad join too.
     J1  ZERO BAD JOINS on the arterials and the Strip (every side of every street block, the whole valley)
     J2  EVERY PASS IS PAINTED: each freeway block an arterial crosses carries the street (over or under), with its shadow
     J3  EVERY PASS HAS ITS RAMPS: the freeway blocks beside a pass carry the ramps down to the street
     J4  MUTATION: the old reading (a street that is not straight drawn as a crossing) puts the bad joins back (so J1 bites)
     J5  THE MAP SHARPENS TO ITS OWN PIXELS (__THE_MAP_SHARPENS_TO_ITS_OWN_PIXELS__): at the phone's closest stop the tiles are 128
         texels a block, one texel to a device pixel or finer; the tiles there hold under 90 MB of pictures (it was 121 to 168 MB)
         and the soft painting under them is not drawn once they cover the glass; the old top step (VB_TILE_TOP off) is 1.78 px a texel
     J6  nothing threw
   node gates/the_map_streets_join_gate.js [--measure]   (--measure prints the counts and passes)
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const MEASURE = process.argv.includes('--measure');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

/* in the page: paint, read, count */
function count(old) {
  const S = 24, N = om.n, NT = Math.ceil(N / VB_TILE), M = VB_TILE_M, n = VB_TILE + 2 * M;
  const ROAD = VB_CLASS.road, BLVD = VB_CLASS.blvd, FW = VB_CLASS.freeway;
  const STRT = c => c === ROAD || c === BLVD || c === FW;
  const P = { top: 3, neon: 12, lampspot: 14, window: 13, edge: 6, row: 11 };
  const KERB = new Set([P.top, P.neon, P.lampspot, P.window]);
  if (old) window.__JOIN_OLD__ = true; else delete window.__JOIN_OLD__;
  const R = { sides: 0, bad: 0, badBy: {}, blocks: 0, badBlocks: 0, passes: 0, passPainted: 0, ramps: 0, rampPainted: 0, tiles: 0, ms: 0, ex: [] };
  const t0 = performance.now();
  for (let ty = 0; ty < NT; ty++) for (let tx = 0; tx < NT; tx++) {
    const inp = vbTileInput(tx, ty, S); let any = false;
    for (let y = M; y < M + VB_TILE && !any; y++) for (let x = M; x < M + VB_TILE; x++) if (STRT(inp.cls[y * n + x])) { any = true; break; }
    if (!any) continue;
    inp.coli = 1; if (old) inp.joinOld = 1;
    const c = vbCityCore(inp), CO = c.coli, PP = c.P; R.tiles++;
    const at = (x, y) => (x < 0 || y < 0 || x >= n || y >= n) ? 255 : inp.cls[y * n + x];
    const pa = (u, v) => { let ci = CO[v * PP + u]; if (ci < 0) return { cl: -1, part: -1 }; ci &= 1023; if (ci >= 512) ci -= 512; return { cl: ci >> 4, part: ci & 15 }; };
    for (let by = M; by < M + VB_TILE; by++) for (let bx = M; bx < M + VB_TILE; bx++) {
      const cl = at(bx, by); if (!STRT(cl)) continue;
      const gx = tx * VB_TILE - M + bx, gy = ty * VB_TILE - M + by;
      if (cl === FW) {   /* the passes and their ramps */
        if (inp.xg && inp.xg[by * n + bx]) { R.passes++;
          let rd = 0; for (let v = 0; v < S; v++) for (let u = 0; u < S; u++) { const q = pa(bx * S + u, by * S + v); if (q.cl === ROAD) rd++; }
          if (rd > S * S * 0.08) R.passPainted++; else if (R.ex.length < 12) R.ex.push('pass ' + gx + ',' + gy + ' road texels ' + rd); }
        const rp = inp.rp ? inp.rp[by * n + bx] : 0;
        if (rp) { R.ramps++;
          /* the outer side: the side across the run that meets no freeway; sample 1.2 units in, 2 and 10 units from the pass */
          const ew = (rp & 10) !== 0, sides = ew ? [[0, -1], [0, 1]] : [[-1, 0], [1, 0]];
          let good = false;
          for (const [sx, sy] of sides) { if (at(bx + sx, by + sy) === FW) continue;
            const lf = (aU) => { const q = S / 12; let u, v;
              const along = (rp & 2) ? S - 1 - aU * q : (rp & 8) ? aU * q : (rp & 1) ? aU * q : S - 1 - aU * q, across = sy < 0 || sx < 0 ? 1.2 * q : S - 1 - 1.2 * q;
              if (ew) { u = along; v = across; } else { u = across; v = along; }
              return c.hs[(by * S + Math.round(v)) * PP + bx * S + Math.round(u)]; };
            const lo = lf(2), hi = lf(10); if (hi > 0 && lo < hi * 0.5) good = true; }
          if (good) R.rampPainted++; else if (R.ex.length < 12) R.ex.push('ramp ' + gx + ',' + gy); }
        continue;
      }
      /* is this block the street's own paint (a town paints its streets its own way: not this gate's) */
      const mid = pa(bx * S + (S >> 1), by * S + (S >> 1)); if (mid.cl !== cl) continue;
      R.blocks++; let blockBad = false;
      const SIDES = [[0, -1, 'N'], [1, 0, 'E'], [0, 1, 'S'], [-1, 0, 'W']];
      for (const [dx, dy, nm] of SIDES) {
        const nc = at(bx + dx, by + dy); if (nc === 255) continue;   /* the valley's edge */
        const joins = vbJoinsTo(inp, bx, by, dx, dy, n);
        /* the edge's middle: from a quarter to three quarters along it, the first texel row in */
        let kerb = 0, tot = 0;
        for (let k = Math.floor(S * 0.3); k < Math.ceil(S * 0.7); k++) {
          const u = dx === 0 ? bx * S + k : (dx > 0 ? bx * S + S - 1 : bx * S), v = dy === 0 ? by * S + k : (dy > 0 ? by * S + S - 1 : by * S);
          const q = pa(u, v); tot++; if (KERB.has(q.part) || q.cl !== cl) kerb++; }
        const closed = kerb / tot > 0.5; R.sides++;
        if (joins === closed) { R.bad++; blockBad = true; const key = (cl === BLVD ? 'strip ' : 'street ') + (joins ? 'kerb across a join' : 'lanes into ' + (nc === FW ? 'the freeway' : 'a block'));
          R.badBy[key] = (R.badBy[key] || 0) + 1; if (R.ex.length < 12) R.ex.push(gx + ',' + gy + ' ' + nm + ' ' + key); }
      }
      if (blockBad) R.badBlocks++;
    }
  }
  delete window.__JOIN_OLD__;
  R.ms = Math.round(performance.now() - t0);
  return R;
}

(async () => {
  const d = await open({ fog: false });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && typeof vbCityCore === 'function' && typeof vbTileInput === 'function'))) break; await page.waitForTimeout(250); }
    const has = await fr.evaluate(() => typeof vbJoinsTo === 'function');
    if (!has) { console.log('  the painter has no join reading yet (vbJoinsTo): nothing to count against'); }
    const now = has ? await fr.evaluate(count, false) : null;
    const old = has ? await fr.evaluate(count, true) : null;
    console.log('  now: ' + JSON.stringify(now));
    console.log('  old: ' + JSON.stringify(old));
    if (!MEASURE) {
      ok('J1 ZERO BAD JOINS on the arterials and the Strip', now && now.bad === 0, now && (now.bad + ' bad of ' + now.sides + ' sides, ' + now.blocks + ' blocks; ' + JSON.stringify(now.badBy)));
      ok('J2 EVERY PASS IS PAINTED (the street over or under the freeway)', now && now.passes > 0 && now.passPainted === now.passes, now && (now.passPainted + ' of ' + now.passes));
      ok('J3 EVERY PASS HAS ITS RAMPS', now && now.ramps > 0 && now.rampPainted === now.ramps, now && (now.rampPainted + ' of ' + now.ramps + ' ramp blocks'));
      ok('J4 MUTATION: the old reading puts the bad joins back', old && old.bad > 50 && old.passPainted === 0, old && (old.bad + ' bad, ' + old.passPainted + ' passes painted'));
      /* J5: the closest stop, the crew beside a pass, every tile landed */
      await fr.evaluate(() => { try { if (typeof SKY !== 'undefined' && SKY) skyExit(); } catch (_e) {} ZGEST.fresh = true; setZoomAt(zoomBounds()[1]); render(); });
      for (let k = 0; k < 90; k++) { await page.waitForTimeout(400); const w = await fr.evaluate(() => (VBT.want | 0) + (VBT.busy ? 1 : 0)); if (k >= 3 && !w) break; }
      const near = await fr.evaluate(() => { const dpr = (typeof CV_DPR === 'number' && CV_DPR) || 1, S = vbTileS(); let pic = 0; VBT.tiles.forEach(t => { if (t.day) pic += t.day.width * t.day.height * 4; if (t.lights) pic += t.lights.width * t.lights.height * 4; });
        const h0 = VBC.hid | 0; render(); render(); const oldS = (VB_TILE_TOP = false, vbTileS()); VB_TILE_TOP = true;
        return { S, px: TW * TH * dpr * dpr / 2 / S / S, oldPx: TW * TH * dpr * dpr / 2 / oldS / oldS, MB: pic / 1e6, hid: (VBC.hid | 0) - h0, dpr }; });
      ok('J5 THE MAP SHARPENS TO ITS OWN PIXELS at the closest stop', near.S === 128 && near.px <= 1.001 && near.MB < 90 && near.hid === 2 && near.oldPx > 1.5,
         near.S + ' texels a block, ' + near.px.toFixed(2) + ' device px a texel (the old top step ' + near.oldPx.toFixed(2) + '), ' + near.MB.toFixed(1) + ' MB of tile pictures, the soft painting skipped ' + near.hid + ' of 2 frames');
      ok('J6 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | ') || 'clean');
    }
  } catch (e) { fail++; console.log('  FAIL threw: ' + String(e && e.stack || e).slice(0, 400)); }
  await d.close();
  console.log('\nTHE MAP\'S STREETS JOIN: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
