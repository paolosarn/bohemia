/* ==========================================================================
   ONE COMPANY: A MAN LET GO IS GONE EVERYWHERE  (PLUMBER 2, 11/2/26, rule 327, ask line 325)

   PAOLO 11/2: "when I dismiss someone from my group, they have to be gone from all my [menus]... it's supposed to be this
   universal code thing, come on... I dismiss someone in the camp, in the settlements, when I'm in the menu trying to buy
   items, it still thinks they're part of my squad... come on."
   MEASURED BEFORE: the crew screen's DISMISS wrote the man into bohemia.walked.v1 and left a hired man in bohemia.hired.v1; the
   shop's list (its green 'on him' mark, and his men in the town's picture) merged the hired back in and never read the let-go
   list, so the man was back in every shop. The map's count was a sum of four lists.
   THE ONE TRUTH: engine/bohemia_hire_lock.js  BohemiaHireLock.company() / count() / isGone() / dismiss() / onChange().

   LEGS (a company of twelve, three men hired at a post, one let go from each place he can be let go):
     O1 the three hires are in the company and on the shop's list before anything (the gate measures what it claims)
     O2 *** LET GO IN A TOWN ***: the crew screen opened from a town, DISMISS, YES, DONE: he is gone from the shop's list, from every
        shop mark (every piece on the smith's and the armourer's shelves), from the town's picture, from the one company, and from
        every saved list (the hired, the hand-over, the line)
     O3 *** LET GO AT CAMP ***: the same from a camp: gone from all of it and from the men round the fire
     O4 *** LET GO ON THE CREW SCREEN ALONE *** (from the map): gone from all of it
     O5 THE COUNT: the one company's count is the crew screen's own line (the men on it), opened again after the three let go
     O6 THE MAP'S BAR: the map's own count (crewCount: the bar, the bill, the fight's size) is the same number, and none of the three
        is among the men the marker draws
     O7 AN OLD GAME IS MENDED: a man let go in an old save who still sits in the hired, the hand-over and the line is taken out of
        them when the game is opened
     O8 EVERY DOOR WRITES ONCE: the crew screen's DISMISS and the road's 'a man leaves' call the one write; the shop, the map's count,
        the camp's fire and the phone read the one list
     O9 nothing threw
   node gates/one_company_a_man_let_go_is_gone_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('ONE COMPANY, A MAN LET GO IS GONE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const HIRES = ['RAMON CRUZ', 'TITO VEGA', 'BENNY SOTO'];

/* the founding twelve as the crew screen keeps them, and three men hired at a post (the settlement's own row shape) */
const SEED = (names) => {
  ['bohemia.company.v1', 'bohemia.company.line.v1', 'bohemia.hired.v1', 'bohemia.walked.v1', 'bohemia.climb.v1', 'bohemia.taken.v1', 'bohemia.fight.after.v1', 'bohemia.formation.v1', 'bohemia.bag.v1'].forEach(k => localStorage.removeItem(k));
  const C = BohemiaRoster, crew = C.company(C.startingCrew()), used = {}; crew.forEach(m => { used[m.look] = 1; });
  localStorage.setItem('bohemia.company.v1', JSON.stringify(crew));
  const more = (window.BOHEMIA_PEOPLE_MIX ? BOHEMIA_PEOPLE_MIX.people : []).filter(x => x.fight && !used[x.look] && x.sex !== 'f');
  const hired = names.map((n, i) => { const m = C.manOf({ name: n, background: 'farmhand' }, crew.length + i);
    return { name: n, hid: 'g' + i, day: 2, background: 'farmhand', level: 1, stats: m.stats, base: m.stats, traits: [], trait: null, stars: {}, look: (more[i] && more[i].look) || m.look, kit: [], gear: {} }; });
  localStorage.setItem('bohemia.hired.v1', JSON.stringify(hired));
  return crew.length + hired.length;
};
/* everywhere the settlement screen lists his men, and the saved lists */
const LOOK = (names) => {
  const S = BohemiaSettlement, out = { shop: [], marks: [], town: [], camp: [], one: [], hired: [], hand: [], lineMen: [], known: [] };
  try { out.shop = S.shopCrew().map(m => m.name); } catch (e) { out.shop = ['ERR ' + e.message]; }
  try { const st = S.state.stock || {}; ['arms', 'smith', 'armourer'].forEach(k => (st[k] || []).forEach(it => { try { const n = S.shopMark(it); if (n) out.marks.push(n); } catch (e) {} })); } catch (e) {}
  try { out.town = S.crewTown().map(m => m.name); } catch (e) {}
  try { out.camp = S.folk().filter(f => f && (f.campMan || f.crewMan)).map(f => f.name); } catch (e) {}
  out.one = BohemiaHireLock.company().map(m => m.name);
  const ls = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  out.hired = (ls('bohemia.hired.v1') || []).map(h => h.name); out.hand = (ls('bohemia.company.v1') || []).map(m => m.name);
  const L = ls('bohemia.company.line.v1') || {}; out.lineMen = L.men || []; out.known = L.known || [];
  out.marksN = out.marks.length;
  out.seen = {}; names.forEach(n => { out.seen[n] = Object.keys(out).filter(k => Array.isArray(out[k]) && out[k].indexOf(n) >= 0); });
  return out;
};

(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const URL0 = 'http://127.0.0.1:' + srv.address().port;
  const { chromium } = require('playwright');
  const b = await chromium.launch(), errs = [];
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push('settlement: ' + e.message));
  const boot = async () => {
    await p.goto(URL0 + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaRoster && window.BohemiaHireLock, null, { timeout: 40000 });
    await p.waitForFunction(() => BohemiaRoster.data && BohemiaRoster.data.xp && BohemiaRoster.worn, null, { timeout: 30000 }).catch(() => {});
  };
  const openPlace = async (name, tier, camp) => {
    await p.evaluate(o => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click();
      BohemiaSettlement.open(Object.assign({ place: { name: o.name, tier: o.tier }, traits: [], day: 3, batteries: 500 }, o.camp ? { camp: true, min: 20 * 60, company: BohemiaHireLock.company().filter(m => !m.main).map(m => ({ name: m.name, look: m.look })) } : {})); }, { name, tier, camp });
    await p.waitForTimeout(900);
  };
  /* the crew screen from the place's own CREW button: pick the man, DISMISS, YES, DONE */
  const letGo = async (who) => {
    await p.evaluate(() => document.getElementById('crew').click());
    let rf = null; for (let k = 0; k < 60 && !rf; k++) { await p.waitForTimeout(250); rf = p.frames().find(x => /ROSTER_SCREEN/.test(x.url())); }
    if (!rf) return { opened: false };
    await rf.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
    await p.waitForTimeout(400);
    const r = await rf.evaluate((n) => { const R = BohemiaRosterScreen, S = R.state, i = S.crew.findIndex(m => m.name === n); if (i < 0) return { found: false, n: S.crew.length };
      R.choose(i); const d = document.getElementById('dismiss'); if (!d) return { found: true, button: false }; d.click();
      const y = document.getElementById('letgo'); if (!y) return { found: true, button: true, yes: false }; y.click();
      return { found: true, button: true, yes: true, after: S.crew.map(m => m.name), n: S.crew.length, dismissed: window.__DISMISSED && window.__DISMISSED.name }; }, who);
    await rf.evaluate(() => { const d = document.getElementById('done'); if (d) d.click(); });
    await p.waitForTimeout(900);
    r.opened = true; return r;
  };

  try {
    await boot();
    const total = await p.evaluate(SEED, HIRES);
    await openPlace('GOODSPRINGS', 'town');
    await p.waitForFunction(() => BohemiaSettlement.shopCrew().length > 3, null, { timeout: 15000 }).catch(() => {});
    await p.evaluate(n => { BohemiaSettlement.state.shopMan = n; }, HIRES[0]);   /* he picked the man on the shop's card: every mark names him */
    const L0 = await p.evaluate(LOOK, HIRES);
    ok('O1 the three hires are in the company and on the shop\'s list before anything (' + total + ' men seeded; the one company ' + L0.one.length + ', the shop ' + L0.shop.length + ')',
      HIRES.every(n => L0.one.indexOf(n) >= 0 && L0.shop.indexOf(n) >= 0) && L0.one.length === total && L0.marks.length > 0 && L0.marks.every(n => n === HIRES[0]), HIRES.map(n => n + ': ' + L0.seen[n].join(',')).join(' | ') + ' | marks ' + L0.marks.length);

    /* O2 a town */
    const r2 = await letGo(HIRES[0]);
    await openPlace('GOODSPRINGS', 'town');
    const L2 = await p.evaluate(LOOK, HIRES);
    ok('*** O2 LET GO IN A TOWN *** (' + HIRES[0] + ': the crew screen from the town\'s CREW, DISMISS, YES, DONE): on none of the shop\'s list, the ' + L2.marksN + ' shop marks, the town\'s picture, the one company, the hired, the hand-over, the line',
      r2.opened && r2.yes && r2.dismissed === HIRES[0] && L2.seen[HIRES[0]].length === 0 && L2.marksN > 0 && L2.seen[HIRES[1]].indexOf('one') >= 0,
      JSON.stringify({ r: { opened: r2.opened, found: r2.found, yes: r2.yes, d: r2.dismissed }, still: L2.seen[HIRES[0]] }));

    /* O3 a camp */
    await openPlace('DRY WELL', 'camp', true);
    await p.waitForFunction(() => BohemiaSettlement.folk().some(f => f && f.campMan && f.name), null, { timeout: 15000 }).catch(() => {});
    const L3pre = await p.evaluate(LOOK, HIRES);
    const r3 = await letGo(HIRES[1]);
    const L3 = await p.evaluate(LOOK, HIRES);
    ok('*** O3 LET GO AT CAMP *** (' + HIRES[1] + ', from the camp\'s CREW): on none of the lists, the men round the fire included (' + L3pre.camp.length + ' at the fire before, him among them: ' + (L3pre.camp.indexOf(HIRES[1]) >= 0) + '; ' + L3.camp.length + ' after)',
      r3.opened && r3.yes && r3.dismissed === HIRES[1] && L3pre.camp.indexOf(HIRES[1]) >= 0 && L3.camp.length > 0 && L3.seen[HIRES[1]].length === 0 && L3.seen[HIRES[0]].length === 0,
      JSON.stringify({ r: { opened: r3.opened, found: r3.found, yes: r3.yes, d: r3.dismissed }, still: L3.seen[HIRES[1]], first: L3.seen[HIRES[0]] }));

    /* O4 the crew screen alone (the map's C) */
    const rp = await ctx.newPage(); rp.on('pageerror', e => errs.push('crew screen: ' + e.message));
    await rp.goto(URL0 + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
    await rp.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
    await rp.waitForTimeout(500);
    const r4 = await rp.evaluate((n) => { const R = BohemiaRosterScreen, S = R.state, i = S.crew.findIndex(m => m.name === n); if (i < 0) return { found: false };
      R.choose(i); document.getElementById('dismiss').click(); document.getElementById('letgo').click(); return { found: true, dismissed: window.__DISMISSED && window.__DISMISSED.name }; }, HIRES[2]);
    await p.waitForTimeout(600);
    await openPlace('GOODSPRINGS', 'town');
    const L4 = await p.evaluate(LOOK, HIRES);
    ok('*** O4 LET GO ON THE CREW SCREEN ALONE *** (' + HIRES[2] + ', the screen the map\'s C opens): none of the three anywhere in the town\'s screen or the saved lists',
      r4.found && r4.dismissed === HIRES[2] && HIRES.every(n => L4.seen[n].length === 0), JSON.stringify({ r4, still: HIRES.map(n => n + ':' + L4.seen[n].join(',')) }));

    /* O5 the count is the crew screen's own line */
    await rp.reload({ waitUntil: 'load' });
    await rp.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
    await rp.waitForTimeout(500);
    const cs = await rp.evaluate(() => ({ crew: BohemiaRosterScreen.state.crew.filter(m => !m.dead).map(m => m.name), count: BohemiaHireLock.count() }));
    const one = await p.evaluate(() => ({ count: BohemiaHireLock.count(), names: BohemiaHireLock.company().map(m => m.name) }));
    ok('O5 THE COUNT: the one company counts ' + one.count + ', the crew screen opened again lists ' + cs.crew.length + ' (' + (total - 3) + ' expected), none of the three on it',
      one.count === cs.crew.length && cs.count === cs.crew.length && cs.crew.length === total - 3 && HIRES.every(n => cs.crew.indexOf(n) < 0), cs.crew.join(', '));

    /* O6 the map's own count, the bar's number */
    const mp = await ctx.newPage(); let map = null;
    try {
      await mp.goto(URL0 + '/slices/BOHEMIA_CITY_WORLD.html', { waitUntil: 'load', timeout: 90000 });
      await mp.waitForFunction(() => typeof crewCount === 'function' && window.BohemiaHireLock, null, { timeout: 60000 });
      await mp.waitForTimeout(800);
      map = await mp.evaluate(() => { let looks = []; try { MAP_CREW_LOOKS.at = 0; looks = mapCrewLooks(); } catch (e) {} return { count: crewCount(), men: (crewMen() || []).map(m => m.name), looks }; });
    } catch (e) { map = { err: String(e.message).slice(0, 200) }; }
    const gone = await p.evaluate(() => (JSON.parse(localStorage.getItem('bohemia.walked.v1') || '[]') || []).map(w => w.look));
    ok('O6 THE MAP\'S BAR: the map\'s count (the bar, the bill, the fight\'s size) is ' + (map && map.count) + ', the crew screen\'s line ' + cs.crew.length + '; none of the three among the men the marker draws',
      !!map && map.count === cs.crew.length && HIRES.every(n => (map.men || []).indexOf(n) < 0) && !(map.looks || []).some(l => gone.indexOf(l) >= 0), JSON.stringify(map).slice(0, 300));
    await mp.close().catch(() => {});
    await rp.close().catch(() => {});

    /* O7 an old save, mended where it is read */
    await p.evaluate(() => {
      const co = JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]'), h = JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]');
      const old = { name: 'OLD PACO', look: co[1] && co[1].look, level: 1, stats: co[1] && co[1].stats, gear: {} };
      co.push(old); h.push({ name: 'OLD PACO', hid: 'old', background: 'farmhand', stats: old.stats, look: old.look, gear: {} });
      const L = JSON.parse(localStorage.getItem('bohemia.company.line.v1') || '{}') || {}; L.men = (L.men || []).concat(['OLD PACO']); L.known = (L.known || []).concat(['OLD PACO']);
      L.front = (L.front || []).slice(); L.front[L.front.indexOf(null) >= 0 ? L.front.indexOf(null) : 0] = co.length - 1;
      const w = JSON.parse(localStorage.getItem('bohemia.walked.v1') || '[]'); w.push({ name: 'OLD PACO', dismissed: true, day: 1 });
      localStorage.setItem('bohemia.company.v1', JSON.stringify(co)); localStorage.setItem('bohemia.hired.v1', JSON.stringify(h));
      localStorage.setItem('bohemia.company.line.v1', JSON.stringify(L)); localStorage.setItem('bohemia.walked.v1', JSON.stringify(w)); });
    await boot();
    const L7 = await p.evaluate(LOOK, ['OLD PACO']);
    const front = await p.evaluate(() => { const L = JSON.parse(localStorage.getItem('bohemia.company.line.v1') || '{}') || {}, n = (JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]') || []).length;
      return [].concat(L.front || [], L.back || []).every(i => i == null || (i >= 0 && i < n)); });
    ok('O7 AN OLD GAME IS MENDED: a man let go in an old save, still in the hired, the hand-over and the line, is out of all of them the moment the game opens (the line still points at real men)',
      L7.seen['OLD PACO'].length === 0 && front, L7.seen['OLD PACO'].join(','));

    /* O8 every door writes once, every list reads the one */
    const roster = read('slices/BOHEMIA_ROSTER_SCREEN.html'), settle = read('slices/BOHEMIA_SETTLEMENT_SCREEN.html'), cw = read('slices/BOHEMIA_CITY_WORLD.html'),
      road = read('slices/bohemia_road_events.js'), phone = read('slices/bohemia_phone.js'), lock = read('engine/bohemia_hire_lock.js');
    const shopFn = (settle.match(/function shopCrew\(\)\{[\s\S]*?\n\}/) || [''])[0], countFn = (cw.match(/function crewCount\(\)\{[\s\S]*?\n\}/) || [''])[0];
    const legs = {
      'the crew screen\'s DISMISS calls the one write': /function dismiss\(i\)\{[\s\S]{0,1600}BohemiaHireLock\.dismiss\(/.test(roster),
      'the road\'s "a man leaves" calls the one write': /function manOut\(\)[\s\S]{0,400}BohemiaHireLock\.dismiss\(/.test(road),
      'the shop\'s list reads the one company': /BohemiaHireLock\.company\(/.test(shopFn),
      'the map\'s count reads the one company': /crewMen\(\)/.test(countFn) && /BohemiaHireLock\.company\(/.test(cw),
      'the camp\'s fire leaves out the let-go': /function campFolk\(\)\{[\s\S]{0,900}campGone\(\)/.test(settle),
      'the phone\'s count reads the one company': /BohemiaHireLock\.company\(\)/.test(phone),
      'the hire lock exports the one truth': /company: company, count: count, isGone: isGone/.test(lock),
      'every screen that lists men loads the hire lock': ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_SETTLEMENT_SCREEN.html', 'slices/BOHEMIA_ROSTER_SCREEN.html'].every(f => /engine\/bohemia_hire_lock\.js/.test(read(f)))
    };
    const bad = Object.keys(legs).filter(k => !legs[k]);
    ok('O8 EVERY DOOR WRITES ONCE, EVERY LIST READS THE ONE (' + Object.keys(legs).length + ' wires)', bad.length === 0, bad.join(' | ') || 'all wired');
  } catch (e) { ok('the legs ran [' + String(e.stack || e.message).slice(0, 400) + ']', false); }
  ok('O9 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close(); srv.close(); done();
})();
