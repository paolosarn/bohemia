/* THE HIRE PRICE IS THE FORMULA (RUN TWO [the hire price is the formula], 10/19/26; rule 117, Paolo 10/18: 'I want you to
   be easier than Battle Brothers'). TUNING measured the hall asking up to 225 batteries for a level-one militiaman against
   Battle Brothers' own formula's 49, and the camp staff's button saying '1 battery a night' while the line said '200
   batteries, once' and the tap charged nothing.
   Measured here:
     - CONTROL: the post's old number (the Game Guide's observed total) goes past Battle Brothers' formula for a militiaman
       across a year of weeks (the defect, so this gate can go red)
     - THE ORACLE, in this file, from the data alone: Battle Brothers' formula (the base range, 1.25 x the kit off the wiki's
       weapon and armour rows, 500 x (level-1)^1.5, ten crowns a battery, floor 1) times TUNING's start from
       records/target/BOHEMIA_HALL_PRICE.json; a level-one militiaman tops out at four fifths of the formula
     - ON HIS PHONE (390 x 844) at a camp, a town and a fortress over eight weeks: every man's button is the oracle's
       number for that man, never over Battle Brothers' own price, and Hire takes exactly that from the stash
     - the lever is read, not typed: the data file planted at 1.0 makes every price Battle Brothers' own
     - the camp staff: the button, the line and the tap agree (the price once, debited)
   Run: node gates/the_hire_price_is_the_formula_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8881;
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const PT = J('records/target/bb/price_table.json').wageAndHire, W = J('records/target/bb/weapons.json').rows, A = J('records/target/bb/armor.json');
const HALL = J('records/target/BOHEMIA_HALL_PRICE.json');
const GB = require(path.join(ROOT, 'engine/bohemia_goodbros.js'));
const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
const KIT = (() => { const m = html.match(/var KIT = (\{[^;]+\});/); return m ? Function('return ' + m[1])() : {}; })();
const kitCrowns = bg => (KIT[bg] || []).reduce((v, id) => { if (!id) return v; const w = W.find(r => r.id === id); if (w) return v + (w.value || 0);
  for (const k of ['body', 'head', 'shields']) { const a = (A[k] || []).find(r => r.id === id); if (a) return v + (a.value || 0); } return v; }, 0);
const oracle = (r, easier) => { const g = GB.byId(r.backgroundId); const f = g.hireMax > g.hireMin ? Math.max(0, Math.min(1, (r.priceCrowns - g.hireMin) / (g.hireMax - g.hireMin))) : 0.5;
  const c = PT.hiringBaseRange.min + f * (PT.hiringBaseRange.maxApprox - PT.hiringBaseRange.min) + 500 * Math.pow(Math.max(0, (r.level || 1) - 1), 1.5) + PT.equipmentCostMultiplier * kitCrowns(r.backgroundId);
  return Math.max(1, Math.floor(c * easier / 10)); };

let plantEasier = null;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (plantEasier != null && u === '/records/target/BOHEMIA_HALL_PRICE.json') { rs.setHeader('content-type', 'application/json'); return rs.end(JSON.stringify(Object.assign({}, HALL, { easier: plantEasier }))); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});

(async () => {
  /* CONTROL and THE ORACLE, from the files */
  let oldTop = 0;
  for (let w = 0; w < 52; w++) GB.sixAtThePost('CONTROL:' + w).forEach(r => { if (r.backgroundId === 'militia') oldTop = Math.max(oldTop, r.priceBatteries); });
  const militiaBB = oracle({ backgroundId: 'militia', priceCrowns: GB.byId('militia').hireMax }, 1), militiaNow = oracle({ backgroundId: 'militia', priceCrowns: GB.byId('militia').hireMax }, HALL.easier);
  ok('CONTROL: the post\'s old number asks more than Battle Brothers\' formula for a level-one militiaman', oldTop > militiaBB, 'old up to ' + oldTop + ', the formula ' + militiaBB);
  ok('THE ORACLE: a level-one militiaman tops out at Battle Brothers\' formula times TUNING\'s start, read from the hall\'s data file', HALL.easier > 0 && HALL.easier <= 1 && militiaNow <= militiaBB && militiaNow === Math.floor(militiaBB * 10 * HALL.easier / 10) || militiaNow <= Math.ceil(militiaBB * HALL.easier),
     militiaNow + ' of ' + militiaBB + ' (x' + HALL.easier + ')');
  ok('  the kit is priced off the wiki\'s own rows (every post background\'s kit found)', GB.CANDIDATES.every(c => (KIT[c.id] || []).filter(Boolean).every(id => W.some(r => r.id === id) || ['body', 'head', 'shields'].some(k => (A[k] || []).some(r => r.id === id)))),
     GB.CANDIDATES.map(c => c.id + ' ' + kitCrowns(c.id)).join(', '));

  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium; try { chromium = require('playwright').chromium; } catch (e) { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  const b = await chromium.launch();
  const errs = [];
  const page = async () => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.folk().length > 0, null, { timeout: 30000 });
    await p.waitForTimeout(700);
    return { ctx, p };
  };
  const hall = async (p, name, tier, day, batteries) => {
    if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(220); }
    await p.evaluate(o => BohemiaSettlement.open({ place: { name: o.name, tier: o.tier }, traits: [], day: o.day, batteries: o.batteries }), { name, tier, day, batteries });
    await p.waitForTimeout(350);
    const xy = await p.evaluate(() => BohemiaSettlement.where('hall')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(350);
    return p.evaluate(() => { const R = BohemiaSettlement.state.recruits || [];
      return Array.from(document.querySelectorAll('#sheet .hire')).map(h => { const r = R.find(x => x.id === h.dataset.id) || {};
        const btn = Array.from(h.querySelectorAll('button')).find(x => /Hire/.test(x.textContent));
        return { id: r.id, backgroundId: r.backgroundId, priceCrowns: r.priceCrowns, level: r.level, old: r.priceBatteries, shown: btn ? +((btn.textContent.match(/(\d+)\s*batt/) || [])[1]) : null }; }); });
  };

  let s = await page();
  let seen = 0, off = [], over = [], oldOver = 0;
  for (const tier of ['camp', 'town', 'fortress']) for (let w = 0; w < 8; w++) {
    const cards = await hall(s.p, 'PRICES ' + tier.toUpperCase(), tier, 4 + w * 7, 500);
    cards.forEach(c => { seen++; const want = oracle(c, HALL.easier), bb = oracle(c, 1);
      if (c.shown !== want) off.push(tier + ' w' + w + ' ' + c.backgroundId + ' ' + c.shown + '/' + want);
      if (c.shown > bb) over.push(c.backgroundId + ' ' + c.shown + '>' + bb);
      if (c.old > bb) oldOver++; });
  }
  ok('ON HIS PHONE: every man\'s button at a camp, a town and a fortress over eight weeks is the formula\'s number for that man', seen >= 60 && off.length === 0, seen + ' men' + (off.length ? ', off ' + off.slice(0, 3).join('; ') : ''));
  ok('  and none asks more than Battle Brothers\' own price (the old number did for ' + oldOver + ' of them)', over.length === 0, over.slice(0, 3).join('; ') || 'none over');

  /* Hire takes exactly the shown price */
  const cards = await hall(s.p, 'PAY HERE', 'town', 11, 200);
  const pick = cards[0];
  const before = await s.p.evaluate(() => (window.__settleLog || []).length);
  await s.p.evaluate(id => { const h = document.querySelector('#sheet .hire[data-id="' + id + '"]'); Array.from(h.querySelectorAll('button')).find(x => /Hire/.test(x.textContent)).click(); }, pick.id);
  await s.p.waitForTimeout(250);
  const log = await s.p.evaluate(n => (window.__settleLog || []).slice(n), before);
  const hm = log.find(m => m.act === 'hireMan'), after = log.length ? log[log.length - 1].batteries : null;
  ok('  Hire takes exactly the price on the button from the stash', !!hm && hm.price === pick.shown && after === 200 - pick.shown, pick.backgroundId + ' ' + pick.shown + ': 200 -> ' + after);

  /* the camp staff: button, line and tap agree */
  let staffOk = false, staffWhy = 'no staff offered';
  await s.p.evaluate(() => { window.__goodbros = window.BohemiaGoodBros; window.BohemiaGoodBros = null; });   /* nobody at the post, so the keeper says the staff's own line */
  for (let d = 4; d < 60 && !staffOk; d += 7) {
    const staffCards = await hall(s.p, 'STAFF ' + d, 'town', d, 600);
    const st = await s.p.evaluate(() => { const btn = Array.from(document.querySelectorAll('#sheet button')).find(x => /Take the/.test(x.textContent)); if (!btn) return null;
      const say = (document.querySelector('#sheet .say p') || {}).textContent || ''; const id = (btn.textContent.match(/Take the (\w+) on/) || [])[1];
      return { id, btn: +((btn.textContent.match(/(\d+)\s*batt/) || [])[1]), said: +((say.match(/for (\d+) batteries/) || [])[1] || NaN), price: window.BohemiaFollowers ? BohemiaFollowers.hirePrice(id, BohemiaSettlement.state.hired || {}) : null }; });
    if (!st) continue;
    const n0 = await s.p.evaluate(() => (window.__settleLog || []).length);
    await s.p.evaluate(() => Array.from(document.querySelectorAll('#sheet button')).find(x => /Take the/.test(x.textContent)).click());
    await s.p.waitForTimeout(250);
    const lg = await s.p.evaluate(n => (window.__settleLog || []).slice(n), n0);
    const hr = lg.find(m => m.act === 'hire'), bal = lg.length ? lg[lg.length - 1].batteries : null;
    staffOk = st.btn === st.price && st.said === st.btn && !!hr && hr.price === st.btn && bal === 600 - st.btn;
    staffWhy = st.id + ': button ' + st.btn + ', line ' + st.said + ', price ' + st.price + ', 600 -> ' + bal;
  }
  ok('the camp staff: the button, his line and the tap agree, the price once, taken from the stash (a paymaster\'s cut in all three)', staffOk, staffWhy);
  await s.p.evaluate(() => { window.BohemiaGoodBros = window.__goodbros; });
  await s.ctx.close();

  /* the lever is read, not typed */
  plantEasier = 1;
  s = await page();
  const planted = await hall(s.p, 'PRICES TOWN', 'town', 11, 500);
  ok('the lever is read from the data file: planted at 1.0, every price is Battle Brothers\' own', planted.length > 0 && planted.every(c => c.shown === oracle(c, 1)), planted.map(c => c.backgroundId + ' ' + c.shown).join(', '));
  plantEasier = null; await s.ctx.close();

  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE HIRE PRICE IS THE FORMULA: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
