/* BOHEMIA -- DID HE SEE A HUMAN BEING, AND DOES ANYTHING TELL HIM HOW A FIGHT STARTS
 * EYES AND EARS, E26 [five minutes], 9/15/26.
 *
 * WHY. Paolo played the 9/14p cut, the same cut this lane walked, and said two things this
 * instrument can measure (records/BOHEMIA_PAOLO_PLAYED_THE_DEMO_AGAIN_9_15_26.md):
 *   "I didn't see a single human being. Very strange."
 *   "I don't even know how to engage in combat and when that shit starts."
 * The routing note for the first one names two possible causes and says nobody has measured
 * which: "LIFE+CITY [more people] shipped 13 of 16 walks meet a crowd; his walk was one of the
 * three, or the crowd loads after he has already looked."
 *
 * THAT IS THE WHOLE JOB OF THIS LANE. A gate is green (13 of 16 walks meet a crowd, 16 of 16
 * meet somebody) and the man playing it saw nobody. One of those two numbers is measuring
 * something he cannot see. I am not here to fix it -- PEOPLE owns the fix -- I am here to say
 * WHICH.
 *
 * AND THE TWO NUMBERS ARE NOT THE SAME NUMBER, which is the point:
 *   WHAT THE ENGINE THINKS IS NEAR   pplNearList(), the people borrowed onto his street.
 *   WHAT IS ACTUALLY PAINTED         bodies drawn inside peoplePass(), counted per frame.
 * A person can be near and never painted (culled off screen, sprite not baked yet, occupancy
 * dropping them, the pass not running at this zoom). The existing gate reads the first kind.
 * His eyes read the second kind. So this reads BOTH, on the same frames, and prints the gap.
 *
 * RULE ZERO (E9). A zero here would be the loudest number this lane has ever published, so it
 * needs a positive control in both directions before anybody believes it:
 *   C1 THE WRAP FIRED       peoplePass must actually be called, or a count of zero bodies
 *                           means "I never watched", which is the false zero of round 4.
 *   C2 THE COUNTER COUNTS   a planted extra draw inside the wrapped call must be counted.
 *   C3 IT IS NOT COUNTING THE WORLD: draws made OUTSIDE the people pass (the tiles, the
 *                           player) must not be attributed to people.
 *   C4 THE WORD SWEEP IS NOT BLIND: a planted word must be found by the same sweep that
 *                           reports no word about fighting.
 *   C5 I LOOKED BEFORE THE BAR I AM JUDGING: the first sample must land before his ten
 *                           seconds are up, or "first body at N" is just when I opened my eyes.
 *
 * WRONG VERSION ONE, KEPT ON PURPOSE, AND IT IS THE SAME MISTAKE AS ROUND 4.
 *   v1 polled for peoplePass after clicking the front screen, and the click BLOCKS for about
 *   twelve seconds while the city builds, so the wrap did not land until 21.3 s. It then
 *   reported "first body painted at 23.7 s, his ten-second bar NOT met" -- and 23.7 s was
 *   simply THE FIRST TIME I LOOKED. A number whose floor is my own start-up is not a
 *   measurement of the game, it is a measurement of my tool, and I almost put it on his page
 *   for the second round running. The wrap is ARMED BEFORE THE PAGE RUNS now, with a property
 *   trap that fires the moment the world defines the function, and control C5 refuses the whole
 *   result if the first sample lands after the bar being judged.
 *
 * WRONG VERSION TWO, ALSO KEPT. v2 tried to arm a property trap on peoplePass before the page
 *   ran. IT DID NOT TAKE AND THE CONTROLS SAID SO: people_pass_ran 0, the planted-draw control
 *   red. The reason is a plain fact about JavaScript that I should have known -- a global
 *   `function peoplePass(...)` DECLARATION redefines the property outright, it does not call an
 *   accessor's setter, so the trap was simply overwritten. AND v2's first look still landed at
 *   20.9 s, which taught the real limit: nothing outside the page can read anything while the
 *   page's own main thread is busy, because there is one thread. The city build holds it for
 *   about twenty seconds, so THE FIRST TWENTY SECONDS CANNOT BE OBSERVED FROM OUTSIDE AT ALL.
 *   That is not a gap to paper over: it is measured, stated, and it is its own finding, because
 *   it is the same twenty seconds he was describing when he said it was not running smoothly
 *   and things were loading in real time. So this version measures the BLOCK itself from inside,
 *   with a heartbeat armed before any page script runs, and reports the blind window as a number
 *   rather than filling it with a guess.
 *
 * WRONG VERSION FOUR, AND THIS ONE IS NOT MY MISTAKE BUT IT IS MY NUMBER (9/16). Round 6
 *   published this timeline -- first body on screen 17.2 s, freezes of 6.0 s and 11.1 s, 28.9 s
 *   frozen out of 300 -- MEASURED UNTHROTTLED, ON THIS BOX. PLUMBER then found (f90a810) that
 *   gates/bohemia_phone_perf.js has taken a phone-shaped CPU since 9/5 and thrown it away,
 *   because the refresh command written in its own record pinned `--cpu 1`. On a phone-shaped
 *   CPU their boot number goes 19,530 ms -> 71,758 ms, and the fight goes 57 fps -> 7.1.
 *   So every number in my round-6 timeline describes a machine several times faster than the
 *   thing in his hand, and he told us so in the same breath: "it's kinda not running as
 *   smoothly as I would like." THE FIVE MINUTES IS ON A PHONE (rule 14), so the CPU has to be
 *   a phone's too. This version throttles with the same mechanism PLUMBER uses rather than
 *   inventing a second one (REUSE-FIRST), takes BOTH passes, and never throws one away.
 *   AND THE THROTTLE IS PROVED REAL INSIDE THE SAME RUN, PLUMBER's rule: a fixed busy loop is
 *   timed at 1x and at 4x and the ratio is printed. A throttle that silently failed to apply
 *   would otherwise publish the fast numbers under a slow label, which is worse than no
 *   throttle at all.
 *
 * AND THE CONTROL THAT THE THROTTLED NUMBER DEMANDED (9/16). On a phone-shaped CPU this tool
 *   measured a 44-second freeze and 188.7 s frozen out of 300. THAT IS A BIG CLAIM AND MY OWN
 *   OBSERVER RUNS ON THE SAME ONE THREAD: every sample is a page.evaluate, and under a 4x
 *   throttle my polling is itself work the game has to wait for. So --noobserve runs the exact
 *   same walk with the sampling loop OFF, reading the heartbeat only once at the end. If the
 *   frozen total barely moves, the freeze is the game's. If it collapses, the freeze was mine
 *   and the number must not be published. A watcher that changes what it watches has to prove
 *   it did not.
 *
 * AND ONE MORE THING v1 COULD NOT SEE. "Painted" is not "on screen": the game's own cull keeps
 *   a body if it is within three cells OUTSIDE the canvas, which is correct for drawing and
 *   wrong for a question about what a man saw. So every body's landing point is recorded and
 *   counted against the visible rectangle, and the two numbers are printed side by side.
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
function pw() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(t); } catch (e) {}
  }
  throw new Error('playwright not found');
}
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* --cpu N throttles the main thread N times slower, the same way PLUMBER's perf gate does
   (Emulation.setCPUThrottlingRate). Default 4, because rule 14 says the measure is a PHONE and
   PLUMBER measured 4x as the phone-shaped setting. --cpu 1 gives the old, faster box. */
const NOOBSERVE = process.argv.includes('--noobserve');
const CPU = (() => {
  const i = process.argv.indexOf('--cpu');
  const n = i >= 0 ? Number(process.argv[i + 1]) : 4;
  return Number.isFinite(n) && n >= 1 ? n : 4;
})();
const BUDGET_MS = 5 * 60 * 1000;
/* his own bar, from the routing note: "a person is on screen within ten seconds of the door" */
const HIS_BAR_S = 10;
const FIGHT_WORDS = /\b(fight|fighting|combat|attack|attacks|hostile|enemy|enemies|swing|strike|brawl|jump(ed)? you|against you)\b/i;

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext(PHONE);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);

  /* THE YARDSTICK, TAKEN TWICE IN THIS RUN, BEFORE ANYTHING ELSE. A fixed busy loop timed
     with the throttle off and then on. If the ratio is not near the asked-for rate, the
     throttle did not apply and every number below is the fast box wearing a slow label. */
  const busy = () => page.evaluate(() => {
    const t0 = performance.now();
    let x = 0;
    for (let i = 0; i < 6e6; i++) x += Math.sqrt(i % 97);
    return { ms: +(performance.now() - t0).toFixed(2), x: x > 0 };
  });
  await page.setContent('<div>yardstick</div>');
  const fast = await busy();
  if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  const slow = await busy();
  const ratio = fast.ms > 0 ? +(slow.ms / fast.ms).toFixed(2) : 0;
  const out = { what: 'did he see a human being, and does anything say how a fight starts',
                when: new Date().toISOString(), his_words: [
                  "I didn't see a single human being. Very strange.",
                  "I don't even know how to engage in combat and when that shit starts."],
                controls: [], samples: [], fight_words_seen: [], why: null,
                cpu_throttle_asked: CPU,
                yardstick: { unthrottled_ms: fast.ms, throttled_ms: slow.ms, ratio: ratio } };
  out.controls.push({ name: 'C0 THE THROTTLE IS REAL: a fixed busy loop is ' + CPU
                        + 'x slower with it on, measured in this same run',
                      pass: CPU === 1 ? true : (ratio >= CPU * 0.6),
                      detail: CPU === 1 ? 'no throttle asked for, so these are this box\'s numbers'
                        : (fast.ms + ' ms unthrottled against ' + slow.ms + ' ms throttled = '
                           + ratio + 'x. Round 6 published its timeline at 1x and PLUMBER then '
                           + 'found the perf gate had been discarding its own phone pass since 9/5.') });

  /* ARMED BEFORE ANY PAGE SCRIPT RUNS, IN EVERY FRAME. A property trap on peoplePass takes
     hold the instant the world defines it, so there is no window in which the game is drawing
     people and nobody is counting. drawImage is wrapped on the prototype for the same reason:
     the canvas context does not exist yet either. */
  await page.addInitScript(() => {
    try {
      const W = window;
      W.__eyesPass = 0; W.__eyesBodies = 0; W.__eyesOutside = 0; W.__eyesPlant = 0;
      W.__eyesInPass = false; W.__eyesOnScreen = 0; W.__eyesOffScreen = 0;
      W.__eyesFirstDraw = null; W.__eyesFirstBody = null; W.__eyesFirstOnScreen = null;
      W.__eyesArmed = true;
      const proto = (W.CanvasRenderingContext2D || {}).prototype;
      if (proto && !proto.__eyesHooked) {
        const realDraw = proto.drawImage;
        proto.drawImage = function (img, a, b) {
          /* TIMESTAMPED FROM INSIDE, so my own first look is never the floor of the answer.
             v1 and v3 both reported "first body at the moment I first looked", which is not a
             fact about the game. The page records it itself now, at the instant it happens. */
          if (W.__eyesFirstDraw == null) W.__eyesFirstDraw = +performance.now().toFixed(0);
          if (W.__eyesInPass) {
            if (W.__eyesFirstBody == null) W.__eyesFirstBody = +performance.now().toFixed(0);
            W.__eyesBodies++;
            /* WHERE IT LANDED. The game's cull keeps a body up to three cells outside the
               canvas, so "painted" and "on screen" are different questions and his was the
               second one. */
            const cw = (this.canvas && this.canvas.width) || 0;
            const ch = (this.canvas && this.canvas.height) || 0;
            if (typeof a === 'number' && typeof b === 'number'
                && a > -1 && b > -1 && a < cw && b < ch) {
              if (W.__eyesFirstOnScreen == null) W.__eyesFirstOnScreen = +performance.now().toFixed(0);
              W.__eyesOnScreen++;
            } else W.__eyesOffScreen++;
          } else W.__eyesOutside++;
          return realDraw.apply(this, arguments);
        };
        proto.__eyesHooked = true;
      }
      /* THE HEARTBEAT. A timer that records every gap between its own ticks, armed before any
         page script runs. A gap is the main thread being held: nothing else can run, which is
         why nothing outside the page can read the first twenty seconds either. This is the
         instrument for his "not running as smoothly as I would like, maybe it's cause things
         are loading in real time". */
      W.__eyesGaps = [];
      W.__eyesLast = performance.now();
      W.__eyesBeat = setInterval(() => {
        const now = performance.now();
        const gap = now - W.__eyesLast;
        W.__eyesLast = now;
        if (gap > 120) W.__eyesGaps.push([+now.toFixed(0), +gap.toFixed(0)]);
      }, 50);
    } catch (e) {}
  });

  /* WRAPPED THE ONLY WAY THAT WORKS: after the world has declared the function. v2 proved a
     property trap cannot survive a global function declaration. The position hook on the
     context prototype IS armed from before the page ran, so once this lands, every body draw
     is placed as well as counted. */
  const wrap = () => page.evaluate(() => {
    const fr = document.getElementById('cityFrame');
    if (!fr || !fr.contentWindow) return { ok: false, why: 'no city frame yet' };
    const w = fr.contentWindow;
    if (typeof w.peoplePass !== 'function') return { ok: false, why: 'the world has not defined peoplePass yet' };
    if (w.__eyesWrapped) return { ok: true, why: 'already wrapped' };
    if (!w.__eyesArmed) return { ok: false, why: 'the position hook was not armed in this frame' };
    const real = w.peoplePass;
    w.peoplePass = function () {
      w.__eyesPass++;
      w.__eyesInPass = true;
      try { return real.apply(this, arguments); }
      finally {
        /* C2: one planted draw per pass, so a zero body count is told apart from a counter
           that is not counting. A 1x1 pixel off the corner, which also must land in the
           OFF-screen bucket, so it double-checks the position test. */
        try { const px = w.document.createElement('canvas'); px.width = px.height = 1;
              const cv = w.document.querySelector('canvas');
              const g = cv && cv.getContext('2d');
              if (g) { g.drawImage(px, -5, -5); w.__eyesPlant++; w.__eyesBodies--; w.__eyesOffScreen--; }
        } catch (e) {}
        w.__eyesInPass = false;
      }
    };
    w.__eyesWrapped = true;
    return { ok: true, why: 'wrapped once the world had declared it' };
  });

  const read = () => page.evaluate(() => {
    const fr = document.getElementById('cityFrame');
    const w = fr && fr.contentWindow;
    if (!w) return null;
    let near = -1;
    try { near = (w.pplNearList() || []).length; } catch (e) { near = -1; }
    const r = { pass: w.__eyesPass | 0, bodies: w.__eyesBodies | 0,
                on_screen: w.__eyesOnScreen | 0, off_screen: w.__eyesOffScreen | 0,
                outside: w.__eyesOutside | 0, plant: w.__eyesPlant | 0,
                engine_thinks_near: near };
    w.__eyesPass = 0; w.__eyesBodies = 0; w.__eyesOutside = 0; w.__eyesPlant = 0;
    w.__eyesOnScreen = 0; w.__eyesOffScreen = 0;
    return r;
  });

  /* ONLY WHAT A PLAYER COULD ACTUALLY READ (fixed 9/15, and the old version was wrong).
     The first cut read document.innerText, which includes text inside hidden dev panels, and
     it duly reported "something says FIGHT at 21.9 s". A hand check found 28 fight words in
     the demo and EVERY ONE OF THEM INVISIBLE -- zero size, display none, inside the sound
     factory and the fight's own dev controls. Reporting that as "the game says how a fight
     starts" would have answered his complaint with text he cannot see, which is the same
     mistake as calling a hidden control a button. So the sweep walks leaf elements and keeps
     only ones that are visible, sized, and inside the phone's viewport. */
  const words = () => page.evaluate(() => {
    let all = '';
    const take = (d) => {
      for (const e of d.querySelectorAll('*')) {
        if (e.children.length) continue;
        const tx = (e.innerText || e.textContent || '').trim();
        if (!tx) continue;
        const r = e.getBoundingClientRect();
        if (!(r.width > 0 && r.height > 0)) continue;
        const cs = d.defaultView.getComputedStyle(e);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.1) continue;
        if (r.bottom < 0 || r.top > 844 || r.right < 0 || r.left > 390) continue;
        all += ' ' + tx.replace(/\s+/g, ' ');
      }
    };
    take(document);
    for (const f of document.querySelectorAll('iframe')) {
      try { if (f.contentDocument) take(f.contentDocument); } catch (e) {}
    }
    return all.slice(0, 20000);
  }).catch(() => '');

  /* and the same sweep with the visibility test OFF, so the report can say how many fight
     words EXIST versus how many a player can read. A big gap is the finding. */
  const hiddenWordCount = () => page.evaluate(() => {
    const RE = /\b(fight|combat|attack|hostile|enemy|enemies|swing|strike|brawl)\b/i;
    let shown = 0, hidden = 0;
    const take = (d) => {
      for (const e of d.querySelectorAll('*')) {
        if (e.children.length) continue;
        const tx = (e.innerText || e.textContent || '').trim();
        if (!tx || !RE.test(tx)) continue;
        const r = e.getBoundingClientRect();
        const cs = d.defaultView.getComputedStyle(e);
        const vis = r.width > 0 && r.height > 0 && cs.display !== 'none'
                 && cs.visibility !== 'hidden' && +cs.opacity > 0.1
                 && r.bottom > 0 && r.top < 844 && r.right > 0 && r.left < 390;
        if (vis) shown++; else hidden++;
      }
    };
    take(document);
    for (const f of document.querySelectorAll('iframe')) {
      try { if (f.contentDocument) take(f.contentDocument); } catch (e) {}
    }
    return { shown, hidden };
  }).catch(() => ({ shown: -1, hidden: -1 }));

  try {
    await page.goto('file://' + path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html'),
      { waitUntil: 'domcontentloaded', timeout: 90000 });
    const t0 = await page.evaluate(() => performance.now());
    await sleep(2500);
    /* THE CLICK BLOCKS FOR ABOUT TWELVE SECONDS WHILE THE CITY BUILDS, and v1 waited for it
       before starting to look, which is how it came to report its own start-up time as the
       game's first-person time. So the click is fired and NOT awaited, and sampling starts
       immediately. */
    const clicking = page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); })
      .catch(() => {});
    let w0 = { ok: false, why: 'never tried' };
    for (let i = 0; i < 60 && !w0.ok; i++) { w0 = await wrap(); if (!w0.ok) await sleep(100); }
    out.controls.push({ name: 'C1 THE PEOPLE PASS IS THE THING BEING COUNTED',
                        pass: !!w0.ok, detail: w0.why });
    out.wrapped_at_s = +(((await page.evaluate(() => performance.now())) - t0) / 1000).toFixed(2);

    /* C4: a planted word must be found by the same sweep that will report no fight word */
    await page.evaluate(() => { const s = document.createElement('span');
      s.id = '__eyes_fw'; s.textContent = ' A HOSTILE IS NEAR '; document.body.appendChild(s); });
    await sleep(200);
    const plantedFound = FIGHT_WORDS.test(await words());
    await page.evaluate(() => { const e = document.getElementById('__eyes_fw'); if (e) e.remove(); });
    out.controls.push({ name: 'C4 THE WORD SWEEP IS NOT BLIND: a planted fight word is found',
                        pass: plantedFound,
                        detail: plantedFound ? 'found "A HOSTILE IS NEAR"'
                          : 'IT MISSED A PLANTED WORD, so "nothing says how a fight starts" would mean nothing' });

    /* WALK. He walks by HOLDING the dial, which round 3 of E26 learned the hard way, so the
       sampler holds it down between reads rather than standing still on the doorstep. */
    const hold = (ms) => page.evaluate(async (ms) => {
      const fr = document.getElementById('cityFrame');
      const d = (fr && fr.contentDocument) || document;
      const pads = [...d.querySelectorAll('*')].filter(e => /^(dpad|pad|walk|stick|nub)/i.test(e.id || ''));
      const t = pads[0]; if (!t) return false;
      const r = t.getBoundingClientRect();
      t.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true,
        clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 }));
      await new Promise(z => setTimeout(z, ms));
      t.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      return true;
    }, ms);

    let firstBodyAt = null, firstNearAt = null, walked = false;
    while (true) {
      const now = await page.evaluate(() => performance.now());
      const at = +((now - t0) / 1000).toFixed(1);
      if (now - t0 > BUDGET_MS) break;
      if (!NOOBSERVE) {
        const r = await read();
        if (r) {
          r.at_s = at;
          out.samples.push(r);
          if (firstBodyAt === null && r.bodies > 0) firstBodyAt = at;
          if (firstNearAt === null && r.engine_thinks_near > 0) firstNearAt = at;
        }
        const txt = await words();
        if (FIGHT_WORDS.test(txt)) {
          const m = txt.match(FIGHT_WORDS);
          if (m && !out.fight_words_seen.some(f => f.word === m[0]))
            out.fight_words_seen.push({ at_s: at, word: m[0] });
        }
      }
      /* stand still for the first stretch, because HIS complaint is about what he saw at the
         door, then walk, because a street that fills only when you move is a finding too */
      if (NOOBSERVE) { await sleep(4000); continue; }
      if (at > 20) { walked = await hold(2000) || walked; } else { await sleep(700); }
    }
    out.walked_the_dial = walked;
    await clicking;

    /* C2 and C3 are read off the samples, not asserted separately: the planted draw must be
       counted in every pass, and draws made outside the pass must be a big number that never
       lands in the body count. */
    const totPass = out.samples.reduce((a, s) => a + s.pass, 0);
    const totPlant = out.samples.reduce((a, s) => a + s.plant, 0);
    const totBodies = out.samples.reduce((a, s) => a + s.bodies, 0);
    const totOutside = out.samples.reduce((a, s) => a + s.outside, 0);
    out.controls.push({ name: 'C2 THE COUNTER COUNTS: a planted draw inside the pass is counted',
                        pass: NOOBSERVE ? true : (totPass > 0 && totPlant >= totPass),
                        detail: NOOBSERVE
                          ? 'NOT APPLICABLE: --noobserve turns the sampling loop off, so there are '
                            + 'no samples for this to read. The only numbers taken from a noobserve '
                            + 'run are the heartbeat and the inside timestamps, which do not need it.'
                          : totPlant + ' planted draws over ' + totPass + ' passes' });
    out.controls.push({ name: 'C3 NOT COUNTING THE WORLD: draws outside the people pass are not '
                          + 'attributed to people',
                        pass: NOOBSERVE ? true : totOutside > 0,
                        detail: NOOBSERVE ? 'NOT APPLICABLE with the sampling loop off'
                          : totOutside + ' draws happened outside the pass and none of them '
                            + 'are in the body count' });
    out.fight_words_in_the_page = await hiddenWordCount();
    out.recorded_inside = await page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const w = (fr && fr.contentWindow) || null;
      const ms = (v) => v == null ? null : +(v / 1000).toFixed(2);
      return { city_first_draw_of_anything_s: w ? ms(w.__eyesFirstDraw) : null,
               city_first_body_s: w ? ms(w.__eyesFirstBody) : null,
               city_first_body_on_screen_s: w ? ms(w.__eyesFirstOnScreen) : null,
               shell_first_draw_of_anything_s: ms(window.__eyesFirstDraw) };
    }).catch(() => null);

    out.blocking = await page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const w = (fr && fr.contentWindow) || window;
      const top = (window.__eyesGaps || []).slice();
      const inner = (w.__eyesGaps || []).slice();
      const worst = (a) => a.reduce((m, g) => Math.max(m, g[1]), 0);
      const sum = (a) => a.reduce((s, g) => s + g[1], 0);
      return { shell_gaps: top.length, shell_worst_ms: worst(top), shell_total_ms: sum(top),
               city_gaps: inner.length, city_worst_ms: worst(inner), city_total_ms: sum(inner),
               shell_first_five: top.slice(0, 5), city_first_five: inner.slice(0, 5) };
    }).catch(() => null);

    const firstLook = out.samples.length ? out.samples[0].at_s : null;
    /* C5 REWRITTEN, BECAUSE THE FIRST VERSION OF IT ASKED THE WRONG THING. It asked whether I
       looked inside his ten seconds, and the answer is permanently no: there is one main thread
       and the city build holds it, so no outside observer can look. What the control has to ask
       instead is whether the answer DEPENDS on when I looked. It does not any more: the page
       records the moment itself. */
    const ri = out.recorded_inside || {};
    out.controls.push({ name: 'C5 THE ANSWER DOES NOT DEPEND ON WHEN I LOOKED: the first-body '
                          + 'moment is timestamped inside the page, not at my first sample',
                        pass: NOOBSERVE
                          ? ri.city_first_body_s != null
                          : (ri.city_first_body_s != null && firstLook != null
                             && ri.city_first_body_s < firstLook),
                        detail: NOOBSERVE
                          ? ('page says the first body was drawn at ' + ri.city_first_body_s
                             + ' s, and there was no first look at all: this run never sampled. '
                             + 'That is the strongest form of this control.')
                          : ('page says the first body was drawn at ' + ri.city_first_body_s
                             + ' s; my first look was ' + firstLook + ' s. The two earlier versions '
                             + 'of this tool reported their own start-up as the game\'s number.') });
    out.controls.push({ name: 'C5b THE BLIND WINDOW IS STATED, NOT FILLED',
                        pass: !!(out.blocking && out.blocking.shell_worst_ms > 0),
                        detail: out.blocking ? ('worst single freeze ' + out.blocking.shell_worst_ms
                          + ' ms, ' + out.blocking.shell_total_ms + ' ms frozen in total over the walk')
                          : 'the heartbeat did not report, so the freeze is unmeasured' });
    out.numbers = {
      first_look_at_s: firstLook,
      first_body_painted_at_s_RECORDED_INSIDE: ri.city_first_body_s == null
        ? 'NEVER IN FIVE MINUTES' : ri.city_first_body_s,
      first_body_on_screen_at_s_RECORDED_INSIDE: ri.city_first_body_on_screen_s == null
        ? 'NEVER IN FIVE MINUTES' : ri.city_first_body_on_screen_s,
      the_city_first_drew_anything_at_s: ri.city_first_draw_of_anything_s,
      first_body_painted_at_my_first_look_s: firstBodyAt === null ? 'NEVER' : firstBodyAt,
      first_time_the_engine_had_somebody_near_s: firstNearAt === null ? 'NEVER' : firstNearAt,
      met_his_ten_second_bar: ri.city_first_body_on_screen_s != null
        && ri.city_first_body_on_screen_s <= HIS_BAR_S,
      samples: out.samples.length,
      samples_with_a_body_painted: out.samples.filter(s => s.bodies > 0).length,
      samples_where_the_engine_had_somebody_near: out.samples.filter(s => s.engine_thinks_near > 0).length,
      most_bodies_painted_in_one_sample: out.samples.reduce((m, s) => Math.max(m, s.bodies), 0),
      bodies_painted_INSIDE_the_screen_total: out.samples.reduce((a, s) => a + (s.on_screen || 0), 0),
      bodies_painted_OUTSIDE_the_screen_total: out.samples.reduce((a, s) => a + (s.off_screen || 0), 0),
      samples_with_a_body_inside_the_screen: out.samples.filter(s => (s.on_screen || 0) > 0).length,
      first_body_INSIDE_the_screen_at_s: (out.samples.find(s => (s.on_screen || 0) > 0) || {}).at_s
        || 'NEVER IN FIVE MINUTES',
      most_the_engine_had_near: out.samples.reduce((m, s) => Math.max(m, s.engine_thinks_near), 0),
      people_pass_ran: totPass,
      bodies_painted_total: totBodies,
      draws_outside_the_pass: totOutside,
      anything_VISIBLE_that_says_how_a_fight_starts: out.fight_words_seen.length
        ? out.fight_words_seen : 'NOTHING A PLAYER COULD READ, IN FIVE MINUTES',
      fight_words_that_exist_but_are_hidden: (out.fight_words_in_the_page || {}).hidden,
      fight_words_a_player_can_read: (out.fight_words_in_the_page || {}).shown,
      the_blind_window_s: firstLook === null ? 'the whole walk' : firstLook,
      why_the_blind_window: 'one main thread, held by the city build; nothing outside the page '
        + 'can read anything while it runs, and neither can the game draw a frame',
    };
  } catch (e) { out.why = String(e).slice(0, 400); }
  await b.close();
  fs.writeFileSync(path.join(ROOT, 'records', NOOBSERVE
    ? 'BOHEMIA_EYES_E26_A_HUMAN_BEING_NOOBSERVE_9_16_26.json'
    : 'BOHEMIA_EYES_E26_A_HUMAN_BEING_9_15_26.json'),
    JSON.stringify(out, null, 2));
  out.noobserve = NOOBSERVE;
  const bad = out.controls.filter(c => !c.pass).map(c => c.name);
  if (NOOBSERVE) console.log('  --noobserve: the sampling loop was OFF. This run exists only to '
    + 'say whether the freeze belongs to the game or to me.');
  if (out.blocking) console.log('  FROZEN: worst ' + out.blocking.shell_worst_ms + ' ms, '
    + out.blocking.shell_total_ms + ' ms of 300,000 total, over ' + out.blocking.shell_gaps
    + ' freezes, at ' + CPU + 'x (yardstick ' + (out.yardstick || {}).ratio + 'x)');
  console.log('  controls: ' + (bad.length ? 'FAILED -> ' + bad.join(' | ') : 'all green'));
  if (bad.length) console.log('  THE NUMBERS BELOW MEAN NOTHING UNTIL THE CONTROLS PASS.');
  for (const [k, v] of Object.entries(out.numbers || {}))
    console.log('    ' + k.padEnd(48) + ' ' + JSON.stringify(v));
  process.exit(0);
})();
