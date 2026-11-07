#!/usr/bin/env node
/* THE RETINUE GATE (RETINUE, 11/7, rule 425(c), ask line 206; rules 151(d), 270, 56; Paolo 10/26: 'do research on all the people in
   Battle Brothers who can join your camp and what they do to help you, the basic camp support, the retinue support').
   END STATE: each of Battle Brothers' eighteen followers is a person of the dead Las Vegas, his data in a file a modder can edit
   (records/target/bb/retinue.json), met and hired in a town's hall, each with his one effect, standing in the camp by his piece,
   with his own face and his own body.
     R1 THE FILE: all eighteen of Battle Brothers' followers, each a name, who he was, a price, his one effect in words and in numbers;
        each look a person of the valley with a face (rest and the four mouths) and a body, none of them one of your company, no two alike
     R2 THE COPY IS THE FILE: the engine's copy equals the file (tools/bohemia_retinue_bake.js), and the engine's tables come from it
     R3 EACH HIRE MOVES HIS NUMBER: every follower whose work the game does changes the number he names when he is with you; every one
        still shut names the lane that will do his work
     R4 A MODDER'S EDIT IS THE GAME'S: a changed row served in the file is what the town's card says (the game reads the file at load)
     R5 HIRED IN A TOWN, WITH A FACE (his phone, 390 x 844): a town's hall holds the file's few each week, each card his own face
        (fresh, his look) and his own body, his words; no CLOUT, every hire shut; with a place by the fire a real tap takes him on, his
        price once, the map told; the hall's hand stays all week and the next week's is new
     R6 THE CAMP SHOWS HIM: every follower with you stands by his piece as himself, and a tap on him opens the retinue, a face on every row
     R7 THE NEGOTIATOR WORKS: with him a town's good word fades slower and a grudge mends faster, at the town's own dawn
     R8 ONE ID, ONE WHOLE PERSON: a follower with you is dealt to nobody's street
     R9 ON THE DEMO (the baked cut, his phone): the nearest town's hall shows the few with their fresh faces, the hall is one glass
        with them in it (rule 402: the cut's fitter, not the bare page), and a real tap takes one on: the map's own retinue has him,
        his price taken from the map's batteries once
   PLANTED FAILS, every run: each leg's own check is run first on a planted wrong thing (a follower dropped, a company face, two alike;
   an engine copy one price off; a follower with no number; a face that is nobody) and must say red. `--plant` serves the browser a
   file whose every face is nobody's, and the whole gate must go red (exit 1).
     node gates/the_retinue_gate.js            the gate
     node gates/the_retinue_gate.js --plant    the planted file: R4 to R6 must fail */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), PORT = 8000 + (process.pid % 900) + 41;
const PLANT = process.argv.includes('--plant');
let pass = 0, fail = 0;
const ok = (name, cond, why) => { if (cond) pass++; else fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name + (why ? '  [' + why + ']' : '')); };

const FILE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/retinue.json'), 'utf8'));
const ROWS = FILE.followers.value;
const BB18 = ['The Agent', 'The Alchemist', 'The Blacksmith', 'The Bounty Hunter', 'The Brigand', 'The Cartographer', 'The Cook', 'The Drill Sergeant',
  'The Lookout', 'The Minstrel', 'The Negotiator', 'The Paymaster', 'The Quartermaster', 'The Recruiter', 'The Scavenger', 'The Scout', 'The Surgeon', 'The Trader'];
const OURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
const CREW = new Set(((OURS.people_looks || {}).value || OURS.people_looks || {}).crew || []);
const BARBER = path.join(ROOT, 'records/target/character/barber');

/* ---------------------------------------------------------------- R1 THE FILE */
function fileWrong(rows) {
  const why = [], seen = {}, looks = {};
  const bb = rows.map(r => r.bb).sort();
  BB18.forEach(n => { if (bb.indexOf(n) < 0) why.push('missing ' + n); });
  if (rows.length !== 18) why.push(rows.length + ' rows');
  rows.forEach(r => {
    if (!r.id || seen[r.id]) why.push('id ' + r.id); seen[r.id] = 1;
    ['name', 'was', 'does', 'ask', 'joins'].forEach(k => { if (typeof r[k] !== 'string' || r[k].length < 4) why.push(r.id + ' no ' + k); });
    if (!(r.price > 0)) why.push(r.id + ' price');
    if (!r.nums || !Object.keys(r.nums).some(k => typeof r.nums[k] === 'number')) why.push(r.id + ' no number');
    if (!r.shut && !r.reads) why.push(r.id + ' works but names no screen');
    if (r.shut && typeof r.shut !== 'string') why.push(r.id + ' shut with no lane');
    const L = r.look;
    if (!L) { why.push(r.id + ' no look'); return; }
    if (looks[L]) why.push(r.id + ' and ' + looks[L] + ' are one face'); looks[L] = r.id;
    if (CREW.has(L)) why.push(r.id + ' wears a company face ' + L);
    const fdir = path.join(BARBER, L, 'face');
    ['rest', 'A', 'E', 'O', 'M'].forEach(k => { if (!fs.existsSync(path.join(fdir, k + '_128.png'))) why.push(r.id + ' face ' + k + ' missing for ' + L); });
    if (!fs.existsSync(path.join(BARBER, L, 'rig_SE.png'))) why.push(r.id + ' no body for ' + L);
  });
  return why;
}
{
  const plantA = ROWS.slice(1), plantB = ROWS.map((r, i) => i === 0 ? Object.assign({}, r, { look: [...CREW].filter(x => x !== 'you')[0] }) : r),
    plantC = ROWS.map((r, i) => i === 1 ? Object.assign({}, r, { look: ROWS[0].look }) : r);
  const reds = [fileWrong(plantA), fileWrong(plantB), fileWrong(plantC)].map(w => w.length > 0);
  ok('R1 PLANTED: a follower dropped, a company face, two alike: the file check says red to each', reds.every(Boolean), reds.join(','));
  const w = fileWrong(ROWS);
  ok('R1 THE FILE: all eighteen of Battle Brothers\' followers, each a person (name, who he was, his words), a price, his one effect in words and numbers; each his own face (rest and four mouths) and body, none of the company, no two alike',
    w.length === 0, w.slice(0, 4).join('; ') || ROWS.map(r => r.name).join(', '));
  ok('R1 THE FILE IS A MODDER\'S: in records/target/bb/ (the folder the game publishes and MODDING.md names), every field described in the file', fs.existsSync(path.join(ROOT, 'records/target/bb/retinue.json')) && !!FILE.fields && Object.keys(FILE.fields.value).length >= 10 && FILE.draft === true);
}

/* ---------------------------------------------------------------- R2 THE COPY IS THE FILE */
const ENGINE = fs.readFileSync(path.join(ROOT, 'engine/bohemia_camp.js'), 'utf8');
function copyOf(src) { const m = src.match(/\/\* __RETINUE_ROWS__ \*\/ ([\s\S]*?) \/\* \/__RETINUE_ROWS__ \*\//); try { return m ? JSON.parse(m[1]) : null; } catch (e) { return null; } }
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
{
  const planted = ENGINE.replace('"price": 200', '"price": 201').replace(/"price":200/, '"price":201');
  ok('R2 PLANTED: an engine copy one price off is caught', !same(copyOf(planted), ROWS));
  ok('R2 THE COPY IS THE FILE: engine/bohemia_camp.js carries the file\'s eighteen rows exactly (node tools/bohemia_retinue_bake.js writes it)', same(copyOf(ENGINE), ROWS));
}
/* the engine as a page loads it: no module, the copy, then as node reads it */
function enginePage(extra) {
  const store = {}; const win = { localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } } };
  win.window = win; const ctx = vm.createContext(win);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_camp.js'), 'utf8'), ctx);
  if (extra) extra.forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx));
  return win;
}
const W0 = enginePage(), C0 = W0.BohemiaCamp;
{
  const six = ['cook', 'scout', 'lookout', 'paymaster', 'blacksmith', 'surgeon'];
  const shut = ROWS.filter(r => r.shut).map(r => r.id), works = ROWS.filter(r => !r.shut).map(r => r.id);
  ok('R2 THE ENGINE\'S TABLES COME FROM IT: the six Battle Brothers ships in LIVE, the other twelve in MORE, READY the twelve\'s that work, the offer the file\'s eighteen with the working ones first',
    same(Object.keys(C0.LIVE).sort(), six.slice().sort()) && C0.MORE.length === 12 && same(Object.keys(C0.READY).sort(), works.filter(id => six.indexOf(id) < 0).sort())
      && C0.offer().length === 18 && same(C0.offer().slice(0, works.length).map(o => o.id).sort(), works.slice().sort()) && C0.offer().filter(o => o.soon).length === shut.length,
    works.length + ' work, ' + shut.length + ' shut: ' + shut.join(', '));
}

/* ---------------------------------------------------------------- R3 EACH HIRE MOVES HIS NUMBER */
function movers(C, rows) {
  const out = { moved: [], still: [] };
  rows.forEach(r => {
    const k = Object.keys(r.nums || {}).filter(q => typeof r.nums[q] === 'number')[0];
    if (!k) { out.still.push(r.id + ':no number'); return; }
    C.retinue().forEach(id => C.letGo(id));
    const isMult = r.nums[k] > 0 && r.nums[k] < 1 || /^(travel|open|food|repair|tape|wage|renown|xpFirst|relFade|relMend|hire)$/.test(k);
    const without = isMult ? C.mult(k) : C.plus(k); C.hire(r.id); const withHim = isMult ? C.mult(k) : C.plus(k); C.letGo(r.id);
    (withHim !== without ? out.moved : out.still).push(r.id + ' ' + k + ' ' + without + '->' + withHim);
  });
  return out;
}
{
  const W1 = enginePage(), C1 = W1.BohemiaCamp;
  const plantedRow = Object.assign({}, ROWS[0], { id: 'planted', nums: {} });
  const pm = movers(C1, [plantedRow]);
  ok('R3 PLANTED: a follower with no number moves nothing and is caught', pm.moved.length === 0 && pm.still.length === 1, pm.still.join());
  const m = movers(C1, ROWS);
  ok('R3 EACH HIRE MOVES HIS NUMBER: all eighteen, measured with him and without', m.moved.length === 18 && m.still.length === 0, m.still.join('; ') || m.moved.length + ' moved');
  const shutOk = ROWS.filter(r => r.shut).every(r => /[A-Z]{3,}|nobody yet/.test(r.shut));
  ok('R3 THE SHUT ONES SAY WHY: each names the lane whose screen will do his work (nobody pays for help that never comes)', shutOk, ROWS.filter(r => r.shut).map(r => r.id).join(', '));
  /* the price: the file's, the paymaster's 15 percent off everybody else */
  C1.retinue().forEach(id => C1.letGo(id));
  const p0 = C1.price('cook'); C1.hire('paymaster'); const p1 = C1.price('cook'), pp = C1.price('paymaster'); C1.letGo('paymaster');
  const cook = ROWS.find(r => r.id === 'cook'), pay = ROWS.find(r => r.id === 'paymaster');
  ok('R3 THE PRICE IS THE FILE\'S: bought once, the paymaster takes 15 percent off every other follower, never his own', p0 === cook.price && p1 === Math.round(cook.price * pay.nums.wage) && pp === pay.price, p0 + ' -> ' + p1 + ', his own ' + pp);
}

/* ---------------------------------------------------------------- R7 THE NEGOTIATOR (engine half) */
{
  const R = require(path.join(ROOT, 'engine/bohemia_relations.js'));
  const neg = ROWS.find(r => r.id === 'negotiator').nums;
  const a = { bars: { up: 80, down: 20 } }, b = { bars: { up: 80, down: 20 } };
  R.dawn(a, 8); R.dawn(b, 8, { fade: neg.relFade, mend: neg.relMend });
  const control = { bars: { up: 80, down: 20 } }; R.dawn(control, 8, { fade: 1, mend: 1 });
  ok('R7 PLANTED: the dawn with numbers of 1 is the dawn without him', same(control.bars, a.bars));
  ok('R7 THE NEGOTIATOR, IN THE RELATIONS: eight dawns, a good word (80) fades less with him and a grudge (20) mends more',
    b.bars.up > a.bars.up && b.bars.down > a.bars.down && b.bars.up < 80 && b.bars.down < 50, JSON.stringify(a.bars) + ' without, ' + JSON.stringify(b.bars) + ' with');
}

/* ---------------------------------------------------------------- R8 ONE ID (engine half) */
{
  const W8 = enginePage(['engine/bohemia_people_mix.js', 'engine/bohemia_rig_bodies.js']), C8 = W8.BohemiaCamp, B8 = W8.BohemiaRigBodies;
  const look = ROWS.find(r => r.id === 'cook').look;
  const dealtBefore = B8.cast(400, 'retinue-gate').indexOf(look) >= 0;
  C8.hire('cook');
  const t0 = Date.now(); while (Date.now() - t0 < 1100) { /* the cast reads the retinue once a second */ }
  const dealtAfter = B8.cast(400, 'retinue-gate').indexOf(look) >= 0;
  ok('R8 PLANTED: before she joins, her face is dealt to the streets (so the check below is real)', dealtBefore);
  ok('R8 ONE ID, ONE WHOLE PERSON: once she is with you, her face is dealt to nobody\'s street', !dealtAfter && B8.isCompany(look));
}

/* ---------------------------------------------------------------- the browser legs */
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.css': 'text/css' };
let serveRows = null;
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (serveRows && u === '/records/target/bb/retinue.json') { rs.setHeader('content-type', 'application/json'); return rs.end(JSON.stringify(Object.assign({}, FILE, { followers: { value: serveRows } }))); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium; try { chromium = require('playwright').chromium; } catch (e) { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  const b = await chromium.launch();
  const errs = [];
  const page = async (vp) => {
    const ctx = await b.newContext({ viewport: vp || { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaCamp, null, { timeout: 30000 });
    await p.waitForFunction(() => BohemiaCamp.LOADED && BohemiaCamp.LOADED.read, null, { timeout: 8000 }).catch(() => {});
    await p.evaluate(() => { localStorage.removeItem('bohemia.camp.v1'); });
    return { ctx, p };
  };
  const hall = async (p, name, day, batteries) => {
    if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(250); }
    await p.evaluate(o => BohemiaSettlement.open({ place: { name: o.name, tier: 'town' }, traits: [], day: o.day, batteries: o.batteries }), { name, day, batteries });
    await p.waitForTimeout(400);
    const xy = await p.evaluate(() => BohemiaSettlement.where('hall')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(500);
    await p.waitForFunction(() => Array.from(document.querySelectorAll('#sbody .retf')).every(c => { const f = c.querySelector('canvas.face'), g = c.querySelector('.rfig'); return f && f.dataset.face !== 'fresh' || true; }), null, { timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(1500);   /* the faces and the bodies come in */
    return p.evaluate(() => Array.from(document.querySelectorAll('#sbody .retf')).map(c => { const f = c.querySelector('canvas.face'), btn = c.querySelector('button.act'), r = c.getBoundingClientRect();
      return { id: c.dataset.id, look: c.dataset.look, face: f ? f.dataset.face : null, faceLook: f ? f.dataset.look : null, h: Math.round(r.height),
        name: (c.querySelector('.rname b') || {}).textContent, does: (c.querySelector('.rdoes') || {}).textContent, shut: btn ? btn.disabled : null, btn: btn ? btn.textContent : null, price: btn ? +btn.dataset.price : null,
        bh: btn ? Math.round(btn.getBoundingClientRect().height) : 0 }; }));
  };
  /* a tap on his name opens the rest of him: his whole body (the same look), who he was, his words */
  const openOne = async (p, id) => {
    const el = await p.$('#sbody .retf[data-id="' + id + '"] .rname'); if (!el) return null; await el.scrollIntoViewIfNeeded(); const bb = await el.boundingBox();
    await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(1500);
    return p.evaluate(id => { const c = document.querySelector('#sbody .retf[data-id="' + id + '"]'), g = c && c.querySelector('.rfig');
      return { open: !!c && c.classList.contains('open'), body: g && g.dataset.drawn === '1' ? g.dataset.look : null, was: !!(c && c.querySelector('.rwas')), says: !!(c && c.querySelector('.rsays')), heard: document.getElementById('heard').textContent }; }, id);
  };
  const BY = {}; ROWS.forEach(r => { BY[r.id] = r; });
  try {
    /* ---- R4 A MODDER'S EDIT IS THE GAME'S ---- */
    {
      serveRows = ROWS.map(r => Object.assign({}, r, { name: 'MODDED ' + r.name, price: r.price + 77 }));
      const { ctx, p } = await page();
      const read = await p.evaluate(() => ({ loaded: BohemiaCamp.LOADED.read, cook: BohemiaCamp.row('cook').name, price: BohemiaCamp.price('cook') }));
      const cards = await hall(p, 'MODDED TOWN', 4, 900);
      ok('R4 A MODDER\'S EDIT IS THE GAME\'S: every row renamed and 77 dearer in the served file, and the town\'s cards say so (the game reads the file at load)',
        read.loaded && read.cook === 'MODDED ' + BY.cook.name && read.price === BY.cook.price + 77 && cards.length > 0 && cards.every(c => /^MODDED /.test(c.name || '') && c.price === BY[c.id].price + 77),
        JSON.stringify(read) + ' ' + cards.map(c => c.name + ' / ' + c.btn).join('; '));
      await ctx.close(); serveRows = null;
    }
    if (PLANT) serveRows = ROWS.map((r, i) => Object.assign({}, r, { look: 'person_nobody_' + i }));
    /* ---- R5 HIRED IN A TOWN, WITH A FACE ---- */
    {
      const { ctx, p } = await page();
      const per = FILE.met_per_place.value;
      const c0 = await hall(p, 'CHURCH', 4, 900);
      const want = id => (serveRows ? serveRows : ROWS).find(r => r.id === id).look;
      const wrongFace = c0.filter(c => c.face !== 'fresh' || c.faceLook !== want(c.id));
      ok('R5 A TOWN\'S HALL HOLDS THE FILE\'S FEW, EACH AS HIMSELF: his own face (fresh, his look), his name and what he does, A ROW A PERSON (no row over 90 px, the button 44 px: rule 402 amended)',
        c0.length === per && wrongFace.length === 0 && c0.every(c => c.name && c.does && c.h <= 90 && c.bh >= 44), c0.map(c => c.id + ':' + c.face + ' ' + c.h + 'px').join(', ') + (wrongFace.length ? ' WRONG ' + wrongFace.map(c => c.id).join(',') : ''));
      const o5 = c0[0] ? await openOne(p, c0[0].id) : null;
      ok('R5 A TAP ON HIM OPENS THE REST OF HIM: his whole body (the same look as his face), who he was, his own words, said out of his mouth',
        !!o5 && o5.open && o5.body === want(c0[0].id) && o5.was && o5.says && o5.heard.length > 10, JSON.stringify(o5));
      ok('R5 NO NAME, NO PLACE BY THE FIRE: with no CLOUT every hire is shut', c0.length > 0 && c0.every(c => c.shut === true), c0.map(c => c.shut).join(','));
      const same4 = (await hall(p, 'CHURCH', 6, 900)).map(c => c.id).join(','), next = (await hall(p, 'CHURCH', 11, 900)).map(c => c.id).join(','), other = (await hall(p, 'HENDERSON', 4, 900)).map(c => c.id).join(',');
      ok('R5 THE SAME FEW ALL WEEK, NEW ONES THE NEXT, ANOTHER TOWN ITS OWN', same4 === c0.map(c => c.id).join(',') && (next !== same4 || other !== same4), [c0.map(c => c.id).join(','), same4, next, other].join(' | '));
      await p.evaluate(() => BohemiaRenown.add(300, 'the gate: a first place', 'gate:retinue'));
      const c1 = await hall(p, 'CHURCH', 4, 900);
      const pick = c1.find(c => !c.shut);
      const n0 = await p.evaluate(() => (window.__settleLog || []).length);
      if (pick) { const bx = await p.$('#sbody .retf[data-id="' + pick.id + '"] button.act'); await bx.scrollIntoViewIfNeeded(); const bb = await bx.boundingBox(); await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(600); }
      const after = await p.evaluate(n => ({ ret: BohemiaCamp.retinue(), met: BohemiaCamp.state().met || {}, log: (window.__settleLog || []).slice(n).filter(m => m.act === 'retinue'), left: Array.from(document.querySelectorAll('#sbody .retf')).map(c => c.dataset.id) }), n0);
      const lg = after.log[0];
      ok('R5 A REAL TAP TAKES HIM ON: he is in the retinue, his price once, the map told (the retinue posted, its batteries)',
        !!pick && after.ret.length === 1 && after.ret[0] === pick.id && !!lg && lg.follower === pick.id && lg.price === BY[pick.id].price && lg.batteries === 900 - BY[pick.id].price && after.met[pick.id] === 'CHURCH',
        (pick ? pick.id : 'nobody open') + ' ' + JSON.stringify(after));
      ok('R5 THE REST OF THE HAND STAYS: the others still there, he is not', !!pick && after.left.indexOf(pick.id) < 0 && c1.filter(c => c.id !== pick.id).every(c => after.left.indexOf(c.id) >= 0), after.left.join(','));
      await ctx.close();
    }
    /* ---- R6 THE CAMP SHOWS HIM ---- */
    {
      const { ctx, p } = await page({ width: 844, height: 390 });
      const ids = ['cook', 'blacksmith', 'scavenger'];
      await p.evaluate(ids => { ids.forEach(id => BohemiaCamp.hire(id)); BohemiaRenown.add(1000, 'the gate', 'gate:retinue'); }, ids);
      await p.evaluate(() => BohemiaSettlement.open({ place: { name: 'YOUR CAMP', tier: 'camp', block: [3, 4] }, camp: true, day: 2, min: 600, traits: [],
        company: [{ name: 'DESI', look: 'person_town_0' }, { name: 'RAUL', look: 'person_town_1' }] }));
      for (let i = 0; i < 40; i++) { const st = await p.evaluate(() => window.BohemiaCampBoard ? BohemiaCampBoard.state().state : 'none'); if (st === 'in' || st === 'failed') break; await p.waitForTimeout(500); }
      await p.waitForTimeout(2500);
      await p.addScriptTag({ url: '/slices/bohemia_ui_no_scroll.js' }); await p.waitForTimeout(600);   /* the cut plants the fitter in this frame; the bare page does not (rule 402 is measured as he sees it) */
      const st = await p.evaluate(() => { const L = BohemiaCampLook.state(), F = BohemiaSettlement.folk();
        return { pieces: L.pieces.filter(q => q.kind === 'follower').map(q => ({ id: q.follower, x: q.x, y: q.y })), men: F.filter(f => f.campFollower).map(f => ({ id: f.follower, look: f.look, x: f.x, y: f.y })),
          drawn: Object.assign({}, (BohemiaCampLook.debug ? BohemiaCampLook.debug() : {}).drawnBy || {}) }; });
      const near = ids.every(id => { const pc = st.pieces.find(q => q.id === id), m = st.men.find(q => q.id === id); return pc && m && m.look === BY[id].look && Math.hypot(pc.x - m.x, pc.y - m.y) < 90; });
      ok('R6 THE CAMP SHOWS HIM: every follower with you stands by his own piece as himself (his look), turned to the fire', near && st.men.length === ids.length, JSON.stringify(st.men));
      /* a real tap on one of them opens the retinue, a face on every row */
      const m0 = st.men[0];
      const xy = await p.evaluate(m => { const v = BohemiaSettlement.camp2().view, s = BohemiaSettlement.scale(), r = document.getElementById('scene').getBoundingClientRect();
        return { x: r.left + v.ox + m.x * v.s, y: r.top + v.oy + (m.y - s.person * 0.45) * v.s }; }, m0);
      await p.touchscreen.tap(xy.x, xy.y); await p.waitForTimeout(900);
      const sheet = await p.evaluate(() => ({ open: BohemiaSettlement.state.open,
        tiles: Array.from(document.querySelectorAll('#sbody .rett')).map(c => ({ id: c.dataset.id, with: c.classList.contains('with'), sel: c.classList.contains('sel'), face: (c.querySelector('canvas.face') || { dataset: {} }).dataset.look, btn: !!c.querySelector('button.act'), bh: Math.round((c.querySelector('button.act') || { getBoundingClientRect: () => ({ height: 0 }) }).getBoundingClientRect().height) })),
        detail: (document.querySelector('#sbody .retdetail') || { dataset: {} }).dataset.id }));
      const over6 = await p.evaluate(() => { const sh = document.getElementById('sheet'); return sh.scrollHeight - sh.clientHeight; });
      ok('R6 THE CAMP\'S LIST IS ONE GLASS on the phone on its side (390 tall), all eighteen in it, no scrolling (rule 402)', over6 <= 2, over6 + ' px over');
      ok('R6 A TAP ON HIM OPENS THE RETINUE: all eighteen, each his own face and his own 44 px button, the ones with you first, him picked and his line under them',
        /^f_/.test(sheet.open || '') && sheet.tiles.length === 18 && sheet.tiles.every(t => t.face === BY[t.id].look && t.btn && t.bh >= 44)
          && sheet.tiles.slice(0, ids.length).every(t => t.with && ids.indexOf(t.id) >= 0) && sheet.tiles.filter(t => t.sel).map(t => t.id).join() === m0.id && sheet.detail === m0.id,
        'tapped ' + m0.id + ' -> ' + sheet.open + ', ' + sheet.tiles.length + ' tiles, first ' + sheet.tiles.slice(0, 3).map(t => t.id).join(',') + ', picked ' + sheet.tiles.filter(t => t.sel).map(t => t.id) + ', line ' + sheet.detail);
      if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(250); }
      /* ---- R7 THE NEGOTIATOR at the town's own dawn (the screen's relDawn, eight dawns since he was last there) ---- */
      await p.waitForFunction(() => window.BohemiaRelations && BohemiaSettlement.state, null, { timeout: 5000 }).catch(() => {});
      await p.waitForTimeout(500);
      const r7 = await p.evaluate(() => {
        const run = (withHim, start) => { if (withHim) BohemiaCamp.hire('negotiator'); else BohemiaCamp.letGo('negotiator');
          BohemiaSettlement.state.rel = { bars: { DAWNTOWN: start }, seen: { DAWNTOWN: 1 } };
          BohemiaSettlement.open({ place: { name: 'DAWNTOWN', tier: 'town' }, traits: [], day: 9 });
          return BohemiaSettlement.state.rel.bars.DAWNTOWN; };
        const o = { upWithout: run(false, 80), upWith: run(true, 80), downWithout: run(false, 20), downWith: run(true, 20) }; BohemiaCamp.letGo('negotiator'); return o; });
      await ctx.close();
      ok('R7 THE NEGOTIATOR AT THE TOWN\'S DAWN: eight dawns at a town, its good word (80) fades less with him and its grudge (20) mends more',
        r7.upWith > r7.upWithout && r7.upWithout < 80 && r7.downWith > r7.downWithout && r7.downWithout > 20, JSON.stringify(r7));
    }
  } catch (e) { ok('the browser legs ran', false, String(e && e.stack || e).slice(0, 400)); }
  ok('nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close(); srv.close();
  /* ---- R9 ON THE DEMO: the cut, the map, the town, the hall, a real tap ---- */
  if (!PLANT) try {
    const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
    const d = await drive.open({ profile: 'phone_portrait', beforeTap: async (p) => { await throughTheTitle(p); } });
    const p = d.page, fr = d.fr, derr = []; p.on('pageerror', e => derr.push(e.message));
    await p.waitForTimeout(3000);
    const town = await fr.evaluate(() => { const t = loopTownAt(city.x, city.y, 30); if (t) { loopOpenTown(t); return t.name || true; } return null; });
    await p.waitForTimeout(6000);
    let sf = null; for (let k = 0; k < 60 && !sf; k++) { for (const x of p.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) sf = x; if (!sf) await p.waitForTimeout(250); }
    if (!sf) ok('R9 ON THE DEMO: a town opens', false, 'town ' + town + ', no town screen');
    else {
      await fr.evaluate(() => { BohemiaRenown.add(300, 'the gate: a first place', 'gate:retinue'); loopSettleBats(loopBats() + 400, 'the gate'); });
      await p.waitForTimeout(800);
      const box = await (await sf.frameElement()).boundingBox(), w = await sf.evaluate(() => BohemiaSettlement.where('hall'));
      await p.touchscreen.tap(box.x + w.x, box.y + w.y); await p.waitForTimeout(3500);
      const h = await sf.evaluate(() => { const sh = document.getElementById('sheet');
        return { over: sh.scrollHeight - sh.clientHeight, rows: Array.from(document.querySelectorAll('#sbody .retf')).map(c => ({ id: c.dataset.id, face: (c.querySelector('canvas.face') || { dataset: {} }).dataset.face, look: (c.querySelector('canvas.face') || { dataset: {} }).dataset.look, open: !(c.querySelector('button.act') || {}).disabled, price: +(c.querySelector('button.act') || { dataset: {} }).dataset.price })) }; });
      ok('R9 ON THE DEMO: ' + town + '\'s hall shows the file\'s few, each his own fresh face, and the hall is one glass with them in it (rule 402)',
        h.rows.length === FILE.met_per_place.value && h.rows.every(r => r.face === 'fresh' && r.look === BY[r.id].look) && h.over <= 2, JSON.stringify(h));
      const pick = h.rows.find(r => r.open);
      const b0 = await fr.evaluate(() => loopBats());
      if (pick) { const bt = await sf.$('#sbody .retf[data-id="' + pick.id + '"] button.act'); await bt.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); const bb = await bt.boundingBox(); await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(1500); }
      const a = await fr.evaluate(b0 => ({ map: Object.keys(CT_FOLLOWERS || {}), ret: BohemiaCamp.retinue(), paid: b0 - loopBats() }), b0);
      ok('R9 ON THE DEMO: a real tap takes him on: the map\'s own retinue has him, his price taken from the map\'s batteries once',
        !!pick && a.map.indexOf(pick.id) >= 0 && a.ret.indexOf(pick.id) >= 0 && a.paid === pick.price, (pick ? pick.id : 'none open') + ' ' + JSON.stringify(a));
    }
    ok('R9 ON THE DEMO: nothing threw', derr.length === 0, derr.slice(0, 2).join(' | '));
    await d.close().catch(() => {});
  } catch (e) { ok('R9 the demo legs ran', false, String(e && e.stack || e).slice(0, 300)); }
  console.log('THE RETINUE: ' + pass + ' ok, ' + fail + ' failed' + (PLANT ? '  (PLANTED: every face nobody\'s; this run must fail)' : ''));
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
