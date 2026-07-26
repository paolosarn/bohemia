/* ===========================================================================
   BOHEMIA — THE ZERO MORPH PROOF SHEET (7/26/26)
   ---------------------------------------------------------------------------
   Paolo: "Show me a couple animations where there's just zero morphing. I'm
   tired of it."

   A number he cannot see is worth nothing, so this draws the claim.

   For each clip: three rows.
     ROW 1  the frames themselves, as they play
     ROW 2  BEFORE -- every pixel that CHANGED between consecutive frames, on a
            frame where the pose was NOT supposed to change. Red = morph. This is
            the old renderer, so the row is full of red.
     ROW 3  AFTER  -- the same thing with frozen poses. Empty means zero morph.
            Green marks the frames where the pose DELIBERATELY steps: that is
            animation, and it is the only thing left changing.

   Red = pixels moving when nothing asked them to. Green = a drawn pose change.
   The whole goal is a row with no red in it.

     node tools/bohemia_zero_morph_proof.js

   REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks zero art. It only
   draws frames the shipped renderer already produces, plus a diff overlay.
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
const OUTDIR = path.join(ROOT, 'records', 'zeromorph');
const SHOTS = [['walk', 'E'], ['walk', 'W'], ['run', 'E'], ['idle', 'E'], ['dance', 'E'], ['drunk', 'W']];

(async () => {
  const pw = loadPlaywright();
  if (!pw) { console.error('PROOF: playwright not resolvable.'); process.exit(2); }
  const browser = await pw.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; page.on('pageerror', e => errs.push(String(e.message || e)));
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForFunction(() => typeof buildFrame === 'function' && typeof POSEHOLD === 'object',
    null, { timeout: 180000 });

  fs.mkdirSync(OUTDIR, { recursive: true });
  const summary = [];

  for (const [clip, dir] of SHOTS) {
    const res = await page.evaluate(({ clip, dir }) => {
      const CW = 56, CH = 56, NPH = 24, Z = 4, PAD = 2;
      /* grab the 24 frames under a given setting */
      function grab(holdOn) {
        POSEHOLD.on = holdOn; POSEHOLD_CACHE.clear(); FRAME_CACHE.map.clear();
        const fs2 = [], sig = [];
        for (let k = 0; k < NPH; k++) {
          const ph = (k + 0.5) / NPH;
          let f = null; try { f = buildFrameCached(dir, clip, ph); } catch (e) { }
          fs2.push(f && f.px);
          let s = null;
          if (holdOn) { try { const h = poseHoldAt(dir, clip, ph); s = h && h.sig; } catch (e) { } }
          sig.push(s);
        }
        return { fs: fs2, sig };
      }
      const after = grab(true);
      const before = grab(false);
      POSEHOLD.on = true; POSEHOLD_CACHE.clear(); FRAME_CACHE.map.clear();

      /* the held-pose map comes from the AFTER run: which consecutive pairs are
         the same pose (so any change is morph) and which are a real step */
      const isStep = [];
      for (let k = 0; k < NPH; k++) isStep.push(k === 0 ? false : after.sig[k] !== after.sig[k - 1]);

      const cv = document.createElement('canvas');
      cv.width = PAD + NPH * (CW * Z + PAD);
      cv.height = PAD + 3 * (CH * Z + PAD) + 66;
      const g = cv.getContext('2d');
      g.imageSmoothingEnabled = false;
      g.fillStyle = '#0d0d10'; g.fillRect(0, 0, cv.width, cv.height);

      const label = (txt, y, col) => { g.fillStyle = col; g.font = 'bold 13px monospace'; g.fillText(txt, PAD + 2, y); };
      label(dir + ' / ' + clip.toUpperCase() + '  —  ROW 1: the frames as they play', 16, '#ddd');

      function put(px, col, row) {
        const ox = PAD + col * (CW * Z + PAD), oy = 24 + row * (CH * Z + PAD) + row * 20;
        const img = g.createImageData(CW * Z, CH * Z);
        for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
          const c = px ? px[y * CW + x] : null;
          for (let dy = 0; dy < Z; dy++) for (let dx = 0; dx < Z; dx++) {
            const o = (((y * Z + dy) * CW * Z) + (x * Z + dx)) * 4;
            if (c) { img.data[o] = c[0]; img.data[o + 1] = c[1]; img.data[o + 2] = c[2]; img.data[o + 3] = 255; }
            else { const chk = ((x >> 2) + (y >> 2)) & 1; const v = chk ? 26 : 20;
                   img.data[o] = v; img.data[o + 1] = v; img.data[o + 2] = v + 4; img.data[o + 3] = 255; }
          }
        }
        g.putImageData(img, ox, oy);
        return { ox, oy };
      }
      /* diff overlay: red = changed while the pose was HELD (morph),
                       green = changed because the pose STEPPED (animation) */
      function putDiff(A, B, stepped, col, row) {
        const ox = PAD + col * (CW * Z + PAD), oy = 24 + row * (CH * Z + PAD) + row * 20;
        const img = g.createImageData(CW * Z, CH * Z);
        let n = 0;
        for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
          const i = y * CW + x, a = A ? A[i] : null, b = B ? B[i] : null;
          let changed = false;
          if (!a && !b) changed = false;
          else if (!a || !b) changed = true;
          else changed = (a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2]);
          if (changed) n++;
          const R = changed ? (stepped ? 40 : 255) : 16;
          const G = changed ? (stepped ? 220 : 30) : 16;
          const Bl = changed ? (stepped ? 60 : 30) : 20;
          for (let dy = 0; dy < Z; dy++) for (let dx = 0; dx < Z; dx++) {
            const o = (((y * Z + dy) * CW * Z) + (x * Z + dx)) * 4;
            img.data[o] = R; img.data[o + 1] = G; img.data[o + 2] = Bl; img.data[o + 3] = 255;
          }
        }
        g.putImageData(img, ox, oy);
        return n;
      }

      let beforeMorph = 0, afterMorph = 0, beforeFrames = 0, afterFrames = 0;
      for (let k = 0; k < NPH; k++) put(after.fs[k], k, 0);
      label('ROW 2: BEFORE — red = pixels that moved while the pose was HELD (morph)', 24 + (CH * Z + PAD) + 16, '#f66');
      for (let k = 1; k < NPH; k++) {
        if (isStep[k]) continue;
        const n = putDiff(before.fs[k - 1], before.fs[k], false, k, 1);
        if (n) { beforeMorph += n; beforeFrames++; }
      }
      label('ROW 3: AFTER — red = morph (should be none), green = the pose deliberately steps', 24 + 2 * (CH * Z + PAD) + 36, '#6f6');
      for (let k = 1; k < NPH; k++) {
        const n = putDiff(after.fs[k - 1], after.fs[k], isStep[k], k, 2);
        if (!isStep[k] && n) { afterMorph += n; afterFrames++; }
      }
      const poses = new Set(after.sig.filter(Boolean)).size;
      return { png: cv.toDataURL('image/png'), beforeMorph, beforeFrames, afterMorph, afterFrames, poses };
    }, { clip, dir });

    const file = path.join(OUTDIR, `ZEROMORPH_${dir}_${clip}.png`);
    fs.writeFileSync(file, Buffer.from(res.png.split(',')[1], 'base64'));
    summary.push({ clip, dir, ...res, file: path.relative(ROOT, file) });
    console.log(`${dir}/${clip}: morph pixels during holds  BEFORE ${res.beforeMorph} (on ${res.beforeFrames} frames)  ->  AFTER ${res.afterMorph}   drawn poses ${res.poses}`);
  }

  await browser.close();

  const L = [];
  L.push('BOHEMIA — ZERO MORPH PROOF (7/26/26)');
  L.push('');
  L.push('Paolo: "Show me a couple animations where there\'s just zero morphing."');
  L.push('');
  L.push('MORPH is defined the only way that is fair: a pixel that changes on a frame');
  L.push('where the POSE DID NOT CHANGE. A pose change is animation and is excluded.');
  L.push('');
  L.push('clip        morph pixels during holds      drawn poses');
  L.push('            before        ->     after     per clip');
  L.push('-'.repeat(58));
  for (const s of summary)
    L.push(`${(s.dir + '/' + s.clip).padEnd(12)}${String(s.beforeMorph).padStart(6)} (${String(s.beforeFrames).padStart(2)} frames) -> ${String(s.afterMorph).padStart(6)}      ${s.poses}`);
  L.push('');
  L.push('Sheets (row 1 the frames, row 2 before, row 3 after):');
  for (const s of summary) L.push('  ' + s.file);
  L.push('');
  L.push(errs.length ? 'PAGE ERRORS:\n  ' + errs.slice(0, 6).join('\n  ') : 'page errors: none');
  L.push('');
  L.push('regenerate: node tools/bohemia_zero_morph_proof.js');
  const rep = path.join(ROOT, 'records', 'BOHEMIA_ZERO_MORPH_PROOF_7_26_26.txt');
  fs.writeFileSync(rep, L.join('\n') + '\n');
  console.log('\n' + L.join('\n'));
})();
