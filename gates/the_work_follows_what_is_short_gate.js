/* ==========================================================================
   THE WORK FOLLOWS WHAT IS SHORT  (JOBS 2, 11/27/26, VAMILY rule 485(b), rules 482, 441, 466(c))

   The coordinator: 'the jobs better again, now inside rule 485's running economy (a job's pay and its client follow what the city is
   short of; ECONOMY THREE has the calls)'. The valley's own ledger (engine/bohemia_economy.js, the map's mktLedger()) runs water, food,
   meds and fuel down every day; its price of a good is 1 at 30 days of supply and more, 40 when it is out. NOW
   (__THE_WORK_FOLLOWS_WHAT_IS_SHORT__): a job that brings a good the valley is short of pays 1 + share x log2(that price), at most cap
   (records/target/bb/job_pay.json short, draft for ECONOMY THREE), and the board asks one such job first.

     S1  the table: every job's good read from its title's words (water, food, meds, fuel); the jobs he knows by their words carry
         theirs (the water drums, the insulin, the seed sacks, the propane tanks) and a job with none of them carries none (the tyres)
     S2  the curve: no shortage at 30 days and more; it rises as the days run out, never falls; the siege price is held at the cap
     S3  the board (the deal on the real shelf in Node): with the valley short of food a place that can post a food job asks one first;
         nothing short, the boards are the deal before this build; a job still has one door (no job at two places)
     S4  on his phone (the demo upright, a new crew, the valley's own ledger): the phone's list pays every job that brings a short good
         its pay times the mult, and Caravans' board shows each job the pay the map pays for it (shown is paid, standing and shortage in)
     S1p PLANTED: the curve without its cap pays a siege job x5 (S2 bites)
   node gates/the_work_follows_what_is_short_gate.js        SHORT_FILES=1 the files only
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 600) + ']' : '')); };
const done = () => { console.log('\nTHE WORK FOLLOWS WHAT IS SHORT: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const JP = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/job_pay.json'), 'utf8'));
const T = JP.short && JP.short.value;
const SHELFJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_BOARD_SHELF.json'), 'utf8'));
const KINDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_JOB_KINDS.json'), 'utf8'));
const JK = fs.readFileSync(path.join(ROOT, 'slices/bohemia_job_kinds.js'), 'utf8');
/* the jobs file's own goodOf and short, run on a stand-in ledger */
function shortFns(price) {
  const a = JK.indexOf('  function shortTable()'), b = JK.indexOf('  function shortNow()');
  const W = { root: null, Math, String, Object, JSON }; W.root = { BohemiaJobPay: { data: () => JP }, BohemiaEconomy: { GOODS: { water: {}, food: {}, meds: {}, fuel: {} }, daysLeft: (L, g) => L[g], scarcityMult: d => price(d) } };
  W.mktLedger = () => W.LEDGER; vm.createContext(W); vm.runInContext(JK.slice(a, JK.indexOf('\n', JK.indexOf('  function shortNow()')) + 1), W); return W;
}
const scarcity = d => (!isFinite(d) ? 1 : d >= 30 ? 1 : d <= 0 ? 40 : Math.min(40, 30 / Math.max(d, 0.75)));   /* engine/bohemia_economy.js scarcityMult */
const all = (() => { const h = {}, a = []; SHELFJ.offers.forEach(o => { h[o.id] = 1; a.push(o); }); ((KINDS.board_people && KINDS.board_people.rows) || []).forEach(o => { if (o && o.id && !h[o.id] && /\{pay\}/.test(o.says || '')) { a.push(o); h[o.id] = 1; } }); return a; })();
{ const W = shortFns(scarcity); const by = {}; all.forEach(o => { const g = W.goodOf(o) || 'none'; (by[g] = by[g] || []).push(o.id); });
  const want = { 'jb-escort-water': 'water', 'jb-carry-insulin': 'meds', 'jb-escort-seed': 'food', 'jb-escort-tanks': 'fuel', 'qd-s03': 'water', 'qd-ar06': 'meds', 'qd-s04': null };
  const bad = Object.keys(want).filter(id => { const o = all.find(x => x.id === id); return !o || (W.goodOf(o) || null) !== want[id]; });
  ok('S1 the table: every job\'s good from its title\'s words (' + Object.keys(by).map(g => g + ' ' + by[g].length).join(', ') + '); the drums water, the insulin meds, the seed food, the propane fuel, the tyres none',
    !!T && !bad.length && ['water', 'food', 'meds', 'fuel'].every(g => (by[g] || []).length >= 1), bad.join(', '));
}
const curve = (W) => [60, 30, 29, 20, 10, 8.5, 5, 2, 0.5, 0].map(d => { W.LEDGER = { food: d }; return W.short({ id: 'x', title: 'Bring the seed sacks' }).mult; });
{ const c = curve(shortFns(scarcity)), mono = c.every((m, i) => i === 0 || m >= c[i - 1]);
  ok('S2 the curve: none at 30 days and more, rising as the days run out, the siege held at the cap (' + c.join(' ') + ')', c[0] === 1 && c[1] === 1 && c[2] > 1 && mono && c[c.length - 1] === (T.cap || 1.5) && c[5] > 1.1 && c[5] < 1.3, c.join(' '));
  const JK0 = JK; const planted = JK0.replace('Math.min(T.cap || 1.5, 1 + (T.share || 0)', 'Math.min(99, 1 + (T.share || 0) * 5');
  const W2 = (() => { const a = planted.indexOf('  function shortTable()'); const W = { root: { BohemiaJobPay: { data: () => JP }, BohemiaEconomy: { GOODS: { food: {} }, daysLeft: (L, g) => L[g], scarcityMult: scarcity } }, Math, String, Object, JSON }; W.mktLedger = () => W.LEDGER; vm.createContext(W); vm.runInContext(planted.slice(a, planted.indexOf('\n', planted.indexOf('  function shortNow()')) + 1), W); return W; })();
  const pc = curve(W2);
  ok('S1p planted: the curve without its cap pays a siege job far past the cap (S2 bites)', pc[pc.length - 1] > (T.cap || 1.5) * 2, pc.join(' '));
}
/* S3: the deal on the real shelf, a stand-in reader (food short or nothing) */
{ const SRC = fs.readFileSync(path.join(ROOT, 'slices/bohemia_board_shelf.js'), 'utf8');
  const PLACES = [['Caravans', 'town'], ['The Mob', 'fortress'], ['Church', 'camp'], ['Trades', 'town'], ['Anarchists', 'camp'], ['Boulder', 'fortress'], ['The Dry Camp', 'camp'], ['Henderson', 'town']].map(([name, tier]) => ({ name, tier, traits: [] }));
  const W0 = shortFns(scarcity);
  const deal = (shortFood) => { const store = {}; const JKs = { short: (o) => { const g = W0.goodOf(o); return { good: g, mult: shortFood && g === 'food' ? 1.3 : 1 }; }, shortNow: () => shortFood ? ['food'] : [] };
    const ctx = { console, Math, JSON, Date, Object, Array, String, Number, isNaN, parseInt, parseFloat, setTimeout: () => 0, clearTimeout() {}, localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } }, WORLD_SEED: 'K7QM9X', fetch: () => Promise.reject(new Error('no')), BohemiaJobKinds: JKs };
    ctx.window = ctx; ctx.parent = ctx; vm.createContext(ctx); vm.runInContext(SRC, ctx); const doc = JSON.parse(JSON.stringify(SHELFJ)), h = {}; doc.offers.forEach(o => { h[o.id] = 1; });
    ((KINDS.board_people && KINDS.board_people.rows) || []).forEach(o => { if (o && o.id && !h[o.id] && /\{pay\}/.test(o.says || '')) doc.offers.push(o); }); ctx.BohemiaBoardShelf.set(doc);
    const m = {}; PLACES.forEach(p => { m[p.name] = (ctx.BohemiaBoardShelf.pick(p, 4, { places: PLACES, held: [], done: [] }) || []).map(o => o.id); }); return m; };
  const none = deal(false), food = deal(true), isFood = id => W0.goodOf(all.find(o => o.id === id) || {}) === 'food';
  const pools = PLACES.filter(p => all.some(o => !o.when && (o.tiers || []).indexOf(p.tier) >= 0 && !o.towns && isFood(o.id)));
  const asked = PLACES.filter(p => food[p.name].some(isFood)).map(p => p.name), where = {}; PLACES.forEach(p => food[p.name].forEach(id => { (where[id] = where[id] || []).push(p.name); }));
  const twice = Object.keys(where).filter(id => where[id].length > 1 && where[id].filter(n => food[n].length > 1).length > 1);
  ok('S3 the board, the valley short of food: places that ask a food job (' + asked.length + ': ' + asked.join(', ') + ' of ' + pools.length + ' that can); nothing short, ' + PLACES.filter(p => none[p.name].some(isFood)).length + ' do; still one door',
    asked.length >= Math.min(3, pools.length) && asked.length > PLACES.filter(p => none[p.name].some(isFood)).length && !twice.length, twice.join(', '));
}
if (process.env.SHORT_FILES) done();

(async () => {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js')), rows = [], errs = [];
  for (const alpha of [false, true]) {
    const tag = alpha ? 'alpha upright' : 'demo upright'; let d = null;
    try {
      d = await drive.open({ profile: 'phone_portrait', alpha, fog: false, keepCards: true, engage: true,
        arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
      const fr = d.fr, page = d.page; page.on('pageerror', e => errs.push(tag + ': ' + String(e).slice(0, 160)));
      await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaPhoneBoard && BohemiaPhoneBoard.loaded() && window.LOOP && LOOP.start && window.BohemiaJobPay && BohemiaJobPay.data(), null, { timeout: 300000 });
      await page.waitForTimeout(4000);
      const ph = await fr.evaluate(() => { const short = BohemiaJobKinds.shortNow(), all = BohemiaBoardShelf.shelf().offers, out = [];
        BohemiaPhoneBoard.asks().forEach(a => { const o = all.find(x => x.id === a.id); if (!o) return; const s = BohemiaJobKinds.short(o), plain = loopJobPay(o.pay, a.place, null, { short: { mult: 1 } });
          out.push({ id: a.id, place: a.place, good: s.good, mult: s.mult, pay: a.pay, plain, want: Math.max(1, Math.round(plain * s.mult)) }); });
        return { short, rows: out }; });
      /* Caravans' board: each card's pay against the map's own for that job */
      await fr.evaluate(() => { try { loopClose(); } catch (e) {} const b = ctBases()['Caravans']; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: 'Caravans', x: b.x, y: b.y }); });
      const t0 = Date.now(); while (Date.now() - t0 < 90000 && !(await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)).catch(() => false))) await page.waitForTimeout(500);
      if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
      const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
      await sf.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === 'Caravans', null, { timeout: 30000 });
      for (let k = 0; k < 4; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('board')), hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]);
        if (xy) await page.touchscreen.tap(hb.x + xy.x * hb.width / (iw[0] || hb.width), hb.y + xy.y * hb.height / (iw[1] || hb.height));
        const t1 = Date.now(); while (Date.now() - t1 < 8000 && !(await sf.evaluate(() => BohemiaSettlement.state.open === 'board' && document.querySelectorAll('#sheet button.act.client').length > 0).catch(() => false))) await page.waitForTimeout(400);
        if (await sf.evaluate(() => BohemiaSettlement.state.open === 'board').catch(() => false)) break; }
      await page.waitForTimeout(1500);
      const cards = await sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => { const em = b.querySelector(':scope > em'), t = em ? em.textContent.replace(/\s+/g, ' ') : '', m = /(\d+)/.exec(t.replace(/\u00b7.*$/, '')); return { id: b.dataset.id, shown: m ? +m[1] : null }; }));
      for (const c of cards) { const r = await fr.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.find(x => x.id === id); if (!o) return null; const s = BohemiaJobKinds.short(o); return { pay: loopJobPay(o.pay, 'Caravans', null, { short: { mult: s.mult } }), mult: s.mult, good: s.good }; }, c.id); if (r) Object.assign(c, { map: r.pay, mult: r.mult, good: r.good }); }
      rows.push({ tag, short: ph.short, phone: ph.rows, cards });
    } catch (e) { errs.push(tag + ': ' + String(e && e.message || e).slice(0, 200)); }
    if (d) await d.close();
  }
  const phoneBad = [], cardBad = []; let bumped = 0;
  rows.forEach(r => { r.phone.forEach(p => { if (p.mult > 1) bumped++; if (Math.abs(p.pay - p.want) > 1) phoneBad.push(r.tag + ' ' + p.id + ' ' + p.pay + ' vs ' + p.want); }); r.cards.forEach(c => { if (c.shown !== c.map) cardBad.push(r.tag + ' ' + c.id + ' shown ' + c.shown + ' paid ' + c.map); }); });
  ok('S4 on his phone, the demo and the alpha upright: the valley short of ' + (rows[0] ? rows[0].short.join(', ') || 'nothing' : '?') + '; every job on the phone\'s list that brings it pays its pay x the mult (' + bumped + ' such asks), and every job on Caravans\' board shows what the map pays for it',
    rows.length === 2 && !phoneBad.length && !cardBad.length && rows.every(r => r.cards.length >= 1) && bumped >= 1,
    (phoneBad.concat(cardBad).slice(0, 4).join(' | ') || rows.map(r => r.tag + ': ' + r.phone.filter(p => p.mult > 1).slice(0, 3).map(p => p.id + ' ' + p.good + ' ' + p.plain + ' -> ' + p.pay).join(', ') + '; board ' + r.cards.map(c => c.id + ' ' + c.shown + (c.mult > 1 ? ' (' + c.good + ' x' + c.mult + ')' : '')).join(', ')).join(' || ')));
  ok('S5 nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  done();
})();
