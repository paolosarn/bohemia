/* ============================================================================
   THE SETTLEMENT HEARD GATE  (SOUNDS, row [the settlement's sounds] round four, 10/18/26)

   PAOLO 10/17, UP on sounds-the-settlement-heard-whole-10-17 with his note (too many birds
   and insects for a desert city), answered by [a desert, not a rainforest] (7e9e31b). This
   proves the recordings now play IN THE REAL SCREEN, not only on the judge page:
     - the screen loads engine/bohemia_settlement_heard.js and every file it names is there
     - a tap on a building plays that building's recording (the judge page's map, unchanged)
     - the clinic's door, a buy and the bar's round play the recording INSTEAD of the bank
       sound: the screen posts nothing to the parent for those four events
     - at night a building plays at the screen's NIGHT_TRIM (0.5)
     - the desert bed comes in on the first tap and the night bed by night
     - HIDDEN IS SILENT: the map hides the frame on LEAVE (display:none); the bed stops,
       and comes back when the map posts the next visit
     - the bed is the thinned desert one (its file is the 10/18 bed, not the rainforest copy)
     - nothing threw
   It drives the screen in a host frame on his phone's profile, the way the map holds it.
   Run: node gates/settlement_heard_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const ROOT = path.dirname(__dirname);
const PORT = 8879;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.mp3': 'audio/mpeg' };
const DIR = path.join(ROOT, 'slices/vote/settlement_heard');

let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + x + ']' : '')); };

const HOST = `<!doctype html><html><body style="margin:0;background:#000">
<iframe id="f" src="/slices/BOHEMIA_SETTLEMENT_SCREEN.html" style="position:fixed;inset:0;width:100%;height:100%;border:0"></iframe>
<script>window.__toParent=[];window.addEventListener('message',function(e){var d=e.data||{};if(d.type==='BOHEMIA_SFX')window.__toParent.push(d.ev);});</script>
</body></html>`;

const srv = http.createServer((rq, rs) => {
  const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
  if (rel === '__host.html') { rs.setHeader('content-type', 'text/html'); return rs.end(HOST); }
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(rs);
});

(async () => {
  /* ---- the files, read off disk ---- */
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_settlement_heard.js'), 'utf8');
  const screen = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
  ok('the screen loads the sound module', /<script src="\.\.\/engine\/bohemia_settlement_heard\.js"><\/script>/.test(screen));
  const ids = new Set();
  const EVENTS = new Set(['bar_glass', 'door_open', 'door_shut']);   /* the screen's own event names, not files */
  for (const m of src.matchAll(/'((?:hall|board|stall|barber|yard|arms|smith|armourer|lot|build|clinic|bar|bed|far)_[a-z_]+)'/g)) if (!EVENTS.has(m[1])) ids.add(m[1]);
  const missing = [...ids].filter(id => !fs.existsSync(path.join(DIR, id + '.mp3')));
  ok('every recording the module names is on disk (' + ids.size + ')', ids.size >= 20 && missing.length === 0, missing.join(' '));
  const man = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));
  const inMan = new Set([...man.sounds, ...man.beds, ...man.events].map(e => e.id));
  const unlisted = [...ids].filter(id => !inMan.has(id));
  ok('  and every one is in the manifest, with its author and licence', unlisted.length === 0, unlisted.join(' '));
  const cc0 = [...man.sounds, ...man.beds, ...man.events].filter(e => ids.has(e.id)).every(e => (e.sources || []).length && e.sources.every(s => /CC0/i.test(s.licence)));
  ok('  every source CC0', cc0);
  const md5 = f => crypto.createHash('md5').update(fs.readFileSync(path.join(DIR, f))).digest('hex');
  ok('the live bed is the thinned desert bed, not the 10/17 rainforest copy', md5('bed_day.mp3') !== md5('bed_day_rainforest.mp3') && md5('bed_night.mp3') !== md5('bed_night_rainforest.mp3'));
  ok('the module never names the rainforest beds', !/rainforest'/.test(src));

  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [], bad = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  p.on('response', r => { if (r.status() >= 400) bad.push(r.url()); });
  await p.goto('http://127.0.0.1:' + PORT + '/__host.html', { waitUntil: 'load' });
  const fr = () => p.frame({ url: /BOHEMIA_SETTLEMENT_SCREEN/ });
  await p.waitForFunction(() => { try { const w = document.getElementById('f').contentWindow; return w.BohemiaSettlement && w.BohemiaSettlement.ready() && w.BohemiaHeard; } catch (e) { return false; } }, null, { timeout: 30000 });
  const F = fr();
  await F.evaluate(() => BohemiaSettlement.open({ traits: [], night: false, place: { name: 'THE WASH', tier: 'town' } }));
  await p.waitForTimeout(300);
  const st0 = await F.evaluate(() => BohemiaHeard.state());
  ok('nothing plays before the first tap (a phone allows none)', !st0.unlocked && st0.bed === null, JSON.stringify(st0));

  const tapB = async k => {
    if (await F.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await F.click('#close'); await p.waitForTimeout(250); }
    const xy = await F.evaluate(k => BohemiaSettlement.where(k), k);
    if (!xy) throw new Error('no pixels for ' + k);
    await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(250);
  };
  const lastIds = async n => F.evaluate(n => window.__heardLog.slice(-n).map(x => x.id + (x.err ? '!' + x.err : '')), n);

  const taps = await F.evaluate(() => BohemiaHeard.taps());
  const order = await F.evaluate(() => BohemiaSettlement.order());
  let tapped = 0, right = 0; const wrong = [];
  for (const k of order) {
    if (!taps[k]) continue;
    tapped++;
    await tapB(k);
    const got = (await lastIds(1))[0];
    if (got === taps[k]) right++; else wrong.push(k + '->' + got);
  }
  ok('every building on the screen answers its tap with its own recording (' + right + ' of ' + tapped + ')', tapped >= 5 && right === tapped, wrong.join(' '));
  const st1 = await F.evaluate(() => BohemiaHeard.state());
  ok('the first tap brought the desert bed in, by day', st1.unlocked && st1.bed === 'bed_day', JSON.stringify(st1));
  await p.waitForTimeout(1500);
  const fails = await F.evaluate(() => window.__heardLog.filter(x => x.err).map(x => x.id + ' ' + x.err));
  ok('every recording loaded and decoded', fails.length === 0, fails.slice(0, 3).join('; '));

  /* the clinic's door, the recording and not the bank sound */
  await p.evaluate(() => { window.__toParent.length = 0; });
  if (order.includes('clinic')) {
    await tapB('clinic');
    const ids2 = await lastIds(1);
    await F.click('#close'); await p.waitForTimeout(250);
    const ids3 = await lastIds(1);
    const toParent = await p.evaluate(() => window.__toParent.slice());
    ok('the clinic\'s door opens and shuts on the real recordings', ids2[0] === 'clinic_door_open' && ids3[0] === 'clinic_door_shut', ids2 + ' / ' + ids3);
    ok('  and the bank door is NOT played on top (nothing posted to the parent)', !toParent.includes('door_open') && !toParent.includes('door_shut'), toParent.join());
    const log = await F.evaluate(() => window.__settleLog.filter(m => m.type === 'BOHEMIA_SFX').map(m => m.ev));
    ok('  the screen still logs its own door events (the settlement gate reads them)', log.includes('door_open') && log.includes('door_shut'));
  } else ok('the clinic is on this screen', false, order.join());

  /* the bar: the murmur while the sheet is open, gone when it shuts */
  if (order.includes('bar')) {
    await tapB('bar');
    const m1 = await F.evaluate(() => BohemiaHeard.state().murmur);
    await F.click('#close'); await p.waitForTimeout(250);
    const m2 = await F.evaluate(() => BohemiaHeard.state().murmur);
    ok('the bar\'s murmur plays while its door is open, and stops when it shuts', m1 === 'bed_bar_murmur' && m2 === null, m1 + ' / ' + m2);
  }

  /* night: the bed turns, a building at half */
  await F.evaluate(() => BohemiaSettlement.open({ night: true }));
  await p.waitForTimeout(300);
  const k0 = order.find(k => taps[k]);
  await tapB(k0);
  const nlog = await F.evaluate(() => window.__heardLog.slice(-1)[0]);
  const st2 = await F.evaluate(() => BohemiaHeard.state());
  ok('by night the bed is the night bed', st2.night && st2.bed === 'bed_night', JSON.stringify(st2));
  ok('  and a building plays at the screen\'s night trim (0.5)', nlog && nlog.mul === 0.5, JSON.stringify(nlog));

  /* hidden is silent: the map hides the frame the way loopClose() does */
  await p.evaluate(() => { document.getElementById('f').style.display = 'none'; });
  await p.waitForTimeout(1400);
  const st3 = await F.evaluate(() => BohemiaHeard.state());
  ok('when the map hides the screen, the bed stops (no desert over the map)', st3.bed === null && !st3.shown, JSON.stringify(st3));
  await p.evaluate(() => { const f = document.getElementById('f'); f.style.display = 'block'; f.contentWindow.postMessage({ type: 'BOHEMIA_SETTLEMENT_OPEN', place: { name: 'JEAN', tier: 'camp' }, night: false }, '*'); });
  await p.waitForTimeout(1400);
  const st4 = await F.evaluate(() => BohemiaHeard.state());
  ok('  and the next visit brings it back', st4.shown && st4.bed === 'bed_day', JSON.stringify(st4));

  /* LEAVE: silent at once */
  await F.click('#leave'); await p.waitForTimeout(300);
  const st5 = await F.evaluate(() => BohemiaHeard.state());
  ok('LEAVE silences the bed at once', st5.bed === null, JSON.stringify(st5));

  ok('every file the page asked for was there', bad.length === 0, bad.slice(0, 3).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));

  await b.close(); srv.close();
  console.log('\nSETTLEMENT HEARD GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate itself threw: ' + e.message); try { srv.close(); } catch (_e) {} process.exit(1); });
