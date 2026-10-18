/* THE STASH SCREEN GATE (RUN TWO, row [the stash screen], 10/10/26).
   On his phone's profile: the six in his order with UI's drawn icons; food's and meds' days left
   are the stash divided by ECONOMY's own day (engine/bohemia_stash.js daySpend, run here in node on
   the same files); a day on the clock spends exactly that, and the days-left number drops by one;
   the wage due at noon is the crew's wages; the next town's goods are listed; a buy at the stall
   lands in the stash. Shot: slices/vote/RUN2_THE_STASH_10_10.png. Run: node gates/stash_screen_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8865;
const STASH = require(path.join(ROOT, 'engine/bohemia_stash.js'));
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
  const p = await ctx.newPage(); const errs = [], missing = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_STASH_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaStashScreen && BohemiaStashScreen.state.ready, null, { timeout: 30000 });
  const crew = [{ name: 'YOU', wage: 3 }, { name: 'DESI', wage: 2 }, { name: 'RAUL', wage: 2 }, { name: 'TINA', wage: 1 }];
  const O = { six: { batteries: 20, food: 50, meds: 5, rounds: 30, tape: 4, water: 6 }, crew, terrain: 'desert', injuries: 2, hour: 9, nextTown: { name: 'DRY CAMP', sells: ['food', 'water', 'meds'] } };
  await p.evaluate(o => BohemiaStashScreen.open(o), O); await p.waitForTimeout(300);
  const rows = await p.evaluate(() => [].map.call(document.querySelectorAll('.sup'), r => ({ k: r.dataset.s, icon: (r.querySelector('img').naturalWidth || 0), days: r.querySelector('.dl').dataset.days, txt: r.querySelector('.dl').textContent })));
  ok('the six in his order: batteries, food, meds, rounds, tape, water', rows.map(r => r.k).join() === 'batteries,food,meds,rounds,tape,water');
  ok('  each with UI\'s drawn icon', rows.every(r => r.icon > 0));
  const want = STASH.daySpend({ headcount: crew.length, terrain: 'desert', openInjuries: 2 });
  const got = await p.evaluate(() => BohemiaStashScreen.perDay());
  ok('food and meds spend ECONOMY\'s own day (its engine, the same files)', got.food === want.food && got.meds === want.medicine, 'food ' + got.food + '/' + want.food + ', meds ' + got.meds + '/' + want.medicine);
  const fd = rows.find(r => r.k === 'food'), md = rows.find(r => r.k === 'meds'), bt = rows.find(r => r.k === 'batteries');
  ok('  days left: the stash over the day', +fd.days === Math.floor(50 / want.food) && +md.days === Math.floor(5 / want.medicine) && +bt.days === Math.floor(20 / 8), fd.txt + ', ' + md.txt + ', ' + bt.txt);
  await p.screenshot({ path: path.join(ROOT, 'slices/vote/RUN2_THE_STASH_10_10.png') });
  const spent = await p.evaluate(() => BohemiaStashScreen.day());
  const after = await p.evaluate(() => ({ six: BohemiaStashScreen.state.six, food: BohemiaStashScreen.daysLeft('food'), meds: BohemiaStashScreen.daysLeft('meds') }));
  ok('a day on the clock spends exactly that, and the days drop by one', Math.abs(after.six.food - (50 - want.food)) < 1e-6 && after.six.meds === 5 - want.medicine && after.food === Math.floor(50 / want.food) - 1 && after.meds === Math.floor(5 / want.medicine) - 1,
     'food ' + after.six.food + ' (' + after.food + ' days), meds ' + after.six.meds + ' (' + after.meds + ' days)');
  await p.evaluate(() => BohemiaStashScreen.open({ injuries: 0 }));
  const none = await p.evaluate(() => document.querySelector('.sup[data-s="meds"] .dl').textContent);
  ok('  nobody hurt: meds are not spent, never a fake number', /NOT SPENT/.test(none), none);
  const wage = await p.evaluate(() => document.getElementById('wage').textContent);
  ok('the wage due at noon is the crew\'s wages', /8 BATTERIES for 4 men, in 3 hours/.test(wage), wage);
  const nx = await p.evaluate(() => document.getElementById('next').textContent);
  ok('what the next town sells', /DRY CAMP/.test(nx) && /water/.test(nx), nx.slice(0, 60));
  const w0 = await p.evaluate(() => BohemiaStashScreen.state.six.water);
  await p.evaluate(() => window.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'buy', good: 'water' }, '*')); await p.waitForTimeout(200);
  const w1 = await p.evaluate(() => BohemiaStashScreen.state.six.water);
  ok('a buy at the stall lands in the stash', w1 === w0 + 1, w0 + ' -> ' + w1);
  const small = await p.evaluate(() => [].filter.call(document.querySelectorAll('button,.sup'), e => { const r = e.getBoundingClientRect(); return Math.min(r.width, r.height) < 44; }).length);
  ok('every target is 44 on his phone', small === 0, small + ' small');
  ok('every file loads', missing.length === 0, missing.slice(0, 2).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE STASH SCREEN GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
