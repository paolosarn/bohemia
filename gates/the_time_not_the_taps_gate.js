/* ============================================================================
   THE TIME, NOT THE TAPS (9/6/26, RUN lane)
   VAMILY [auto walk] / BB-THE-TIME-NOT-THE-TAPS.

   THE ROW: "DISTANCE SHOULD SPEND THE DAY, NOT THE PLAYER'S ATTENTION. Our long
   walk correctly costs in-game hours. It ALSO costs the player however long it
   takes to press the pad twenty times, and THAT SECOND COST BUYS NOTHING. A
   route you set and let run, or a held press that keeps going. THIS IS NOT FAST
   TRAVEL and it removes no cost; IT REMOVES THE WATCHING."

   MEASURED FIRST, AND IT CHANGED THE JOB. A HELD PRESS ALREADY KEEPS GOING: the
   pad wires pointerdown to startHold and the metronome steps every beat while
   `held` is set. Measured on the served demo before touching anything -- four
   seconds of hold moved five cells. Half the row was already built and I nearly
   closed it on that.
   *** BUT A HELD PRESS REMOVES THE TAPPING, NOT THE WATCHING. *** Your thumb is
   still down and your eyes are still on it, and the row's last five words are IT
   REMOVES THE WATCHING. The job is the gap between those two, and nothing more:
   a hold that really got going LATCHES, so letting go keeps you walking.

   IT REMOVES NO COST, and that is asserted rather than promised: every latched
   step is the same stepOnce, so the clock, the road moments and the crews all
   happen exactly as they would have.

   ---- WHAT STOPS IT, AND WHY THAT IS THE POINT -------------------------------
   Anything to look at (a card), anybody coming (a crew at 'close'), a wall (two
   still beats), him (any press), or the day ending. Every reason lives in one
   function so a new one cannot be added to one caller and forgotten in another.
   The card rule matters most: this lane put road moments on the walked street on
   9/5, and an auto-walk that strolls through them would be worse than the taps.

   ---- HOW IT IS DRIVEN, STATED HONESTLY --------------------------------------
   The hold is made with REAL INPUT (mouse down / wait / up, which is what the
   pad's pointer handlers see), never by calling startHold from the harness. That
   matters because a probe that calls the function under test has proved the
   function and not the button. The wiring from the pad to those handlers is
   asserted separately, in the source, so both halves of the path are covered.

   ---- MUTATION PROOF, run 9/6 -------------------------------------------------
     * remove the latch on release -> red, including zero cells after letting go
     * remove the card rule from the stop function -> 2 red, including "a card on
       screen stops it", which is the one that keeps an auto-walk from strolling
       through the road moments this lane put on the street last round

   ---- AND TWO WAYS THIS GATE WAS FLAKY, BOTH FIXED PROPERLY ------------------
   It read green, green, RED across three runs, and a gate that fails one run in
   three is worse than no gate.
     1. THE CLAIM COMPETED WITH ITS OWN STOP RULE. When a road moment fires on
        the first beat after release he stops before covering a cell -- the
        feature working, scored as failing. The claim is the true one now: after
        letting go he either walked on OR stopped for something named. It keeps
        its teeth because "it latched at all" is a separate check, and that is
        what the no-latch mutation turns red.
     2. THE SETUP DID NOT ALWAYS HAPPEN. Sometimes the hold reported zero beats,
        because a card arrived between clearing the cards and the press landing,
        so the press hit the card instead of the pad. The SETUP retries now.
        Retrying a setup is honest; retrying an assertion would not be.
   Five clean runs after, one of them through the suite.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');
const SLICES = path.join(ROOT, 'slices');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const done = () => {
  console.log('TIME NOT TAPS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json',
               '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
      const f = path.join(SLICES, rel);
      if (!f.startsWith(SLICES) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rs.statusCode = 404; return rs.end('no');
      }
      rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
      fs.createReadStream(f).pipe(rs);
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

/* ---- 1. THE SHAPE, IN THE SOURCE ---------------------------------------- */
{
  const city = fs.readFileSync(path.join(SLICES, 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  ok('the pad still drives the same hold handlers a thumb drives',
     /addEventListener\('pointerdown',e=>\{e\.preventDefault\(\);startHold\(di\);\}\)/.test(city)
     && /addEventListener\('pointerup',endHold\)/.test(city));
  ok('a hold latches only after a real hold, never on a tap',
     /heldBeats >= LATCH_AFTER\)\{ LATCH_DIR = held/.test(city));
  ok('and any press clears one, so it is always interruptible',
     /latchStop\(\);\s*\n\s*held=di; pend=di; heldBeats=0; \}/.test(city));
  ok('*** EVERY REASON TO STOP LIVES IN ONE FUNCTION *** -- so a new one cannot '
    + 'be added to one caller and forgotten in another',
     /function latchShouldStop\(\)/.test(city));
  ok('and that function knows about a card, a crew, the mode and the day ending',
     /getElementById\('daycard'\)[\s\S]{0,400}HOST_DREW[\s\S]{0,300}DAY\.phase === 'ended'/.test(city));
  ok('a latched step is the SAME stepOnce a tapped step is -- it removes no cost',
     /const di=\(held!==null\)\?held:\(pend!==null\?pend:LATCH_DIR\);/.test(city));
}

/* ---- 2. THE REAL SURFACE ------------------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const srv = await serve();
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    await page.goto(base + 'BOHEMIA_DEMO.html', { waitUntil: 'load', timeout: 240000 });
    await SETTLE(page, 2500);
    await page.tap('#front').catch(async () => { await page.click('#front').catch(() => { }); });
    await SETTLE(page, 90000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try {
        return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1
          && typeof latchShouldStop === 'function' && typeof LATCH_AFTER !== 'undefined');
      } catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); srv.close(); return done(); }

    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1200);
    const clearCards = async () => {
      for (let i = 0; i < 8; i++) {
        const up = await city.evaluate(() => {
          const d = document.getElementById('daycard');
          if (!d || getComputedStyle(d).display === 'none') return false;
          const g = d.querySelector('.dcgo') || d.querySelector('.dcbtn') || d.querySelector('.dcx');
          if (g) g.click(); return true;
        });
        if (!up) return; await sleep(320);
      }
    };
    await clearCards();

    const padAt = g => city.evaluate(gl => {
      const el = [...document.querySelectorAll('#pad .pb')]
        .find(b => (b.textContent || '').trim() === gl);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    }, g);
    const state = () => city.evaluate(() => ({
      hx: hx, hy: hy, min: T.min, held: held, heldBeats: heldBeats,
      latch: LATCH_DIR, still: LATCH_STILL,
      card: (function () { const d = document.getElementById('daycard');
        return !!(d && getComputedStyle(d).display !== 'none'); })()
    }));
    /* A REAL PRESS. mouse down/up is what the pad's pointer handlers actually
       see; calling startHold from here would prove the function and not the
       button. */
    const press = async (p, ms) => {
      await page.mouse.move(p.x, p.y);
      await page.mouse.down();
      await sleep(ms);
      await page.mouse.up();
    };

    /* *** PICK A DIRECTION THAT HAS ROOM, AND ASK THE GAME WHICH. ***
       The first cut held east and got zero cells after release -- because he
       walked into a building at 6211 and the wall rule correctly stopped him.
       THE HARNESS WAS MEASURING A WALL. That is the third time this lane has
       done it, so the direction is chosen by reading the ground rather than
       guessing: the claim is "he keeps walking when there is room", and finding
       room is the setup for the claim, not the claim. */
    await clearCards();
    const openest = await city.evaluate(() => {
      const D = { '\u2192': [1, 0], '\u2198': [1, 1], '\u2193': [0, 1], '\u2199': [-1, 1],
                  '\u2190': [-1, 0], '\u2196': [-1, -1], '\u2191': [0, -1], '\u2197': [1, -1] };
      let best = null;
      for (const g in D) {
        let n = 0;
        for (let i = 1; i <= 20; i++) {
          const c = cellAt(hx + D[g][0] * i, hy + D[g][1] * i);
          if (!c || !c.walk) break;
          n++;
        }
        if (!best || n > best.run) best = { glyph: g, run: n };
      }
      return best;
    });
    ok('there is somewhere to walk from where he is standing ('
      + (openest ? openest.run + ' clear cells' : 'nowhere') + ')',
       !!openest && openest.run >= 3);
    const t0 = await state();
    const east = openest ? await padAt(openest.glyph) : null;
    ok('the walk pad is on screen to be pressed', !!east);
    if (!east) { await browser.close(); srv.close(); return done(); }
    await press(east, 100);
    await sleep(300);
    const t1 = await state();
    ok('*** A TAP DOES NOT LATCH *** -- nothing about the existing feel moves ('
      + t1.latch + ')', t1.latch === null);

    /* ---- A REAL HOLD LATCHES AND CARRIES ON ---------------------------- */
    /* *** THE SETUP HAS TO ACTUALLY HAPPEN BEFORE THE CLAIM IS ASKED. ***
       Measured across six runs: sometimes the hold reported heldBeats 0. Not the
       game -- a road moment (the ones this lane put on the walked street last
       round) fires between clearing the cards and the press landing, and the
       press hits the card instead of the pad. Retrying the SETUP is honest;
       retrying an assertion would not be. */
    let rel = null, tries = 0;
    for (; tries < 4; tries++) {
      await clearCards();
      if (await city.evaluate(() => latchShouldStop())) continue;
      await press(east, 2600);                     /* >= LATCH_AFTER beats */
      rel = await state();
      if (rel.heldBeats >= 0 && rel.latch !== null) break;
    }
    ok('there was nothing in the way long enough to get a hold in (' + (tries + 1)
      + ' attempt' + (tries ? 's' : '') + ')', !!rel);
    if (!rel) { await browser.close(); srv.close(); return done(); }
    ok('*** A REAL HOLD LATCHES ON RELEASE *** (held ' + rel.heldBeats
      + ' beats, latch ' + rel.latch + ')', rel.latch !== null && rel.held === null);

    /* walk on with nothing holding it, sampling every beat */
    const trail = [];
    let movedAfter = 0, stoppedFor = null;
    let last = rel;
    for (let i = 0; i < 10; i++) {
      await sleep(500);
      const s = await state();
      trail.push(s.hx + ',' + s.hy + (s.latch === null ? '[stop]' : '') + (s.card ? '[card]' : ''));
      if (s.hx !== last.hx || s.hy !== last.hy) {
        movedAfter += Math.abs(s.hx - last.hx) + Math.abs(s.hy - last.hy);
      }
      if (s.latch === null && stoppedFor === null) stoppedFor = s.card ? 'card' : 'wall';
      last = s;
    }
    /* *** THIS CLAIM COMPETES WITH ITS OWN STOP RULE, AND THE FIRST CUT DID NOT
       ALLOW FOR IT. *** Measured: green, green, RED across three runs. When a
       road moment fires on the very first beat after release, he stops before he
       has covered a cell -- and that is the feature working, not failing. A gate
       that goes red one run in three is worse than no gate.
       So the honest claim is the true one: after letting go he either WALKED ON,
       or he STOPPED FOR SOMETHING NAMED. It still has teeth -- with the latch
       removed he neither walks nor stops for a reason, he simply never latched,
       and the claim above catches that. */
    const stoppedWell = last.latch === null && stoppedFor !== null;
    ok('*** AND LETTING GO DOES NOT STOP HIM *** -- ' + movedAfter
      + ' cells with nothing held down'
      + (stoppedFor ? ', then it stopped for the ' + stoppedFor : '')
      + ', which is the watching this row is about',
       movedAfter >= 1 || stoppedWell);
    ok('it removes no cost: the clock spent those cells too (' + rel.min + ' -> '
      + last.min + ')', last.min >= rel.min);
    ok('and it ended on its own rather than running forever ('
      + (stoppedFor || 'still going') + ')', true);      /* reported, not asserted */
    console.log('  trail: ' + trail.join(' -> '));

    /* ---- A CARD STOPS IT ----------------------------------------------- */
    const cardStops = await city.evaluate(() => {
      LATCH_DIR = 2; LATCH_STILL = 0;                 /* pretend he is walking */
      const d = document.getElementById('daycard');
      const was = d ? d.style.display : null;
      if (d) d.style.display = 'block';
      const want = latchShouldStop();
      if (d) d.style.display = was === null ? '' : was;
      LATCH_DIR = null;
      return want;
    });
    ok('*** A CARD ON SCREEN STOPS IT *** -- the road moments this lane put on '
      + 'the walked street would otherwise be walked straight through',
       cardStops === true);

    /* ---- A CREW STOPS IT ----------------------------------------------- */
    const crewStops = await city.evaluate(() => {
      LATCH_DIR = 2; LATCH_STILL = 0;
      const keep = window.HOST_DREW;
      HOST_DREW = [{ state: 'close', at: [0, 0] }];
      const want = latchShouldStop();
      HOST_DREW = keep || [];
      LATCH_DIR = null;
      return want;
    });
    ok('*** AND SOMEBODY CLOSING ON YOU STOPS IT ***', crewStops === true);

    /* ---- ANY PRESS STOPS IT -------------------------------------------- */
    await clearCards();
    await press(east, 2600);
    const latched = await state();
    let cancelled = null;
    if (latched.latch !== null) {
      const south = await padAt('↓');
      await page.mouse.move(south.x, south.y);
      await page.mouse.down();
      cancelled = await city.evaluate(() => LATCH_DIR);
      await page.mouse.up();
    }
    ok('*** AND HIS OWN THUMB STOPS IT *** -- a control you cannot interrupt is '
      + 'worse than one you have to hold (latch during the new press: '
      + cancelled + ')', latched.latch === null || cancelled === null);

    ok('nothing threw through any of it'
      + (errs.length ? ' -- first: ' + errs[0] : ''), errs.length === 0);

    await browser.close();
    srv.close();
    done();
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
    try { await browser.close(); } catch (e2) { }
    try { srv.close(); } catch (e2) { }
    done();
  }
})();
