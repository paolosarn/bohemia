#!/usr/bin/env node
/* A REAL FOG OF WAR (WORLD 15, 11/22; VAMILY rule 470(c), ask row 703; rule 441; rule 454(a): no words).
   Paolo 11/22: 'a real fog of war where you can't see anything underneath it... if you kill the surveyor then you can see the faint
   map as it is right now that you haven't discovered'. slices/bohemia_the_real_fog.js lays an opaque dead channel over every block he
   has never seen, after the whole frame, until THE SURVEYOR falls; then the faint map shows as before.
     N1 the seam: loaded after the Strat (after the map's own script), wraps render, writes no word
     ON THE PAGE, a stranger's new game (the fog on), demo and alpha, upright and sideways:
     F1 NOTHING UNDER IT: the ground he has never seen is the same pixels by day and by night (the land under it cannot show), at the
        far stop and up close; with the cover off (F6) the same pixels change with the night, so the test bites
     F2 WHERE HE HAS BEEN STAYS: on ground the fog leaves clear (inside what he has seen) the cover's own mask is clear (under a
        twentieth; covered is full), built fresh on the frame's camera (the glass on and off is reported too, within 3 shades; crowds and smoke move between two frames)
     F3 THE SURVEYOR: with THE SURVEYOR fallen in this game the cover lifts and the undiscovered map shows faint (the same pixels as
        the cover off)
     F4 HE WALKS: a real trip of the map's own travel, 6 blocks: the cover under 4 ms a frame on average, rebuilt only as new ground
        comes in (each under 50 ms on this box's software glass with the suite beside it; the map's own ground repaint is 67 to 115), and
        at the end the cover's own mask is clear under his feet and two blocks round him
     F5 THE BENCH: the fog off (bohemia.fog.off, the older gates' valley), no cover
     F6 MUTATION: the cover off, the unseen ground changes with the night (the land shows: what F1 rules out)
     F7 nothing threw
     F8 A PINCH: twelve frames of zoom rebuild the cover at most four times (it is carried, scaled to the new zoom), and once the camera
        holds it is crisp (built on that camera, not a scaled copy), and the frame after builds nothing
   Run: node gates/a_real_fog_of_war_gate.js [node|demo|alpha|demo-up|demo-side|alpha-up|alpha-side] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 400) + ']' : '')); };
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function nodeChecks() {
  const city = read('slices/BOHEMIA_CITY_WORLD.html'), code = read('slices/bohemia_the_real_fog.js').replace(/\/\*[\s\S]*?\*\//g, ''), why = [];
  const iS = city.indexOf('src="bohemia_the_strat.js"'), iF = city.indexOf('src="bohemia_the_real_fog.js"');
  if (!(iF > iS && iS > 0)) why.push('not loaded after the Strat');
  if (!/root\.render = function/.test(code)) why.push('does not wrap render');
  if (!/SURVEYOR/.test(code)) why.push('no surveyor');
  if (/fillText|strokeText|innerHTML|textContent/.test(code)) why.push('writes words');
  ok('N1 the seam: loaded after the map, wraps render, lifts on THE SURVEYOR, no word', !why.length, why.join(', ') || 'all');
}

async function page(alpha, profile) {
  const W = (alpha ? 'the alpha' : 'the demo') + ', ' + (profile === 'phone_landscape' ? 'sideways' : 'upright');
  console.log('\n-- ' + W + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open(Object.assign({ profile, fog: true }, alpha ? { alpha: true } : {}));
  const fr = d.fr, pg = d.page, errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.BohemiaRealFog && typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city' && FOG.ready))) break; await pg.waitForTimeout(500); }
    try { await d.toMap(); } catch (e) {}
    await fr.evaluate(() => { if (typeof MODE !== 'undefined' && MODE !== 'city') { MODE = 'city'; try { updHud(); } catch (e) {} }
      try { loopClose(); } catch (e) {} try { if (window.BohemiaRoadEvents) { BohemiaRoadEvents.close(false); BohemiaRoadEvents.ON = false; } } catch (e) {} try { travelStop(); } catch (e) {} });
    /* a frame drawn now, at one beat, by day or by night, the cover on or off; the samples: blocks under the fog well away from what he
       has seen, and blocks well inside what he has seen, read off the glass */
    const probe = (z) => fr.evaluate((z) => {
      const RF = BohemiaRealFog, beatWas = window.mapArtBeat, nightWas = window.isNight, k = g.canvas.width / CVW;
      setZoomAt(z, CVW / 2, CVH / 2); MAP_GROUND.key = ''; render();
      const dist = (x, y) => { let best = 99; for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) if (fogSeen(x + dx, y + dy) !== fogSeen(x, y)) best = Math.min(best, Math.max(Math.abs(dx), Math.abs(dy))); return best; };
      const pts = { un: [], seen: [] };
      for (let sy = 40; sy < CVH - 40; sy += 23) for (let sx = 10; sx < CVW - 10; sx += 23) {
        const ox0 = MAP_DEPTH.ox, oy0 = MAP_DEPTH.oy, ddx = sx - ox0, ddy = sy - oy0 - TH / 2, c = [Math.round(ddx / TW + ddy / TH), Math.round(ddy / TH - ddx / TW)];   /* the ground under the point (the cover's own reading), never a tall picture's block */ const s = fogSeen(c[0], c[1]), dd = dist(c[0], c[1]); if (dd < 3) continue;
        if (s) { const fu = ddx / TW + ddy / TH, fv = ddy / TH - ddx / TW, i = Math.floor((fu + FOG.K + 0.5) * FOG.S), j = Math.floor((fv + FOG.K + 0.5) * FOG.S);   /* the fog's own edge at this very point, and round it */
          const a = FOG.cv.getContext('2d').getImageData(i - 1, j - 1, 3, 3).data; let clear = true; for (let q = 3; q < a.length; q += 4) if (a[q]) clear = false; if (!clear) continue; }
        (s ? pts.seen : pts.un).push([sx, sy]); }
      const read = () => { const x = g.canvas.getContext('2d'); return { un: pts.un.map(p => Array.from(x.getImageData(Math.round(p[0] * k), Math.round(p[1] * k), 1, 1).data).slice(0, 3).join(',')),
        seen: pts.seen.map(p => Array.from(x.getImageData(Math.round(p[0] * k), Math.round(p[1] * k), 1, 1).data).slice(0, 3).join(',')) }; };
      const frame = (on, night) => { RF.on = on; window.mapArtBeat = () => 4; window.isNight = () => night; MAP_GROUND.key = ''; render(); const r = read(); window.mapArtBeat = beatWas; window.isNight = nightWas; RF.on = true; return r; };
      const onDay = frame(true, false), onNight = frame(true, true), offDay = frame(false, false), offNight = frame(false, true);
      const same = (a, b) => a.filter((v, i) => v === b[i]).length, near = (a, b) => a.filter((v, i) => { const p = v.split(',').map(Number), q = b[i].split(',').map(Number); return Math.max(Math.abs(p[0] - q[0]), Math.abs(p[1] - q[1]), Math.abs(p[2] - q[2])) <= 3; }).length;
      MAP_GROUND.key = ''; RF.at = null; render();
      /* F2 read off the cover itself, built fresh on this camera: its mask is clear on every seen point (a crowd or the smoke moving
         between two frames cannot fool it) */
      const mk = RF.m.getContext('2d'), A = RF.at, seenClear = pts.seen.filter(p => mk.getImageData(Math.floor(p[0] * k / RF.K3) + A.M, Math.floor(p[1] * k / RF.K3) + A.M, 1, 1).data[3] <= 12).length;   /* clear: under a twentieth (the fog's own soft rim, smoothed at a quarter of the glass); covered is 255 */
      return { TW, nUn: pts.un.length, nSeen: pts.seen.length, seenClear, why: RF.last.why, ms: RF.last.ms,
        unOnSame: same(onDay.un, onNight.un), unOffSame: same(offDay.un, offNight.un), seenSame: near(onDay.seen, offDay.seen), unCovered: onDay.un.length - same(onDay.un, offDay.un) };
    }, z);
    const far = await probe(1), near = await probe(4);
    for (const [nm, r] of [['far stop', far], ['up close', near]]) {
      ok(W + ' F1 nothing under it (' + nm + ', a block ' + Math.round(r.TW) + ' px): ' + r.unOnSame + ' of ' + r.nUn + ' unseen points the same by day and by night under the cover',
         r.why === 'hidden' && r.nUn >= (nm === 'far stop' ? 20 : 4) && r.unOnSame === r.nUn, JSON.stringify(r));
      ok(W + ' F6 MUTATION (' + nm + '): the cover off, ' + (r.nUn - r.unOffSame) + ' of ' + r.nUn + ' unseen points change with the night (the land shows)', r.nUn - r.unOffSame >= r.nUn * 0.3, JSON.stringify({ off_same: r.unOffSame, n: r.nUn }));
    }
    ok(W + ' F2 where he has been stays: the cover is clear on ' + near.seenClear + ' of ' + near.nSeen + ' seen points (' + near.seenSame + ' the same on and off within 3 shades, crowds and smoke moving)', near.nSeen >= 3 && near.seenClear === near.nSeen, JSON.stringify({ n: near.nSeen, clear: near.seenClear, same: near.seenSame }));
    /* F4 he walks: the map's own travel to a block 6 off, the walk sampled frame by frame */
    const walk = await fr.evaluate(async () => {
      setZoomAt(3, CVW / 2, CVH / 2); MAP_GROUND.key = ''; render();
      let to = null; for (const [dx, dy] of [[6, 0], [0, 6], [-6, 0], [0, -6], [5, 5], [-5, -5]]) { const x = city.x + dx, y = city.y + dy; if (x > 1 && y > 1 && x < om.n - 2 && y < om.n - 2 && cityWalkable(x, y)) { to = [x, y]; break; } }
      if (!to) return { to: null };
      const was = travelTo(0, 0, to); const ms = []; const t0 = performance.now();
      while (TRAVEL && performance.now() - t0 < 30000) { await new Promise(r => requestAnimationFrame(r)); ms.push(BohemiaRealFog.last.ms); }
      await new Promise(r => setTimeout(r, 400)); MAP_GROUND.key = ''; render();
      /* the cover itself under his feet and two blocks out each way: built fresh on this camera, its mask is clear there (read off the
         cover, so a party walking past between two frames cannot fool it) */
      BohemiaRealFog.at = null; MAP_GROUND.key = ''; render();
      const RF = BohemiaRealFog, k = g.canvas.width / CVW, A = RF.at, mk = RF.m.getContext('2d');
      const spots = [[0, 0], [2, 0], [-2, 0], [0, 2], [0, -2]].filter(q => fogSeen(city.x + q[0], city.y + q[1]));
      const alphas = spots.map(q => { const p = iso(city.x + q[0] + 0.5, city.y + q[1] + 0.5, MAP_DEPTH.ox, MAP_DEPTH.oy); return mk.getImageData(Math.floor(p.sx * k / RF.K3) + A.M, Math.floor(p.sy * k / RF.K3) + A.M, 1, 1).data[3]; });
      const ring = spots;
      return { to, set: !!was, frames: ms.length, max: ms.length ? Math.max.apply(null, ms) : null, mean: ms.length ? Math.round(ms.reduce((a, b) => a + b, 0) / ms.length * 100) / 100 : null, slow: ms.filter(v => v > 4).length, end: [city.x, city.y], seen: fogSeen(city.x, city.y), ring: ring.length, uncovered: ring.length > 0 && alphas.every(v => v === 0), alphas };
    });
    ok(W + ' F4 he walks ' + JSON.stringify(walk.to) + ': ' + walk.frames + ' frames, the cover ' + walk.mean + ' ms a frame (' + walk.slow + ' rebuilt as new ground came in, ' + walk.max + ' ms at most); where he stands and two blocks round him the cover is clear',
       walk.to && walk.frames >= 5 && walk.mean < 4 && walk.max < 50 && walk.slow <= Math.max(2, walk.frames / 4) && walk.seen && walk.uncovered, JSON.stringify(walk));
    /* F8 a pinch: twelve frames of zoom, the cover carried (scaled) and built crisp again when the camera holds */
    const pinch = await fr.evaluate(() => { const ms = [], rb = []; for (let i = 0; i < 12; i++) { setZoomAt(3 + i * 0.12, CVW / 2, CVH / 2); render(); ms.push(BohemiaRealFog.last.ms); rb.push(BohemiaRealFog.last.rebuilt); (window.__RFW = window.__RFW || []).push(BohemiaRealFog.last.because + '@' + Math.round(BohemiaRealFog.last.at[0]) + ',' + Math.round(BohemiaRealFog.last.at[1]) + ' tw' + TW.toFixed(1)); }
      const tw = Date.now() + 200; while (Date.now() < tw) {} render(); const crisp = BohemiaRealFog.last.rebuilt, sharp = !BohemiaRealFog.approx && BohemiaRealFog.last.sc === 1; render(); return { max: Math.max.apply(null, ms), rebuilds: rb.reduce((a, b) => a + b, 0), crisp, sharp, after: BohemiaRealFog.last.rebuilt, why: (window.__RFW || []).slice(0, 6) }; });
    ok(W + ' F8 a pinch: 12 frames of zoom, ' + pinch.rebuilds + ' rebuilt, the cover ' + pinch.max + ' ms at most; crisp once the camera holds (' + (pinch.crisp ? 'built then' : 'already') + ')', pinch.rebuilds <= 4 && pinch.sharp && pinch.after === 0, JSON.stringify(pinch));
    /* F3 the surveyor */
    const sv = await fr.evaluate(() => { const st = BohemiaHisMap.state(), was = st.boss.fallen['THE SURVEYOR']; st.boss.fallen['THE SURVEYOR'] = { day: 1, x: 0, y: 0, gate: true };
      MAP_GROUND.key = ''; render(); const o = { lifted: BohemiaRealFog.lifted(), why: BohemiaRealFog.last.why, drew: BohemiaRealFog.last.drew };
      if (was) st.boss.fallen['THE SURVEYOR'] = was; else delete st.boss.fallen['THE SURVEYOR']; MAP_GROUND.key = ''; render(); o.back = BohemiaRealFog.last.why; return o; });
    ok(W + ' F3 THE SURVEYOR fallen: the cover lifts (' + sv.why + '), the faint map shows; standing again it is hidden (' + sv.back + ')', sv.lifted && sv.drew === 0 && sv.why === 'the surveyor fell' && sv.back === 'hidden', JSON.stringify(sv));
    /* F5 the bench */
    const bench = await fr.evaluate(() => { FOG.on = false; MAP_GROUND.key = ''; render(); const o = { why: BohemiaRealFog.last.why, drew: BohemiaRealFog.last.drew }; FOG.on = true; MAP_GROUND.key = ''; render(); return o; });
    ok(W + ' F5 the bench: the fog off, no cover (' + bench.why + ')', bench.drew === 0 && bench.why === 'the bench', JSON.stringify(bench));
    const st = await fr.evaluate(() => BohemiaRealFog.err);
    ok(W + ' F7 nothing threw', !errs.length && !st, (errs.slice(0, 2).join(' | ') || '') + (st || ''));
  } finally { await d.close(); }
}

(async () => {
  try { nodeChecks(); } catch (e) { ok('the node checks ran', false, String(e.stack || e.message).slice(0, 300)); }
  const only = process.argv[2];
  if (only !== 'node') for (const [alpha, prof] of [[false, 'phone_portrait'], [false, 'phone_landscape'], [true, 'phone_portrait'], [true, 'phone_landscape']]) {
    if ((only === 'demo' && alpha) || (only === 'alpha' && !alpha)) continue;
    const tag = (alpha ? 'alpha' : 'demo') + '-' + (prof === 'phone_landscape' ? 'side' : 'up');
    if (only && /-(up|side)$/.test(only) && only !== tag) continue;
    try { await page(alpha, prof); } catch (e) { ok((alpha ? 'the alpha ' : 'the demo ') + prof + ' ran', false, String(e.stack || e.message).slice(0, 300)); }
  }
  console.log('\nA REAL FOG OF WAR: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
