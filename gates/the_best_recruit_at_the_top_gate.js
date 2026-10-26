/* ==========================================================================
   THE BEST RECRUIT AT THE TOP  (RUN THREE, 10/26/26, VAMILY [the best recruit at the top], rule 216; EYES' halls note 10/25)

   PAOLO 10/26: "in the recruiting pitstop just put the best at the absolute top... the more stars, the more expensive... keeping in
   mind the price they ask depending on their background... when we level them up as much as we can, their stars and default good
   stats lead the way... you might have to make a calculator... that's one failure of Battle Brothers, no proper filter to quickly
   see who's the fire one... it doesn't respect your time."
   EYES 10/25: "nineteen recruits in four halls, every one a pistol man; no rare man."
   MEASURED BEFORE: the hall listed its men in the roll's order, one per trade and always the same trades for a size (a town's four
   were farmhand, runner, butcher, brawler every week; a thief or a block watch never stood at a town's post), every one holding the
   pistol, and no number said who would be good.

   LEGS:
     C1 *** THE CALCULATOR IS THE LEVEL-UP ***: for 100 men rolled at the posts, his ceiling for each kind equals the mean, over 300
        climbs to level 11 through the crew screen's own grant() and raise() (four picks off the kind's plan), of the same number,
        within a point; and the card's ceiling is the better kind's
     C2 *** THE BEST AT THE ABSOLUTE TOP *** (his phone, a real tap on the hall's door): at camps, towns and fortresses over many
        weeks every hall lists its men by the ceiling, highest first; every card says CEILING, his kind and his price, the price the
        Hire button's
     C3 THE PRICE BESIDE IT: BARGAIN on exactly the men whose ceiling per battery beats the hall's median and whose ceiling is at
        least the hall's median (some seen, never on a man at or under the median worth); a man priced over the hall's median says
        why, naming the biggest part of the hall's own formula; nobody else does
     C4 THE SWITCH IN ONE TAP: one tap on BEST FOR THE PRICE lists by ceiling per battery, one tap on BEST lists by the ceiling again
     C5 THE STARS AND THE TRAIT BEFORE HE HIRES: three starred stats on every card, his trait in words where he has one, no try-out fee
     C6 A REAL MIX (EYES): over the halls both kinds stand (each at least a quarter of the men), a gun man holds the rifle and a melee
        man the pistol (guns first, rule 120(a)), every trade stands at a town's post; the rare man at his rate (2 to 4 slots in 100 at
        towns and fortresses, never a camp) and, when he stands, in the order like any man
     C7 the computer: the order and the switch by mouse
     C8 *** THE LIVE DEMO ***: through the title, a town through the map's door, a real tap on the hall: the order is the ceiling's
        and one tap switches it
     C9 nothing threw
   node gates/the_best_recruit_at_the_top_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('THE BEST RECRUIT AT THE TOP: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });
const RIFLE = J('records/target/bb/ours.json').weapon_rows.value.rifle, PISTOL = J('records/target/bb/ours.json').weapon_rows.value.pistol;
const KNIFE = 'knife';

/* what the open hall shows, in the settlement's frame: every card in the page's order, with what the page's own state says of him */
const HALL = () => { const S = BohemiaSettlement, R = S.recruits(), med = S.hallMed();
  const cards = [...document.querySelectorAll('#sheet.on .hire')].map(h => { const r = R.find(x => x.id === h.dataset.id) || {}, ce = h.querySelector('.hceil'), why = h.querySelector('.hwhy');
    const btn = h.querySelector('.act'), tr = S.traitOf(r), tal = S.talentsOf(r) || [];
    /* the ceiling worked again here, off the man's own numbers: his stats with his trait's flat numbers on them, his stars, his level */
    const st = Object.assign({}, r.stats); (tr && tr.effects || []).forEach(e => { if (e.flat_eight && st[e.stat] != null) st[e.stat] += e.n; });
    const stars = {}; tal.forEach(x => { if (x && x.k) stars[x.k] = x.n; });
    const again = BohemiaRoster.ceiling({ stats: st, stars, level: r.level || 1 });
    return { id: h.dataset.id, rare: !!r.rare, bg: r.backgroundId, ceil: ce ? +ce.dataset.ceiling : null, again: again.value, kind: ce && ce.dataset.kind, againKind: again.kind,
      words: ce ? ce.textContent : '', price: ce ? +ce.dataset.price : null, btn: btn ? +((btn.textContent.match(/(\d+) batter/) || [])[1]) : null,
      bargain: !!(ce && ce.querySelector('.bargain')), why: why ? why.dataset.why : null, whyText: why ? why.textContent : '', parts: S.hallParts(r),
      gun: (h.querySelector('.hgun') || { dataset: {} }).dataset.gun || null, stars: h.querySelectorAll('.hstats .star').length, trait: tr === false ? false : tr ? tr.id : null,
      traitShown: h.querySelector('.htrait') ? h.querySelector('.htrait').dataset.trait : null, tryout: /try[- ]?out/i.test(h.textContent) }; });
  const bar = document.querySelector('#sheet.on .hsort'), on = bar && bar.querySelector('button.on');
  return { cards, med, sort: on ? on.dataset.sort : null, bar: !!bar }; };

(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch(), errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaRoster, null, { timeout: 30000 });
  const openHall = async (pg, name, tier, day, touch) => {
    await pg.evaluate(o => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click();
      BohemiaSettlement.open({ place: { name: o.name, tier: o.tier }, traits: [], day: o.day, batteries: 3000 }); }, { name, tier, day });
    await pg.waitForTimeout(350);
    const hx = await pg.evaluate(() => BohemiaSettlement.where('hall'));
    if (hx) { if (touch) await pg.touchscreen.tap(hx.x, hx.y); else await pg.mouse.click(hx.x, hx.y); }
    await pg.waitForFunction(() => BohemiaSettlement.state.open === 'hall' && (BohemiaSettlement.recruits().length === 0 || document.querySelectorAll('#sheet.on .hire .hceil').length > 0), null, { timeout: 15000 }).catch(() => {});
    await pg.waitForTimeout(150);
    return pg.evaluate(HALL);
  };
  try {
    /* the calculator's files in, and the rare man's (one hall opened first) */
    await openHall(p, 'BLUE DIAMOND', 'town', 1, true);
    await p.waitForFunction(() => BohemiaSettlement.ceilReady() && BohemiaSettlement.rareOn(), null, { timeout: 20000 }).catch(() => {});

    /* ---- C2, C3, C5, C6 over many halls on the phone ---- */
    const halls = [], places = [['camp', 'DRY WELL'], ['camp', 'SALT CAMP'], ['town', 'BLUE DIAMOND'], ['town', 'GOODSPRINGS'], ['fortress', 'NELLIS GATE'], ['fortress', 'THE CHURCH']];
    for (const [tier, name] of places) for (let w = 0; w < 6; w++) halls.push(Object.assign({ tier, name, w }, await openHall(p, name, tier, 1 + w * 7, true)));
    const men = [].concat(...halls.map(h => h.cards));
    const disorder = halls.filter(h => h.cards.some((c, i) => i && c.ceil > h.cards[i - 1].ceil + 1e-9));
    const wrong = men.filter(c => c.ceil == null || Math.abs(c.ceil - c.again) > 1e-9 || c.kind !== c.againKind || !/CEILING \d+/.test(c.words) || !/(MELEE|GUN)/.test(c.words) || c.price !== c.btn || !c.btn);
    ok('*** C2 THE BEST AT THE ABSOLUTE TOP *** (phone, a real tap on the door): ' + halls.length + ' halls at camps, towns and fortresses over six weeks, ' + men.length + ' men, every hall by the ceiling, highest first; every card CEILING, his kind and his price, the Hire button\'s',
      halls.every(h => h.bar || h.cards.length < 2) && men.length >= 80 && disorder.length === 0 && wrong.length === 0, (disorder.length ? 'out of order: ' + disorder.map(h => h.name + ' w' + h.w).join(', ') + '; ' : '') + (wrong.length ? 'wrong: ' + JSON.stringify(wrong[0]).slice(0, 240) : 'example ' + (halls[2].cards[0] || {}).words));

    /* C3 the bargain and the why, against the hall's own medians worked here */
    const med = a => { a = a.slice().sort((x, y) => x - y); const n = a.length; return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2; };
    let bargains = 0, whys = 0; const badB = [], badW = [];
    halls.forEach(h => { if (h.cards.length < 2) { if (h.cards.some(c => c.bargain || c.why)) badB.push(h.name + ' w' + h.w + ' (one man)'); return; }
      const mw = med(h.cards.map(c => c.ceil / c.price)), mc = med(h.cards.map(c => c.ceil)), mp = med(h.cards.map(c => c.price));
      h.cards.forEach(c => { const should = c.ceil / c.price > mw + 1e-9 && c.ceil >= mc - 1e-9; if (c.bargain) bargains++; if (c.bargain !== should) badB.push(h.name + ' w' + h.w + ' ' + c.bg + ' ' + (c.ceil / c.price).toFixed(2) + ' vs ' + mw.toFixed(2));
        const pricey = c.price > mp; if (c.why) whys++;
        const biggest = c.parts && Object.keys(c.parts).sort((x, y) => c.parts[y] - c.parts[x])[0];
        if (pricey !== !!c.why || (c.why && c.why !== biggest)) badW.push(h.name + ' w' + h.w + ' ' + c.bg + ' ' + c.price + ' vs ' + mp + ' ' + c.why + '/' + biggest); }); });
    ok('C3 THE PRICE BESIDE IT: BARGAIN on exactly the men whose ceiling per battery beats the hall\'s median and whose ceiling is at least its median (' + bargains + ' seen); a man priced over the hall\'s median says why, the biggest part of the formula (' + whys + ' seen), nobody else',
      bargains >= 10 && whys >= 10 && badB.length === 0 && badW.length === 0, (badB.concat(badW).slice(0, 3).join(' | ') || 'e.g. ' + (men.find(c => c.why) || {}).whyText));

    /* C5 */
    const noStars = men.filter(c => c.stars !== 3), noTrait = men.filter(c => c.trait && c.traitShown !== c.trait), tryout = men.filter(c => c.tryout);
    ok('C5 THE STARS AND THE TRAIT BEFORE HE HIRES: three starred stats on every card (' + (men.length - noStars.length) + ' of ' + men.length + '), his trait in words on every man who has one (' + men.filter(c => c.trait).length + '), no try-out fee anywhere',
      noStars.length === 0 && noTrait.length === 0 && tryout.length === 0 && men.filter(c => c.trait).length > men.length / 2);

    /* C6 the mix */
    const plain = men.filter(c => !c.rare), gunMen = plain.filter(c => c.kind === 'gun'), melee = plain.filter(c => c.kind === 'melee');
    const armWrong = plain.filter(c => c.kind === 'gun' ? c.gun !== RIFLE : c.gun !== KNIFE);
    const townTrades = new Set(halls.filter(h => h.tier !== 'camp').map(h => h.cards.filter(c => !c.rare).map(c => c.bg)).flat()), campTrades = new Set(halls.filter(h => h.tier === 'camp').map(h => h.cards.map(c => c.bg)).flat());
    ok('C6 A REAL MIX (EYES: \'every one a pistol man\'): ' + gunMen.length + ' gun men with the rifle and ' + melee.length + ' melee men with the pistol of ' + plain.length + '; trades at the towns and fortresses ' + townTrades.size + ' of 6, at the camps ' + campTrades.size,
      gunMen.length >= plain.length / 4 && melee.length >= plain.length / 4 && armWrong.length === 0 && townTrades.size === 6 && campTrades.size >= 4, armWrong.slice(0, 2).map(c => c.bg + ' ' + c.kind + ' ' + c.gun).join(' | '));
    const rate = await p.evaluate(() => { const S = BohemiaSettlement, out = {};
      for (const [tier, name] of [['town', 'RATE TOWN'], ['fortress', 'RATE FORT'], ['camp', 'RATE CAMP']]) { S.open({ place: { name, tier }, traits: [], day: 1, batteries: 100 });
        let n = 0, hit = 0; for (let w = 0; w < 500; w++) { const key = S.rareKey(w * 7); for (let i = 0; i < 6; i++) { n++; if (S.rareAt(key, i)) hit++; } } out[tier] = Math.round(1000 * hit / n) / 10; }
      return out; });
    /* a fortress week where he stands: his card in the order like any man */
    const rw = await p.evaluate(() => { const S = BohemiaSettlement; S.open({ place: { name: 'NELLIS GATE', tier: 'fortress' }, traits: [], day: 1, batteries: 100 });
      for (let w = 0; w < 400; w++) { const key = S.rareKey(w * 7); for (let i = 0; i < 6; i++) if (S.rareAt(key, i)) return w; } return null; });
    const rh = rw == null ? null : await openHall(p, 'NELLIS GATE', 'fortress', rw * 7 + 1, true), rc = rh && rh.cards.find(c => c.rare);
    ok('C6 THE RARE MAN AT HIS RATE: ' + rate.town + ' and ' + rate.fortress + ' slots in 100 at a town and a fortress over 500 weeks, ' + rate.camp + ' at a camp; when he stands (week ' + rw + ') his card is in the order by his ceiling (' + (rc ? Math.round(rc.ceil) + ', place ' + (rh.cards.indexOf(rc) + 1) + ' of ' + rh.cards.length : 'not found') + ')',
      rate.town >= 2 && rate.town <= 4 && rate.fortress >= 2 && rate.fortress <= 4 && rate.camp === 0 && !!rc && rh.cards.every((c, i) => !i || c.ceil <= rh.cards[i - 1].ceil + 1e-9));

    /* ---- C4 the switch, real taps ---- */
    /* a town week whose two orders differ (in some halls the best man is also the best for the price) */
    let town = null; for (let w = 2; w < 30 && !town; w++) { const h = await openHall(p, 'GOODSPRINGS', 'town', 1 + w * 7, true);
      const byW = h.cards.slice().sort((x, y) => y.ceil / y.price - x.ceil / x.price).map(c => c.id).join();
      if (h.cards.length >= 3 && byW !== h.cards.map(c => c.id).join()) town = h; }
    const tapSort = async (pg, by, touch) => { const r = await pg.evaluate(k => { const e = document.querySelector('#sheet.on .hsort button[data-sort="' + k + '"]'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, by);
      if (!r) return null; if (touch) await pg.touchscreen.tap(r.x, r.y); else await pg.mouse.click(r.x, r.y); await pg.waitForTimeout(300); return pg.evaluate(HALL); };
    const byPrice = await tapSort(p, 'price', true), back = await tapSort(p, 'best', true);
    const wOrder = h => h && h.cards.every((c, i) => !i || c.ceil / c.price <= h.cards[i - 1].ceil / h.cards[i - 1].price + 1e-9);
    const cOrder = h => h && h.cards.every((c, i) => !i || c.ceil <= h.cards[i - 1].ceil + 1e-9);
    ok('C4 THE SWITCH IN ONE TAP: BEST FOR THE PRICE lists by ceiling per battery (' + (byPrice ? byPrice.cards.map(c => (c.ceil / c.price).toFixed(1)).join(' > ') : '-') + '), BEST by the ceiling again (' + (back ? back.cards.map(c => Math.round(c.ceil)).join(' > ') : '-') + ')',
      !!town && town.sort === 'best' && cOrder(town) && byPrice && byPrice.sort === 'price' && wOrder(byPrice) && back && back.sort === 'best' && cOrder(back) && town.cards.length >= 3
      && byPrice.cards.map(c => c.id).join() !== town.cards.map(c => c.id).join() && back.cards.map(c => c.id).join() === town.cards.map(c => c.id).join());
    if (process.env.BOHEMIA_SHOT_DIR) { await openHall(p, 'BLUE DIAMOND', 'town', 1, true); await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'best_recruit_phone.png') }); }

    /* ---- C1 the calculator is the level-up: 100 men, 300 climbs each, through grant() and raise() ---- */
    const c1 = await p.evaluate(() => { const S = BohemiaSettlement, C = BohemiaRoster, out = [];
      const tiers = ['town', 'fortress', 'camp']; let k = 0;
      for (let w = 0; out.length < 100 && w < 200; w++) { const tier = tiers[w % 3]; S.open({ place: { name: 'CALC ' + tier.toUpperCase() + ' ' + (w % 7), tier }, traits: [], day: 1 + w * 7, batteries: 100 });
        S.recruits().forEach(r => { if (out.length >= 100) return; const tr = S.traitOf(r), st = Object.assign({}, r.stats); (tr && tr.effects || []).forEach(e => { if (e.flat_eight && st[e.stat] != null) st[e.stat] += e.n; });
          const stars = {}; (S.talentsOf(r) || []).forEach(x => { if (x && x.k) stars[x.k] = x.n; });
          const man = { stats: st, stars, level: r.level || 1 }, res = { bg: r.backgroundId, rare: !!r.rare, card: S.ceilingOf(r) && S.ceilingOf(r).value, best: C.ceiling(man).value };
          ['melee', 'gun'].forEach(kind => { const want = C.ceiling(man, kind).value, plan = C.planFor(kind); let sum = 0; const T = 300;
            for (let t = 0; t < T; t++) { const m = { name: 'CALC' + (k++), stats: Object.assign({}, st), stars, level: man.level, xp: C.xpFor(man.level), points: 0, perks: [], rolls: [] };
              C.grant(m, C.xpFor(11) - m.xp, 'calc:' + t + ':' + r.id + ':' + w); while (m.rolls.length) C.raise(m, plan); sum += C.worthOf(m.stats, kind); }
            res[kind] = { want, got: sum / T }; });
          out.push(res); }); }
      return out; });
    const off = c1.filter(r => ['melee', 'gun'].some(k => Math.abs(r[k].want - r[k].got) > 1) || Math.abs(r.card - Math.max(r.melee.want, r.gun.want)) > 1e-6);
    const worst = c1.reduce((a, r) => Math.max(a, Math.abs(r.melee.want - r.melee.got), Math.abs(r.gun.want - r.gun.got)), 0);
    ok('*** C1 THE CALCULATOR IS THE LEVEL-UP ***: ' + c1.length + ' men rolled at the posts (' + c1.filter(r => r.rare).length + ' rare), 300 climbs to level 11 each through the crew screen\'s grant() and raise(): every ceiling within a point of the climbs\' mean (worst ' + worst.toFixed(2) + '), the card\'s the better kind\'s',
      c1.length === 100 && off.length === 0, off.slice(0, 2).map(r => r.bg + ' ' + JSON.stringify([r.melee, r.gun])).join(' | '));
  } catch (e) { ok('the phone legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('C9a nothing threw on the settlement screen', errs.length === 0, errs.slice(0, 2).join(' | '));
  await ctx.close();

  /* ---- C7 the computer ---- */
  try {
    const c2 = await b.newContext({ viewport: { width: 1440, height: 900 } }), q = await c2.newPage(); q.on('pageerror', e => errs.push(e.message));
    await q.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await q.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
    await openHall(q, 'NELLIS GATE', 'fortress', 8, false); await q.waitForFunction(() => BohemiaSettlement.ceilReady(), null, { timeout: 20000 }).catch(() => {});
    const h0 = await openHall(q, 'NELLIS GATE', 'fortress', 8, false);
    const r = await q.evaluate(() => { const e = document.querySelector('#sheet.on .hsort button[data-sort="price"]'); const x = e.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2 }; });
    await q.mouse.click(r.x, r.y); await q.waitForTimeout(300); const h1 = await q.evaluate(HALL);
    const fits = await q.evaluate(() => { const sh = document.getElementById('sheet'); return sh.scrollWidth <= sh.clientWidth; });
    if (process.env.BOHEMIA_SHOT_DIR) await q.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'best_recruit_computer.png') });
    ok('C7 the computer: ' + h0.cards.length + ' men by the ceiling (' + h0.cards.map(c => Math.round(c.ceil)).join(' > ') + '), one click lists them for the price, the sheet fits',
      h0.cards.length >= 4 && h0.cards.every((c, i) => !i || c.ceil <= h0.cards[i - 1].ceil + 1e-9) && h1.sort === 'price' && h1.cards.every((c, i) => !i || c.ceil / c.price <= h1.cards[i - 1].ceil / h1.cards[i - 1].price + 1e-9) && fits);
    await c2.close();
  } catch (e) { ok('C7 the computer leg ran [' + String(e.message).slice(0, 160) + ']', false); }
  await b.close(); srv.close();

  /* ---- C8 the live demo: through the title, a town by the map's door, real taps ---- */
  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { ok('C8 the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const P = d.page, fr = d.fr;
  try {
    await P.waitForTimeout(3000);
    const town = await fr.evaluate(() => { loopSettleBats(Math.max(loopBats(), 3000), 'the gate'); const bs = ctBases(), names = Object.keys(bs);
      const n = names.find(k => mapTierOf(k) === 'fortress') || names.find(k => /^(town|fortress)$/.test(mapTierOf(k))); return { name: n, tier: mapTierOf(n) }; });
    await fr.evaluate((n) => { const bs = ctBases(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, town.name);
    let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
      for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
    if (!sf) throw new Error('no town through the map\'s door ' + JSON.stringify(town));
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
    const box = await (await sf.frameElement()).boundingBox();
    for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'hall' && document.querySelectorAll('#sbody .hire .hceil').length > 0)) break;
      const w = await sf.evaluate(() => BohemiaSettlement.where('hall')); if (w) await P.touchscreen.tap(box.x + w.x, box.y + w.y); await P.waitForTimeout(1200); }
    const h0 = await sf.evaluate(HALL);
    const sb = await sf.evaluate(() => { const e = document.querySelector('#sheet.on .hsort button[data-sort="price"]'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const x = e.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2 }; });
    if (sb) await P.touchscreen.tap(box.x + sb.x, box.y + sb.y); await P.waitForTimeout(600);
    const h1 = await sf.evaluate(HALL);
    if (process.env.BOHEMIA_SHOT_DIR) await P.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'best_recruit_demo.png') });
    ok('*** C8 THE LIVE DEMO *** (' + town.name + ', a real tap on the hall): ' + h0.cards.length + ' men by the ceiling (' + h0.cards.map(c => Math.round(c.ceil) + ' ' + c.kind).join(', ') + '), one tap lists them for the price',
      h0.cards.length >= 2 && h0.cards.every((c, i) => !i || c.ceil <= h0.cards[i - 1].ceil + 1e-9) && h0.cards.every(c => Math.abs(c.ceil - c.again) < 1e-9 && c.price === c.btn)
      && h1.sort === 'price' && h1.cards.every((c, i) => !i || c.ceil / c.price <= h1.cards[i - 1].ceil / h1.cards[i - 1].price + 1e-9));
    ok('C9b nothing threw on the demo', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
  } catch (e) { ok('C8 the demo legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();
  ok('C9 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  done();
})();
