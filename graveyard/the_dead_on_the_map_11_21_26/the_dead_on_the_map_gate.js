#!/usr/bin/env node
/* THE DEAD ON THE MAP (WORLD 15, 11/21; VAMILY rule 360, Paolo 11/3: 'we don't see enough corpses even throughout the world...
   billions of people have died', and its amendment the same round: none where people live, simple scenery; ask rows 384 and 394;
   rule 441; rule 454(a): no words).
   slices/bohemia_the_dead_on_the_map.js lays COOK DEAD's thirteen (slices/map_dead/, at the map's scale) on the ground nobody holds,
   up close only, graves only where people live, on ground he has seen, never on a tower's face.
     IN NODE:
     N1 THE DATA: rules.json's every group names only pieces pieces.json has, never one it keeps off the map (the doorway); every
        district it names is the map's; the graves are marked; pieces.json and its pictures in step with the tool
     N2 THE SEAM: the module loads after the house models and draws just before them (one line in vbCityDraw); it writes no word
     ON THE PAGE (demo and alpha, upright and sideways):
     P1 THE VALLEY'S DEAD: hundreds on the valley across many kinds of ground, and the same valley lays the same dead again
     P2 WHERE PEOPLE LIVE: every piece within 2 blocks of a town's ground or a real place is a grave
     P3 FAR: under a block 96 px nothing is drawn
     P4 UP CLOSE, ON THE GLASS: at a block 150 px or more over the thickest stretch of dead, pieces are drawn and the glass inside
        each drawn piece is another picture with them off
     P5 THE FOG: on ground he has not seen, nothing is drawn
     P6 THE COST: the dead's own draw under 3 ms a frame
     P7 MUTATION: the switch off, nothing is drawn
     P8 nothing threw
   Run: node gates/the_dead_on_the_map_gate.js [node|demo|alpha|demo-up|demo-side|alpha-up|alpha-side] */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 400) + ']' : '')); };
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function nodeChecks() {
  const R = JSON.parse(read('slices/map_dead/rules.json')), P = JSON.parse(read('slices/map_dead/pieces.json')).pieces, why = [];
  const never = R.never_on_the_map || [];
  for (const g in R.groups) for (const id in R.groups[g].mix) { if (!P[id]) why.push(g + ' names ' + id); if (never.indexOf(id) >= 0) why.push(g + ' lays ' + id + ' (kept off the map)'); }
  const vm = require('vm'), ctx = { window: {} }; ctx.globalThis = ctx; vm.createContext(ctx); vm.runInContext(read('engine/bohemia_overmap.js'), ctx);
  const O = ctx.BohemiaOvermap || ctx.window.BohemiaOvermap, DIST = O.DISTRICT ? Object.keys(O.DISTRICT).map(k => typeof O.DISTRICT[k] === 'string' ? O.DISTRICT[k] : k) : [];
  const om = O.buildOvermap(1337), seenD = {}; for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) seenD[om.at(x, y).district] = 1;
  for (const d in R.districts) { if (!R.groups[R.districts[d]]) why.push(d + ' -> no group'); if (!seenD[d] && DIST.indexOf(d) < 0) why.push(d + ' is no district of the map'); }
  if (!P.grave_cross || !P.grave_cross.grave || !P.grave_row.grave || P.tarp.grave) why.push('the graves are not marked');
  let step = ''; try { step = cp.execFileSync('python3', [path.join(ROOT, 'tools/bohemia_world15_the_dead_on_the_map.py'), '--check'], { encoding: 'utf8' }).trim(); } catch (e) { step = String(e.stdout || e.message).trim(); }
  if (step !== 'in step') why.push('pictures: ' + step);
  ok('N1 the data: ' + Object.keys(R.groups).length + ' kinds of ground, ' + Object.keys(R.districts).length + ' districts, ' + Object.keys(P).length + ' pieces, the doorway kept off, the graves marked, the pictures in step', !why.length, why.join('; ') || 'all');
  const city = read('slices/BOHEMIA_CITY_WORLD.html'), code = read('slices/bohemia_the_dead_on_the_map.js').replace(/\/\*[\s\S]*?\*\//g, ''), w2 = [];
  const iH = city.indexOf('src="bohemia_map_houses.js"'), iD = city.indexOf('src="bohemia_the_dead_on_the_map.js"');
  if (!(iD > iH && iH > 0)) w2.push('not loaded after the house models');
  const dl = city.indexOf('BohemiaDeadOnTheMap.draw(ox, oy)'), hl = city.indexOf('BohemiaMapHouses.draw(ox, oy)');
  if (!(dl > 0 && hl > dl && hl - dl < 400)) w2.push('not drawn just before the house models');
  if (/fillText|strokeText|innerHTML|textContent/.test(code)) w2.push('writes words');
  ok('N2 the seam: loaded after the house models, drawn just before them, no word', !w2.length, w2.join(', ') || 'all');
}

async function page(alpha, profile) {
  const W = (alpha ? 'the alpha' : 'the demo') + ', ' + (profile === 'phone_landscape' ? 'sideways' : 'upright');
  console.log('\n-- ' + W + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open(Object.assign({ profile }, alpha ? { alpha: true } : {}));
  const fr = d.fr, pg = d.page, errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const settle = (ms) => pg.waitForTimeout(ms || 900);
  try {
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.BohemiaDeadOnTheMap && typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city'))) break; await pg.waitForTimeout(500); }
    try { await d.toMap(); } catch (e) {}
    await fr.evaluate(() => { if (typeof MODE !== 'undefined' && MODE !== 'city') { MODE = 'city'; try { updHud(); } catch (e) {} }
      try { loopClose(); } catch (e) {} try { if (window.BohemiaRoadEvents) { BohemiaRoadEvents.close(false); BohemiaRoadEvents.ON = false; } } catch (e) {} try { travelStop(); } catch (e) {}
      setZoomAt(8, CVW / 2, CVH / 2); panX = 0; panY = 0; render(); });
    for (let i = 0; i < 30; i++) { if (await fr.evaluate(() => BohemiaDeadOnTheMap.ready)) break; await settle(500); }
    const r = await fr.evaluate(() => {
      const D = BohemiaDeadOnTheMap, o = {}, L = D.list(); o.n = L.length; o.groups = [...new Set(L.map(q => q.group))].length;
      D.key = ''; const L2 = D.list(); o.same = JSON.stringify(L) === JSON.stringify(L2);
      /* P2: the town's ground and the real places, measured here the page's own way */
      const R = D.rules.lived_r | 0, bad = [], bs = ctBases() || {}, near = (x, y) => {
        for (const k in bs) { const b = bs[k]; if (!b) continue; const f = townFoot({ name: k, x: b.x | 0, y: b.y | 0 });
          if (f && f.n ? (x >= f.x0 - R && x <= f.x0 + f.n - 1 + R && y >= f.y0 - R && y <= f.y0 + f.n - 1 + R) : Math.max(Math.abs(x - b.x), Math.abs(y - b.y)) <= R + 1) return k; }
        for (const c of (window.BOH_REAL_PLACES && BOH_REAL_PLACES.cellsNow ? BOH_REAL_PLACES.cellsNow() : [])) if (Math.max(Math.abs(x - c.x), Math.abs(y - c.y)) <= R) return c.id;
        return null; };
      let nearN = 0; L.forEach(q => { const w = near(q.x, q.y); if (w) { nearN++; if (!D.pieces[q.id].grave) bad.push(q.id + '@' + q.x + ',' + q.y + ' by ' + w); } });
      o.lived = { near: nearN, bad: bad.slice(0, 4), nbad: bad.length };
      /* the thickest stretch of dead nobody holds, and a road block to stand on there */
      const free = L.filter(q => !q.lived && q.group !== 'freeway'); let best = null, bn = 0;
      free.forEach(q => { const n = free.filter(r => Math.abs(r.x - q.x) <= 2 && Math.abs(r.y - q.y) <= 2).length; if (n > bn) { bn = n; best = q; } });
      let w = null; for (let rr = 0; rr < 5 && !w && best; rr++) for (let dy = -rr; dy <= rr && !w; dy++) for (let dx = -rr; dx <= rr && !w; dx++) if (cityWalkable(best.x + dx, best.y + dy)) w = [best.x + dx, best.y + dy];
      o.at = w; o.bn = bn; if (w) { city.x = w[0]; city.y = w[1]; }
      return o; });
    ok(W + ' P1 the valley\'s dead: ' + r.n + ' pieces on ' + r.groups + ' kinds of ground; the same valley lays the same again', r.n >= 300 && r.groups >= 10 && r.same, JSON.stringify({ n: r.n, groups: r.groups, same: r.same }));
    ok(W + ' P2 where people live: ' + r.lived.near + ' pieces by a town or a place, every one a grave', r.lived.nbad === 0 && r.lived.near > 0, JSON.stringify(r.lived));
    /* P3 far */
    await fr.evaluate(() => { setZoomAt(1, CVW / 2, CVH / 2); panX = 0; panY = 0; render(); }); await settle();
    const far = await fr.evaluate(() => ({ TW, drew: BohemiaDeadOnTheMap.last.drew }));
    ok(W + ' P3 far (a block ' + Math.round(far.TW) + ' px): nothing drawn', far.TW < 96 && far.drew === 0, JSON.stringify(far));
    /* P4 up close: on and off, the glass inside each drawn piece */
    await fr.evaluate(() => { setZoomAt(9, CVW / 2, CVH / 2); panX = 0; panY = 0; render(); }); await settle(1500);
    const grab = () => fr.evaluate(() => { const D = BohemiaDeadOnTheMap, k = cv.width / CVW, x = cv.getContext('2d'), out = [];
      (D.last.on || []).filter(o => o.r[0] >= 0 && o.r[1] >= 0 && o.r[0] + o.r[2] <= CVW && o.r[1] + o.r[3] <= CVH && o.r[2] >= 8).slice(0, 12).forEach(o => {
        const im = x.getImageData(Math.round(o.r[0] * k), Math.round(o.r[1] * k), Math.max(1, Math.round(o.r[2] * k)), Math.max(1, Math.round(o.r[3] * k))).data; let h = 0; for (let i = 0; i < im.length; i += 4) h = (h * 31 + im[i] + im[i + 1] * 7 + im[i + 2] * 13) >>> 0; out.push({ id: o.id, r: o.r, h }); });
      return { TW, drew: D.last.drew, ms: D.last.ms, hidden: D.last.hidden, on: out }; });
    const on1 = await grab();
    await fr.evaluate(() => { BohemiaDeadOnTheMap.on = false; MAP_GROUND.key = ''; render(); }); await settle(1200);
    const off = await fr.evaluate(() => ({ drew: BohemiaDeadOnTheMap.last.drew }));
    const offPix = await fr.evaluate((rects) => { const k = cv.width / CVW, x = cv.getContext('2d'); return rects.map(o => { const im = x.getImageData(Math.round(o.r[0] * k), Math.round(o.r[1] * k), Math.max(1, Math.round(o.r[2] * k)), Math.max(1, Math.round(o.r[3] * k))).data; let h = 0; for (let i = 0; i < im.length; i += 4) h = (h * 31 + im[i] + im[i + 1] * 7 + im[i + 2] * 13) >>> 0; return h; }); }, on1.on);
    await fr.evaluate(() => { BohemiaDeadOnTheMap.on = true; MAP_GROUND.key = ''; render(); }); await settle(900);
    const differ = on1.on.filter((o, i) => o.h !== offPix[i]).length;
    ok(W + ' P4 up close (a block ' + Math.round(on1.TW) + ' px, standing by ' + r.bn + ' dead): ' + on1.drew + ' drawn, ' + differ + ' of ' + on1.on.length + ' on the glass another picture with them off',
       on1.TW >= 150 && on1.drew >= 1 && on1.on.length >= 1 && differ === on1.on.length, JSON.stringify({ drew: on1.drew, hidden: on1.hidden, on: on1.on.map(o => o.id), differ }));
    ok(W + ' P7 MUTATION: the switch off, nothing drawn', off.drew === 0, JSON.stringify(off));
    ok(W + ' P6 the cost: ' + on1.ms + ' ms a frame', on1.ms < 3, JSON.stringify({ ms: on1.ms }));
    /* P5 the fog */
    const fog = await fr.evaluate(() => { const was = window.fogSeen; window.fogSeen = () => false; MAP_GROUND.key = ''; render(); const o = { drew: BohemiaDeadOnTheMap.last.drew, unseen: BohemiaDeadOnTheMap.last.unseen }; window.fogSeen = was; MAP_GROUND.key = ''; render(); return o; });
    ok(W + ' P5 the fog: on ground he has not seen, ' + fog.drew + ' drawn (' + fog.unseen + ' kept dark)', fog.drew === 0 && fog.unseen > 0, JSON.stringify(fog));
    const st = await fr.evaluate(() => BohemiaDeadOnTheMap.err);
    ok(W + ' P8 nothing threw', !errs.length && !st, (errs.slice(0, 2).join(' | ') || '') + (st || ''));
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
  console.log('\nTHE DEAD ON THE MAP: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
