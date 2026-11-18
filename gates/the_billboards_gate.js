#!/usr/bin/env node
/* THE BILLBOARDS (WORLD 14, 11/18; the coordinator's round under rule 453; the checklist's item 13 'billboards'; rule 441: on the
   real page, alpha and demo, a phone both ways; rule 454(a): no words). slices/bohemia_billboards.js puts the boards beside the
   freeways and makes each a lookout: Battle Brothers' high ground widens the company's sight.
     T1 the seam: wraps the buildings' pass and the map's sight, loaded after the tracks, never writes a word on the map
     On the page:
     T2 the boards: some on every valley (15 to 150), each on a land block beside the freeway block it faces, never on a town's or a
        real place's block, at least five apart, the same list when the valley is read again
     T3 the sight: by a board 3 blocks more by day; six blocks off, the map's own; at night 1 more; MUTATION: the boards off, the map's own
     T4 the fog keeps it: a block 8 off, unseen, is seen once he stands by the board
     T5 drawn on the map's own canvas: the board's face changes with the boards on and off (the middle of three frames each),
        at least four times what the map itself moves between frames off
     T6 nothing threw
   Run: node gates/the_billboards_gate.js [node|demo|alpha|demo-up|demo-side|alpha-up|alpha-side] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 400) + ']' : '')); };
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function nodeChecks() {
  const src = read('slices/bohemia_billboards.js'), city = read('slices/BOHEMIA_CITY_WORLD.html');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
  const why = [];
  if (!/root\.vbCityDraw = function \(ox, oy, night\)/.test(code)) why.push('does not wrap the buildings\' pass');
  if (!/root\.fogRadius = function/.test(code)) why.push('does not wrap the sight');
  if (/fillText|strokeText/.test(code)) why.push('writes words on the map');
  const a = city.indexOf('src="bohemia_tracks_read.js"'), b = city.indexOf('src="bohemia_billboards.js"');
  if (!(a > 0 && b > a)) why.push('not loaded after the tracks');
  ok('T1 the seam: wraps the buildings\' pass and the sight, loaded after the tracks, no word on the map', !why.length, why.join(', ') || 'all');
}

async function page(alpha, profile) {
  const W = (alpha ? 'the alpha' : 'the demo') + ', ' + (profile === 'phone_landscape' ? 'sideways' : 'upright');
  console.log('\n-- ' + W + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open(Object.assign({ profile, fog: true }, alpha ? { alpha: true } : {}));
  const fr = d.fr, pg = d.page, errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 120; i++) { if (await fr.evaluate(() => !!(window.BohemiaBillboards && typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city'))) break; await pg.waitForTimeout(500); }
    try { await d.toMap(); } catch (e) {} try { await d.pinchIn(); } catch (e) {}
    await fr.evaluate(() => { if (typeof MODE !== 'undefined' && MODE !== 'city') { MODE = 'city'; try { updHud(); } catch (e) {} try { render(); } catch (e) {} } });
    const r = await fr.evaluate(async () => {
      const o = {}, BB = BohemiaBillboards, wait = (ms) => new Promise(z => setTimeout(z, ms));
      try { loopClose(); } catch (e) {} try { if (window.BohemiaRoadEvents) BohemiaRoadEvents.close(false); } catch (e) {}
      const L = BB.list(); o.n = L.length;
      /* T2 */
      const LAND = /^(suburb|commercial|desert|industrial|warehouse|storage|apartment|trailer|solar|farm|wash|rail|estate|gated|resort)$/;
      const bs = ctBases(), towns = Object.keys(bs).map(k => bs[k]).filter(Boolean), places = (window.BOH_REAL_PLACES && BOH_REAL_PLACES.cellsNow) ? BOH_REAL_PLACES.cellsNow() : [];
      const bad = [];
      L.forEach((b, i) => { const c = om.at(b.x, b.y), f = om.at(b.fx, b.fy);
        if (!c || !LAND.test(c.district)) bad.push(b.x + ',' + b.y + ' on ' + (c && c.district));
        if (!f || f.district !== 'freeway' || Math.abs(b.x - b.fx) + Math.abs(b.y - b.fy) !== 1) bad.push(b.x + ',' + b.y + ' not beside the freeway');
        if (towns.some(t => (t.x | 0) === b.x && (t.y | 0) === b.y) || places.some(p => p.x === b.x && p.y === b.y)) bad.push(b.x + ',' + b.y + ' on a town or a place');
        if (L.some((q, j) => j !== i && Math.max(Math.abs(q.x - b.x), Math.abs(q.y - b.y)) < 5)) bad.push(b.x + ',' + b.y + ' too close'); });
      BB.seed = null; BB.boards = []; const L2 = BB.list(); o.same = JSON.stringify(L2) === JSON.stringify(L); o.bad = bad.slice(0, 4); o.nbad = bad.length;
      /* pick a board in the open (not his start), the freeway block it faces */
      const b = L.find(q => Math.max(Math.abs(q.x - city.x), Math.abs(q.y - city.y)) > 8) || L[0]; o.b = b;
      /* T3: the sight (the day forced, then the night) */
      const nightWas = window.isNight; window.isNight = () => false;
      city.x = b.x + 7; city.y = b.y; const base = fogRadius();
      city.x = b.fx; city.y = b.fy; o.day = { base, at: fogRadius() };
      city.x = b.x + 7; city.y = b.y; o.off6 = fogRadius();
      window.isNight = () => true; city.x = b.x + 7; const nb = fogRadius(); city.x = b.fx; city.y = b.fy; o.night = { base: nb, at: fogRadius() };
      window.isNight = () => false; BB.on = false; o.mut = fogRadius(); BB.on = true;
      window.isNight = nightWas;
      /* T4: the fog keeps it (a block 8 off along the freeway's side, unseen before) */
      const tx = b.fx + 8, ty = b.fy; o.seenBefore = fogSeen(tx, ty);
      window.isNight = () => false; city.x = b.fx; city.y = b.fy; FOG.last = null; fogTick(); window.isNight = nightWas;
      o.seenAfter = fogSeen(tx, ty);
      /* T5: drawn (he stands six blocks off, the board's ground seen; the ground painted fresh each frame) */
      city.x = b.x + 6; city.y = b.y + 2; try { fogReveal(b.x, b.y, 3); fogReveal(city.x, city.y, 3); } catch (e) {}
      for (let i = 0, last = ''; i < 60; i++) { MAP_GROUND.key = ''; render(); await wait(100); const k = Math.round(__MAP_OXY.ox) + ',' + Math.round(__MAP_OXY.oy) + ',' + Math.round(TW * 10); if (k === last) break; last = k; }
      const cv = document.getElementById('cv'), cx = cv.getContext('2d'), dpr = cv.width / cv.clientWidth;
      const a = iso(b.x, b.y, __MAP_OXY.ox, __MAP_OXY.oy), px = a.sx, py = a.sy + TH * 0.62 - TW * 0.95;
      const at = async () => { MAP_GROUND.key = ''; render(); await wait(120); const q = cx.getImageData(Math.round(px * dpr) - 2, Math.round(py * dpr) - 2, 5, 5).data; let s = [0, 0, 0]; for (let i = 0; i < q.length; i += 4) { s[0] += q[i]; s[1] += q[i + 1]; s[2] += q[i + 2]; } return s; };
      const d3 = (A, B) => Math.abs(A[0] - B[0]) + Math.abs(A[1] - B[1]) + Math.abs(A[2] - B[2]);
      /* three frames each way, the middle of each channel (a walker passing one frame is not the board) */
      const med = (L) => [0, 1, 2].map(i => L.map(v => v[i]).sort((x, y) => x - y)[1]);
      const onS = [await at(), await at(), await at()]; BB.on = false; const offS = [await at(), await at(), await at()]; BB.on = true; await at();
      o.change = d3(med(onS), med(offS)); o.flicker = [d3(offS[0], offS[1]), d3(offS[1], offS[2]), d3(offS[0], offS[2])].sort((x, y) => x - y)[1]; o.drawn = BB.status().drawn; o.tw = TW; o.hid = fogHides(b.x, b.y);
      return o; });
    ok(W + ' T2 the boards: ' + r.n + ' beside the freeways, each on land beside the block it faces, none on a town or a place, five apart, the same twice',
       r.n >= 15 && r.n <= 150 && r.nbad === 0 && r.same, JSON.stringify({ bad: r.bad, same: r.same }));
    ok(W + ' T3 the sight: by a board ' + (r.day && r.day.base) + ' to ' + (r.day && r.day.at) + ' by day, ' + (r.night && r.night.base) + ' to ' + (r.night && r.night.at) + ' by night, six off the map\'s own, the boards off the map\'s own',
       r.day && r.day.at === r.day.base + 3 && r.off6 === r.day.base && r.night && r.night.at === r.night.base + 1 && r.mut === r.day.base, JSON.stringify({ day: r.day, night: r.night, off6: r.off6, mut: r.mut }));
    ok(W + ' T4 the fog keeps it: a block 8 off, unseen, is seen once he stands by the board', r.seenBefore === false && r.seenAfter === true, JSON.stringify({ before: r.seenBefore, after: r.seenAfter }));
    ok(W + ' T5 drawn on the map\'s own canvas: the face moves the pixels by ' + r.change + ' with the boards on, ' + r.flicker + ' between two frames off',
       r.drawn > 0 && r.change > 150 && r.change >= 4 * r.flicker && !r.hid, JSON.stringify({ drawn: r.drawn, tw: r.tw, hid: r.hid, board: r.b }));
    ok(W + ' T6 nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
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
  console.log('\nTHE BILLBOARDS: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
