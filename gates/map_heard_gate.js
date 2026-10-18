/* ============================================================================
   THE MAP HEARD GATE  (SOUNDS, row [the desert under travel], 10/18/26)

   PAOLO 10/10, the eleventh votes, on the travel clip: "The travel clip at night is terrible
   so just use the day one for the night one too... You don't have to fall in love with this
   fucked up generator humming noises everywhere." And 10/17, UP on the settlement heard whole
   (the real recordings, thinned to a desert). This proves, on the real alpha and its demo cut:
     - the map's travel state brings in the SAME recorded desert bed the settlement plays
       (bed_day.mp3), and it loads and decodes
     - by NIGHT it is still the day clip (his words), never the night or rainforest beds
     - while it plays, the old engine ambience (air, gust, generator) stands down: a forced
       AMB tick renders nothing
     - reaching a town plays no engine generator
     - the settlement screen open, the map going quiet, or another tab: the bed fades out
     - the demo cut carries the same code
   Run: node gates/map_heard_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.dirname(__dirname);
const PORT = 8881;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.mp3': 'audio/mpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.txt': 'text/plain' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + x + ']' : '')); };

const srv = http.createServer((rq, rs) => {
  const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(rs);
});

function block(src) {
  const a = src.indexOf('var MAPDESERT={'), z = src.indexOf('window.__MAPDESERT=MAPDESERT;');
  return a >= 0 && z > a ? src.slice(a, z) : '';
}

(async () => {
  const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const demo = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');
  const A = block(alpha), D = block(demo);
  ok('the alpha carries the map\'s desert bed', A.length > 500);
  ok('  the demo cut carries the same code, byte for byte', D.length > 0 && D === A);
  ok('  it names the recorded day bed, never the night bed or the rainforest copies', /BED:'bed_day'/.test(A) && !/bed_night|rainforest/.test(A));
  ok('  the file it names is on disk', fs.existsSync(path.join(ROOT, 'slices/vote/settlement_heard/bed_day.mp3')));
  ok('the arrival no longer reaches for the engine generator', !/placeSound\('generator', \{ dx:\(Math\.random\(\)\*2-1\)\*7/.test(alpha));
  ok('AMB.tick stands down while the desert plays', /MAPDESERT\.playing && MAPDESERT\.playing\(\)\) return;/.test(alpha));

  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [], bad = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  p.on('response', r => { if (r.status() >= 400 && /settlement_heard/.test(r.url())) bad.push(r.url()); });
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load' });
  await p.waitForFunction(() => !!window.__MAPDESERT && typeof MUS !== 'undefined', null, { timeout: 30000 });
  await p.evaluate(() => {
    try { MUS.audio(); } catch (e) {}
    /* the gate is the only poster: a live city frame would race its own map state against the probe */
    document.querySelectorAll('#cityFrame,#mapFrame').forEach(f => { try { f.remove(); } catch (e) {} });
    window.__tabOn = function (k) { document.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x.dataset.p === k)); };
    window.__tabOn('run');
    window.__ms = { moving: true, surface: 'road', night: false, settlement: false, stopped: false };
    window.__post = setInterval(function () { window.postMessage(Object.assign({ type: 'BOHEMIA_MAP_STATE', from: 'map' }, window.__ms), '*'); }, 500);
  });
  await p.waitForTimeout(2500);
  const s1 = await p.evaluate(() => ({ on: __MAPDESERT.playing(), id: __MAPDESERT.id, g: !!__MAPDESERT.g, buf: Object.keys(__MAPDESERT.buf), errs: __MAPDESERT.log.filter(x => x.err) }));
  ok('travel on the map brings the recorded desert in', s1.on && s1.id === 'bed_day' && s1.g, JSON.stringify(s1));
  ok('  and the recording loaded and decoded', s1.buf.includes('bed_day') && s1.errs.length === 0, JSON.stringify(s1.errs));

  /* the old ambience stands down: force a tick, count renders */
  const tick = await p.evaluate(() => {
    const calls = []; const orig = BOH_SFX && BOH_SFX.render;
    try { BOH_SFX.render = function (v) { calls.push(v && v.ev); }; } catch (e) {}
    const AMB = window.__AMB; AMB.kind = AMB.kind || 'air_day'; AMB.next = 1; AMB.tick();
    try { BOH_SFX.render = orig; } catch (e) {}
    return { calls, next: AMB.next };
  });
  ok('while the desert plays, a forced ambience tick renders nothing (no engine air, gust or generator)', tick.calls.length === 0 && tick.next === 1, JSON.stringify(tick));

  /* night: still the day clip */
  await p.evaluate(() => { window.__ms.night = true; });
  await p.waitForTimeout(800);
  await p.evaluate(() => { __MAPDESERT.stop(); });
  await p.waitForTimeout(1600);
  const s2 = await p.evaluate(() => ({ id: __MAPDESERT.id, last: __MAPDESERT.log.filter(x => x.on).slice(-1)[0] }));
  ok('by night the map plays the DAY clip, his words', s2.id === 'bed_day' && s2.last && s2.last.night === true, JSON.stringify(s2));

  /* arrival: no generator */
  const arr = await p.evaluate(async () => {
    const calls = []; const orig = BOH_SFX && BOH_SFX.render;
    try { BOH_SFX.render = function (v) { calls.push(v && v.ev); }; } catch (e) {}
    window.postMessage(Object.assign({ type: 'BOHEMIA_MAP_STATE', from: 'map' }, window.__ms, { arriving: { name: 'JEAN', seq: 9001, ago: 0 } }), '*');
    await new Promise(r => setTimeout(r, 400));
    try { BOH_SFX.render = orig; } catch (e) {}
    return { calls, seq: window.__AMB.arrivedSeq };
  });
  ok('reaching a town is decided and plays no engine generator', arr.seq === 9001 && arr.calls.indexOf('generator') < 0, JSON.stringify(arr));

  /* the settlement screen open: off */
  await p.evaluate(() => { window.__ms.settlement = true; });
  await p.waitForTimeout(1200);
  ok('the settlement screen open: the map\'s bed fades out (the town\'s own bed takes over)', !(await p.evaluate(() => __MAPDESERT.playing())));
  await p.evaluate(() => { window.__ms.settlement = false; });
  await p.waitForTimeout(1200);
  ok('  and back on the map it returns', await p.evaluate(() => __MAPDESERT.playing()));

  /* another tab: off */
  await p.evaluate(() => window.__tabOn('vote'));
  await p.waitForTimeout(1500);
  ok('another tab (the VOTE tab): silent, the game never plays to an empty room', !(await p.evaluate(() => __MAPDESERT.playing())));
  await p.evaluate(() => window.__tabOn('run'));
  await p.waitForTimeout(1200);

  /* the map goes quiet (a fight, the frame gone): off within two seconds */
  /* the real city frame may be posting too on the RUN tab (that is right: it IS the map), so the gate
     stops listening rather than stopping every poster, and lets the clock run out */
  await p.evaluate(() => { clearInterval(window.__post); __MAPDESERT.hear = function () {}; });
  await p.waitForTimeout(2600);
  ok('when the map stops posting, the bed is gone within 2.6 s', !(await p.evaluate(() => __MAPDESERT.playing())));

  ok('every recording the page asked for was there', bad.length === 0, bad.slice(0, 3).join(' '));
  const mine = errs.filter(e => /MAPDESERT|__AMB|map_heard/i.test(e));
  ok('nothing in this code threw', mine.length === 0, mine.slice(0, 3).join(' | '));

  await b.close(); srv.close();
  console.log('\nMAP HEARD GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate itself threw: ' + e.message); try { srv.close(); } catch (_e) {} process.exit(1); });
