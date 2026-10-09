/* THE ONE-FILE LOOP GATE (RUN TWO, rule 58, 10/1). The only gate the row allows: a driver
   plays slices/BOHEMIA_LOOP.html end to end on his phone's profile (390x844 at 3x) with
   real taps: travel, arrive, take a contract at the board, leave, travel to the job, fight
   it to an END, get PAID, back on the map, hire at the hall, a night passes and the wage
   comes out. Shots: slices/vote/RUN2_THE_LOOP_*.png.  Run: node gates/one_file_loop_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8841;
const TYPE = { '.html':'text/html', '.js':'text/javascript', '.png':'image/png', '.json':'application/json' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const shot = n => path.join(ROOT, 'slices/vote/RUN2_THE_LOOP_' + n + '_10_1.png');
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
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_LOOP.html', { waitUntil: 'load' });
  await p.waitForTimeout(800);
  const G = f => p.evaluate(f);
  const tapAt = async xy => { await p.mouse.click(xy.x, xy.y); };
  const waitFor = async (fn, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p.evaluate(fn)) return true; await p.waitForTimeout(100); } return false; };
  const fr = () => p.frame({ url: /SETTLEMENT/ });

  await p.screenshot({ path: shot('MAP') });
  ok('it opens on the map with you on it', await G(() => LOOP.G.mode === 'map'));
  /* 1. travel to the fortress at 5x */
  await tapAt(await G(() => LOOP.placeAt('fort')));
  await p.click('#pad button[data-s="5"]');
  ok('tap a place and the party travels at 5x', await G(() => LOOP.G.party.path.length > 0 && LOOP.G.speed === 5));
  const arrived = await waitFor(() => LOOP.G.mode === 'settle' && document.getElementById('settle').style.display === 'block', 60000);
  ok('it arrives and the settlement screen opens', arrived, await G(() => LOOP.G.party.at + ' day ' + LOOP.G.day + ' ' + LOOP.G.hour.toFixed(1)));
  await p.waitForTimeout(500);
  /* 2. the board: take a contract */
  const f = fr();
  await p.mouse.click(...Object.values(await f.evaluate(() => { const w = BohemiaSettlement.where('board'); return {x:w.x, y:w.y}; }))); await p.waitForTimeout(300);
  const boardPay = await f.evaluate(() => { const e = document.querySelector('#sbody .act:not([disabled]) em'); return e ? parseInt((e.textContent.match(/(\d+)\s*batt/) || [])[1], 10) : null; });
  await f.click('#sbody .act:not([disabled])'); await p.waitForTimeout(300);
  await f.click('#sbody .act:not([disabled])'); await p.waitForTimeout(300);
  await p.screenshot({ path: shot('BOARD') });
  ok('take a contract at the board', await G(() => LOOP.G.held.length === 1), await G(() => LOOP.G.held.map(c => c.title).join()));
  await f.click('#leave'); await p.waitForTimeout(300);
  ok('LEAVE puts you back on the map', await G(() => LOOP.G.mode === 'map' && document.getElementById('settle').style.display === 'none'));
  /* 3. go to the job */
  const bats0 = await G(() => LOOP.G.bats);
  await tapAt(await G(() => LOOP.jobAt(0)));
  await p.click('#pad button[data-s="5"]');
  const fought = await waitFor(() => { const ev = document.getElementById('ev'); if (ev.style.display === 'block' && LOOP.G.mode === 'map') ev.querySelector('button').click(); return LOOP.G.mode === 'fight'; }, 90000);
  ok('walk onto the job and the fight starts', fought);
  await p.waitForTimeout(300);
  await p.screenshot({ path: shot('FIGHT') });
  /* 4. fight it to an end with real taps */
  let taps = 0;
  while (taps < 300) {
    const st = await G(() => LOOP.G.mode);
    if (st !== 'fight') break;
    const xy = await G(() => LOOP.fightTap());
    if (xy) { await tapAt(xy); taps++; }
    await p.waitForTimeout(xy ? 60 : 200);
  }
  await p.waitForTimeout(600);
  const res = await G(() => ({ mode: LOOP.G.mode, ev: document.getElementById('evwho').textContent, bats: LOOP.G.bats, held: LOOP.G.held.length, line: document.getElementById('evtx').textContent }));
  ok('the fight ENDS', res.mode === 'map', taps + ' taps');
  ok('  and you won and got PAID', res.ev === 'WON' && res.bats - bats0 >= 1 && res.held === 0, res.line);
  const paidN = parseInt((res.line.match(/Paid (\d+) batter/) || [])[1], 10);
  ok('  and the stash got exactly what the board said', boardPay > 0 && paidN === boardPay, 'board ' + boardPay + ', paid ' + paidN);
  await p.screenshot({ path: shot('PAID') });
  await p.click('#ev button');
  /* 5. hire at the hall */
  await tapAt(await G(() => LOOP.placeAt('wash')));
  await p.click('#pad button[data-s="5"]');
  ok('back to a town', await waitFor(() => { const ev = document.getElementById('ev'); if (ev.style.display === 'block') ev.querySelector('button').click(); return LOOP.G.mode === 'settle'; }, 90000));
  await p.waitForTimeout(500);
  await p.mouse.click(...Object.values(await fr().evaluate(() => { const w = BohemiaSettlement.where('hall'); return {x:w.x, y:w.y}; }))); await p.waitForTimeout(300);
  await fr().click('#sbody .act'); await p.waitForTimeout(300);
  ok('hire one at the hall', await G(() => LOOP.G.crew.length === 4), await G(() => LOOP.G.crew.map(c => c.name + ':' + c.role).join()));
  await fr().click('#leave'); await p.waitForTimeout(300);
  /* 6. a night passes and the wage comes out */
  const n0 = await G(() => ({ b: LOOP.G.bats, d: LOOP.G.day }));
  await p.click('#pad button[data-s="5"]');
  await tapAt(await G(() => LOOP.placeAt('pump')));
  await p.click('#pad button[data-s="5"]');
  const nightOk = await waitFor(() => { const ev = document.getElementById('ev'); if (ev.style.display === 'block') ev.querySelector('button').click();
    if (LOOP.G.mode === 'settle') { document.getElementById('settle').style.display = 'none'; LOOP.G.mode = 'map'; }
    if (LOOP.G.mode === 'map' && !LOOP.G.party.path.length) { LOOP.G.party.path = []; } 
    return LOOP.G.log.some(l => /Wages paid/.test(l)); }, 120000);
  ok('a night passes and the hire is paid a battery', nightOk, await G(() => LOOP.G.log.filter(l => /Wages|Morning/.test(l)).slice(-2).join(' | ')));
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE ONE-FILE LOOP GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
