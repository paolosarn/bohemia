#!/usr/bin/env node
/* BOHEMIA -- COOK [every 2D asset into 3D] (rule 123, Paolo 10/20): WHAT THE SCREEN DRAWS, BY FAMILY, MEASURED.
   Plays the demo's map through the one driver, wraps drawImage in the map's frame, and sums the screen pixels each
   picture covers, keyed back to the bank family it came from (HERO_SRC district pictures, TP_TILES pack tiles,
   SA_TILES street pieces, PROP_B64 street furniture, SIG_TILES signs, the rig's own renders by url). Then the fight
   (BOHEMIA_FIGHT.html, bare) and the settlement screen (bare) the same way. Prints JSON for the inventory record.
     node tools/bohemia_cook_what_the_screen_draws_flat_10_20_26.js [out.json]
   REFERENCE CHECK (the 9/4 standing duty): nothing is drawn here; it measures the game's own screens. No reference game.
   REUSE CHECK (REUSE-FIRST): the one driver (tools/bohemia_drive_the_demo.js) and its beforeGoto hook, extended by nothing.
   TASTE CHECK: none needed, no pixel is made. */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = process.argv[2] || '/tmp/what_the_screen_draws.json';

const WRAP = () => {
  if (window.__cookTally) return;
  const T = window.__cookTally = {};
  let fam = null, built = 0;
  const build = () => {
    const m = new Map();
    const idx = (bank) => {
      let B; try { B = window.eval(bank); } catch (_e) { return; } if (!B) return;
      const walk = (v, k) => { if (typeof v === 'string') m.set(v.slice(-48), bank + ':' + k);
        else if (Array.isArray(v)) v.forEach(x => walk(x, k));
        else if (v && typeof v === 'object') { if (typeof v.b64 === 'string') m.set(v.b64.slice(-48), bank + ':' + k);
          else for (const kk in v) walk(v[kk], k); } };
      for (const k in B) walk(B[k], k);
    };
    ['HERO_SRC', 'TP_TILES', 'SA_TILES', 'SIG_TILES', 'PROP_B64', 'TF_PROP_B64', 'IN_DOOR_B64', 'DOOR_ANIM', 'JAMB_W', 'JAMB_E', 'FLOOR_B64', 'TF_TILES'].forEach(idx);
    return m;
  };
  const keyOf = (im) => {
    if (!im) return '?';
    if (im.__cookKey) return im.__cookKey;
    const s = im.currentSrc || im.src;
    if (!s) return (im.constructor && im.constructor.name) || '?';
    if (s.startsWith('data:')) {
      let k = fam && fam.get(s.slice(-48));
      if (!k && Date.now() - built > 1500) { fam = build(); built = Date.now(); k = fam.get(s.slice(-48)); }
      return k || ('data:' + (s.length > 4000 ? 'big' : 'small') + ':' + s.length);
    }
    return s.replace(/^https?:\/\/[^/]+\//, '').split('?')[0];
  };
  window.__cookKeyOf = keyOf;
  if (window.createImageBitmap) { const cib = window.createImageBitmap;
    window.createImageBitmap = function (src) { const k = keyOf(src); return cib.apply(this, arguments).then(b => { try { b.__cookKey = k; } catch (_e) {} return b; }); }; }
  const P = CanvasRenderingContext2D.prototype, o = P.drawImage;
  P.drawImage = function (im) {
    try {
      const a = arguments; let w, h;
      if (a.length >= 9) { w = a[7]; h = a[8]; } else if (a.length >= 5) { w = a[3]; h = a[4]; }
      else { w = im.width || im.naturalWidth || 0; h = im.height || im.naturalHeight || 0; }
      const t = this.getTransform(); const sc = Math.abs(t.a * t.d - t.b * t.c);
      const onScreen = this.canvas && this.canvas.isConnected;
      let k = keyOf(im);
      if (k === 'HTMLCanvasElement' || k === 'OffscreenCanvas') { k = '(a canvas)'; }
      else if (this.canvas && !onScreen) { this.canvas.__cookKey = this.canvas.__cookKey || ('(cache of ' + k + ')'); }
      k += onScreen ? '' : ' [into a cache]';
      const e = T[k] || (T[k] = { calls: 0, px: 0 }); e.calls++; e.px += Math.abs(w * h) * sc;
    } catch (_e) {}
    return o.apply(this, arguments);
  };
};
const INIT = '(' + WRAP.toString() + ')();';

(async () => {
  process.chdir(ROOT);
  const res = {};
  /* THE MAP */
  const d = await D.open({ beforeGoto: async (cdp, page) => { await page.context().addInitScript(INIT); } });
  try { await d.toMap(); } catch (e) { console.log('toMap: ' + e.message); }
  res['map boot'] = { tally: await d.fr.evaluate(() => JSON.parse(JSON.stringify(window.__cookTally || {}))) };
  for (const z of ['open', 0.3, 0.55, 0.9]) {
    await d.fr.evaluate((z) => { window.__cookTally && Object.keys(window.__cookTally).forEach(k => delete window.__cookTally[k]);
      if (z !== 'open') { try { const zb = zoomBounds(); CZOOM = Math.min(zb[1], Math.max(zb[0], z)); TW = TW0 * CZOOM; TH = TH0 * CZOOM; } catch (_e) {} }
      for (let i = 0; i < 3; i++) { try { render(); } catch (_e) {} } }, z);
    await d.page.waitForTimeout(900);
    res['map@' + z] = await d.fr.evaluate(() => ({ czoom: typeof CZOOM !== 'undefined' ? CZOOM : null, tally: window.__cookTally }));
    await d.shot(path.join(path.dirname(OUT), 'map_' + z + '.png'));
  }
  await d.close();
  /* THE FIGHT and THE SETTLEMENT, one file each */
  for (const f of (process.env.COOK_MAP_ONLY ? [] : ['BOHEMIA_FIGHT.html', 'BOHEMIA_SETTLEMENT_SCREEN.html', 'BOHEMIA_ROSTER_SCREEN.html'])) {
    process.env.BOHEMIA_DRIVE_FILE = f;
    let b;
    try { b = await D.open({ bare: true, file: f, beforeGoto: async (cdp, page) => { await page.context().addInitScript(INIT); } }); } catch (e) { res[f] = { err: e.message }; continue; }
    await b.page.waitForTimeout(6000);
    res[f] = { tally: await b.page.evaluate(() => window.__cookTally) };
    await b.page.screenshot({ path: path.join(path.dirname(OUT), f.replace('.html', '.png')) });
    await b.close();
  }
  fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
  for (const k in res) {
    const t = (res[k] && res[k].tally) || {};
    const rows = Object.entries(t).sort((a, b) => b[1].px - a[1].px).slice(0, 25);
    console.log('== ' + k + (res[k].czoom ? ' czoom ' + (+res[k].czoom).toFixed(3) : '') + (res[k].err ? ' ERR ' + res[k].err : ''));
    rows.forEach(([n, e]) => console.log('  ' + String(Math.round(e.px)).padStart(10) + ' px ' + String(e.calls).padStart(6) + ' calls  ' + n));
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
