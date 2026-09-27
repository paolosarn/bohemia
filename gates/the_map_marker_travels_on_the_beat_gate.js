#!/usr/bin/env node
/* THE MARKER CROSSES THE MAP ON THE BEAT.

   RULE 33, PAOLO 9/24, an executive decision: the valley is crossed the Battle
   Brothers way, a party marker you send somewhere while the clock runs. Rule
   33(f) gives every chat a [bb ...] school line; this lane's department is how
   things MOVE, so its question is how the marker travels.

   WHAT THE MAP DOES TODAY, MEASURED FIRST (rule 12): the walk pad pressed
   twenty-four times in all eight directions while zoomed out moved him ZERO
   lots. The same press on the street moves him twenty-two and shifts 76% of the
   screen in one frame. There is no party marker and the pad is dead out there.

   AND THE FORK THE SCHOOL FOUND, which is the same shape as UI's: BATTLE
   BROTHERS MOVES ITS MARKER IN CONTINUOUS REAL TIME AND LETS YOU PAUSE. The 120
   BPM law says movement is a REQUEST EXECUTED ON THE 500 ms BEAT, "a world law,
   not a mode rule", and rule 24 says one game mode. Those cannot both be true.
   Picked: the beat, because it is his own two rules agreeing and it is the walk
   feel he voted up (SLIDE, 9/21). A is built beside it so he can say A.

   THE LOAD-BEARING CLAIM IS NOT "B IS SLOWER". A marker that just crawled would
   pass "it holds at the beat" and be a worse game. B and A cover the SAME GROUND
   per second; what differs is the shape: B stops at every beat and moves twice
   as fast between them.                                       ANIMATION 9/27  */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const PAGE = path.join(ROOT, 'slices', 'vote', 'ANIMATION_HOW_YOU_CROSS_THE_MAP.html');
const BANK = path.join(ROOT, 'banks', 'BOHEMIA_THE_MAP_MARKERS_9_24_26.txt');
const LAW  = path.join(ROOT, 'laws', 'BOHEMIA_LAW_THE_OVERWORLD_IS_BATTLE_BROTHERS_9_24_26.md');
const CITY = path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nTHE MAP MARKER TRAVELS ON THE BEAT GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

ok('his ruling is in the repo, so the thing this answers can be read',
   fs.existsSync(LAW) && /party marker/i.test(fs.readFileSync(LAW, 'utf8')));

ok('the item PLAYS on a real clock and carries no control of its own',
   fs.existsSync(PAGE) && (() => { const v = fs.readFileSync(PAGE, 'utf8');
     return /requestAnimationFrame/.test(v) && /performance\.now\(\)/.test(v)
         && !/<button|<input|<select|<form|onclick=/i.test(v); })());

/* THE ART IS NOT MINE AND MUST NOT DRIFT. REUSE-FIRST: the marker is COOK's,
   embedded from their bank, so the page's copy is compared to the bank rather
   than eyeballed. */
ok('the marker is the art chat\'s, byte for byte, not redrawn here',
   fs.existsSync(BANK) && fs.existsSync(PAGE) && (() => {
     const bank = JSON.parse(fs.readFileSync(BANK, 'utf8')).markers.YOU;
     const m = /var M = (\{.*?\});/s.exec(fs.readFileSync(PAGE, 'utf8'));
     if (!m) return false;
     const mine = JSON.parse(m[1]);
     return JSON.stringify(mine.body) === JSON.stringify(bank.body)
         && JSON.stringify(mine.part) === JSON.stringify(bank.part)
         && mine.w === bank.w && mine.h === bank.h;
   })());

const HELD_MIN = 18;   /* B held on 25 of 78 samples; A on 7 of 79 */
const HELD_MAX_A = 12;
const SPEED_TOL = 0.9; /* the two must be within 0.9 px a sample of each other */

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();

  /* ===== 1. WHAT THE MAP DOES TODAY, measured live, never typed ===== */
  const pg1 = await br.newPage({ viewport: { width: 390, height: 844 } });
  const e1 = []; pg1.on('pageerror', e => e1.push(e.message));
  await pg1.goto('file://' + CITY, { waitUntil: 'load' });
  await pg1.waitForTimeout(3200);
  const M = await pg1.evaluate(async () => {
    async function press() {
      const DIRS = [2, 4, 0, 6, 1, 3, 5, 7];
      let best = 0;
      for (let t = 0; t < 24; t++) {
        const x0 = hx, y0 = hy;
        try { startHold(DIRS[t % 8]); endHold(); } catch (e) { return { err: e.message }; }
        let w = 0; while (w < 900 && hx === x0 && hy === y0) { await new Promise(r => setTimeout(r, 8)); w += 8; }
        best = Math.max(best, Math.abs(hx - x0), Math.abs(hy - y0));
        if (best > 0) break;
        await new Promise(r => setTimeout(r, 200));
      }
      return { best };
    }
    try { document.getElementById('daycard').classList.remove('on'); } catch (e) {}
    const street = await press();
    if (typeof setMode === 'function') setMode('city'); else MODE = 'city';
    try { render(); } catch (e) {}
    await new Promise(r => setTimeout(r, 700));
    const map = await press();
    return { street: street.best, map: map.best, mode: MODE };
  });
  ok('the alpha city loads with no page error (' + (e1.length ? e1[0] : 'none') + ')', e1.length === 0);
  /* THE STREET IS THE CONTROL and it has to move, or the map's zero means
     nothing. Two earlier cuts of this measurement scored the STREET at zero and
     both were my instrument, not the game. */
  ok('CONTROL: the same press on the street still moves him (' + M.street + ' lots)', M.street > 0);
  ok('and on the map, twenty-four presses in eight directions move him ' + M.map +
     ' lots (it was 0 when this was written, and that is the row)', M.map >= 0);
  await pg1.close();

  /* ===== 2. THE TWO WAYS, FILMED OFF THE PAGE'S OWN CANVASES ===== */
  const pg2 = await br.newPage({ viewport: { width: 390, height: 900 } });
  const e2 = []; pg2.on('pageerror', e => e2.push(e.message));
  await pg2.goto('file://' + PAGE, { waitUntil: 'load' });
  await pg2.waitForTimeout(700);
  const F = await pg2.evaluate(async () => {
    const cs = [...document.querySelectorAll('canvas')];
    if (cs.length !== 2) return { FAILED: 'expected 2 canvases, got ' + cs.length };
    /* the marker is the darkest ink on the strip; its leftmost column is its x */
    function xOf(c) { const g = c.getContext('2d');
      const im = g.getImageData(0, 0, c.width, c.height).data, w = c.width;
      const y = Math.round(c.height * 0.30);
      for (let x = 0; x < w; x++) { const i = (y * w + x) * 4;
        if (im[i] < 40 && im[i + 1] < 40 && im[i + 2] < 40) return x; }
      return -1; }
    const A = [], B = [];
    for (let i = 0; i < 80; i++) { A.push(xOf(cs[0])); B.push(xOf(cs[1]));
      await new Promise(r => setTimeout(r, 25)); }
    function stats(v) {
      const seen = v.filter(x => x >= 0).length;
      const d = [];
      for (let i = 1; i < v.length; i++) { if (v[i] < 0 || v[i - 1] < 0) continue;
        const dd = Math.abs(v[i] - v[i - 1]); if (dd > 40) continue;   /* the turn-round */
        d.push(dd); }
      return { seen, samples: d.length, held: d.filter(x => x === 0).length,
        max: Math.max.apply(null, d),
        avg: +(d.reduce((a, b) => a + b, 0) / d.length).toFixed(2) };
    }
    return { A: stats(A), B: stats(B) };
  });
  await pg2.close(); await br.close();

  if (F.FAILED) { ok('the page draws two strips (' + F.FAILED + ')', false); return done(); }
  ok('the page draws with no error (' + (e2.length ? e2[0] : 'none') + ')', e2.length === 0);
  /* CONTROL: the ruler can find a marker at all. A ruler that never sees one
     reports "held" on every sample and passes the main claim by being blind. */
  ok('CONTROL: the ruler actually finds the marker (' + F.A.seen + ' and ' + F.B.seen +
     ' of 80 samples)', F.A.seen >= 70 && F.B.seen >= 70);

  ok('B STOPS AT THE BEAT: it holds still on ' + F.B.held + ' of ' + F.B.samples +
     ' samples (floor ' + HELD_MIN + ')', F.B.held >= HELD_MIN);
  ok('and A does NOT, which is what makes it the other option: ' + F.A.held +
     ' of ' + F.A.samples + ' (ceiling ' + HELD_MAX_A + ')', F.A.held <= HELD_MAX_A);
  /* THE ONE THAT STOPS A CHEAT: a marker that merely crawled would pass both
     claims above and be a worse game. */
  ok('and B IS NOT JUST SLOWER: the two cover the same ground, ' + F.B.avg +
     ' against ' + F.A.avg + ' pixels a sample (within ' + SPEED_TOL + ')',
     Math.abs(F.B.avg - F.A.avg) <= SPEED_TOL);
  ok('B moves further between beats than A ever does (' + F.B.max + ' against ' +
     F.A.max + '), which is the shape of a beat', F.B.max > F.A.max);
  done();
})().catch(e => { console.log('  FAIL ' + e.message); fail++; done(); });
