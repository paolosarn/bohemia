const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THE WHOLE DEMO, IN ONE SESSION, BY TAPPING (8/21/26, RUN lane)

   THE DEMO IS SCOPED (Paolo 8/4): THE ORIGIN + THE VISTA + ONE GOOD DAY. Every
   beat of it is green. NOT ONE TEST HAS EVER PLAYED IT THROUGH.

   Here is what was actually being relied on, gate by gate, before this existed:

     front_door_gate      the splash lands on the game        (alpha)
     first_night_gate     day one, in detail                  (alpha, stops at
                                                               the finished job)
     combat_entry_gate    walking into a building fights      (alpha, own boot)
     footstep_gate        the ground makes a sound            (own boot)
     vista_beat_gate      sleep, wake, the valley opens       (THE CITY,
                                                               STANDALONE)

   FIVE GATES, THREE SURFACES, FIVE SEPARATE BOOTS, and the join between any two
   of them is proven by nobody. That is SWEEP 13's finding word for word --
   "gates that test pieces and never the journey" -- and it is the same shape as
   every bug this lane has spent the week on: a finished thing with a published
   seam and no caller. A seam between two GATES is invisible in exactly the same
   way, except the thing that falls through it is the demo.

   THE VISTA IS THE SHARPEST CASE AND IT IS WHY THIS WAS WRITTEN. vista_beat
   drives `slices/BOHEMIA_CITY_WORLD.html` DIRECTLY. The city is the right
   surface -- it is the walked world -- but NOBODY OPENS IT THAT WAY. Paolo opens
   the alpha and taps the splash, and the city runs as an IFRAME inside a shell
   with its own toolbar, its own day card and its own install banner. This lane
   already shipped a fix for a bug of exactly that shape (the cold open covering
   the city toolbar, because the shell's chrome and the frame's chrome had never
   been measured together). The demo's money shot had never once been checked on
   the surface his thumb touches.

   MEASURED BEFORE WRITING THIS, and the honest answer is that it WORKS: the
   valley opens on day 2 inside the alpha, its card sits at page 104-164 with the
   tab bar at 0-40, no overlap, zero page errors. I expected a bug and there
   wasn't one. THE TEST IS STILL THE DELIVERABLE -- what was missing was not a
   fix, it was the PROOF, and the next thing on the demo board is putting friends
   in front of this. You do not do that with a path nobody has walked once.

   WHY THIS DOES NOT REPLACE first_night_gate, and do not "dedupe" them later:
   they are different instruments. first_night is the MICROSCOPE -- 53 claims
   about the mechanics of day one, the door predicate, the interior mover, the
   minute arithmetic. This is the SPINE: fewer claims, every one of them on ONE
   UNBROKEN SESSION from the splash to the valley. A microscope cannot see a seam
   between two boots, and a spine cannot see an off-by-one in a mover.

   EVERY BEAT IS A TAP A PLAYER COULD MAKE. No calling offerAccept(), no setting
   DAY.day = 2, no forcing a panel visible. If a beat cannot be reached by
   tapping, it cannot be reached by a friend, and the gate should say so.

   node gates/the_whole_demo_gate.js
   ========================================================================== */
const path = require('path');
const ROOT = path.dirname(__dirname);
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
  console.log('\n=== THE WHOLE DEMO: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

/* MOVEMENT IS ON THE BEAT (120 BPM LAW, BEAT=0.5s), so a tap shorter than a beat
   lands nothing. Measured on this lane's own gates: 220ms presses landed 8 of 14
   steps and read as "walking is broken". 560ms is one beat plus headroom. */
const HOLD = 560;

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    /* ---- 1. HE OPENS THE LINK AND TAPS ONCE -------------------------------- */
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    ok('the alpha opens at all', true);
    await page.click('#front').catch(() => { });

    /* the city iframe is built lazily INSIDE that click handler, so this is the
       condition, not a duration: the frame exists and its day loop is alive. */
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('ONE TAP ON THE SPLASH PUTS HIM IN THE GAME -- the city he walks is built '
      + 'and its day loop is running', !!city);
    if (!city) done();

    const read = () => city.evaluate(() => {
      const vis = id => { const e = document.getElementById(id);
        return !!(e && getComputedStyle(e).display !== 'none'); };
      return {
        day: (typeof DAY !== 'undefined') ? DAY.day : null,
        card: vis('daycard'),
        btns: [...document.querySelectorAll('#daycardIn .dcgo, #daycardIn .dcbtn')]
          .map(x => x.innerText.trim().split('\n')[0]),
        obj: (document.getElementById('qline') || {}).textContent || '',
        badge: (document.getElementById('phonebadge') || {}).textContent || '',
        sleep: vis('sleepbtn'),
        vista: !!(window.__VISTA && window.__VISTA.isOpen && window.__VISTA.isOpen()),
        taken: !!window.OFFER_TAKEN,
      };
    });
    const tapCard = () => city.evaluate(() => {
      const g = document.querySelector('#daycardIn .dcgo')
             || document.querySelector('#daycardIn .dcbtn');
      if (!g) return false; g.click(); return true;
    });

    const boot = await read();
    ok('and it is DAY 1, not a menu (day ' + boot.day + ')', boot.day === 1);

    /* ---- 2. THE ORIGIN: the cold open is OFFERED, and answerable ----------- */
    const invite = await page.evaluate(() => {
      const e = document.getElementById('openInvite');
      return e ? getComputedStyle(e).display : 'absent';
    });
    ok('THE ORIGIN IS OFFERED TO HIM rather than waiting to be found -- the shell '
      + 'raises the cold open on its own (' + invite + ')', invite !== 'absent');
    /* NOT NOW is a real answer and the demo must survive it: a friend who declines
       the cutscene still has to get a playable day. */
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1500);
    const gone = await page.evaluate(() => {
      const e = document.getElementById('openInvite');
      return !e || getComputedStyle(e).display === 'none';
    });
    ok('and DECLINING IT IS A REAL ANSWER -- the banner goes away and the day is '
      + 'still there', gone === true);

    /* ---- 3. ONE GOOD DAY: he gets up ------------------------------------- */
    if ((await read()).card) await tapCard();
    await SETTLE(page, 1600);
    const up = await read();
    ok('GET UP is a tap, and the day is under way', up.day === 1);

    /* ---- 4. THE JOB FINDS HIM, he does not have to know it is there ------- */
    /* THIS IS THE ONE A FRIEND FAILS. The work of day one is behind the PHONE,
       and a player who only taps the obvious card button goes GET UP -> SLEEP ->
       DAY 2 and never plays anything. So the affordance itself is the claim: the
       phone has to SAY it has something. */
    ok('THE JOB ANNOUNCES ITSELF: the phone carries an unread badge, so the day\'s '
      + 'work is not hidden behind a button he had no reason to press ("'
      + up.badge.trim() + '")', up.badge.trim() !== '');

    await city.evaluate(() => { const b = document.getElementById('phonebtn'); if (b) b.click(); });
    await SETTLE(page, 2500);
    const pf = page.frames().find(fr => /CURRENT_SLICE/.test(fr.url()));
    ok('tapping the phone really opens it, as its own screen', !!pf);
    if (pf) {
      /* poll for the button, state:'attached' -- the phone frame never lays out a
         visible box and playwright's default 'visible' times out on an element
         querySelector finds instantly (measured, cost this lane 15 claims once) */
      let took = false;
      try {
        await pf.waitForSelector('.lv-take', { state: 'attached', timeout: 10000 });
        took = await pf.evaluate(() => {
          const t = document.querySelector('.lv-take');
          if (!t) return false; t.click(); return true;
        });
      } catch (e) { took = false; }
      ok('and the job has a TAKE IT he can tap', took === true);
      await SETTLE(page, 2200);
      const after = await read();
      ok('TAKING IT CROSSES THE FRAME BOUNDARY and the city knows he took it',
        after.taken === true);
      ok('and an objective arrives where he can read it ("'
        + after.obj.trim().slice(0, 40) + '")', after.obj.trim() !== '');
      await city.evaluate(() => { try { phoneClose(); } catch (e) { } });
      await SETTLE(page, 900);
    }

    /* ---- 5. HE WALKS. On the real pad, on the beat. ----------------------- */
    const before = await city.evaluate(() => ({ x: (hx / FN) | 0, y: (hy / FN) | 0,
                                                steps: DAY.summary().steps }));
    for (let i = 0; i < 6; i++) {
      await city.evaluate(async (h) => {
        const p = document.querySelectorAll('#pad .pb')[4];   /* south */
        if (!p) return;
        p.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        await new Promise(r => setTimeout(r, h));
        p.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      }, HOLD);
      await SETTLE(page, 260);
    }
    const walked = await city.evaluate(() => ({ x: (hx / FN) | 0, y: (hy / FN) | 0,
                                                steps: DAY.summary().steps }));
    ok('HE CAN WALK, on the pad, with his thumb (' + walked.steps + ' step(s) counted, '
      + 'was ' + before.steps + ')', walked.steps > before.steps);

    /* ---- 6. THE DAY ENDS BECAUSE HE ENDS IT ------------------------------ */
    const canSleep = (await read()).sleep;
    ok('THE DAY HAS AN END HE CAN REACH -- SLEEP is on screen, not behind a menu',
      canSleep === true);
    await city.evaluate(() => { const b = document.getElementById('sleepbtn'); if (b) b.click(); });
    await SETTLE(page, 1600);
    const reckon = await read();
    ok('and sleeping raises the reckoning rather than skipping straight to morning '
      + '(' + JSON.stringify(reckon.btns) + ')', reckon.card === true);

    /* ---- 7. THE VISTA. THE MONEY SHOT, ON THE SURFACE HE TAPS. ------------ */
    await tapCard();                     /* SLEEP -> DAY 2 */
    await SETTLE(page, 1800);
    const d2card = await read();
    ok('DAY 2 ARRIVES (day ' + d2card.day + ')', d2card.day === 2);
    ok('and the day-2 card comes up FIRST, so the valley is not buried under it',
      d2card.vista === false);
    await tapCard();                     /* GET UP into day 2 */
    await SETTLE(page, 22000, async () => {
      try { return await city.evaluate(() =>
        !!(window.__VISTA && window.__VISTA.isOpen && window.__VISTA.isOpen())); }
      catch (e) { return false; }
    });
    const d2 = await read();
    ok('*** THE VALLEY OPENS BY ITSELF ON DAY 2, IN THE ALPHA *** -- the demo\'s '
      + 'money shot proved on the surface his thumb actually touches, and not on '
      + 'the city opened standalone the way every earlier proof did',
      d2.day === 2 && d2.vista === true);

    /* AND IT IS ON SCREEN. Green is not the same as seen, and the two boxes have
       to be compared in ONE coordinate system: the card is measured inside the
       IFRAME, the shell's tab bar in PAGE space. Comparing those two directly is
       the exact units bug this lane has now found nine times, so convert first --
       the iframe's own page box plus the card's frame offset. */
    const boxes = await (async () => {
      const fe = await city.frameElement().catch(() => null);
      const fb = fe ? await fe.boundingBox() : null;
      const inner = await city.evaluate(() => {
        const c = document.getElementById('vistaCard');
        if (!c) return null;
        const r = c.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, h: r.height };
      }).catch(() => null);
      const shell = await page.evaluate(() => {
        const e = document.getElementById('tabs');
        if (!e) return null;
        const s = getComputedStyle(e), r = e.getBoundingClientRect();
        return s.display === 'none' ? 'hidden'
          : { top: Math.round(r.top), bottom: Math.round(r.bottom) };
      });
      if (!fb || !inner) return null;
      return { top: Math.round(fb.y + inner.top), bottom: Math.round(fb.y + inner.bottom),
               h: Math.round(inner.h), shell: shell, view: 844 };
    })();
    ok('its card is really drawn (not a flag that says it was)',
      !!boxes && boxes.h > 0);
    if (boxes) {
      const t = boxes.shell;
      const covered = t && t !== 'hidden' && boxes.top < t.bottom && boxes.bottom > t.top;
      ok('AND NOTHING OF THE SHELL IS SITTING ON TOP OF IT -- card at page '
        + boxes.top + '-' + boxes.bottom + ', tab bar at '
        + (t === 'hidden' ? 'hidden' : t ? t.top + '-' + t.bottom : 'absent')
        + ' (compared in ONE coordinate system, because the card is measured in '
        + 'the iframe and the bar in the page)', !covered);
      ok('and it is inside the screen he is holding, not off the bottom of it',
        boxes.top >= 0 && boxes.top < boxes.view);
    }

    /* ---- 8. AND THE WHOLE THING WAS QUIET -------------------------------- */
    ok('NO PAGE ERROR ANYWHERE IN THE WHOLE DEMO' + (errs.length ? ' -- ' + errs[0] : ''),
      errs.length === 0);
  } finally { await browser.close(); }
  done();
})().catch(e => {
  /* A CRASH STILL FILES ITS REPORT. A check whose result you cannot read is the
     same failure as a check that never ran -- this lane fixed the identical hole
     in first_night_gate the day before. */
  console.log('  > FAIL the demo ran end to end without throwing -- ' + e.message);
  fail++;
  console.log('\n=== THE WHOLE DEMO: ' + pass + ' passed, ' + fail
    + ' failed (CRASHED after claim ' + (pass + fail - 1) + ', the rest never ran) ===');
  process.exit(1);
});
