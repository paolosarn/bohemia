const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THE OVERLOOK HAS TO LET HIM LEAVE (8/25/26, RUN lane)

   PAOLO, two days before this was found:

     "pretty please just make sure all the buttons work ... there shouldn't be
      any buttons that bring up any pop menus that don't go away"

   THE VISTA is demo critical-path row 11, and on DAY 2 it opens BY ITSELF a few
   seconds after GET UP. Playing the back half of the demo for the first time and
   then trying to leave, measured, all six:

       tap the world              -> still open
       Escape                     -> still open
       the MODE / DROP IN button  -> still open
       tap the vista card         -> still open
       WHOLE MAP                  -> still open
       walk the pad               -> still open

   vistaClose() existed, was correct, and THE ONLY CALLER IN THE REPO WAS A GATE
   (vista_beat_gate.js:127). Nothing a player could touch called it. He reached
   the best moment in the demo and the game kept him there.

   *** WHY EVERY PANEL CLOSES DID NOT CATCH IT, WHICH IS WHY THIS EXISTS. ***
   every_panel_closes_gate walks the chips in the toolbar, the drawer and the
   bottom-left column and proves each one it OPENS can be closed. The vista is
   not opened by a chip -- THE DAY LOOP OPENS IT -- so it was never in the sweep.
   A gate that enumerates its subjects can only ever be as complete as its
   enumeration, and that is a permanent property of it, not a bug I fixed there.
   So the thing NOT reachable by a chip gets its own gate.

   AND THE CARD WAS ON TOP OF THE TOOLBAR: top:64px hardcoded, toolbar 49..80. So
   "THE VALLEY" was printed across the music button, the save button and the day's
   objective, on the one screen the demo exists to show off. It is measured now,
   through a helper the population card shares, so there is ONE owner of "what is
   above me" instead of the three copies this was heading for.

   node gates/vista_lets_you_leave_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html');
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== VISTA LETS YOU LEAVE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

/* ---- SOURCE HALF: one owner for "what is above me" ----------------------- */
/* THE MEASUREMENT DRIFTING IS THE FAILURE MODE, not the measurement being wrong
   once. The population card wrote these six lines on 8/24 and the vista card was
   about to be the second copy; a third would have followed. So the source is
   held to one definition and at least two callers -- if somebody hand-rolls it
   again, this goes red before the pixels do. */
const src = fs.readFileSync(CITY, 'utf8');
const defs = (src.match(/function\s+topChromeBottom\s*\(/g) || []).length;
const calls = (src.match(/topChromeBottom\s*\(/g) || []).length - defs;
ok('there is exactly one topChromeBottom() (' + defs + ')', defs === 1);
ok('and everything that floats over the world asks it rather than keeping its own '
  + 'copy (' + calls + ' callers)', calls >= 2);
/* the tell-tale of the old hand-rolled copy: somewhere else running a max of
   chrome BOTTOMS. First cut of this claim matched `['topbar', ...].forEach` and
   went red on tlStack(), which walks those same ids to ADOPT them into the
   column -- it does not measure anything. A CHECKER THAT CANNOT TELL A MENTION
   FROM A USE IS THE BROKEN ONE (8/1), so the pattern is the arithmetic itself. */
const maxima = (src.match(/Math\.max\(\s*low\s*,[^;]*getBoundingClientRect\(\)\.bottom/g) || []).length;
ok('and nobody kept a private copy of the arithmetic (' + maxima + ' place runs a '
  + 'max of chrome bottoms)', maxima === 1);
ok('the overlook has a close, and it is no longer callable only by a gate',
  /function\s+vistaBail\s*\(/.test(src) && /function\s+vistaClose\s*\(/.test(src));

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); done(); }
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1200);
    await city.evaluate(() => {
      const g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
      if (g) g.click();
    });
    await SETTLE(page, 1800);

    const state = () => city.evaluate(() => ({
      vista: !!VISTA, mode: MODE, card: !!document.getElementById('vistaCard'),
      hx: (typeof hx === 'number') ? hx : null, hy: (typeof hy === 'number') ? hy : null
    }));
    const openVista = async () => {
      const r = await city.evaluate(() => { try { return window.__VISTA.open(); } catch (e) { return false; } });
      await SETTLE(page, 800);
      return r;
    };
    /* every attempt starts from the same place: on his feet, overlook fresh */
    const reset = async () => {
      await city.evaluate(() => {
        try { window.__VISTA.close(); } catch (e) { }
        if (MODE !== 'human') { try { swapMode(); } catch (e) { } }
        try { render(); } catch (e) { }
      });
      await SETTLE(page, 500);
      return await openVista();
    };

    const opened = await openVista();
    const st0 = await state();
    ok('the overlook opens', opened === true && st0.vista && st0.card);
    if (!st0.vista) { await browser.close(); done(); }

    /* ---- 1. IT IS NOT PRINTED ON THE TOOLBAR ---------------------------- */
    const geo = await city.evaluate(() => {
      const b = id => { const e = document.getElementById(id);
        if (!e || e.offsetParent === null) return null;
        const r = e.getBoundingClientRect();
        return { top: Math.round(r.top), bottom: Math.round(r.bottom) }; };
      const chrome = ['topbar', 'tlstack', 'devtray'].map(b).filter(Boolean);
      const low = chrome.length ? Math.max.apply(null, chrome.map(c => c.bottom)) : 0;
      const card = document.getElementById('vistaCard');
      const ink = card ? card.firstElementChild.getBoundingClientRect() : null;
      /* and is anything actually painted over its ink? */
      let covered = 0;
      if (ink) [[ink.left + 4, ink.top + 3], [ink.right - 4, ink.top + 3],
               [(ink.left + ink.right) / 2, (ink.top + ink.bottom) / 2],
               [ink.left + 4, ink.bottom - 3]].forEach(p => {
        const t = document.elementFromPoint(p[0], p[1]);
        if (t && !(card === t || card.contains(t))) covered++;
      });
      return { chromeBottom: Math.round(low), cardTop: ink ? Math.round(ink.top) : null,
               covered: covered, text: card ? card.innerText : '' };
    });
    ok('*** THE VALLEY IS NOT PRINTED ACROSS THE TOOLBAR *** (card starts at '
      + geo.cardTop + ', the chrome above it ends at ' + geo.chromeBottom
      + ') -- it was top:64px into a toolbar at 49..80',
      geo.cardTop != null && geo.chromeBottom > 0 && geo.cardTop >= geo.chromeBottom);
    ok('and nothing else is painted over the card either (' + geo.covered
      + ' of 4 corners covered)', geo.covered === 0);
    ok('the card still names the place he is looking at',
      /THE VALLEY/.test(geo.text));
    /* A WAY OUT HE CANNOT SEE IS ONE HE DOES NOT HAVE -- his words about the
       STANDING card, two days before this was found. */
    ok('*** AND IT TELLS HIM HOW TO GET OUT *** ("'
      + geo.text.split('\n').pop().slice(0, 40) + '")',
      /tap/i.test(geo.text.split('\n').pop() || ''));

    /* ---- 2. EVERY WAY OUT ACTUALLY WORKS -------------------------------- */
    /* SIX GESTURES, EACH FROM A CLEAN OPEN. Not "one of them works" -- he does
       not know which one is the magic one, so all of them are. */
    const ways = [
      ['a tap on the world', async () => {
        await city.click('#cv', { position: { x: 195, y: 420 }, timeout: 8000 }); }],
      ['Escape', async () => { await page.keyboard.press('Escape'); }],
      ['the MODE / DROP IN button', async () => {
        await city.click('#mode', { timeout: 8000 }); }],
      ['a tap on the card itself', async () => {
        await city.click('#vistaCard', { timeout: 8000 }); }],
      /* WHOLE MAP is display:none while the overlook is up (updHud has not run
         for the vista's MODE), so it cannot be CLICKED on the surface -- which
         is why the guard is proved at the handler instead of pretending to tap
         a button that is not painted. Measuring the hidden state too, so that if
         it ever becomes visible this claim is still the truth. */
      ['WHOLE MAP', async () => {
        await city.evaluate(() => { document.getElementById('fitbtn').click(); }); }],
      ['a direction on the pad', async () => {
        const pb = await city.$$('#pad .pb');
        if (pb[4]) { await pb[4].hover(); await page.mouse.down(); await SETTLE(page, 600); await page.mouse.up(); }
      }],
    ];
    let left = 0;
    for (const [name, act] of ways) {
      const up = await reset();
      if (!up) { ok('could reopen the overlook for "' + name + '"', false); continue; }
      try { await act(); } catch (e) { /* a throw is a failure to leave, caught below */ }
      await SETTLE(page, 900);
      const st = await state();
      if (!st.vista) left++;
      ok(name + ' brings him back off the rim', !st.vista && !st.card);
    }
    ok('*** ALL SIX WAYS OUT WORK *** (' + left + ' of 6) -- it was 0 of 6',
      left === 6);

    /* ---- 3. AND LOOKING AROUND STILL WORKS ------------------------------ */
    /* THE OBVIOUS WAY TO BREAK THIS FIX is to make every touch close the card,
       which would take the overlook away the moment he tried to look at it. The
       tap reuses the city's own tap-versus-drag test, so a DRAG must survive. */
    await reset();
    /* A REAL MOUSE, not a synthetic PointerEvent: the city calls
       setPointerCapture, and a hand-made event has no pointer for the browser to
       capture, so it throws and the drag never happens. VERIFY ON THE REAL
       SURFACE means the gesture is real too. */
    const cvBox = await (await city.$('#cv')).boundingBox();
    const x0 = cvBox.x + cvBox.width / 2, y0 = cvBox.y + cvBox.height / 2;
    await page.mouse.move(x0, y0);
    await page.mouse.down();
    for (let i = 1; i <= 8; i++) { await page.mouse.move(x0 - i * 9, y0 - i * 4); }
    await page.mouse.up();
    await SETTLE(page, 600);
    const drag = await state();
    ok('*** DRAGGING TO LOOK AROUND THE VALLEY DOES NOT THROW HIM OUT *** '
      + '(a real tap comes home, a drag looks)', drag.vista === true);

    /* ---- 4. THE PAD PRESS LANDS HIM AND WALKS --------------------------- */
    /* A DIRECTION IS NOT "get me out of here", IT IS "go that way". If the press
       were merely swallowed, the first step out of every vista would be dead --
       the same not-working-button he reported on STANDING. */
    await reset();
    const walked = await city.evaluate(async () => {
      const pad = document.querySelectorAll('#pad .pb')[4];
      pad.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      await new Promise(r => setTimeout(r, 60));
      const closedAt = !VISTA;
      const y0 = hy;
      await new Promise(r => setTimeout(r, 1500));   /* 3 beats at 120bpm */
      pad.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      return { closedAt: closedAt, moved: Math.abs(hy - y0), mode: MODE };
    });
    ok('the direction drops the overlook immediately', walked.closedAt === true);
    ok('*** AND HE IS ACTUALLY WALKING WHEN HE LANDS *** (moved ' + walked.moved
      + ' cells, mode ' + walked.mode + ') -- a swallowed press would be a dead '
      + 'first step', walked.moved > 0 && walked.mode === 'human');

    ok('and nothing threw through any of it ('
      + (errs.length ? errs.slice(0, 2).join(' | ') : 'none') + ')', errs.length === 0);

    /* the summary reports what was MEASURED, including when it is bad -- the
       first cut printed "drag survives" unconditionally and said it during a run
       where that very claim was red, which is a gate lying in its own log. */
    console.log('  MEASURED: card ' + geo.cardTop + ' vs chrome ' + geo.chromeBottom
      + ' · ' + left + '/6 ways out · drag ' + (drag.vista ? 'survives' : 'THROWN OUT')
      + ' · pad walks ' + walked.moved + ' cells on exit');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
