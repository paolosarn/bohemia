#!/usr/bin/env node
/* ============================================================================
   WHAT HE SEES NOW GATE (WORLD 8, 11/3/26; ask line 39; rules 151(g), 155(b)). Code: slices/bohemia_map_sight.js.

   PAOLO 10/24: 'you should only be able to see things straight down a street you're near.' On the demo, fog on, through the one
   driver (node gates/what_he_sees_now_gate.js [phone_portrait|phone_landscape|computer]), him stood on a straight street:
     S1 the blocks in his sight are the painting at its own light (each within 10 of the fog-lifted frame)
     S2 the ground he has seen but cannot see from here is dimmer (0.55 to 0.9 of its own light) and keeps the painting's shape
     S3 a roaming party straight down his street is drawn; the same party round the corner is not; one past 4 blocks is not
     S4 at night in the dark his street sight is one block, and the glass follows (fewer blocks at their own light)
     S5 it moves with him: one block along and what is clear moves with him
     S6 MUTATION: the layer off, the remembered ground is its own light again (S2 goes red)
     C1 the layer costs at most 2 ms a frame (the median of 10)
     C2 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

/* in the map's frame: the light of a 5 x 5 patch at a block's middle, in this frame, with the fog lifted (FOG.all), and the list */
const READ = (blocks) => {
  const cx = cv.getContext('2d'), sc = cv.width / CVW, W = cv.width;
  const grab = () => cx.getImageData(0, 0, cv.width, cv.height).data;
  render(); const his = grab(); FOG.all = true; render(); const op = grab(); FOG.all = false; render();
  const L = BohemiaHisMap.last(), out = [];
  const patch = (f, gx, gy) => { let s = 0, c = 0; for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) { const k = ((gy + j) * W + gx + i) * 4; s += 0.299 * f[k] + 0.587 * f[k + 1] + 0.114 * f[k + 2]; c++; } return s / c; };
  for (const b of blocks) { const p = iso(b[0], b[1], L.ox, L.oy), gx = Math.round(p.sx * sc), gy = Math.round((p.sy + TH * 0.5) * sc);
    if (gx < 6 || gy < 6 || gx >= cv.width - 6 || gy >= cv.height - 6) continue; out.push({ b, his: patch(his, gx, gy), open: patch(op, gx, gy) }); }
  return out;
};

async function run(prof) {
  console.log('\n-- ' + prof + ' --');
  const d = await open({ profile: prof, fog: true, engage: true, beforeTap: async (p) => {
    for (let i = 0; i < 120; i++) { if (await p.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => false)) break; await p.waitForTimeout(500); }
    await require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js')).throughTheTitle(p, 60000); } });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaMapSight && FOG.ready).catch(() => false)) break; }
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(1500);
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} });   /* the start's town shut: this gate reads the map only */
  /* him on a straight street of the valley he has seen: a road block with road four blocks both ways along one line, by day */
  const at = await fr.evaluate(() => {
    const N = om.n; let best = null, bd = 1e9;
    for (let y = 6; y < N - 6; y++) for (let x = 6; x < N - 6; x++) { if (!sightRoad(x, y)) continue;
      for (const [ax, ay] of [[1, 0], [0, 1]]) { let run = true; for (let k = -5; k <= 5 && run; k++) if (!sightRoad(x + ax * k, y + ay * k)) run = false;
        if (!run || sightRoad(x + ay, y + ax) || sightRoad(x - ay, y - ax)) continue;   /* a straight stretch, buildings either side */
        const dd = Math.abs(x - city.x) + Math.abs(y - city.y); if (dd < bd) { bd = dd; best = { x, y, ax, ay }; } } }
    if (!best) return null;
    try { travelStop(); } catch (e) {}
    city.x = best.x; city.y = best.y; CITY_GLIDE.tx = null;
    fogClear(best.x, best.y, 9);   /* he has walked here before (the fog's own clearing) */
    window.__W8NIGHT = window.isNight; isNight = () => false;   /* by day */
    setZoomAt(1); panX = 0; panY = 0; try { camHold(); } catch (e) {} BohemiaMapSight.rebuild(); render(); return best; });
  if (!at) { ok('the gate found a straight street', false, 'none'); await d.close(); return; }
  await page.waitForTimeout(600);
  const blocks = await fr.evaluate((a) => { const S = [], R = [];
    for (let y = a.y - 6; y <= a.y + 6; y++) for (let x = a.x - 6; x <= a.x + 6; x++) { const dd = Math.max(Math.abs(x - a.x), Math.abs(y - a.y)); if (dd < 2) continue;
      if (mapSees(x, y)) S.push([x, y]); else if (dd <= 5 && !mapSees(x - 1, y) && !mapSees(x + 1, y) && !mapSees(x, y - 1) && !mapSees(x, y + 1)) R.push([x, y]); }
    return { S, R }; }, at);
  const r1 = await fr.evaluate(READ, blocks.S), r2 = await fr.evaluate(READ, blocks.R);
  const s1 = r1.filter(q => Math.abs(q.his - q.open) <= 10).length;
  /* a walker or a plate the fog-lifted frame draws and his does not can stand on one patch: four in five, and the middle one exact */
  const dif = r1.map(q => Math.round(q.his - q.open)), md = dif.map(Math.abs).sort((a, b) => a - b)[dif.length >> 1];
  ok('S1 ' + prof + ': the blocks in his sight are the painting at its own light', r1.length >= 3 && s1 >= Math.ceil(r1.length * 0.8) && md <= 3, s1 + ' of ' + r1.length + ' in sight within 10 (light off by ' + dif.join(',') + '; down the street at ' + at.x + ',' + at.y + ')');
  const ratio = (r) => { const v = r.filter(q => q.open > 8).map(q => q.his / q.open).sort((a, b) => a - b); return v.length ? v[v.length >> 1] : 0; };
  const corr = (r) => { const a = r.map(q => q.his), b = r.map(q => q.open), n = a.length; if (n < 3) return 0; const ma = a.reduce((s, v) => s + v, 0) / n, mb = b.reduce((s, v) => s + v, 0) / n; let ab = 0, aa = 0, bb = 0; for (let i = 0; i < n; i++) { ab += (a[i] - ma) * (b[i] - mb); aa += (a[i] - ma) ** 2; bb += (b[i] - mb) ** 2; } return aa && bb ? ab / Math.sqrt(aa * bb) : 0; };
  const k2 = ratio(r2), c2 = corr(r2);
  ok('S2 ' + prof + ': the ground he remembers but cannot see from here is dimmer and keeps its shape', r2.length >= 8 && k2 >= 0.55 && k2 <= 0.9 && c2 >= 0.8, r2.length + ' remembered blocks at ' + k2.toFixed(2) + ' of their own light, the shape following ' + c2.toFixed(2));
  /* S3: one party, placed */
  const S3 = await fr.evaluate((a) => {
    const P = (partiesAll() || [])[0]; if (!P) return null;
    const keep = partiesAll, one = { ...P, id: 'gate8', from: null, arrived: true, at: { x: 0, y: 0 } };
    partiesAll = () => [one];
    const drawnAt = (x, y) => { one.at = { x, y }; MAP_GROUND.key = ''; render(); return { drawn: !(MAP_DREW.unseen | 0) && (MAP_DREW.parties | 0) > 0, sees: mapSees(x, y) }; };
    const down = drawnAt(a.x + a.ax * 3, a.y + a.ay * 3), corner = drawnAt(a.x + a.ax * 3 + a.ay * 2, a.y + a.ay * 3 + a.ax * 2), far = drawnAt(a.x + a.ax * 6, a.y + a.ay * 6);
    partiesAll = keep; render(); return { down, corner, far }; }, at);
  ok('S3 ' + prof + ': a party straight down his street is drawn, round the corner it is not, past four blocks it is not', !!S3 && S3.down.drawn && !S3.corner.drawn && !S3.far.drawn,
     S3 ? 'down the street (3 blocks) ' + S3.down.drawn + ', round the corner ' + S3.corner.drawn + ', 6 blocks down ' + S3.far.drawn : 'no party in the valley');
  /* S4: night, in the dark */
  const S4 = await fr.evaluate((a) => { const day = BohemiaMapSight.seenNow().length; isNight = () => true; const keepLit = window.sightLit; sightLit = () => false; BohemiaMapSight.rebuild(); render();
    const night = BohemiaMapSight.seenNow().length, ins = BohemiaMapSight.last.inSight; sightLit = keepLit; isNight = () => false; BohemiaMapSight.rebuild(); render(); return { day, night, ins }; }, at);
  ok('S4 ' + prof + ': at night in the dark his street sight shrinks, and the glass follows', S4.night < S4.day && S4.ins === S4.night, S4.day + ' blocks in sight by day, ' + S4.night + ' at night in the dark (the layer cut ' + S4.ins + ')');
  /* S5: one block along */
  const S5 = await fr.evaluate((a) => { const k0 = BohemiaMapSight.last.key, s0 = JSON.stringify(BohemiaMapSight.seenNow()); city.x += a.ax; city.y += a.ay; CITY_GLIDE.tx = null; render();
    const k1 = BohemiaMapSight.last.key, s1 = JSON.stringify(BohemiaMapSight.seenNow()); city.x -= a.ax; city.y -= a.ay; CITY_GLIDE.tx = null; render(); return { moved: k0 !== k1, changed: s0 !== s1 }; }, at);
  ok('S5 ' + prof + ': it moves with him', S5.moved && S5.changed, 'one block along: the layer rebuilt ' + S5.moved + ', what is clear changed ' + S5.changed);
  /* S6: the mutation */
  await fr.evaluate(() => { BohemiaMapSight.V.on = false; });
  const m6 = await fr.evaluate(READ, blocks.R);
  await fr.evaluate(() => { BohemiaMapSight.V.on = true; render(); });
  const k6 = ratio(m6);
  ok('S6 ' + prof + ': MUTATION: the layer off, the remembered ground is its own light (S2 red)', k6 > 0.9, 'the remembered ground at ' + k6.toFixed(2) + ' of its own light with the layer off');
  const C = await fr.evaluate(() => { const t = []; for (let i = 0; i < 10; i++) { const t0 = performance.now(); BohemiaMapSight.draw(BohemiaHisMap.last().ox, BohemiaHisMap.last().oy); t.push(performance.now() - t0); } t.sort((a, b) => a - b); return t[5]; });
  ok('C1 ' + prof + ': the layer costs at most 2 ms a frame', C <= 2, C.toFixed(2) + ' ms');
  await fr.evaluate(() => { if (window.__W8NIGHT) isNight = window.__W8NIGHT; });
  ok('C2 ' + prof + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 2).join(' | '));
  if (process.env.SIGHT_SHOTS) { try { await d.shot(path.join(process.env.SIGHT_SHOTS, prof + '_sight.png')); } catch (e) {} }
  await d.close().catch(() => {});
}

(async () => {
  const want = process.argv[2];
  const profiles = want ? [want] : ['phone_portrait', 'computer'];
  for (const p of profiles) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nWHAT HE SEES NOW: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
