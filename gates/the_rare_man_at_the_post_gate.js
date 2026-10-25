/* ==========================================================================
   THE RARE MAN AT THE POST  (RUN TWO, 10/25/26, rule 183(a); TUNING's recruit.rare, the NOTE on RUN TWO's board)

   PAOLO 10/25: "there definitely isn't incentive for the first 50 days to grow your crew unless it's god-tier recruits."
   MEASURED before: the post dealt six lowborn backgrounds at level 1 (engine/bohemia_goodbros.js), so the god-tier man
   never existed. NOW (__THE_RARE_MAN_AT_THE_POST__, slices/BOHEMIA_SETTLEMENT_SCREEN.html, records/target/bb/rare_recruits.json):
   now and then a town's or a fortress's post slot holds a road knight, a gun for hire or a blade master, level 2 or 3,
   in the top quarter of his range with his levels taken, three talents, his own kit, priced on the hall's formula.

   LEGS:
     R1 the file: three men on real backgrounds, real kit rows, Battle Brothers' bases (150, 400 for the blade master),
        3 in 100 a slot, towns and fortresses only
     R2 *** RARE ***: over 400 weeks of a town's and a fortress's posts 2 to 4 slots in 100 hold one; never at a camp
     R3 he is made rare: level 2 or 3, every stat at or over the top quarter of his range, his three talents, his price the
        formula's (a level-2 road knight in his mid kit about 500)
     R4 *** HE READS AS RARE THE MOMENT HE IS MET *** (the phone): a gold frame, RARE, his level, what he wears, a line from
        his own mouth, three starred stats; and every card at the hall fits the 390 px phone (nothing past the card's edge,
        the sheet never scrolls sideways), plain weeks and his
     R5 on the demo, the map's own week, the town's own door: a real tap on his Hire takes his price, and he is on the crew
        screen at his level in his own kit (weapon, shield, body, helm), his numbers and stars, his line; the rest in the bag
     R6 the fight is handed his kit (nfOpts carries his shield and helm)
     R7 the computer: his card reads as rare and fits
     R8 nothing threw
   node gates/the_rare_man_at_the_post_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('THE RARE MAN AT THE POST: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });

const RARE = J('records/target/bb/rare_recruits.json'), BGS = J('records/target/bb/backgrounds.json').rows;
const W = J('records/target/bb/weapons.json').rows, A = J('records/target/bb/armor.json');
const STATS = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];
/* what a card shows and whether it fits, read in the settlement's frame */
const CARDS = () => [...document.querySelectorAll('#sheet.on .hire')].map(h => { const r = h.getBoundingClientRect(), cs = getComputedStyle(h);
  return { rare: h.classList.contains('rare'), id: h.dataset.id, out: [...h.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > r.right + 1).length,
    frame: /224, 173, 58|rgb\(224/.test(cs.boxShadow), badge: !!(h.querySelector('.hrare b') && /RARE/.test(h.querySelector('.hrare b').textContent)),
    line: (h.querySelector('.hrare') || {}).textContent || '', says: (h.querySelector('.hsays') || {}).textContent || '', stars: h.querySelectorAll('.hstats .star').length,
    btn: (h.querySelector('.act') || {}).textContent || '' }; });
const FITS = () => { const sh = document.getElementById('sheet'); return { sw: sh.scrollWidth, cw: sh.clientWidth }; };

(async () => {
  /* ---- R1 ---- */
  const bad = RARE.men.filter(m => !BGS.some(b => b.id === m.background) || Object.keys(m.stars).length !== 3 || !m.line
    || ['gun', 'main'].some(k => !W.some(r => r.id === m.kit[k])) || (m.kit.off && !A.shields.some(r => r.id === m.kit.off)) || (m.kit.body && !A.body.some(r => r.id === m.kit.body)) || (m.kit.head && !A.head.some(r => r.id === m.kit.head)));
  ok('R1 the file: a road knight, a gun for hire and a blade master on real backgrounds and real kit rows, bases 150 / 150 / 400, 3 in 100 a slot, towns and fortresses only',
    RARE.men.map(m => m.background).join() === 'hedge_knight,sellsword,swordmaster' && bad.length === 0 && RARE.men.map(m => m.base_crowns).join() === '150,150,400'
    && RARE.chance_per_slot === 0.03 && RARE.tiers.join() === 'town,fortress', bad.map(m => m.background).join() || 'all real');

  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch(), errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  const openAt = async (name, tier, day) => { await p.evaluate(o => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click();
    BohemiaSettlement.open({ place: { name: o.name, tier: o.tier }, traits: [], day: o.day, batteries: 2000 }); }, { name, tier, day });
    await p.waitForTimeout(400); await p.waitForFunction(() => BohemiaSettlement.ready() && BohemiaSettlement.rareOn() !== undefined, null, { timeout: 15000 }).catch(() => {}); };
  /* ---- R2, R3 ---- */
  await openAt('BLUE DIAMOND', 'town', 1);
  await p.waitForFunction(() => BohemiaSettlement.rareOn(), null, { timeout: 15000 }).catch(() => {});
  const odds = {};
  for (const [tier, name] of [['town', 'BLUE DIAMOND'], ['fortress', 'NELLIS GATE'], ['camp', 'DRY WELL']]) {
    await openAt(name, tier, 1);
    odds[tier] = await p.evaluate(() => { let n = 0, hit = 0; const men = [];
      for (let w = 0; w < 400; w++) { const key = BohemiaSettlement.rareKey(w * 7); for (let i = 0; i < 6; i++) { n++; const r = BohemiaSettlement.rareAt(key, i); if (r) { hit++; men.push(r); } } }
      return { n, hit, men: men.map(r => ({ bg: r.backgroundId, lv: r.level, stats: r.stats, tal: r.talents, price: null, base: r.baseCrowns })) }; });
  }
  const pct = t => Math.round(1000 * odds[t].hit / odds[t].n) / 10;
  ok('*** R2 RARE ***: 2 to 4 slots in 100 at a town and at a fortress, never at a camp (' + pct('town') + ' and ' + pct('fortress') + ' in 100 over 400 weeks of six slots; camp ' + odds.camp.hit + ')',
    pct('town') >= 2 && pct('town') <= 4 && pct('fortress') >= 2 && pct('fortress') <= 4 && odds.camp.hit === 0);
  const all = odds.town.men.concat(odds.fortress.men), kinds = [...new Set(all.map(m => m.bg))];
  const offTop = all.filter(m => { const row = BGS.find(r => r.id === m.bg), spec = RARE.men.find(x => x.background === m.bg);
    return !(m.lv >= 2 && m.lv <= 3) || m.tal.length !== 3 || STATS.some(k => { const r = row.stats[k], lo = r[0] + Math.ceil((r[r.length - 1] - r[0]) * RARE.stat_floor);
      return m.stats[k] < lo || (spec.plan.indexOf(k) < 0 && m.stats[k] > r[r.length - 1]); }); });
  /* the road knight's price, the formula read off its own files, against what his card asks */
  await openAt('NELLIS GATE', 'fortress', 1);
  const rk = await p.evaluate(() => { for (let w = 0; w < 400; w++) { const key = BohemiaSettlement.rareKey(w * 7); for (let i = 0; i < 6; i++) { const r = BohemiaSettlement.rareAt(key, i); if (r && r.backgroundId === 'hedge_knight' && r.level === 2) return { w, i }; } } return null; });
  let rkPrice = null;
  if (rk) { await openAt('NELLIS GATE', 'fortress', rk.w * 7 + 1); const hx = await p.evaluate(() => BohemiaSettlement.where('hall')); if (hx) await p.mouse.click(hx.x, hx.y); await p.waitForTimeout(900);
    rkPrice = await p.evaluate(() => { const h = document.querySelector('#sheet.on .hire.rare'); const m = h && h.querySelector('.act').textContent.match(/(\d+) batter/); return m ? +m[1] : null; }); }
  ok('R3 he is made rare: level 2 or 3, every stat in the top quarter of his range or past it by his levels, three talents; all three kinds dealt; a level-2 road knight costs about 500 (' + rkPrice + ')',
    all.length > 20 && offTop.length === 0 && kinds.length === 3 && rkPrice >= 450 && rkPrice <= 560, all.length + ' rare men, ' + offTop.length + ' off; kinds ' + kinds.join(' '));

  /* ---- R4 on the phone ---- */
  const fits = [], seen = [];
  for (const [tier, name, day] of [['camp', 'DRY WELL', 1], ['town', 'BLUE DIAMOND', 1], ['fortress', 'NELLIS GATE', 1], ['fortress', 'NELLIS GATE', (rk ? rk.w : 0) * 7 + 1]]) {
    await openAt(name, tier, day); const hx = await p.evaluate(() => BohemiaSettlement.where('hall')); if (hx) await p.mouse.click(hx.x, hx.y); await p.waitForTimeout(900);
    const cs = await p.evaluate(CARDS), fs2 = await p.evaluate(FITS); fits.push({ name, day, cards: cs.length, out: cs.reduce((a, c) => a + c.out, 0), sw: fs2.sw, cw: fs2.cw }); cs.filter(c => c.rare).forEach(c => seen.push(c)); }
  const rc = seen[0] || {};
  ok('*** R4 HE READS AS RARE THE MOMENT HE IS MET *** (a gold frame, RARE, his level, what he wears, his own line, three starred stats)',
    !!seen.length && rc.frame && rc.badge && /LEVEL [23]/.test(rc.line) && /FULL RIOT HELM|RIOT HELMET/.test(rc.line) && rc.says.length > 10 && rc.stars === 3, JSON.stringify({ line: rc.line, says: rc.says, stars: rc.stars, frame: rc.frame }));
  ok('R4b every card at the hall fits the 390 px phone, plain weeks and his (nothing past a card\'s edge, the sheet never scrolls sideways)',
    fits.every(f => f.cards > 0 && f.out === 0 && f.sw <= f.cw), fits.map(f => f.name + '/' + f.day + ': ' + f.cards + ' cards, ' + f.out + ' out, ' + f.sw + '/' + f.cw).join('; '));
  if (process.env.BOHEMIA_SHOT_DIR) { await p.evaluate(() => { const h = document.querySelector('#sheet.on .hire.rare'); if (h) h.scrollIntoView({ block: 'center' }); }); await p.waitForTimeout(500); await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'rare_card_phone.png') }); }
  ok('R8a nothing threw on the settlement screen', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();

  /* ---- R5, R6 on the demo: the map's week, the town's own door, real taps ---- */
  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const P = d.page, fr = d.fr;
  try {
    await P.waitForTimeout(3000);
    await fr.evaluate(() => { ['bohemia.hired.v1', 'bohemia.bag.v1'].forEach(k => localStorage.removeItem(k)); });
    const town = await fr.evaluate(() => { loopSettleBats(Math.max(loopBats(), 3000), 'the gate'); const bs = ctBases(), names = Object.keys(bs);
      const n = names.find(k => /church/i.test(k) && /^(town|fortress)$/.test(mapTierOf(k))) || names.find(k => /^(town|fortress)$/.test(mapTierOf(k))); return { name: n, tier: mapTierOf(n) }; });
    const enter = async () => { await fr.evaluate((n) => { const bs = ctBases(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, town.name);
      let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
        for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp && BohemiaSettlement.rareOn(); } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
      if (sf) await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); return sf; };
    let sf = await enter();
    if (!sf) { ok('R5 a town through the map\'s door', false, JSON.stringify(town)); throw new Error('no town'); }
    /* the first week from the map's own day whose post holds a rare man; the map's clock is set to it and the town entered again */
    const wk = await sf.evaluate(() => { const d0 = (BohemiaSettlement.state.mapDay | 0) || 1, n = BohemiaSettlement.recruits().length;
      for (let w = Math.floor(d0 / 7); w < Math.floor(d0 / 7) + 600; w++) { const key = BohemiaSettlement.rareKey(w * 7); for (let i = 0; i < n; i++) if (BohemiaSettlement.rareAt(key, i)) return { w, i, d0 }; } return null; });
    await sf.evaluate(() => { const l = document.getElementById('leave'); if (l) l.click(); }); await P.waitForTimeout(1200);
    await fr.evaluate((w) => { T.day = w * 7 + 1; if (typeof DAY !== 'undefined' && DAY) DAY.day = w * 7 + 1; }, wk.w);   /* the map hands the town loopDay() = DAY.day */
    sf = await enter();
    const box = await (await sf.frameElement()).boundingBox();
    for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'hall' && !!document.querySelector('#sbody .hire.rare .act'))) break;
      const w = await sf.evaluate(() => BohemiaSettlement.where('hall')); if (w) await P.touchscreen.tap(box.x + w.x, box.y + w.y); await P.waitForTimeout(900); }
    const man = await sf.evaluate(() => { const h = document.querySelector('#sbody .hire.rare'); if (!h) return null; const r = BohemiaSettlement.recruits().find(x => x.id === h.dataset.id);
      return { id: h.dataset.id, name: r.name, bg: r.backgroundId, level: r.level, kit: r.kitSpec, price: +((h.querySelector('.act').textContent.match(/(\d+) batter/) || [])[1]) }; });
    const before = await fr.evaluate(() => loopBats());
    const hb = await sf.$('#sbody .hire.rare .act'); if (hb) { await hb.scrollIntoViewIfNeeded(); const r = await hb.boundingBox(); if (r) await P.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); }
    await P.waitForTimeout(900);
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(900);
    const after = await fr.evaluate(() => loopBats());
    /* R6 before the crew screen is opened: the map's own hand-over for a man the crew screen has not seen yet */
    const k = man.kit, wantGear = { main: k.main, off: k.off || null, body: k.body || null, head: k.head || null };
    const nf = await P.evaluate((n) => { try { const o = nfOpts({ world: { day: 1 } }); const m = (o.company || []).find(x => x && x.name === n); return m ? { level: m.level, gear: m.gear } : null; } catch (e) { return String(e); } }, man.name.toUpperCase());
    ok('R6 the fight is handed his kit (his weapon, shield, body and helm) and his level', !!nf && nf.level === man.level && nf.gear && nf.gear.main === wantGear.main && nf.gear.off === wantGear.off && nf.gear.body === wantGear.body && nf.gear.head === wantGear.head, JSON.stringify(nf));
    let crew = null;
    const cb = await sf.$('#crew'); if (cb) { const r = await cb.boundingBox(); await P.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); await P.waitForTimeout(2200);
      const rf = P.frames().find(x => /ROSTER_SCREEN/.test(x.url()));
      if (rf) { await rf.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 20000 }).catch(() => {});
        crew = await rf.evaluate((n) => { const m = BohemiaRosterScreen.state.crew.find(x => x.name === n); if (!m) return null; const id = it => it ? it.id : null;
          return { level: m.level, bg: m.bgId, gear: { main: id(m.gear.main), off: id(m.gear.off), body: id(m.gear.body), head: id(m.gear.head) }, stars: Object.keys(m.stars || {}).length, line: m.pain,
            bag: JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]').map(i => i.id) }; }, man.name.toUpperCase());
        if (process.env.BOHEMIA_SHOT_DIR) await P.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'rare_hired_crew.png') });
        await rf.evaluate(() => { const b = document.getElementById('done'); if (b) b.click(); }).catch(() => {}); await P.waitForTimeout(600); } }
    ok('*** R5 A REAL TAP HIRES HIM *** (the demo, ' + town.name + ', week ' + wk.w + '): his price taken, on the crew screen at his level in his own kit, his stars and his line, the rest in the bag',
      !!man && before - after === man.price && !!crew && crew.level === man.level && crew.bg === man.bg && JSON.stringify(crew.gear) === JSON.stringify(wantGear) && crew.stars === 3 && /\w{4,}/.test(crew.line || '')
      && (k.gun === k.main || crew.bag.indexOf(k.gun) >= 0),
      JSON.stringify({ man: man && { name: man.name, bg: man.bg, level: man.level, price: man.price }, paid: before - after, crew }));
    ok('R8b nothing threw on the demo', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the demo legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();

  /* ---- R7 the computer ---- */
  const b2 = await chromium.launch(), srv2 = http.createServer(srv.listeners('request')[0]);
  await new Promise(r => srv2.listen(0, '127.0.0.1', r));
  try {
    const c2 = await b2.newContext({ viewport: { width: 1440, height: 900 } }), q = await c2.newPage();
    await q.goto('http://127.0.0.1:' + srv2.address().port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await q.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
    await q.evaluate(o => BohemiaSettlement.open({ place: { name: 'NELLIS GATE', tier: 'fortress' }, traits: [], day: o, batteries: 2000 }), (rk ? rk.w : 0) * 7 + 1);
    await q.waitForFunction(() => BohemiaSettlement.rareOn(), null, { timeout: 15000 }).catch(() => {}); await q.waitForTimeout(600);
    await q.evaluate(o => BohemiaSettlement.open({ place: { name: 'NELLIS GATE', tier: 'fortress' }, traits: [], day: o, batteries: 2000 }), (rk ? rk.w : 0) * 7 + 1); await q.waitForTimeout(600);
    const hx = await q.evaluate(() => BohemiaSettlement.where('hall')); if (hx) await q.mouse.click(hx.x, hx.y); await q.waitForTimeout(900);
    const cs = await q.evaluate(CARDS), f2 = await q.evaluate(FITS), r2 = cs.find(c => c.rare) || {};
    if (process.env.BOHEMIA_SHOT_DIR) await q.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'rare_card_computer.png') });
    ok('R7 the computer: his card reads as rare (frame, RARE, his line, three stars) and every card fits', r2.frame && r2.badge && r2.says.length > 10 && r2.stars === 3 && cs.every(c => c.out === 0) && f2.sw <= f2.cw,
      cs.length + ' cards; ' + JSON.stringify({ line: r2.line, stars: r2.stars }));
  } catch (e) { ok('R7 the computer leg ran [' + String(e.message).slice(0, 160) + ']', false); }
  await b2.close(); srv2.close();
  done();
})();
