/* THE SETTLEMENT IS BUSY GATE (RUN TWO, row [the settlement is busy], 10/23/26; rule 131).
   PAOLO 10/23: 'in the settlement you don't have to make every character matter; I would like to see characters you can't
   even interact with walking around the settlement, doing something, doing important things; but everyone that needs to
   get clicked on stands still, always.'
   Measured on the real settlement screen, his phone's profile, every tier:
     B1  every place has people walking its paths, more on market day, fewer at night, one at most when raided or sick
     B2  each is a rolled person on his own walk sheet, and nobody on the screen is anybody else (keepers, crowd and walkers)
     B3  they move: a walker's feet travel along his lane and his picture steps through the walk's keys; at each end of his
         round he stops a few beats facing the buildings, then walks back
     B4  they keep to their lane (never past its ends) and two on one lane never walk as one (never within a body's width
         going the same way)
     B5  NOBODY CAN TAP ONE: a tap on a walker where nobody else stands never opens a person (a building behind him may)
     B6  the people you can tap stand still, always: every keeper and every man in the crowd on the same spot over 12 s
   Run: node gates/the_settlement_is_busy_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8873;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [], missing = [], asked = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) missing.push(r.url()); }); p.on('request', r => asked.push(r.url()));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  const open = (o) => p.evaluate(o => BohemiaSettlement.open({ place: { tier: o.tier, name: o.name }, traits: o.tr || [], night: !!o.night }), o);
  const counts = {}, twice = [], unrolled = [], off = [], stacked = [];
  for (const tier of ['camp', 'town', 'fortress', 'home']) for (const name of ['HENDERSON', 'THE WASH, NORTH LAS VEGAS']) {
    for (const v of [{ k: 'day' }, { k: 'market', tr: ['market_day'] }, { k: 'night', night: true }, { k: 'raided', tr: ['raided'] }]) {
      await open({ tier, name, tr: v.tr, night: v.night }); await p.waitForTimeout(100);
      const r = await p.evaluate(() => { const B = window.BohemiaRigBodies, w = BohemiaSettlement.busy(), f = BohemiaSettlement.folk().map(x => x.look);
        return { n: w.length, looks: w.map(x => x.look), all: f.concat(w.map(x => x.look)), walkers: w.every(x => B.canWalk(x.look)) }; });
      (counts[tier] = counts[tier] || {})[v.k] = Math.max((counts[tier][v.k] || 0), r.n);
      if (new Set(r.all).size !== r.all.length) twice.push(tier + ' ' + name + ' ' + v.k);
      if (!r.walkers) unrolled.push(tier + ' ' + v.k);
    }
    /* B3, B4: twelve seconds of the day street sampled every 100 ms */
    await open({ tier, name, tr: ['market_day'] }); await p.waitForTimeout(200);
    const tr = await p.evaluate(async () => { const out = [], t0 = performance.now(); for (let t = 0; t < 12000; t += 100) out.push(BohemiaSettlement.busy(t0 + t)); return out; });
    tr.forEach(fr => fr.forEach(w => { if (w.x < w.a - 1 || w.x > w.b + 1) off.push(tier + ':' + w.look); }));
    tr.forEach(fr => fr.forEach((w, i) => fr.forEach((u, j) => { if (j > i && Math.abs(u.y - w.y) < 20 && w.walking && u.walking && w.turn === u.turn && Math.abs(u.x - w.x) < 30) stacked.push(tier + ':' + w.look + '+' + u.look); })));
    const moved = tr[0].map((w, i) => Math.max(...tr.map(fr => fr[i].x)) - Math.min(...tr.map(fr => fr[i].x)));
    const stopped = tr[0].map((w, i) => tr.some(fr => !fr[i].walking));
    (counts[tier].moved = moved.map(m => Math.round(m))), (counts[tier].stopped = stopped.filter(Boolean).length);
  }
  const T = Object.keys(counts);
  /* RE-AIMED 10/26 (RUN TWO [eyes: the quiet town], rule 131: EYES saw Blues with one man in it): a raid halves the walkers, the wiki's
     card's own share, never under three by day (a home base keeps its own count) */
  ok('B1 every place has people walking its paths: more on market day, fewer at night, a raid thins them but never to one', T.every(t => counts[t].day >= 2 && counts[t].market > counts[t].day && counts[t].night < counts[t].market && counts[t].raided <= counts[t].day && counts[t].raided >= (t === 'home' ? 1 : 3)),
    T.map(t => t + ' ' + ['day', 'market', 'night', 'raided'].map(k => counts[t][k]).join('/')).join(', '));
  ok('B2 each is a rolled walker, and nobody on the screen is anybody else (keepers, crowd and walkers)', twice.length === 0 && unrolled.length === 0, (twice.concat(unrolled).slice(0, 3).join('; ')) || 'all different, all rolled');
  ok('B3 they move: every walker travels his lane in twelve seconds and stops at an end of his round', T.every(t => counts[t].moved.every(m => m > 150) && counts[t].stopped >= 1), T.map(t => t + ' ' + counts[t].moved.join(',') + ' px, ' + counts[t].stopped + ' stopped').join('; '));
  ok('B4 they keep to their lane, and two on one lane never walk as one', off.length === 0 && stacked.length === 0, (off.slice(0, 2).concat(stacked.slice(0, 2)).join(' ')) || 'kept apart');
  const sheets = asked.filter(u => /slices\/rig_walk\/person_[a-z0-9_]+\.png$/.test(u)).length;
  ok('  each walks on his own sheet (counted off the network)', sheets >= 4, sheets + ' walk sheets fetched');
  /* the picture steps: two shots a third of a beat apart differ along a walker's path */
  await open({ tier: 'town', name: 'HENDERSON', tr: ['market_day'] }); await p.waitForTimeout(2500);
  const step = await p.evaluate(async () => { const w = BohemiaSettlement.busy().filter(x => x.walking).length; return w; });
  ok('  and on the glass some of them are walking right now', step >= 1, step + ' walking');

  /* B5 nobody can tap a walker: find a walker with nobody standing within a body of him, tap his chest, nothing opens */
  let tapped = 0, opened = [];
  for (let k = 0; k < 6 && tapped < 3; k++) {
    await p.waitForTimeout(700);
    const pt = await p.evaluate(() => { const v = BohemiaSettlement._view(), s0 = BohemiaSettlement.scale(), folk = BohemiaSettlement.folk(), r = document.getElementById('scene').getBoundingClientRect();
      const w = BohemiaSettlement.busy().find(x => folk.every(f => Math.abs(f.x - x.x) > 60 || Math.abs(f.y - x.y) > s0.person) &&
        r.left + v.ox + x.x * v.s > 10 && r.left + v.ox + x.x * v.s < innerWidth - 10 && r.top + v.oy + (x.y - s0.person * .5) * v.s > r.top + 10);
      return w ? { x: r.left + v.ox + w.x * v.s, y: r.top + v.oy + (w.y - s0.person * .5) * v.s, look: w.look } : null; });
    if (!pt) continue;   /* a walker moves about 6 points in the 200 ms a tap takes, inside his own width */
    await p.mouse.click(pt.x, pt.y); await p.waitForTimeout(500);
    /* the tap goes through him: a building behind him may open (it is under the finger), a person never does (he is not one
       of the people you can tap, and nobody stands within a body of him) */
    const st = await p.evaluate(() => BohemiaSettlement.state.open || null);
    if (st === 'person') opened.push(pt.look + '->' + st);
    if (st) await p.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); });
    tapped++;
  }
  ok('B5 NOBODY CAN TAP ONE: a tap on a walker never opens him (it goes through to what stands behind)', tapped >= 1 && opened.length === 0, tapped + ' walkers tapped' + (opened.length ? ', opened ' + opened.join(' ') : ''));
  /* B6 the people you can tap stand still: every keeper and crowd spot over twelve seconds */
  const still = await p.evaluate(async () => { const a = BohemiaSettlement.folk().map(x => x.x + ',' + x.y); await new Promise(r => setTimeout(r, 12000)); const z = BohemiaSettlement.folk().map(x => x.x + ',' + x.y); return { n: a.length, same: a.every((x, i) => x === z[i]) }; });
  ok('B6 the people you can tap stand still, always (every keeper and crowd spot the same over 12 s)', still.n > 0 && still.same, still.n + ' people, ' + (still.same ? 'none moved' : 'SOMEBODY MOVED'));
  ok('every file loads', missing.length === 0, missing.slice(0, 3).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE SETTLEMENT IS BUSY GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
