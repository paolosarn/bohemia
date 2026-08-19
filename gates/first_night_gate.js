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

  /* THE WORLD IS NOT AN OVERLAY -- the regression that hid inside the fix. */
  ok('the occlusion rule requires a declared stacking level, so the world canvas '
     + 'is never mistaken for a surface over it', /z>=1/.test(ccode.replace(/\s/g, '')));
  ok('and it is a property, not a list of surface names (no phonewrap/daycard '
     + 'roll-call in the reporter)',
     !/cityOccluded[\s\S]{0,600}?(phonewrap|daycard|mktwrap)/.test(ccode));
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

    ok('no page error across the first night' + (errs.length ? ' -- ' + errs[0] : ''),
       errs.length === 0);
  } finally { await b.close(); }
  done();
})().catch(e => { console.log('FIRST NIGHT GATE CRASHED: ' + e.message); process.exit(1); });
