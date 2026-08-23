const path = require('path');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   WHAT THE DEMO SOUNDS LIKE, BEAT BY BEAT (8/22/26, SOUND lane)

   THE DEMO IS SCOPED (Paolo 8/4): THE ORIGIN + THE VISTA + ONE GOOD DAY. The RUN
   lane proved on 8/21 that the whole thing PLAYS, in one unbroken session, by
   tapping (gates/the_whole_demo_gate.js). Nothing has ever asked what it SOUNDS
   like along that same path.

   THIS LANE HAS BEEN COUNTING THE WRONG THING. Every instrument here measures the
   catalogue: 102 moments, 155 approved candidates, which ids have callers. All of
   that is a claim about the BANK. What Paolo experiences is a WALK -- splash, get
   up, phone, take the job, six steps, sleep, day two, the valley -- and a moment
   that is perfectly wired but never reached during that walk is, to him, silent.
   A caller is not the same thing as a sound he hears, exactly as an approved
   candidate was never the same thing as a wired one.

   SO THIS IS THE JOURNEY INSTRUMENT, not another microscope. It walks the same
   beats as the whole-demo gate -- deliberately duplicated rather than shared,
   for the reason that gate gives about itself: different instruments, and a
   spine cannot be spliced into a microscope without breaking both -- and after
   each beat it reports EVERY sound the game asked for since the last one.

   WHAT IT RECORDS. Three surfaces, because a sound can be requested three ways:
     * playSFX(ev)                 the parent's own wire
     * BOHEMIA_SFX / BOHEMIA_STEP  posted up from the city or the run
     * STING.play(fig)             the musical cues, which are not playSFX at all

   WHAT IT ASSERTS is deliberately narrow: the beats that MUST make a sound are
   the ones whose sound Paolo has already approved and which the game already
   claims to wire. Everything else is REPORTED, not failed, because a silent beat
   is not automatically a defect -- this valley is supposed to be quiet, and the
   ambience deliberately leaves long gaps. The report is the deliverable; the
   assertions are the floor.

   node gates/demo_sound_gate.js
   ========================================================================== */
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

/* MOVEMENT IS ON THE BEAT (120 BPM LAW, BEAT=0.5s). 560ms is one beat plus
   headroom -- the whole-demo gate measured 220ms landing 8 of 14 steps. */
const HOLD = 560;

const BEATS = [];          /* {beat, heard:[...]} in order, for the report */

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

  /* THE RECORDER GOES IN BEFORE THE FIRST TAP, and it must not change what
     happens: every hook calls through to the real thing and returns its value.
     A probe that swallows a sound would be measuring its own interference. */
  await page.addInitScript(() => {
    window.__HEARD = [];
    const note = (ev, how) => { try { window.__HEARD.push(how + ':' + ev); } catch (_e) { } };
    window.addEventListener('message', function (e) {
      try {
        const d = e && e.data; if (!d) return;
        if (d.type === 'BOHEMIA_SFX' && d.ev) note(d.ev, 'post');
        if (d.type === 'BOHEMIA_STEP') note(d.surface || 'step', 'step');
      } catch (_e) { }
    });
    /* playSFX and STING are defined long after this script runs, so poll for
       them and wrap once each. Wrapping twice would double-count. */
    let wrapped = { sfx: false, sting: false };
    setInterval(() => {
      try {
        if (!wrapped.sfx && typeof window.playSFX === 'function') {
          const real = window.playSFX;
          window.playSFX = function (ev) { note(ev, 'play'); return real.apply(this, arguments); };
          wrapped.sfx = true;
        }
        if (!wrapped.sting && window.STING && typeof window.STING.play === 'function') {
          const real = window.STING.play.bind(window.STING);
          window.STING.play = function (f) { note(f, 'sting'); return real.apply(null, arguments); };
          wrapped.sting = true;
        }
      } catch (_e) { }
    }, 120);
  });

  /* drain: everything heard since the last drain, and label the beat */
  const drain = async (beat) => {
    const heard = await page.evaluate(() => {
      const h = window.__HEARD || []; window.__HEARD = []; return h.slice();
    });
    BEATS.push({ beat, heard });
    return heard;
  };

  try {
    /* ---- 1. HE OPENS THE LINK AND TAPS ONCE ---------------------------- */
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    await drain('the splash, before he touches anything');

    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the demo reaches the city at all (nothing below this can be measured '
      + 'without it)', !!city);
    if (!city) { report(); return; }
    await SETTLE(page, 1200);
    await drain('ONE TAP ON THE SPLASH -- the game starts');

    const read = () => city.evaluate(() => {
      const vis = id => { const e = document.getElementById(id);
        return !!(e && getComputedStyle(e).display !== 'none'); };
      return {
        day: (typeof DAY !== 'undefined') ? DAY.day : null,
        card: vis('daycard'), sleep: vis('sleepbtn'),
        obj: (document.getElementById('qline') || {}).textContent || '',
        badge: (document.getElementById('phonebadge') || {}).textContent || '',
        vista: !!(window.__VISTA && window.__VISTA.isOpen && window.__VISTA.isOpen()),
        taken: !!window.OFFER_TAKEN,
      };
    });
    const tapCard = () => city.evaluate(() => {
      const g = document.querySelector('#daycardIn .dcgo')
             || document.querySelector('#daycardIn .dcbtn');
      if (!g) return false; g.click(); return true;
    });

    /* ---- 2. HE DECLINES THE COLD OPEN ---------------------------------- */
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1500);
    await drain('he declines the cold open (a tap on a real button)');

    /* ---- 3. HE GETS UP -------------------------------------------------- */
    if ((await read()).card) await tapCard();
    await SETTLE(page, 1800);
    const upHeard = await drain('GET UP -- the first morning');
    /* HIS OWN SOUND, ON HIS OWN MORNING. come_up is approved 4 of 5 and was
       wired only in the RUN slice -- the panel nobody opens since the RUN tab
       started showing the city -- so the first morning of the demo was silent
       while the sound sat finished in the bank. Locked here so the game moving
       house again cannot quietly strand it a second time. */
    ok('THE MORNING MAKES A SOUND -- GET UP plays his approved come_up ('
      + (upHeard.join(', ') || 'SILENCE') + ')',
      upHeard.some(h => /come_up/.test(h)));

    /* ---- 4. THE PHONE, AND THE JOB ------------------------------------- */
    await city.evaluate(() => { const b = document.getElementById('phonebtn'); if (b) b.click(); });
    await SETTLE(page, 2500);
    await drain('he opens the PHONE (the job is behind it)');

    const pf = page.frames().find(fr => /CURRENT_SLICE/.test(fr.url()));
    if (pf) {
      try {
        await pf.waitForSelector('.lv-take', { state: 'attached', timeout: 10000 });
        await pf.evaluate(() => { const t = document.querySelector('.lv-take'); if (t) t.click(); });
      } catch (e) { }
      await SETTLE(page, 2200);
      await drain('he TAKES THE JOB');
      await city.evaluate(() => { try { phoneClose(); } catch (e) { } });
      await SETTLE(page, 900);
    }

    /* ---- 5. HE WALKS ---------------------------------------------------- */
    const before = await city.evaluate(() => DAY.summary().steps);
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
    const walked = await city.evaluate(() => DAY.summary().steps);
    const stepHeard = await drain('HE WALKS SIX STEPS (' + (walked - before) + ' counted)');

    /* THE ONE BEAT THAT CANNOT BE SILENT. He approved six footstep surfaces and
       the city posts BOHEMIA_STEP for every one of them; a walk that makes no
       sound is the single most obvious hole a player would find in ten seconds. */
    ok('WALKING MAKES A SOUND -- six steps on the real pad produced at least one '
      + 'footstep request (' + (stepHeard.join(', ') || 'SILENCE') + ')',
      walked > before && stepHeard.length > 0);

    /* ---- 6. HE SLEEPS --------------------------------------------------- */
    await city.evaluate(() => { const b = document.getElementById('sleepbtn'); if (b) b.click(); });
    await SETTLE(page, 1800);
    const sleepHeard = await drain('SLEEP -- the day ends because he ended it');
    ok('SETTLING IN MAKES A SOUND -- SLEEP plays his approved sleep_sink, the '
      + 'cleanest sweep he has given this lane (' + (sleepHeard.join(', ') || 'SILENCE') + ')',
      sleepHeard.some(h => /sleep_sink/.test(h)));
    /* AND GOING TO BED IS NOT BEING BEATEN. Before 8/22 this beat played
       `loss` -- the figure authored for losing a FIGHT, "falling, and it lands
       heavy" -- because QUESTSTING treated an unfinished day-one job as a
       defeat. Nothing static could see it; it took walking the demo and
       listening. A missed job has its own small figure now. */
    ok('and going to bed does NOT play the fight-defeat cadence ('
      + (sleepHeard.join(', ') || 'silent') + ')',
      !sleepHeard.some(h => h === 'sting:loss'));

    /* ---- 7. DAY TWO, AND THE VALLEY ------------------------------------- */
    await tapCard();
    await SETTLE(page, 1800);
    await drain('DAY 2 arrives');
    await tapCard();
    await SETTLE(page, 22000, async () => {
      try { return await city.evaluate(() =>
        !!(window.__VISTA && window.__VISTA.isOpen && window.__VISTA.isOpen())); }
      catch (e) { return false; }
    });
    const d2 = await read();
    await drain('*** THE VALLEY OPENS *** (the demo money shot)');
    ok('the journey actually reached the vista, so the report above covers the '
      + 'whole demo and not a truncated walk', d2.vista === true);

    ok('and the page threw nothing while being listened to ('
      + (errs.slice(0, 2).join(' | ') || 'clean') + ')', errs.length === 0);
  } catch (e) {
    ok('the journey ran to the end without throwing (' + String(e.message).slice(0, 120) + ')',
       false);
  }
  await browser.close();
  report();
})();

function report() {
  console.log('\n=== WHAT THE DEMO SOUNDS LIKE, BEAT BY BEAT ===');
  let silent = 0;
  for (const b of BEATS) {
    const uniq = [...new Set(b.heard)];
    if (!uniq.length) silent++;
    console.log('  ' + (uniq.length ? '♪' : ' ') + ' ' + b.beat);
    console.log('      ' + (uniq.join(', ') || '-- silent --'));
  }
  console.log('\n  ' + (BEATS.length - silent) + ' of ' + BEATS.length
    + ' demo beats make a sound. A silent beat is REPORTED, not failed: this '
    + 'valley is meant to be quiet and the gaps are the design.');
  console.log('=== DEMO SOUND: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
}
