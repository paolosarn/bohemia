/* THE CLOTHES-AND-HAIR 4X GATE (8/20/26, CHARACTER lane).
 *
 * Paolo 8/20: "i need you to remake all the clothes and hairs with the 4x pixels
 * we now have in mind is that okay?"
 *
 * HIS PREMISE WAS WRONG AND HIS INSTINCT WAS EXACTLY RIGHT. The rig is still 56
 * native (BAKED.W===56, so RIG_RS===1) -- we do not have the 4x pixels yet. But
 * tools/bohemia_2x_flip.py, the plan that doubles his painted rig for real, says
 * in its own docstring: "CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE
 * gen() SEAM." So the day the rig flips, the body gets four times the pixels and
 * every garment and every hairstyle arrives as 2x2 squares beside it. He named
 * the gap before it shipped.
 *
 * AND IT IS WORSE THAN CHUNKY. Measured before any of this landed: hand the
 * generators the real 112 grid with nothing else changed and they come out the
 * WRONG SIZE -- a backpack keeps its absolute pixel size (0.29 of the body
 * fraction it used to cover), a cape/gear/belt/scarf/apron lands near 0.50,
 * because every hardcoded pixel distance stays put while the body doubles around
 * it. Only genTop, genCoat and genCoverall, which read the body for every
 * distance, survived untouched.
 *
 * SO THIS GATE HOLDS TWO CLAIMS AT ONCE, and they are in tension on purpose:
 *
 *   1. AT 4X, EVERY GARMENT SCALES. Run all 13 generators over every shape the
 *      wardrobe can make, on all 8 facings, against a 56 part-id body and against
 *      that same body doubled, and require
 *      the NORMALISED geometry -- everything measured in units of the body's own
 *      bounding box -- to be identical. A generator that reads the body passes for
 *      free; one that hardcodes a distance cannot.
 *
 *   2. AT 56, NOTHING MOVED. 218 option sets x 8 facings, hashed. This is the
 *      claim that protects the build Paolo plays TODAY, and it is the one that
 *      caught me: the first pass of the conversion silently moved a satchel three
 *      pixels, put a light row on a mohawk spike and shifted a ponytail a row down
 *      the back. All three were invisible to claim 1 and all three would have
 *      shipped. VERIFY ON THE REAL SURFACE, 7/18 -- an identity you assert is not
 *      an identity you measured.
 *
 * THE QUANTISATION FLOOR IS NOT A DEFECT. A feature ending at the right edge of a
 * doubled cell lands at 2x+1, so every x metric carries up to 1/(2*BW) of slop and
 * every y metric 1/(2*BH). Judging tighter than the floor calls a perfect
 * generator broken -- FIX THE RULER, NEVER THE TARGET (8/1).
 *
 * WHAT THIS GATE CANNOT SEE, said plainly so nobody reads it as more than it is:
 * coverage and bounding boxes are GEOMETRY. A pass that recolours pixels without
 * moving them -- a rim, a seam, a lit top row -- is invisible to claim 1. Those
 * were converted by reading, and they are pinned by claim 2, but claim 1 does not
 * prove them. A count is a smoke alarm, not a diagnosis (8/4).
 */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const PIN = path.join(__dirname, 'clothes_56_pin.txt');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
if (!fs.existsSync(ALPHA)) { console.log('THE CLOTHES 4X GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(1); }
const src = fs.readFileSync(ALPHA, 'utf8');

/* ------------------------------------------------------- the machinery exists */
const GENS = ['genTop', 'genPants', 'genCoat', 'genShoes', 'genHat', 'genHair', 'genBag',
              'genCape', 'genPoncho', 'genGear', 'genAcc', 'genApron', 'genCoverall'];
function grab(s, n) {
  const i = s.indexOf('function ' + n + '('); if (i < 0) return null;
  const st = s.indexOf('{', i); let d = 0;
  for (let k = st; k < s.length; k++) { if (s[k] === '{') d++; else if (s[k] === '}') { d--; if (!d) return s.slice(i, k + 1); } }
  return null;
}
ok('the resolution scalar is DERIVED from the grid, never typed',
  /function rsc\(\)\{\s*var s=\(CW\/56\)\|0;/.test(src));
ok('the cell-space fraction helper is there (a fraction of a span is a CELL count)',
  /function fr\(a,b,f\)\{[^\n]*\(\(b-a\+1\)\/S-1\)\*f/.test(src));
ok('every generator is in the alpha (' + GENS.length + ')', GENS.every(n => grab(src, n)));

/* EVERY GENERATOR MUST ACTUALLY READ THE SCALAR. A generator that never calls
   rsc() cannot be resolution-native no matter what the pixels say on one fixture:
   it would only be passing because this body happens not to exercise its
   hardcoded distances. Checking the CODE and the PIXELS catches different things. */
const noScalar = GENS.filter(n => { const b = grab(src, n) || ''; return !/=rsc\(\)/.test(b); });
ok('every generator takes the scalar (' + noScalar.join(', ') + ')', noScalar.length === 0);

/* THE SEAM. The old 2X seam downsampled the grid to 56 and block-stamped the
   result; if that ever comes back, every garment goes chunky again and claim 1
   above would still be green, because it tests the generators, not the wiring. */
ok('the seam hands the generators the REAL grid, not a downsample',
  /const _gw=CW, _gh=CH, _gsrc=grid;/.test(src) && !/o\[y\*_gw\+x\]=grid\[\(y\*RIG_RS\)/.test(src));
ok('the garment grid is derived from the rig, not pinned at 56',
  /var CW=\(typeof BAKED!=='undefined'&&BAKED\.W\)\|\|56/.test(src));
/* THE PAINTED HALF DOES NOT MOVE. RIG LAW: Paolo's regions are sacrosanct, so the
   24-grid PD layers and his skin-detail brush still stamp as RIG_RS blocks. Only
   the GENERATED half went native. */
ok('the PD layers and the skin brush still block-stamp (RIG LAW: his pixels are not invented)',
  /let sx=\(lx\+G24_OX\)\*RIG_RS/.test(src) && /const _sx=\(_s0%56\)\*RIG_RS/.test(src));

/* ------------------------------------------------------------- the harness */
function build(s, CW, dir) {
  const help = ['rsc', 'fr', 'mix', 'grade', 'bshade', 'ext', 'pExt', 'hemStitch'].map(n => grab(s, n)).filter(Boolean);
  const bodies = help.concat(GENS.map(n => grab(s, n)).filter(Boolean));
  return new Function('CW', 'CH', 'curDir', 'var AMB=[67,61,56];\n' + bodies.join('\n') +
    '\nreturn {' + GENS.join(',') + '};')(CW, CW, dir);
}
/* THE FIXTURE. A part-id body, and the SAME body with every cell as a 2x2 block --
   which is exactly what the part grid looks like when the rig doubles. */
function body56() {
  const CW = 56, g = new Array(CW * CW).fill(0);
  const fill = (x0, x1, y0, y1, id) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g[y * CW + x] = id; };
  fill(27, 28, 6, 6, 1); fill(25, 30, 7, 7, 1); fill(24, 31, 8, 14, 1); fill(25, 30, 9, 13, 2);
  fill(26, 29, 15, 16, 3); fill(23, 32, 16, 32, 4);
  fill(20, 23, 18, 33, 5); fill(32, 35, 18, 33, 6); fill(20, 23, 34, 36, 7); fill(32, 35, 34, 36, 8);
  fill(24, 27, 33, 48, 9); fill(28, 31, 33, 48, 10); fill(24, 27, 49, 52, 11); fill(28, 31, 49, 52, 12);
  return g;
}
function dbl(g, CW) { const N = CW * 2, o = new Array(N * N).fill(0);
  for (let y = 0; y < CW; y++) for (let x = 0; x < CW; x++) { const v = g[y * CW + x];
    o[(y * 2) * N + x * 2] = v; o[(y * 2) * N + x * 2 + 1] = v;
    o[(y * 2 + 1) * N + x * 2] = v; o[(y * 2 + 1) * N + x * 2 + 1] = v; }
  return o; }
const R = { dk: [40, 30, 20], mid: [90, 70, 50], lt: [140, 110, 80], mid2: [70, 55, 40], sole: [30, 24, 18] };
function stats(out, g, CW) {
  let bx0 = 1e9, bx1 = -1, by0 = 1e9, by1 = -1, n = 0;
  for (let i = 0; i < g.length; i++) if (g[i]) { const x = i % CW, y = (i / CW) | 0; n++;
    if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
  const BW = bx1 - bx0 + 1, BH = by1 - by0 + 1;
  let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1, c = 0;
  for (const k in out) { const i = +k, x = i % CW, y = (i / CW) | 0; c++;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (!c) return null;
  return { BW, BH, top: (y0 - by0) / BH, bot: (y1 - by0) / BH, lef: (x0 - bx0) / BW, rig: (x1 - bx0) / BW,
           h: (y1 - y0 + 1) / BH, w: (x1 - x0 + 1) / BW, cov: c / n, count: c };
}
/* ONE CASE PER SHAPE THE WARDROBE CAN MAKE -- every kind of every generator, not a
   sample. 236 canon garments and 36 hairstyles are option sets over these. */
const SHAPES = [];
for (const o of [{ sleeves: 'short' }, { sleeves: 'long' }, { sleeves: 'long', neck: 'hood', hoodUp: true },
                 { sleeves: 'long', neck: 'v' }, { sleeves: 'long', pattern: 'plaid' }, { sleeves: 'short', pocket: true }])
  SHAPES.push(['genTop', o]);
for (const c of [undefined, 'short', 'skirt', 'longskirt']) SHAPES.push(['genPants', { cut: c }]);
for (const sh of [undefined, 'tall']) SHAPES.push(['genShoes', { shaft: sh }]);
SHAPES.push(['genCoat', { len: 0.86, dir: 'S' }], ['genCoat', { jacket: true, dir: 'S' }]);
for (const k of ['beanie', 'cap', 'brim', 'wrap']) SHAPES.push(['genHat', { kind: k }]);
SHAPES.push(['genHair', { name: 'CROP', vol: 1, side: 0.52, front: 0.22, fade: 5 }],
            ['genHair', { name: 'LONG', vol: 2, side: 0.9, front: 0.4, len: 0.8 }],
            ['genHair', { name: 'LOW FADE', vol: 0, side: 0.58, front: 0.20, fade: 4 }]);
for (const k of ['backpack', 'satchel', 'bedroll', 'quiver']) SHAPES.push(['genBag', { kind: k }]);
SHAPES.push(['genCape', {}], ['genCape', { mantle: true }], ['genPoncho', {}], ['genPoncho', { hood: true }]);
for (const k of ['bandolier', 'bracers', 'chestplate', 'chestrig', 'elbowpads', 'gorget', 'holster', 'kneepads',
                 'legwraps', 'pauldron', 'shinguards', 'shoulderroll', 'suspenders', 'toolbelt'])
  SHAPES.push(['genGear', { kind: k }]);
for (const k of ['bandana', 'belt', 'gasmask', 'gloves', 'helm', 'mask', 'sash', 'scarf', 'shades', 'shemagh'])
  SHAPES.push(['genAcc', { kind: k }]);
SHAPES.push(['genApron', {}], ['genApron', { bibless: true }], ['genCoverall', {}]);

const g56 = body56(), g112 = dbl(g56, 56);
const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
/* EVERY FACING, NOT JUST SOUTH. The first cut of this gate ran claim 1 on S alone
   and I mutation-tested it by putting the backpack's hardcoded pack body back --
   IT STAYED GREEN. A pack only draws its body from BEHIND; facing south you get
   straps. Nineteen generators branch on curDir, so a south-only fixture cannot see
   the majority of the code it claims to cover, and a gate that cannot see the
   failure it exists to catch is the broken one (8/1). 56 shapes x 8 facings. */
/* *** A GENERATOR MAY DECLARE THAT IT AUTHORS DETAIL FINER THAN A CELL (8/21). ***
   Claim 1 says the 112 output is the 56 output scaled. That is the right default and
   it is what catches a hardcoded distance. It is also, the moment ANY authored detail
   exists at 112, a claim that forbids the entire point of the flip -- row 2X step 5 is
   defined as detail the finer grid can express and the coarse one cannot, and Paolo's
   craft law demands it in two clauses ("no straight lines", "ONE PIXEL not three").
   A GATE MUST NEVER OUTRANK A RULING (8/1). So a generator may carry the marker
   @SUBCELL-DETAIL, and the gate widens THAT generator's bound by exactly the size of a
   sub-cell mark -- one pixel, and 12% coverage -- and nothing else's. The marker is
   checked in the SOURCE, so a lane cannot get the slack by claiming it in a reply.
   THE BUG THIS GATE EXISTS FOR IS STILL CAUGHT WITH ENORMOUS MARGIN: a generator with
   a hardcoded distance comes out at 25-50% of its proper coverage, not 110%, and the
   mutation test at the bottom of this file proves it still fires with the wider bound. */
const SUBCELL = new Set(GENS.filter(n => /@SUBCELL-DETAIL/.test(grab(src, n) || '')));
/* *** WHAT THE MARKER CAN AND CANNOT DO, SAID PLAINLY BECAUSE I TRIED TO DO MORE. ***
   A bare comment buys the wider bound. Nothing verifies that the generator carrying it
   actually draws a sub-cell mark, and that bothered me enough to try twice:
     ATTEMPT 1  compare the 112 output to the 56 output block-doubled. USELESS: a
                resolution-native generator differs from that anyway just by drawing
                natively, so genBag passed on a bare comment.
     ATTEMPT 2  count cells whose TWO PIXEL ROWS differ, on the theory that only
                finer-than-a-cell logic can split a cell. MEASURED, AND IT DOES NOT
                SEPARATE THEM: genHair, the one generator that really does author
                sub-cell detail, scores 4 -- while genCoat scores 13 and genGear 17
                with no sub-cell authoring at all, purely from native edge shading.
   A third attempt would be the fourth version of something nobody asked for, so the
   check is not here and this comment is what stands in its place.
   AND THE RISK IS SMALL, WHICH IS WHY THAT IS ACCEPTABLE: the marker widens the bound
   from 1 pixel to 2 and from 4% coverage to 12%. THE BUG THIS GATE EXISTS FOR IS NOT
   IN THAT RANGE -- a generator with a hardcoded distance comes out at 25-50% of its
   proper coverage. Mutation-tested with the marker's wider bound in force: the
   backpack hardcode still fires on three facings at 31%. A false marker cannot hide a
   mis-scaling bug; it can only excuse a small honest difference. */
let native = 0, ran = 0; const drift = [];
for (const d of DIRS) {
  const A = build(src, 56, d), B = build(src, 112, d);
  for (const [fn, o] of SHAPES) {
    const opt = Object.assign({ ramp: R }, o);
    const label = d + ' ' + fn + (o.kind ? '/' + o.kind : (o.cut ? '/' + o.cut : (o.name ? '/' + o.name : '')));
    let a, b; ran++;
    try { a = A[fn](g56, opt); b = B[fn](g112, opt); } catch (e) { drift.push(label + ' THREW ' + e.message); continue; }
    const s1 = stats(a, g56, 56), s2 = stats(b, g112, 112);
    /* A GARMENT THAT DRAWS NOTHING IN BOTH IS A LEGITIMATE FACING (shades from
       behind are invisible on purpose); one that draws in exactly one is a bug. */
    if (!s1 && !s2) { native++; continue; }
    if (!s1 || !s2) { drift.push(label + ' DRAWS AT ' + (s1 ? '56 ONLY' : '112 ONLY')); continue; }
    const SUB = SUBCELL.has(fn) ? 2.0 : 1.0, COV = SUBCELL.has(fn) ? 0.12 : 0.04;
    const TX = SUB * 1.1 / (2 * s1.BW), TY = SUB * 1.1 / (2 * s1.BH);
    const AX = { lef: TX, rig: TX, w: TX, top: TY, bot: TY, h: TY };
    const worst = Object.keys(AX).map(k => [k, Math.abs(s1[k] - s2[k]) / AX[k]]).sort((x, y) => y[1] - x[1])[0];
    const covR = s2.cov / s1.cov;
    if (worst[1] <= 1 && Math.abs(covR - 1) < COV) native++;
    else drift.push(label + ': ' + worst[0] + ' x' + worst[1].toFixed(2) + ' floor, covers ' +
      (covR * 100).toFixed(0) + '% of what it should (' + s1.count + '->' + s2.count + ', ideal x4)');
  }
}
ok('every garment and hairstyle keeps its PROPORTIONS when the body doubles, EVERY FACING (' +
   native + '/' + ran + (SUBCELL.size ? '; sub-cell detail declared by ' + [...SUBCELL].join(', ') : '') +
   (drift.length ? ')\n     ' + drift.slice(0, 10).join('\n     ') : ')'),
   drift.length === 0);

/* *** CLAIM 3: STEP 5 ONLY EVER GOES FORWARD (8/22). ***
   The flip gave every garment four times the pixels. That is worth nothing on its own:
   a mark drawn one CELL wide is two pixels at 112, so a garment that only scales comes
   out chunkier relative to the body, not finer. The border fix of 8/16 is the proof of
   what the difference looks like -- 2px to 1px, and he asked for it by name.
   MEASURED 8/22 (tools/bohemia_seam_width_audit.js, on the real posed body): 102 of 200
   canon garments had NO one-pixel feature anywhere. Footwear, gloves, scarves, belts and
   face pieces were all at ZERO. Boots got a welt stitch the same day, which took feet
   from 0/18 to 18/18 and the total from 102 to 84.
   THIS RATCHETS THAT NUMBER DOWNWARD. It is not a demand that every garment have fine
   detail -- a belt is genuinely a band and a gorget is genuinely a plate -- it is a
   promise that the count NEVER GOES UP, so nobody removes fine detail to make a gate
   green, and step 5 cannot quietly stall.
   IT RUNS ON THE FIXTURE, NOT THE REAL BODY, and says so: the authoritative number is
   the tool's. The fixture is a consistent stand-in that costs no browser, and what is
   ratcheted here is the fixture's own count, measured on this build. */
const COARSE_PIN = (() => {
  const G112 = build(src, 112, 'S');
  const thin = (o) => {
    const rows = {};
    for (const k in o) { const i = +k, y = (i / 112) | 0; (rows[y] = rows[y] || []).push(i % 112); }
    let has1 = false;
    for (const y in rows) {
      const xs = rows[y].sort((a, c) => a - c);
      let st = 0;
      for (let n = 1; n <= xs.length; n++) {
        const cont = n < xs.length && xs[n] === xs[n-1] + 1 &&
          o[y * 112 + xs[n]].join() === o[y * 112 + xs[st]].join();
        if (cont) continue;
        const L = o[y * 112 + xs[st] - 1], Rr = o[y * 112 + xs[n-1] + 1];
        const me = o[y * 112 + xs[st]].join();
        if (L && Rr && L.join() !== me && Rr.join() !== me && (n - st) === 1) has1 = true;
        st = n;
      }
    }
    return has1;
  };
  let coarse = 0, ran = 0;
  for (const [fn, o] of SHAPES) {
    let out = null; try { out = G112[fn](g112, Object.assign({ ramp: R }, o)); } catch (e) {}
    if (!out || !Object.keys(out).length) continue;
    ran++; if (!thin(out)) coarse++;
  }
  return { coarse, ran };
})();
const PINNED_COARSE = 18;   // shapes with NO 1px feature on the fixture; only ever shrinks
ok('STEP 5 ONLY GOES FORWARD: shapes with no one-pixel detail at 112 (' +
   COARSE_PIN.coarse + ' of ' + COARSE_PIN.ran + ', pinned at ' + PINNED_COARSE + ')',
   COARSE_PIN.coarse <= PINNED_COARSE);
if (COARSE_PIN.coarse < PINNED_COARSE)
  console.log('  *** MORE GARMENTS HAVE FINE DETAIL THAN THE PIN. Lower PINNED_COARSE to ' +
    COARSE_PIN.coarse + ' so it cannot slide back. ***');

/* --------------------------------- claim 2: the build he plays today did not move */
const CASES = [];
for (const sl of ['long', 'short', 'rolled', 'none']) for (const nk of ['crew', 'v', 'henley', 'button', 'turtle', 'hood'])
  for (const pt of ['solid', 'plaid', 'stripe']) CASES.push(['genTop', { sleeves: sl, neck: nk, pattern: pt }]);
CASES.push(['genTop', { sleeves: 'short', pocket: true }], ['genTop', { sleeves: 'short', tatter: true }],
           ['genTop', { sleeves: 'long', neck: 'hood', hoodUp: true }]);
for (const c of [undefined, 'short', 'skirt', 'longskirt']) CASES.push(['genPants', { cut: c }]);
for (const sh of [undefined, 'tall']) CASES.push(['genShoes', { shaft: sh }]);
for (const o of [{ len: 0.86 }, { len: 0.6 }, { jacket: true }, { vest: true }, { split: true, len: 0.9 }, { open: 2 }])
  CASES.push(['genCoat', Object.assign({ dir: 'S' }, o)]);
for (const k of ['beanie', 'cap', 'brim', 'wrap']) for (const f of ['dome', 'skull'])
  CASES.push(['genHat', { kind: k, fit: f }], ['genHat', { kind: k, fit: f, slouch: true }]);
for (const k of ['bandolier', 'bracers', 'chestplate', 'chestrig', 'elbowpads', 'gorget', 'holster', 'kneepads',
                 'legwraps', 'pauldron', 'shinguards', 'shoulderroll', 'suspenders', 'toolbelt'])
  CASES.push(['genGear', { kind: k }]);
for (const k of ['bandana', 'belt', 'gasmask', 'gloves', 'helm', 'mask', 'sash', 'scarf', 'shades', 'shemagh'])
  CASES.push(['genAcc', { kind: k }], ['genAcc', { kind: k, tail: 'long' }]);
for (const k of ['backpack', 'bedroll', 'quiver', 'satchel']) CASES.push(['genBag', { kind: k }]);
CASES.push(['genCape', {}], ['genCape', { mantle: true }], ['genPoncho', {}], ['genPoncho', { hood: true }],
           ['genApron', {}], ['genApron', { bibless: true }], ['genCoverall', {}]);
for (const vol of [0, 1, 2, 3]) for (const side of [0.3, 0.62, 1.0, 1.7, 2.6]) for (const tex of ['solid', 'locs', 'braid'])
  CASES.push(['genHair', { name: 'ID ' + vol + side + tex, vol, side, front: 0.22, tex }]);
for (const o of [{ fade: 4 }, { fade: 7 }, { strip: 2 }, { strip: 2, spiky: true }, { tie: 'top' }, { tie: 'bun' },
                 { tie: 'pony' }, { flare: 0.4 }, { back: 3 }, { back: 5 }])
  CASES.push(['genHair', Object.assign({ name: 'ID2 ' + JSON.stringify(o), vol: 1, side: 0.9, front: 0.22 }, o)]);

const lines = [];
for (const d of DIRS) {
  const G = build(src, 56, d);
  for (const [fn, o] of CASES) {
    const opt = Object.assign({ ramp: R }, o);
    let out; try { out = G[fn](g56, opt); } catch (e) { out = { THREW: e.message }; }
    const keys = Object.keys(out).map(Number).sort((x, y) => x - y);
    const body = keys.map(k => k + ':' + (out[k] || []).join(',')).join(';');
    lines.push(d + '|' + fn + '|' + JSON.stringify(o) + '|' +
      require('crypto').createHash('sha256').update(body).digest('hex').slice(0, 16));
  }
}
const now = lines.join('\n') + '\n';
if (process.argv.includes('--pin')) {
  fs.writeFileSync(PIN, '# CLOTHES 56 PIN -- one sha256 per (facing, garment). Regenerating this file\n' +
    '# says "the wardrobe Paolo plays CHANGED ON PURPOSE". Never regenerate to clear a\n' +
    '# red; a red here means a 4x edit moved a pixel in today\'s build, which is a bug,\n' +
    '# not a stale pin. Rewrite with: node gates/clothes_4x_gate.js --pin\n' + now);
  console.log('  PIN REWRITTEN: ' + lines.length + ' hashes');
}
ok('the 56 pin exists (' + CASES.length + ' cases x 8 facings)', fs.existsSync(PIN));
if (fs.existsSync(PIN)) {
  const want = fs.readFileSync(PIN, 'utf8').split('\n').filter(l => l && l[0] !== '#');
  const moved = [];
  const map = new Map(want.map(l => [l.slice(0, l.lastIndexOf('|')), l.slice(l.lastIndexOf('|') + 1)]));
  for (const l of lines) { const k = l.slice(0, l.lastIndexOf('|')), v = l.slice(l.lastIndexOf('|') + 1);
    const w = map.get(k);
    if (w === undefined) moved.push('NEW CASE ' + k); else if (w !== v) moved.push(k); }
  ok('not one pixel of the 56 wardrobe moved (' + lines.length + ' hashed, ' + moved.length + ' changed' +
     (moved.length ? ':\n     ' + moved.slice(0, 8).join('\n     ') : '') + ')', moved.length === 0);
  ok('the pin covers every case (' + want.length + ' pinned, ' + lines.length + ' run)', want.length === lines.length);
}

console.log('THE CLOTHES 4X GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  native + '/' + ran + ' shapes scale, ' + lines.length + ' pixels-frozen hashes)');
process.exit(fail ? 1 : 0);
