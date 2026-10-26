#!/usr/bin/env node
/* ============================================================================
   NO NAME COVERS ANOTHER GATE (RUN 10/26, row [eyes: names on names], rule 150; his first votes' 'no two texts overlap').

   EYES round 2 (BUILD 10/24t, phone): at 0.375 to 0.456 'GYPSUM CAVE' sits over 'FRENCHMAN MOUNTAIN' with the 95 shield over
   both; at 0.141 'CHURCH' is cut by 'BLUE DIAMOND', 'BOULDER CITY' by a road shield, 'SHEEP R' by 'GAS PEAK', 'TULE SPRINGS'
   over 'CHARLESTON', 'GLEN' and 'MO' cut by the phone.
   MEASURED BEFORE (every text the map draws in one frame, the phone): 4, 7, 1 and 2 pairs over each other at the far stop, 0.141,
   0.375 and 0.456, and MOAPA, GLENDALE, SHEEP RANGE, APEX, SANDY VALLEY under the phone.

   On the demo, through the one driver, the phone and the computer (node gates/no_name_covers_another_gate.js [profile]):
     N1 at the far stop, 0.141, 0.375, 0.456, the opening zoom and a block 43 px no two names on the glass lie over each other
        (every text the map draws in the frame, read off the canvas's own calls; a name's own shadow is not another name)
     N2 no name lies under the phone, the bar or the speed pad (what the finger would touch there is not the map)
     N3 the names still stand: at the far zooms at least two thirds of the names the map drew with the list off
     N4 MUTATION: the list off, N1 goes red
     N5 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const ZOOMS = ['far', 0.141, 0.375, 0.456, 1, 2.4];

async function read(fr, z) {
  return fr.evaluate((z) => {
    const zb = zoomBounds(); if (z !== 'far' && z < zb[0] + 0.01) return null;   /* under this screen's far stop (a wide screen's is 0.396): a pinch past it is the sky */
    setZoomAt(z === 'far' ? zb[0] : z); panX = 0; panY = 0; render();
    const got = [], ft = g.fillText;
    g.fillText = function (t, x, y) { try { const m = this.measureText(t), al = this.textAlign, bl = this.textBaseline, fs = parseFloat((this.font.match(/(\d+(\.\d+)?)px/) || [0, 9])[1]);
        const x0 = al === 'center' ? x - m.width / 2 : al === 'right' || al === 'end' ? x - m.width : x, y0 = bl === 'middle' ? y - fs / 2 : bl === 'top' ? y : y - fs * 0.8;
        const tr = this.getTransform(), k = CV_DPR || 1; got.push({ t: String(t), b: [(x0 * tr.a + tr.e) / k, (y0 * tr.d + tr.f) / k, m.width * tr.a / k, fs * tr.d / k] }); } catch (e) {}
      return ft.apply(this, arguments); };
    try { render(); } finally { g.fillText = ft; }
    const names = got.filter(o => o.t.trim().length > 1 && o.b[0] + o.b[2] > 0 && o.b[1] + o.b[3] > 0 && o.b[0] < CVW && o.b[1] < CVH);
    const ov = [];
    for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) { const a = names[i].b, b = names[j].b;
      if (names[i].t === names[j].t && Math.abs(a[0] - b[0]) < 3 && Math.abs(a[1] - b[1]) < 3) continue;
      if (a[0] < b[0] + b[2] - 1 && a[0] + a[2] > b[0] + 1 && a[1] < b[1] + b[3] - 1 && a[1] + a[3] > b[1] + 1) ov.push(names[i].t.replace(/\s+/g, ' ').replace(/(\S) (?=\S( |$))/g, '$1') + ' / ' + names[j].t.replace(/\s+/g, ' ').replace(/(\S) (?=\S( |$))/g, '$1')); }
    const c = cv.getBoundingClientRect(), under = names.filter(o => [[o.b[0] + 1, o.b[1] + o.b[3] / 2], [o.b[0] + o.b[2] - 1, o.b[1] + o.b[3] / 2], [o.b[0] + o.b[2] / 2, o.b[1] + o.b[3] / 2]]
      .some(q => { const e = document.elementFromPoint(c.left + q[0], c.top + q[1]); if (e && e.id !== 'cv') return true;
        /* UI TWO's phone is drawn by the shell over this frame (rule 213): its rectangle, in this frame's pixels */
        const R = window.BOH_PHONE_RECT ? BOH_PHONE_RECT() : null; return !!(R && R.on !== false && R.width > 2 && c.left + q[0] > R.left && c.left + q[0] < R.right && c.top + q[1] > R.top && c.top + q[1] < R.bottom); })).map(o => o.t);
    const uniq = new Set(names.map(o => o.t)).size;
    return { z, cz: Math.round(CZOOM * 1000) / 1000, n: uniq, ov, under };
  }, z);
}

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const d = await open({ profile, fog: false });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.VBC && VBC.day && om && om.n && window.MAP_NAMES && window.BOH_REGION && BOH_REGION.ready && typeof MAP_DREW !== 'undefined' && MAP_DREW.you))) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(2500);
  const on = [], off = [];
  for (const z of ZOOMS) { const r = await read(fr, z); if (r) on.push(r); }
  await fr.evaluate(() => { MAP_NAMES.on = false; });
  for (const z of ZOOMS) { const r = await read(fr, z); if (r) off.push(r); }
  await fr.evaluate(() => { MAP_NAMES.on = true; render(); });
  const bad = on.filter(r => r.ov.length);
  ok('N1 at every zoom no two names on the glass lie over each other', bad.length === 0,
     on.map(r => r.cz + ': ' + r.n + ' names, ' + r.ov.length + ' over another').join('; ') + (bad.length ? ' | ' + bad[0].ov.slice(0, 3).join(', ') : ''));
  const und = on.filter(r => r.under.length);
  ok('N2 no name under the phone, the bar or the speed pad', und.length === 0, und.length ? und.map(r => r.cz + ': ' + r.under.slice(0, 4).join(', ')).join('; ') : 'none');
  const far = on.filter(r => r.cz < 0.9), keep = far.map((r, i) => r.n / Math.max(1, off[i].n));
  ok('N3 the names still stand: at the far zooms at least two thirds of what the map drew with the list off', far.length > 0 && keep.every(k => k >= 0.66),
     far.map((r, i) => r.cz + ': ' + r.n + ' of ' + off[i].n).join('; '));
  const offBad = off.filter(r => r.ov.length || r.under.length);
  ok('N4 MUTATION: the list off, N1 goes red', offBad.length > 0, off.map(r => r.cz + ': ' + r.ov.length + ' over, ' + r.under.length + ' under').join('; '));
  ok('N5 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.close();
}

(async () => {
  const want = process.argv[2];
  for (const p of want ? [want] : ['phone_portrait', 'computer']) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.message).slice(0, 200)); } }
  console.log('\nNO NAME COVERS ANOTHER: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
