/* BOHEMIA -- WHICH CUT WAS CLOSEST TO BEING ABLE TO PLAY
 * EYES AND EARS, lane 17, E27 [best cut]. 9/20/26. Rule 18(d).
 *
 * PAOLO 9/20: "I just want to restart all of this, keep our assets and start all over. I really
 * need your help to not do that... we were closer to being able to play before, right now we're
 * farther than we've ever been." And: "there are some points in this development where we were
 * closer to being able to play."
 *
 * HE IS MAKING A CLAIM ABOUT THE PAST AND NOBODY HAS MEASURED IT. Rule 18(d) gives this lane the
 * job: rank the deployed cuts of the last two weeks by the same walk, name the best one, and name
 * where it got worse. RUN reverts to the good cut and re-applies his rulings on top. So this tool
 * has one job and it has to be identical for every cut, or the ranking is about the tool.
 *
 * WHAT IT SCORES, and every one comes from rule 18's own three things:
 *   LOADING  time to the first thing drawn; time until something is tappable; how many
 *            milliseconds of the window the main thread was FROZEN, and the worst single freeze.
 *   WALKING  hold the dial and measure how much of the world actually moved. A cut where the
 *            press does nothing is not playable however fast it loads.
 *   A BODY   when the first human body lands inside the screen.
 *
 * MEASURED ON A PHONE-SHAPED CPU, because rule 14 says the measure is a phone, with the throttle
 * PROVED REAL in every single run by a busy-loop yardstick (medians of five, warm-up discarded).
 * EYES round 9 found the one-sample version of that yardstick reading 3.20x, 3.65x and 2.13x for
 * the same 4x, so a single sample is not evidence.
 *
 * RULE ZERO. A ranking is the loudest thing this lane has ever published, so:
 *   C0 the throttle is real in THIS run, or the cut's numbers are thrown away, not published
 *   C1 the page actually booted -- a cut that fails to load is FAILED, never a fast zero
 *   C2 the walk probe can see movement at all: a planted canvas change must register
 *   C3 every cut gets the SAME budget, the same driver and the same throttle, and the tool
 *      records them per cut so a reader can check they did not drift
 *
 * WRONG VERSION TWO, KEPT, AND ITS OWN CONTROLS CAUGHT ALL OF IT ON THE FIRST TWO CUTS:
 *   - FROZEN TIME CAME OUT AT 186 SECONDS INSIDE A 90 SECOND WINDOW, which is impossible and so
 *     was obviously contamination: the heartbeat is armed before ANY page script, so it was also
 *     running during the ten busy-loop yardstick passes, and the shell's gaps were being added to
 *     the city frame's. The gaps are RESET the moment the cut is navigated to now, and the shell
 *     and the frame are reported separately instead of summed.
 *   - THE HELD PRESS MOVED 0.3% OF THE WORLD on both cuts, which is not a measurement of the
 *     game, it is a probe that never landed. Whether a walk dial was even FOUND is recorded now,
 *     so "the world did not move" can be told apart from "I never pressed anything".
 *   - TIME UNTIL SOMETHING IS TAPPABLE came back null every time: the poll ran for eight seconds
 *     against a thread frozen for thirty, so it was measuring my own patience. It is recorded
 *     from INSIDE the page now, the same fix round 6 needed for the first-body time.
 *   - AND C2 REFUSED A CUT, correctly: painting the canvas magenta registered 1.00 on one cut and
 *     0.0365 on another, which means the probe was sampling a different canvas there. That cut's
 *     numbers are not published rather than quietly ranked.
 *
 * WRONG VERSION THREE, AND C2 WAS BACKWARDS. The movement control painted the game's own canvas
 *   magenta and then re-sampled it. On a cut that is RUNNING, the game repaints within the
 *   sampling gap and erases the paint, so the control failed on the HEALTHY cuts and passed on the
 *   frozen ones. It was measuring "did the game repaint", which is the opposite of what a control
 *   is for. Split in two now: the comparator is proved on SYNTHETIC arrays where the answer is
 *   known, and the canvas being sampled is checked for being the real world canvas (present,
 *   sized, not blank). Neither can be erased by the thing under test.
 *   AND THE FROZEN TOTAL STILL RAN PAST THE WINDOW (95.3 s inside 90 s) because the heartbeat kept
 *   recording through the walk press and the probes that come after it. The gaps are SNAPSHOT at
 *   the moment the window closes now, before anything else is done to the page.
 *
 * WRONG VERSION ONE, KEPT: the first cut of this scored "time to first paint" only, and ranked a
 * cut that painted instantly and then froze for forty seconds above one that painted late and ran.
 * Fast to a picture is not close to playable. FROZEN TIME and DOES THE PRESS MOVE THE WORLD are
 * what his sentence is about, so they lead the score and first-paint is reported beside them.
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
const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };
const SURFACE = arg('--surface', null);
const LABEL = arg('--label', 'unlabelled');
const CPU = Number(arg('--cpu', 4));
const WINDOW_MS = Number(arg('--window', 90000));   /* the same for every cut, or it is not a ranking */

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext(PHONE);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  const out = { label: LABEL, surface: SURFACE, cpu: CPU, window_ms: WINDOW_MS,
                when: new Date().toISOString(), controls: [], ok: true };

  /* ---- ARMED BEFORE ANY PAGE SCRIPT RUNS, in every frame ---- */
  await page.addInitScript(() => {
    try {
      const W = window;
      W.__bcFirstDraw = null; W.__bcGaps = []; W.__bcLast = performance.now();
      W.__bcTappable = null;
      /* THE GAPS ONLY COUNT ONCE THE CUT IS ON SCREEN. This heartbeat is armed before any page
         script, which is the point, but that also means it runs during the yardstick's ten busy
         loops; v2 summed those into the frozen total and reported 186 s inside a 90 s window. */
      W.__bcArmedAt = null;
      W.__bcStart = () => { W.__bcGaps = []; W.__bcLast = performance.now();
                            W.__bcArmedAt = performance.now(); };
      const proto = (W.CanvasRenderingContext2D || {}).prototype;
      if (proto && !proto.__bcHooked) {
        const real = proto.drawImage;
        proto.drawImage = function () {
          if (W.__bcFirstDraw == null) W.__bcFirstDraw = +performance.now().toFixed(0);
          return real.apply(this, arguments);
        };
        proto.__bcHooked = true;
      }
      /* the heartbeat: a gap between its own ticks is the main thread being held, and nothing
         outside the page can see that window at all, which is why it is measured from inside */
      W.__bcBeat = setInterval(() => {
        const now = performance.now(), gap = now - W.__bcLast;
        W.__bcLast = now;
        if (gap > 120 && W.__bcArmedAt != null) W.__bcGaps.push(+gap.toFixed(0));
        /* TIME UNTIL SOMETHING IS TAPPABLE, RECORDED FROM INSIDE. Polling it from outside
           measured my own patience against a frozen thread and came back null every time. */
        if (W.__bcTappable == null) {
          try {
            const f = W.document.getElementById('front');
            if (f) { const r = f.getBoundingClientRect(), cs = W.getComputedStyle(f);
              if (r.height > 100 && cs.display !== 'none' && +cs.opacity > 0.5)
                W.__bcTappable = +performance.now().toFixed(0); }
          } catch (e) {}
        }
      }, 50);
    } catch (e) {}
  });

  /* ---- C0: THE THROTTLE, PROVED IN THIS RUN ---- */
  const busy = () => page.evaluate(() => {
    const t0 = performance.now(); let x = 0;
    for (let i = 0; i < 4e7; i++) x += Math.sqrt(i % 97);
    return { ms: +(performance.now() - t0).toFixed(2), x: x > 0 };
  });
  const med = a => { const s = a.slice().sort((p, q) => p - q);
    return +(s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2).toFixed(2); };
  await page.setContent('<div>yardstick</div>');
  const fastR = []; for (let i = 0; i < 5; i++) fastR.push((await busy()).ms);
  if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  const slowR = []; for (let i = 0; i < 5; i++) slowR.push((await busy()).ms);
  const ratio = +(med(slowR.slice(1)) / med(fastR.slice(1))).toFixed(2);
  out.yardstick = { unthrottled_ms: med(fastR.slice(1)), throttled_ms: med(slowR.slice(1)), ratio };
  out.controls.push({ name: 'C0 the throttle is real in this run', pass: CPU === 1 || ratio >= CPU * 0.7,
                      detail: ratio + 'x against ' + CPU + 'x asked' });

  try {
    const t0 = Date.now();
    await page.goto('file://' + SURFACE, { waitUntil: 'domcontentloaded', timeout: 180000 });
    /* the clock for every number below starts HERE, not at the yardstick */
    await page.evaluate(() => { if (window.__bcStart) window.__bcStart(); }).catch(() => {});
    await sleep(2500);
    /* the front screen, clicked the way the game's own splash expects. Not awaited: on a slow
       cut this blocks for a minute and awaiting it would measure my own patience. */
    const clicking = page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); })
      .catch(() => {});

    while (Date.now() - t0 < WINDOW_MS) await sleep(1000);
    /* THE WINDOW CLOSES HERE. Snapshot the gaps before the walk press and the probes, or their
       own stalls land in the frozen total and it runs past the window it claims to describe. */
    const snap = await page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const w = fr && fr.contentWindow;
      const sum = (a) => ({ freezes: a.length, frozen_ms: a.reduce((s, g) => s + g, 0),
                            worst_ms: a.reduce((m, g) => Math.max(m, g), 0) });
      return { first_draw_ms: (w && w.__bcFirstDraw) != null ? w.__bcFirstDraw : window.__bcFirstDraw,
               tappable_ms: window.__bcTappable,
               shell: sum(window.__bcGaps || []), frame: sum((w && w.__bcGaps) || []) };
    }).catch(() => ({}));
    await clicking;

    /* ---- WALKING: does a held press move the world ---- */
    const shot = () => page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const d = (fr && fr.contentDocument) || document;
      const c = d.querySelector('canvas');
      if (!c) return null;
      const s = document.createElement('canvas'); s.width = 48; s.height = 48;
      const g = s.getContext('2d');
      try { g.drawImage(c, 0, 0, 48, 48); } catch (e) { return null; }
      return Array.from(g.getImageData(0, 0, 48, 48).data);
    }).catch(() => null);
    const moved = (a, b) => {
      if (!a || !b) return null;
      let n = 0, t = 0;
      for (let i = 0; i < Math.min(a.length, b.length); i += 4) {
        t++; if (Math.abs(a[i] - b[i]) > 8 || Math.abs(a[i+1] - b[i+1]) > 8 || Math.abs(a[i+2] - b[i+2]) > 8) n++;
      }
      return t ? +(n / t).toFixed(4) : null;
    };
    const before = await shot();
    /* WHETHER A DIAL WAS EVEN FOUND IS PART OF THE ANSWER. v2 reported 0.3% of the world moving
       on two different cuts, which is not a fact about the game if nothing was ever pressed. */
    out.walk_dial = await page.evaluate(async () => {
      const fr = document.getElementById('cityFrame');
      const d = (fr && fr.contentDocument) || document;
      const pads = [...d.querySelectorAll('*')].filter(e => /^(dpad|pad|walk|stick|nub)/i.test(e.id || ''));
      const t = pads[0];
      if (!t) return { found: false, ids: [...d.querySelectorAll('[id]')].slice(0, 12).map(e => e.id) };
      const r = t.getBoundingClientRect();
      t.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true,
        clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 }));
      await new Promise(z => setTimeout(z, 4000));
      t.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      return { found: true, id: t.id, w: Math.round(r.width), h: Math.round(r.height),
               arrows: pads.length };
    }).catch(() => ({ found: false, why: 'the press threw' }));
    await sleep(600);
    const after = await shot();
    out.world_moved_on_a_held_press = moved(before, after);

    /* C2a THE COMPARATOR, PROVED ON DATA WHOSE ANSWER IS KNOWN, so the thing under test cannot
       erase the control. Two identical arrays must read 0 and two opposite ones must read 1. */
    const same = new Array(48 * 48 * 4).fill(10);
    const diff = new Array(48 * 48 * 4).fill(250);
    const cSame = moved(same, same.slice()), cDiff = moved(same, diff);
    out.controls.push({ name: 'C2a the comparator reads 0 for no change and 1 for a total change',
                        pass: cSame === 0 && cDiff === 1,
                        detail: 'identical ' + cSame + ', opposite ' + cDiff });
    /* C2b AND THE CANVAS BEING SAMPLED IS THE WORLD, not a blank or a stray one. */
    const cv = await page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const d = (fr && fr.contentDocument) || document;
      const c = d.querySelector('canvas');
      if (!c) return { found: false };
      const r = c.getBoundingClientRect();
      return { found: true, w: c.width, h: c.height, onScreenW: Math.round(r.width),
               onScreenH: Math.round(r.height) };
    }).catch(() => ({ found: false }));
    const notBlank = before && (() => { const f = before[0], g = before[1], b = before[2];
      for (let i = 4; i < before.length; i += 4)
        if (Math.abs(before[i] - f) > 8 || Math.abs(before[i+1] - g) > 8 || Math.abs(before[i+2] - b) > 8) return true;
      return false; })();
    out.canvas = cv;
    out.controls.push({ name: 'C2b the canvas being sampled is the world, sized and not blank',
                        pass: !!(cv.found && cv.onScreenW > 100 && notBlank),
                        detail: cv.found ? (cv.w + 'x' + cv.h + ' backing, ' + cv.onScreenW + 'x'
                          + cv.onScreenH + ' on screen, ' + (notBlank ? 'not blank' : 'BLANK'))
                          : 'no canvas found at all' });

    /* SHELL AND FRAME ARE NOT ADDED TOGETHER. They are two threads' worth of the same stall and
       summing them is how v2 got 186 s inside a 90 s window. The score uses the SHELL, because
       the shell is the page he is holding; the frame is reported beside it. */
    const inside = snap;
    out.first_draw_s = inside.first_draw_ms != null ? +(inside.first_draw_ms / 1000).toFixed(2) : null;
    out.tappable_s = inside.tappable_ms != null ? +(inside.tappable_ms / 1000).toFixed(2) : null;
    out.freezes = inside.shell ? inside.shell.freezes : null;
    out.frozen_ms = inside.shell ? inside.shell.frozen_ms : null;
    out.worst_freeze_ms = inside.shell ? inside.shell.worst_ms : null;
    out.frame_frozen_ms = inside.frame ? inside.frame.frozen_ms : null;
    out.frozen_share = (inside.shell && inside.shell.frozen_ms != null)
      ? +(inside.shell.frozen_ms / WINDOW_MS).toFixed(3) : null;
    out.controls.push({ name: 'C4 the frozen total fits inside the window',
                        pass: out.frozen_ms != null && out.frozen_ms <= WINDOW_MS,
                        detail: out.frozen_ms + ' ms of a ' + WINDOW_MS + ' ms window. v2 reported '
                          + '186,650 ms inside 90,000 because it counted the yardstick and summed '
                          + 'two threads.' });
    out.controls.push({ name: 'C5 a walk dial was found and pressed',
                        pass: !!(out.walk_dial && out.walk_dial.found),
                        detail: out.walk_dial && out.walk_dial.found
                          ? ('pressed #' + out.walk_dial.id + ', ' + out.walk_dial.arrows + ' arrows')
                          : 'NO DIAL FOUND, so "the world did not move" says nothing about this cut' });
    out.controls.push({ name: 'C1 the cut booted', pass: out.first_draw_s != null,
                        detail: out.first_draw_s != null ? 'drew at ' + out.first_draw_s + ' s'
                          : 'NOTHING WAS EVER DRAWN -- this cut is FAILED, not fast' });
  } catch (e) { out.ok = false; out.why = String(e).slice(0, 300); }
  await b.close();
  const bad = out.controls.filter(c => !c.pass).map(c => c.name);
  out.failing_controls = bad;
  out.trustworthy = bad.length === 0 && out.ok;
  console.log(JSON.stringify(out));
  process.exit(0);
})();
