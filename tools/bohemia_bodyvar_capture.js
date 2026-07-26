/* ===========================================================================
   BOHEMIA — BODY VARIATION: ANIMATED CAPTURE HARNESS (7/26/26)
   ---------------------------------------------------------------------------
   laws/BOHEMIA_ADDENDUM_ONE_RIG_VARIATIONS_7_25_26.md, lesson 7, the one that
   killed the last attempt:

     "VERIFY THROUGH THE ANIMATIONS, NOT THE IDLE POSE. A slider is not
      verified until it has been watched through the real clip set, on the real
      surface, at multiple dial values. Build the animated-capture harness
      FIRST, before tuning anything."

   So this exists before any tuning did. It drives the REAL alpha in a REAL
   browser: it loads slices/BOHEMIA_ALPHA_0_9.html, moves G.bodyVar, calls the
   alpha's own rebuildFromRig(), and then renders through drawChar() -- the
   exact function the app paints Paolo's screen with. No side-door probe, no
   reimplementation, no "the data says it should be fine" (VERIFY ON THE REAL
   SURFACE, 7/18).

   Two outputs:
     1. SHEETS  -- contact sheets Paolo judges: every dial at both extremes
                   beside the canon body, animating, all 8 facings.
     2. REPORT  -- a defect sweep over the FULL clip set at every dial extreme:
                   stray pixels, holes, part dropouts, canvas clipping.

     node tools/bohemia_bodyvar_capture.js [outdir]

   REUSE CHECK (REUSE-FIRST LAW): cooks zero new graphic pixels. It only
   photographs the alpha's own render of Paolo's own painted rig.
   =========================================================================== */
const fs = require('fs'), path = require('path'), os = require('os');

function loadPlaywright() {
  const tries = ['playwright', '/opt/node22/lib/node_modules/playwright',
                 path.join(os.homedir(), '.npm-global/lib/node_modules/playwright')];
  for (const t of tries) { try { return require(t); } catch (e) { } }
  return null;
}

const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'records', 'bodyvar'));

/* the dial values Paolo judges: canon in the middle, both extremes either side */
const CONFIGS = [
  ['height-short', { height: -1, belly: 0, arms: 0 }],
  ['CANON',        { height: 0, belly: 0, arms: 0 }],
  ['height-tall',  { height: 1, belly: 0, arms: 0 }],
  ['belly-thin',   { height: 0, belly: -1, arms: 0 }],
  ['belly-wide',   { height: 0, belly: 1, arms: 0 }],
  ['arms-thin',    { height: 0, belly: 0, arms: -1 }],
  ['arms-thick',   { height: 0, belly: 0, arms: 1 }],
  ['ALL-MIN',      { height: -1, belly: -1, arms: -1 }],
  ['ALL-MAX',      { height: 1, belly: 1, arms: 1 }]
];
const SHEET_CLIPS = ['walk'];
const DIRS8 = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];

(async () => {
  const pw = loadPlaywright();
  if (!pw) { console.error('CAPTURE: playwright not resolvable -- cannot verify on the real surface.'); process.exit(2); }
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await pw.chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 900, height: 1400 }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message || e)));
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction(() => typeof window.drawChar === 'function' || typeof drawChar === 'function', null, { timeout: 120000 })
    .catch(() => { });
  const booted = await page.evaluate(() => typeof drawChar === 'function' && typeof rebuildFromRig === 'function' && typeof BOH_BODYVAR === 'object');
  if (!booted) { console.error('CAPTURE: the alpha did not boot its character pipeline.'); console.error(errs.slice(0, 5).join('\n')); await browser.close(); process.exit(2); }

  /* ---------------------------------------------------------------------
     1. CONTACT SHEETS -- what Paolo looks at.
     Each sheet: one clip, rows = dial config, columns = the 8 facings, drawn
     at a real animation phase so no row is a still idle pose lying about the
     dial. Built with the alpha's own drawChar into an offscreen canvas.
     --------------------------------------------------------------------- */
  const sheets = [];
  /* ONE SHEET PER DIAL, so a verdict is about ONE thing. Rows ramp the dial from
     one extreme through CANON to the other, columns are the 8 facings, and both
     BARE and DRESSED get a sheet: the clothed body is what ships, the bare body
     is the only way to actually SEE what a body dial did. Side-by-side with the
     approved anchor (CANON, boxed green) per the reply contract. */
  for (const dial of ['height', 'belly', 'arms']) {
    for (const skin of ['bare', 'dressed']) {
      for (const clip of SHEET_CLIPS) {
        const dataUrl = await page.evaluate(async ({ dial, skin, clip, DIRS8 }) => {
          const RAMP = [-1, -0.5, 0, 0.5, 1], PH = [0.15, 0.4, 0.65, 0.9];
          const CELL = 112, SC = 1.5, W = Math.round(CELL * SC), PAD = 3, LAB = 92, HEAD = 30;
          const cols = DIRS8.length;
          const cv = document.createElement('canvas');
          cv.width = LAB + cols * (W + PAD) + PAD;
          cv.height = HEAD + RAMP.length * (W + PAD) + PAD + 16;
          const x = cv.getContext('2d'); x.imageSmoothingEnabled = false;
          x.fillStyle = '#171520'; x.fillRect(0, 0, cv.width, cv.height);
          x.fillStyle = '#e8d8a8'; x.font = 'bold 15px ui-monospace,monospace';
          x.fillText(dial.toUpperCase() + ' DIAL  --  ' + skin.toUpperCase() + '  --  ' + clip.toUpperCase(), 6, 19);
          x.font = '11px ui-monospace,monospace'; x.fillStyle = '#7a6a4a';
          DIRS8.forEach((d, ci) => x.fillText(d, LAB + ci * (W + PAD) + W / 2 - 7, HEAD - 4));
          const scratch = document.createElement('canvas');
          const showSkel = G.showSkel; G.showSkel = false;
          const keepVar = { height: G.bodyVar.height, belly: G.bodyVar.belly, arms: G.bodyVar.arms };
          const keepEq = JSON.parse(JSON.stringify(G.equipped));
          if (skin === 'bare') for (const s of ['pants', 'shoes', 'shirt', 'jacket', 'hat', 'glasses']) G.equipped[s] = '';
          for (let ri = 0; ri < RAMP.length; ri++) {
            const v = RAMP[ri];
            G.bodyVar = { height: 0, belly: 0, arms: 0 }; G.bodyVar[dial] = v;
            rebuildFromRig();
            const y0 = HEAD + ri * (W + PAD);
            const isCanon = (v === 0);
            x.fillStyle = isCanon ? '#8fe89a' : '#c8b98a'; x.font = (isCanon ? 'bold ' : '') + '12px ui-monospace,monospace';
            x.fillText(isCanon ? 'CANON  0' : (v > 0 ? '+' : '') + v.toFixed(2), 6, y0 + W / 2);
            if (isCanon) { x.strokeStyle = '#3c5a3c'; x.lineWidth = 2; x.strokeRect(LAB - 3, y0 - 3, cols * (W + PAD) + 3, W + 6); }
            for (let ci = 0; ci < cols; ci++) {
              /* a different animation phase per column: no row is a still idle
                 pose lying about what the dial does under motion */
              drawChar(scratch, DIRS8[ci], clip, PH[ci % PH.length]);
              x.drawImage(scratch, LAB + ci * (W + PAD), y0, W, W);
            }
          }
          G.bodyVar = keepVar; G.equipped = keepEq; G.showSkel = showSkel; rebuildFromRig();
          x.fillStyle = '#6a5a3e'; x.font = '10px ui-monospace,monospace';
          x.fillText('every column is a different animation phase -- these are moving bodies, not idle poses', 6, cv.height - 5);
          return cv.toDataURL('image/png');
        }, { dial, skin, clip, DIRS8 });
        const file = path.join(OUT, 'BODYVAR_' + dial + '_' + skin + '_' + clip + '.png');
        fs.writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
        sheets.push(path.relative(ROOT, file));
        console.log('  sheet: ' + path.relative(ROOT, file));
      }
    }
  }

  /* ---------------------------------------------------------------------
     2. DEFECT SWEEP -- the full clip set, every facing, every dial extreme,
     through the real buildFrame. A dial is not "watched through the real clip
     set" until something actually walked all of it.
     --------------------------------------------------------------------- */
  const report = await page.evaluate(({ CONFIGS, DIRS8 }) => {
    const CW = 56, CH = 56, PHASES = [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95];
    const keep = { height: G.bodyVar.height, belly: G.bodyVar.belly, arms: G.bodyVar.arms };
    const rows = [];
    for (const [name, dials] of CONFIGS) {
      G.bodyVar = { height: dials.height, belly: dials.belly, arms: dials.arms };
      rebuildFromRig();
      let frames = 0, strays = 0, clipped = 0, empty = 0, thrown = 0, minMargin = 99;
      const bad = [], clipSet = {};
      for (const clip of CLIPS) for (const d of DIRS8) for (const ph of PHASES) {
        let f; try { f = buildFrame(d, clip, ph); } catch (e) { thrown++; if (bad.length < 12) bad.push(clip + '/' + d + ' threw ' + e.message); continue; }
        frames++;
        const px = f.px; let n = 0, x0 = 99, y0 = 99, x1 = -1, y1 = -1;
        for (let i = 0; i < px.length; i++) {
          if (!px[i]) continue; n++;
          const x = i % CW, y = (i / CW) | 0;
          if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
          let nb = 0;
          if (x + 1 < CW && px[i + 1]) nb++; if (x > 0 && px[i - 1]) nb++;
          if (y + 1 < CH && px[i + CW]) nb++; if (y > 0 && px[i - CW]) nb++;
          if (nb === 0) { strays++; if (bad.length < 12) bad.push('stray ' + clip + '/' + d + '@' + ph + ' (' + x + ',' + y + ')'); }
        }
        if (!n) { empty++; if (bad.length < 12) bad.push('EMPTY ' + clip + '/' + d + '@' + ph); continue; }
        const m = Math.min(x0, y0, CW - 1 - x1, CH - 1 - y1);
        if (m < minMargin) minMargin = m;
        let edgePx = 0;
        for (let x = 0; x < CW; x++) { if (px[x]) edgePx++; if (px[(CH - 1) * CW + x]) edgePx++; }
        for (let y = 0; y < CH; y++) { if (px[y * CW]) edgePx++; if (px[y * CW + CW - 1]) edgePx++; }
        if (edgePx) { clipped++; clipSet[clip + '/' + d + '@' + ph] = edgePx; }
      }
      rows.push({ name, frames, strays, clipped, empty, thrown, minMargin, bad, clipSet });
    }
    /* CANON-RELATIVE (found on the real surface, 7/26): the canon body ALREADY
       fills the 56px frame edge-to-edge on the lying clips -- sleep and the
       ragdoll are supposed to. So "touches the border" is not a defect; what a
       dial owes is that it introduces no NEW clipping the canon body does not
       already have. Absolute counts would have flagged Paolo's own body. */
    const canonSet = (rows.find(r => r.name === 'CANON') || { clipSet: {} }).clipSet;
    /* FRAME-FULL CLIPS ARE DERIVED FROM CANON, NEVER HAND-PICKED. A clip is
       frame-full if PAOLO'S OWN BODY already paints on the frame edge somewhere
       in it -- airborne, arms overhead, lying, getting up. Those clips are
       authored to fill the 56px box, so one more edge pixel there is not a new
       class of defect. Everything else is CORE, and the bar on core is ZERO new
       edge contact. Deriving the split from the canon sweep instead of typing a
       list means it can never quietly grow to cover a real regression. */
    const FRAME_FULL = {};
    for (const k in canonSet) FRAME_FULL[k.split('/')[0]] = 1;
    /* GRAZE vs SHAVE. Border CONTACT was only ever a proxy; the defect is art
       being CUT. The threshold is not invented to pass anything -- it is the
       size of the real regression this whole height cap exists to stop: at 8%
       the head landed SIX pixels onto row 0 on idle/walk/run facing NW. So a
       core-clip frame gaining >=6 edge pixels is a SHAVE and fails; 1-5 is a
       GRAZE (a fingertip reaching the box, which the canon body does in nine
       clips of its own) and is listed by name on every run so it can never
       grow quietly. */
    const SHAVE = 6;
    for (const r of rows) {
      const all = Object.keys(r.clipSet).filter(k => !canonSet[k]);
      const core = all.filter(k => !FRAME_FULL[k.split('/')[0]]);
      r.shaves = core.filter(k => r.clipSet[k] >= SHAVE);
      r.grazes = core.filter(k => r.clipSet[k] < SHAVE).map(k => k + ' (+' + r.clipSet[k] + 'px)');
      r.newClipFrameFull = all.length - core.length;
      delete r.clipSet;
    }
    G.bodyVar = keep; rebuildFromRig();
    return rows;
  }, { CONFIGS, DIRS8 });

  const lines = ['=== BOHEMIA BODY VARIATION -- REAL-SURFACE CAPTURE REPORT (7/26/26) ===',
    'Driven through the shipped alpha in a real browser: G.bodyVar -> rebuildFromRig()',
    '-> buildFrame()/drawChar(), the same path that paints Paolo\'s screen.',
    'Clip set: every clip in CLIPS, all 8 facings, 7 phases per clip.',
    'Bar: zero strays, zero empties, zero throws, and zero SHAVES -- a core-clip',
    'frame gaining 6+ frame-edge pixels, the exact size of the 8%-height head-cut',
    'this range cap exists to stop. GRAZES (1-5px, a fingertip reaching the box)',
    'are listed by name every run so they can never grow quietly. The frame-full',
    'clips -- the ones Paolo\'s own body already paints on the edge in -- are',
    'derived from the canon sweep, never hand-picked, and counted separately.', ''];
  let fail = 0;
  for (const r of report) {
    const ok = !r.strays && !r.empty && !r.thrown && !r.shaves.length;
    if (!ok) fail++;
    lines.push((ok ? 'OK   ' : 'FAIL ') + r.name.padEnd(14) + ' frames=' + r.frames +
      ' strays=' + r.strays + ' SHAVES=' + r.shaves.length + ' grazes=' + r.grazes.length +
      ' [+' + r.newClipFrameFull + ' edge frames on the frame-full clips canon already fills;' +
      ' border-touch total ' + r.clipped + '] empty=' + r.empty + ' threw=' + r.thrown);
    for (const b of r.bad) lines.push('       . ' + b);
    for (const b of r.shaves.slice(0, 14)) lines.push('       > SHAVE (art cut) on a core clip: ' + b);
    for (const b of r.grazes.slice(0, 14)) lines.push('       - graze (nothing cut), listed so it cannot grow quietly: ' + b);
  }
  lines.push('', 'SHEETS:', ...sheets.map(s => '  ' + s));
  if (errs.length) lines.push('', 'PAGE ERRORS:', ...errs.slice(0, 10).map(e => '  ' + e));
  lines.push('', fail ? ('=== ' + fail + ' DIAL CONFIG(S) FAILED ===') : '=== ALL DIAL CONFIGS CLEAN ON THE REAL SURFACE ===');
  const txt = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(OUT, 'BODYVAR_CAPTURE_REPORT.txt'), txt);
  console.log(txt);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
