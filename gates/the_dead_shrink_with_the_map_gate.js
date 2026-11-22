#!/usr/bin/env node
/* THE DEAD SHRINK WITH THE MAP (WORLD 15, 11/22; VAMILY rule 476(b), ask row 717; rule 441).
   Paolo 11/22: 'all the other animals I killed, as I zoom out their blood pool is so big when I zoomed out, it's so ugly'.
   slices/bohemia_carcass.js draws a kill and its pool at the MAP's scale (full from a block 72 px, smaller as he pulls out, gone under
   a block 10 px), never at the people's size (which never goes under 0.55 and so stood 60 px wide over 18 px blocks).
     ON THE PAGE (demo and alpha, upright and sideways), one kill laid beside him, the same frame at a block 108, 72, 36 and 18 px:
     S1 NEVER BIGGER: the kill's drawn scale never grows as he pulls out, and from a block 36 px the pool is no wider than a block
     S2 ON THE GLASS: the pixels the kill changes (the frame with it against the frame without) at the far stop are a quarter or less of
        what it changes up close
     S3 FAR OUT IT FADES: at a block 18 px it is faded; under a block 10 px nothing is drawn and no tap answers it
     S4 UP CLOSE AS IT WAS: from a block 72 px the kill is drawn at full size, full colour, and a tap on it is the kill
     S5 nothing threw
   Run: node gates/the_dead_shrink_with_the_map_gate.js [demo|alpha|demo-up|demo-side|alpha-up|alpha-side] */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 400) + ']' : '')); };

async function page(alpha, profile) {
  const W = (alpha ? 'the alpha' : 'the demo') + ', ' + (profile === 'phone_landscape' ? 'sideways' : 'upright');
  console.log('\n-- ' + W + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open(Object.assign({ profile }, alpha ? { alpha: true } : {}));
  const fr = d.fr, pg = d.page, errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.BohemiaCarcass && typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city'))) break; await pg.waitForTimeout(500); }
    try { await d.toMap(); } catch (e) {}
    for (let i = 0; i < 60; i++) { if (await fr.evaluate(() => !!(BohemiaCarcass.ready && BohemiaCarcass.ready()))) break; await pg.waitForTimeout(500); }   /* the kill's tables in */
    const laid = await fr.evaluate(() => { try { loopClose(); } catch (e) {} try { travelStop(); } catch (e) {} BohemiaCarcass.reset();
      const c = BohemiaCarcass.fightHome({ outcome: { dead: 1, bodies: [{ kind: 'american_lion', beast: true, hurt: 0 }], result: 'win', victory: true }, at: { gx: city.x + 1, gy: city.y + 1 } });
      return !!c && C0() > 0; function C0() { return BohemiaCarcass.state().list.length; } });
    if (!laid) { ok(W + ' a kill laid beside him', false, 'the kill was not laid'); return; }
    const rows = [];
    for (const z of [6, 4, 2, 1, 0.5]) {
      await fr.evaluate((z) => { setZoomAt(z, CVW / 2, CVH / 2); panX = 0; panY = 0; MAP_GROUND.key = ''; render(); }, z); await pg.waitForTimeout(900);
      rows.push(await fr.evaluate(() => {
        const C = BohemiaCarcass; if (!C.state().list.length) C.fightHome({ outcome: { dead: 1, bodies: [{ kind: 'american_lion', beast: true, hurt: 0 }], result: 'win', victory: true }, at: { gx: city.x + 1, gy: city.y + 1 } });   /* laid again if anything took it */
        const L = C.state().list[0], k = g.canvas.width / CVW, bw = window.mapArtBeat; window.mapArtBeat = () => 2; if (!L) return { TW: Math.round(TW), lost: true };
        const shot = () => { MAP_GROUND.key = ''; render(); const p = iso(L.at[0], L.at[1], MAP_DEPTH.ox, MAP_DEPTH.oy), cx = p.sx, cy = p.sy + TH / 2, R = 110;
          const x0 = Math.max(0, Math.round((cx - R) * k)), y0 = Math.max(0, Math.round((cy - R) * k)), w = Math.min(g.canvas.width - x0, Math.round(2 * R * k)), h = Math.min(g.canvas.height - y0, Math.round(2 * R * k));
          return w > 0 && h > 0 ? g.canvas.getContext('2d').getImageData(x0, y0, w, h).data : new Uint8ClampedArray(0); };
        const D1 = Object.assign({}, window.__CARCASS_DREW || {}), a = shot(), keep = C.state().list.slice(); C.state().list.length = 0; const b = shot(); keep.forEach(q => C.state().list.push(q)); MAP_GROUND.key = ''; render();
        let diff = 0; for (let i = 0; i < Math.min(a.length, b.length); i += 4) if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 24) diff++;
        diff = Math.round(diff / (k * k));   /* in CSS points, the same on every phone */
        const p = iso(L.at[0], L.at[1], MAP_DEPTH.ox, MAP_DEPTH.oy), tap = C.tap ? (() => { const was = window.__CARCASS_TAP; window.__CARCASS_TAP = null; const hit = !!C.tap(p.sx, p.sy + TH / 2 - 6); const t = window.__CARCASS_TAP; window.__CARCASS_TAP = was; return hit || !!t; })() : null;
        window.mapArtBeat = bw;
        return { TW: Math.round(TW), drew: D1.carcass | 0, scale: D1.scale, alpha: D1.alpha, poolW: Math.round(60 * Math.max(0.55, Math.min(2.2, MAP_PEOPLE_K)) * (D1.scale || 0)), diff, tap };
      }));
    }
    const by = (tw) => rows.find(r => Math.abs(r.TW - tw) <= 1) || {};
    const r108 = by(108), r72 = by(72), r36 = by(36), r18 = by(18), r9 = by(9);
    let grows = false; for (let i = 1; i < rows.length; i++) if ((rows[i].scale || 0) > (rows[i - 1].scale || 0) + 1e-9) grows = true;
    ok(W + ' S1 never bigger: the kill\'s scale ' + rows.map(r => r.TW + 'px:' + r.scale).join(' ') + '; from a block 36 px the pool ' + r36.poolW + ' px against the block ' + r36.TW,
       laid && !grows && r36.poolW <= r36.TW && r18.poolW <= r18.TW, JSON.stringify(rows));
    ok(W + ' S2 on the glass: the kill changes ' + r18.diff + ' points at a block 18 px against ' + r72.diff + ' up close (a quarter or less)', r72.diff > 0 && r18.diff * 4 <= r72.diff, JSON.stringify({ close: r72.diff, far: r18.diff }));
    ok(W + ' S3 far out it fades: at a block 18 px alpha ' + r18.alpha + '; under 10 px nothing drawn (' + r9.drew + ') and no tap (' + r9.tap + ')', r18.alpha < 1 && r18.drew === 1 && r9.TW < 10 && r9.drew === 0 && !r9.tap, JSON.stringify({ r18, r9 }));
    ok(W + ' S4 up close as it was: a block ' + r72.TW + ' px, scale ' + r72.scale + ', alpha ' + r72.alpha + ', a tap on it answers', r72.scale === 1 && r72.alpha === 1 && r108.scale === 1 && r72.tap === true, JSON.stringify({ r72, r108 }));
    ok(W + ' S5 nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  } finally { await d.close(); }
}

(async () => {
  const only = process.argv[2];
  for (const [alpha, prof] of [[false, 'phone_portrait'], [false, 'phone_landscape'], [true, 'phone_portrait'], [true, 'phone_landscape']]) {
    if ((only === 'demo' && alpha) || (only === 'alpha' && !alpha)) continue;
    const tag = (alpha ? 'alpha' : 'demo') + '-' + (prof === 'phone_landscape' ? 'side' : 'up');
    if (only && /-(up|side)$/.test(only) && only !== tag) continue;
    try { await page(alpha, prof); } catch (e) { ok((alpha ? 'the alpha ' : 'the demo ') + prof + ' ran', false, String(e.stack || e.message).slice(0, 300)); }
  }
  console.log('\nTHE DEAD SHRINK WITH THE MAP: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
