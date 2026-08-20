/* HOW MUCH OF "HIS HEAD RENDERS AS A BOX" IS ACTUALLY HIS ART? (8/20/26)
 *
 * Row 2X's own blocker, verbatim: "AT 112 NATIVE HIS HEAD RENDERS AS A BOX.
 * Flat-sided hair, a jaw that drops straight down with no taper. His art holds
 * 56x56 of information and doubling invents none -- and Scale2x does not merely
 * enlarge, IT ROUNDS DIAGONAL CORNERS." So the roundness he has approved in every
 * build was manufactured by the upscaler, and composing natively deletes it.
 * (records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)
 *
 * THAT FINDING IS TRUE AND IT IS ALSO UNDIFFERENTIATED. "Repaint the rig at 112"
 * is the most expensive instruction on the board and it is aimed at Paolo's own
 * hand, so before it goes to him it is worth knowing WHICH PIXELS actually lose
 * their rounding -- because not all of them are his.
 *
 *   HIS PAINTED ART   head, face, neck, torso, arms, hands, legs, feet, and the
 *                     PD layers on top. RIG LAW: sacrosanct. Only he can add
 *                     detail here, and that is the ask.
 *   GENERATED CODE    every garment and every hairstyle -- 13 functions that
 *                     DRAW, and as of today draw natively at any resolution.
 *                     Rounding here is mine to author and costs him nothing.
 *
 * If most of the lost rounding sits on generated pixels, the ask shrinks from
 * "repaint everything" to "repaint the head", or less.
 *
 * WHAT IT MEASURES, on the real rig, all 8 facings:
 *   A  the frame Scale2x produces at 112   -- what he has always seen
 *   B  the same frame block-doubled to 112 -- what native composition gives
 *      painted content, with no rounding manufactured
 * Every pixel where A and B disagree is a pixel whose roundness was a gift from
 * the upscaler. Each one is then classified by the PART underneath it, and by
 * whether it sits on the head/face silhouette or elsewhere.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and measures, writes nothing back. It
 * never touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)
 *   joints: none named       parts: reads part ids 1-12 to classify, sets none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It calls the alpha's own buildFrame and
 * the alpha's own Scale2x and compares their output; it draws nothing of its own,
 * so there is no bank to shop.
 *
 *   node tools/bohemia_2x_box_measure.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/BOHEMIA_HOW_MUCH_OF_THE_BOX_IS_HIS_8_20_26.txt');

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 900, height: 1400 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof buildFrame === 'function' && typeof Scale2x !== 'undefined', { timeout: 30000 });

  const R = await pg.evaluate(() => {
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const PARTN = { 0: 'background', 1: 'head', 2: 'face', 3: 'neck', 4: 'torso', 5: 'armL', 6: 'armR',
                    7: 'handL', 8: 'handR', 9: 'legL', 10: 'legR', 11: 'footL', 12: 'footR' };
    const same = (a, b) => (!a && !b) ? true : (!a || !b) ? false : (a[0] === b[0] && a[1] === b[1] && a[2] === b[2]);
    const out = { dirs: [], byPart: {}, totals: { painted: 0, generated: 0, diff: 0, lit: 0 } };

    for (const d of DIRS) {
      const f = buildFrame(d, 'idle', 0);
      const W = f.CW, H = f.CH, px = f.px, grid = f.grid;
      /* A: the alpha's OWN Scale2x, the same call drawChar makes */
      const A = Scale2x.scale2x(px, W, H, same).data;
      /* B: block-double -- what native composition gives a PAINTED pixel */
      const N = W * 2;
      const B = new Array(N * N).fill(null);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = px[y * W + x];
        B[(y*2)*N + x*2] = c; B[(y*2)*N + x*2+1] = c; B[(y*2+1)*N + x*2] = c; B[(y*2+1)*N + x*2+1] = c; }

      let diff = 0, lit = 0, headDiff = 0, silhouetteDiff = 0;
      const parts = {};
      for (let i = 0; i < N * N; i++) {
        const a = A[i], b = B[i];
        if (a) lit++;
        if (same(a, b)) continue;
        diff++;
        /* the SOURCE cell that produced this pixel names the part underneath */
        const sx = ((i % N) / 2) | 0, sy = ((i / N | 0) / 2) | 0;
        const p = grid[sy * W + sx] | 0;
        parts[p] = (parts[p] || 0) + 1;
        if (p === 1 || p === 2) headDiff++;
        /* A SILHOUETTE PIXEL is one where exactly one of the two is painted --
           the outline moved, which is what "box" means. An interior disagreement
           is a shading step, which reads as texture, not shape. */
        if (!a !== !b) silhouetteDiff++;
      }
      for (const p in parts) { out.byPart[p] = (out.byPart[p] || 0) + parts[p]; }
      out.totals.diff += diff; out.totals.lit += lit;
      out.dirs.push({ d, lit, diff, headDiff, silhouetteDiff,
                      pct: +(100 * diff / Math.max(1, lit)).toFixed(2) });
    }

    /* *** THE DECIDING CROSS. A rounding pixel on the TORSO of a dressed body is
       showing a SHIRT, and a shirt is code. Classify every changed pixel by
       whether a GENERATOR owns the cell it came from (or, for a pixel Scale2x
       painted out into the background, the nearest lit cell it grew from) --
       because that is exactly the line between "Paolo has to repaint it" and "I
       can author it round and it costs him nothing". *** */
    /* THREE FITS, because the answer MOVES with how dressed he is and a single
       sample would be a number pretending to be a law. Bare is the floor (only
       hair is code), everyday is the common case, heavy is what a survivor in
       this city actually wears. */
    const CANON = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const pick = n => CANON.filter(g => g.n === n)[0];
    const pickLayer = l => CANON.filter(g => g.layer === l)[0];
    const hairG = CANON.filter(g => g.layer === 'hair')[0];
    const FITS = [
      ['bare + hair', [hairG]],
      ['everyday', [pick('WHITE TEE'), pick('BLUE JEANS'), pick('BROWN BOOTS'), hairG]],
      ['heavy', [pick('WHITE TEE'), pick('BLUE JEANS'), pick('BROWN BOOTS'), hairG,
                 pickLayer('outer'), pickLayer('head'), pickLayer('neck'),
                 pickLayer('gear'), pickLayer('hands'), pickLayer('waist')]],
    ];
    out.fits = [];
    for (const [fitName, fitItems] of FITS) {
    const worn = fitItems.filter(Boolean);
    const cross = { generated: 0, painted: 0, unknown: 0, sample: '' };
    try {
      cross.sample = worn.map(g => g.n).join(' + ');
      for (const d of DIRS) {
        if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
        const f = buildFrame(d, 'idle', 0);
        const W = f.CW, H = f.CH, N = W * 2;
        const cov = {};
        for (const g of worn) {
          let o = null; try { o = g.gen(f.grid, W, H); } catch (e) {}
          if (o) for (const k in o) cov[+k] = 1;
        }
        const A = Scale2x.scale2x(f.px, W, H, same).data;
        const B = new Array(N * N).fill(null);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = f.px[y * W + x];
          B[(y*2)*N + x*2] = c; B[(y*2)*N + x*2+1] = c; B[(y*2+1)*N + x*2] = c; B[(y*2+1)*N + x*2+1] = c; }
        for (let i = 0; i < N * N; i++) {
          if (same(A[i], B[i])) continue;
          const sx = ((i % N) / 2) | 0, sy = ((i / N | 0) / 2) | 0, si = sy * W + sx;
          /* the cell itself if it is lit; otherwise the lit neighbour Scale2x grew
             this pixel out of -- a corner fill belongs to whatever it rounded */
          let owner = -1;
          if (f.px[si]) owner = si;
          else { const nb = [si - 1, si + 1, si - W, si + W];
            for (const j of nb) if (j >= 0 && j < W * H && f.px[j]) { owner = j; break; } }
          if (owner < 0) cross.unknown++;
          else if (cov[owner]) cross.generated++;
          else cross.painted++;
        }
      }
      if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    } catch (e) { cross.err = String(e); }
    cross.fit = fitName;
    out.fits.push(cross);
    }
    out.cross = out.fits[1] || out.fits[0];

    /* AND THE HALF THAT IS NOT HIS. Run the wardrobe over the same body and count
       how many of the frame's lit pixels a garment or a hairstyle owns -- those
       are pixels a generator can author round at 112 without touching his art. */
    const own = { generated: 0, painted: 0 };
    try {
      const f = buildFrame('S', 'idle', 0);
      const W = f.CW;
      let lit = 0; for (let i = 0; i < W * W; i++) if (f.px[i]) lit++;
      /* GARMENTS is the alpha's own catalogue; a canon everyday fit is the honest
         sample -- not a naked body, which nobody in the game is. */
      const wornNames = ['WHITE TEE', 'WORK PANTS', 'BROWN BOOTS'];
      const G = (window.GARMENTS || []).filter(g => wornNames.indexOf(g.n) >= 0);
      const covered = {};
      for (const g of G) { let o = null; try { o = g.gen(f.grid, W, W); } catch (e) {}
        if (o) for (const k in o) covered[k] = 1; }
      /* hair too: it is generated, and it is half of the head's outline */
      const H = (window.GARMENTS || []).filter(g => g.layer === 'hair' && g.st === 'canon')[0];
      if (H) { let o = null; try { o = H.gen(f.grid, W, W); } catch (e) {}
        if (o) for (const k in o) covered[k] = 1; }
      own.generated = Object.keys(covered).length;
      own.painted = lit - own.generated;
      own.sample = wornNames.concat(H ? [H.n] : []).join(' + ');
    } catch (e) { own.err = String(e); }
    out.own = own;
    return out;
  });

  await browser.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const L = [];
  L.push('BOHEMIA -- HOW MUCH OF "HIS HEAD RENDERS AS A BOX" IS ACTUALLY HIS ART');
  L.push('CHARACTER lane, 8/20/26. Measured on the real rig, all 8 facings, by');
  L.push('tools/bohemia_2x_box_measure.js. Nothing here is estimated.');
  L.push('');
  L.push('THE QUESTION. Row 2X is blocked on one finding: composing natively at 112');
  L.push('deletes the corner-rounding Scale2x was manufacturing, so his head reads as');
  L.push('a box, and the fix is PAINT at 112 -- his hand, the most expensive ask on');
  L.push('the board. Before it goes to him: which pixels actually lose their rounding,');
  L.push('and are they his painted art or code that can be authored round for free?');
  L.push('');
  L.push('WHAT SCALE2X IS ADDING, PER FACING');
  L.push('  facing   lit px   changed   % of body   on head/face   on the OUTLINE');
  for (const r of R.dirs) {
    L.push('  ' + r.d.padEnd(8) + String(r.lit).padStart(6) + String(r.diff).padStart(10) +
           (r.pct + '%').padStart(12) + String(r.headDiff).padStart(15) + String(r.silhouetteDiff).padStart(17));
  }
  const tot = R.dirs.reduce((a, r) => ({ lit: a.lit + r.lit, diff: a.diff + r.diff,
    head: a.head + r.headDiff, sil: a.sil + r.silhouetteDiff }), { lit: 0, diff: 0, head: 0, sil: 0 });
  L.push('  ' + 'ALL 8'.padEnd(8) + String(tot.lit).padStart(6) + String(tot.diff).padStart(10) +
         ((100 * tot.diff / tot.lit).toFixed(2) + '%').padStart(12) + String(tot.head).padStart(15) + String(tot.sil).padStart(17));
  L.push('');
  L.push('WHERE THE ROUNDING LIVES, BY PART (all 8 facings pooled)');
  const PARTN = { 0: 'background', 1: 'head', 2: 'face', 3: 'neck', 4: 'torso', 5: 'arm L', 6: 'arm R',
                  7: 'hand L', 8: 'hand R', 9: 'leg L', 10: 'leg R', 11: 'foot L', 12: 'foot R' };
  const rows = Object.keys(R.byPart).map(p => [PARTN[p] || ('part ' + p), R.byPart[p]])
    .sort((a, b) => b[1] - a[1]);
  for (const [n, c] of rows) L.push('  ' + n.padEnd(14) + String(c).padStart(7) +
    ('  ' + (100 * c / tot.diff).toFixed(1) + '% of all the rounding').padStart(10));
  L.push('');
  L.push('WHO OWNS THE PIXELS (facing S, a dressed body, ' + (R.own.sample || 'n/a') + ')');
  L.push('  generated by code (garments + hair) : ' + R.own.generated);
  L.push('  his painted art                     : ' + R.own.painted);
  L.push('');
  L.push('*** WHO OWNS THE ROUNDING ITSELF -- the number that decides the ask ***');
  L.push('All 8 facings. A rounding pixel on a covered cell is showing a GARMENT, and');
  L.push('a garment is code: I can author it round at 112 and it costs him nothing.');
  L.push('');
  L.push('  fit           mine   his    mine%   what is worn');
  for (const C of (R.fits || [])) {
    const ct = (C.generated || 0) + (C.painted || 0) + (C.unknown || 0);
    L.push('  ' + String(C.fit).padEnd(14) + String(C.generated || 0).padStart(5) +
           String(C.painted || 0).padStart(6) +
           ((100 * (C.generated || 0) / Math.max(1, ct)).toFixed(1) + '%').padStart(8) +
           '   ' + (C.sample || 'n/a'));
    if (C.err) L.push('    ERROR: ' + C.err);
  }
  L.push('');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nWROTE ' + path.relative(REPO, OUT));
})();
