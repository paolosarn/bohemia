#!/usr/bin/env node
/* THE COAT IS TIED TO THE LEGS -- gate for Paolo 9/7:
     "the trenchcoat, as will be the nature for any long jackets and coats, has to
      be done a lot better; it's glitching and popping out of place; tie it more
      to the legs, it feels like it's freestyling where to go."

   Two defects were measured on the real rig before this, both in genCoat:

   1 THE SKIRT NEVER LOOKED AT A LEG. It was a cone about the torso's centroid
     running in the GAP between two striding thighs, so 12.2% of leg pixels sat
     OUTSIDE the coat's own span on rows the coat covered -- 23% facing away, 16
     pixels on the worst row.
   2 THE HIP WAS A SCANLINE. The skirt's base width came from the torso's extent
     on ONE row, and whichever arm is swinging covers part of that row and
     uncovers a sliver past it: the measured hip read 4 px on one frame and 14 on
     the very next with nothing in the body moving. Facing you the coat changed
     31% of its own area in a single frame while the body changed 9.7%.

   Everything here is measured on buildFrame's real posed grids, all eight
   facings, all 24 walk buckets -- never on a mannequin, because a mannequin has
   no stride and no swinging arm and cannot show either defect.   ANIMATION 9/12 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nTHE COAT IS TIED TO THE LEGS GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

if (!fs.existsSync(ALPHA)) { console.log('  FAIL the alpha is missing'); fail++; done(); }
const src = fs.readFileSync(ALPHA, 'utf8');

/* pull genCoat and its pure helpers out of the alpha, same door open_coat_gate uses */
function grab(name) {
  const re = new RegExp('\\n\\s*function ' + name + '\\s*\\(');
  const m = re.exec(src); if (!m) return null;
  let i = src.indexOf('{', m.index + m[0].length - 1), d = 0, j = i;
  for (; j < src.length; j++) { if (src[j] === '{') d++; else if (src[j] === '}') { d--; if (!d) { j++; break; } } }
  return src.slice(m.index, j);
}
const NAMES = ['rsc', 'fr', 'mix', 'bshade', 'ext', 'pExt', 'legSpan', 'genCoat'];
const bodies = NAMES.map(grab);
ok('genCoat and its helpers are in the alpha (' + NAMES.join(', ') + ')', bodies.every(Boolean));
if (!bodies.every(Boolean)) { console.log('     missing: ' + NAMES.filter((n, i) => !bodies[i]).join(', ')); done(); }
const SRC = bodies.join('\n');

/* THE SKIRT IS WHAT READS THE LEGS, so the code claim is on the skirt loop, not
   on the file: legSpan existing proves nothing if the row loop never asks it. */
const coatBody = grab('genCoat');
ok('the skirt row loop asks legSpan where the legs are', /LD\s*=[^;]*legSpan\(g\)/.test(coatBody) && /LD\.has\[y2\]/.test(coatBody));
/* THE HIP IS NOT A SCANLINE, and this one is a CODE claim on purpose: a gate
   that recomputes the hip itself and then checks its own arithmetic is testing
   the gate, not the game. The DATA claim that the fix works is the pop claim at
   the bottom -- putting the scanline back takes the coat from 17.9% to 27% of
   its own area in a single frame and that claim goes red. */
ok('and the skirt\'s width comes from the torso\'s AREA over its HEIGHT, never one row of it',
   /tArea\s*\/\s*\(tb-ttop\+1\)/.test(coatBody) && !/g\[tb\*CW\+hx\]===4/.test(coatBody));

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  const R = await pg.evaluate(({ SRC }) => {
    const mk = new Function('CW', 'CH', 'curDir', SRC + '\nreturn {genCoat:genCoat};');
    const RAMP = { dk: [40, 30, 20], mid: [90, 70, 50], lt: [140, 110, 80] };
    const D = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const out = { spill: 0, legPx: 0, byDir: {}, hipJump: {}, churn: {}, vestSpill: 0, vestLeg: 0, tent: 0, tentAt: '', threw: [] };

    for (const d of D) {
      let spill = 0, legPx = 0, worstRow = 0;
      const hips = [], masks = [], bodyMasks = [];
      for (let k = 0; k < 24; k++) {
        let f; try { f = buildFrame(d, 'walk', k / 24); } catch (e) { out.threw.push(d + '/' + k + ' ' + e.message); continue; }
        const g = f.grid, CW = f.CW, CH = f.CH;
        let coat, vest;
        try { const M = mk(CW, CH, d);
          coat = M.genCoat(g, { ramp: RAMP, len: 0.86, open: 1, dir: d });
          vest = M.genCoat(g, { ramp: RAMP, vest: true, dir: d }); }
        catch (e) { out.threw.push(d + '/' + k + ' ' + e.message); continue; }

        /* the hip number the skirt's width is built from: the torso's own
           typical width, area over height */
        let tArea = 0, tTop = CH, tBot = -1;
        for (let i = 0; i < g.length; i++) if (g[i] === 4) { tArea++; const y = (i / CW) | 0; if (y < tTop) tTop = y; if (y > tBot) tBot = y; }
        hips.push(tArea ? Math.round(tArea / (tBot - tTop + 1)) : 0);

        const m = new Uint8Array(CW * CH), bm = new Uint8Array(CW * CH);
        for (let i = 0; i < CW * CH; i++) { if (coat[i] !== undefined) m[i] = 1; if (g[i]) bm[i] = 1; }
        masks.push(m); bodyMasks.push(bm);

        /* the tent ruler: widest row of the coat against widest row of the body */
        let cWide = 0, bWide = 0;
        for (let y = 0; y < CH; y++) { let a = CW, b = -1, p = CW, q = -1;
          for (let x = 0; x < CW; x++) { if (coat[y * CW + x] !== undefined) { if (x < a) a = x; if (x > b) b = x; }
            if (g[y * CW + x]) { if (x < p) p = x; if (x > q) q = x; } }
          if (b >= 0 && b - a + 1 > cWide) cWide = b - a + 1;
          if (q >= 0 && q - p + 1 > bWide) bWide = q - p + 1; }
        if (bWide && cWide / bWide > out.tent) { out.tent = cWide / bWide; out.tentAt = d + ' bucket ' + k; }

        for (let y = 0; y < CH; y++) {
          let cMn = 1e9, cMx = -1, vMn = 1e9, vMx = -1; const lxs = [];
          for (let x = 0; x < CW; x++) {
            const id = g[y * CW + x];
            if (id >= 9 && id <= 12) lxs.push(x);
            if (coat[y * CW + x] !== undefined) { if (x < cMn) cMn = x; if (x > cMx) cMx = x; }
            if (vest[y * CW + x] !== undefined) { if (x < vMn) vMn = x; if (x > vMx) vMx = x; }
          }
          if (!lxs.length) continue;
          if (cMx >= 0) { let o1 = 0; for (const x of lxs) if (x < cMn || x > cMx) o1++;
            spill += o1; legPx += lxs.length; if (o1 > worstRow) worstRow = o1; }
          /* CONTROL: a VEST has no skirt, so on the same rows the same ruler must
             find almost every leg pixel outside it. A ruler that scores the vest
             like the coat is measuring the body, not the garment. */
          if (vMx >= 0) { let o2 = 0; for (const x of lxs) if (x < vMn || x > vMx) o2++;
            out.vestSpill += o2; out.vestLeg += lxs.length; }
        }
      }
      out.byDir[d] = { spillPct: legPx ? +(100 * spill / legPx).toFixed(1) : 0, worstRow: worstRow };
      out.spill += spill; out.legPx += legPx;

      let hj = 0;
      for (let k = 0; k < hips.length; k++) { const j = Math.abs(hips[(k + 1) % hips.length] - hips[k]); if (j > hj) hj = j; }
      out.hipJump[d] = hj;

      let worstC = 0, worstB = 0;
      for (let k = 0; k < masks.length; k++) {
        const a = masks[k], b = masks[(k + 1) % masks.length], p = bodyMasks[k], q = bodyMasks[(k + 1) % bodyMasks.length];
        let dc = 0, db = 0, ac = 0, ab = 0;
        for (let i = 0; i < a.length; i++) { if (a[i] !== b[i]) dc++; if (p[i] !== q[i]) db++; if (a[i]) ac++; if (p[i]) ab++; }
        if (ac && dc / ac > worstC) worstC = dc / ac;
        if (ab && db / ab > worstB) worstB = db / ab;
      }
      out.churn[d] = { coat: +(100 * worstC).toFixed(1), body: +(100 * worstB).toFixed(1) };
    }
    out.spillPct = out.legPx ? +(100 * out.spill / out.legPx).toFixed(2) : 0;
    out.vestPct = out.vestLeg ? +(100 * out.vestSpill / out.vestLeg).toFixed(1) : 0;
    out.tent = +out.tent.toFixed(2);
    return out;
  }, { SRC });

  ok('every walk frame builds and every coat generates (8 facings x 24 buckets)', R.threw.length === 0);
  if (R.threw.length) console.log('     ' + R.threw.slice(0, 3).join(' | '));

  /* 1 THE SKIRT REACHES THE LEG IT COVERS. 12.2% before, 3.9% after. The ceiling
     is 7%: half the old number, and well clear of the new one, so a rewrite that
     quietly drops the reach cannot slip under it. */
  ok('THE SKIRT DRAPES ON THE THIGH, IT DOES NOT RUN IN THE GAP: ' + R.spillPct +
     '% of leg pixels sit outside the coat on rows it covers (was 12.2%, ceiling 7%)',
     R.spillPct <= 7);

  /* 2 AND NO FACING IS ABANDONED. Facing away was the worst at 23% and the
     overall number hid it: a mean can pass while a quarter of the compass is
     broken, which is exactly what it did. */
  const worstDir = Object.keys(R.byDir).reduce((a, b) => R.byDir[a].spillPct >= R.byDir[b].spillPct ? a : b);
  ok('AND NO FACING IS ABANDONED: worst is ' + worstDir + ' at ' + R.byDir[worstDir].spillPct +
     '% (was 23%, ceiling 12%)', R.byDir[worstDir].spillPct <= 12);

  const worstRow = Math.max.apply(null, Object.keys(R.byDir).map(d => R.byDir[d].worstRow));
  ok('and no single row leaves half a thigh outside the coat: worst row ' + worstRow +
     ' px (was 16, ceiling 12)', worstRow <= 12);

  /* 3 AND IT NEVER PITCHES A TENT. The reach has a cap for a reason: a panel
     free to chase a wide stride stops being a coat. Widest coat row over widest
     body row is 1.19 with the cap and 1.56 without it. */
  ok('AND IT NEVER PITCHES A TENT: the widest row of the coat is ' + R.tent +
     'x the widest row of the body (ceiling 1.30, and 1.19 before this shipped too)', R.tent <= 1.30);

  /* 4 AND THE COAT DOES NOT CHURN HARDER THAN THE MAN WEARING IT. Facing you is
     the case: the body barely changes there, so a coat that jumps is the coat's
     own fault and nothing else's. */
  const S = R.churn.S;
  ok('AND IT DOES NOT POP: facing you the coat changes at most ' + S.coat +
     '% of its own area in one frame against the body\'s ' + S.body +
     '% (was 30.8%, ceiling 22%)', S.coat <= 22);

  /* CONTROL */
  ok('CONTROL: the same ruler on a VEST, which has no skirt, finds ' + R.vestPct +
     '% of leg pixels outside it -- a ruler scoring the vest like the coat is measuring the body, not the garment',
     R.vestPct >= 60);

  console.log('');
  console.log('  dir   spill%  worstRow   hip jump   coat churn / body churn');
  for (const d of Object.keys(R.byDir)) {
    const v = R.byDir[d], c = R.churn[d];
    console.log('   ' + d.padEnd(4) + String(v.spillPct).padStart(6) + String(v.worstRow).padStart(10) +
                String(R.hipJump[d]).padStart(11) + String(c.coat + '%').padStart(14) + ' / ' + (c.body + '%'));
  }
  console.log('  overall ' + R.spillPct + '% of ' + R.legPx + ' leg pixels  (12.21% before this shipped)');

  await br.close();
  done();
})().catch(e => { console.log('  FAIL gate threw: ' + e.message); fail++; done(); });
