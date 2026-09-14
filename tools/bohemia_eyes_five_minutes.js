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
 *   COLD START   localStorage must be empty at the moment of first paint, or the run is
 *                void and restarted: a warm save is not the five minutes anybody else gets.
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
const WHICH = (process.argv[2] === 'alpha') ? 'alpha' : 'demo';
const FILE = WHICH === 'alpha' ? 'BOHEMIA_ALPHA_0_9.html' : 'BOHEMIA_DEMO.html';
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

  const out = { ok: true, which: WHICH, file: FILE, when: new Date().toISOString(),
                law: 'THE FIVE MINUTES (Paolo 9/13)',
                lines: [], errors: [], controls: [], numbers: {}, dead: [], inert: [],
                /* 9/14: a zero in dead[] used to be unreadable, because it meant EITHER
                   nothing was dead OR the route never pressed the thing. pressed[] is the
                   denominator that makes the zero mean something. null_windows[] is what the
                   world did with nobody touching it, which is the only reason a verdict here
                   can be attributed to a finger at all. */
                pressed: [], null_windows: [], named: [], undecided: [],
                alive_on_one_press_only: [] };
  const err = [];
  page.on('pageerror', e => err.push({ t: null, kind: 'pageerror', msg: String(e.message).slice(0, 220) }));
  page.on('console', m => { if (m.type() === 'error') err.push({ kind: 'console', msg: m.text().slice(0, 220) }); });
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
    await page.goto('file://' + path.join(ROOT, 'slices', FILE),
      { waitUntil: 'domcontentloaded', timeout: 90000 });
    const first = await page.evaluate(() => performance.now());
    t0 = first;

    /* CONTROL: COLD START. Nothing stored at first paint, or this is not a first run. */
    const stored = await page.evaluate(() => {
      try { return { n: localStorage.length, keys: Object.keys(localStorage).slice(0, 8) }; }
      catch (e) { return { n: -1, keys: [] }; }
    });
    out.controls.push({ name: 'COLD START: nothing in storage at first paint',
                        pass: stored.n === 0, detail: stored.n + ' keys ' + JSON.stringify(stored.keys) });

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
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    const tIn = await page.evaluate(() => performance.now());
    out.numbers.my_first_tap_at_s = +((tIn - t0) / 1000).toFixed(2);
    await sleep(3500);
    let after = await sig();
    line(after.now, 'tapped the front screen',
         after.txt !== before.txt || after.pix !== before.pix ? 'the screen changed' : 'NOTHING CHANGED',
         'that tapping enters the game');
    out.shots.push(await snap('01_entered'));

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
          if (e.querySelector('div,button,span,a')) continue;      /* leaves only */
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
                    : e.closest('#daycard, .daycard, #offers, .offer') ? 'a row inside the day card'
                    : e.closest('#topbar, #devtray, #blstack') ? 'a chip in the top bar'
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
      const beats = [], evidence = [];
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
        try { await page.mouse.click(c.x, c.y, { delay: 40 }); landed = null; } catch (e) { break; }
        await sleep(1200);
        as = await sig();
        tapMove = dist(bs, as);
        const nv = novel(tapMove);
        evidence.push({ novel_words: nv.words.slice(0, 8), novel_cells: nv.cells,
                        world_moved_in_the_null_window: nullMove.word_moves });
        /* NOVEL means never seen moving with nobody touching it. One word is enough, because
           one word is exactly what a real control changed in the planted live test. */
        beats.push(nv.words.length > 0 || nv.cells > 20);
      }
      if (landed === null) {
        const hits = beats.filter(Boolean).length;
        /* A ONE-SHOT CONTROL IS ALIVE ON ITS FIRST PRESS AND DEAD ON EVERY PRESS AFTER, which
           is correct behaviour for a card that closes. So ANY novel movement is alive, and only
           TWO presses with nothing novel at all is dead. The 1-of-2 count is reported, so the
           weaker evidence is visible instead of hidden inside the word "dead". */
        const changed = hits > 0;
        if (hits === 1) out.alive_on_one_press_only.push({ text: c.text, id: c.id || '' });
        out.pressed.push({ text: c.text, id: c.id || '', where: c.where,
                           verdict: changed ? 'did something' : 'did nothing',
                           presses_with_novel_movement: hits, evidence: evidence });
        line(as.now, 'tapped ' + JSON.stringify(c.text) + (why ? ' (' + why + ')' : ''),
             changed ? 'the screen changed' : 'NOTHING CHANGED',
             c.text);
        if (!changed) {
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
    await page.evaluate(() => {
      const mk = (id, label, live) => {
        const b = document.createElement('button');
        b.id = id; b.textContent = label;
        b.style.cssText = 'position:fixed;left:8px;bottom:' + (live ? 8 : 52) +
          'px;z-index:2147483647;padding:10px 14px;font-size:14px';
        if (live) b.addEventListener('click', () => {
          const s = document.createElement('span');
          s.id = '__eyes_live_said'; s.textContent = ' __EYES_LIVE_BUTTON_SPOKE__ ';
          document.body.appendChild(s);
        });
        document.body.appendChild(b);
      };
      mk('__eyes_dead_btn', 'EYESDEADCONTROL', false);
      mk('__eyes_live_btn', 'EYESLIVECONTROL', true);
    });
    const ctlBox = await page.evaluate(() => {
      const one = (id) => { const e = document.getElementById(id); const r = e.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: Math.round(r.width), h: Math.round(r.height) }; };
      return { dead: one('__eyes_dead_btn'), live: one('__eyes_live_btn') };
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
    const deadSaysDead = deadVerdict === 'did nothing';
    const liveSaysAlive = liveVerdict === 'did something';
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
    out.lines = out.lines.filter(l => !/EYESDEADCONTROL|EYESLIVECONTROL|EYES_LIVE_BUTTON_SPOKE/.test(l.did || ''));
    out.pressed = out.pressed.filter(d => !/^__eyes_/.test(d.id || '') && !/__EYES_/.test(d.text || ''));
    out.inert = out.inert.filter(d => !/__EYES_/.test(d.text || ''));
    out.dead = out.dead.filter(d => !/__EYES_/.test(d.text || ''));
    out.controls.push({ name: 'DEAD READS DEAD: a planted button with no handler is called dead',
                        pass: deadSaysDead,
                        detail: 'verdict was "' + deadVerdict + '"' + (deadSaysDead ? ', with the world running'
                          : ' -- anything but "did nothing" means the world is being read as the finger') });
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
                      : e.closest('#daycard, .daycard, #offers, .offer') ? 'a row inside the day card'
                      : e.closest('#topbar, #devtray, #blstack') ? 'a chip in the top bar'
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
