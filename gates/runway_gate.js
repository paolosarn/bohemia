/* BOHEMIA — THE RUNWAY GATE (9/5/26). FACTORY LAW: new machinery ships with its
 * own gate, the same turn.
 *
 * laws/BOHEMIA_ADDENDUM_THE_RUNWAY_AND_ART_AT_ALL_TIMES_9_4_26.md, Paolo 9/4:
 *   "every piece of clothing and every hairstyle should be modeled after like
 *    fashion brands... Balenciaga, Rick Owens... I want everyone to look like they
 *    could be in a Balenciaga or Rick Owens show."
 *
 * WHAT THIS GATE IS FOR, and it is not taste. Nothing here can tell you whether a
 * trouser looks like a runway trouser -- that is DIRECTION's judgement and then
 * his thumb. What it CAN do is hold the one bar this wardrobe has already failed
 * once, in writing, with a verdict attached:
 *
 *   n:'STEEL V-NECK TEE' | 7/25/26 | DOWN, all 3 (Paolo: "delete these terrible").
 *   "the neck:'v' carve ... reads as visually IDENTICAL to a plain crew neck ...
 *    A 'new shape' that cannot be told apart from the shape beside it is not
 *    structure, it is a recolor wearing a new name."
 *
 * SO THE DEAD GARMENT IS THE RULER. Every new shape is measured against the shape
 * it sits next to, and the V-NECK is measured on the same scale as a live control.
 * If a new cut cannot beat the thing he deleted, it does not ship.
 *
 * *** AND THE FIRST RULER I REACHED FOR WAS THE BROKEN ONE, WHICH IS WHY THIS
 *     COMMENT IS LONG. *** The obvious measurement is AREA: what share of the
 *     garment's cells changed. On that scale the dead V-neck scores 6.74% and the
 *     oversized shoulder -- the single loudest thing in the register he named --
 *     scores 5.71%. The killed garment outscores the new one, and a gate written
 *     that morning would have gone red on the shoulder and green on the corpse.
 *     THE PRACTITIONERS' OWN TEST SAYS WHY, and it is the first rule in every
 *     sprite guide there is: BLACK THE SPRITE OUT AND LOOK AT THE OUTLINE. If you
 *     cannot tell the pieces apart in one colour, no amount of shading will fix
 *     it. Area counts cells wherever they are; a player reads the EDGE.
 *     Measured on the outline instead:
 *         THE DEAD V-NECK   0 rows moved of 18,  widest line 16 -> 16
 *         oversized shoulder  4 rows of 18,      widest line 16 -> 20
 *     ZERO. The garment he deleted did not move one pixel of the outline and did
 *     not change the widest line by one. That is his verdict, in a number, and it
 *     is the number this gate is built on.
 *
 * THREE AXES, and a shape has to move at least one of them properly, because
 * "different" comes in three flavours at this size: WIDER (the pad, the flare),
 * LONGER OR SHORTER (the crop, the mid shaft), or A DIFFERENT LINE DOWN THE SIDE
 * (the drop rise, the slouch). A cut that moves none of them is a colourway.
 *
 *   node gates/runway_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => {
  /* the reversed-call guard this lane's gates all carry: ok(message, condition),
     and a string in the condition slot is truthy in both directions */
  if (typeof c === 'string') throw new Error('GATE BUG: ok() got a STRING as its condition. This file is ok(message, condition).');
  c ? pass++ : (fail++, console.log('  > FAIL ' + n));
};
const done = () => { console.log('\n=== RUNWAY GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
if (!fs.existsSync(ALPHA)) done();
const src = fs.readFileSync(ALPHA, 'utf8');

/* --- lift the REAL generators out of the alpha. Never re-implement a generator
       in a gate: the third broken ruler of the week was a report that compared a
       SPEC FIELD the fix had just made dead and announced nothing had changed.
       This gate reads rendered cells and never a spec field. ------------------ */
function grab(name) {
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) return null;
  const s = src.indexOf('{', i); let d = 0;
  for (let k = s; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) return src.slice(i, k + 1); } }
  return null;
}
const NAMES = ['rsc', 'fr', 'mix', 'bshade', 'ext', 'pExt', 'genTop', 'genPants', 'genCoat', 'genShoes', 'genAcc', 'genCape'];
const bodies = NAMES.map(grab);
ok('every generator this gate measures was found in the alpha', bodies.every(Boolean));
if (!bodies.every(Boolean)) done();
const CW = 56;
const makeG = (dir) => { try { return new Function('CW', 'CH', 'curDir', 'CLO_NOSTITCH', bodies.join('\n') + '\nreturn {genTop,genPants,genCoat,genShoes,genAcc,genCape};')(CW, CW, dir, true); } catch (e) { console.log('  eval error: ' + e.message); return null; } };
const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
const GD = {}; DIRS.forEach(d => GD[d] = makeG(d));
ok('generators evaluate pure in all eight facings', DIRS.every(d => GD[d] && typeof GD[d].genPants === 'function'));
if (!DIRS.every(d => GD[d])) done();
const G = GD.S;

/* the alpha's own part-id mannequin, same one structure_gate stands up */
function body() {
  const g = new Array(CW * CW).fill(0);
  const fill = (x0, x1, y0, y1, id) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g[y * CW + x] = id; };
  fill(27, 28, 6, 6, 1); fill(25, 30, 7, 7, 1); fill(24, 31, 8, 14, 1);
  fill(25, 30, 9, 13, 2);
  fill(26, 29, 15, 16, 3); fill(23, 32, 16, 32, 4);
  fill(20, 23, 18, 33, 5); fill(32, 35, 18, 33, 6);
  fill(21, 22, 34, 36, 7); fill(33, 34, 34, 36, 8);
  fill(24, 27, 33, 48, 9); fill(28, 31, 33, 48, 10);
  fill(24, 27, 49, 52, 11); fill(28, 31, 49, 52, 12);
  return g;
}
const g = body();
const R = { dk: [40, 30, 20], mid: [90, 70, 50], lt: [140, 110, 80], mid2: [70, 55, 40], sole: [30, 24, 18] };

/* ---------- THE OUTLINE RULER --------------------------------------------- */
function profile(o) {
  const L = {}, Rr = {}, rows = new Set(); let top = 1e9, bot = -1, wide = 0;
  for (const k in o) { const i = +k, x = i % CW, y = (i / CW) | 0; rows.add(y);
    if (L[y] === undefined || x < L[y]) L[y] = x;
    if (Rr[y] === undefined || x > Rr[y]) Rr[y] = x;
    if (y < top) top = y; if (y > bot) bot = y; }
  for (const y of rows) wide = Math.max(wide, Rr[y] - L[y] + 1);
  return { L, R: Rr, rows, top, bot, wide };
}
/* how far apart two garments are AS OUTLINES: rows whose left or right edge
   moved, the change in the widest line, and the change in vertical extent. */
function outlineDiff(a, b) {
  const A = profile(a), B = profile(b);
  const rows = new Set([...A.rows, ...B.rows]); let moved = 0;
  for (const y of rows) {
    const al = A.L[y], ar = A.R[y], bl = B.L[y], br = B.R[y];
    if (al === undefined || bl === undefined) { moved++; continue; }
    if (al !== bl || ar !== br) moved++;
  }
  /* AXIS FOUR, AND IT IS A BLIND SPOT THE GATE FOUND IN ITSELF. A WRAP COAT scored
     ZERO here on its first run -- 0 rows moved, widest line unchanged -- and it is
     obviously a different garment: it closes the front slit that every other coat
     in this wardrobe hangs open. The slit is INSIDE the per-row span, so a test
     that only reads the leftmost and rightmost painted cell of each row cannot see
     it at all. But the practitioners' test can: black the sprite out and the slit
     is still there, as a hole with the body showing through. A HOLE IS PART OF THE
     OUTLINE.
     THE BAR IS DERIVED FROM THE CORPSE, NOT PICKED TO FIT THE WORK, because this is
     exactly where a gate starts serving its author: the dead V-NECK's own carve
     changes the hole area by 12 cells, so the bar is THREE TIMES ITS SCORE. The
     wrap coat changes it by 66. Measured, both of them, every run -- the V-neck
     control below fails this axis as it fails the other three. */
  let ha = 0, hb = 0;
  for (const y of rows) { const al = A.L[y], ar = A.R[y], bl = B.L[y], br = B.R[y];
    if (al !== undefined) for (let x = al; x <= ar; x++) if (!a[y * CW + x]) ha++;
    if (bl !== undefined) for (let x = bl; x <= br; x++) if (!b[y * CW + x]) hb++; }
  return { moved, rows: rows.size, pct: 100 * moved / rows.size,
           dWide: Math.abs(A.wide - B.wide),
           dExt: Math.max(Math.abs(A.top - B.top), Math.abs(A.bot - B.bot)),
           dHole: Math.abs(ha - hb) };
}
const S = 1;                       /* the rig ships at 56, so one cell is one pixel */
const MIN_ROWS = 2 * S;            /* at least two rows of the outline have to move */
const MIN_PCT  = 15;               /* and it has to be a real share of the garment */
const MIN_WIDE = 2 * S;            /* or the widest line moves a full cell each side */
const MIN_EXT  = 2 * S;            /* or the thing gets properly longer or shorter */
const VNECK_HOLE = 12;             /* MEASURED, not chosen: what the dead garment's own carve does */
const MIN_HOLE = 3 * VNECK_HOLE;   /* three times the corpse. see the note in outlineDiff */
function distinct(d) { return (d.moved >= MIN_ROWS && d.pct >= MIN_PCT) || d.dWide >= MIN_WIDE || d.dExt >= MIN_EXT || d.dHole >= MIN_HOLE; }

/* ---------- 1. THE CALIBRATION: THE DEAD GARMENT MUST FAIL ---------------- */
/* A gate whose own bar the killed garment can clear is not holding anything.
   This is the gate's built-in mutation test, and it is not a synthetic one --
   it is a real garment with a real verdict on it. */
const crew = G.genTop(g, { ramp: R, sleeves: true, neck: 'crew' });
const vneck = G.genTop(g, { ramp: R, sleeves: true, neck: 'v' });
const vd = outlineDiff(crew, vneck);
ok('CALIBRATION: the dead V-NECK moves NO outline row (his "visually IDENTICAL", measured)', vd.moved === 0);
ok('CALIBRATION: the dead V-NECK does not change the widest line', vd.dWide === 0);
ok('CALIBRATION: the hole bar is still three times what the dead V-NECK scores (' + vd.dHole + ')', vd.dHole * 3 <= MIN_HOLE);
ok('CALIBRATION: the dead V-NECK FAILS this gate\'s own distinctness bar', !distinct(vd));

/* ---------- 2. EVERY NEW SHAPE BEATS IT ----------------------------------- */
const plainPants = G.genPants(g, { ramp: R });
const plainShoe  = G.genShoes(g, { ramp: R });
const plainTop   = G.genTop(g, { ramp: R, sleeves: true });
const SHAPES = [
  ['drop rise trouser',  () => G.genPants(g, { ramp: R, cut: 'drop' }),  plainPants],
  ['wide pleat trouser', () => G.genPants(g, { ramp: R, cut: 'wide' }),  plainPants],
  ['stacked hem pant',   () => G.genPants(g, { ramp: R, cut: 'stack' }), plainPants],
  ['cropped trouser',    () => G.genPants(g, { ramp: R, cut: 'crop' }),  plainPants],
  ['mid shaft boot',     () => G.genShoes(g, { ramp: R, shaft: 'mid' }), plainShoe],
  ['slouched boot',      () => G.genShoes(g, { ramp: R, shaft: 'slouch' }), plainShoe],
  ['stacked sole boot',  () => G.genShoes(g, { ramp: R, sole: 'stack' }), plainShoe],
  ['oversized shoulder', () => G.genTop(g, { ramp: R, sleeves: true, shoulder: 'wide' }), plainTop],
  ['longline top',       () => G.genTop(g, { ramp: R, sleeves: true, cut: 'long' }), plainTop],
  /* --- BATCH 2 (9/5): the outer rail, and the two flattest rails in the game.
         Each coat is measured against A COAT OF ITS OWN LENGTH, never against a
         bare body -- otherwise "it is a coat" would pass as "it is a new shape",
         and eleven of this rail's fifteen shapes were already one coat stretched. */
  ['wrap coat',          () => G.genCoat(g, { ramp: R, wrap: true, len: 0.56 }),   G.genCoat(g, { ramp: R, len: 0.56 })],
  ['asymmetric coat',    () => G.genCoat(g, { ramp: R, asym: true, len: 0.56 }),   G.genCoat(g, { ramp: R, len: 0.56 })],
  ['cocoon coat',        () => G.genCoat(g, { ramp: R, cocoon: true, len: 0.56 }), G.genCoat(g, { ramp: R, len: 0.56 })],
  ['draped cowl',        () => G.genAcc(g, { ramp: R, kind: 'cowl' }),             G.genAcc(g, { ramp: R, kind: 'scarf' })],
  ['hand wraps',         () => G.genAcc(g, { ramp: R, kind: 'handwrap' }),         G.genAcc(g, { ramp: R, kind: 'gloves' })],
  /* --- BATCH 3 (9/5): the waist and the back. Each against the thing already on
         its own rail, never against a bare body. */
  ['wide waist wrap',    () => G.genAcc(g, { ramp: R, kind: 'wrapbelt' }),         G.genAcc(g, { ramp: R, kind: 'belt' })],
  ['one-shoulder drape', () => G.genCape(g, { ramp: R, oneShoulder: true }),       G.genCape(g, { ramp: R })],
  /* --- BATCH 4 (9/5): the face, the last rail with room. A face garment can only
         change one thing at this size -- the blacked-out HEAD -- so each is
         measured against the canon face piece nearest it. */
  ['shield visor',       () => G.genAcc(g, { ramp: R, kind: 'visor' }),            G.genAcc(g, { ramp: R, kind: 'shades' })],
  ['face wrap',          () => G.genAcc(g, { ramp: R, kind: 'facewrap' }),         G.genAcc(g, { ramp: R, kind: 'mask' })],
];
console.log('  --- every new shape against the shape it sits next to ---');
for (const [name, mk, ref] of SHAPES) {
  const d = outlineDiff(ref, mk());
  console.log('      ' + name.padEnd(20) + ' rows ' + String(d.moved).padStart(2) + '/' + String(d.rows).padStart(2)
    + ' (' + d.pct.toFixed(0).padStart(2) + '%)  widest +/-' + d.dWide + '  length +/-' + d.dExt + '  holes +/-' + d.dHole);
  ok(name + ' is a SHAPE, not a colourway (beats the dead V-NECK on the outline)', distinct(d));
}

/* ---------- 3. THE NEW CUTS ARE NOT EACH OTHER ---------------------------- */
/* Four cuts on one rail that all read the same is the same failure one level up:
   a rail of four names and one shape. Each new trouser is checked against every
   OTHER trouser cut the rail already holds, canon ones included. */
const CUTS = ['drop', 'wide', 'stack', 'crop', 'short', 'skirt', 'longskirt'];
const rendered = {}; CUTS.forEach(c => rendered[c] = G.genPants(g, { ramp: R, cut: c }));
rendered['plain'] = plainPants;
let pairFail = 0, worst = null;
const NEW = ['drop', 'wide', 'stack', 'crop'];
for (const a of NEW) for (const b of Object.keys(rendered)) {
  if (a === b) continue;
  const d = outlineDiff(rendered[a], rendered[b]);
  if (!distinct(d)) { pairFail++; if (!worst) worst = a + ' vs ' + b; }
}
ok('no new trouser cut reads as another trouser already on the rail' + (worst ? ' (' + worst + ')' : ''), pairFail === 0);
const SHOEV = { plain: plainShoe, tall: G.genShoes(g, { ramp: R, shaft: 'tall' }),
                mid: G.genShoes(g, { ramp: R, shaft: 'mid' }), slouch: G.genShoes(g, { ramp: R, shaft: 'slouch' }),
                stack: G.genShoes(g, { ramp: R, sole: 'stack' }) };
let sFail = 0, sWorst = null;
for (const a of ['mid', 'slouch', 'stack']) for (const b of Object.keys(SHOEV)) {
  if (a === b) continue;
  const d = outlineDiff(SHOEV[a], SHOEV[b]);
  if (!distinct(d)) { sFail++; if (!sWorst) sWorst = a + ' vs ' + b; }
}
ok('no new boot reads as another boot already on the rail' + (sWorst ? ' (' + sWorst + ')' : ''), sFail === 0);

/* ---------- 4. IT READS FROM EVERY ANGLE ---------------------------------- */
/* A HAIRCUT READS FROM EVERY ANGLE OR IT IS NOT A HAIRCUT (8/28) is a hair law by
   name and a rig law in fact: a ponytail that exists from the side and not head-on
   is why four styles were cut. A trouser is no different. */
let angleFail = [];
for (const d of DIRS) {
  const gd = GD[d];
  const set = [['drop', () => gd.genPants(g, { ramp: R, cut: 'drop' })],
               ['wide', () => gd.genPants(g, { ramp: R, cut: 'wide' })],
               ['stack', () => gd.genPants(g, { ramp: R, cut: 'stack' })],
               ['crop', () => gd.genPants(g, { ramp: R, cut: 'crop' })],
               ['mid', () => gd.genShoes(g, { ramp: R, shaft: 'mid' })],
               ['slouch', () => gd.genShoes(g, { ramp: R, shaft: 'slouch' })],
               ['stacksole', () => gd.genShoes(g, { ramp: R, sole: 'stack' })],
               ['shoulder', () => gd.genTop(g, { ramp: R, sleeves: true, shoulder: 'wide' })],
               ['longline', () => gd.genTop(g, { ramp: R, sleeves: true, cut: 'long' })],
               ['wrap', () => gd.genCoat(g, { ramp: R, wrap: true, len: 0.56 })],
               ['asym', () => gd.genCoat(g, { ramp: R, asym: true, len: 0.56 })],
               ['cocoon', () => gd.genCoat(g, { ramp: R, cocoon: true, len: 0.56 })],
               ['cowl', () => gd.genAcc(g, { ramp: R, kind: 'cowl' })],
               ['handwrap', () => gd.genAcc(g, { ramp: R, kind: 'handwrap' })],
               ['wrapbelt', () => gd.genAcc(g, { ramp: R, kind: 'wrapbelt' })],
               ['oneShoulder', () => gd.genCape(g, { ramp: R, oneShoulder: true })],
               ['visor', () => gd.genAcc(g, { ramp: R, kind: 'visor' })],
               ['facewrap', () => gd.genAcc(g, { ramp: R, kind: 'facewrap' })]];
  for (const [n, mk] of set) {
    let o = null; try { o = mk(); } catch (e) { angleFail.push(n + '@' + d + ' threw ' + e.message); continue; }
    if (!o || Object.keys(o).length === 0) angleFail.push(n + '@' + d + ' rendered nothing');
  }
}
ok('all nine new shapes render in all eight facings' + (angleFail.length ? ' (' + angleFail[0] + ')' : ''), angleFail.length === 0);

/* AND THE SIZE OF IT DOES NOT COLLAPSE WHEN YOU TURN. Clause 1 of HAIR AT FOUR
   TIMES THE PIXELS: turning the head may change appearance, never IDENTITY. A
   trouser that is wide facing south and ordinary facing east is two garments. */
let turnFail = [];
for (const [nm, mk] of [['drop', o => o.genPants(g, { ramp: R, cut: 'drop' })],
                        ['wide', o => o.genPants(g, { ramp: R, cut: 'wide' })],
                        ['crop', o => o.genPants(g, { ramp: R, cut: 'crop' })],
                        ['slouch', o => o.genShoes(g, { ramp: R, shaft: 'slouch' })],
                        ['shoulder', o => o.genTop(g, { ramp: R, sleeves: true, shoulder: 'wide' })]]) {
  const ws = DIRS.map(d => profile(mk(GD[d])).wide);
  if (Math.max.apply(null, ws) - Math.min.apply(null, ws) > 2 * S) turnFail.push(nm + ' widest ' + Math.min.apply(null, ws) + '..' + Math.max.apply(null, ws));
}
ok('a new shape keeps its proportion when the body turns' + (turnFail.length ? ' (' + turnFail[0] + ')' : ''), turnFail.length === 0);

/* ---------- 5. NOTHING NEW TOUCHES THE HEAD OR THE FACE ------------------- */
/* A trouser that paints a face pixel is the class of bug that only shows up on
   one facing, and it has bitten this wardrobe before (the poncho, the hood). */
let headHits = 0;
for (const d of DIRS) { const gd = GD[d];
  const outs = [gd.genPants(g, { ramp: R, cut: 'drop' }), gd.genPants(g, { ramp: R, cut: 'wide' }),
                gd.genPants(g, { ramp: R, cut: 'stack' }), gd.genPants(g, { ramp: R, cut: 'crop' }),
                gd.genShoes(g, { ramp: R, shaft: 'mid' }), gd.genShoes(g, { ramp: R, shaft: 'slouch' }),
                gd.genShoes(g, { ramp: R, sole: 'stack' }),
                gd.genTop(g, { ramp: R, sleeves: true, shoulder: 'wide' }),
                gd.genTop(g, { ramp: R, sleeves: true, cut: 'long' }),
                gd.genCoat(g, { ramp: R, wrap: true, len: 0.56 }), gd.genCoat(g, { ramp: R, asym: true, len: 0.56 }),
                gd.genCoat(g, { ramp: R, cocoon: true, len: 0.56 }),
                gd.genAcc(g, { ramp: R, kind: 'cowl' }), gd.genAcc(g, { ramp: R, kind: 'handwrap' }),
                gd.genAcc(g, { ramp: R, kind: 'wrapbelt' }), gd.genCape(g, { ramp: R, oneShoulder: true })];
  /* the two FACE pieces are deliberately not in that list: a visor and a face wrap
     are SUPPOSED to paint head and face pixels, which is what makes them face
     garments. Their own rule is the mask class's, and it is checked below. */
  for (const o of outs) for (const k in o) { const p = g[+k]; if (p === 1 || p === 2) headHits++; } }
ok('no new trouser, boot or top paints a head or face pixel, in any facing', headHits === 0);
/* THE MASK CLASS'S OWN RULE (the dust mask's, and the FACE WRAP inherits it because
   it is the same class): nose and mouth down, NEVER at or above the eyes. The
   SHIELD is a different class and is exempt, with the gasmask as the standing
   precedent -- the gasmask's own comment says the below-the-eyes law "stays its
   own" and then covers the eyes. */
/* *** AND THE FIRST VERSION OF THIS CHECK WOULD HAVE CONDEMNED HIS APPROVED DUST
   MASK. *** It derived the eye band from the RAW widest rows of the face part
   (9..13 on this mannequin) and flagged anything painting row 13 or above. The
   canon mask paints row 12. So does the new wrap. Identical.
   THE GENERATOR'S OWN BAND IS NARROWER, and deliberately: genAcc clamps the widest
   rows to two cells at the centre, with its own comment saying why -- "Fraction
   math kept landing the mask on the eyes (balaclava bug)". Clamped, the band is
   10..11 and mouthY is 12, which is exactly where both garments start.
   SO THE RULER WAS THE BROKEN ONE (8/1), and the fix is to measure the band the
   way the code that draws it does. THE CANON MASK NOW RUNS AS A LIVE CONTROL
   BESIDE THE NEW WRAP, the same way the dead V-NECK does for shape: if a future
   edit to this check starts failing HIS approved garment, the gate says so out
   loud instead of quietly condemning it. */
function eyeBandOf(grid) {
  const fw = {}; let wmax = 0;
  for (let i = 0; i < grid.length; i++) if (grid[i] === 2) { const y = (i / CW) | 0; fw[y] = (fw[y] || 0) + 1; if (fw[y] > wmax) wmax = fw[y]; }
  let a = 1e9, b = -1; for (const k in fw) if (fw[k] === wmax) { const y = +k; if (y < a) a = y; if (y > b) b = y; }
  if (b < 0) return -1;
  if (b - a > 2) { const m = Math.round((a + b) / 2); b = m; }      /* genAcc's own clamp */
  return b;
}
const EYE_B = eyeBandOf(g);
let wrapAboveEyes = 0, canonMaskAboveEyes = 0;
for (const d of DIRS) { const gd = GD[d];
  for (const [kind, bump] of [['facewrap', 1], ['mask', 2]]) {
    const o = gd.genAcc(g, { ramp: R, kind: kind });
    for (const k in o) { const y = (+k / CW) | 0, p = g[+k];
      if ((p === 1 || p === 2) && y <= EYE_B) { if (bump === 1) wrapAboveEyes++; else canonMaskAboveEyes++; } } } }
ok('CONTROL: his approved DUST MASK passes this check (a ruler that fails his art is the broken one)', canonMaskAboveEyes === 0);
ok('the FACE WRAP never reaches the eyes or above them (the dust mask\'s own rule, inherited)', wrapAboveEyes === 0);

/* ---------- 6. THE OLD WARDROBE DID NOT MOVE ------------------------------ */
/* Adding a branch to a shared generator is exactly how an approved garment gets
   quietly repainted. Every canon garment that does NOT pass a new option must
   render identically to a build without these branches -- which is what
   gates/clothes_4x_gate.js's 1,744 pinned hashes already prove, so this is the
   cheap local half: the default call of each generator must be untouched by the
   new code paths, in every facing. */
const H = o => { let s = 0; const ks = Object.keys(o).map(Number).sort((a, b) => a - b);
  for (const k of ks) { const c = o[k]; s = (s * 31 + k) >>> 0; s = (s * 31 + c[0] + c[1] * 3 + c[2] * 7) >>> 0; } return s; };
let driftFail = [];
for (const d of DIRS) { const gd = GD[d];
  /* the same call with an option the generator does not know must be identical */
  if (H(gd.genPants(g, { ramp: R })) !== H(gd.genPants(g, { ramp: R, cut: undefined }))) driftFail.push('pants@' + d);
  if (H(gd.genShoes(g, { ramp: R })) !== H(gd.genShoes(g, { ramp: R, shaft: undefined, sole: undefined }))) driftFail.push('shoes@' + d);
  if (H(gd.genTop(g, { ramp: R, sleeves: true })) !== H(gd.genTop(g, { ramp: R, sleeves: true, shoulder: undefined, cut: undefined }))) driftFail.push('top@' + d);
  if (H(gd.genCoat(g, { ramp: R, len: 0.86 })) !== H(gd.genCoat(g, { ramp: R, len: 0.86, wrap: undefined, asym: undefined, cocoon: undefined }))) driftFail.push('coat@' + d);
  if (H(gd.genAcc(g, { ramp: R, kind: 'scarf' })) !== H(gd.genAcc(g, { ramp: R, kind: 'scarf', tail: undefined }))) driftFail.push('acc@' + d);
}
ok('an unasked-for option changes nothing: the default garment is byte-identical' + (driftFail.length ? ' (' + driftFail[0] + ')' : ''), driftFail.length === 0);

/* ---------- 7. THE BATCH IS ACTUALLY IN THE WARDROBE ---------------------- */
/* THE MATERIAL EXISTED AND NEVER REACHED THE PLAYER is the most repeated failure
   in this repo -- seventeen invisible hats, four bright garments nobody wore, a
   face maker with no door. A shape with no garment on it is that failure again. */
const a0 = src.indexOf('var GARMENTS=window.GARMENTS=[');
const a1 = src.indexOf('\n  ];', a0);
const CAT = src.slice(a0, a1);
const BATCH = ['DROP RISE TROUSER', 'BONE DROP TROUSER', 'WIDE PLEAT TROUSER', 'BONE WIDE TROUSER',
  'STACKED JERSEY PANT', 'SLATE STACK PANT', 'CROPPED WORK TROUSER', 'CROPPED BLACK DENIM',
  'STACKED SOLE BOOT', 'BONE STACK BOOT', 'MID SHAFT BOOT', 'COAL MID BOOT',
  'SLOUCH BOOT', 'ASH SLOUCH BOOT', 'WIDE SHOULDER TEE', 'BONE SHOULDER SHIRT',
  'LONGLINE JERSEY', 'ASH LONGLINE TEE', 'SHOULDER LONGLINE', 'STACKED MID BOOT',
  'WRAP COAT', 'ASH WRAP COAT', 'ASYMMETRIC COAT', 'ASH ASYM COAT', 'COCOON COAT',
  'SLATE COCOON COAT', 'DRAPED COWL', 'ASH COWL', 'HAND WRAPS', 'SOOT HAND WRAPS',
  'BONE HEAD WRAP', 'SOOT HEAD WRAP', 'WIDE WAIST WRAP', 'LEAD WAIST WRAP',
  'ONE-SHOULDER DRAPE', 'BONE SHOULDER DRAPE',
  'SHIELD VISOR', 'ASH SHIELD', 'FACE WRAP', 'ASH FACE WRAP'];
const missing = BATCH.filter(n => CAT.indexOf("n:'" + n + "'") < 0);
ok('all forty runway garments are in the wardrobe' + (missing.length ? ' (missing ' + missing[0] + ')' : ''), missing.length === 0);
const notCanon = BATCH.filter(n => { const i = CAT.indexOf("n:'" + n + "'"); return i < 0 || CAT.slice(i, i + 200).indexOf("st:'canon'") < 0; });
ok('all forty are canon, so the picker can actually reach them', notCanon.length === 0);
/* every new SHAPE has at least one garment wearing it -- an option nothing calls
   is a dial that cannot move the pixels */
const OPTS = [["cut:'drop'", 'drop rise'], ["cut:'wide'", 'wide pleat'], ["cut:'stack'", 'stacked hem'],
  ["cut:'crop'", 'cropped'], ["shaft:'mid'", 'mid shaft'], ["shaft:'slouch'", 'slouched'],
  ["sole:'stack'", 'stacked sole'], ["shoulder:'wide'", 'oversized shoulder'], ["cut:'long'", 'longline'],
  ['wrap:true', 'wrap coat'], ['asym:true', 'asymmetric coat'], ['cocoon:true', 'cocoon coat'],
  ["kind:'cowl'", 'draped cowl'], ["kind:'handwrap'", 'hand wraps'],
  ["kind:'wrapbelt'", 'wide waist wrap'], ['oneShoulder:true', 'one-shoulder drape'],
  /* AND THE ONE THAT IS NOT A NEW SHAPE AT ALL: genHat's `wrap` was built, drawable
     and asked for by NOBODY. This row exists so it can never go unreached again --
     the seventeen invisible hats is the failure this repo repeats most. */
  ["kind:'wrap'", 'head wrap, which the engine could always draw and nothing wore'],
  ["kind:'visor'", 'shield visor'], ["kind:'facewrap'", 'face wrap']];
for (const [o, nm] of OPTS) ok('somebody in the wardrobe actually wears the ' + nm, CAT.indexOf(o) >= 0);

/* ---------- 7b. THE STYLE CARD, WHICH LANDED AFTER THIS BATCH WAS COOKED --- */
/* DIRECTION shipped records/BOHEMIA_STYLE_CARD_9_5_26.md and it turns the register
   into numbers: CLOTH MID SATURATION <= 0.25 (monochrome and dust), outer mid VALUE
   0.15-0.38 (runway black), one saturated faction accent per body and no more.
   Its own headline is that only 32% of the wardrobe sat inside that band and THE
   REMAKE'S JOB IS THAT NUMBER -- so a remake batch that lands outside it is not
   doing the job it was cooked for.
   THIS BATCH DID LAND OUTSIDE IT, on ten of thirty-six garments, because it was
   cooked before the card existed and reused existing ramps on purpose. Six of the
   twelve ramps it spent measure over the ceiling: DUSTSAND 0.375, OLIVEDRAB 0.325,
   DENIM 0.418, SANDBOOT 0.464, BOOT 0.582, LEATHERV 0.522. They were swapped for
   ramps already in the file that the card admits, and the NAMES moved with the
   colours, because a garment called SAND that is bone is a lie in the picker.
   WHAT THIS CHECK DELIBERATELY DOES NOT DO: touch a shared ramp. Editing DUSTSAND
   would repaint every approved garment that uses it and move the 1,744 pinned
   56-pixel hashes. THE CARD GOVERNS WHAT A NEW COOK MAY SPEND, NEVER WHAT HIS
   APPROVED ART ALREADY IS -- so this holds THIS BATCH and says nothing about the
   rest of the wardrobe. */
const RAMP = {};
{ const rre = /var ([A-Z][A-Z0-9_]*)=\{dk:\[(\d+),(\d+),(\d+)\],mid:\[(\d+),(\d+),(\d+)\]/g; let mm;
  while ((mm = rre.exec(src))) RAMP[mm[1]] = [+mm[5], +mm[6], +mm[7]]; }
const satOf = c => { const mx = Math.max.apply(null, c), mn = Math.min.apply(null, c); return mx ? (mx - mn) / mx : 0; };
const valOf = c => Math.max.apply(null, c) / 255;
const CARD_SAT = 0.25, CARD_OUTER_LO = 0.15, CARD_OUTER_HI = 0.38, CARD_FLOOR = 0.08, CARD_CEIL = 0.92;
let satBad = [], outerBad = [], endsBad = [];
for (const n of BATCH) {
  const i = CAT.indexOf("n:'" + n + "'"); if (i < 0) continue;
  const row = CAT.slice(i, i + 320);
  const isOuter = row.indexOf("layer:'outer'") >= 0;
  const ramps = (row.match(/ramp:([A-Z][A-Z0-9_]*)/g) || []).map(x => x.slice(5));
  for (const rn of ramps) {
    const mid = RAMP[rn]; if (!mid) continue;
    if (satOf(mid) > CARD_SAT) satBad.push(n + ' on ' + rn + ' sat ' + satOf(mid).toFixed(3));
    if (isOuter && (valOf(mid) < CARD_OUTER_LO || valOf(mid) > CARD_OUTER_HI)) outerBad.push(n + ' on ' + rn + ' val ' + valOf(mid).toFixed(3));
    if (valOf(mid) < CARD_FLOOR || valOf(mid) > CARD_CEIL) endsBad.push(n + ' on ' + rn);
  }
}
ok('every garment in this batch sits inside the card\'s cloth saturation (<= 0.25)'
   + (satBad.length ? ' (' + satBad[0] + ')' : ''), satBad.length === 0);
ok('every OUTER garment in this batch sits in the card\'s runway-black value band'
   + (outerBad.length ? ' (' + outerBad[0] + ')' : ''), outerBad.length === 0);
ok('no ramp this batch spends touches a pure end (0.08-0.92)', endsBad.length === 0);
/* AND THE CARD'S OWN HEADLINE NUMBER, REPORTED EVERY RUN so a future batch cannot
   quietly push it back down. It is a REPORT, not a pass condition: this gate does
   not get to fail on garments that are not its batch's. */
{ let tot = 0, inside = 0;
  for (const line of CAT.split('\n')) {
    if (!/^\s*\{n:/.test(line) || !/st:.canon/.test(line) || /layer:.hair/.test(line)) continue;
    const rr = (line.match(/ramp:([A-Z][A-Z0-9_]*)/g) || []).map(x => x.slice(5));
    if (!rr.length) continue; tot++;
    const worst = Math.max.apply(null, rr.map(rn => RAMP[rn] ? satOf(RAMP[rn]) : 0));
    if (worst <= CARD_SAT) inside++; }
  console.log('  --- the card\'s headline: ' + inside + ' of ' + tot + ' canon garments at cloth saturation <= 0.25 = '
    + Math.round(100 * inside / tot) + '%  (the card measured 32% when it shipped) ---'); }

/* ---------- 8. THE LAWS THIS BATCH IS NOT ALLOWED TO BEND ---------------- */
/* THE 10% LONG-COAT CAP (8/27, "no matter what"). This batch adds no outer
   garment at all, so the share cannot have moved -- and the way to say that in a
   gate is to count, not to assert it in a comment. */
const outerLong = (CAT.match(/layer:'outer'[^}]*len:0\.[789]/g) || []).length;
const batchOuter = BATCH.filter(n => { const i = CAT.indexOf("n:'" + n + "'"); return i >= 0 && CAT.slice(i, i + 240).indexOf("layer:'outer'") >= 0; });
/* BATCH 2 DOES ADD COATS, so the claim gets sharper rather than weaker: every one
   of them must be SHORT. The 8/27 cap counts len>=0.70 and says "no matter what",
   and the reason is the heat, so a runway coat earns its look from the CUT and
   never from the length. Any batch coat at or past 0.70 fails here. */
const longBatchCoat = batchOuter.filter(n => { const i = CAT.indexOf("n:'" + n + "'");
  const m = CAT.slice(i, i + 240).match(/len:(0\.\d+)/); return m && parseFloat(m[1]) >= 0.70; });
ok('every coat in the runway batch is SHORT, so the 10% long-coat cap cannot have moved'
   + (longBatchCoat.length ? ' (' + longBatchCoat[0] + ')' : ''), longBatchCoat.length === 0);
ok('and none of them is tagged hard:true, because a short coat is not a reserved one',
   batchOuter.every(n => { const i = CAT.indexOf("n:'" + n + "'"); return CAT.slice(i, i + 240).indexOf('hard:true') < 0; }));
ok('long coats still exist and were not deleted to make a number look better', outerLong > 0);
/* COLOUR IS TERRITORY (8/26): this lane cooks CUT, never a faction's colour. Every
   ramp the batch spends must already have existed before it. */
const RAMPS = ['CHARCLOTH', 'BONECLO', 'STORMGRY', 'DUSTSAND', 'FADEDBLK', 'OLIVEDRAB', 'DENIM', 'SANDBOOT', 'BOOT', 'LEATHERV', 'ASHGREY'];
const invented = RAMPS.filter(r => src.indexOf('var ' + r + '=') < 0);
ok('the batch invents no colour: every ramp it spends was already in the file' + (invented.length ? ' (' + invented[0] + ')' : ''), invented.length === 0);

done();
