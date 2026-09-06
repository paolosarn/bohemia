/* ============================================================================
   STOP AND COME BACK (9/6/26, RUN lane)
   VAMILY [title screen] / STOP-AND-COME-BACK, record item H.

   ITEM H, 8/25: "the demo has no title screen of its own, no 'what is this', no
   way to stop and come back that a stranger would recognise as such."

   MEASURED BEFORE BUILDING, AND TWO THIRDS OF IT WERE ALREADY THERE. A title
   screen of its own: yes, his wordmark on its plate. A "what is this": yes,
   POST-ECONOMIC APOCALYPSE - LAS VEGAS under the name. A way to STOP: yes, and
   it is UI's, shipped 9/5 -- the gear's QUIT closes the game and puts the front
   door back.

   *** A WAY TO COME BACK THAT A STRANGER WOULD RECOGNISE: NO. *** Played to day
   3, 16:20 and reloaded the way coming back does:

       the shell's save held   {day:3, min:980} on disk
       the front door said     "TAP TO ENTER"

   The run was sitting right there and the door said nothing about it. This lane
   spent three rounds making that save carry the day, the clock, the position,
   the quest, the purse and the people, and the one surface that could say so was
   silent. That is the whole job and it is one line of the door.

   WHAT IT DELIBERATELY IS NOT, and these are asserted below because a row like
   this invites all three:
     * NO START OVER on the front door. Wiping is destructive, the save panel
       already owns it, and the screen a stranger taps first is the worst place
       for a second door onto it.
     * NO SECOND SCREEN AND NO FORK. The settings lane's own comment says a
       second button on the splash is a fork in the only moment that has to be
       simple, and it is right.
     * IT DOES NOT CHANGE WHAT THE TAP DOES. Entering already restored the save
       through the handshake; the door was lying by omission, not by action.
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
  console.log('STOP AND COME BACK: ' + pass + ' passed, ' + fail + ' failed');
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

/* ---- 1. IT IS ON BOTH SURFACES AND IT ADDED NO DOOR ---------------------- */
for (const f of ['BOHEMIA_ALPHA_0_9.html', 'BOHEMIA_DEMO.html']) {
  const src = fs.readFileSync(path.join(SLICES, f), 'utf8');
  ok(f + ' carries it', src.indexOf('__STOP_AND_COME_BACK__') > 0);
  ok('  and it reads the SHELL\'S OWN save, not a second reader',
     /CITYSAVE\.load\(\)[\s\S]{0,200}s\.data\.day/.test(src));
  /* THE THREE THINGS IT MUST NOT HAVE DONE. */
  const block = src.slice(src.indexOf('__STOP_AND_COME_BACK__'),
                          src.indexOf('__STOP_AND_COME_BACK__') + 3200);
  ok('  and it puts NO start-over on the splash -- wiping is destructive and the '
    + 'save panel owns it', !/removeItem|clear\(\)|wipe|erase/i.test(block));
  ok('  and it adds no second button to the door',
     !/createElement\('button'\)|appendChild/.test(block));
  ok('  and it does not touch what the tap does',
     !/addEventListener\('click'|\.click\(\)/.test(block));
}

/* ---- 2. THE REAL SURFACE ------------------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const srv = await serve();
  const url = 'http://127.0.0.1:' + srv.address().port + '/BOHEMIA_DEMO.html';
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

    /* ---- A STRANGER WITH NO RUN ---------------------------------------- */
    await page.goto(url, { waitUntil: 'load', timeout: 240000 });
    await SETTLE(page, 3000);
    const cold = await page.evaluate(() => ({
      tap: (document.getElementById('fronttap') || {}).textContent,
      sub: (document.getElementById('frontsub') || {}).textContent,
      saved: (function () { try { const s = CITYSAVE.load(); return !!(s && s.data); }
                            catch (e) { return 'ERR'; } })()
    }));
    ok('with no run, nothing is saved yet', cold.saved === false);
    ok('*** AND THE DOOR IS EXACTLY WHAT IT WAS *** -- a first-timer is not '
      + 'offered a continue that does not exist (' + cold.tap + ')',
       cold.tap === 'TAP TO ENTER');
    ok('the title still says what this is (' + cold.sub + ')',
       typeof cold.sub === 'string' && cold.sub.length > 8);

    /* ---- PLAY, THEN COME BACK ------------------------------------------ */
    /* ENTERING IS NOT BEING READY. The walked world defines DAY early and asks
       the shell for its save afterwards, so a probe that starts the moment
       DAY.day is 1 is reading a game that has not been handed its run yet --
       measured at about 1.6 seconds, and reading before it made an earlier cut
       of this gate report a clock that had "reset". Wait for the restore to
       have happened, or for the shell to have said there is nothing to restore. */
    const enter = async (expectRestore) => {
      await page.tap('#front').catch(async () => { await page.click('#front').catch(() => { }); });
      await SETTLE(page, 90000, async () => {
        const f = page.frames().find(x => x.name() === 'cityFrame');
        if (!f) return false;
        try {
          return await f.evaluate(w => typeof DAY !== 'undefined' && typeof advance === 'function'
            && DAY.day >= 1 && (!w || (window.__RESTORE_OK | 0) >= 1), !!expectRestore);
        } catch (e) { return false; }
      });
      return page.frames().find(x => x.name() === 'cityFrame');
    };
    const city = await enter(false);
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); srv.close(); return done(); }

    /* SPEND THE MORNING THE WAY WALKING SPENDS IT. Not a poke at the clock the
       HUD reads: that one is a mirror the day loop overwrites on its next tick,
       so a forced value is gone in under a second and the gate would be timing
       a race. advance() is the game's own function, the one every step calls.
       THE SETUP RETRIES, THE CLAIM NEVER DOES -- the shell writes on its own
       schedule, so one fixed wait is a coin flip, and a flaky setup reads as a
       broken feature, which is how this lane lost a round already. */
    const play = async (toMin) => {
      for (let i = 0; i < 14; i++) {
        const fr = page.frames().find(x => x.name() === 'cityFrame');
        if (!fr) { await sleep(900); continue; }
        await fr.evaluate(m => { if (DAY.min < m) advance(m - DAY.min); try { reportState(); } catch (e) { } },
                          toMin).catch(() => { });
        await sleep(900);
        const s = await page.evaluate(() => {
          try { const v = CITYSAVE.load(); return v && v.data ? { day: v.data.day, min: v.data.min } : null; }
          catch (e) { return null; }
        });
        if (s && s.min === toMin) return s;
      }
      return null;
    };
    const LEFT = 16 * 60 + 20;                       /* 16:20, and the fresh start is 06:00 */
    const stored = await play(LEFT);
    ok('the run really is on disk before we go looking for it ('
      + JSON.stringify(stored) + ')', !!stored && stored.min === LEFT);

    /* THE WAY A PERSON ACTUALLY COMES BACK: close it and open the link again. */
    await page.goto(url, { waitUntil: 'load', timeout: 240000 });
    await SETTLE(page, 3000);
    const back = await page.evaluate(() => ({
      tap: (document.getElementById('fronttap') || {}).textContent
    }));
    ok('*** COMING BACK, THE DOOR SAYS THE RUN IS WAITING *** (' + back.tap + ')',
       /CONTINUE/.test(back.tap));
    ok('and it names the day', /DAY 1/.test(back.tap));
    ok('*** AND THE CLOCK HE LEFT OFF ON, NOT THE ONE A NEW RUN STARTS AT *** -- '
      + 'a line that just printed the defaults would say 06:00 here',
       /16:20/.test(back.tap) && !/06:00/.test(back.tap));

    /* ---- AND MID-SESSION, AFTER UI'S QUIT ------------------------------ */
    const city2 = await enter(true);
    ok('back in the game, with the run handed to it', !!city2);
    const LATER = 17 * 60 + 55;
    const moved = city2 ? await play(LATER) : null;
    ok('and the afternoon really moved on disk, past what the door was painted '
      + 'with at load (' + JSON.stringify(moved) + ')', !!moved && moved.min === LATER);
    /* quit through the gear, which is UI's own path, not a function call */
    const quit = await page.evaluate(() => {
      const g = document.getElementById('gearbtn');
      if (!g) return 'no-gear';
      g.click();
      const q = document.getElementById('setquit');
      if (!q) return 'no-quit';
      q.click();
      return 'quit';
    });
    await sleep(1400);
    /* THE DOOR AND THE DISK IN ONE READ. Two reads a second apart cannot tell a
       door that lied from a save that moved underneath it, and a gate whose red
       does not say which one broke costs the next round an hour. */
    const after = await page.evaluate(() => {
      const fr = document.getElementById('front');
      const st = fr ? getComputedStyle(fr) : null;
      let save = null;
      try { const v = CITYSAVE.load(); if (v && v.data) save = { day: v.data.day, min: v.data.min }; }
      catch (e) { }
      return { up: !!(st && st.display !== 'none' && +st.opacity > 0),
               tap: (document.getElementById('fronttap') || {}).textContent, save: save };
    });
    const said = after.save
      ? 'CONTINUE · DAY ' + after.save.day + ' · '
        + ('0' + Math.floor(after.save.min / 60) % 24).slice(-2) + ':'
        + ('0' + after.save.min % 60).slice(-2)
      : 'TAP TO ENTER';
    ok('UI\'s QUIT still puts the door back (' + quit + ')',
       quit === 'quit' && after.up === true);
    ok('the afternoon is still the one on disk when the door comes back ('
      + JSON.stringify(after.save) + ')', !!after.save && after.save.min === LATER);
    ok('*** AND THE DOOR IS UP TO DATE MID-SESSION, NOT STALE FROM LOAD *** -- it '
      + 'says what the disk says RIGHT NOW, not what it said at load (door: '
      + after.tap + ' / disk: ' + said + ')',
       after.tap === said && !/16:20/.test(after.tap));

    /* ---- AND THE TAP STILL DOES WHAT IT DID ---------------------------- */
    const back3 = await enter(true);
    ok('*** AND TAPPING IT STILL PUTS HIM BACK IN THE GAME *** -- the door was '
      + 'lying by omission, not by action', !!back3);
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
