/* BOHEMIA -- EYES AND EARS, E26 [five minutes] round two: THE WALK.
 *
 * THE LAW: laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md (Paolo 9/13, LOCKED).
 * "The demo's first five minutes on a phone, played by a stranger, is the measure of the
 *  game. Not the gate count, not the commit count, not the module count."
 *
 * THE SHEET THIS FILLS IN was written last round and is not improvised here:
 * banks/eyes/BOHEMIA_EYES_E26_STRANGERS_SHEET_9_13_26.json
 * records/BOHEMIA_EYES_E26_ROUND_1_SCHOOL_THE_WATCHER_WRITES_WHAT_A_CAMERA_WOULD_9_13_26.md
 *
 * THE ONE RULE IT OBEYS, from the observation literature: NOTE WHAT YOU OBSERVE, NOT WHAT
 * YOU INTERPRET. Every line it writes is what a camera would have recorded -- a timestamp,
 * a tap, and what changed on the screen. It never writes "confusing" or "bad", and it
 * never scores anything. Taste is DIRECTION's.
 *
 * THE TAP SCRIPT IS FIXED IN ADVANCE, for a reason the literature names: here the watcher
 * and the player are the same process, and a walk that picks its own route while walking
 * drifts toward the parts that work.
 *
 * DEAD AFFORDANCE IS THE ONE THING COUNTED. A false affordance -- a thing that looks
 * tappable and does nothing, or promises a thing that does not happen -- erodes trust in
 * EVERY other promise on the screen, which is the mechanism behind "nothing's complete"
 * arriving from one dead card. Detected here as: a real driven tap on a real control,
 * followed by no change in the visible text of the page AND no change in the drawn pixels,
 * for 1.2 seconds.
 *
 * CONTROLS (RULE ZERO, E9), all must pass or the list is not trustworthy:
 *   COLD START   no SAVE or PROGRESS key may be in storage at first paint, or the run is
 *                void and restarted: a warm save is not the five minutes anybody else gets.
 *                (Written first as "storage must be empty", which failed on two keys the game
 *                writes itself while booting -- a look preference and a sound volume. A control
 *                that fails on the game saving its own default volume is not measuring what it
 *                claims. Corrected 9/22; the full note is at the control.)
 *   ERROR CATCH  a deliberately raised page error must be captured, or a report of zero
 *                errors means nothing.
 *   CHANGE PROBE a deliberately mutated pixel must register as a change, or "nothing
 *                happened" is unfalsifiable and every control reads dead.
 *   CLOCK        the stopwatch is the page's own performance.now(), not wall time.
 */
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
/* WHICH SURFACE. The demo is the only measure he named, so it is the default. But once
   other lanes started shipping fixes to the ALPHA while the demo stayed one cut behind,
   the walk had to be able to answer two different questions: DID THE FIX WORK (alpha) and
   DID IT REACH HIM (demo). Same instrument, one argument. */
/* AND A THIRD SURFACE, ADDED 9/15, BECAUSE THE FIRST TWO WERE BOTH THE WRONG FILE.
   UI corrected its own claim (5bed08dd) and the deploy workflow confirms it: since 8/26
   .github/workflows/pages.yml runs tools/bohemia_cut_the_demo.js AS A BUILD STEP, so THE DEMO
   AT THE ONE LINK IS RE-CUT FROM THE ALPHA ON EVERY PUSH. What he taps is the alpha's tip,
   always. The only thing that can be stale is the COMMITTED slices/BOHEMIA_DEMO.html on disk,
   and that committed file is exactly what every stranger-list walk of mine has been opening.
   MEASURED HERE RATHER THAN TAKEN ON TRUST (rule 12): the cutter run in an isolated worktree
   produced BUILD 9/15o, matching the alpha, while the committed file said BUILD 9/15m.
   So "deploy" is the surface he plays, and it is what the list must be walked on from now.
   Usage: node tools/bohemia_eyes_five_minutes.js [demo|alpha|deploy] [path] */
const WHICH = ['alpha', 'deploy'].includes(process.argv[2]) ? process.argv[2] : 'demo';
const FILE = WHICH === 'alpha' ? 'BOHEMIA_ALPHA_0_9.html' : 'BOHEMIA_DEMO.html';
/* a deploy walk needs the cut, which lives outside the repo so nothing of RUN's is touched */
const SURFACE = process.argv[3] || path.join(ROOT, 'slices', FILE);
const OUT = path.join(ROOT, 'records', 'BOHEMIA_EYES_E26_WALK_' + WHICH.toUpperCase() + '_9_14_26.json');
const SHOTS = path.join(ROOT, 'records', 'eyes_e26_walk_' + WHICH);

function pw() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(t); } catch (e) {}
  }
  throw new Error('playwright not found');
}
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
                isMobile: true, hasTouch: true };
const BUDGET_MS = 5 * 60 * 1000;

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* THE FILES THE PAGE ACTUALLY FETCHES, off E11's browser-measured census rather than a grep of
   src= (which misses what script writes at runtime). Used only to tell "my route cannot reach
   it" apart from "it is not in the game any more". */
const SOURCE = (() => {
  try {
    const list = JSON.parse(fs.readFileSync(path.join(ROOT, 'records',
      'BOHEMIA_EYES_BUNDLE_9_6_26.json'), 'utf8')).bundle || [];
    return list.filter(f => /\.html$/.test(f)).map(f => {
      try { return { file: f, text: fs.readFileSync(path.join(ROOT, f), 'utf8') }; }
      catch (e) { return { file: f, text: '' }; }
    });
  } catch (e) { return []; }
})();

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext(PHONE);          /* fresh context = no stored save */
  const page = await ctx.newPage();

  const out = { ok: true, which: WHICH, file: FILE, surface: SURFACE, when: new Date().toISOString(),
                law: 'THE FIVE MINUTES (Paolo 9/13)',
                lines: [], errors: [], controls: [], numbers: {}, dead: [], inert: [],
                /* 9/14: a zero in dead[] used to be unreadable, because it meant EITHER
                   nothing was dead OR the route never pressed the thing. pressed[] is the
                   denominator that makes the zero mean something. null_windows[] is what the
                   world did with nobody touching it, which is the only reason a verdict here
                   can be attributed to a finger at all. */
                pressed: [], null_windows: [], named: [], undecided: [],
                alive_on_one_press_only: [], closed_on_tap: [] };
  const err = [];
  page.on('pageerror', e => err.push({ t: null, kind: 'pageerror', msg: String(e.message).slice(0, 220) }));
  page.on('console', m => { if (m.type() === 'error') err.push({ kind: 'console', msg: m.text().slice(0, 220) }); });
  /* A PRESS CAN ANSWER SOMEWHERE THAT IS NOT THE SCREEN, AND THIS WALK USED TO CALL THAT DEAD.
     Measured on the stripped cut: COPY ALL and EXPORT in the NOTES panel both read 'did
     nothing' twice. COPY ALL's handler HAD run -- the browser logged 'clipboard-write is not
     allowed in this document' once per press, which is this harness refusing it, not the game
     failing. EXPORT hands the browser a file, and a download changes no pixels at all. Both
     are counted now, and a press that produces either is ALIVE and says which. */
  const dl = [];
  page.on('download', d => dl.push({ when: Date.now(), name: (d.suggestedFilename && d.suggestedFilename()) || 'a file' }));
  /* THE FULL URL, NOT THE FILENAME. The first run recorded only the last path segment and
     logged a failed "css2?family=VT323&family=Space+Grotesk..." with no way to tell WHERE it
     was asked for -- and Space Grotesk is a font the 9/11 law bans by name, so a claim about
     it that cannot be sourced is a claim this lane may not make. */
  page.on('requestfailed', r => err.push({ kind: 'requestfailed', msg: r.url().slice(0, 300),
    from: (r.frame() && r.frame().url() || '').slice(-60),
    why: (r.failure() && r.failure().errorText) || '' }));

  fs.mkdirSync(SHOTS, { recursive: true });
  let shot = 0;
  const snap = async (tag) => {
    const p = path.join(SHOTS, String(shot++).padStart(2, '0') + '_' + tag + '.png');
    try { await page.screenshot({ path: p }); } catch (e) {}
    return path.relative(ROOT, p);
  };

  /* WHAT THE SCREEN IS, as two signatures a camera could take: the visible words, and the
     drawn pixels of every canvas.
     9/14, AND THIS IS THE FIX THAT MATTERED MOST: these used to be compared with !==, so ANY
     movement counted as "the tap did something". The world has a CLOCK in its own words
     ("DAY 1 - 06:02") and a canvas that keeps drawing, so on this game a dead button reads
     alive whenever the clock ticks inside the 1.2 s window. Equality cannot separate the tap
     from the world. So the signature now carries the words as a LIST and the canvases as raw
     bytes, and a verdict is a DISTANCE compared against a NULL WINDOW measured with no
     input at all. */
  const sig = () => page.evaluate(() => {
    const txt = (document.body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 4000);
    /* A SINGLE ICON GLYPH IS NOT A WORD, AND IT FLICKERS (measured 9/14). The self-movement
       probe's own control failed on ONE character, a gear, appearing and vanishing between two
       reads taken with no time in between. innerText reflects what is rendered, so a glyph
       mid-paint can be there and then not. It is dropped by SHAPE -- one character, no letter
       and no digit in it -- never by a list of specific glyphs, because a list would go stale
       the first time a new icon shipped. */
    const realWord = (w) => !(w.length === 1 && !/[a-z0-9]/i.test(w));
    const words = txt.split(' ').filter(w => w && realWord(w));
    let pix = '';
    const bytes = [];
    const grab = (c) => {
      try {
        const s = document.createElement('canvas'); s.width = 24; s.height = 24;
        const g = s.getContext('2d'); g.drawImage(c, 0, 0, 24, 24);
        pix += s.toDataURL().slice(-160);
        const d = g.getImageData(0, 0, 24, 24).data;
        const a = []; for (let i = 0; i < d.length; i += 4) a.push(d[i], d[i + 1], d[i + 2]);
        bytes.push(a);
      } catch (e) { pix += 'x'; bytes.push([]); }
    };
    for (const c of document.querySelectorAll('canvas')) grab(c);
    /* frames draw the world; ask them too */
    for (const f of document.querySelectorAll('iframe')) {
      try {
        const d = f.contentDocument;
        if (!d) continue;
        const ftxt = (d.body.innerText || '').replace(/\s+/g, ' ').slice(0, 500);
        pix += ftxt;
        for (const w of ftxt.split(' ')) if (w && realWord(w)) words.push(w);
        for (const c of d.querySelectorAll('canvas')) grab(c);
      } catch (e) {}
    }
    return { txt, pix, words, bytes, now: performance.now() };
  }).catch(() => ({ txt: '', pix: '', words: [], bytes: [], now: 0 }));

  /* HOW FAR APART TWO SCREENS ARE. Words as a set difference (so the clock ticking is ONE
     word, not a whole new screen) and canvases as the fraction of the 24x24 samples whose
     colour moved by more than 8 of 255, which is the same ruler the held-press control used
     when it measured 93.9% of the world moving. */
  /* A SET WAS THE WRONG SHAPE AND IT MADE THE LIVE CONTROL FAIL (measured 9/14). The planted
     live button appends the SAME word every press. Against a set of words, the second press is
     invisible -- the word was already there -- so a button that demonstrably works read
     UNDECIDED. Words are COUNTED now, so a repeat is a change. */
  const counts = (ws) => { const m = new Map(); for (const w of ws || []) m.set(w, (m.get(w) || 0) + 1); return m; };
  const dist = (a, b) => {
    const A = counts(a.words), B = counts(b.words);
    const which = [];
    for (const [w, n] of A) if ((B.get(w) || 0) !== n) which.push(w);
    for (const [w, n] of B) if ((A.get(w) || 0) !== n) if (!A.has(w)) which.push(w);
    const ab = a.bytes || [], bb = b.bytes || [];
    let moved = 0, total = 0;
    const cells = [];
    for (let i = 0; i < Math.min(ab.length, bb.length); i++) {
      const x = ab[i] || [], y = bb[i] || [];
      for (let j = 0; j < Math.min(x.length, y.length); j += 3) {
        total++;
        if (Math.abs(x[j] - y[j]) > 8 || Math.abs(x[j + 1] - y[j + 1]) > 8 ||
            Math.abs(x[j + 2] - y[j + 2]) > 8) { moved++; cells.push(i + ':' + j); }
      }
    }
    return { word_moves: which.length, words_that_moved: which.slice(0, 40),
             pixel_fraction: total ? +(moved / total).toFixed(4) : 0,
             cells_that_moved: cells };
  };

  /* THE NOISE LEDGER, AND IT IS THE FIX THAT THE CONTROLS FORCED (9/14).
     A margin over the last null window was not enough: the world's own writing is BURSTY and a
     burst is longer than one 1.2 s window, so it straddles the null window and the watch window
     unevenly and the difference reads as a finger. Two planted controls failed in OPPOSITE
     directions and proved it.
     So the tool now keeps a ledger of everything the screen has EVER been seen doing with
     nobody touching it: every word whose count moved in a null window, and every pixel sample
     that moved in one. A tap counts only if it moves something that has NEVER moved on its own.
     That is evidence accumulated across the whole run instead of a threshold guessed once. */
  const noiseWords = new Set(), noiseCells = new Set();
  const learn = (d) => { for (const w of d.words_that_moved) noiseWords.add(w);
                         for (const c of d.cells_that_moved) noiseCells.add(c); };
  const novel = (d) => ({
    words: d.words_that_moved.filter(w => !noiseWords.has(w)),
    cells: d.cells_that_moved.filter(c => !noiseCells.has(c)).length });

  let t0 = 0;
  const stamp = (now) => {
    const ms = Math.max(0, now - t0);
    const s = Math.round(ms / 1000);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  };
  const line = (now, did, happened, promised) => {
    out.lines.push({ at: stamp(now), did, happened, promised: promised || '' });
  };

  try {
    await page.goto('file://' + SURFACE, { waitUntil: 'domcontentloaded', timeout: 90000 });
    const first = await page.evaluate(() => performance.now());
    t0 = first;

    /* CONTROL: COLD START. Nothing stored at first paint, or this is not a first run. */
    const stored = await page.evaluate(() => {
      try { return { n: localStorage.length, keys: Object.keys(localStorage).slice(0, 8) }; }
      catch (e) { return { n: -1, keys: [] }; }
    });
    /* WHAT THIS CONTROL IS ACTUALLY FOR (corrected 9/22). It exists to prove the walk is a
       FIRST-TIME experience -- that no earlier play is being read back. It was written as
       "storage is literally empty", and on BUILD 9/23a it failed on two keys the game writes
       ITSELF during boot: bohemia:look and bohemia_sfxvol, a look preference and a sound volume.
       Fresh context, so nobody's prior play is in them; they are defaults being persisted. A
       control that fails on the game saving its own default volume is not measuring what it
       claims, so it now asks the real question: is any SAVE or PROGRESS key present. Emptiness
       is reported beside it so a reader can see what the game wrote. */
    const progressKeys = (stored.keys || []).filter(k => /save|prog|day|world|city|state|player/i.test(k));
    out.controls.push({ name: 'COLD START: no earlier play is being read back',
                        pass: progressKeys.length === 0,
                        detail: stored.n + ' keys at first paint ' + JSON.stringify(stored.keys)
                          + (progressKeys.length ? ' -- AND ' + JSON.stringify(progressKeys)
                             + ' look like carried progress, so this is not a first run'
                             : ' -- none of them carry progress, so this is a first run') });

    /* CONTROL: ERROR CATCH. */
    await page.evaluate(() => { setTimeout(() => { throw new Error('__eyes_planted_error__'); }, 0); });
    await sleep(250);
    out.controls.push({ name: 'ERROR CATCH: a planted page error is captured',
                        pass: err.some(e => /__eyes_planted_error__/.test(e.msg)),
                        detail: err.length + ' errors seen so far' });

    /* CONTROL: CHANGE PROBE. */
    const beforeProbe = await sig();
    await page.evaluate(() => {
      const d = document.createElement('div'); d.id = '__eyes_probe';
      d.textContent = '__EYES_CHANGE_PROBE__'; document.body.appendChild(d);
    });
    await sleep(150);
    const afterProbe = await sig();
    await page.evaluate(() => { const d = document.getElementById('__eyes_probe'); if (d) d.remove(); });
    out.controls.push({ name: 'CHANGE PROBE: a deliberate change registers as a change',
                        pass: afterProbe.txt !== beforeProbe.txt, detail: 'text signature moved' });

    /* ---- 00:00 THE FRONT DOOR ------------------------------------------- */
    await sleep(2200);
    let s = await sig();
    const splashWords = await page.evaluate(() => {
      const f = document.getElementById('front');
      return f ? (f.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200) : null;
    });
    out.lines.push({ at: stamp(s.now), did: 'opened the link and waited',
      happened: splashWords ? ('a front screen: "' + splashWords + '"') : 'no front screen element',
      promised: 'TAP TO ENTER' });
    out.shots = [await snap('00_splash')];

    /* TIME TO FIRST INPUT, MEASURED HONESTLY. The first cut recorded the moment the script
       chose to tap, which measures the script and not the game. What a stranger waits for is
       the moment the first tappable thing is ON SCREEN. */
    const readyAt = await page.evaluate(() => {
      const f = document.getElementById('front');
      if (!f) return null;
      const r = f.getBoundingClientRect();
      const cs = getComputedStyle(f);
      return (r.height > 100 && cs.display !== 'none' && +cs.opacity > 0.5) ? performance.now() : null;
    });
    out.numbers.time_until_something_is_tappable_s = readyAt == null ? 'never' : +((readyAt - t0) / 1000).toFixed(2);
    let before = await sig();
    /* THE DOOR IS TAPPED WITH A FINGER NOW, AND THE DOOR IS A CONTROL (added 9/22 off E20's
       retraction). A scripted click inside the boot freeze can be LOST: measured on one cut,
       a scripted click at 2.5 s left the splash up and the game never started, while a real
       touch at the same moment got in, because the browser queues a trusted event until the
       main thread frees up. This walk taps at ~31 s so it was safe by timing, not by design,
       and "safe by accident" is how a whole round gets measured on a door that never opened. */
    /* *** ONE TAP AT ONE MOMENT IS A COIN TOSS ON THIS LOADING SCREEN (9/23). *** The screen is
       up in about a second and the load runs behind it for a long time, and the door handler
       REFUSES every tap until the game is in, which is rule 18a working. This walk measured the
       splash looking ready at 7.6 s on one cut, tapped then, was refused, and spent five minutes
       photographing a title screen; the door control caught it and the round was thrown away.
       So: KNOCK UNTIL IT ANSWERS, up to a budget, and record how many knocks it took -- which is
       also a number worth having, because it is how long a stranger stares at a loading screen.
       RUN made the same fix in their driver the same round, independently. */
    const knockAt = async () => page.evaluate(() => {
      const f = document.getElementById('front');
      if (!f) return { gone: true };
      const r = f.getBoundingClientRect(); const cs = getComputedStyle(f);
      const shown = r.width > 0 && r.height > 0 && cs.display !== 'none'
                    && cs.visibility !== 'hidden' && +cs.opacity > 0.1;
      return { gone: !shown, x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }).catch(() => ({ gone: true }));
    let knocks = 0;
    for (let i = 0; i < 12; i++) {
      const st = await knockAt();
      if (st.gone) break;
      await page.touchscreen.tap(st.x, st.y);
      knocks++;
      await sleep(i === 0 ? 3500 : 9000);
    }
    out.numbers.knocks_before_the_door_opened = knocks;
    const tIn = await page.evaluate(() => performance.now());
    out.numbers.my_first_tap_at_s = +((tIn - t0) / 1000).toFixed(2);
    await sleep(3500);
    let after = await sig();
    line(after.now, 'tapped the front screen',
         after.txt !== before.txt || after.pix !== before.pix ? 'the screen changed' : 'NOTHING CHANGED',
         'that tapping enters the game');
    out.shots.push(await snap('01_entered'));
    /* CONTROL: THE DOOR OPENED. Everything after this line is a claim about the game, so if the
       splash is still on the screen none of it is. */
    const doorAfter = await page.evaluate(() => {
      const f = document.getElementById('front');
      const shown = (() => { if (!f) return false; const r = f.getBoundingClientRect();
        const cs = getComputedStyle(f);
        return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'
               && +cs.opacity > 0.1; })();
      let hud = null;
      for (const fr of document.querySelectorAll('iframe')) {
        try { const d = fr.contentDocument; if (!d) continue;
              const b = d.getElementById('musbtn');
              if (b) { hud = (b.textContent || '').trim().slice(0, 40); break; } } catch (e) {}
      }
      return { shown, hud };
    });
    out.controls.push({ name: 'THE DOOR OPENED: the splash is gone and the game\u2019s HUD is there',
                        pass: doorAfter.shown === false && !!doorAfter.hud,
                        detail: 'splash still shown: ' + JSON.stringify(doorAfter.shown)
                          + ', HUD music chip: ' + JSON.stringify(doorAfter.hud)
                          + (doorAfter.shown === false && doorAfter.hud ? ' -- this walk is in the game'
                             : ' -- THIS WALK NEVER ENTERED THE GAME, so nothing below is about the game') });

    /* ---- WHAT IS ON THE FIRST SCREEN, as a camera would list it --------- */
    const controls = await page.evaluate(() => {
      const seen = [];
      const walk = (doc, where) => {
        const els = doc.querySelectorAll('div,button,span,a');
        for (const e of els) {
          const r = e.getBoundingClientRect();
          if (r.width < 18 || r.height < 12) continue;
          if (r.top > 844 || r.bottom < 0 || r.left > 390 || r.right < 0) continue;
          const cs = doc.defaultView.getComputedStyle(e);
          if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
          const txt = (e.innerText || '').replace(/\s+/g, ' ').trim();
          if (!txt || txt.length > 40) continue;
          /* *** "LEAVES ONLY" HID THE ONE BUTTON THE DEMO HAS LEFT (9/24). *** On the stripped
             cut this inventory reported ONE thing on the whole first screen, the gear, while the
             photograph of the same moment shows the NOTES button too. Measured rather than
             guessed: NOTES is a 44x44 wrapper whose visible label is a 29x15 child with
             pointer-events:none. The leaf carries the word and cannot be pressed; the parent
             takes the press and is not a leaf, so BOTH were dropped and a real control vanished
             from the count I publish. Same family as the round-11 hole where the HUD chips were
             never pressed.
             THE RULE IS NOW "THE INNERMOST THING THAT CAN BE PRESSED": an element is a candidate
             when nothing inside it is also a candidate. A label with pointer-events:none is not
             a candidate, so its parent survives, which is exactly the NOTES shape. */
          const inner = [...e.querySelectorAll('div,button,span,a')].some((k) => {
            const kr = k.getBoundingClientRect();
            if (kr.width < 18 || kr.height < 12) return false;
            const kc = doc.defaultView.getComputedStyle(k);
            if (kc.display === 'none' || kc.visibility === 'hidden' || +kc.opacity < 0.05) return false;
            if (kc.pointerEvents === 'none') return false;
            const kt = (k.innerText || '').replace(/\s+/g, ' ').trim();
            return !!kt && kt.length <= 40;
          });
          if (inner) continue;                       /* something inside it is the real target */
          /* TWO DIFFERENT QUESTIONS, AND THE SECOND FIX WAS AS WRONG AS THE FIRST.
             v1 accepted anything not pointer-events:none and called the teaching overlay's
             CAPTIONS dead buttons -- a false accusation, the one thing this lane must never
             produce. v2 demanded cursor:pointer, and the inventory fell from 22 things to 3,
             because CURSOR:POINTER IS A DESKTOP SIGNAL AND THIS IS A PHONE. There is no
             cursor on a phone. A stranger's thumb goes for anything that reads as a choice.
             So: the inventory stays LOOSE (what a thumb would try), and a DEAD AFFORDANCE
             claim must carry the reason it looked tappable, recorded per item below. */
          if (cs.pointerEvents === 'none') continue;
          const why = cs.cursor === 'pointer' ? 'pointer cursor'
                    : (e.tagName === 'BUTTON' || e.tagName === 'A') ? 'a button or link'
                    : e.hasAttribute('onclick') ? 'a click handler in the markup'
                    : e.getAttribute('role') === 'button' ? 'role=button'
                    /* A HEADING INSIDE THE CARD IS NOT A ROW A THUMB WOULD TRY (9/18).
                       This rule counted ANY text inside the day card as claiming to be tappable,
                       and this round it was about to publish four READOUTS as dead controls:
                       'ON THE ROAD - SUBURB - DAY' at 277x14, the encounter's own title at
                       320x17, 'THAT COST' at 55x14 and '15 min' at 34x17. The card's REAL rows
                       are 320x44. So height decides, and the number is not invented: 44 px is
                       the published minimum touch target and it is exactly what the card's own
                       rows use. Below 30 px inside a card it is text, and text goes to the inert
                       list with its reason, never to the dead list. */
                    : (e.closest('#daycard, .daycard, #offers, .offer') && r.height >= 30)
                        ? 'a row inside the day card'
                    /* A SENTENCE IS NOT A CHIP (9/21). This rule called #note -- the status
                       line reading "walking your own block." -- a chip in the top bar, and it
                       became the only "dead control" in a walk that pressed two things. Same
                       class as the day-card readouts fixed last round, reached through a
                       different reason string. A chip is a LABEL: a few words, no sentence
                       ending. Prose is a sentence and belongs in the inert list with its reason. */
                    : (e.closest('#topbar, #devtray, #blstack')
                       && !(/[.!?]$/.test(txt) && txt.split(/\s+/).length > 3))
                        ? 'a chip in the top bar'
                    : '';
          seen.push({ where, id: e.id || '', text: txt, looks_tappable_because: why,
                      w: +r.width.toFixed(0), h: +r.height.toFixed(0),
                      x: +(r.left + r.width / 2).toFixed(0), y: +(r.top + r.height / 2).toFixed(0) });
        }
      };
      walk(document, 'shell');
      for (const f of document.querySelectorAll('iframe')) {
        try { if (f.contentDocument) walk(f.contentDocument, 'frame'); } catch (e) {}
      }
      const uniq = []; const key = new Set();
      for (const c of seen) { const k = c.where + '|' + c.text + '|' + c.x + ',' + c.y;
        if (!key.has(k)) { key.add(k); uniq.push(c); } }
      return uniq.slice(0, 60);
    });
    out.first_screen = controls;
    out.lines.push({ at: stamp((await sig()).now),
      did: 'looked at the first screen without touching anything',
      happened: controls.length + ' things with words on them, big enough to tap: '
        + controls.map(c => c.text).slice(0, 18).join(' / '),
      promised: '' });

    /* WHAT PANEL IS THIS CONTROL IN, AND WHAT DOES THAT PANEL SAY (9/15, RULE 14(h)).
       The rule landed on the front page after my last push and it lands on this instrument:
       "IN THIS GAME A DEAD BUTTON IS INDISTINGUISHABLE FROM A CLOSE BUTTON, because a card
       closes on any tap it does not recognise and a screen diff reads the vanished card as
       life. Any 'does this control work' check must require THE PANEL TO STILL BE OPEN and its
       words to have moved, or it measures nothing."
       My noise ledger fixed FALSE DEATH -- the world repainting and getting credited to a
       finger. It does NOTHING about FALSE LIFE, because a card vanishing is novel movement by
       any measure. Both halves are needed, so this reads the panel the control lives in:
       the nearest ancestor that behaves like a card (several children, real size, a known
       card id), and that panel's OWN words, so a change somewhere else on screen cannot be
       credited to this control either. */
    const panelAt = async (x, y) => page.evaluate(({ x, y }) => {
      const cardish = (e) => {
        if (!e || !e.getBoundingClientRect) return false;
        if (/^(daycard|offers|cbox|card|panel|sheet|modal)/i.test(e.id || '')) return true;
        if (/(daycard|offer|card|panel|sheet|modal)/i.test(e.className || '')) return true;
        const r = e.getBoundingClientRect();
        return r.width >= 180 && r.height >= 60 && e.children.length >= 2;
      };
      const read = (doc, ox, oy) => {
        const el = doc.elementFromPoint(x - ox, y - oy);
        if (!el) return null;
        let n = el, found = null;
        for (let i = 0; i < 8 && n; i++) { if (cardish(n)) { found = n; break; } n = n.parentElement; }
        const target = found || el;
        const r = target.getBoundingClientRect();
        return { id: target.id || '', tag: target.tagName,
                 path: (target.id ? '#' + target.id : target.tagName)
                       + (target.className ? '.' + String(target.className).split(' ')[0] : ''),
                 w: Math.round(r.width), h: Math.round(r.height),
                 open: r.width > 0 && r.height > 0,
                 words: (target.innerText || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean) };
      };
      const direct = read(document, 0, 0);
      /* the element at that point may be an iframe; then the real panel is inside it */
      const hit = document.elementFromPoint(x, y);
      if (hit && hit.tagName === 'IFRAME') {
        try {
          const o = hit.getBoundingClientRect();
          const inner = read(hit.contentDocument, o.x, o.y);
          if (inner) return inner;
        } catch (e) {}
      }
      return direct;
    }, { x, y });

    /* IS THAT SAME PANEL STILL THERE, AND WHAT DOES IT SAY NOW. Asked by the path it was
       found under, not by looking at that screen point again -- a closed card would hand back
       whatever is underneath it and that would read as "still open". */
    const panelNow = async (path) => page.evaluate((path) => {
      const look = (doc) => {
        let el = null;
        try { el = doc.querySelector(path); } catch (e) { return null; }
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = doc.defaultView.getComputedStyle(el);
        return { open: r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden',
                 words: (el.innerText || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean) };
      };
      const a = look(document);
      if (a) return a;
      for (const f of document.querySelectorAll('iframe')) {
        try { if (f.contentDocument) { const b = look(f.contentDocument); if (b) return b; } } catch (e) {}
      }
      return { open: false, words: [] };
    }, path);

    /* ---- THE FIXED TAP SCRIPT ------------------------------------------- */
    const tapAndWatch = async (c, why) => {
      /* NULL WINDOW, TAP, NULL WINDOW, TAP -- AND THE VERDICT HAS TO SURVIVE BOTH (9/14).
         The first cut of this took ONE null window and compared the tap against it, and it
         failed its own control: a planted button with no handler was called alive because four
         words arrived in its watch window that no finger asked for. The self-movement probe
         then named the source -- the world writes its OWN clock and its OWN song title, rarely
         (1 window in 50) but really. A wider margin would only have hidden that, and a list of
         words to ignore would go stale.
         A rare burst does not land in BOTH of two tap windows. So each candidate is now
         measured twice, each time against its own fresh null window, and the answer is three
         ways, not two: alive if the tap beat its null both times, dead if it beat it neither
         time, UNDECIDED if once. Undecided is not dead and it is never counted as dead -- a
         one-shot control (a card that closes) is genuinely undecidable this way and saying so
         is the honest answer. */
      const beats = [], evidence = [], closedOn = [], where = [], inPanel = [], elsewhere = [], panels = [],
            bigOnce = [], chosen = [];
      /* WHAT THE WORLD HAS BEEN MEASURED DOING BY ITSELF, SO FAR, THIS RUN. Only windows already
         taken count: a verdict may never be justified by evidence collected after it. */
      const worstNullSoFar = (out.null_windows || []).reduce((m, x) => Math.max(m, x.word_moves || 0), 0);
      let landed = 'the tap was refused (not visible to a finger)';
      let bs = null, as = null, tapMove = null, nullMove = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        const n0 = await sig();
        await sleep(1200);
        const n1 = await sig();
        nullMove = dist(n0, n1);
        out.null_windows.push({ word_moves: nullMove.word_moves,
                                words_that_moved: nullMove.words_that_moved,
                                pixel_fraction: nullMove.pixel_fraction });
        learn(nullMove);                       /* the world teaches the ledger, always */
        bs = n1;
        /* the panel as it stands the instant before the finger lands */
        const before = await panelAt(c.x, c.y);
        const errCountBefore = err.length, dlCountBefore = dl.length;
        /* IS THIS THE ONE ALREADY CHOSEN? A tab you are standing on does nothing when you press
           it, and that is correct behaviour, not a dead control. The alpha opens on VOTE, so VOTE
           was the last item left in this round's dead list after the tab fix, and it should never
           have been there. The page says so itself, in the language accessibility audits use:
           aria-selected, aria-current, or a class token like on / active / selected / current. */
        const alreadyChosen = await page.evaluate(({ x, y }) => {
          /* THE FIRST VERSION OF THIS EXCUSE WAS TOO GENEROUS AND I CAUGHT IT IN ONE RUN. It
             walked three ancestors looking for a chosen-mark, and on the alpha that excused a
             cutscene headline, a line of card prose and a TILE badge -- three things that are
             not controls at all -- because something above them carried an "on" class. An
             excuse that wide would quietly erase real dead calls, which is worse than the
             wrong dead call it was built to stop.
             SO IT IS A TAB STRIP OR IT IS NOTHING: the mark must sit on the pressed element or
             its immediate parent, that element must have SIBLINGS SHARING ITS CLASS, and
             EXACTLY ONE of them may carry the mark. That is what a tab strip and a segmented
             control look like, and a paragraph inside a card cannot look like it. */
          const MARKS = ['on', 'active', 'selected', 'current'];
          const marked = (e) => {
            if (!e || !e.getAttribute) return false;
            if (e.getAttribute('aria-selected') === 'true' || e.getAttribute('aria-current')) return true;
            const cls = (e.className || '').toString().toLowerCase().split(/[\s_-]+/);
            return cls.some(t => MARKS.includes(t));
          };
          const hit = (doc, ox, oy) => doc.elementFromPoint(x - ox, y - oy);
          let el = hit(document, 0, 0);
          if (el && el.tagName === 'IFRAME') {
            try { const r = el.getBoundingClientRect();
                  el = hit(el.contentDocument, r.x, r.y) || el; } catch (e) {}
          }
          for (const cand of [el, el && el.parentElement]) {
            if (!cand || !marked(cand)) continue;
            const base = (cand.className || '').toString().toLowerCase().split(/\s+/)
              .filter(t => t && !MARKS.includes(t));
            const parent = cand.parentElement;
            if (!parent || !base.length) continue;
            const family = [...parent.children].filter(sib =>
              base.every(t => (sib.className || '').toString().toLowerCase().split(/\s+/).includes(t)));
            if (family.length < 2) continue;                 /* one of a kind is not a strip */
            if (family.filter(marked).length !== 1) continue; /* a strip marks exactly one */
            return true;
          }
          return false;
        }, { x: c.x, y: c.y }).catch(() => false);
        chosen.push(!!alreadyChosen);
        try { await page.mouse.click(c.x, c.y, { delay: 40 }); landed = null; } catch (e) { break; }
        await sleep(1200);
        as = await sig();
        tapMove = dist(bs, as);
        const nv = novel(tapMove);
        const after = before && before.path ? await panelNow(before.path) : { open: false, words: [] };
        /* THE TWO TESTS RULE 14(h) ASKS FOR, AND THEY ARE SEPARATE ANSWERS.
           still_open: the panel that held the control is still on screen. If it is not, this
             press proves NOTHING -- a card that closes on a tap it does not recognise looks
             exactly like one that did the thing.
           panel_words_moved: the words INSIDE that panel changed, and at least one of them has
             never been seen moving with nobody touching the screen. */
        const stillOpen = !!(before && before.open && after.open);
        panels.push((before && before.path) || 'none found');
        /* THREE WAYS A PRESS ANSWERS WITHOUT MOVING A PIXEL ON THIS HARNESS */
        const spokeToTheBrowser = err.length > errCountBefore;     /* e.g. a refused clipboard write */
        const startedADownload = dl.length > dlCountBefore;        /* e.g. EXPORT handing over a file */
        const itVanished = await page.evaluate(({ x, y }) => {
          /* a control that removes ITSELF did something, and that is not the 14(h) case, which is
             about the panel AROUND it going away */
          const hit = (doc, ox, oy) => doc.elementFromPoint(x - ox, y - oy);
          let el = hit(document, 0, 0);
          if (el && el.tagName === 'IFRAME') {
            try { const r = el.getBoundingClientRect(); el = hit(el.contentDocument, r.x, r.y) || el; } catch (e) {}
          }
          return !el || !(el.innerText || '').trim();
        }, { x: c.x, y: c.y }).catch(() => false);
        const bw = new Map(), aw = new Map();
        for (const w of (before && before.words) || []) bw.set(w, (bw.get(w) || 0) + 1);
        for (const w of after.words || []) aw.set(w, (aw.get(w) || 0) + 1);
        const movedInPanel = [];
        for (const [w, n] of bw) if ((aw.get(w) || 0) !== n) movedInPanel.push(w);
        for (const [w] of aw) if (!bw.has(w)) movedInPanel.push(w);
        const novelInPanel = movedInPanel.filter(w => !noiseWords.has(w));
        evidence.push({ spoke_to_the_browser: spokeToTheBrowser, started_a_download: startedADownload,
                        the_control_itself_vanished: itVanished,
                        novel_words_anywhere: nv.words.slice(0, 8),
                        novel_words_anywhere_count: nv.words.length, novel_cells: nv.cells,
                        world_moved_in_the_null_window: nullMove.word_moves,
                        panel: (before && before.path) || 'none found',
                        panel_still_open: stillOpen,
                        novel_words_inside_the_panel: novelInPanel.slice(0, 8) });
        /* RULE 14(h), AND THE HALF I HAD MISSING (9/18, and it cost a wrong claim on his page).
           Round 5 shipped this as "the panel stayed open AND ITS OWN words moved", and round 5's
           own blind-spot note said out loud what was wrong with that: "a control whose effect
           lands in a DIFFERENT panel will read as dead here". That came due. Round 7 photographed
           the fight's developer strip and I reported four of its five controls dead; COMBAT drove
           them in a real fight and every one ACTS -- WAIT gives STEADY +5%, SUPPRESS gives
           PINNED 1, NEW ENCOUNTER restarts the fight. They change readouts ELSEWHERE on the
           screen, so the panel holding the button never moved and my test called them dead.
           THE TWO HALVES ARE SEPARATE QUESTIONS AND BOTH ARE NEEDED:
             stillOpen           kills FALSE LIFE -- a card that closes on a tap it does not
                                 know looks exactly like one that did the thing (14(h)).
             novel ANYWHERE      kills FALSE DEATH -- the effect does not have to land in the
                                 same box as the finger, and the ledger is what makes "novel"
                                 mean something the world does not do by itself.
           So a control is alive if its panel survived the press AND something moved that the
           world has never been seen moving on its own, wherever that something is; and WHERE it
           moved is recorded, so a reader can tell "its own panel answered" from "something else
           did". Dead needs neither, twice. */
        const novelAnywhere = nv.words.length > 0 || nv.cells > 20
                              || (stillOpen && (spokeToTheBrowser || startedADownload));
        beats.push(stillOpen && (novelInPanel.length > 0 || novelAnywhere));
        where.push(!stillOpen ? 'the panel closed'
                 : spokeToTheBrowser ? 'the browser answered it (this harness refused something the press asked for)'
                 : startedADownload ? 'it handed the browser a file'
                 : itVanished ? 'it took itself off the screen'
                 : novelInPanel.length > 0 ? 'its own panel'
                 : (nv.words.length >= Math.max(5, 3 * worstNullSoFar + 1)) ? 'a screenful somewhere else, on one press'
                 : novelAnywhere ? 'somewhere else on screen'
                 : 'nothing moved');
        inPanel.push(stillOpen && novelInPanel.length > 0);
        elsewhere.push(stillOpen && novelInPanel.length === 0 && novelAnywhere);
        /* *** A TAB ANSWERS ONCE, AND THE REPEAT RULE CALLED EVERY TAB IN THE ALPHA DEAD (9/23).
           *** Round 9 opened the verdict to movement ANYWHERE; round 11 made off-panel evidence
           repeat, because a planted handlerless button read alive off ONE press when the world
           happened to burst. Both were right about what they fixed. But a control that CHANGES
           STATE answers hugely the first time and is a genuine no-op the second: press LOOK and
           the alpha paints a new screen, press LOOK again and you are already standing on it. On
           the alpha this round that read as FOUR DEAD TAB BUTTONS, and they are all alive.
           THE DISCRIMINATOR IS SIZE, AND IT IS MEASURED, NOT PICKED: the world's own worst null
           window this run is the noise floor, and a burst of that size is what the repeat rule
           exists to reject. Evidence elsewhere counts on ONE press only when it is at least
           three times that floor and at least five novel words -- a screenful, not a flicker. */
        const floor = Math.max(5, 3 * worstNullSoFar + 1);
        /* *** 14(h) OUTRANKS THE NEW RULE, AND THE PLANTED CONTROL CAUGHT ME THE SAME ROUND. ***
           A close button removes ITSELF and its panel, so "the control vanished" swallowed the
           one case rule 14(h) exists for: a card that closes on any tap it does not recognise
           looks exactly like one that did the thing. The planted close-button went from "THE
           PANEL CLOSED, so this press proves nothing" to "did something" the moment I added the
           vanish rule, and that is a straight loss. So a vanish only counts WHILE THE PANEL
           AROUND IT SURVIVES; the browser and download answers stand on their own, because
           neither can be produced by a card quietly closing. */
        bigOnce.push((stillOpen && novelInPanel.length === 0 && nv.words.length >= floor)
                     || spokeToTheBrowser || startedADownload || (stillOpen && itVanished));
        if (!stillOpen) {
          /* AND THE SECOND PRESS MUST NOT HAPPEN. This is the hole the 14(h) control caught on
             its first run, and it caught it because a planted close-button read "did nothing":
             once the panel is gone, the same screen point belongs to WHATEVER IS UNDERNEATH,
             so press two measures a different element entirely and then agrees it did nothing.
             Two presses of two different things is not two presses. One press that closed the
             panel already tells me this press proves nothing, so stop there and say so. */
          closedOn.push((before && before.path) || 'unknown');
          break;
        }
      }
      if (landed === null) {
        const hits = beats.filter(Boolean).length;
        /* A ONE-SHOT CONTROL IS ALIVE ON ITS FIRST PRESS AND DEAD ON EVERY PRESS AFTER, which
           is correct behaviour for a card that closes. So ANY novel movement is alive, and only
           TWO presses with nothing novel at all is dead. The 1-of-2 count is reported, so the
           weaker evidence is visible instead of hidden inside the word "dead". */
        /* OFF-PANEL EVIDENCE HAS TO REPEAT, AND IN-PANEL EVIDENCE DOES NOT (9/21).
           Round 9 opened the verdict to novel movement ANYWHERE, to stop calling the fight's
           WAIT and SUPPRESS dead when their answer lands in a readout elsewhere. That fixed
           false death and bought false life straight back: on this round's first walk the
           PLANTED HANDLERLESS BUTTON read "did something, somewhere else on screen", off ONE
           press, because the world happened to move something novel in that window.
           The discriminator is repeatability, and it comes from the real controls this lane was
           corrected by: WAIT gives STEADY +5% EVERY press, SUPPRESS gives PINNED 1 EVERY press.
           A world burst does not land in both windows.
           So: evidence INSIDE the control's own panel counts on one press (a one-shot that
           closes or changes its own card is real and may only fire once); evidence SOMEWHERE
           ELSE counts only if BOTH presses produced it. */
        const changed = inPanel.some(Boolean) || (elsewhere.length === 2 && elsewhere.every(Boolean))
                        || bigOnce.some(Boolean);
        /* A PRESS THAT CLOSED THE PANEL PROVES NOTHING EITHER WAY, and calling it dead would be
           as wrong as calling it alive. It gets its own word. */
        const allClosed = closedOn.length > 0 && !changed;
        out.numbers.__unused = out.numbers.__unused;
        if (hits === 1) out.alive_on_one_press_only.push({ text: c.text, id: c.id || '' });
        const answeredIn = where.filter(w => w === 'its own panel' || w === 'somewhere else on screen');
        out.pressed.push({ text: c.text, id: c.id || '', where: c.where,
                           verdict: changed ? ('did something, ' + (answeredIn[0] || 'somewhere'))
                                  : allClosed ? 'THE PANEL CLOSED, so this press proves nothing (rule 14h)'
                                  : 'did nothing',
                           answered_in: answeredIn, presses_with_novel_movement: hits,
                           in_its_own_panel: inPanel, somewhere_else: elsewhere,
                           evidence: evidence });
        line(as.now, 'tapped ' + JSON.stringify(c.text) + (why ? ' (' + why + ')' : ''),
             changed ? ('the screen answered: ' + (where.find(w => w === 'its own panel'
                        || w === 'somewhere else on screen') || 'somewhere'))
                     : allClosed ? 'THE PANEL VANISHED, which tells me nothing either way'
                     : 'NOTHING MOVED ANYWHERE, BOTH PRESSES',
             c.text);
        if (allClosed) {
          out.closed_on_tap.push({ at: stamp(as.now), text: c.text, id: c.id, where: c.where,
                                   size: c.w + 'x' + c.h, panel: closedOn[0],
                                   why: 'the panel it lives in closed, and a card closes on any tap it does not recognise' });
          return false;
        }
        /* *** THE TWO PRESSES HAVE TO BE TWO PRESSES OF THE SAME SCREEN (9/22). ***
           Caught before publishing, on the third reproduction of this list: SCAVENGE 8H came
           back DEAD while its own evidence showed eight novel words elsewhere on press one --
           YOU, 1, OF, you, the, SLEEP, BIKE, STANDING -- and the panel it sat in was
           #blstack.uihalf for press one and #daycardIn for press two. That reads like the press
           OPENED THE DAY CARD, and then press two was measured with the card open, found
           nothing new, and the repeatability rule turned one real answer into a dead button.
           It is the same mistake rule 14(h) fixed for a panel that CLOSES, one step along: if
           the panel under the finger is not the same panel both times, the pair is void and the
           honest word is UNDECIDED, never dead. A wrong dead call is the one thing this lane
           must never produce. */
        const panelDrifted = panels.length === 2 && panels[0] !== panels[1];
        const standingOnIt = chosen.length > 0 && chosen.every(Boolean);
        if (!changed && standingOnIt) {
          out.undecided.push({ at: stamp(as.now), text: c.text, id: c.id, where: c.where,
                        size: c.w + 'x' + c.h, looked_tappable_because: c.looks_tappable_because || 'nothing said so',
                        why: 'THE PAGE MARKS THIS AS THE ONE ALREADY CHOSEN (aria-selected, '
                          + 'aria-current or an on/active/selected/current class), and pressing the '
                          + 'tab you are standing on correctly does nothing. Not a dead control.',
                        evidence: evidence });
        } else if (!changed && panelDrifted) {
          out.undecided.push({ at: stamp(as.now), text: c.text, id: c.id, where: c.where,
                        size: c.w + 'x' + c.h, looked_tappable_because: c.looks_tappable_because || 'nothing said so',
                        why: 'THE SCREEN CHANGED BETWEEN THE TWO PRESSES: the panel under the '
                          + 'finger was ' + panels[0] + ' and then ' + panels[1] + ', so press two '
                          + 'did not measure the same screen and this pair proves nothing',
                        evidence: evidence });
        } else if (!changed) {
          const row = { at: stamp(as.now), text: c.text, id: c.id, where: c.where,
                        size: c.w + 'x' + c.h, looked_tappable_because: c.looks_tappable_because || 'nothing said so',
                        pressed_twice: true, novel_movement_either_time: 'none',
                        evidence: evidence };
          if (c.looks_tappable_because) out.dead.push(row); else out.inert.push(row);
        }
        return changed;
      }
      line(bs.now, 'tried to tap ' + JSON.stringify(c.text), landed, c.text);
      return false;
    };

    /* 2. the largest, most obviously tappable thing first */
    const byArea = controls.slice().sort((a, b) => (b.w * b.h) - (a.w * a.h));
    if (byArea[0]) await tapAndWatch(byArea[0], 'the biggest thing on screen');
    out.shots.push(await snap('02_first_tap'));

    /* THE CARD IS IN THE WAY OF WALKING, so clearing it is its own recorded step rather
       than something the script does quietly. */
    const gotup = controls.find(c => /^GET UP$/i.test(c.text));
    if (gotup) await tapAndWatch(gotup, 'the only thing on the card that is not an offer');

    /* 3. walk in one direction until something stops you.
       *** AND THIS IS THE MISTAKE THAT INVALIDATED A WHOLE FIVE-MINUTE RUN. ***
       v1 dispatched pointerdown immediately followed by pointerup -- a zero-millisecond
       press -- 272 times, and the player never moved a pixel. The end-of-walk screenshot
       was identical to the one taken at 31 seconds, and the run duly reported "no fight in
       five minutes", which read as his complaint reproduced. It was not. A control run
       proved it: ONE held press for two seconds moved 93.9% of the world's pixels. THE GAME
       WALKS ON A HELD PRESS. The instrument was tapping, so the instrument never left the
       block, so of course it met nothing. A zero needs a positive control, and this is the
       round where that law saved a false headline from shipping. */
    const pads = await page.evaluate(() => {
      const out = [];
      const fr = [...document.querySelectorAll('iframe')].map(f => { try { return f.contentDocument; } catch (e) { return null; } }).filter(Boolean);
      for (const d of [document, ...fr]) {
        for (const e of d.querySelectorAll('.pb')) {
          const r = e.getBoundingClientRect();
          if (r.width < 10) continue;
          out.push({ x: +(r.left + r.width / 2).toFixed(0), y: +(r.top + r.height / 2).toFixed(0),
                     w: +r.width.toFixed(0), h: +r.height.toFixed(0) });
        }
      }
      return out;
    }).catch(() => []);
    const hold = async (ms) => {
      if (!pads.length) return false;
      /* the up arrow of the dial: the topmost pad in the bottom-right cluster */
      const cluster = pads.filter(p0 => p0.y > 600);
      const pick = (cluster.length ? cluster : pads).slice().sort((a, b) => a.y - b.y)[0];
      try {
        await page.mouse.move(pick.x, pick.y);
        await page.mouse.down();
        await sleep(ms);
        await page.mouse.up();
        return true;
      } catch (e) { return false; }
    };
    const walkRes = await (async () => {
      if (!pads.length) return { walked: false, why: 'no walk control found on the first screen' };
      const bs = await sig();
      await hold(2500);
      await sleep(500);
      const as = await sig();
      return { walked: true, held_ms: 2500, of: pads.length,
               moved: as.pix !== bs.pix, control: 'the dial, held' };
    })();
    const walkResOld = async () => await page.evaluate(async () => {
      const fr = [...document.querySelectorAll('iframe')].map(f => { try { return f.contentDocument; } catch (e) { return null; } }).filter(Boolean);
      const docs = [document, ...fr];
      let pad = null, kind = '';
      for (const d of docs) {
        const p = d.querySelector('.pb, #dpad, [data-dir], .dpad');
        if (p) { pad = p; kind = p.className || p.id; break; }
      }
      if (!pad) return { walked: false, why: 'no walk control found on the first screen' };
      const dir = pad.ownerDocument.querySelectorAll('.pb');
      const n = dir.length;
      const target = n ? dir[Math.min(1, n - 1)] : pad;
      /* DISPATCH ONLY. The first run died on target.click is not a function, because the
         walk control is not always an HTMLElement with a click method. A walk that throws
         is a walk that never happened, and the five minutes is the only measure. */
      for (let i = 0; i < 40; i++) {
        try {
          target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
          target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
          target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          if (typeof target.click === 'function') target.click();
        } catch (e) {}
        await new Promise(r => setTimeout(r, 120));
      }
      return { walked: true, presses: 40, control: kind, of: n };
    });
    {
      const as = await sig();
      line(as.now, walkRes.walked ? 'held the walk dial down for two and a half seconds' : 'looked for a way to walk',
           walkRes.walked ? ((walkRes.moved ? 'the world moved' : 'THE WORLD DID NOT MOVE')
                             + ' (' + walkRes.of + ' arrows on the dial)') : walkRes.why, '');
      out.shots.push(await snap('03_walked'));
    }

    /* 3z. WARM THE LEDGER BEFORE ANY VERDICT. Eight windows of holding completely still, so
       the world has shown what it does by itself before a single tap is judged against it. An
       empty ledger would make the first taps the least trustworthy ones, and the first taps are
       the ones a stranger's five minutes is mostly made of. */
    for (let i = 0; i < 8; i++) {
      const w0 = await sig(); await sleep(1200); const w1 = await sig();
      const d0 = dist(w0, w1);
      out.null_windows.push({ word_moves: d0.word_moves, words_that_moved: d0.words_that_moved,
                              pixel_fraction: d0.pixel_fraction, warmup: true });
      learn(d0);
    }
    out.numbers.ledger_after_warmup = { words: noiseWords.size, pixel_samples: noiseCells.size };

    /* 3a. RULE ZERO FOR THE NEW VERDICT (9/14). The detector was rebuilt this round, so it
       has to be proved in BOTH directions ON THE LIVE SURFACE, with the world running and the
       clock ticking, which is the only hard case. Two buttons are planted at the bottom of the
       real page: one with no handler at all, one that writes a word. The dead one must come
       back dead and the live one must come back alive. If either control fails, the numbers
       below describe nothing and the run says so. */
    /* THREE PLANTED CONTROLS NOW, EACH IN ITS OWN PANEL, because rule 14(h) added a third
       thing that can happen. Each button sits inside a real panel with words of its own, so
       the panel test has something to read:
         DEAD   no handler at all                      -> must read "did nothing"
         LIVE   changes a word INSIDE its own panel     -> must read "did something"
         CLOSE  removes its own panel                   -> must read "THE PANEL CLOSED", and it
                is the whole point of 14(h) that this must never read as working. */
    await page.evaluate(() => {
      const mk = (pid, bid, label, kind, bottom) => {
        const panel = document.createElement('div');
        panel.id = pid;
        panel.style.cssText = 'position:fixed;left:8px;bottom:' + bottom +
          'px;z-index:2147483647;background:#111;color:#fff;padding:8px;width:260px';
        const words = document.createElement('div');
        words.id = pid + '_words';
        words.textContent = 'EYESPANELSAYS NOTHINGYET';
        const b = document.createElement('button');
        b.id = bid; b.textContent = label;
        b.style.cssText = 'padding:10px 14px;font-size:14px';
        if (kind === 'live') b.addEventListener('click', () => {
          words.textContent = 'EYESPANELSAYS ' + ('EYESWORD' + Math.random().toString(36).slice(2, 8)).toUpperCase();
        });
        if (kind === 'close') b.addEventListener('click', () => { panel.remove(); });
        /* THE TAB, ADDED 9/23, AND IT IS THE ONE THAT WOULD HAVE CAUGHT THIS ROUND'S WRONG CLAIM.
           A tab writes a whole screen the first time you press it and DOES NOTHING the second
           time, because you are already standing on it. The repeat rule (round 9) demands that
           off-panel evidence appear on BOTH presses, so every real tab in the alpha read DEAD.
           This one flips a switch: press one fills the far panel with a screenful of words,
           press two is a genuine no-op. It must read ALIVE. */
        if (kind === 'tab') {
          let open = false;
          b.addEventListener('click', () => {
            if (open) return;
            open = true;
            const far = document.getElementById('__eyes_panel_far_words');
            if (far) far.textContent = 'EYESTABSAYS ' + Array.from({ length: 14 },
              (_, i) => ('EYESTABWORD' + i + Math.random().toString(36).slice(2, 5)).toUpperCase()).join(' ');
          });
        }
        if (kind === 'sibling') b.addEventListener('click', () => {
          /* writes NOWHERE NEAR itself: into the other planted panel entirely */
          const far = document.getElementById('__eyes_panel_far_words');
          if (far) far.textContent = 'EYESFARSAYS ' +
            ('EYESWORD' + Math.random().toString(36).slice(2, 8)).toUpperCase();
        });
        panel.appendChild(words); panel.appendChild(b);
        document.body.appendChild(panel);
      };
      /* A FOURTH CONTROL, ADDED 9/18, AND IT IS THE ONE THAT WOULD HAVE CAUGHT MY WRONG CLAIM.
         A button in one panel whose ONLY effect is to write a word into a DIFFERENT panel. That
         is the shape of the fight's WAIT and SUPPRESS: the finger is in the strip, the answer
         appears in a readout somewhere else. The old verdict called that dead and I published
         it. It must read ALIVE. */
      mk('__eyes_panel_sib',   '__eyes_sib_btn',   'EYESSIBCONTROL',   'sibling', 420);
      mk('__eyes_panel_far',   '__eyes_far_none',  'EYESFARPANEL',     'dead',  510);
      mk('__eyes_panel_dead',  '__eyes_dead_btn',  'EYESDEADCONTROL',  'dead',  150);
      mk('__eyes_panel_live',  '__eyes_live_btn',  'EYESLIVECONTROL',  'live',  240);

      mk('__eyes_panel_close', '__eyes_close_btn', 'EYESCLOSECONTROL', 'close', 330);
      mk('__eyes_panel_tab',   '__eyes_tab_btn',   'EYESTABCONTROL',   'tab',   600);
    });
    const ctlBox = await page.evaluate(() => {
      const one = (id) => { const e = document.getElementById(id); const r = e.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: Math.round(r.width), h: Math.round(r.height) }; };
      return { dead: one('__eyes_dead_btn'), live: one('__eyes_live_btn'),
               close: one('__eyes_close_btn'), sib: one('__eyes_sib_btn'), tab: one('__eyes_tab_btn') };
    });
    /* the verdict is THREE ways now, so a control has to read the verdict and not a boolean:
       an UNDECIDED returns false from tapAndWatch and must never be scored as "called dead". */
    const verdictOf = () => (out.pressed.length ? out.pressed[out.pressed.length - 1].verdict : 'nothing pressed');
    await tapAndWatch({ ...ctlBox.dead, text: 'EYESDEADCONTROL',
      id: '__eyes_dead_btn', where: 'a planted control', looks_tappable_because: 'a planted control' },
      'CONTROL: a button with no handler');
    const deadVerdict = verdictOf();
    await tapAndWatch({ ...ctlBox.live, text: 'EYESLIVECONTROL',
      id: '__eyes_live_btn', where: 'a planted control', looks_tappable_because: 'a planted control' },
      'CONTROL: a button that writes one word');
    const liveVerdict = verdictOf();
    await tapAndWatch({ ...ctlBox.close, text: 'EYESCLOSECONTROL',
      id: '__eyes_close_btn', where: 'a planted control', looks_tappable_because: 'a planted control' },
      'CONTROL: a button that closes its own panel');
    const closeVerdict = verdictOf();
    await tapAndWatch({ ...ctlBox.sib, text: 'EYESSIBCONTROL',
      id: '__eyes_sib_btn', where: 'a planted control', looks_tappable_because: 'a planted control' },
      'CONTROL: a button whose effect lands in a DIFFERENT panel');
    const sibVerdict = verdictOf();
    await tapAndWatch({ ...ctlBox.tab, text: 'EYESTABCONTROL',
      id: '__eyes_tab_btn', where: 'a planted control', looks_tappable_because: 'a planted control' },
      'CONTROL: a tab, which answers on the first press and is a no-op on the second');
    const tabVerdict = verdictOf();
    const tabSaysAlive = /^did something/.test(tabVerdict);
    const deadSaysDead = deadVerdict === 'did nothing';
    const liveSaysAlive = /^did something/.test(liveVerdict);
    const closeSaysClosed = /THE PANEL CLOSED/.test(closeVerdict);
    const sibSaysAlive = /^did something/.test(sibVerdict);
    /* TAKE THE CONTROLS ALL THE WAY OUT. getElementById returns the FIRST match, and the
       paired press appends the live control's span twice, so the old cleanup left one behind --
       the wandering loop then found "__EYES_LIVE_BUTTON_SPOKE__" and put my own scaffolding in
       his list. Remove by query, not by id, and never leave the instrument in the picture. */
    await page.evaluate(() => {
      for (const e of document.querySelectorAll('[id^="__eyes_"]')) e.remove();
    });
    /* the two planted controls are not findings; take them back out of the counts */
    out.dead = out.dead.filter(d => !/^__eyes_/.test(d.id || ''));
    out.inert = out.inert.filter(d => !/^__eyes_/.test(d.id || ''));
    out.undecided = out.undecided.filter(d => !/^__eyes_/.test(d.id || ''));
    out.closed_on_tap = out.closed_on_tap.filter(d => !/^__eyes_/.test(d.id || ''));
    out.lines = out.lines.filter(l => !/EYESDEADCONTROL|EYESLIVECONTROL|EYESCLOSECONTROL|EYESSIBCONTROL|EYESFARPANEL|EYESPANELSAYS|EYESFARSAYS|EYESWORD/.test(l.did || ''));
    const mine = (d) => /^__eyes_/.test(d.id || '')
      || /EYES(DEAD|LIVE|CLOSE|SIB)CONTROL|EYESFARPANEL|EYESPANELSAYS|EYESFARSAYS|EYESWORD/.test(d.text || '');
    out.pressed = out.pressed.filter(d => !mine(d));
    out.inert = out.inert.filter(d => !mine(d));
    out.dead = out.dead.filter(d => !mine(d));
    out.closed_on_tap = out.closed_on_tap.filter(d => !mine(d));
    out.controls.push({ name: 'DEAD READS DEAD: a planted button with no handler is called dead',
                        pass: deadSaysDead,
                        detail: 'verdict was "' + deadVerdict + '"' + (deadSaysDead ? ', with the world running'
                          : ' -- anything but "did nothing" means the world is being read as the finger') });
    out.controls.push({ name: 'A CLOSE IS NOT A WORKING BUTTON (rule 14h): a planted button that '
                          + 'removes its own panel is called neither alive nor dead',
                        pass: closeSaysClosed,
                        detail: 'verdict was "' + closeVerdict + '"' + (closeSaysClosed
                          ? ' -- exactly what 14(h) asks for'
                          : ' -- a card that closes is being scored, and in this game that is the '
                            + 'commonest way a dead button looks alive') });
    out.controls.push({ name: 'AN EFFECT IN ANOTHER PANEL IS STILL AN EFFECT: a planted button '
                          + 'whose only result lands in a DIFFERENT panel is called alive',
                        pass: sibSaysAlive,
                        detail: 'verdict was "' + sibVerdict + '". THIS IS THE CONTROL THAT WOULD '
                          + 'HAVE CAUGHT ROUND 7\'S WRONG CLAIM: I called four of the fight\'s '
                          + 'controls dead and COMBAT drove them in a real fight and every one '
                          + 'acts, changing readouts elsewhere on the screen.' });
    out.controls.push({ name: 'A TAB IS NOT DEAD: a planted control that answers on the first press '
                          + 'and is a no-op on the second is called alive',
                        pass: tabSaysAlive,
                        detail: 'verdict was "' + tabVerdict + '". THIS IS THE CONTROL FOR THIS '
                          + 'ROUND\'S WRONG CLAIM: on the alpha the walk called VOTE, 3D, LOOK and '
                          + 'WORDS dead, and all four open real tabs -- they answer hugely once and '
                          + 'then correctly do nothing, because you are already standing on them, '
                          + 'while the repeat rule demanded an answer on BOTH presses.' });
    out.controls.push({ name: 'ALIVE READS ALIVE: a planted button that writes one word is called alive',
                        pass: liveSaysAlive,
                        detail: 'verdict was "' + liveVerdict + '"' + (liveSaysAlive ? ', off a single word'
                          : ' -- it missed a real change, so every dead count is inflated') });

    /* 3b. THE NAMED LIST, AND IT IS THE FIX FOR A FALSE ZERO (9/14).
       Three clean back-to-back walks of a byte-identical demo all reported ZERO dead buttons,
       and round 3 of this same job reported TWO. Nothing was fixed in between: only THE RUN
       re-cuts the demo and the file's md5 never moved. The cause was measured -- in all three
       walks the route NEVER PRESSED "BUILD" at all. So a zero in dead[] was unreadable: it
       meant either nothing is dead or I never touched the thing. It went on his front page as
       a fact and two lanes acted on it.
       So every item this lane has ever called dead is now pressed ON PURPOSE, BY ID, every
       run, before the free wandering starts. A named item that is missing from the screen is
       reported MISSING, never silently passed -- that is the same false zero one level up. */
    const NAMED = [
      { id: 'cbbuild', said: 'EYES round 2 and 3 called it dead' },
      { id: 'cbbig',   said: 'EYES round 2 and 3 called it dead' },
    ];
    for (const n of NAMED) {
      if ((await sig()).now - t0 > BUDGET_MS) break;
      const box = await page.evaluate((id) => {
        const walk = (doc) => {
          const e = doc.getElementById(id);
          if (e) {
            const r = e.getBoundingClientRect();
            const cs = doc.defaultView.getComputedStyle(e);
            if (r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden')
              return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: Math.round(r.width),
                       h: Math.round(r.height), text: (e.innerText || e.textContent || id).trim().slice(0, 40) };
          }
          return null;
        };
        let f = walk(document);
        if (f) return f;
        for (const fr of document.querySelectorAll('iframe')) {
          try { const d = fr.contentDocument; if (!d) continue;
                const r = walk(d); if (r) { const o = fr.getBoundingClientRect();
                  return { x: r.x + o.x, y: r.y + o.y, w: r.w, h: r.h, text: r.text }; } } catch (e) {}
        }
        return null;
      }, n.id);
      if (!box) {
        /* NOT ON SCREEN AND GONE FROM THE GAME ARE DIFFERENT ANSWERS, and collapsing them
           would be the same false zero one more time. A control that was REMOVED is a valid
           fix under rule 14(d) ("deliver it or remove it"); a control that still exists and
           my route cannot reach is a hole in my route. So the source is asked too. */
        const where = SOURCE.find(s => s.text.includes('id="' + n.id + '"') || s.text.includes("id='" + n.id + "'"));
        out.named.push({ id: n.id, said: n.said,
          result: where ? 'NOT ON SCREEN on this route, but it is still in the game'
                        : 'GONE FROM THE GAME: no element with this id is built any more',
          lives_in: where ? where.file : null });
        line((await sig()).now, 'went looking for "' + n.id + '" on purpose',
             where ? ('it was NOT on screen on this route, and it is still built in ' + where.file
                      + ', so this walk says nothing about it')
                   : 'it is GONE from the game, which is a fix, not a miss', '');
        continue;
      }
      const alive = await tapAndWatch({ x: box.x, y: box.y, w: box.w, h: box.h, text: box.text,
                                        id: n.id, where: 'named by an earlier round',
                                        looks_tappable_because: 'this lane called it dead before' },
                                      'pressed on purpose, because a round called it dead');
      out.named.push({ id: n.id, text: box.text, size: box.w + 'x' + box.h,
                       result: alive ? 'it does something now' : 'STILL DOES NOTHING', said: n.said });
    }

    /* 4. every card or offer that appears, in the order it appears, tapped once */
    const cards = controls.filter(c => /\b(YES|NO|OK|GO|ACCEPT|TAKE|DO IT|DEAL|READY|START|ENTER|DROP|MAP)\b/i.test(c.text));
    for (const c of cards.slice(0, 6)) {
      if (Date.now() - 0 && (await sig()).now - t0 > BUDGET_MS) break;
      await tapAndWatch(c, 'a card or offer');
    }
    out.shots.push(await snap('04_cards'));

    /* 5/6. the map, and the zoom */
    const mapish = controls.filter(c => /MAP|ZOOM|CITY|OUT|IN\b|DROP/i.test(c.text));
    for (const c of mapish.slice(0, 5)) {
      if ((await sig()).now - t0 > BUDGET_MS) break;
      await tapAndWatch(c, 'the map or the zoom');
    }
    out.shots.push(await snap('05_map'));

    /* 5b. EVERYTHING ELSE THE FIRST SCREEN OFFERED, BECAUSE THE SCRIPT WAS ONLY PRESSING THREE
       CATEGORIES (9/21). The inventory found ELEVEN things and the walk pressed TWO: the biggest
       one, then anything matching the card regex, then anything map-shaped, then whatever turned
       up new. The HUD chips -- SLEEP, BIKE, SCAVENGE, BUILD HERE, STANDING -- match none of
       those, so they were never pressed at all, in any round. A route that cannot reach half the
       first screen is a coverage hole, not a stranger's walk. */
    const alreadyPressed = new Set(out.pressed.map(p => p.where + '|' + p.text));
    for (const c of controls) {
      if ((await sig()).now - t0 > BUDGET_MS) break;
      const k = c.where + '|' + c.text;
      if (alreadyPressed.has(k)) continue;
      alreadyPressed.add(k);
      await tapAndWatch(c, 'on the first screen and never pressed by the old script');
    }

    /* time to first fight: is a fight ever on screen inside the budget */
    /* A FIGHT IS MET, NOT MERELY PRESENT IN THE DOM. The first run reported "a fight surface
       was on the page" because #combatFrame EXISTS in the markup from the start. His words were
       "I have not experienced any combat yet", which is about a fight being on screen and
       playable, so the test is: the fight surface is VISIBLE and has size. An element that
       exists and is hidden is not a fight met, and reporting it as one would have answered his
       complaint with a technicality. */
    const fight = await page.evaluate(() => {
      const vis = (e) => {
        if (!e) return false;
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return r.width > 80 && r.height > 80 && cs.display !== 'none'
               && cs.visibility !== 'hidden' && +cs.opacity > 0.1;
      };
      const look = (d) => {
        if (!d) return false;
        for (const sel of ['#combatFrame', '#cv2', '.fightroot', '#fight']) {
          if (vis(d.querySelector(sel))) return true;
        }
        return false;
      };
      if (look(document)) return true;
      for (const f of document.querySelectorAll('iframe')) { try { if (look(f.contentDocument)) return true; } catch (e) {} }
      return false;
    });
    /* FILL THE FIVE MINUTES. The first run ended at 37 seconds because the scripted steps
       ran out, and 37 seconds is not the measure he named. So after the script, keep doing what
       a stranger does when nothing has happened: walk, and tap whatever is new, until the
       budget is spent. */
    let rounds = 0;
    const seenText = new Set(controls.map(c => c.where + '|' + c.text));
    while (((await sig()).now - t0) < BUDGET_MS && rounds < 400) {
      rounds++;
      await hold(2000);          /* HELD, for the reason written above */

      /* anything new on screen since the inventory gets one tap, in the order found */
      const fresh = await page.evaluate(() => {
        const seen = [];
        const walk = (doc, where) => {
          for (const e of doc.querySelectorAll('div,button,span,a')) {
            const r = e.getBoundingClientRect();
            if (r.width < 18 || r.height < 12) continue;
            if (r.top > 844 || r.bottom < 0 || r.left > 390 || r.right < 0) continue;
            const cs = doc.defaultView.getComputedStyle(e);
            if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
            const txt = (e.innerText || '').replace(/\s+/g, ' ').trim();
            if (!txt || txt.length > 40) continue;
            if (e.querySelector('div,button,span,a')) continue;
            if (cs.pointerEvents === 'none') continue;
            const why = cs.cursor === 'pointer' ? 'pointer cursor'
                      : (e.tagName === 'BUTTON' || e.tagName === 'A') ? 'a button or link'
                      : e.hasAttribute('onclick') ? 'a click handler in the markup'
                      : e.getAttribute('role') === 'button' ? 'role=button'
                    /* A HEADING INSIDE THE CARD IS NOT A ROW A THUMB WOULD TRY (9/18).
                       This rule counted ANY text inside the day card as claiming to be tappable,
                       and this round it was about to publish four READOUTS as dead controls:
                       'ON THE ROAD - SUBURB - DAY' at 277x14, the encounter's own title at
                       320x17, 'THAT COST' at 55x14 and '15 min' at 34x17. The card's REAL rows
                       are 320x44. So height decides, and the number is not invented: 44 px is
                       the published minimum touch target and it is exactly what the card's own
                       rows use. Below 30 px inside a card it is text, and text goes to the inert
                       list with its reason, never to the dead list. */
                      : (e.closest('#daycard, .daycard, #offers, .offer') && r.height >= 30)
                          ? 'a row inside the day card'
                      /* A SENTENCE IS NOT A CHIP (9/21). This rule called #note -- the status
                       line reading "walking your own block." -- a chip in the top bar, and it
                       became the only "dead control" in a walk that pressed two things. Same
                       class as the day-card readouts fixed last round, reached through a
                       different reason string. A chip is a LABEL: a few words, no sentence
                       ending. Prose is a sentence and belongs in the inert list with its reason. */
                    : (e.closest('#topbar, #devtray, #blstack')
                       && !(/[.!?]$/.test(txt) && txt.split(/\s+/).length > 3))
                        ? 'a chip in the top bar'
                      : '';
            seen.push({ where, id: e.id || '', text: txt, looks_tappable_because: why,
                        w: +r.width.toFixed(0), h: +r.height.toFixed(0),
                        x: +(r.left + r.width / 2).toFixed(0), y: +(r.top + r.height / 2).toFixed(0) });
          }
        };
        walk(document, 'shell');
        for (const f of document.querySelectorAll('iframe')) { try { if (f.contentDocument) walk(f.contentDocument, 'frame'); } catch (e) {} }
        return seen.slice(0, 40);
      }).catch(() => []);
      for (const c of fresh) {
        const k = c.where + '|' + c.text;
        if (seenText.has(k)) continue;
        seenText.add(k);
        if (((await sig()).now - t0) > BUDGET_MS) break;
        await tapAndWatch(c, 'new on screen');
      }
    }
    out.numbers.extra_walk_rounds = rounds;

    const end = await sig();
    out.numbers.time_to_first_fight_s = fight ? 'a fight surface was on the page' : 'NONE';
    out.numbers.walk_ended_at_s = +((end.now - t0) / 1000).toFixed(1);
    out.numbers.dead_affordances = out.dead.length;
    out.numbers.things_i_actually_pressed = out.pressed.length;
    out.numbers.alive_on_one_press_only = out.alive_on_one_press_only.length;
    out.numbers.closed_the_panel_so_proves_nothing = out.closed_on_tap.length;
    out.numbers.words_the_world_writes_by_itself = noiseWords.size;
    out.numbers.named_items_pressed_on_purpose = out.named.filter(n => /does something now|STILL DOES NOTHING/.test(n.result)).length;
    out.numbers.named_items_not_reachable_on_this_route = out.named.filter(n => /NOT ON SCREEN/.test(n.result)).length;
    out.numbers.named_items_removed_from_the_game = out.named.filter(n => /GONE FROM THE GAME/.test(n.result)).length;
    out.numbers.named_items_still_dead = out.named.filter(n => n.result === 'STILL DOES NOTHING').length;
    out.controls.push({
      name: 'NO FALSE ZERO: every item an earlier round called dead was pressed on purpose',
      pass: out.named.length > 0 && out.named.every(n => /still does nothing|does something now|GONE FROM THE GAME/i.test(n.result)),
      detail: out.named.map(n => n.id + ': ' + n.result).join('; ') || 'no named items' });
    out.numbers.tapped_and_inert_but_never_claimed_to_be_a_button = out.inert.length;
    /* PRINTED BESIDE THE DEAD COUNT ON PURPOSE: a pair of presses thrown away because the
       screen changed under the finger is not a dead control and not a live one. Hiding it
       inside either number is how a dead call gets published by accident. */
    out.numbers.pairs_void_because_the_screen_changed_between_presses = out.undecided.length;
    /* WHAT THE WORLD DOES WITH NOBODY TOUCHING IT. If this is not zero, then the old
       detector -- any change means the tap worked -- was reading the world and calling it a
       button, and every 'it works' verdict it ever printed is unsafe. */
    const nw = out.null_windows || [];
    const nz = nw.filter(x => x.word_moves > 0 || x.pixel_fraction > 0.10).length;
    out.numbers.null_windows_measured = nw.length;
    out.numbers.null_windows_that_moved_on_their_own = nz;
    out.numbers.worst_null_window = nw.reduce((m, x) =>
      (x.word_moves > (m.word_moves || 0) ? x : m), { word_moves: 0, pixel_fraction: 0 });
    out.controls.push({
      name: 'THE WORLD MOVES ON ITS OWN: the null window is measured, not assumed',
      pass: nw.length > 0,
      detail: nz + ' of ' + nw.length + ' windows with no input at all still moved the screen. '
        + (nz > 0
           ? 'So equality was the wrong test and every earlier "the tap worked" on this game is unsafe.'
           : 'The world held still, so the old equality test was not the cause of the disagreement.') });
    out.numbers.page_errors = err.filter(e => e.kind === 'pageerror' && !/__eyes_planted_error__/.test(e.msg)).length;
    out.numbers.console_errors = err.filter(e => e.kind === 'console').length;
    out.numbers.failed_requests = err.filter(e => e.kind === 'requestfailed').length;
    out.errors = err.filter(e => !/__eyes_planted_error__/.test(e.msg)).slice(0, 25);
    out.shots.push(await snap('06_end'));
  } catch (e) {
    out.ok = false; out.why = String(e).slice(0, 500);
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  const bad = out.controls.filter(c => !c.pass).map(c => c.name);
  console.log(JSON.stringify({ which: WHICH, file: FILE, ok: out.ok, why: out.why, controls: out.controls,
    failing_controls: bad, numbers: out.numbers, lines: out.lines.length,
    dead: out.dead, inert: out.inert.length, first_screen: (out.first_screen || []).length }, null, 2));
  await b.close();
})();
