/* ============================================================================
   FIRST NIGHT GATE (8/19/26, RUN lane).

   THE FIRST NIGHT HAD NEVER BEEN PLAYED AS A SEQUENCE. Nine beats now land in
   the player's first twenty minutes -- cold open, wake, the job on the phone,
   the offer, the market, the reckoning, the install line, the day 2 wake, the
   vista -- and each was built by a different turn against its own gate. Every
   one of those gates was green. THE BUG WAS IN THE SPACE BETWEEN THEM, which is
   the space no gate was watching, and it was not subtle:

     #openInvite (the shell's cold-open banner)   page y   40 -> 127
     the city's own toolbar                       page y   89 -> 120

   The toolbar was ENTIRELY INSIDE the banner. Covered: MUSIC, save, the builder
   drawer, and PHONE with its unread badge lit -- on the morning the wake card
   says "Something came in on your phone overnight. THE METER READER." The job
   comes in on the phone. The demo's core loop was blocked at minute one, by the
   story hook, and neither beat won: the family-at-the-table hook was a thin bar
   losing to a big gold GET UP button in the middle of the screen.

   WHAT THIS GATE HOLDS, and several of these exist because I got them wrong
   first and the measurement caught me:

     1. THE PHONE IS REACHABLE ON DAY 1 WHILE THE INVITE IS UP. Not "the rects
        do not intersect" -- it TAPS the phone at its own centre point, through
        the shell, and asserts the phone actually opens. The rect check is the
        cheap half; the tap is the true one.
     2. AND THE INVITE STANDS DOWN ENTIRELY while a city surface is open. The
        first cut only moved the banner below the toolbar and shipped that half
        -- measured, the phone SCREEN then ran 115-844 with the banner at
        121-208, so the top ninety pixels of the job list were still under it.
        Clearing a button and covering the surface behind it is moving a bug.
     3. IT COMES BACK when the surface closes. Standing down must not mean
        losing the invitation.
     4. THE COLD OPEN STILL WORKS: WATCH still plays it, NOT NOW still dismisses
        it and is still remembered. This gate must never be satisfiable by
        deleting the beat it is protecting.
     5. THE OFFSET IS DERIVED, NOT TYPED. The shell may not carry a hardcoded
        pixel height for another document's toolbar, and the source is checked
        for one -- that number is the bug, one commit later.
     6. THE WORLD IS NOT AN OVERLAY. The occlusion rule matched #cv, the world
        canvas itself (94% of the viewport), in its first cut -- which suppressed
        the banner permanently and would have shipped "the cold open never
        appears" INSIDE the fix for "the cold open covers the phone". Asserted
        directly, because it is the exact failure a naive rule reintroduces.
     7. ONE TAP TO PLAY. The whole reason this pass happened: the research on
        openings is blunt that stacked interruptions in the first minutes teach a
        player the game will keep interrupting him. Day 1 costs ONE tap.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const CITY_APP = require(path.join(ROOT, 'gates/bohemia_city_app.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('FIRST NIGHT GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}
async function worldFrame(page) {
  for (let i = 0; i < 90; i++) {
    const f = page.frames().find(fr => CITY_APP.isFrame(fr, page));
    if (f) return f;
    await page.waitForTimeout(250);
  }
  return null;
}

/* ---- 1. the mechanism is derived, and the beat still exists -------------- */
{
  const a = fs.readFileSync(ALPHA, 'utf8');
  const c = fs.readFileSync(CITY, 'utf8');
  const acode = a.replace(/\/\*[\s\S]*?\*\//g, '');
  const ccode = c.replace(/\/\*[\s\S]*?\*\//g, '');

  ok('the fix is in the build', a.indexOf('__THE_COLD_OPEN_CLEARS_THE_TOOLBAR__') >= 0
     && c.indexOf('__THE_COLD_OPEN_CLEARS_THE_TOOLBAR__') >= 0);
  ok('THE CITY REPORTS ITS OWN CHROME rather than the shell guessing at it, and '
     + 'the number is MEASURED off its own toolbar',
     /postMessage\(\{bohemiaCityChrome:/.test(ccode)
     && /getElementById\('topbar'\)[\s\S]{0,400}?getBoundingClientRect\(\)/.test(ccode)
     && /top:\s*Math\.ceil\(r\.bottom\)/.test(ccode));
  ok('and the shell positions the invite from that report',
     /inv\.style\.top\s*=\s*\(typeof CITY_CHROME_TOP==='number'\?CITY_CHROME_TOP:0\)/.test(acode));
  /* THE NUMBER THAT MUST NOT EXIST. A hardcoded toolbar height in the shell is
     this bug again one commit later, and it would pass every other check here. */
  ok('and the shell carries NO hardcoded toolbar height for the city',
     !/openInvite[\s\S]{0,400}?style\.top\s*=\s*['"]?\d+px/.test(acode));
  /* THE BEAT MUST NOT WAIT ON ANOTHER DOCUMENT'S LOAD. The first cut held the
     banner back until the report arrived, which LOOKED principled -- no number,
     no guess -- and landed the pixels correctly, so this gate went green on it.
     Measured afterwards: the report arrives 8.5 SECONDS after the RUN tap,
     because the city is a 2.3MB document, so the story hook sat invisible for
     eight seconds and opening_gate went red. Before the city exists there is no
     toolbar to clear, so it opens where it always did and drops on the report. */
  ok('the banner does NOT wait on the city\'s load to be offered -- an empty '
     + 'panel has no toolbar to cover', !/typeof CITY_CHROME_TOP!=='number'\)\{ inv\.style\.display='none'/.test(acode));
  /* AND STANDING DOWN IS FOR SURFACES THAT REPLACE THE SCREEN, NOT SCRIMS. */
  ok('standing down is limited to OPAQUE surfaces -- a scrim like the day card is '
     + 'a modal over the world, and treating it as occluding meant the cold open '
     + 'was never offered at all', /parseFloat\(al\[1\]\)<1\) continue/.test(ccode));

  /* THE BEAT ITSELF IS STILL THERE. This gate must not be satisfiable by
     deleting the cold open. */
  ok('THE COLD OPEN STILL EXISTS: the invite, its words and both answers',
     /openInvite/.test(a) && /BEGINS BEFORE THE DAY/.test(a)
     && /openWatch/.test(a) && /openNot/.test(a));
  ok('WATCH still starts it and NOT NOW is still remembered',
     /openWatch[\s\S]{0,200}?openStart\(\)/.test(acode)
     && /openNot[\s\S]{0,300}?openMarkSeen\(\)/.test(acode));

  /* HIS FEET ARE THE TRUTH -- and homeFind must ask the player, not the camera.
     mktHub() and mktAt() already read the player's cell this way; homeFind was
     the one asking city.x, which is how the house ended up 38 cells away. */
  ok('the fix is in the build', c.indexOf('__HIS_FEET_ARE_THE_TRUTH__') >= 0);
  ok('homeFind resolves from the PLAYER\'s cell, not the camera marker',
     /_pcx=\(MODE==='human'\)\?\(\(hx\/FN\)\|0\):city\.x/.test(ccode)
     && /const key=seed\+':'\+_pcx\+','\+_pcy/.test(ccode));
  ok('and it uses the same idiom mktHub/mktAt already used, rather than a new one',
     /\(MODE==='human'\)\?\(\(hx\/FN\)\|0\):city\.x/.test(ccode.replace(/var cx=/g, '')));

  /* THE WORLD IS NOT AN OVERLAY -- the regression that hid inside the fix. */
  ok('the occlusion rule requires a declared stacking level, so the world canvas '
     + 'is never mistaken for a surface over it', /z>=1/.test(ccode.replace(/\s/g, '')));
  ok('and it is a property, not a list of surface names (no phonewrap/daycard '
     + 'roll-call in the reporter)',
     !/cityOccluded[\s\S]{0,600}?(phonewrap|daycard|mktwrap)/.test(ccode));
}

/* ---- 1b. THE DAY CAN BE SPENT BY PLAYING -------------------------------- */
/* THE BUG: engine/bohemia_dayloop.js:109 was `mins = Math.max(0, mins | 0)`.
   `| 0` truncates, the walk ticks 0.084 min per fine cell, and 0.084|0 === 0 --
   so every step the player ever took was discarded. Each call truncated
   independently, so the remainder could never accumulate and WALKING COULD NEVER
   MOVE THE CLOCK, at any distance, forever. Measured with tick hooked: six cells
   walked, six calls of 0.084, 0.504 minutes owed, DAY.min 360 before and 360
   after. That is why the reckoning always read "0h lived - 16h given back" -- not
   a quiet day, a day that could not be spent by playing.
   AND DAY.step HAD NO CALLER AT ALL, so "N steps" was always 0 too. */
{
  const DL = require(path.join(ROOT, 'engine/bohemia_dayloop.js'));
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_dayloop.js'), 'utf8');
  /* COMMENTS STRIPPED FIRST. The patch's own comment QUOTES the dead line so the
     next reader knows what was wrong, and the first cut of this check grepped the
     raw file and matched that comment -- a gate that reads prose as code. Same
     trap as the seed literal on 8/18. */
  const esrc = src.replace(/\/\*[\s\S]*?\*\//g, '');
  ok('the day loop no longer truncates sub-minute time with `| 0`',
     !/mins\s*=\s*Math\.max\(0,\s*mins\s*\|\s*0\)/.test(esrc));

  const L = DL.make(); L.wake();
  const t0 = L.min;
  for (let i = 0; i < 12; i++) L.tick(0.084, 'suburb');
  ok('TWELVE WALKED CELLS COST ONE MINUTE -- the remainder accumulates instead of '
     + 'being thrown away (' + t0 + ' -> ' + L.min + ')', L.min === t0 + 1);
  for (let i = 0; i < 12; i++) L.tick(0.084, 'suburb');
  ok('and it keeps accumulating (' + L.min + ')', L.min === t0 + 2);

  /* THE HALF OF `| 0` THAT WAS DOING REAL WORK must survive: it also turned NaN
     and undefined into 0, and without that a bad caller freezes the day forever. */
  const S = DL.make(); S.wake(); const s0 = S.min;
  S.tick(NaN, 'x'); S.tick(undefined, 'x'); S.tick('abc', 'x'); S.tick(-5, 'x');
  ok('NaN / undefined / a string / a negative still cannot move or freeze the clock',
     S.min === s0);

  const W = DL.make(); W.wake(); W.tick(10, 'x');
  ok('and the whole-minute callers are untouched (advance(10) still spends 10)',
     W.min === 360 + 10);

  const P = DL.make(); P.wake(); P.tick(0.5, 'x');
  const Q = DL.make(); Q.restore(P.serialize()); Q.tick(0.5, 'x');
  ok('the sub-minute remainder rides the save, so a reload does not quietly lose it',
     Q.min === 361);

  const M = DL.make(); M.wake();
  for (let i = 0; i < 5; i++) M.step('suburb');
  ok('and DAY.step counts steps when something calls it', M.summary().steps === 5);
}

/* ---- 2. played, on the real alpha ---------------------------------------- */
(async () => {
  const { chromium } = pw();
  const b = await chromium.launch();
  try {
    const page = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.route(/^https?:/, r => r.abort());
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => document.getElementById('front').click());
    await page.waitForTimeout(4000);

    const f = await worldFrame(page);
    ok('the walked world is up in the RUN tab', !!f);
    if (!f) { await b.close(); done(); }

    for (let i = 0; i < 80; i++) { if (await f.$('#daycardIn .dcgo')) break; await page.waitForTimeout(250); }

    /* ONE TAP TO PLAY */
    let taps = 0;
    for (let i = 0; i < 8; i++) {
      const up = await f.evaluate(() => {
        const c = document.getElementById('daycard');
        if (!c || getComputedStyle(c).display === 'none') return false;
        return !!document.querySelector('#daycardIn .dcgo');
      });
      if (!up) break;
      await f.$eval('#daycardIn .dcgo', el => el.click());
      taps++;
      await page.waitForTimeout(900);
    }
    ok('DAY 1 COSTS ONE TAP before he is standing in the world (' + taps + ')', taps === 1);

    const frTop = await page.evaluate(() =>
      document.querySelector('#p-city iframe').getBoundingClientRect().top);
    const inv = await page.evaluate(() => {
      const e = document.getElementById('openInvite');
      const r = e.getBoundingClientRect();
      return { display: getComputedStyle(e).display, top: r.top, bottom: r.bottom,
               chrome: window.CITY_CHROME_TOP };
    });
    ok('THE COLD OPEN IS ACTUALLY OFFERED (it is on screen, not skipped)',
       inv.display !== 'none');
    ok('and the city reported its chrome so the shell had a real number ('
       + inv.chrome + ')', typeof inv.chrome === 'number' && inv.chrome > 0);

    const ph = await f.evaluate(() => {
      const e = document.getElementById('phonebtn');
      const r = e.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    });
    const pTop = ph.top + frTop, pBot = ph.bottom + frTop;
    const overlaps = inv.display !== 'none' && !(pBot <= inv.top || pTop >= inv.bottom);
    ok('THE PHONE BUTTON IS NOT UNDER THE BANNER (phone ' + Math.round(pTop) + '-'
       + Math.round(pBot) + ', banner ' + Math.round(inv.top) + '-'
       + Math.round(inv.bottom) + ')', !overlaps);

    /* THE TRUE TEST: tap it through the shell and see the phone open. */
    await page.mouse.click((ph.left + ph.right) / 2, (ph.top + ph.bottom) / 2 + frTop);
    await page.waitForTimeout(1500);
    const open1 = await f.evaluate(() => {
      const p = document.getElementById('phonewrap');
      return !!p && getComputedStyle(p).display !== 'none';
    });
    ok('AND TAPPING IT REALLY OPENS THE PHONE -- the job arrives on the phone, so '
       + 'this is the demo\'s core loop, not a cosmetic overlap', open1 === true);

    /* AND THE BANNER STANDS DOWN while the phone is up */
    const invBusy = await page.evaluate(() => {
      const e = document.getElementById('openInvite');
      return { display: getComputedStyle(e).display, busy: window.CITY_BUSY };
    });
    ok('THE BANNER STANDS DOWN while the phone is open, instead of sitting on the '
       + 'job list', invBusy.display === 'none' && invBusy.busy === true);

    /* AND IT COMES BACK */
    await f.evaluate(() => { const c = document.getElementById('phoneclose');
      if (c) c.click(); else phoneClose(); });
    await page.waitForTimeout(1500);
    const invBack = await page.evaluate(() => {
      const e = document.getElementById('openInvite');
      return { display: getComputedStyle(e).display, busy: window.CITY_BUSY };
    });
    ok('and it COMES BACK when he closes it -- standing down is not losing the '
       + 'invitation', invBack.display !== 'none' && invBack.busy === false);

    /* NOT NOW still works and is still an answer */
    await page.evaluate(() => document.getElementById('openNot').click());
    await page.waitForTimeout(600);
    const gone = await page.evaluate(() => {
      const e = document.getElementById('openInvite');
      return { display: getComputedStyle(e).display, want: e.dataset.want };
    });
    ok('NOT NOW still dismisses it', gone.display === 'none');
    /* and a later chrome report must not resurrect a dismissed banner */
    await page.waitForTimeout(1400);
    const stayGone = await page.evaluate(() =>
      getComputedStyle(document.getElementById('openInvite')).display);
    ok('and it STAYS dismissed -- a later chrome report never raises a banner he '
       + 'already answered', stayGone === 'none');

    /* ---- HIS HOUSE IS WHERE HE IS ------------------------------------- */
    /* THE BUG THIS CATCHES, measured on a clean boot before it was fixed:
         LANDED [6205,6271] -> body in cell (48,48)
         HOME_KEY "2691674296:37,22" -> his house resolved in cell (37,22)
       HIS OWN HOUSE WAS 38 CELLS FROM HIS FEET, every boot, and the phone
       pointed him at it. The marker started correct and was moved by the
       shell's BOHEMIA_GOTO_CELL, which forwards a cell from the RUN SLICE --
       a different surface with its own player -- and homeFind() keyed on the
       marker. Two surfaces, two players, one marker. */
    const house = await f.evaluate(() => {
      const h = homeFind();
      const body = { x: (hx / FN) | 0, y: (hy / FN) | 0 };
      return { body: body, marker: { x: city.x, y: city.y },
               homeCell: h ? { x: (h.x / FN) | 0, y: (h.y / FN) | 0 } : null,
               phoneHome: (phoneState() || {}).home || null,
               key: typeof HOME_KEY !== 'undefined' ? HOME_KEY : null };
    });
    ok('HIS HOUSE IS IN THE CELL HE IS STANDING IN -- body ' + JSON.stringify(house.body)
       + ', house ' + JSON.stringify(house.homeCell) + ' (it was 38 cells away)',
       !!house.homeCell && house.homeCell.x === house.body.x
       && house.homeCell.y === house.body.y);
    ok('and the phone points at that same house rather than one across the valley',
       !!house.phoneHome && !!house.phoneHome.cell
       && house.phoneHome.cell.x === house.body.x
       && house.phoneHome.cell.y === house.body.y);

    /* ---- AND HE CAN SPEND THE DAY BY WALKING --------------------------- */
    /* THE ASSERTION THAT WOULD HAVE CAUGHT IT, and it has to be a real pointer
       hold on the real pad: calling advance() proves the engine, not the game.
       Eight directions in turn so a wall can never end the test early -- the
       first cut held one direction, hit a fence after six cells, and would have
       reported "the clock does not move" for the wrong reason. */
    const walked = await f.evaluate(async () => {
      const before = { min: DAY.min, steps: DAY.summary().steps };
      for (const di of [0, 2, 4, 6, 1, 3, 5, 7, 0, 2, 4, 6]) {
        const p = document.querySelectorAll('#pad .pb')[di];
        if (!p) continue;
        p.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
        await new Promise(r => setTimeout(() => {
          p.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); r();
        }, 1200));
      }
      return { before: before, after: { min: DAY.min, steps: DAY.summary().steps },
               districts: DAY.summary().districts };
    });
    const gotSteps = walked.after.steps - walked.before.steps;
    const gotMins = walked.after.min - walked.before.min;
    ok('WALKING COUNTS AS STEPS on the surface he plays (' + gotSteps + ', it was '
       + 'always 0 because DAY.step had no caller)', gotSteps > 0);
    ok('AND WALKING SPENDS THE DAY (' + gotMins + ' minutes, it was always 0 because '
       + '`mins | 0` truncated every 0.084 tick to nothing)', gotMins > 0);
    ok('and the district ledger records where that time actually went ('
       + JSON.stringify(walked.districts) + ')',
       Array.isArray(walked.districts) && walked.districts.length > 0
       && walked.districts.some(d => d.mins > 0));

    /* WHILE HE IS IN HIS BODY, AN OUTSIDE SURFACE MAY NOT MOVE HIM. */
    const held = await f.evaluate(() => {
      MODE = 'human';
      const before = { x: city.x, y: city.y };
      window.postMessage({ type: 'BOHEMIA_GOTO_CELL', x: 3, y: 91 }, '*');
      return new Promise(r => setTimeout(() =>
        r({ before: before, after: { x: city.x, y: city.y } }), 350));
    });
    ok('a cell posted by another surface does NOT move him while he is walking '
       + '(' + JSON.stringify(held.before) + ' -> ' + JSON.stringify(held.after) + ')',
       held.after.x === held.before.x && held.after.y === held.before.y);
    /* AND THE CASE PAOLO ASKED FOR IS UNTOUCHED (7/28, "I want that reflected
       when I'm in the city menu"). A fix that broke this would be a trade, not
       a fix, so it is asserted in the same breath. */
    const moved = await f.evaluate(() => {
      MODE = 'city';
      window.postMessage({ type: 'BOHEMIA_GOTO_CELL', x: 3, y: 91 }, '*');
      return new Promise(r => setTimeout(() => r({ x: city.x, y: city.y }), 350));
    });
    ok('but in the CITY MENU the marker still follows it -- Paolo 7/28 is intact',
       moved.x === 3 && moved.y === 91);

    ok('no page error across the first night' + (errs.length ? ' -- ' + errs[0] : ''),
       errs.length === 0);
  } finally { await b.close(); }
  done();
})().catch(e => { console.log('FIRST NIGHT GATE CRASHED: ' + e.message); process.exit(1); });
