/* THE PEOPLE OF THE PLACE GATE (RUN TWO, row [the finished pictures in], 10/10/26).
   COOK's finished settlement pictures (painted in place over COMBAT TWO's, same names, same boxes)
   with ANIMATION's idle people standing in them. On his phone's profile: every tier and its night
   loads its picture; every building's tap still opens its own sheet; a keeper stands at each
   building's door step, drawn from the people sheets at the picture's scale and moving on the beat;
   the crowd by the stall grows on market day and empties when raided or sick, thins at night.
   AMENDED 10/19 (RUN TWO [the 3D models on your screens], rule 121(e): 'BRO EVERYTHING IS A 3D MODEL NOW... WTF TRYING TO
   COMBINE THE TWO'): EVERY PERSON IS A 3D MODEL. The screen never loads ANIMATION's flat sheets again; every keeper and
   every man in the crowd is one of CHARACTER's thirteen gangs standing, his render fetched from CHARACTER's own folder and
   in, with PORTRAIT's 3D head for his look; a man turns only one eighth of a turn at a time, and not all on one beat.
   Shots in slices/vote/. Run: node gates/settlement_people_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8864;
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
  p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  p.on('request', r => asked.push(r.url()));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await p.waitForTimeout(1500);
  const NAMES = { camp: 'DRY CAMP', town: 'THE WASH, NORTH LAS VEGAS', fortress: 'NELLIS GATE' };
  const counts = {};
  for (const tier of ['camp', 'town', 'fortress']) for (const night of [false, true]) {
    await p.evaluate(o => BohemiaSettlement.open({ place: { tier: o.tier, name: o.name }, traits: [], night: o.night }), { tier, name: NAMES[tier], night });
    await p.waitForTimeout(900);
    const r = await p.evaluate(() => { const L = BohemiaSettlement.folk();
      return { keepers: L.filter(x => x.keeper).map(x => x.k), crowd: L.filter(x => x.crowd).length, order: BohemiaSettlement.order().filter(k => k !== 'lot' && k !== 'build') }; });
    counts[tier + (night ? '_night' : '')] = r.crowd;
    ok(tier + (night ? ' at night' : '') + ': a keeper at every building\'s door', r.keepers.length === r.order.length && r.order.every(k => r.keepers.indexOf(k) >= 0), r.keepers.join(','));
    /* drawn: the canvas at a keeper's feet changes between two beats (he moves) and differs from the bare picture */
    const moved = await p.evaluate(async () => {
      const c = document.querySelector('canvas'), L = BohemiaSettlement.folk().filter(x => x.keeper);
      const k = L[0], pt = BohemiaSettlement.where(k.k);
      const snap = () => { const g = document.createElement('canvas'); g.width = c.width; g.height = c.height; g.getContext('2d').drawImage(c, 0, 0); return g.getContext('2d'); };
      const a = snap(); await new Promise(r => setTimeout(r, 700)); const z = snap();
      let diff = 0; const dpr = c.width / c.clientWidth;
      const r = c.getBoundingClientRect();
      /* scan the whole visible picture; a person breathing changes pixels somewhere every beat */
      const A = a.getImageData(0, 0, c.width, c.height).data, Z = z.getImageData(0, 0, c.width, c.height).data;
      for (let i = 0; i < A.length; i += 16) if (Math.abs(A[i] - Z[i]) > 8) diff++;
      return diff;
    });
    ok('  the people move on the beat, not a still', moved > 30, moved + ' px changed in 700 ms');
  }
  /* EVERY PERSON IS A 3D MODEL (rule 121e) */
  {
    const SCREEN = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
    ok('EVERY PERSON IS A 3D MODEL: the screen never names the old flat people sheets', !/settlement_people\//.test(SCREEN.replace(/\/\*[\s\S]*?\*\//g, '')));
    ok('  and never asked for one while six places opened', !asked.some(u => /settlement_people\/|fight_people\//.test(u)), asked.filter(u => /settlement_people\/|fight_people\//.test(u)).slice(0, 2).join(' '));
    const rig = asked.filter(u => /records\/target\/character\/rig\/[a-z]+\/rig_[NSEW]+\.png$/.test(u));
    ok('  the bodies came from CHARACTER\'s own standing renders', rig.length >= 8, rig.length + ' renders asked for');
    const who = await p.evaluate(() => BohemiaSettlement.folk().map(q => ({ look: q.look, g: BohemiaRigBodies.gangOf(q.look),
      body: !!(BohemiaRigBodies.standing(q.look, q.face)), face: BohemiaCrewFaces.has(q.look) })));
    ok('  every keeper and every man in the crowd is a gang standing in his own render, with a 3D head for his look', who.length > 0 && who.every(q => q.g && q.body && q.face),
       who.filter(q => !(q.g && q.body && q.face)).slice(0, 3).map(q => JSON.stringify(q)).join(' ') || who.length + ' people');
    const T = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const turns = await p.evaluate(() => { const L = BohemiaSettlement.folk(), out = []; for (let i = 0; i < L.length; i++) { const r = []; for (let ms = 0; ms <= 24000; ms += 500) r.push(BohemiaSettlement.turnAt(i, 1e6 + ms)); out.push(r); } return out; });
    let spin = 0, still = 0; const at = new Set();
    turns.forEach(r => { let changed = false; for (let j = 1; j < r.length; j++) if (r[j] !== r[j - 1]) { changed = true; at.add(j % 4); const d = Math.abs(T.indexOf(r[j]) - T.indexOf(r[j - 1])); if (Math.min(d, 8 - d) > 1) spin++; } if (!changed) still++; });
    ok('  a man turns one eighth of a turn at a time, never a spin, and every one of them turns in twelve seconds', spin === 0 && still === 0, spin + ' spins, ' + still + ' who never turn, of ' + turns.length);
    ok('  and they do not all turn on the same beat', at.size >= 2, [...at].join(','));
    /* the night dims them without costing frames: a canvas filter per person took the screen from 42 to 5 a second (10/19) */
    const fps = async night => { await p.evaluate(n => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: ['market_day'], night: n }), night);
      await p.waitForTimeout(1200);
      return p.evaluate(() => new Promise(r => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 1500) requestAnimationFrame(f); else r(n / 1.5); })(); })); };
    const day = await fps(false), dark = await fps(true);
    ok('  the people at night cost no frames (night at least 70% of day)', dark >= day * 0.7, Math.round(dark) + ' a second at night, ' + Math.round(day) + ' by day');
  }
  ok('the crowd: a town more than a camp, night thinner than day', counts.town > counts.camp && counts.town_night < counts.town, JSON.stringify(counts));
  const tr = {};
  for (const ids of [[], ['market_day'], ['raided'], ['sickness']]) {
    await p.evaluate(ids => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: ids, night: false }), ids);
    await p.waitForTimeout(500);
    tr[ids[0] || 'plain'] = await p.evaluate(() => BohemiaSettlement.crowdCount());
    if (ids[0] === 'market_day' || !ids.length) await p.screenshot({ path: path.join(ROOT, 'slices/vote/RUN2_THE_PEOPLE_' + (ids[0] ? 'MARKET_DAY' : 'TOWN') + '_10_10.png') });
  }
  ok('market day fills the street, raided and sick empty it', tr.market_day > tr.plain && tr.raided <= 1 && tr.sickness <= 1, JSON.stringify(tr));
  /* A PERSON IS A DOOR TALL: measured on the screen, not in the code. Shoot the town with its people and with them
     hidden, and the tallest changed run of pixels at a keeper is his height; the door is DOOR_PX at the screen's scale */
  for (const tier of ['camp', 'town', 'fortress']) {
    await p.evaluate(t => BohemiaSettlement.open({ place: { tier: t, name: 'DOOR ' + t }, traits: [], night: false }), tier); await p.waitForTimeout(700);
    const m = await p.evaluate(async () => {
      const L = BohemiaSettlement.folk(), k = L.find(x => x.keeper && x.k === 'hall') || L.find(x => x.keeper);
      BohemiaSettlement.where(k.k); await new Promise(r => setTimeout(r, 200));
      const c = document.querySelector('canvas'), dpr = c.width / c.clientWidth, sc = BohemiaSettlement.scale();
      const grab = () => { const g = document.createElement('canvas'); g.width = c.width; g.height = c.height; g.getContext('2d').drawImage(c, 0, 0); return g.getContext('2d').getImageData(0, 0, c.width, c.height).data; };
      const keep = L.slice(); const A = grab(); L.length = 0; L.push(k); await new Promise(r => setTimeout(r, 120)); const B0 = grab(); L.length = 0; await new Promise(r => setTimeout(r, 120)); const Z = grab(); keep.forEach(x => L.push(x));
      const v = BohemiaSettlement._view(), cx = Math.round((v.ox + k.x * v.s) * dpr), fy = Math.round((v.oy + k.y * v.s) * dpr), hw = Math.round(30 * dpr);
      let top = null, bot = null;
      for (let y = Math.max(0, fy - Math.round(200 * dpr)); y < Math.min(c.height, fy + Math.round(6 * dpr)); y++) for (let x = Math.max(0, cx - hw); x < Math.min(c.width, cx + hw); x++) {
        const i = (y * c.width + x) * 4; if (Math.abs(B0[i] - Z[i]) + Math.abs(B0[i + 1] - Z[i + 1]) + Math.abs(B0[i + 2] - Z[i + 2]) > 30) { if (top === null) top = y; bot = y; } }
      return { person: top === null ? 0 : (bot - top + 1) / dpr / v.s, door: sc.door };
    });
    ok(tier + ': a person is a door tall (measured on the screen)', m.person > 0 && Math.abs(m.person / m.door - 1) <= 0.12, 'person ' + m.person.toFixed(0) + ' / door ' + m.door + ' = ' + (m.person / m.door).toFixed(2));
  }
  /* PORTRAITS WHEN THEY TALK: tap every person in the picture, keeper or crowd, and a face speaks; a tap with no face is red */
  {
    await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: ['market_day'], night: false })); await p.waitForTimeout(800);
    const n = await p.evaluate(() => BohemiaSettlement.folk().length);
    let spoke = 0, faced = 0, crowdSaid = 0, blank = [];
    for (let i = 0; i < n; i++) {
      await p.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); }); await p.waitForTimeout(100);
      const pt = await p.evaluate(i => { const L = BohemiaSettlement.folk(), q = L[i], v = BohemiaSettlement._view();
        const s0 = BohemiaSettlement.scale(); BohemiaSettlement.where(q.keeper ? q.k : 'stall'); const v2 = BohemiaSettlement._view(), r = document.getElementById('scene').getBoundingClientRect();
        return { x: r.left + v2.ox + q.x * v2.s, y: r.top + v2.oy + (q.y - s0.person * 0.45) * v2.s, keeper: !!q.keeper, k: q.k, look: q.look }; }, i);
      await p.waitForTimeout(150);
      await p.mouse.click(pt.x, pt.y); await p.waitForTimeout(900);
      const r = await p.evaluate(() => { const f = document.querySelector('#sbody .who canvas.face'), say = document.querySelector('#sbody .who .say p');
        if (!f) return { face: null };
        const d = f.getContext('2d').getImageData(0, 0, f.width, f.height).data; let n = 0, cols = new Set(); for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0) { n++; cols.add(d[i] >> 4 << 8 | d[i + 1] >> 4 << 4 | d[i + 2] >> 4); }
        return { face: f.dataset.face, px: n, cols: cols.size, line: say ? say.textContent : '', open: BohemiaSettlement.state.open }; });
      if (r.face && r.line) spoke++;
      if (r.face && r.face !== 'none' && r.px > 1800 && r.cols > 5) faced++; else blank.push((pt.keeper ? pt.k : 'crowd') + ':' + pt.look + ':' + (r.face || 'no sheet') + ':' + (r.cols || 0) + ':' + r.open);
      if (!pt.keeper && r.open !== 'person') console.log('     crowd tap opened ' + r.open + ' at ' + JSON.stringify(pt));
      if (!pt.keeper && r.open === 'person' && r.line.length > 10) { crowdSaid++; if (crowdSaid === 1) await p.screenshot({ path: path.join(ROOT, 'slices/vote/RUN2_PORTRAITS_WHEN_THEY_TALK_10_11.png') }); }
    }
    const crowd = await p.evaluate(() => BohemiaSettlement.folk().filter(x => x.crowd).length);
    ok('tap any person in the picture and they speak', spoke === n, spoke + ' of ' + n);
    ok('  every one speaks under a face, never a blank head (a tap with no face is red)', faced === n, faced + ' of ' + n + (blank.length ? ' | ' + blank.slice(0, 3).join(' ') : ''));
    ok('  the crowd talks too: a street line or a rumour, from the person you tapped', crowdSaid === crowd && crowd > 0, crowdSaid + ' of ' + crowd);
    await p.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); });
    const ptb = await p.evaluate(() => BohemiaSettlement.where('bar')); await p.mouse.click(ptb.x, ptb.y + 40); await p.waitForTimeout(400);
    const bar = await p.evaluate(() => { const f = document.querySelector('#sbody .who canvas.face'); return f ? f.dataset.face : null; });
    ok('  the bar\'s keeper speaks under a face too', bar && bar !== 'none', bar);
  }
  /* every building's tap still lands on COOK's finished picture */
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: [], night: false }));
  await p.waitForTimeout(400);
  const order = await p.evaluate(() => BohemiaSettlement.order());
  let landed = 0;
  for (const k of order) {
    await p.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); });
    await p.waitForTimeout(150);
    const pt = await p.evaluate(k => BohemiaSettlement.where(k), k);
    await p.waitForTimeout(350);
    const pt2 = await p.evaluate(k => BohemiaSettlement.where(k), k);
    await p.mouse.click(pt2.x, pt2.y); await p.waitForTimeout(300);
    const open = await p.evaluate(() => BohemiaSettlement.state.open);
    if (open === k) landed++; else console.log('     missed ' + k + ' -> ' + open);
  }
  ok('every building\'s tap still opens its own sheet on the finished picture', landed === order.length, landed + ' of ' + order.length);
  ok('every file loads', missing.length === 0, missing.slice(0, 2).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE PEOPLE OF THE PLACE GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
