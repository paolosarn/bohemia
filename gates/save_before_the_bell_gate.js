#!/usr/bin/env node
/* ============================================================================
   A SAVE EXISTS AT THE BELL
   (9/14/26, COMBAT lane, VAMILY [prefight save] = BB-SAVE-BEFORE-THE-BELL)

   THE ROW: "THE GAME HE NAMED AUTOSAVES BEFORE EVERY BATTLE. OURS IS COVERED BY
   ACCIDENT." Its ship test, in its own words: "a save exists at the bell WHETHER OR
   NOT THE FRAME BLURS."

   MEASURED BEFORE THE FIX, driving a fight through the shipped door and counting the
   save traffic that actually reaches the shell: 0 saves and 0 BLURS, at 1.5 seconds
   and again at 5.5. The accidental protection did not fire even once.

   SO THIS GATE COUNTS THE REAL SAVE TRAFFIC, not a function call: the shell's own
   bohemiaCityState messages, which is what CITYSAVE.save actually runs on. And it
   counts blurs alongside, because "whether or not the frame blurs" is the claim and a
   save that only happens when something blurs is the bug, not the fix.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((rq, rp) => {
      const u = decodeURIComponent((rq.url || '/').split('?')[0]);
      const f = path.join(REPO, u);
      if (!f.startsWith(REPO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rp.writeHead(404); return rp.end('no'); }
      rp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

let pass = 0, fail = 0, SRV = null;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = async (b) => { if (b) await b.close(); if (SRV) try { SRV.close(); } catch (e) {}
  console.log('=== SAVE BEFORE THE BELL GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

const RING = `() => {
  try { FZOOMING = false; } catch (e) {}
  const real = window.ctAdjacent;
  window.ctAdjacent = () => ({ id: 'sv_' + Math.random(), home: [3, 3], hostile: true });
  SF_STEPS = 9999; SF_LAST = -9999; SF_DONE = {};
  try { contactClear(); } catch (e) {}
  const r = streetFightOnStep();
  window.ctAdjacent = real;
  return r;
}`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));

  SRV = await serve();
  const BASE = 'http://127.0.0.1:' + SRV.address().port;
  await page.goto(BASE + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load', timeout: 120000 });
  await sleep(9000);
  await page.mouse.click(215, 450); await sleep(2500);
  await page.mouse.click(215, 450);

  let city = null;
  for (let i = 0; i < 900; i++) {
    city = page.frames().find(f => { try { return f.name() === 'cityFrame'; } catch (e) { return false; } });
    if (city) { let a = false;
      try { a = await city.evaluate(() => typeof ctSawCell === 'function'); } catch (e) {}
      if (a) break; }
    await sleep(150);
  }
  ok('the walked street is on screen, which is the only thing that holds a save', !!city);
  if (!city) return done(browser);

  /* THE REAL SAVE TRAFFIC, IN ORDER, plus the blurs it must not depend on */
  await page.evaluate(() => {
    window.__LOG = [];
    window.addEventListener('message', e => { const d = e && e.data;
      if (d && d.bohemiaCityState !== undefined) window.__LOG.push({ t: 'SAVE', at: Date.now() });
      else if (d && d.type === 'BOHEMIA_CITY_ENCOUNTER') window.__LOG.push({ t: 'ENCOUNTER', at: Date.now() });
    });
  });
  await city.evaluate(() => { window.__BLUR = 0; window.addEventListener('blur', () => { window.__BLUR++; }); });
  await sleep(3000);
  const read = async () => ({
    log: await page.evaluate(() => window.__LOG.slice()),
    blurs: await city.evaluate(() => window.__BLUR) });

  /* settle: ignore anything the boot was still doing */
  await page.evaluate(() => { window.__LOG = []; });
  await city.evaluate(() => { window.__BLUR = 0; });
  const before = await read();

  const fired = await city.evaluate(eval('(' + RING + ')'));
  await sleep(2000);
  const after = await read();
  console.log('  the bell rang ' + fired + ' -> ' + JSON.stringify(after.log.map(x => x.t))
    + '  blurs ' + after.blurs);

  const saves = after.log.filter(x => x.t === 'SAVE');
  const encs = after.log.filter(x => x.t === 'ENCOUNTER');

  ok('*** A SAVE EXISTS AT THE BELL, WHICH IS THE ROW\'S OWN SHIP TEST. *** Driving a fight through the shipped door, '
    + saves.length + ' save(s) reached the shell within two seconds. Before this row that number was ZERO, measured the same way: the walked city\'s flushState had FOUR callers and all four were lifecycle events -- pagehide, freeze, blur, visibilitychange -- and nothing fired at the moment combat opened',
    fired === true && saves.length >= 1 && before.log.length === 0);

  ok('*** AND IT DOES NOT DEPEND ON THE FRAME BLURRING, WHICH IS THE OTHER HALF OF THE SHIP TEST AND THE WHOLE POINT. *** The row said the fight was "probably saved" because opening it blurs the city iframe. Measured before the fix: 0 saves AND 0 BLURS -- the accidental protection did not fire even once. This run saved with '
    + after.blurs + ' blurs, so the protection is the code and not the side effect. A protection nobody wrote down is one nobody is maintaining',
    saves.length >= 1 && after.blurs === 0);

  ok('AND THE SAVE GOES OUT BEFORE THE ENCOUNTER, never after, so what gets written is the world AS IT STOOD BEFORE THE FIGHT. postMessage from one window is ordered, and the order on the wire was '
    + JSON.stringify(after.log.map(x => x.t)),
    saves.length >= 1 && encs.length >= 1
    && after.log.findIndex(x => x.t === 'SAVE') < after.log.findIndex(x => x.t === 'ENCOUNTER'));

  /* ---- IT IS ONE SNAPSHOT, NOT A SECOND SAVE FORMAT --------------------- */
  const shape = await city.evaluate(() => {
    const src = String(flushState);
    return { usesSnapshot: src.indexOf('citySnapshot()') >= 0,
      clearsDebounce: /_svT/.test(src),
      snapshotFns: (typeof citySnapshot === 'function') };
  });
  console.log('  the shape: ' + JSON.stringify(shape));
  ok('AND IT IS THE SAME SNAPSHOT THE DEBOUNCED PATH WRITES, not a second save format to keep in step: the door calls flushState, which posts citySnapshot() ('
    + shape.usesSnapshot + ') and clears the debounce timer first (' + shape.clearsDebounce
    + '). The file learned this the hard way once already -- its own note says the emergency path used to carry a hand-copied literal that was two fields behind and silently dropped the purse and the market',
    shape.usesSnapshot === true && shape.clearsDebounce === true && shape.snapshotFns === true);

  /* ---- A SECOND BELL SAVES AGAIN, AND SAVING TWICE IS FREE -------------- */
  await page.evaluate(() => { window.__LOG = []; });
  await page.click('[data-p="run"]', { timeout: 15000 }).catch(() => {});
  await sleep(2500);
  await page.evaluate(() => { window.__LOG = []; });
  const fired2 = await city.evaluate(eval('(' + RING + ')'));
  await sleep(2000);
  const second = await read();
  console.log('  the second bell: ' + fired2 + ' -> ' + JSON.stringify(second.log.map(x => x.t)));
  ok('AND EVERY BELL SAVES, not just the first: a second fight through the same door put '
    + second.log.filter(x => x.t === 'SAVE').length
    + ' more save(s) on the wire. flushState is idempotent by its own design, so a bell that ALSO blurs simply saves twice, which costs nothing and is correct',
    fired2 === true && second.log.filter(x => x.t === 'SAVE').length >= 1);

  /* ---- ONE DOOR COVERS ALL FOUR ENTRIES --------------------------------- */
  const door = await city.evaluate(() => {
    const src = String(cityHandOver);
    return { flushes: src.indexOf('flushState') >= 0,
      stampsWorld: src.indexOf('cityWorldNow') >= 0,
      stampsPlate: src.indexOf('cityPlateNow') >= 0 };
  });
  console.log('  the door: ' + JSON.stringify(door));
  ok('AND IT IS AT THE ONE DOOR, so an entry built after this one is protected without knowing this exists: cityHandOver now flushes the save ('
    + door.flushes + ') beside the world stamp V207 put there (' + door.stampsWorld
    + ') and the plate stamp V211 put there (' + door.stampsPlate
    + '). V205 routed all four ways into a fight through this function; this is the fourth thing to reuse that',
    door.flushes === true && door.stampsWorld === true && door.stampsPlate === true);

  ok('no page errors through the whole round trip', errors.length === 0);
  if (errors.length) console.log('  errors: ' + JSON.stringify(errors.slice(0, 3)));
  return done(browser);
})().catch(async e => {
  console.log('  FAIL gate threw: ' + (e && e.message));
  fail++; return done(null);
});
