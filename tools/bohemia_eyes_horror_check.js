/* BOHEMIA -- EVERY PIXEL AGAINST THE BIBLE
 * EYES AND EARS, lane 17, E28 [horror check]. 9/21/26. Rule 20.
 *
 * PAOLO 9/20, LOCKED, "end of story forever": "everything that is a pixel to everything that's
 * a sound has to be thought about as analog horror... fully commit."
 * DIRECTION wrote the bible (records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md, AH-01): ten rules,
 * and -- this is the part that makes it checkable -- EVERY RULE CARRIES ITS OWN MEASURE. The
 * bible's own reading table already writes UNMEASURED in five cells and says so out loud:
 * "UNMEASURED is written where no instrument exists yet; naming it is rule 13."
 *
 * SO THIS LANE DOES NOT JUDGE THE TONE. DIRECTION DECIDES TASTE; the bible IS the taste, written
 * down. This builds the instrument for the rules whose MEASURE is a number and runs it on the
 * DEPLOYED CUT (the cutter's output, not the committed file -- E26 round 7 proved that is a file
 * nobody is served).
 *
 * WHAT IS MEASURED HERE, and only what the bible's own wording makes measurable:
 *   R3  THE LONG HOLD       "in any 4-beat window, moving pixels < 10% of the frame outside
 *                            bodies that are walking". Four beats at 120 BPM is 2.0 s. Sampled
 *                            with NOTHING TOUCHED, so walking bodies are not in it by
 *                            construction -- the player is still and anyone else moving is the
 *                            world, which is what the rule is about.
 *   R8  DIEGETIC OR DEAD    "zero full-frame overlay draws outside the fight shade and night".
 *                            Counted by wrapping the 2D context: any fill or image draw covering
 *                            90% or more of the canvas is a full-frame overlay.
 *   R10 GRIME IS BAKED      "zero runtime post-processing passes on world pixels". Counted the
 *                            same way: every non-empty ctx.filter and every composite mode other
 *                            than source-over, at the moment it is set.
 * AND WHAT IS NOT, said rather than guessed: R1, R2, R5, R6, R7, R9 and the night half of R4 need
 * either a named "wrong thing", a portrait on screen, world-state rows or nightfall, and this
 * five-minute walk reaches none of them. They are reported UNMEASURED, which is the bible's own
 * instruction, not a gap I am hiding.
 *
 * WRONG VERSION ONE, KEPT, AND ITS CONTROLS WERE ALL GREEN WHILE IT WAS WRONG. The first cut
 * reported 220 full-frame overlay draws and 2 runtime composite passes, which would have been two
 * accusations against DIRECTION's bible on his front page. Both were false and the reason was the
 * same in each: THE COUNTER COULD NOT TELL THE WORLD CANVAS FROM A SPRITE SCRATCH CANVAS. Most of
 * the 220 were 44x44 draws onto 44x44 offscreen canvases -- a draw that covers a scratch canvas
 * is not an overlay on anything -- and the three that WERE world-sized were opaque background
 * fills, which is a frame CLEAR, not an overlay. The two composites were 'source-atop', which is
 * how a sprite is tinted at bake time, not a shader over the world.
 * So the counter now records the canvas size and the alpha with every event, and a finding must
 * be on the world canvas AND be see-through. Note what this says about controls: C1, C2 and C3
 * were green, because a planted draw WAS counted. Proving a counter bites does not prove it
 * counts the right thing.
 *
 * RULE ZERO. Every counter is proved to bite before any zero is believed:
 *   C1 a planted full-frame fillRect must be counted by the R8 counter
 *   C2 a planted ctx.filter must be counted by the R10 counter
 *   C3 a planted composite mode must be counted by the R10 counter
 *   C4 the pixel comparator reads 0 for identical frames and 1 for opposite ones
 *   C5 the canvas being sampled is the world: present, sized, and not blank
 * A zero from an unproven counter is the false zero this lane published in E26 round 4.
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
const SURFACE = arg('--surface', path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html'));
const SHOTS = arg('--shots', path.join(ROOT, 'records', 'eyes_e28_horror'));
const BEATS4_MS = 2000;            /* four beats at 120 BPM, the bible's own window */
const HOLD_WINDOWS = 8;

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const page = await (await b.newContext(PHONE)).newPage();
  fs.mkdirSync(SHOTS, { recursive: true });
  const out = { what: 'every pixel against the analog horror bible', when: new Date().toISOString(),
                surface: SURFACE, bible: 'records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md (AH-01)',
                controls: [], findings: [], unmeasured: [], shots: [] };

  /* ARMED BEFORE ANY PAGE SCRIPT RUNS, in every frame, on the PROTOTYPE, because the world's
     canvas does not exist yet when this lands. */
  await page.addInitScript(() => {
    try {
      const W = window;
      W.__ahFull = []; W.__ahFilter = []; W.__ahComposite = []; W.__ahDraws = 0;
      const P = (W.CanvasRenderingContext2D || {}).prototype;
      if (!P || P.__ahHooked) return;
      const sizeOf = (ctx) => ({ cw: (ctx.canvas && ctx.canvas.width) || 0,
                                 ch: (ctx.canvas && ctx.canvas.height) || 0 });
      const covers = (ctx, w, h) => {
        const s = sizeOf(ctx);
        if (!s.cw || !s.ch) return false;
        if (typeof w !== 'number' || typeof h !== 'number') return false;
        return (w * h) >= 0.9 * s.cw * s.ch;
      };
      /* SEE-THROUGH OR IT IS NOT AN OVERLAY. An opaque full-canvas fill is the frame clear, which
         every canvas game does and the bible is not talking about. */
      const seeThrough = (ctx) => {
        if (typeof ctx.globalAlpha === 'number' && ctx.globalAlpha < 0.999) return true;
        const s = String(ctx.fillStyle || '');
        const m = s.match(/rgba?\([^)]*,\s*([0-9.]+)\s*\)/);
        if (m && parseFloat(m[1]) < 0.999) return true;
        return false;
      };
      const rf = P.fillRect;
      P.fillRect = function (x, y, w, h) {
        W.__ahDraws++;
        if (covers(this, w, h)) { const s = sizeOf(this);
          W.__ahFull.push({ kind: 'fillRect', w: Math.round(w), h: Math.round(h),
            cw: s.cw, ch: s.ch, seeThrough: seeThrough(this),
            alpha: this.globalAlpha, style: String(this.fillStyle).slice(0, 40),
            at: +performance.now().toFixed(0) }); }
        return rf.apply(this, arguments);
      };
      const rd = P.drawImage;
      P.drawImage = function () {
        W.__ahDraws++;
        const a = arguments;
        const w9 = a.length === 9 ? a[7] : (a.length === 5 ? a[3] : null);
        const h9 = a.length === 9 ? a[8] : (a.length === 5 ? a[4] : null);
        if (w9 != null && covers(this, w9, h9)) { const s = sizeOf(this);
          W.__ahFull.push({ kind: 'drawImage', w: Math.round(w9), h: Math.round(h9),
            cw: s.cw, ch: s.ch, seeThrough: seeThrough(this), alpha: this.globalAlpha,
            at: +performance.now().toFixed(0) }); }
        return rd.apply(this, arguments);
      };
      /* R10: a runtime post-processing pass is a filter or a composite mode, caught AS IT IS SET */
      const df = Object.getOwnPropertyDescriptor(P, 'filter');
      if (df && df.set) Object.defineProperty(P, 'filter', {
        configurable: true, get: df.get,
        set(v) { if (v && v !== 'none') { const s = sizeOf(this);
                   W.__ahFilter.push({ v: String(v).slice(0, 60), cw: s.cw, ch: s.ch,
                     at: +performance.now().toFixed(0) }); }
                 return df.set.call(this, v); } });
      const dc = Object.getOwnPropertyDescriptor(P, 'globalCompositeOperation');
      if (dc && dc.set) Object.defineProperty(P, 'globalCompositeOperation', {
        configurable: true, get: dc.get,
        set(v) { if (v && v !== 'source-over') { const s = sizeOf(this);
                   W.__ahComposite.push({ v: String(v).slice(0, 40), cw: s.cw, ch: s.ch,
                     at: +performance.now().toFixed(0) }); }
                 return dc.set.call(this, v); } });
      P.__ahHooked = true;
    } catch (e) {}
  });

  const snap = async (tag) => {
    const p = path.join(SHOTS, tag + '.png');
    try { await page.screenshot({ path: p }); out.shots.push(path.relative(ROOT, p)); } catch (e) {}
    return path.relative(ROOT, p);
  };
  /* the world canvas, sampled at 64x64, as raw bytes */
  const frame = () => page.evaluate(() => {
    const fr = document.getElementById('cityFrame');
    const d = (fr && fr.contentDocument) || document;
    const c = d.querySelector('canvas');
    if (!c) return null;
    const s = document.createElement('canvas'); s.width = 64; s.height = 64;
    const g = s.getContext('2d');
    try { g.drawImage(c, 0, 0, 64, 64); } catch (e) { return null; }
    return Array.from(g.getImageData(0, 0, 64, 64).data);
  }).catch(() => null);
  const movedFrac = (a, b) => {
    if (!a || !b) return null;
    let n = 0, t = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i += 4) {
      t++; if (Math.abs(a[i] - b[i]) > 8 || Math.abs(a[i+1] - b[i+1]) > 8 || Math.abs(a[i+2] - b[i+2]) > 8) n++;
    }
    return t ? +(n / t).toFixed(4) : null;
  };

  try {
    await page.goto('file://' + SURFACE, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await sleep(2500);
    await snap('00_front');
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await sleep(30000);
    await snap('01_world');

    /* ---- C4: the comparator, on data whose answer is known ---- */
    const same = new Array(64 * 64 * 4).fill(10), diff = new Array(64 * 64 * 4).fill(250);
    out.controls.push({ name: 'C4 the comparator reads 0 for identical and 1 for opposite',
      pass: movedFrac(same, same.slice()) === 0 && movedFrac(same, diff) === 1,
      detail: 'identical ' + movedFrac(same, same.slice()) + ', opposite ' + movedFrac(same, diff) });

    /* ---- C5: the canvas being sampled is the world ---- */
    const first = await frame();
    const cv = await page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const d = (fr && fr.contentDocument) || document;
      const c = d.querySelector('canvas');
      if (!c) return { found: false };
      const r = c.getBoundingClientRect();
      return { found: true, w: c.width, h: c.height, onW: Math.round(r.width), onH: Math.round(r.height) };
    }).catch(() => ({ found: false }));
    const notBlank = first && (() => { for (let i = 4; i < first.length; i += 4)
      if (Math.abs(first[i] - first[0]) > 8 || Math.abs(first[i+1] - first[1]) > 8) return true; return false; })();
    out.controls.push({ name: 'C5 the canvas sampled is the world, sized and not blank',
      pass: !!(cv.found && cv.onW > 100 && notBlank),
      detail: cv.found ? (cv.w + 'x' + cv.h + ' backing, ' + cv.onW + 'x' + cv.onH + ' on screen, '
        + (notBlank ? 'not blank' : 'BLANK')) : 'no canvas' });

    /* ---- R3 THE LONG HOLD: nothing touched, four-beat windows ---- */
    const holds = [];
    let prev = await frame();
    for (let i = 0; i < HOLD_WINDOWS; i++) {
      await sleep(BEATS4_MS);
      const now = await frame();
      const f = movedFrac(prev, now);
      if (f !== null) holds.push(f);
      prev = now;
    }
    const worst = holds.length ? Math.max(...holds) : null;
    const over = holds.filter(f => f >= 0.10).length;
    out.R3 = { windows: holds.length, window_ms: BEATS4_MS, per_window: holds,
               worst_moving_fraction: worst, windows_over_the_bibles_ten_percent: over,
               bar: 0.10 };
    if (worst !== null && worst >= 0.10) {
      out.findings.push({ rule: 'R3 THE LONG HOLD',
        measure: 'in any 4-beat window, moving pixels < 10% of the frame outside bodies that are walking',
        reading: (worst * 100).toFixed(1) + '% of the frame moved in the worst four-beat window, with '
          + over + ' of ' + holds.length + ' windows over the bar, and NOTHING WAS TOUCHED',
        frame: await snap('02_long_hold') });
    }

    /* ---- R8 and R10, read off the counters ---- */
    /* ONLY THE WORLD CANVAS COUNTS, AND ONLY A SEE-THROUGH FULL-FRAME DRAW IS AN OVERLAY.
       v1 counted 44x44 draws onto 44x44 sprite scratch canvases and the opaque background clear,
       and would have put two false accusations on his front page. */
    const counted = await page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const w = (fr && fr.contentWindow) || window;
      const d = (fr && fr.contentDocument) || document;
      const c = d.querySelector('canvas');
      const WCW = c ? c.width : 0, WCH = c ? c.height : 0;
      const onWorld = (e) => WCW > 0 && e.cw === WCW && e.ch === WCH;
      const pick = (o) => {
        const full = (o.__ahFull || []).filter(onWorld);
        const overlay = full.filter(e => e.seeThrough);
        const clears = full.filter(e => !e.seeThrough);
        return { world_canvas: WCW + 'x' + WCH,
                 full_frame_on_the_world: full.length,
                 of_those_opaque_clears: clears.length,
                 of_those_SEE_THROUGH_OVERLAYS: overlay.length,
                 overlay_examples: overlay.slice(0, 6),
                 clear_examples: clears.slice(0, 3),
                 full_frame_on_scratch_canvases: (o.__ahFull || []).length - full.length,
                 filter_on_the_world: (o.__ahFilter || []).filter(onWorld).length,
                 filter_on_scratch: (o.__ahFilter || []).filter(e => !onWorld(e)).length,
                 composite_on_the_world: (o.__ahComposite || []).filter(onWorld).length,
                 composite_on_scratch: (o.__ahComposite || []).filter(e => !onWorld(e)).length,
                 composite_examples: (o.__ahComposite || []).slice(0, 6),
                 draws: o.__ahDraws || 0 };
      };
      return { world: pick(w), shell: pick(window) };
    }).catch(() => null);
    out.counters = counted;
    if (counted && counted.world.of_those_SEE_THROUGH_OVERLAYS > 0) {
      out.findings.push({ rule: 'R8 DIEGETIC OR DEAD',
        measure: 'zero full-frame overlay draws outside the fight shade and night',
        reading: counted.world.of_those_SEE_THROUGH_OVERLAYS + ' see-through full-frame draws on the '
          + counted.world.world_canvas + ' world canvas: '
          + counted.world.overlay_examples.slice(0, 4).map(f => f.kind + ' alpha ' + f.alpha + ' ' + (f.style || '')).join(' | '),
        frame: await snap('03_full_frame') });
    }
    if (counted && (counted.world.filter_on_the_world > 0 || counted.world.composite_on_the_world > 0)) {
      out.findings.push({ rule: 'R10 GRIME IS BAKED, NEVER SHADED',
        measure: 'zero runtime post-processing passes on world pixels',
        reading: counted.world.filter_on_the_world + ' filter assignments and '
          + counted.world.composite_on_the_world + ' non-source-over composite modes ON THE WORLD CANVAS',
        frame: await snap('04_runtime_pass') });
    }

    /* ---- C1..C3: prove every counter bites, after the real reading is taken ---- */
    const before = await page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const w = (fr && fr.contentWindow) || window;
      return { f: (w.__ahFull || []).length, fi: (w.__ahFilter || []).length, c: (w.__ahComposite || []).length };
    }).catch(() => null);
    await page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const d = (fr && fr.contentDocument) || document;
      const c = d.querySelector('canvas'); if (!c) return;
      const g = c.getContext('2d'); if (!g) return;
      g.save();
      g.fillStyle = 'rgba(0,0,0,0.01)'; g.fillRect(0, 0, c.width, c.height);
      g.filter = 'blur(1px)';
      g.globalCompositeOperation = 'multiply';
      g.restore();
    }).catch(() => {});
    const after = await page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const w = (fr && fr.contentWindow) || window;
      return { f: (w.__ahFull || []).length, fi: (w.__ahFilter || []).length, c: (w.__ahComposite || []).length };
    }).catch(() => null);
    out.controls.push({ name: 'C1 the full-frame counter bites', pass: !!(before && after && after.f > before.f),
      detail: before && after ? (before.f + ' -> ' + after.f + ' after a planted full-canvas fill') : 'unreadable' });
    out.controls.push({ name: 'C2 the filter counter bites', pass: !!(before && after && after.fi > before.fi),
      detail: before && after ? (before.fi + ' -> ' + after.fi + ' after a planted blur') : 'unreadable' });
    out.controls.push({ name: 'C3 the composite counter bites', pass: !!(before && after && after.c > before.c),
      detail: before && after ? (before.c + ' -> ' + after.c + ' after a planted multiply') : 'unreadable' });

    out.unmeasured = [
      { rule: 'R1 THE ORDINARY FRAME, ONE WRONG THING', why: 'needs a named wrong thing; the bible already records the street frame as having ZERO wrong things, which it calls world-data build debt, not art' },
      { rule: 'R2 THE CAMERA DOES NOT HELP', why: 'needs the wrong thing named before a look-at can be checked against it' },
      { rule: 'R4 THE LIGHT WAS IN THE ROOM', why: 'the night half (channel disagreement under one rounding step) needs nightfall, which this walk does not reach' },
      { rule: 'R5 THE DEAD INSTITUTION’S TYPE', why: 'measurable from the shipped CSS rather than a walk; E19 already owns that sweep and it is not wired to this bible yet' },
      { rule: 'R6 THE STILL FACE', why: 'needs a portrait on screen; none appears in this walk' },
      { rule: 'R7 THE LIT STREET WITH NOBODY HOME', why: 'needs the wrongness traced to a real world-state row, which is engine state this lane does not read' },
      { rule: 'R9 THE MACHINES KEEP TALKING', why: 'needs scheduled emissions on world time, and nothing audible or scheduled surfaced in the window' },
    ];
  } catch (e) { out.ok = false; out.why = String(e).slice(0, 400); }
  await b.close();
  const bad = out.controls.filter(c => !c.pass).map(c => c.name);
  out.failing_controls = bad;
  fs.writeFileSync(path.join(ROOT, 'records', 'BOHEMIA_EYES_E28_HORROR_CHECK_9_21_26.json'),
    JSON.stringify(out, null, 2));
  console.log('  controls: ' + (bad.length ? 'FAILED -> ' + bad.join(' | ') : 'all green'));
  if (bad.length) console.log('  THE READINGS BELOW MEAN NOTHING UNTIL THE CONTROLS PASS.');
  console.log('  R3 worst four-beat window: ' + (out.R3 ? (out.R3.worst_moving_fraction * 100).toFixed(1) + '%' : 'n/a')
    + ' against a 10% bar, ' + (out.R3 ? out.R3.windows_over_the_bibles_ten_percent : '?') + ' of '
    + (out.R3 ? out.R3.windows : '?') + ' windows over');
  if (out.counters) {
    const w = out.counters.world;
    console.log('  R8 on the ' + w.world_canvas + ' world canvas: ' + w.full_frame_on_the_world
      + ' full-frame draws, of which ' + w.of_those_opaque_clears + ' are opaque clears and '
      + w.of_those_SEE_THROUGH_OVERLAYS + ' are SEE-THROUGH OVERLAYS (the rule\'s subject).');
    console.log('     and ' + w.full_frame_on_scratch_canvases + ' full-frame draws were on SPRITE '
      + 'SCRATCH canvases, which v1 counted as overlays on the world.');
    console.log('  R10 on the world: ' + w.filter_on_the_world + ' filters, '
      + w.composite_on_the_world + ' composites. On scratch canvases: ' + w.filter_on_scratch
      + ' filters, ' + w.composite_on_scratch + ' composites (sprite tinting, not a pass over the world).');
  }
  console.log('  FINDINGS: ' + out.findings.length + '   UNMEASURED AND SAID SO: ' + out.unmeasured.length);
  process.exit(0);
})();
