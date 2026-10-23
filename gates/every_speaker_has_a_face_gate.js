/* EVERY SPEAKER HAS A FACE (RUN TWO [every speaker has a face], 10/18/26).
   His notes: on the bar 'can these people start getting portraits when you click and talk to them'; on the clinic 'why
   can't all our characters that are speaking to us have a portrait'; the law A QUEST IS PEOPLE, PLACES AND THINGS: text
   comes from a mouth with a portrait. Rule 115(h) amended: the face is PORTRAIT's FRESH portrait, never a crop.
   On his phone's profile with real taps, at a camp, a town and a fortress:
     - every building's keeper (and YOU at the lot and the build) speaks under a fresh portrait whose mouth moves while
       the line shows; the arrival's elder too
     - every person in the picture, tapped, speaks under a face: fresh for a look PORTRAIT has made; a FACTION look
       (the thirteen faction_* the street wears) shows the old painted 64 portrait until PORTRAIT makes its head, counted
       and named as WAITING ON PORTRAIT, never a blank or the dim head
     - a keeper tapped before the street's people load still speaks under a fresh face (never the dim head)
     - ONE KEEPER, ONE LOOK (RUN TWO [the keepers wear the starred faces], 10/19, rule 120(d)): at every post the face
       that speaks is the look of the body standing there, under a name of his own
     - no '.say' line on the screen without a canvas face beside it, anywhere it was opened
   CONTROL: the classifier calls a dim head and a missing face red.
   Run: node gates/every_speaker_has_a_face_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8878;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
let blockFolk = false, landed = false;
/* WHEN PORTRAIT LANDS (round 2, 10/18): the manifest as it will read the day PORTRAIT adds the thirteen faction heads
   (rest A E O M at 64 and 128, the crew's shape), each faction file served by a crew face as a stand-in. Nothing in the
   screen or the face module is told; if the street does not light up from the manifest alone, the last quarter of the
   row needs code, and this leg says so before PORTRAIT's round, not after. */
const MANI = 'records/target/portrait/crew/BOHEMIA_CREW_FACES.json';
const FACTION_LOOKS = (() => { try { return Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/settlement_people/settlement_people.json'), 'utf8')).looks || {}).filter(l => /^faction_/.test(l)); } catch (e) { return []; } })();
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (blockFolk && /settlement_people\.json$/.test(u)) { rs.statusCode = 404; return rs.end(); }
  if (landed && u === '/' + MANI) {
    const j = JSON.parse(fs.readFileSync(path.join(ROOT, MANI), 'utf8'));
    FACTION_LOOKS.forEach(l => { if (!j.faces[l]) j.faces[l] = { look: l, files: Object.fromEntries(['rest', 'A', 'E', 'O', 'M'].map(k => [k, 'records/target/portrait/crew/' + l + '/' + k + '_{64|128}.png'])) }; });
    rs.setHeader('content-type', 'application/json'); return rs.end(JSON.stringify(j));
  }
  const fm = landed && u.match(/^\/records\/target\/portrait\/crew\/(faction_[a-z]+)\/(rest|A|E|O|M)_(64|128)\.png$/);
  if (fm && !fs.existsSync(path.join(ROOT, u))) { rs.setHeader('content-type', 'image/png'); return fs.createReadStream(path.join(ROOT, 'records/target/portrait/crew/you/' + fm[2] + '_' + fm[3] + '.png')).pipe(rs); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
/* what the open sheet shows: every '.say' and the face beside it, and the fresh ones' mouths over a second and a half */
const READ = () => new Promise(res => {
  const whos = [].slice.call(document.querySelectorAll('#sheet.on .who, #arrive .who'));
  const says = document.querySelectorAll('#sheet.on .say, #arrive .say').length;
  const rows = whos.map(w => { const c = w.querySelector('canvas.face'); return { nm: (w.querySelector('.nm') || {}).textContent || '', k: c ? c.dataset.face : 'NOFACE', look: c ? c.dataset.look || '' : '', has: !!(c && window.BohemiaCrewFaces && BohemiaCrewFaces.has(c.dataset.look)), c }; });
  const seen = rows.map(() => new Set()), t0 = performance.now();
  const iv = setInterval(() => { rows.forEach((r, i) => { if (r.c && r.c.dataset.mouth) seen[i].add(r.c.dataset.mouth); });
    if (performance.now() - t0 > 1500) { clearInterval(iv); res({ says, rows: rows.map((r, i) => ({ nm: r.nm, k: r.k, look: r.look, has: r.has, mouths: [...seen[i]].filter(m => m !== 'rest').length })) }); } }, 40);
});
const isBad = r => r.k === 'NOFACE' || r.k === 'none' || r.k === undefined;
const moved = r => r.k !== 'fresh' || r.mouths >= 2;

(async () => {
  ok('CONTROL: the classifier calls a dim head and a missing face red, a talking fresh face green',
     isBad({ k: 'none' }) && isBad({ k: 'NOFACE' }) && !isBad({ k: 'fresh' }) && !moved({ k: 'fresh', mouths: 0 }) && moved({ k: 'fresh', mouths: 3 }));
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = [];
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.folk().length > 0, null, { timeout: 30000 });
  await p.waitForTimeout(500);
  const close = async () => { if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(220); } };
  let posts = 0; const oneBad = [], postsSeen = new Set();
  const waiting = new Set(); let keepers = 0, keepBad = [], crowd = 0, crowdBad = [], fresh = 0, still = [], says = 0, sayNoFace = 0;
  for (const tier of ['camp', 'town', 'fortress']) {
    await p.evaluate(t => BohemiaSettlement.open({ place: { name: 'FACES ' + t.toUpperCase(), tier: t }, traits: [], day: 4 }), tier);
    await p.waitForTimeout(400);
    for (const k of await p.evaluate(() => BohemiaSettlement.order())) {
      await close();
      const xy = await p.evaluate(k => BohemiaSettlement.where(k), k); if (!xy) continue;
      await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(150);
      const r = await p.evaluate(READ);
      says += r.says; sayNoFace += Math.max(0, r.says - r.rows.filter(x => !isBad(x)).length);
      r.rows.forEach(x => { keepers++; if (isBad(x) || x.k !== 'fresh') keepBad.push(tier + ':' + k + ':' + x.k); if (x.k === 'fresh') { fresh++; if (!moved(x)) still.push(tier + ':' + k); } });
      /* ONE KEEPER, ONE LOOK (RUN TWO [the keepers wear the starred faces], rule 120(d), ONE ID ONE WHOLE PERSON): the face
         that speaks is the look of the body standing at that post, under a name of his own (PEOPLE's, 'NAME, ROLE'; the board's keeper is THE ELDER, a title by PEOPLE's ruling 07ea9017) */
      const body = await p.evaluate(k => { const q = BohemiaSettlement.folk().filter(q => q.keeper && q.k === k)[0]; return q ? q.look : null; }, k);
      if (body) { posts++; const f = r.rows[0]; if (!f || f.look !== body || f.k !== 'fresh' || !(/^[A-Z' .-]+ [A-Z' .-]+, /.test(f.nm) || (k === 'board' && f.nm === 'THE ELDER'))) oneBad.push(tier + ':' + k + ':' + body + '/' + (f ? f.look + ' ' + f.nm : 'none')); else postsSeen.add(k); }
    }
    const n = await p.evaluate(() => BohemiaSettlement.folk().length);
    for (let i = 0; i < n; i++) {
      await close();
      const pt = await p.evaluate(i => { const q = BohemiaSettlement.folk()[i], s0 = BohemiaSettlement.scale(); BohemiaSettlement.where(q.keeper ? q.k : 'stall');
        const v = BohemiaSettlement._view(), r = document.getElementById('scene').getBoundingClientRect();
        return { x: r.left + v.ox + q.x * v.s, y: r.top + v.oy + (q.y - s0.person * 0.45) * v.s, keeper: !!q.keeper, look: q.look }; }, i);
      if (pt.keeper) continue;
      await p.waitForTimeout(120); await p.mouse.click(pt.x, pt.y); await p.waitForTimeout(150);
      if (await p.evaluate(() => BohemiaSettlement.state.open !== 'person')) continue;
      const r = await p.evaluate(READ);
      says += r.says; sayNoFace += Math.max(0, r.says - r.rows.filter(x => !isBad(x)).length);
      r.rows.forEach(x => { crowd++;
        if (x.k === 'fresh') { fresh++; if (!moved(x)) still.push(tier + ':crowd:' + x.look); }
        else if (x.k === 'sheet' && /^faction_/.test(x.look) && !x.has) waiting.add(x.look);   /* once PORTRAIT's manifest names it, only fresh passes */
        else crowdBad.push(tier + ':crowd:' + x.look + ':' + x.k); });
    }
  }
  ok('every keeper, the elder and YOU speak under a FRESH portrait at a camp, a town and a fortress', keepers >= 20 && keepBad.length === 0, keepers + ' speakers' + (keepBad.length ? ', red ' + keepBad.slice(0, 4).join(' ') : ''));
  ok('ONE KEEPER, ONE LOOK: at every post the face that speaks is the look of the body standing there, fresh, under his own name', posts >= 20 && oneBad.length === 0 && ['bar', 'clinic', 'barber', 'smith'].every(k => postsSeen.has(k)),
     posts + ' posts (' + [...postsSeen].sort().join(' ') + ')' + (oneBad.length ? ', red ' + oneBad.slice(0, 3).join(' | ') : ''));
  ok('  and every fresh face\'s mouth moves while the line shows (two of PORTRAIT\'s mouths at least)', fresh > 0 && still.length === 0, fresh + ' fresh' + (still.length ? ', still ' + still.slice(0, 4).join(' ') : ''));
  ok('every person in the picture who speaks has a face: fresh, or the painted portrait while PORTRAIT makes the faction head', crowd >= 3 && crowdBad.length === 0, crowd + ' street speakers' + (crowdBad.length ? ', red ' + crowdBad.slice(0, 3).join(' ') : ''));
  console.log('    [waiting on PORTRAIT] faction looks still on the painted 64 when they speak: ' + (waiting.size ? [...waiting].sort().join(', ') : 'none'));
  ok('no spoken line on the screen without a face beside it', says > 0 && sayNoFace === 0, says + ' lines, ' + sayNoFace + ' without a face');

  /* the arrival's elder */
  await close();
  await p.evaluate(() => BohemiaSettlement.open({ place: { name: 'A NEW PLACE', tier: 'town' }, traits: [], day: 4, arrival: true }));
  await p.waitForFunction(() => !!document.querySelector('#arrive .who'), null, { timeout: 8000 }).catch(() => {});
  const ar = await p.evaluate(READ);
  ok('the arrival\'s elder speaks under a fresh face, the mouth moving', ar.rows.length === 1 && ar.rows[0].k === 'fresh' && moved(ar.rows[0]), JSON.stringify(ar.rows));

  /* a keeper before the street's people are in */
  blockFolk = true;
  const q = await ctx.newPage(); q.on('pageerror', e => errs.push(e.message));
  await q.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await q.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await q.waitForTimeout(500);
  await q.evaluate(() => BohemiaSettlement.open({ place: { name: 'THE WASH, NORTH LAS VEGAS', tier: 'town' }, traits: [], day: 4 }));
  await q.waitForTimeout(300);
  const xy = await q.evaluate(() => BohemiaSettlement.where('bar')); await q.mouse.click(xy.x, xy.y); await q.waitForTimeout(150);
  const early = await q.evaluate(READ);
  ok('a keeper tapped before the street\'s people load still speaks under a fresh face, never the dim head', early.rows.length >= 1 && early.rows.every(x => x.k === 'fresh' && moved(x)), JSON.stringify(early.rows));
  blockFolk = false;

  /* WHEN PORTRAIT LANDS: the same street, the manifest naming the thirteen faction heads, nothing else changed */
  landed = true;
  const L = await ctx.newPage(); L.on('pageerror', e => errs.push(e.message));
  await L.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await L.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.folk().length > 0 && window.BohemiaCrewFaces && BohemiaCrewFaces.LOOKS.some(l => /^faction_/.test(l)), null, { timeout: 30000 }).catch(() => {});
  const named = await L.evaluate(() => (window.BohemiaCrewFaces ? BohemiaCrewFaces.LOOKS : []).filter(l => /^faction_/.test(l)).length);
  const lit = new Set(), notLit = [];
  for (const tier of ['camp', 'town', 'fortress']) {
    await L.evaluate(t => BohemiaSettlement.open({ place: { name: 'FACES ' + t.toUpperCase(), tier: t }, traits: [], day: 4 }), tier);
    await L.waitForTimeout(400);
    const n = await L.evaluate(() => BohemiaSettlement.folk().length);
    for (let i = 0; i < n; i++) {
      if (await L.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await L.click('#close'); await L.waitForTimeout(220); }
      const pt = await L.evaluate(i => { const q = BohemiaSettlement.folk()[i], s0 = BohemiaSettlement.scale(); BohemiaSettlement.where(q.keeper ? q.k : 'stall');
        const v = BohemiaSettlement._view(), r = document.getElementById('scene').getBoundingClientRect();
        return { x: r.left + v.ox + q.x * v.s, y: r.top + v.oy + (q.y - s0.person * 0.45) * v.s, keeper: !!q.keeper, look: q.look }; }, i);
      if (pt.keeper || !/^(faction|person)_/.test(pt.look)) continue;   /* 10/23 [no two people alike]: the street wears the rolled people, each with his own head */
      await L.waitForTimeout(120); await L.mouse.click(pt.x, pt.y); await L.waitForTimeout(150);
      if (await L.evaluate(() => BohemiaSettlement.state.open !== 'person')) continue;
      const r = await L.evaluate(READ);
      r.rows.forEach(x => { if (x.k === 'fresh' && moved(x)) lit.add(x.look); else notLit.push(tier + ':' + x.look + ':' + x.k); });
    }
  }
  landed = false;
  ok('WHEN PORTRAIT LANDS: with the manifest naming the faction heads, every street speaker (a faction look, or since 10/23 a rolled person) talks under the fresh face, no code changed', named === FACTION_LOOKS.length && FACTION_LOOKS.length === 13 && lit.size >= 3 && notLit.length === 0,
     named + ' of ' + FACTION_LOOKS.length + ' named, ' + lit.size + ' looks heard fresh' + (notLit.length ? ', still old ' + notLit.slice(0, 3).join(' ') : ''));
  ok('no page errors', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nEVERY SPEAKER HAS A FACE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
